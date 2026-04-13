// backend/controllers/doctorController.js
const db = require('../../config/db').db;

const doctorController = {
  // GET /api/doctor/appointments
  async getMyAppointments(req, res) {
    try {
      const doctorId = req.user.doctor_id;
      if (!doctorId) {
        return res.status(403).json({ message: 'Tài khoản không liên kết với bác sĩ nào' });
      }

      const { date, status, page = 1, limit = 20 } = req.query;
      let query = `
        SELECT a.*, dep.name as department_name
        FROM appointments a
        LEFT JOIN departments dep ON a.department_id = dep.id
        WHERE a.doctor_id = ?
      `;
      const params = [doctorId];

      if (date) { query += ' AND DATE(a.appointment_date) = ?'; params.push(date); }
      if (status) { query += ' AND a.status = ?'; params.push(status); }

      query += ' ORDER BY a.appointment_date DESC, a.appointment_time DESC LIMIT ? OFFSET ?';
      params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

      const [appointments] = await db.execute(query, params);
      res.json({ data: appointments });
    } catch (error) {
      console.error('Doctor appointments error:', error);
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

      const [result] = await db.execute(
        `INSERT INTO medical_records (appointment_id, patient_id, doctor_id, symptoms, diagnosis, treatment, notes, follow_up_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [appointment_id || null, patient_id, doctorId, symptoms || '', diagnosis, treatment || '', notes || '', follow_up_date || null]
      );

      // Update appointment status to in_progress or completed
      if (appointment_id) {
        // Guard: 1 bác sĩ chỉ được "đang khám" 1 lịch hẹn tại 1 thời điểm
        const [inProgress] = await db.execute(
          "SELECT id FROM appointments WHERE doctor_id = ? AND status = 'in_progress' AND id <> ? LIMIT 1",
          [doctorId, appointment_id]
        );
        if (inProgress.length > 0) {
          return res.status(409).json({
            message: 'Bác sĩ đang khám một lịch hẹn khác. Vui lòng hoàn thành/hủy lịch hẹn đang khám trước.',
          });
        }
        await db.execute("UPDATE appointments SET status = 'in_progress' WHERE id = ? AND status = 'confirmed'", [appointment_id]);
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

      for (const item of items) {
        await db.execute(
          `INSERT INTO prescriptions (record_id, medicine_id, quantity, dosage, duration_days, instruction)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [record_id, item.medicine_id, item.quantity, item.dosage, item.duration_days || null, item.instruction || '']
        );
      }

      // Mark appointment as completed
      const [records] = await db.execute('SELECT appointment_id FROM medical_records WHERE id = ?', [record_id]);
      if (records.length > 0 && records[0].appointment_id) {
        await db.execute("UPDATE appointments SET status = 'completed' WHERE id = ?", [records[0].appointment_id]);
      }

      res.status(201).json({ message: 'Kê đơn thuốc thành công' });
    } catch (error) {
      console.error('Create prescription error:', error);
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
        "SELECT COUNT(*) as pendingCount FROM appointments WHERE doctor_id = ? AND status = 'pending'",
        [doctorId]
      );
      const [[{ completedCount }]] = await db.execute(
        "SELECT COUNT(*) as completedCount FROM appointments WHERE doctor_id = ? AND status = 'completed' AND MONTH(appointment_date) = MONTH(CURDATE())",
        [doctorId]
      );

      const [todayAppointments] = await db.execute(
        `SELECT a.*, dep.name as department_name
         FROM appointments a
         LEFT JOIN departments dep ON a.department_id = dep.id
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
