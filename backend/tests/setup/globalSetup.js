// tests/setup/globalSetup.js
// ============================================================
// Setup chung cho toàn bộ test suite
// Mock database, tạo Express app instance dùng supertest
// ============================================================

const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = 'noh_hospital_secret_2026';

// ─── Mock Database ───────────────────────────────────────────
// Giả lập mysql2/promise pool để test không cần MySQL thật
const mockDb = {
  _data: {},

  reset() {
    this._data = {
      users: [
        {
          id: 1,
          email: 'admin@nohhospital.vn',
          password_hash: bcrypt.hashSync('admin123', 10),
          role: 'super_admin',
          full_name: 'System Admin',
          phone: '0243.8533.427',
          avatar_url: null,
          doctor_id: null,
          is_active: 1,
          last_login: null,
          created_at: new Date(),
        },
        {
          id: 2,
          email: 'doctor@nohhospital.vn',
          password_hash: bcrypt.hashSync('doctor123', 10),
          role: 'doctor',
          full_name: 'BS. Nguyễn Văn A',
          phone: '0901234567',
          avatar_url: null,
          doctor_id: 1,
          is_active: 1,
          last_login: null,
          created_at: new Date(),
        },
        {
          id: 3,
          email: 'patient@gmail.com',
          password_hash: bcrypt.hashSync('patient123', 10),
          role: 'patient',
          full_name: 'Nguyễn Văn Bệnh Nhân',
          phone: '0912345678',
          avatar_url: null,
          doctor_id: null,
          is_active: 1,
          last_login: null,
          created_at: new Date(),
        },
        {
          id: 4,
          email: 'locked@gmail.com',
          password_hash: bcrypt.hashSync('locked123', 10),
          role: 'patient',
          full_name: 'Tài Khoản Bị Khóa',
          phone: '0999999999',
          avatar_url: null,
          doctor_id: null,
          is_active: 0,
          last_login: null,
          created_at: new Date(),
        },
      ],
      patients: [
        {
          id: 1,
          user_id: 3,
          date_of_birth: '1990-05-15',
          gender: 'male',
          address: '123 Phố Huế, Hà Nội',
          insurance_number: 'BH123456',
          blood_type: 'A+',
          allergies: 'Penicillin',
        },
      ],
      departments: [
        { id: 1, name: 'Khoa Họng - Thanh quản', slug: 'khoa-hong-thanh-quan', type: 'lam-sang', description: 'Khám chữa bệnh vùng họng', is_active: 1, sort_order: 1 },
        { id: 2, name: 'Khoa Tai', slug: 'khoa-tai', type: 'lam-sang', description: 'Khám chữa bệnh chuyên sâu về tai', is_active: 1, sort_order: 2 },
        { id: 3, name: 'Khoa Xét nghiệm', slug: 'khoa-xet-nghiem', type: 'can-lam-sang', description: 'Xét nghiệm tổng hợp', is_active: 1, sort_order: 3 },
      ],
      doctors: [
        { id: 1, name: 'PGS-TS. Phạm Tuấn Cảnh', slug: 'pham-tuan-canh', title: 'Phó Giáo sư', specialty: 'Tai mũi họng', department_id: 1, is_active: 1, image: null, experience: '30+ năm', education: 'ĐH Y Hà Nội' },
        { id: 2, name: 'TS. Lê Anh Tuấn', slug: 'le-anh-tuan', title: 'Tiến sĩ', specialty: 'Tai Mũi Họng Trẻ em', department_id: 2, is_active: 1, image: null, experience: '25+ năm', education: 'ĐH Y Hà Nội' },
      ],
      news: [
        { id: 1, title: 'Khám sàng lọc miễn phí', slug: 'kham-sang-loc', category: 'su-kien', excerpt: 'Chương trình khám miễn phí...', content: '<p>Nội dung bài viết</p>', is_published: 1, view_count: 100, published_at: '2026-04-07' },
        { id: 2, title: 'Viêm tai giữa mãn tính', slug: 'viem-tai-giua', category: 'nghien-cuu', excerpt: 'Cảnh báo biến chứng...', content: '<p>Nội dung nghiên cứu</p>', is_published: 1, view_count: 50, published_at: '2026-03-25' },
      ],
      appointments: [
        {
          id: 1,
          full_name: 'Nguyễn Văn Bệnh Nhân',
          phone: '0912345678',
          email: 'patient@gmail.com',
          department: 'Khoa Tai',
          doctor_id: 1,
          appointment_date: '2026-04-20',
          appointment_time: '09:00:00',
          reason: 'Đau tai trái',
          patient_id: 1,
          status: 'pending',
          cancel_reason: null,
          created_at: new Date(),
        },
        {
          id: 2,
          full_name: 'Nguyễn Văn Bệnh Nhân',
          phone: '0912345678',
          email: 'patient@gmail.com',
          department: 'Khoa Họng',
          doctor_id: 2,
          appointment_date: '2026-04-22',
          appointment_time: '14:00:00',
          reason: 'Viêm họng',
          patient_id: 1,
          status: 'confirmed',
          cancel_reason: null,
          created_at: new Date(),
        },
      ],
      medical_records: [
        {
          id: 1,
          appointment_id: null,
          patient_id: 1,
          doctor_id: 1,
          symptoms: 'Đau tai, ù tai',
          diagnosis: 'Viêm tai giữa cấp',
          treatment: 'Kháng sinh + nhỏ tai',
          notes: 'Tái khám sau 1 tuần',
          follow_up_date: '2026-04-27',
          created_at: new Date(),
        },
      ],
      medicines: [
        { id: 1, name: 'Amoxicillin 500mg', active_ingredient: 'Amoxicillin', unit: 'viên', category: 'Kháng sinh', is_active: 1 },
        { id: 2, name: 'Paracetamol 500mg', active_ingredient: 'Paracetamol', unit: 'viên', category: 'Giảm đau', is_active: 1 },
      ],
      prescriptions: [
        { id: 1, record_id: 1, medicine_id: 1, quantity: 21, dosage: '3 lần/ngày x 1 viên', duration_days: 7, instruction: 'Uống sau ăn' },
      ],
      refresh_tokens: [],
    };
  },

  // Simulate mysql2 execute: returns [[rows], fields]
  async execute(query, params = []) {
    throw new Error('Mock DB not implemented (tests should use controller fallbacks)');
  },

  async query(query, params = []) {
    return this.execute(query, params);
  },

  async getConnection() {
    return {
      beginTransaction: async () => {},
      execute: async () => [{ insertId: Date.now() }],
      commit: async () => {},
      rollback: async () => {},
      release: () => {},
    };
  },
};

mockDb.reset();

// Mock backend DB module so tests don't hit MySQL
jest.mock('../../config/db', () => {
  return {
    db: mockDb,
    pool: {
      query: (...args) => mockDb.query(...args),
      execute: (...args) => mockDb.execute(...args),
      getConnection: (...args) => mockDb.getConnection(...args),
    },
  };
});

// ─── Token Generators ────────────────────────────────────────
function generateToken(user, expiresIn = '1h') {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
      doctor_id: user.doctor_id || null,
    },
    JWT_SECRET,
    { expiresIn }
  );
}

function generateExpiredToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, full_name: user.full_name },
    JWT_SECRET,
    { expiresIn: '0s' }
  );
}

// ─── Pre-generated tokens ────────────────────────────────────
const tokens = {
  superAdmin: generateToken(mockDb._data.users[0]),
  doctor: generateToken(mockDb._data.users[1]),
  patient: generateToken(mockDb._data.users[2]),
  lockedUser: generateToken(mockDb._data.users[3]),
  expired: generateExpiredToken(mockDb._data.users[0]),
  invalid: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.payload',
};

// ─── Create Express App (isolated, no DB required) ───────────
function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Mount routes
  const hospitalApiRoutes = require('../../routes/hospital/api');
  app.use('/api', hospitalApiRoutes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
  });

  // Error handler
  app.use((err, req, res, next) => {
    res.status(500).json({ success: false, message: err.message || 'Internal server error' });
  });

  return app;
}

module.exports = {
  mockDb,
  tokens,
  generateToken,
  generateExpiredToken,
  createTestApp,
  JWT_SECRET,
};

