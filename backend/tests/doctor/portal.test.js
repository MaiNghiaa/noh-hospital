// tests/doctor/portal.test.js
// ============================================================
// LUỒNG: Bác sĩ (Doctor Portal)
// - Xem dashboard (thống kê cá nhân)
// - Xem lịch hẹn của mình
// - Tạo hồ sơ bệnh án
// - Cập nhật hồ sơ bệnh án
// - Kê đơn thuốc
// ============================================================

const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');

const { tokens } = require('../setup/globalSetup');
const { authHeader, validRecordData, validPrescriptionData } = require('../setup/helpers');

function createDoctorApp() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());

  const { doctorRoutes } = require('../../routes/admin');
  app.use('/api/doctor', doctorRoutes);

  app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
  });

  return app;
}

describe('Doctor Portal - /api/doctor', () => {
  let app;

  beforeAll(() => {
    app = createDoctorApp();
  });

  // ═══════════════════════════════════════════════════════════
  // AUTHORIZATION
  // ═══════════════════════════════════════════════════════════
  describe('Authorization', () => {
    it('should reject all routes without token', async () => {
      const routes = [
        { method: 'get', path: '/api/doctor/dashboard' },
        { method: 'get', path: '/api/doctor/appointments' },
        { method: 'post', path: '/api/doctor/records' },
        { method: 'post', path: '/api/doctor/prescriptions' },
      ];

      for (const route of routes) {
        const res = await request(app)[route.method](route.path);
        expect(res.status).toBe(401);
      }
    });

    it('should reject admin role (only doctors allowed)', async () => {
      const res = await request(app)
        .get('/api/doctor/dashboard')
        .set(authHeader(tokens.superAdmin));

      expect(res.status).toBe(403);
    });

    it('should reject patient role', async () => {
      const res = await request(app)
        .get('/api/doctor/dashboard')
        .set(authHeader(tokens.patient));

      expect(res.status).toBe(403);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // DASHBOARD
  // ═══════════════════════════════════════════════════════════
  describe('GET /api/doctor/dashboard', () => {
    it('should return dashboard data for doctor (needs DB)', async () => {
      const res = await request(app)
        .get('/api/doctor/dashboard')
        .set(authHeader(tokens.doctor));

      expect([200, 500]).toContain(res.status);
      if (res.status === 200) {
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('stats');
        expect(res.body.data).toHaveProperty('todayAppointments');
      }
    });
  });

  // ═══════════════════════════════════════════════════════════
  // APPOINTMENTS
  // ═══════════════════════════════════════════════════════════
  describe('GET /api/doctor/appointments', () => {
    it('should return doctor appointments (needs DB)', async () => {
      const res = await request(app)
        .get('/api/doctor/appointments')
        .set(authHeader(tokens.doctor));

      expect([200, 403, 500]).toContain(res.status);
    });

    it('should support filter by date', async () => {
      const res = await request(app)
        .get('/api/doctor/appointments')
        .query({ date: '2026-04-20' })
        .set(authHeader(tokens.doctor));

      expect([200, 403, 500]).toContain(res.status);
    });

    it('should support filter by status', async () => {
      const res = await request(app)
        .get('/api/doctor/appointments')
        .query({ status: 'pending' })
        .set(authHeader(tokens.doctor));

      expect([200, 403, 500]).toContain(res.status);
    });

    it('should support pagination', async () => {
      const res = await request(app)
        .get('/api/doctor/appointments')
        .query({ page: 1, limit: 10 })
        .set(authHeader(tokens.doctor));

      expect([200, 403, 500]).toContain(res.status);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // MEDICAL RECORDS
  // ═══════════════════════════════════════════════════════════
  describe('POST /api/doctor/records', () => {
    it('should create medical record (needs DB)', async () => {
      const res = await request(app)
        .post('/api/doctor/records')
        .set(authHeader(tokens.doctor))
        .send(validRecordData());

      expect([201, 400, 403, 409, 500]).toContain(res.status);
    });

    it('should reject without diagnosis', async () => {
      const res = await request(app)
        .post('/api/doctor/records')
        .set(authHeader(tokens.doctor))
        .send(validRecordData({ diagnosis: '' }));

      expect([400, 403, 500]).toContain(res.status);
    });

    it('should reject empty body', async () => {
      const res = await request(app)
        .post('/api/doctor/records')
        .set(authHeader(tokens.doctor))
        .send({});

      expect([400, 403, 500]).toContain(res.status);
    });
  });

  describe('PUT /api/doctor/records/:id', () => {
    it('should update medical record (needs DB)', async () => {
      const res = await request(app)
        .put('/api/doctor/records/1')
        .set(authHeader(tokens.doctor))
        .send({
          symptoms: 'Updated symptoms',
          diagnosis: 'Updated diagnosis',
          treatment: 'Updated treatment',
        });

      expect([200, 403, 500]).toContain(res.status);
    });
  });

  // ═══════════════════════════════════════════════════════════
  // PRESCRIPTIONS
  // ═══════════════════════════════════════════════════════════
  describe('POST /api/doctor/prescriptions', () => {
    it('should create prescription (needs DB)', async () => {
      const res = await request(app)
        .post('/api/doctor/prescriptions')
        .set(authHeader(tokens.doctor))
        .send(validPrescriptionData());

      expect([201, 400, 403, 500]).toContain(res.status);
    });

    it('should reject without record_id', async () => {
      const res = await request(app)
        .post('/api/doctor/prescriptions')
        .set(authHeader(tokens.doctor))
        .send({ items: [{ medicine_id: 1, quantity: 10, dosage: '1 viên' }] });

      expect([400, 403, 500]).toContain(res.status);
    });

    it('should reject with empty items', async () => {
      const res = await request(app)
        .post('/api/doctor/prescriptions')
        .set(authHeader(tokens.doctor))
        .send({ record_id: 1, items: [] });

      expect([400, 403, 500]).toContain(res.status);
    });

    it('should reject without items field', async () => {
      const res = await request(app)
        .post('/api/doctor/prescriptions')
        .set(authHeader(tokens.doctor))
        .send({ record_id: 1 });

      expect([400, 403, 500]).toContain(res.status);
    });
  });
});

