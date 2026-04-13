// backend/controllers/adminController.js
const bcrypt = require('bcryptjs');
const db = require('../../config/db').db;

const adminController = {
  // ==================== DOCTOR MANAGEMENT ====================

  // POST /api/admin/doctors
  async createDoctor(req, res) {
    try {
      const { full_name, title, department_id, specialty, phone, email, password, description, avatar_url } = req.body;

      if (!full_name || !email || !password) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin bắt buộc' });
      }

      const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
      if (existing.length > 0) {
        return res.status(400).json({ message: 'Email đã tồn tại trong hệ thống' });
      }

      const conn = await db.getConnection();
      try {
        await conn.beginTransaction();

        // Create doctor record
        const [doctorResult] = await conn.execute(
          `INSERT INTO doctors (name, title, department_id, specialty, phone, email, description, image, status) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
          [full_name, title || '', department_id || null, specialty || '', phone || '', email, description || '', avatar_url || '']
        );

        // Create user account
        const hashedPassword = await bcrypt.hash(password, 12);
        await conn.execute(
          `INSERT INTO users (email, password_hash, role, full_name, phone, avatar_url, doctor_id, is_active) 
           VALUES (?, ?, 'doctor', ?, ?, ?, ?, 1)`,
          [email, hashedPassword, full_name, phone || '', avatar_url || '', doctorResult.insertId]
        );

        await conn.commit();
        res.status(201).json({ message: 'Tạo bác sĩ thành công', doctorId: doctorResult.insertId });
      } catch (err) {
        await conn.rollback();
        throw err;
      } finally {
        conn.release();
      }
    } catch (error) {
      console.error('Create doctor error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // PUT /api/admin/doctors/:id
  async updateDoctor(req, res) {
    try {
      const { id } = req.params;
      const { name, title, department_id, specialty, phone, email, description, image } = req.body;

      await db.execute(
        `UPDATE doctors SET name=?, title=?, department_id=?, specialty=?, phone=?, email=?, description=?, image=? WHERE id=?`,
        [name, title || '', department_id || null, specialty || '', phone || '', email || '', description || '', image || '', id]
      );

      // Also update user record if exists
      await db.execute(
        `UPDATE users SET full_name=?, phone=?, avatar_url=? WHERE doctor_id=?`,
        [name, phone || '', image || '', id]
      );

      res.json({ message: 'Cập nhật bác sĩ thành công' });
    } catch (error) {
      console.error('Update doctor error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // DELETE /api/admin/doctors/:id (soft delete)
  async deleteDoctor(req, res) {
    try {
      const { id } = req.params;
      await db.execute("UPDATE doctors SET status = 'inactive' WHERE id = ?", [id]);
      await db.execute('UPDATE users SET is_active = 0 WHERE doctor_id = ?', [id]);
      res.json({ message: 'Đã ẩn bác sĩ' });
    } catch (error) {
      console.error('Delete doctor error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // PATCH /api/admin/doctors/:id/toggle
  async toggleDoctor(req, res) {
    try {
      const { id } = req.params;
      await db.execute("UPDATE doctors SET status = IF(status='active','inactive','active') WHERE id = ?", [id]);
      await db.execute("UPDATE users SET is_active = IF(is_active=1,0,1) WHERE doctor_id = ?", [id]);
      res.json({ message: 'Đã thay đổi trạng thái bác sĩ' });
    } catch (error) {
      console.error('Toggle doctor error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // ==================== APPOINTMENT MANAGEMENT ====================

  // GET /api/admin/appointments
  async getAppointments(req, res) {
    try {
      const { status, doctor_id, department_id, date, page = 1, limit = 20, search } = req.query;
      let query = `
        SELECT a.*, d.name as doctor_name, dep.name as department_name 
        FROM appointments a
        LEFT JOIN doctors d ON a.doctor_id = d.id
        LEFT JOIN departments dep ON a.department_id = dep.id
        WHERE 1=1
      `;
      const params = [];

      if (status) { query += ' AND a.status = ?'; params.push(status); }
      if (doctor_id) { query += ' AND a.doctor_id = ?'; params.push(doctor_id); }
      if (department_id) { query += ' AND a.department_id = ?'; params.push(department_id); }
      if (date) { query += ' AND DATE(a.appointment_date) = ?'; params.push(date); }
      if (search) {
        query += ' AND (a.patient_name LIKE ? OR a.patient_phone LIKE ? OR a.patient_email LIKE ?)';
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      // Count total
      const countQuery = query.replace(/SELECT .* FROM/, 'SELECT COUNT(*) as total FROM');
      const [countResult] = await db.execute(countQuery, params);
      const total = countResult[0].total;

      query += ' ORDER BY a.created_at DESC LIMIT ? OFFSET ?';
      params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

      const [appointments] = await db.execute(query, params);

      res.json({
        data: appointments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      console.error('Get appointments error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // GET /api/admin/appointments/:id
  async getAppointmentById(req, res) {
    try {
      const [appointments] = await db.execute(
        `SELECT a.*, d.name as doctor_name, dep.name as department_name 
         FROM appointments a
         LEFT JOIN doctors d ON a.doctor_id = d.id
         LEFT JOIN departments dep ON a.department_id = dep.id
         WHERE a.id = ?`,
        [req.params.id]
      );

      if (appointments.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy lịch hẹn' });
      }

      res.json({ data: appointments[0] });
    } catch (error) {
      console.error('Get appointment error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // PATCH /api/admin/appointments/:id/confirm
  async confirmAppointment(req, res) {
    try {
      const { id } = req.params;
      const { notes } = req.body;

      await db.execute(
        `UPDATE appointments SET status = 'confirmed', confirmed_at = NOW(), confirmed_by = ?, notes = ? WHERE id = ?`,
        [req.user.id, notes || null, id]
      );

      res.json({ message: 'Đã xác nhận lịch hẹn' });
    } catch (error) {
      console.error('Confirm appointment error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // PATCH /api/admin/appointments/:id/cancel
  async cancelAppointment(req, res) {
    try {
      const { id } = req.params;
      const { cancel_reason } = req.body;

      await db.execute(
        `UPDATE appointments SET status = 'cancelled', cancel_reason = ? WHERE id = ?`,
        [cancel_reason || 'Không có lý do', id]
      );

      res.json({ message: 'Đã hủy lịch hẹn' });
    } catch (error) {
      console.error('Cancel appointment error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // GET /api/admin/appointments/calendar
  async getAppointmentCalendar(req, res) {
    try {
      const { year, month } = req.query;
      const y = year || new Date().getFullYear();
      const m = month || new Date().getMonth() + 1;

      const [appointments] = await db.execute(
        `SELECT a.id, a.patient_name, a.appointment_date, a.appointment_time, a.status, 
                d.name as doctor_name
         FROM appointments a
         LEFT JOIN doctors d ON a.doctor_id = d.id
         WHERE YEAR(a.appointment_date) = ? AND MONTH(a.appointment_date) = ?
         ORDER BY a.appointment_date, a.appointment_time`,
        [y, m]
      );

      res.json({ data: appointments });
    } catch (error) {
      console.error('Calendar error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // ==================== PATIENT MANAGEMENT ====================

  // GET /api/admin/patients
  async getPatients(req, res) {
    try {
      const { page = 1, limit = 20, search } = req.query;
      let query = `
        SELECT u.id, u.email, u.full_name, u.phone, u.avatar_url, u.is_active, u.created_at, u.last_login,
               p.date_of_birth, p.gender, p.address, p.insurance_number, p.blood_type
        FROM users u
        LEFT JOIN patients p ON u.id = p.user_id
        WHERE u.role = 'patient'
      `;
      const params = [];

      if (search) {
        query += ' AND (u.full_name LIKE ? OR u.phone LIKE ? OR u.email LIKE ?)';
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      const countQuery = query.replace(/SELECT .* FROM/, 'SELECT COUNT(*) as total FROM');
      const [countResult] = await db.execute(countQuery, params);
      const total = countResult[0].total;

      query += ' ORDER BY u.created_at DESC LIMIT ? OFFSET ?';
      params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

      const [patients] = await db.execute(query, params);

      res.json({
        data: patients,
        pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) },
      });
    } catch (error) {
      console.error('Get patients error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // GET /api/admin/patients/:id
  async getPatientById(req, res) {
    try {
      const [patients] = await db.execute(
        `SELECT u.*, p.date_of_birth, p.gender, p.address, p.insurance_number, p.emergency_contact, p.blood_type, p.allergies
         FROM users u LEFT JOIN patients p ON u.id = p.user_id
         WHERE u.id = ? AND u.role = 'patient'`,
        [req.params.id]
      );

      if (patients.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy bệnh nhân' });
      }

      res.json({ data: patients[0] });
    } catch (error) {
      console.error('Get patient error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // GET /api/admin/patients/:id/appointments
  async getPatientAppointments(req, res) {
    try {
      const [appointments] = await db.execute(
        `SELECT a.*, d.name as doctor_name, dep.name as department_name
         FROM appointments a
         LEFT JOIN doctors d ON a.doctor_id = d.id
         LEFT JOIN departments dep ON a.department_id = dep.id
         WHERE a.patient_id = ? OR a.patient_email = (SELECT email FROM users WHERE id = ?)
         ORDER BY a.created_at DESC`,
        [req.params.id, req.params.id]
      );

      res.json({ data: appointments });
    } catch (error) {
      console.error('Get patient appointments error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // GET /api/admin/patients/:id/records
  async getPatientRecords(req, res) {
    try {
      const [records] = await db.execute(
        `SELECT mr.*, d.name as doctor_name
         FROM medical_records mr
         LEFT JOIN doctors d ON mr.doctor_id = d.id
         WHERE mr.patient_id = ?
         ORDER BY mr.created_at DESC`,
        [req.params.id]
      );

      // Get prescriptions for each record
      for (const record of records) {
        const [prescriptions] = await db.execute(
          `SELECT p.*, m.name as medicine_name, m.unit as medicine_unit
           FROM prescriptions p
           LEFT JOIN medicines m ON p.medicine_id = m.id
           WHERE p.record_id = ?`,
          [record.id]
        );
        record.prescriptions = prescriptions;
      }

      res.json({ data: records });
    } catch (error) {
      console.error('Get patient records error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // PATCH /api/admin/patients/:id/toggle
  async togglePatient(req, res) {
    try {
      await db.execute('UPDATE users SET is_active = IF(is_active=1,0,1) WHERE id = ? AND role = "patient"', [req.params.id]);
      res.json({ message: 'Đã thay đổi trạng thái tài khoản bệnh nhân' });
    } catch (error) {
      console.error('Toggle patient error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // ==================== DEPARTMENT MANAGEMENT ====================

  // POST /api/admin/departments
  async createDepartment(req, res) {
    try {
      const { name, description, image, display_order } = req.body;
      const [result] = await db.execute(
        'INSERT INTO departments (name, description, image, display_order, status) VALUES (?, ?, ?, ?, "active")',
        [name, description || '', image || '', display_order || 0]
      );
      res.status(201).json({ message: 'Tạo chuyên khoa thành công', id: result.insertId });
    } catch (error) {
      console.error('Create department error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // PUT /api/admin/departments/:id
  async updateDepartment(req, res) {
    try {
      const { name, description, image, display_order } = req.body;
      await db.execute(
        'UPDATE departments SET name=?, description=?, image=?, display_order=? WHERE id=?',
        [name, description || '', image || '', display_order || 0, req.params.id]
      );
      res.json({ message: 'Cập nhật chuyên khoa thành công' });
    } catch (error) {
      console.error('Update department error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // DELETE /api/admin/departments/:id
  async deleteDepartment(req, res) {
    try {
      await db.execute("UPDATE departments SET status = 'inactive' WHERE id = ?", [req.params.id]);
      res.json({ message: 'Đã ẩn chuyên khoa' });
    } catch (error) {
      console.error('Delete department error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // PATCH /api/admin/departments/reorder
  async reorderDepartments(req, res) {
    try {
      const { orders } = req.body; // [{id, display_order}]
      for (const item of orders) {
        await db.execute('UPDATE departments SET display_order = ? WHERE id = ?', [item.display_order, item.id]);
      }
      res.json({ message: 'Đã sắp xếp lại thứ tự chuyên khoa' });
    } catch (error) {
      console.error('Reorder error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // ==================== NEWS MANAGEMENT ====================

  // POST /api/admin/news
  async createNews(req, res) {
    try {
      const { title, slug, content, category, thumbnail, summary, published } = req.body;
      const autoSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const [result] = await db.execute(
        `INSERT INTO news (title, slug, content, category, thumbnail, summary, published, author_id, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [title, autoSlug, content || '', category || '', thumbnail || '', summary || '', published ? 1 : 0, req.user.id]
      );
      res.status(201).json({ message: 'Tạo bài viết thành công', id: result.insertId });
    } catch (error) {
      console.error('Create news error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // PUT /api/admin/news/:id
  async updateNews(req, res) {
    try {
      const { title, slug, content, category, thumbnail, summary } = req.body;
      await db.execute(
        'UPDATE news SET title=?, slug=?, content=?, category=?, thumbnail=?, summary=? WHERE id=?',
        [title, slug, content || '', category || '', thumbnail || '', summary || '', req.params.id]
      );
      res.json({ message: 'Cập nhật bài viết thành công' });
    } catch (error) {
      console.error('Update news error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // DELETE /api/admin/news/:id
  async deleteNews(req, res) {
    try {
      await db.execute('UPDATE news SET published = 0, deleted_at = NOW() WHERE id = ?', [req.params.id]);
      res.json({ message: 'Đã xóa bài viết' });
    } catch (error) {
      console.error('Delete news error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // PATCH /api/admin/news/:id/publish
  async togglePublishNews(req, res) {
    try {
      await db.execute('UPDATE news SET published = IF(published=1,0,1) WHERE id = ?', [req.params.id]);
      res.json({ message: 'Đã thay đổi trạng thái xuất bản' });
    } catch (error) {
      console.error('Publish news error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // ==================== USER MANAGEMENT (Super Admin only) ====================

  // GET /api/admin/users
  async getUsers(req, res) {
    try {
      const { page = 1, limit = 20, role, search } = req.query;
      let query = 'SELECT id, email, role, full_name, phone, avatar_url, is_active, last_login, created_at FROM users WHERE 1=1';
      const params = [];

      if (role) { query += ' AND role = ?'; params.push(role); }
      if (search) {
        query += ' AND (full_name LIKE ? OR email LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
      }

      const countQuery = query.replace(/SELECT .* FROM/, 'SELECT COUNT(*) as total FROM');
      const [countResult] = await db.execute(countQuery, params);
      const total = countResult[0].total;

      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

      const [users] = await db.execute(query, params);

      res.json({
        data: users,
        pagination: { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) },
      });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // POST /api/admin/users
  async createUser(req, res) {
    try {
      const { email, password, role, full_name, phone } = req.body;

      if (!email || !password || !role || !full_name) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
      }

      const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
      if (existing.length > 0) {
        return res.status(400).json({ message: 'Email đã tồn tại' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const [result] = await db.execute(
        'INSERT INTO users (email, password_hash, role, full_name, phone, is_active) VALUES (?, ?, ?, ?, ?, 1)',
        [email, hashedPassword, role, full_name, phone || '']
      );

      res.status(201).json({ message: 'Tạo tài khoản thành công', id: result.insertId });
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // PATCH /api/admin/users/:id/role
  async updateUserRole(req, res) {
    try {
      const { role } = req.body;
      await db.execute('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
      res.json({ message: 'Cập nhật quyền thành công' });
    } catch (error) {
      console.error('Update role error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // PATCH /api/admin/users/:id/toggle
  async toggleUser(req, res) {
    try {
      await db.execute('UPDATE users SET is_active = IF(is_active=1,0,1) WHERE id = ?', [req.params.id]);
      res.json({ message: 'Đã thay đổi trạng thái tài khoản' });
    } catch (error) {
      console.error('Toggle user error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // PATCH /api/admin/users/:id/reset-password
  async resetUserPassword(req, res) {
    try {
      const { newPassword } = req.body;
      const password = newPassword || 'NOH@2026';
      const hashedPassword = await bcrypt.hash(password, 12);
      await db.execute('UPDATE users SET password_hash = ? WHERE id = ?', [hashedPassword, req.params.id]);
      res.json({ message: 'Đã reset mật khẩu', temporaryPassword: password });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // ==================== MEDICINES MANAGEMENT ====================

  // GET /api/admin/medicines
  async getMedicines(req, res) {
    try {
      const { search, category } = req.query;
      let query = 'SELECT * FROM medicines WHERE 1=1';
      const params = [];

      if (search) { query += ' AND (name LIKE ? OR active_ingredient LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
      if (category) { query += ' AND category = ?'; params.push(category); }

      query += ' ORDER BY name ASC';
      const [medicines] = await db.execute(query, params);
      res.json({ data: medicines });
    } catch (error) {
      console.error('Get medicines error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // POST /api/admin/medicines
  async createMedicine(req, res) {
    try {
      const { name, active_ingredient, unit, category, description } = req.body;
      const [result] = await db.execute(
        'INSERT INTO medicines (name, active_ingredient, unit, category, description) VALUES (?, ?, ?, ?, ?)',
        [name, active_ingredient || '', unit, category || '', description || '']
      );
      res.status(201).json({ message: 'Thêm thuốc thành công', id: result.insertId });
    } catch (error) {
      console.error('Create medicine error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // PUT /api/admin/medicines/:id
  async updateMedicine(req, res) {
    try {
      const { name, active_ingredient, unit, category, description, is_active } = req.body;
      await db.execute(
        'UPDATE medicines SET name=?, active_ingredient=?, unit=?, category=?, description=?, is_active=? WHERE id=?',
        [name, active_ingredient || '', unit, category || '', description || '', is_active !== undefined ? is_active : 1, req.params.id]
      );
      res.json({ message: 'Cập nhật thuốc thành công' });
    } catch (error) {
      console.error('Update medicine error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
};

module.exports = adminController;
