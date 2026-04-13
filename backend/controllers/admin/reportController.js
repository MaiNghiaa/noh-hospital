// backend/controllers/reportController.js
const db = require('../../config/db').db;

const reportController = {
  // GET /api/admin/stats/overview
  async getOverview(req, res) {
    try {
      const [[{ totalPatients }]] = await db.execute("SELECT COUNT(*) as totalPatients FROM users WHERE role = 'patient'");
      const [[{ totalDoctors }]] = await db.execute("SELECT COUNT(*) as totalDoctors FROM doctors WHERE status = 'active'");
      const [[{ totalAppointments }]] = await db.execute('SELECT COUNT(*) as totalAppointments FROM appointments');
      const [[{ totalDepartments }]] = await db.execute("SELECT COUNT(*) as totalDepartments FROM departments WHERE status = 'active'");
      const [[{ pendingAppointments }]] = await db.execute("SELECT COUNT(*) as pendingAppointments FROM appointments WHERE status = 'pending'");
      const [[{ todayAppointments }]] = await db.execute("SELECT COUNT(*) as todayAppointments FROM appointments WHERE DATE(appointment_date) = CURDATE()");

      res.json({
        data: { totalPatients, totalDoctors, totalAppointments, totalDepartments, pendingAppointments, todayAppointments },
      });
    } catch (error) {
      console.error('Stats overview error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // GET /api/admin/stats/appointments?year=2026
  async getAppointmentStats(req, res) {
    try {
      const year = req.query.year || new Date().getFullYear();
      const [data] = await db.execute(
        `SELECT MONTH(appointment_date) as month, COUNT(*) as count 
         FROM appointments 
         WHERE YEAR(appointment_date) = ?
         GROUP BY MONTH(appointment_date) ORDER BY month`,
        [year]
      );

      // Fill all 12 months
      const result = Array.from({ length: 12 }, (_, i) => {
        const found = data.find((d) => d.month === i + 1);
        return { month: i + 1, count: found ? found.count : 0 };
      });

      res.json({ data: result });
    } catch (error) {
      console.error('Appointment stats error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // GET /api/admin/stats/by-department
  async getByDepartment(req, res) {
    try {
      const year = req.query.year || new Date().getFullYear();
      const [data] = await db.execute(
        `SELECT dep.name, COUNT(a.id) as count 
         FROM appointments a
         LEFT JOIN departments dep ON a.department_id = dep.id
         WHERE YEAR(a.appointment_date) = ?
         GROUP BY dep.name ORDER BY count DESC`,
        [year]
      );
      res.json({ data });
    } catch (error) {
      console.error('By department error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // GET /api/admin/stats/by-status
  async getByStatus(req, res) {
    try {
      const year = req.query.year || new Date().getFullYear();
      const [data] = await db.execute(
        `SELECT status, COUNT(*) as count 
         FROM appointments 
         WHERE YEAR(appointment_date) = ?
         GROUP BY status`,
        [year]
      );
      res.json({ data });
    } catch (error) {
      console.error('By status error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // GET /api/admin/stats/top-doctors
  async getTopDoctors(req, res) {
    try {
      const limit = req.query.limit || 10;
      const year = req.query.year || new Date().getFullYear();
      const [data] = await db.execute(
        `SELECT d.name, d.title, dep.name as department, COUNT(a.id) as appointment_count
         FROM doctors d
         LEFT JOIN appointments a ON d.id = a.doctor_id AND YEAR(a.appointment_date) = ?
         LEFT JOIN departments dep ON d.department_id = dep.id
         WHERE d.status = 'active'
         GROUP BY d.id ORDER BY appointment_count DESC LIMIT ?`,
        [year, parseInt(limit)]
      );
      res.json({ data });
    } catch (error) {
      console.error('Top doctors error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // GET /api/admin/stats/patients-growth
  async getPatientsGrowth(req, res) {
    try {
      const year = req.query.year || new Date().getFullYear();
      const [data] = await db.execute(
        `SELECT MONTH(created_at) as month, COUNT(*) as count 
         FROM users 
         WHERE role = 'patient' AND YEAR(created_at) = ?
         GROUP BY MONTH(created_at) ORDER BY month`,
        [year]
      );

      const result = Array.from({ length: 12 }, (_, i) => {
        const found = data.find((d) => d.month === i + 1);
        return { month: i + 1, count: found ? found.count : 0 };
      });

      res.json({ data: result });
    } catch (error) {
      console.error('Patient growth error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // GET /api/admin/stats/patients (total count)
  async getPatientCount(req, res) {
    try {
      const [[{ count }]] = await db.execute("SELECT COUNT(*) as count FROM users WHERE role = 'patient'");
      res.json({ data: { count } });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // GET /api/admin/stats/appointments/today
  async getTodayAppointments(req, res) {
    try {
      const [[{ count }]] = await db.execute("SELECT COUNT(*) as count FROM appointments WHERE DATE(appointment_date) = CURDATE()");
      res.json({ data: { count } });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // GET /api/admin/stats/doctors/active
  async getActiveDoctors(req, res) {
    try {
      const [[{ count }]] = await db.execute("SELECT COUNT(*) as count FROM doctors WHERE status = 'active'");
      res.json({ data: { count } });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // GET /api/admin/stats/appointments/pending
  async getPendingAppointments(req, res) {
    try {
      const [[{ count }]] = await db.execute("SELECT COUNT(*) as count FROM appointments WHERE status = 'pending'");
      res.json({ data: { count } });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // GET /api/admin/stats/appointments/monthly
  async getMonthlyAppointments(req, res) {
    try {
      const [[{ count }]] = await db.execute(
        "SELECT COUNT(*) as count FROM appointments WHERE MONTH(appointment_date) = MONTH(CURDATE()) AND YEAR(appointment_date) = YEAR(CURDATE())"
      );
      res.json({ data: { count } });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // GET /api/admin/stats/departments
  async getDepartmentCount(req, res) {
    try {
      const [[{ count }]] = await db.execute("SELECT COUNT(*) as count FROM departments WHERE status = 'active'");
      res.json({ data: { count } });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // GET /api/admin/stats/recent-appointments
  async getRecentAppointments(req, res) {
    try {
      const [data] = await db.execute(
        `SELECT a.*, d.name as doctor_name, dep.name as department_name
         FROM appointments a
         LEFT JOIN doctors d ON a.doctor_id = d.id
         LEFT JOIN departments dep ON a.department_id = dep.id
         ORDER BY a.created_at DESC LIMIT 10`
      );
      res.json({ data });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
};

module.exports = reportController;
