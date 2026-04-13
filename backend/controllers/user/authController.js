// backend/controllers/user/authController.js
// Xác thực cho bệnh nhân (đăng ký, đăng nhập, profile)
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'noh_hospital_secret_2026';
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '1h';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || '7d';

function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, full_name: user.full_name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

function generateRefreshToken(user) {
  return jwt.sign({ id: user.id, type: 'refresh' }, JWT_SECRET, { expiresIn: REFRESH_EXPIRES });
}

const userAuthController = {
  // ─── POST /api/user/auth/register ───
  async register(req, res) {
    try {
      const { full_name, email, password, phone, date_of_birth, gender, address } = req.body;

      if (!full_name || !email || !password || !phone) {
        return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin bắt buộc (họ tên, email, mật khẩu, SĐT)' });
      }

      if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự' });
      }

      // Check duplicate email
      const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
      if (existing.length > 0) {
        return res.status(400).json({ success: false, message: 'Email đã được đăng ký. Vui lòng sử dụng email khác.' });
      }

      // Check duplicate phone
      const [existingPhone] = await db.execute('SELECT id FROM users WHERE phone = ?', [phone]);
      if (existingPhone.length > 0) {
        return res.status(400).json({ success: false, message: 'Số điện thoại đã được đăng ký.' });
      }

      const conn = await db.getConnection();
      try {
        await conn.beginTransaction();

        // Create user
        const hashedPassword = await bcrypt.hash(password, 12);
        const [userResult] = await conn.execute(
          `INSERT INTO users (email, password_hash, role, full_name, phone, is_active) VALUES (?, ?, 'patient', ?, ?, 1)`,
          [email, hashedPassword, full_name, phone]
        );

        // Create patient profile
        await conn.execute(
          `INSERT INTO patients (user_id, date_of_birth, gender, address) VALUES (?, ?, ?, ?)`,
          [userResult.insertId, date_of_birth || null, gender || null, address || null]
        );

        await conn.commit();

        // Auto login after register
        const user = { id: userResult.insertId, email, role: 'patient', full_name };
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await db.execute(
          'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
          [userResult.insertId, refreshToken, expiresAt]
        );

        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
          success: true,
          message: 'Đăng ký thành công',
          accessToken,
          user: { id: userResult.insertId, email, role: 'patient', full_name, phone },
        });
      } catch (err) {
        await conn.rollback();
        throw err;
      } finally {
        conn.release();
      }
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  },

  // ─── POST /api/user/auth/login ───
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Vui lòng nhập email và mật khẩu' });
      }

      const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
      if (users.length === 0) {
        return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
      }

      const user = users[0];

      if (!user.is_active) {
        return res.status(403).json({ success: false, message: 'Tài khoản đã bị khóa. Vui lòng liên hệ bệnh viện.' });
      }

      if (user.role !== 'patient') {
        return res.status(403).json({ success: false, message: 'Vui lòng sử dụng trang đăng nhập dành cho nhân viên.' });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await db.execute(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
        [user.id, refreshToken, expiresAt]
      );

      await db.execute('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        success: true,
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          full_name: user.full_name,
          phone: user.phone,
          avatar_url: user.avatar_url,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  },

  // ─── POST /api/user/auth/refresh ───
  async refresh(req, res) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ success: false, message: 'Phiên đăng nhập hết hạn' });
      }

      const decoded = jwt.verify(refreshToken, JWT_SECRET);

      const [tokens] = await db.execute(
        'SELECT * FROM refresh_tokens WHERE token = ? AND user_id = ? AND expires_at > NOW()',
        [refreshToken, decoded.id]
      );

      if (tokens.length === 0) {
        return res.status(401).json({ success: false, message: 'Phiên đăng nhập không hợp lệ' });
      }

      const [users] = await db.execute('SELECT * FROM users WHERE id = ? AND is_active = 1', [decoded.id]);
      if (users.length === 0) {
        return res.status(401).json({ success: false, message: 'Tài khoản không tồn tại' });
      }

      const user = users[0];
      const newAccessToken = generateAccessToken(user);

      res.json({ success: true, accessToken: newAccessToken });
    } catch (error) {
      console.error('Refresh error:', error);
      res.status(401).json({ success: false, message: 'Phiên đăng nhập không hợp lệ' });
    }
  },

  // ─── POST /api/user/auth/logout ───
  async logout(req, res) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (refreshToken) {
        await db.execute('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
      }
      res.clearCookie('refreshToken');
      res.json({ success: true, message: 'Đăng xuất thành công' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  },

  // ─── GET /api/user/auth/me ───
  async me(req, res) {
    try {
      const [users] = await db.execute(
        `SELECT u.id, u.email, u.role, u.full_name, u.phone, u.avatar_url, u.created_at,
                p.id as patient_id, p.date_of_birth, p.gender, p.address, p.insurance_number, p.blood_type, p.allergies
         FROM users u
         LEFT JOIN patients p ON p.user_id = u.id
         WHERE u.id = ?`,
        [req.user.id]
      );

      if (users.length === 0) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản' });
      }

      res.json({ success: true, user: users[0] });
    } catch (error) {
      console.error('Me error:', error);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  },

  // ─── PUT /api/user/auth/profile ───
  async updateProfile(req, res) {
    try {
      const { full_name, phone, date_of_birth, gender, address, insurance_number, blood_type, allergies } = req.body;

      // Update user
      await db.execute(
        'UPDATE users SET full_name = ?, phone = ? WHERE id = ?',
        [full_name || '', phone || '', req.user.id]
      );

      // Update patient
      await db.execute(
        `UPDATE patients SET date_of_birth = ?, gender = ?, address = ?, insurance_number = ?, blood_type = ?, allergies = ? WHERE user_id = ?`,
        [date_of_birth || null, gender || null, address || null, insurance_number || null, blood_type || null, allergies || null, req.user.id]
      );

      res.json({ success: true, message: 'Cập nhật thông tin thành công' });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  },

  // ─── PUT /api/user/auth/change-password ───
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
      }

      const [users] = await db.execute('SELECT * FROM users WHERE id = ?', [req.user.id]);
      const user = users[0];

      const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không đúng' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await db.execute('UPDATE users SET password_hash = ? WHERE id = ?', [hashedPassword, req.user.id]);

      res.json({ success: true, message: 'Đổi mật khẩu thành công' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  },
};

module.exports = userAuthController;
