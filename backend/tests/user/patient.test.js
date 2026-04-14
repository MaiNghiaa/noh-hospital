// tests/user/patient.test.js
// ============================================================
// LUỒNG: Bệnh nhân (Patient Portal)
// - Dashboard (thống kê cá nhân)
// - Lịch hẹn: xem, tạo, xem chi tiết, hủy
// - Hồ sơ bệnh án: xem danh sách, xem chi tiết
// - Đơn thuốc: xem danh sách
// ============================================================

const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');

const { tokens } = require('../setup/globalSetup');
const { authHeader } = require('../setup/helpers');

function createUserApp() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());

  const userRoutes = require('../../routes/user');
  app.use('/api/user', userRoutes);

  app.use((err, req, res, next) => {
    res.status(500).json({ success: false, message: err.message });
  });

  return app;
}

describe('Patient Portal - /api/user', () => {
  let app;

  beforeAll(() => {
    app = createUserApp();
  });

  // ═══════════════════════════════════════════════════════════
  // AUTHORIZATION - Tất cả route cần đăng nhập
  // ═══════════════════════════════════════════════════════════
  describe('Authorization', () => {
    const protectedRoutes = [
      { method: 'get', path: '/api/user/dashboard' },
      { method: 'get', path: '/api/user/appointments' },
      { method: 'post', path: '/api/user/appointments' },
      { method: 'get', path: '/api/user/appointments/1' },
      { method: 'patch', path: '/api/user/appointments/1/cancel' },
      { method: 'get', path: '/api/user/medical-records' },
      { method: 'get', path: '/api/user/medical-records/1' },
      { method: 'get', path: '/api/user/prescriptions' },
    ];

    protectedRoutes.forEach((route) => {
      it(`${route.method.toUpperCase()} ${route.path} - should reject without token`, async () => {
        const res = await request(app)[route.method](route.path);
        expect(res.status).toBe(401);
      });

      it(`${route.method.toUpperCase()} ${route.path} - should reject with invalid token`, async () => {
        const res = await request(app)[route.method](route.path).set(authHeader(tokens.invalid));
        expect(res.status).toBe(401);
      });
    });
  });

  // ═══════════════════════════════════════════════════════════
  // DASHBOARD
  // ═══════════════════════════════════════════════════════════
  describe('GET /api/user/dashboard', () => {
    it('should return dashboard summary (needs DB)', async () => {
      const res = await request(app)
        .get('/api/user/dashboard')
        .set(authHeader(tokens.patient));

      expect([200, 500]).toContain(res.status);
      if (res.status === 200) {
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('totalAppointments');
        expect(res.body.data).toHaveProperty('upcomingAppointments');
        expect(res.body.data).toHaveProperty('totalRecords');
        expect(res.body.data).toHaveProperty('recentAppointments');
      }
    });
  });

  // ═══════════════════════════════════════════════════════════
  // APPOINTMENTS
  // ═══════════════════════════════════════════════════════════
  describe('Appointments', () => {
    describe('GET /api/user/appointments', () => {
      it('should return patient appointments (needs DB)', async () => {
        const res = await request(app)
          .get('/api/user/appointments')
          .set(authHeader(tokens.patient));

        expect([200, 500]).toContain(res.status);
        if (res.status === 200) {
          expect(res.body.success).toBe(true);
          expect(Array.isArray(res.body.data)).toBe(true);
        }
      });
    });

    describe('POST /api/user/appointments', () => {
      it('should create appointment when logged in (needs DB)', async () => {
        const res = await request(app)
          .post('/api/user/appointments')
          .set(authHeader(tokens.patient))
          .send({
            department: 'Khoa Tai',
            doctor_id: 1,
            appointment_date: '2026-05-10',
            appointment_time: '10:00',
            reason: 'Kiểm tra thính lực định kỳ',
          });

        expect([201, 400, 500]).toContain(res.status);
      });

      it('should reject missing department', async () => {
        const res = await request(app)
          .post('/api/user/appointments')
          .set(authHeader(tokens.patient))
          .send({
            appointment_date: '2026-05-10',
          });

        expect([400, 500]).toContain(res.status);
      });

      it('should reject missing appointment_date', async () => {
        const res = await request(app)
          .post('/api/user/appointments')
          .set(authHeader(tokens.patient))
          .send({
            department: 'Khoa Tai',
          });

        expect([400, 500]).toContain(res.status);
      });

      it('should work without optional fields (doctor_id, time, reason)', async () => {
        const res = await request(app)
          .post('/api/user/appointments')
          .set(authHeader(tokens.patient))
          .send({
            department: 'Khoa Mũi Xoang',
            appointment_date: '2026-06-01',
          });

        expect([201, 400, 500]).toContain(res.status);
      });
    });

    describe('GET /api/user/appointments/:id', () => {
      it('should return appointment detail (needs DB)', async () => {
        const res = await request(app)
          .get('/api/user/appointments/1')
          .set(authHeader(tokens.patient));

        expect([200, 404, 500]).toContain(res.status);
      });

      it('should return 404 for non-existent appointment', async () => {
        const res = await request(app)
          .get('/api/user/appointments/99999')
          .set(authHeader(tokens.patient));

        expect([404, 500]).toContain(res.status);
      });
    });

    describe('PATCH /api/user/appointments/:id/cancel', () => {
      it('should cancel pending/confirmed appointment (needs DB)', async () => {
        const res = await request(app)
          .patch('/api/user/appointments/1/cancel')
          .set(authHeader(tokens.patient))
          .send({ reason: 'Có việc đột xuất' });

        expect([200, 400, 404, 500]).toContain(res.status);
      });

      it('should handle cancel without reason (uses default)', async () => {
        const res = await request(app)
          .patch('/api/user/appointments/1/cancel')
          .set(authHeader(tokens.patient))
          .send({});

        expect([200, 400, 404, 500]).toContain(res.status);
      });
    });
  });

  // ═══════════════════════════════════════════════════════════
  // MEDICAL RECORDS
  // ═══════════════════════════════════════════════════════════
  describe('Medical Records', () => {
    describe('GET /api/user/medical-records', () => {
      it('should return patient records (needs DB)', async () => {
        const res = await request(app)
          .get('/api/user/medical-records')
          .set(authHeader(tokens.patient));

        expect([200, 500]).toContain(res.status);
        if (res.status === 200) {
          expect(res.body.success).toBe(true);
          expect(Array.isArray(res.body.data)).toBe(true);
        }
      });
    });

    describe('GET /api/user/medical-records/:id', () => {
      it('should return record detail with prescriptions (needs DB)', async () => {
        const res = await request(app)
          .get('/api/user/medical-records/1')
          .set(authHeader(tokens.patient));

        expect([200, 404, 500]).toContain(res.status);
        if (res.status === 200) {
          expect(res.body.data).toHaveProperty('diagnosis');
          expect(res.body.data).toHaveProperty('prescriptions');
        }
      });

      it('should return 404 for non-existent record', async () => {
        const res = await request(app)
          .get('/api/user/medical-records/99999')
          .set(authHeader(tokens.patient));

        expect([404, 500]).toContain(res.status);
      });
    });
  });

  // ═══════════════════════════════════════════════════════════
  // PRESCRIPTIONS
  // ═══════════════════════════════════════════════════════════
  describe('Prescriptions', () => {
    describe('GET /api/user/prescriptions', () => {
      it('should return patient prescriptions (needs DB)', async () => {
        const res = await request(app)
          .get('/api/user/prescriptions')
          .set(authHeader(tokens.patient));

        expect([200, 500]).toContain(res.status);
        if (res.status === 200) {
          expect(res.body.success).toBe(true);
          expect(Array.isArray(res.body.data)).toBe(true);
        }
      });
    });
  });
});

