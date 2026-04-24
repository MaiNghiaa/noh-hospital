// backend/controllers/doctorController.js
const db = require('../../config/db').db;
const emailService = require('../../utils/emailService');

const doctorController = {
  // GET /api/doctor/appointments
  async getMyAppointments(req, res) {
    try {
      const doctorId = req.user.doctor_id;
      if (!doctorId) {
        return res.status(403).json({ message: 'Tài khoản không liên kết với bác sĩ nào' });
      }

      const { date, status, page = 1, limit = 20 } = req.query;
      const pageInt = Number.parseInt(page, 10);
      const limitInt = Number.parseInt(limit, 10);
      const safePage = Number.isFinite(pageInt) && pageInt > 0 ? pageInt : 1;
      const safeLimit = Number.isFinite(limitInt) && limitInt > 0 ? Math.min(limitInt, 100) : 20;
      const offset = (safePage - 1) * safeLimit;

      let query = `
        SELECT a.*,
               COALESCE(dep.name, a.department) as department_name
        FROM appointments a
        LEFT JOIN doctors d ON a.doctor_id = d.id
        LEFT JOIN departments dep ON d.department_id = dep.id
        WHERE a.doctor_id = ?
      `;
      const params = [doctorId];

      if (date) { query += ' AND DATE(a.appointment_date) = ?'; params.push(date); }
      if (status) { query += ' AND a.status = ?'; params.push(status); }

      query += ` ORDER BY a.appointment_date DESC, a.appointment_time DESC LIMIT ${safeLimit} OFFSET ${offset}`;

      const [appointments] = await db.execute(query, params);
      res.json({ data: appointments });
    } catch (error) {
      console.error('Doctor appointments error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // PATCH /api/doctor/appointments/:id/start
  async startAppointment(req, res) {
    try {
      const doctorId = req.user.doctor_id;
      const { id } = req.params;
      if (!doctorId) {
        return res.status(403).json({ message: 'Tài khoản không liên kết với bác sĩ nào' });
      }

      const [rows] = await db.execute(
        `SELECT id, status, doctor_id
         FROM appointments
         WHERE id = ? AND doctor_id = ?`,
        [id, doctorId]
      );
      if (rows.length === 0) return res.status(404).json({ message: 'Không tìm thấy lịch hẹn' });
      const appt = rows[0];
      if (appt.status !== 'confirmed') {
        return res.status(400).json({ message: 'Chỉ có thể chuyển sang "đang khám" khi lịch đã xác nhận' });
      }

      // Guard: only one in_progress per doctor
      const [inProgress] = await db.execute(
        "SELECT id FROM appointments WHERE doctor_id = ? AND status = 'in_progress' AND id <> ? LIMIT 1",
        [doctorId, id]
      );
      if (inProgress.length > 0) {
        return res.status(409).json({
          message: 'Bác sĩ đang khám một lịch hẹn khác. Vui lòng hoàn thành/hủy lịch hẹn đang khám trước.',
        });
      }

      await db.execute("UPDATE appointments SET status = 'in_progress' WHERE id = ? AND doctor_id = ?", [id, doctorId]);
      res.json({ message: 'Đã chuyển lịch sang trạng thái đang khám' });
    } catch (error) {
      console.error('Start appointment error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // PATCH /api/doctor/appointments/:id/complete
  async completeAppointment(req, res) {
    try {
      const doctorId = req.user.doctor_id;
      const { id } = req.params;
      if (!doctorId) {
        return res.status(403).json({ message: 'Tài khoản không liên kết với bác sĩ nào' });
      }

      const [rows] = await db.execute(
        `SELECT id, status
         FROM appointments
         WHERE id = ? AND doctor_id = ?`,
        [id, doctorId]
      );
      if (rows.length === 0) return res.status(404).json({ message: 'Không tìm thấy lịch hẹn' });
      if (rows[0].status !== 'in_progress') {
        return res.status(400).json({ message: 'Chỉ có thể hoàn thành khi lịch đang khám' });
      }

      // Require at least one medical record for this appointment
      const [records] = await db.execute(
        `SELECT * FROM medical_records WHERE appointment_id = ? AND doctor_id = ? LIMIT 1`,
        [id, doctorId]
      );
      if (records.length === 0) {
        return res.status(400).json({ message: 'Vui lòng nhập kết quả khám trước khi hoàn thành' });
      }

      await db.execute("UPDATE appointments SET status = 'completed' WHERE id = ? AND doctor_id = ?", [id, doctorId]);
      res.json({ message: 'Đã chuyển lịch sang trạng thái hoàn thành' });

      // ASYNC EMAIL SENDING LOGIC
      try {
        const [appts] = await db.execute(
          `SELECT a.email, a.full_name, a.appointment_date, a.department as department_name, d.name as doctor_name
           FROM appointments a
           LEFT JOIN doctors d ON a.doctor_id = d.id
           WHERE a.id = ?`,
          [id]
        );

        if (appts.length > 0 && appts[0].email) {
          const appointmentData = appts[0];
          const recordData = records[0];

          // Fetch prescriptions
          const [prescriptions] = await db.execute(
            `SELECT p.*, m.name as medicine_name, m.unit as medicine_unit, m.active_ingredient 
             FROM prescriptions p 
             JOIN medicines m ON p.medicine_id = m.id 
             WHERE p.record_id = ?`,
            [recordData.id]
          );

          // Fire and forget email sending
          emailService.sendMedicalRecordEmail(
            appointmentData.email,
            appointmentData,
            recordData,
            prescriptions
          ).catch(console.error);
        }
      } catch (err) {
        console.error('Error in async email sending logic:', err);
      }
    } catch (error) {
      console.error('Complete appointment error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // POST /api/doctor/records
  async createRecord(req, res) {
    try {
      const doctorId = req.user.doctor_id;
      const { appointment_id, patient_id, symptoms, diagnosis, treatment, notes, follow_up_date } = req.body;

      if (!diagnosis) {
        return res.status(400).json({ message: 'Vui lòng nhập chẩn đoán' });
      }

      const appointmentId = appointment_id ? Number(appointment_id) : null;
      if (!appointmentId || !Number.isFinite(appointmentId)) {
        return res.status(400).json({ message: 'Thiếu appointment_id' });
      }

      if (!doctorId) {
        return res.status(403).json({ message: 'Tài khoản không liên kết với bác sĩ nào' });
      }

      const [apptRows] = await db.execute(
        `SELECT id, doctor_id, patient_id, email
         FROM appointments
         WHERE id = ? AND doctor_id = ?
         LIMIT 1`,
        [appointmentId, doctorId]
      );
      if (apptRows.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy lịch hẹn' });
      }

      let resolvedPatientId = patient_id ? Number(patient_id) : null;
      if (!resolvedPatientId || !Number.isFinite(resolvedPatientId)) {
        resolvedPatientId = apptRows[0].patient_id ? Number(apptRows[0].patient_id) : null;
      }

      if (!resolvedPatientId && apptRows[0].email) {
        const [[p]] = await db.execute(
          `SELECT p.id
           FROM users u
           JOIN patients p ON p.user_id = u.id
           WHERE u.email = ? AND u.role = 'patient'
           LIMIT 1`,
          [apptRows[0].email]
        );
        resolvedPatientId = p?.id || null;
      }

      if (!resolvedPatientId) {
        return res.status(400).json({ message: 'Không xác định được bệnh nhân cho lịch hẹn này' });
      }

      const [result] = await db.execute(
        `INSERT INTO medical_records (appointment_id, patient_id, doctor_id, symptoms, diagnosis, treatment, notes, follow_up_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [appointmentId, resolvedPatientId, doctorId, symptoms || '', diagnosis, treatment || '', notes || '', follow_up_date || null]
      );

      // Update appointment status to in_progress or completed
      if (appointmentId) {
        // Guard: 1 bác sĩ chỉ được "đang khám" 1 lịch hẹn tại 1 thời điểm
        const [inProgress] = await db.execute(
          "SELECT id FROM appointments WHERE doctor_id = ? AND status = 'in_progress' AND id <> ? LIMIT 1",
          [doctorId, appointmentId]
        );
        if (inProgress.length > 0) {
          return res.status(409).json({
            message: 'Bác sĩ đang khám một lịch hẹn khác. Vui lòng hoàn thành/hủy lịch hẹn đang khám trước.',
          });
        }
        await db.execute("UPDATE appointments SET status = 'in_progress' WHERE id = ? AND status = 'confirmed'", [appointmentId]);
      }

      res.status(201).json({ message: 'Tạo hồ sơ bệnh án thành công', recordId: result.insertId });
    } catch (error) {
      console.error('Create record error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // PUT /api/doctor/records/:id
  async updateRecord(req, res) {
    try {
      const { symptoms, diagnosis, treatment, notes, follow_up_date } = req.body;

      await db.execute(
        `UPDATE medical_records SET symptoms=?, diagnosis=?, treatment=?, notes=?, follow_up_date=? WHERE id=? AND doctor_id=?`,
        [symptoms || '', diagnosis, treatment || '', notes || '', follow_up_date || null, req.params.id, req.user.doctor_id]
      );

      res.json({ message: 'Cập nhật hồ sơ bệnh án thành công' });
    } catch (error) {
      console.error('Update record error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // POST /api/doctor/prescriptions
  async createPrescription(req, res) {
    try {
      const { record_id, items } = req.body;
      // items = [{medicine_id, quantity, dosage, duration_days, instruction}]

      if (!record_id || !items || items.length === 0) {
        return res.status(400).json({ message: 'Vui lòng chọn ít nhất một loại thuốc' });
      }

      const conn = await db.getConnection();
      try {
        await conn.beginTransaction();

        for (const item of items) {
          const medicineId = Number(item.medicine_id);
          const qty = Number(item.quantity) || 1;
          if (!medicineId) {
            throw new Error('Thiếu medicine_id');
          }
          if (qty <= 0) {
            throw new Error('Số lượng thuốc không hợp lệ');
          }

          const [[med]] = await conn.execute(
            'SELECT id, name, stock_quantity FROM medicines WHERE id = ? AND is_active = 1 LIMIT 1',
            [medicineId]
          );
          if (!med) {
            throw new Error('Thuốc không tồn tại hoặc đã ngừng hoạt động');
          }
          if ((med.stock_quantity ?? 0) < qty) {
            throw new Error(`Thuốc "${med.name}" không đủ tồn kho`);
          }

          await conn.execute(
            `INSERT INTO prescriptions (record_id, medicine_id, quantity, dosage, duration_days, instruction)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [record_id, medicineId, qty, item.dosage, item.duration_days || null, item.instruction || '']
          );

          await conn.execute(
            'UPDATE medicines SET stock_quantity = stock_quantity - ? WHERE id = ?',
            [qty, medicineId]
          );
        }

        await conn.commit();
      } catch (e) {
        await conn.rollback();
        throw e;
      } finally {
        conn.release();
      }

      res.status(201).json({ message: 'Kê đơn thuốc thành công' });
    } catch (error) {
      console.error('Create prescription error:', error);
      res.status(500).json({ message: error.message || 'Lỗi server' });
    }
  },

  // POST /api/doctor/medicines (quick add)
  async quickCreateMedicine(req, res) {
    try {
      const { name, unit, active_ingredient, category, description } = req.body;
      if (!name || !String(name).trim()) {
        return res.status(400).json({ message: 'Vui lòng nhập tên thuốc' });
      }
      const safeUnit = unit && String(unit).trim() ? String(unit).trim() : 'viên';
      const safeCategory = category && String(category).trim() ? String(category).trim() : 'Bổ sung nhanh';

      const [result] = await db.execute(
        'INSERT INTO medicines (name, active_ingredient, unit, category, description, stock_quantity, is_active) VALUES (?, ?, ?, ?, ?, 0, 1)',
        [String(name).trim(), active_ingredient || '', safeUnit, safeCategory, description || '']
      );
      res.status(201).json({ message: 'Đã thêm thuốc', id: result.insertId });
    } catch (error) {
      console.error('Quick create medicine error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // GET /api/doctor/dashboard
  async getDashboard(req, res) {
    try {
      const doctorId = req.user.doctor_id;

      const [[{ todayCount }]] = await db.execute(
        "SELECT COUNT(*) as todayCount FROM appointments WHERE doctor_id = ? AND DATE(appointment_date) = CURDATE()",
        [doctorId]
      );
      const [[{ weekCount }]] = await db.execute(
        "SELECT COUNT(*) as weekCount FROM appointments WHERE doctor_id = ? AND YEARWEEK(appointment_date) = YEARWEEK(CURDATE())",
        [doctorId]
      );
      const [[{ pendingCount }]] = await db.execute(
        "SELECT COUNT(*) as pendingCount FROM appointments WHERE doctor_id = ? AND status = 'confirmed'",
        [doctorId]
      );
      const [[{ completedCount }]] = await db.execute(
        "SELECT COUNT(*) as completedCount FROM appointments WHERE doctor_id = ? AND status = 'completed' AND MONTH(appointment_date) = MONTH(CURDATE())",
        [doctorId]
      );

      const [todayAppointments] = await db.execute(
        `SELECT a.*,
                COALESCE(dep.name, a.department) as department_name
         FROM appointments a
         LEFT JOIN doctors d ON a.doctor_id = d.id
         LEFT JOIN departments dep ON d.department_id = dep.id
         WHERE a.doctor_id = ? AND DATE(a.appointment_date) = CURDATE()
         ORDER BY a.appointment_time ASC`,
        [doctorId]
      );

      res.json({
        data: {
          stats: { todayCount, weekCount, pendingCount, completedCount },
          todayAppointments,
        },
      });
    } catch (error) {
      console.error('Doctor dashboard error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
};

module.exports = doctorController;
