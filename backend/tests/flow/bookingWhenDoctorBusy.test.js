// tests/flow/bookingWhenDoctorBusy.test.js
// ============================================================
// FLOW TESTS (mock DB):
// - Patient can book even when chosen doctor is in_progress
// - Response includes doctorBusy = true
// ============================================================

const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');

const { mockDb, tokens } = require('../setup/globalSetup');
const { authHeader } = require('../setup/helpers');

function createUserApp() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());

  const userRoutes = require('../../routes/user');
  app.use('/api/user', userRoutes);

  // error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    res.status(500).json({ success: false, message: err.message });
  });

  return app;
}

describe('Flow: booking when doctor is busy', () => {
  let app;
  let executeImpl;

  beforeAll(() => {
    app = createUserApp();
  });

  beforeEach(() => {
    mockDb.reset();
    executeImpl = mockDb.execute;
  });

  afterEach(() => {
    mockDb.execute = executeImpl;
  });

  function setExecute(handler) {
    mockDb.execute = jest.fn(handler);
  }

  it('Logged-in patient can book appointment even if doctor is in_progress (doctorBusy=true)', async () => {
    setExecute(async (query, params = []) => {
      // user info
      if (query === 'SELECT full_name, phone, email FROM users WHERE id = ?') {
        return [[{ full_name: 'Nguyễn Văn Bệnh Nhân', phone: '0912345678', email: 'patient@gmail.com' }]];
      }
      // patient_id
      if (query === 'SELECT id FROM patients WHERE user_id = ?') {
        return [[{ id: 1 }]];
      }
      // busy check
      if (query.includes("FROM appointments WHERE doctor_id = ? AND status = 'in_progress'")) {
        expect(params[0]).toBe(1);
        return [[{ id: 999 }]]; // doctor is busy
      }
      // insert appointment
      if (query.startsWith('INSERT INTO appointments')) {
        // Ensure doctor_id still kept (admin can reschedule later)
        expect(params[4]).toBe(1);
        return [[{ insertId: 123 }]];
      }
      throw new Error(`Unexpected query: ${query}`);
    });

    const res = await request(app)
      .post('/api/user/appointments')
      .set(authHeader(tokens.patient))
      .send({
        department: 'Khoa Tai',
        doctor_id: 1,
        appointment_date: '2026-05-10',
        appointment_time: '10:00',
        reason: 'Kiểm tra',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('doctorBusy', true);
    expect(res.body.message).toMatch(/đang khám/i);
  });
});

