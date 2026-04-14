// tests/hospital/appointments.test.js
// ============================================================
// LUỒNG: Đặt lịch khám (Public API - không cần đăng nhập)
// - Tạo lịch hẹn mới
// - Validate dữ liệu bắt buộc
// - Tra cứu lịch hẹn theo SĐT
// ============================================================

const request = require('supertest');
const { createTestApp } = require('../setup/globalSetup');
const { validAppointmentData } = require('../setup/helpers');

const app = createTestApp();

describe('Appointments - Public API', () => {
  // ─── POST /api/appointments ────────────────────────────────
  describe('POST /api/appointments', () => {
    it('should create appointment with valid data', async () => {
      const data = validAppointmentData();
      const res = await request(app).post('/api/appointments').send(data);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('data');
    });

    it('should reject when missing full_name', async () => {
      const data = validAppointmentData({ full_name: '' });
      const res = await request(app).post('/api/appointments').send(data);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject when missing phone', async () => {
      const data = validAppointmentData({ phone: '' });
      const res = await request(app).post('/api/appointments').send(data);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject when missing department', async () => {
      const data = validAppointmentData({ department: '' });
      const res = await request(app).post('/api/appointments').send(data);

      expect(res.status).toBe(400);
    });

    it('should reject when missing date', async () => {
      const data = validAppointmentData({ date: '' });
      const res = await request(app).post('/api/appointments').send(data);

      expect(res.status).toBe(400);
    });

    it('should accept appointment without optional fields (email, time, reason)', async () => {
      const data = {
        full_name: 'Nguyễn Văn Optional',
        phone: '0911222333',
        department: 'Khoa Tai',
        date: '2026-06-01',
      };
      const res = await request(app).post('/api/appointments').send(data);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('should reject completely empty body', async () => {
      const res = await request(app).post('/api/appointments').send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // ─── GET /api/appointments?phone=xxx ───────────────────────
  describe('GET /api/appointments?phone=', () => {
    it('should return appointments for a phone number', async () => {
      const res = await request(app).get('/api/appointments').query({ phone: '0912345678' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should return 400 when phone is missing', async () => {
      const res = await request(app).get('/api/appointments');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return empty array for non-existent phone', async () => {
      const res = await request(app).get('/api/appointments').query({ phone: '0000000000' });

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(0);
    });
  });
});

