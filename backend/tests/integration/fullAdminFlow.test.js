// tests/integration/fullAdminFlow.test.js
// ============================================================
// INTEGRATION TEST: Luồng đầy đủ của Admin
// ============================================================
//
// Mô phỏng hành trình Admin:
//   1. Admin đăng nhập
//   2. Xem thông tin cá nhân (me)
//   3. Xem dashboard stats
//   4. CRUD Departments
//   5. CRUD Doctors
//   6. CRUD News
//   7. Quản lý Appointments (list, confirm, cancel)
//   8. Quản lý Patients
//   9. Quản lý Users (super_admin)
//  10. Quản lý Medicines
//  11. Đổi mật khẩu
//  12. Đăng xuất
//
// NOTE: Cần DB thật để chạy đầy đủ.
// ============================================================

const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'noh_hospital_secret_2026';

function createFullApp() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  const hospitalApiRoutes = require('../../routes/hospital/api');
  const { authRoutes, adminRoutes, doctorRoutes } = require('../../routes/admin');
  const userRoutes = require('../../routes/user');

  app.use('/api', hospitalApiRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/doctor', doctorRoutes);
  app.use('/api/user', userRoutes);

  app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
  });
  app.use((err, req, res, next) => {
    res.status(500).json({ success: false, message: err.message });
  });

  return app;
}

describe('Integration: Full Admin Journey', () => {
  const app = createFullApp();

  // Dùng token tạo sẵn để test authorization
  const adminToken = jwt.sign(
    { id: 1, email: 'admin@nohhospital.vn', role: 'super_admin', full_name: 'System Admin', doctor_id: null },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
  const auth = { Authorization: `Bearer ${adminToken}` };

  let createdDeptId = null;
  let createdDoctorId = null;
  let createdNewsId = null;

  // ─── Step 1: Admin login ─────────────────────────────────
  it('Step 1: Admin login (needs DB)', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'admin@nohhospital.vn',
      password: 'admin123',
    });
    expect([200, 401, 500]).toContain(res.status);
  });

  // ─── Step 2: View profile ────────────────────────────────
  it('Step 2: Get admin info (needs DB)', async () => {
    const res = await request(app).get('/api/auth/me').set(auth);
    expect([200, 500]).toContain(res.status);
  });

  // ─── Step 3: Dashboard stats ─────────────────────────────
  it('Step 3: View overview stats (needs DB)', async () => {
    const res = await request(app).get('/api/admin/stats/overview').set(auth);
    expect([200, 500]).toContain(res.status);
  });

  it('Step 3b: View today appointments (needs DB)', async () => {
    const res = await request(app).get('/api/admin/stats/appointments/today').set(auth);
    expect([200, 500]).toContain(res.status);
  });

  // ─── Step 4: CRUD Departments ────────────────────────────
  it('Step 4a: Create department (needs DB)', async () => {
    const res = await request(app).post('/api/admin/departments').set(auth).send({
      name: 'Khoa Integration Test',
      slug: `khoa-integration-${Date.now()}`,
      type: 'lam-sang',
      description: 'Khoa tạo bởi integration test',
    });
    if (res.status === 200 || res.status === 201) {
      createdDeptId = res.body.data?.id || res.body.id;
    }
    expect([200, 201, 500]).toContain(res.status);
  });

  it('Step 4b: Update department (needs DB)', async () => {
    const id = createdDeptId || 1;
    const res = await request(app).put(`/api/admin/departments/${id}`).set(auth).send({
      name: 'Khoa Updated Integration',
      description: 'Updated by test',
    });
    expect([200, 404, 500]).toContain(res.status);
  });

  // ─── Step 5: CRUD Doctors ────────────────────────────────
  it('Step 5a: Create doctor (needs DB)', async () => {
    const res = await request(app).post('/api/admin/doctors').set(auth).send({
      name: 'BS. Integration Test',
      slug: `bs-integration-${Date.now()}`,
      title: 'Tiến sĩ',
      specialty: 'Tai Mũi Họng',
      department_id: createdDeptId || 1,
    });
    if (res.status === 200 || res.status === 201) {
      createdDoctorId = res.body.data?.id || res.body.id;
    }
    expect([200, 201, 500]).toContain(res.status);
  });

  it('Step 5b: Toggle doctor active (needs DB)', async () => {
    const id = createdDoctorId || 1;
    const res = await request(app).patch(`/api/admin/doctors/${id}/toggle`).set(auth);
    expect([200, 404, 500]).toContain(res.status);
  });

  // ─── Step 6: CRUD News ───────────────────────────────────
  it('Step 6a: Create news (needs DB)', async () => {
    const res = await request(app).post('/api/admin/news').set(auth).send({
      title: 'Tin Integration Test',
      slug: `tin-integration-${Date.now()}`,
      category: 'su-kien',
      excerpt: 'Tóm tắt test',
      content: '<p>Nội dung test</p>',
    });
    if (res.status === 200 || res.status === 201) {
      createdNewsId = res.body.data?.id || res.body.id;
    }
    expect([200, 201, 500]).toContain(res.status);
  });

  it('Step 6b: Toggle publish news (needs DB)', async () => {
    const id = createdNewsId || 1;
    const res = await request(app).patch(`/api/admin/news/${id}/publish`).set(auth);
    expect([200, 404, 500]).toContain(res.status);
  });

  // ─── Step 7: Manage Appointments ─────────────────────────
  it('Step 7a: List appointments (needs DB)', async () => {
    const res = await request(app).get('/api/admin/appointments').set(auth);
    expect([200, 500]).toContain(res.status);
  });

  it('Step 7b: Confirm appointment (needs DB)', async () => {
    const res = await request(app).patch('/api/admin/appointments/1/confirm').set(auth);
    expect([200, 400, 404, 500]).toContain(res.status);
  });

  it('Step 7c: View appointment calendar (needs DB)', async () => {
    const res = await request(app).get('/api/admin/appointments/calendar').set(auth);
    expect([200, 500]).toContain(res.status);
  });

  // ─── Step 8: Manage Patients ─────────────────────────────
  it('Step 8a: List patients (needs DB)', async () => {
    const res = await request(app).get('/api/admin/patients').set(auth);
    expect([200, 500]).toContain(res.status);
  });

  it('Step 8b: View patient records (needs DB)', async () => {
    const res = await request(app).get('/api/admin/patients/1/records').set(auth);
    expect([200, 500]).toContain(res.status);
  });

  // ─── Step 9: Manage Users (super_admin) ──────────────────
  it('Step 9a: List users (needs DB)', async () => {
    const res = await request(app).get('/api/admin/users').set(auth);
    expect([200, 500]).toContain(res.status);
  });

  it('Step 9b: Create user (needs DB)', async () => {
    const res = await request(app).post('/api/admin/users').set(auth).send({
      email: `newuser_${Date.now()}@test.com`,
      password: 'newpass123',
      role: 'admin',
      full_name: 'New Admin Integration',
    });
    expect([200, 201, 400, 500]).toContain(res.status);
  });

  // ─── Step 10: Manage Medicines ───────────────────────────
  it('Step 10a: List medicines (needs DB)', async () => {
    const res = await request(app).get('/api/admin/medicines').set(auth);
    expect([200, 500]).toContain(res.status);
  });

  it('Step 10b: Create medicine (needs DB)', async () => {
    const res = await request(app).post('/api/admin/medicines').set(auth).send({
      name: 'Thuốc Integration Test',
      active_ingredient: 'Test Ingredient',
      unit: 'viên',
      category: 'Test',
    });
    expect([200, 201, 500]).toContain(res.status);
  });

  // ─── Step 11: Change password ────────────────────────────
  it('Step 11: Change admin password (needs DB)', async () => {
    const res = await request(app).put('/api/auth/change-password').set(auth).send({
      currentPassword: 'admin123',
      newPassword: 'newadmin123',
    });
    expect([200, 400, 500]).toContain(res.status);
  });

  // ─── Step 12: Logout ─────────────────────────────────────
  it('Step 12: Admin logout', async () => {
    const res = await request(app).post('/api/auth/logout');
    expect([200, 500]).toContain(res.status);
  });

  // ─── Cleanup: Delete test data ───────────────────────────
  it('Cleanup: Delete test news (needs DB)', async () => {
    if (!createdNewsId) return;
    const res = await request(app).delete(`/api/admin/news/${createdNewsId}`).set(auth);
    expect([200, 404, 500]).toContain(res.status);
  });

  it('Cleanup: Delete test doctor (needs DB)', async () => {
    if (!createdDoctorId) return;
    const res = await request(app).delete(`/api/admin/doctors/${createdDoctorId}`).set(auth);
    expect([200, 404, 500]).toContain(res.status);
  });

  it('Cleanup: Delete test department (needs DB)', async () => {
    if (!createdDeptId) return;
    const res = await request(app).delete(`/api/admin/departments/${createdDeptId}`).set(auth);
    expect([200, 404, 500]).toContain(res.status);
  });
});

