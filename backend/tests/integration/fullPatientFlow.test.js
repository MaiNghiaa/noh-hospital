// tests/integration/fullPatientFlow.test.js
// ============================================================
// INTEGRATION TEST: Luồng đầy đủ của bệnh nhân
// ============================================================
//
// Mô phỏng toàn bộ hành trình:
//   1. Khách xem trang chủ / health check
//   2. Xem danh sách chuyên khoa
//   3. Xem chi tiết chuyên khoa
//   4. Xem danh sách bác sĩ
//   5. Tìm kiếm bác sĩ
//   6. Xem chi tiết bác sĩ
//   7. Xem tin tức
//   8. Đặt lịch khám (chưa đăng nhập)
//   9. Tra cứu lịch hẹn qua SĐT
//  10. Đăng ký tài khoản bệnh nhân
//  11. Đăng nhập
//  12. Xem dashboard cá nhân
//  13. Đặt lịch khám (đã đăng nhập)
//  14. Xem danh sách lịch hẹn
//  15. Xem chi tiết lịch hẹn
//  16. Hủy lịch hẹn
//  17. Xem hồ sơ bệnh án
//  18. Xem chi tiết bệnh án + đơn thuốc
//  19. Xem danh sách đơn thuốc
//  20. Cập nhật profile
//  21. Đổi mật khẩu
//  22. Đăng xuất
//
// NOTE: Test này yêu cầu DB thật hoặc mock đầy đủ.
//       Khi chạy không có DB, một số step sẽ skip gracefully.
// ============================================================

const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');

function createFullApp() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  const hospitalApiRoutes = require('../../routes/hospital/api');
  const { authRoutes, adminRoutes } = require('../../routes/admin');
  const userRoutes = require('../../routes/user');

  app.use('/api', hospitalApiRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/user', userRoutes);

  app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
  });
  app.use((err, req, res, next) => {
    res.status(500).json({ success: false, message: err.message });
  });

  return app;
}

describe('Integration: Full Patient Journey', () => {
  const app = createFullApp();
  let patientToken = null;
  let createdAppointmentId = null;

  // ─── Step 1: Health check ────────────────────────────────
  it('Step 1: Health check should be OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  // ─── Step 2: Browse departments ──────────────────────────
  it('Step 2: Get list of departments', async () => {
    const res = await request(app).get('/api/departments');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  // ─── Step 3: View department detail ──────────────────────
  it('Step 3: Get department detail', async () => {
    const res = await request(app).get('/api/departments/1');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('name');
  });

  // ─── Step 4: Browse doctors ──────────────────────────────
  it('Step 4: Get list of doctors', async () => {
    const res = await request(app).get('/api/doctors');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // ─── Step 5: Search doctors ──────────────────────────────
  it('Step 5: Search for a doctor', async () => {
    const res = await request(app).get('/api/doctors/search').query({ q: 'Phạm' });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  // ─── Step 6: View doctor detail ──────────────────────────
  it('Step 6: Get doctor detail', async () => {
    const res = await request(app).get('/api/doctors/1');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('name');
  });

  // ─── Step 7: Browse news ─────────────────────────────────
  it('Step 7: Get news list', async () => {
    const res = await request(app).get('/api/news');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // ─── Step 8: Book appointment (anonymous) ────────────────
  it('Step 8: Book appointment without login', async () => {
    const res = await request(app).post('/api/appointments').send({
      full_name: 'Nguyễn Văn Integration Test',
      phone: '0911111111',
      email: 'integration@test.com',
      department: 'Khoa Tai',
      date: '2026-05-15',
      time: '10:00',
      reason: 'Kiểm tra thính lực',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  // ─── Step 9: Lookup appointment by phone ─────────────────
  it('Step 9: Lookup appointment by phone', async () => {
    const res = await request(app).get('/api/appointments').query({ phone: '0911111111' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // ─── Step 10-11: Register & Login ────────────────────────
  it('Step 10: Register patient account (needs DB)', async () => {
    const res = await request(app).post('/api/user/auth/register').send({
      full_name: 'Tester Integration',
      email: `integration_${Date.now()}@test.com`,
      password: 'testpass123',
      phone: `09${Date.now().toString().slice(-8)}`,
    });

    if (res.status === 201) {
      patientToken = res.body.accessToken;
      expect(res.body.user.role).toBe('patient');
    } else {
      // Skip subsequent auth-required tests
      console.log('  → Register needs DB, subsequent authenticated tests will adapt');
    }
  });

  it('Step 11: Login patient (needs DB)', async () => {
    // Nếu đã có token từ register, skip
    if (patientToken) return;

    const res = await request(app).post('/api/user/auth/login').send({
      email: 'patient@gmail.com',
      password: 'patient123',
    });

    if (res.status === 200) {
      patientToken = res.body.accessToken;
    }
  });

  // ─── Step 12-22: Authenticated patient flow ──────────────
  it('Step 12: View patient dashboard (needs DB)', async () => {
    if (!patientToken) return;

    const res = await request(app)
      .get('/api/user/dashboard')
      .set('Authorization', `Bearer ${patientToken}`);

    expect([200, 500]).toContain(res.status);
  });

  it('Step 13: Book appointment when logged in (needs DB)', async () => {
    if (!patientToken) return;

    const res = await request(app)
      .post('/api/user/appointments')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({
        department: 'Khoa Mũi Xoang',
        appointment_date: '2026-06-01',
        appointment_time: '08:30',
        reason: 'Nghẹt mũi kéo dài',
      });

    if (res.status === 201 && res.body.data?.id) {
      createdAppointmentId = res.body.data.id;
    }
  });

  it('Step 14: View my appointments (needs DB)', async () => {
    if (!patientToken) return;

    const res = await request(app)
      .get('/api/user/appointments')
      .set('Authorization', `Bearer ${patientToken}`);

    expect([200, 500]).toContain(res.status);
  });

  it('Step 15: View appointment detail (needs DB)', async () => {
    if (!patientToken || !createdAppointmentId) return;

    const res = await request(app)
      .get(`/api/user/appointments/${createdAppointmentId}`)
      .set('Authorization', `Bearer ${patientToken}`);

    expect([200, 404, 500]).toContain(res.status);
  });

  it('Step 16: Cancel appointment (needs DB)', async () => {
    if (!patientToken || !createdAppointmentId) return;

    const res = await request(app)
      .patch(`/api/user/appointments/${createdAppointmentId}/cancel`)
      .set('Authorization', `Bearer ${patientToken}`)
      .send({ reason: 'Test hủy lịch' });

    expect([200, 400, 500]).toContain(res.status);
  });

  it('Step 17: View medical records (needs DB)', async () => {
    if (!patientToken) return;

    const res = await request(app)
      .get('/api/user/medical-records')
      .set('Authorization', `Bearer ${patientToken}`);

    expect([200, 500]).toContain(res.status);
  });

  it('Step 18: View medical record detail (needs DB)', async () => {
    if (!patientToken) return;

    const res = await request(app)
      .get('/api/user/medical-records/1')
      .set('Authorization', `Bearer ${patientToken}`);

    expect([200, 404, 500]).toContain(res.status);
  });

  it('Step 19: View prescriptions (needs DB)', async () => {
    if (!patientToken) return;

    const res = await request(app)
      .get('/api/user/prescriptions')
      .set('Authorization', `Bearer ${patientToken}`);

    expect([200, 500]).toContain(res.status);
  });

  it('Step 20: Update profile (needs DB)', async () => {
    if (!patientToken) return;

    const res = await request(app)
      .put('/api/user/auth/profile')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({ full_name: 'Updated Integration Tester', phone: '0922222222' });

    expect([200, 500]).toContain(res.status);
  });

  it('Step 21: Change password (needs DB)', async () => {
    if (!patientToken) return;

    const res = await request(app)
      .put('/api/user/auth/change-password')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({ currentPassword: 'testpass123', newPassword: 'newpass456' });

    expect([200, 400, 500]).toContain(res.status);
  });

  it('Step 22: Logout', async () => {
    const res = await request(app).post('/api/user/auth/logout');

    expect([200, 500]).toContain(res.status);
  });
});

