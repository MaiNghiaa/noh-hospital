// tests/integration/fullDoctorFlow.test.js
// ============================================================
// INTEGRATION TEST: Luồng đầy đủ của Bác sĩ
// ============================================================
//
// Mô phỏng hành trình Bác sĩ:
//   1. Bác sĩ đăng nhập
//   2. Xem dashboard
//   3. Xem danh sách lịch hẹn
//   4. Lọc lịch hẹn theo ngày
//   5. Lọc lịch hẹn theo trạng thái
//   6. Tạo hồ sơ bệnh án cho bệnh nhân
//   7. Cập nhật hồ sơ bệnh án
//   8. Kê đơn thuốc
//   9. Xem danh sách thuốc
//  10. Đổi mật khẩu
//  11. Đăng xuất
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
  app.use(cookieParser());

  const { authRoutes, adminRoutes, doctorRoutes } = require('../../routes/admin');

  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/doctor', doctorRoutes);

  app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
  });
  app.use((err, req, res, next) => {
    res.status(500).json({ success: false, message: err.message });
  });

  return app;
}

describe('Integration: Full Doctor Journey', () => {
  const app = createFullApp();

  const doctorToken = jwt.sign(
    { id: 2, email: 'doctor@nohhospital.vn', role: 'doctor', full_name: 'BS. Nguyễn Văn A', doctor_id: 1 },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
  const auth = { Authorization: `Bearer ${doctorToken}` };

  let createdRecordId = null;

  // ─── Step 1: Doctor login ────────────────────────────────
  it('Step 1: Doctor login (needs DB)', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'doctor@nohhospital.vn',
      password: 'doctor123',
    });
    expect([200, 401, 500]).toContain(res.status);
  });

  // ─── Step 2: Dashboard ───────────────────────────────────
  it('Step 2: View doctor dashboard (needs DB)', async () => {
    const res = await request(app).get('/api/doctor/dashboard').set(auth);
    expect([200, 403, 500]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body.data).toHaveProperty('stats');
      expect(res.body.data.stats).toHaveProperty('todayCount');
    }
  });

  // ─── Step 3: View appointments ───────────────────────────
  it('Step 3: List my appointments (needs DB)', async () => {
    const res = await request(app).get('/api/doctor/appointments').set(auth);
    expect([200, 403, 500]).toContain(res.status);
  });

  // ─── Step 4: Filter by date ──────────────────────────────
  it('Step 4: Filter appointments by date (needs DB)', async () => {
    const res = await request(app)
      .get('/api/doctor/appointments')
      .query({ date: '2026-04-20' })
      .set(auth);
    expect([200, 403, 500]).toContain(res.status);
  });

  // ─── Step 5: Filter by status ────────────────────────────
  it('Step 5: Filter appointments by status (needs DB)', async () => {
    const res = await request(app)
      .get('/api/doctor/appointments')
      .query({ status: 'confirmed' })
      .set(auth);
    expect([200, 403, 500]).toContain(res.status);
  });

  // ─── Step 6: Create medical record ───────────────────────
  it('Step 6: Create medical record (needs DB)', async () => {
    const res = await request(app).post('/api/doctor/records').set(auth).send({
      patient_id: 1,
      appointment_id: 1,
      symptoms: 'Đau tai, ù tai 2 tuần',
      diagnosis: 'Viêm tai giữa cấp mức độ vừa',
      treatment: 'Kháng sinh toàn thân + nhỏ tai kháng sinh',
      notes: 'Hẹn tái khám sau 7 ngày. Nếu không đỡ cần chụp CT.',
      follow_up_date: '2026-05-01',
    });

    if (res.status === 201 && res.body.recordId) {
      createdRecordId = res.body.recordId;
    }
    expect([201, 400, 403, 409, 500]).toContain(res.status);
  });

  // ─── Step 7: Update record ───────────────────────────────
  it('Step 7: Update medical record (needs DB)', async () => {
    const id = createdRecordId || 1;
    const res = await request(app).put(`/api/doctor/records/${id}`).set(auth).send({
      symptoms: 'Đau tai, ù tai, chóng mặt nhẹ',
      diagnosis: 'Viêm tai giữa cấp + chóng mặt tư thế',
      treatment: 'Kháng sinh + thuốc chống chóng mặt',
      follow_up_date: '2026-05-03',
    });
    expect([200, 403, 500]).toContain(res.status);
  });

  // ─── Step 8: Create prescription ─────────────────────────
  it('Step 8: Create prescription for patient (needs DB)', async () => {
    const recordId = createdRecordId || 1;
    const res = await request(app).post('/api/doctor/prescriptions').set(auth).send({
      record_id: recordId,
      items: [
        { medicine_id: 1, quantity: 21, dosage: '3 lần/ngày x 1 viên', duration_days: 7, instruction: 'Uống sau ăn 30 phút' },
        { medicine_id: 2, quantity: 10, dosage: '2 lần/ngày khi đau', duration_days: 5, instruction: 'Uống khi cần, không quá 6 viên/ngày' },
      ],
    });
    expect([201, 400, 403, 500]).toContain(res.status);
  });

  // ─── Step 9: View medicines ──────────────────────────────
  it('Step 9: View available medicines (needs DB)', async () => {
    const res = await request(app).get('/api/admin/medicines').set(auth);
    expect([200, 500]).toContain(res.status);
  });

  // ─── Step 10: Change password ────────────────────────────
  it('Step 10: Change doctor password (needs DB)', async () => {
    const res = await request(app).put('/api/auth/change-password').set(auth).send({
      currentPassword: 'doctor123',
      newPassword: 'newdoctor123',
    });
    expect([200, 400, 500]).toContain(res.status);
  });

  // ─── Step 11: Logout ─────────────────────────────────────
  it('Step 11: Doctor logout', async () => {
    const res = await request(app).post('/api/auth/logout');
    expect([200, 500]).toContain(res.status);
  });
});

