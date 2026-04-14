// backend/controllers/user/patientController.js
// API cho bệnh nhân: lịch hẹn, hồ sơ bệnh án, đơn thuốc
const { db } = require('../../config/db');

const patientController = {
  // ─── GET /api/user/appointments ───
  // Lấy danh sách lịch hẹn của bệnh nhân đã đăng nhập
  async getMyAppointments(req, res) {
    try {
      const userId = req.user.id;

      // Lấy patient_id từ user_id
      const [patients] = await db.execute('SELECT id FROM patients WHERE user_id = ?', [userId]);
      if (patients.length === 0) {
        return res.json({ success: true, data: [] });
      }
      const patientId = patients[0].id;

      const [rows] = await db.execute(
        `SELECT a.*, d.name as doctor_name, d.title as doctor_title, d.image as doctor_image,
                dep.name as department_name
         FROM appointments a
         LEFT JOIN doctors d ON a.doctor_id = d.id
         LEFT JOIN departments dep ON d.department_id = dep.id
         WHERE a.patient_id = ?
         ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
        [patientId]
      );

      res.json({ success: true, data: rows });
    } catch (error) {
      console.error('Get my appointments error:', error);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  },

  // ─── POST /api/user/appointments ───
  // Đặt lịch khám mới (khi đã đăng nhập)
  async createAppointment(req, res) {
    try {
      const userId = req.user.id;
      const { department, doctor_id, appointment_date, appointment_time, reason } = req.body;

      if (!department || !appointment_date) {
        return res.status(400).json({ success: false, message: 'Vui lòng chọn chuyên khoa và ngày khám' });
      }

      const pickedDoctorId = doctor_id ? Number(doctor_id) : null;

      // Lấy thông tin user + patient
      const [users] = await db.execute('SELECT full_name, phone, email FROM users WHERE id = ?', [userId]);
      const [patients] = await db.execute('SELECT id FROM patients WHERE user_id = ?', [userId]);

      if (users.length === 0) {
        return res.status(400).json({ success: false, message: 'Không tìm thấy thông tin người dùng' });
      }

      const user = users[0];
      const patientId = patients.length > 0 ? patients[0].id : null;

      const [result] = await db.execute(
        `INSERT INTO appointments (full_name, phone, email, department, doctor_id, appointment_date, appointment_time, reason, patient_id, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
        [user.full_name, user.phone, user.email, department, pickedDoctorId || null, appointment_date, appointment_time || null, reason || null, patientId]
      );

      res.status(201).json({
        success: true,
        message: 'Đặt lịch khám thành công. Bệnh viện sẽ xác nhận lịch hẹn sớm.',
        data: { id: result.insertId },
      });
    } catch (error) {
      console.error('Create appointment error:', error);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  },

  // ─── GET /api/user/appointments/:id ───
  async getAppointmentDetail(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const [patients] = await db.execute('SELECT id FROM patients WHERE user_id = ?', [userId]);
      if (patients.length === 0) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy lịch hẹn' });
      }

      const [rows] = await db.execute(
        `SELECT a.*, d.name as doctor_name, d.title as doctor_title, d.specialty as doctor_specialty,
                d.image as doctor_image, dep.name as department_name
         FROM appointments a
         LEFT JOIN doctors d ON a.doctor_id = d.id
         LEFT JOIN departments dep ON d.department_id = dep.id
         WHERE a.id = ? AND a.patient_id = ?`,
        [id, patients[0].id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy lịch hẹn' });
      }

      res.json({ success: true, data: rows[0] });
    } catch (error) {
      console.error('Get appointment detail error:', error);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  },

  // ─── PATCH /api/user/appointments/:id/cancel ───
  async cancelAppointment(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { reason } = req.body;

      const [patients] = await db.execute('SELECT id FROM patients WHERE user_id = ?', [userId]);
      if (patients.length === 0) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy lịch hẹn' });
      }

      const [rows] = await db.execute(
        `SELECT * FROM appointments WHERE id = ? AND patient_id = ? AND status IN ('pending', 'confirmed')`,
        [id, patients[0].id]
      );

      if (rows.length === 0) {
        return res.status(400).json({ success: false, message: 'Không thể hủy lịch hẹn này' });
      }

      await db.execute(
        `UPDATE appointments SET status = 'cancelled', cancel_reason = ? WHERE id = ?`,
        [reason || 'Bệnh nhân tự hủy', id]
      );

      res.json({ success: true, message: 'Đã hủy lịch hẹn' });
    } catch (error) {
      console.error('Cancel appointment error:', error);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  },

  // ─── GET /api/user/medical-records ───
  // Lấy hồ sơ bệnh án của bệnh nhân
  async getMyRecords(req, res) {
    try {
      const userId = req.user.id;

      const [patients] = await db.execute('SELECT id FROM patients WHERE user_id = ?', [userId]);
      if (patients.length === 0) {
        return res.json({ success: true, data: [] });
      }

      const [rows] = await db.execute(
        `SELECT mr.*, d.name as doctor_name, d.title as doctor_title,
                dep.name as department_name
         FROM medical_records mr
         LEFT JOIN doctors d ON mr.doctor_id = d.id
         LEFT JOIN departments dep ON d.department_id = dep.id
         WHERE mr.patient_id = ?
         ORDER BY mr.created_at DESC`,
        [patients[0].id]
      );

      res.json({ success: true, data: rows });
    } catch (error) {
      console.error('Get my records error:', error);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  },

  // ─── GET /api/user/medical-records/:id ───
  async getRecordDetail(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const [patients] = await db.execute('SELECT id FROM patients WHERE user_id = ?', [userId]);
      if (patients.length === 0) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ' });
      }

      const [rows] = await db.execute(
        `SELECT mr.*, d.name as doctor_name, d.title as doctor_title, d.specialty as doctor_specialty,
                dep.name as department_name
         FROM medical_records mr
         LEFT JOIN doctors d ON mr.doctor_id = d.id
         LEFT JOIN departments dep ON d.department_id = dep.id
         WHERE mr.id = ? AND mr.patient_id = ?`,
        [id, patients[0].id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ bệnh án' });
      }

      // Lấy đơn thuốc
      const [prescriptions] = await db.execute(
        `SELECT p.*, m.name as medicine_name, m.unit as medicine_unit, m.active_ingredient
         FROM prescriptions p
         LEFT JOIN medicines m ON p.medicine_id = m.id
         WHERE p.record_id = ?
         ORDER BY p.id`,
        [id]
      );

      res.json({
        success: true,
        data: { ...rows[0], prescriptions },
      });
    } catch (error) {
      console.error('Get record detail error:', error);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  },

  // ─── GET /api/user/prescriptions ───
  // Lấy tất cả đơn thuốc
  async getMyPrescriptions(req, res) {
    try {
      const userId = req.user.id;

      const [patients] = await db.execute('SELECT id FROM patients WHERE user_id = ?', [userId]);
      if (patients.length === 0) {
        return res.json({ success: true, data: [] });
      }

      const [rows] = await db.execute(
        `SELECT mr.id as record_id, mr.diagnosis, mr.created_at as record_date,
                d.name as doctor_name, d.title as doctor_title,
                dep.name as department_name,
                GROUP_CONCAT(
                  CONCAT(m.name, ' - ', p.dosage, ' x ', p.duration_days, ' ngày')
                  SEPARATOR '; '
                ) as medicines_summary
         FROM medical_records mr
         LEFT JOIN doctors d ON mr.doctor_id = d.id
         LEFT JOIN departments dep ON d.department_id = dep.id
         LEFT JOIN prescriptions p ON p.record_id = mr.id
         LEFT JOIN medicines m ON p.medicine_id = m.id
         WHERE mr.patient_id = ?
         GROUP BY mr.id
         ORDER BY mr.created_at DESC`,
        [patients[0].id]
      );

      res.json({ success: true, data: rows });
    } catch (error) {
      console.error('Get my prescriptions error:', error);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  },

  // ─── GET /api/user/dashboard ───
  // Dashboard summary cho bệnh nhân
  async getDashboard(req, res) {
    try {
      const userId = req.user.id;

      const [patients] = await db.execute('SELECT id FROM patients WHERE user_id = ?', [userId]);
      if (patients.length === 0) {
        return res.json({
          success: true,
          data: { totalAppointments: 0, upcomingAppointments: 0, totalRecords: 0, recentAppointments: [] },
        });
      }

      const patientId = patients[0].id;

      const [[{ totalAppointments }]] = await db.execute(
        'SELECT COUNT(*) as totalAppointments FROM appointments WHERE patient_id = ?',
        [patientId]
      );

      const [[{ upcomingAppointments }]] = await db.execute(
        `SELECT COUNT(*) as upcomingAppointments FROM appointments WHERE patient_id = ? AND appointment_date >= CURDATE() AND status IN ('pending', 'confirmed')`,
        [patientId]
      );

      const [[{ totalRecords }]] = await db.execute(
        'SELECT COUNT(*) as totalRecords FROM medical_records WHERE patient_id = ?',
        [patientId]
      );

      const [recentAppointments] = await db.execute(
        `SELECT a.id, a.department, a.appointment_date, a.appointment_time, a.status,
                d.name as doctor_name
         FROM appointments a
         LEFT JOIN doctors d ON a.doctor_id = d.id
         WHERE a.patient_id = ?
         ORDER BY a.appointment_date DESC
         LIMIT 5`,
        [patientId]
      );

      res.json({
        success: true,
        data: { totalAppointments, upcomingAppointments, totalRecords, recentAppointments },
      });
    } catch (error) {
      console.error('Get dashboard error:', error);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  },
};

module.exports = patientController;
