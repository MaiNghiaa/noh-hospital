// backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/db').db;

const JWT_SECRET = process.env.JWT_SECRET || 'noh_hospital_secret_2026';
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '1h';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || '7d';

function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, full_name: user.full_name, doctor_id: user.doctor_id },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

function generateRefreshToken(user) {
  return jwt.sign({ id: user.id, type: 'refresh' }, JWT_SECRET, { expiresIn: REFRESH_EXPIRES });
}

const authController = {
  // POST /api/auth/login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });
      }

      const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

      if (users.length === 0) {
        return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
      }

      const user = users[0];

      if (!user.is_active) {
        return res.status(403).json({ message: 'Tài khoản đã bị khóa. Vui lòng liên hệ quản trị viên.' });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      // Save refresh token to DB
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await db.execute(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
        [user.id, refreshToken, expiresAt]
      );

      // Update last login
      await db.execute('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

      // Set refresh token as httpOnly cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          full_name: user.full_name,
          avatar_url: user.avatar_url,
          doctor_id: user.doctor_id,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // POST /api/auth/refresh
  async refresh(req, res) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ message: 'Không tìm thấy refresh token' });
      }

      const decoded = jwt.verify(refreshToken, JWT_SECRET);

      const [tokens] = await db.execute(
        'SELECT * FROM refresh_tokens WHERE token = ? AND user_id = ? AND expires_at > NOW()',
        [refreshToken, decoded.id]
      );

      if (tokens.length === 0) {
        return res.status(401).json({ message: 'Refresh token không hợp lệ' });
      }

      const [users] = await db.execute('SELECT * FROM users WHERE id = ? AND is_active = 1', [decoded.id]);
      if (users.length === 0) {
        return res.status(401).json({ message: 'Người dùng không tồn tại' });
      }

      const user = users[0];
      const newAccessToken = generateAccessToken(user);

      res.json({ accessToken: newAccessToken });
    } catch (error) {
      console.error('Refresh error:', error);
      res.status(401).json({ message: 'Refresh token không hợp lệ' });
    }
  },

  // POST /api/auth/logout
  async logout(req, res) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (refreshToken) {
        await db.execute('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
      }

      res.clearCookie('refreshToken');
      res.json({ message: 'Đăng xuất thành công' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // GET /api/auth/me
  async me(req, res) {
    try {
      const [users] = await db.execute(
        'SELECT id, email, role, full_name, phone, avatar_url, doctor_id, is_active, last_login, created_at FROM users WHERE id = ?',
        [req.user.id]
      );

      if (users.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }

      res.json({ user: users[0] });
    } catch (error) {
      console.error('Me error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // PUT /api/auth/change-password
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 8 ký tự' });
      }

      const [users] = await db.execute('SELECT * FROM users WHERE id = ?', [req.user.id]);
      const user = users[0];

      const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isMatch) {
        return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await db.execute('UPDATE users SET password_hash = ? WHERE id = ?', [hashedPassword, req.user.id]);

      res.json({ message: 'Đổi mật khẩu thành công' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
};

module.exports = authController;
