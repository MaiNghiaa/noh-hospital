// tests/flow/appointmentConfirmReschedule.test.js
// ============================================================
// FLOW TESTS (mock DB):
// - Doctor can confirm their own appointment (or take unassigned)
// - Doctor cannot confirm appointment assigned to another doctor
// - Admin can reschedule an appointment with conflict checks
// ============================================================

const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');

const { mockDb, tokens } = require('../setup/globalSetup');
const { authHeader } = require('../setup/helpers');

function createAdminApp() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());

  const { adminRoutes } = require('../../routes/admin');
  app.use('/api/admin', adminRoutes);

  // error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
  });

  return app;
}

describe('Flow: confirm & reschedule appointments', () => {
  let app;
  let executeImpl;

  beforeAll(() => {
    app = createAdminApp();
  });

  beforeEach(() => {
    // Reset data to defaults for each test
    mockDb.reset();
    executeImpl = mockDb.execute;
  });

  afterEach(() => {
    mockDb.execute = executeImpl;
  });

  function setExecute(handler) {
    mockDb.execute = jest.fn(handler);
  }

  it('Doctor can confirm appointment assigned to them', async () => {
    // Appointment #1: pending, doctor_id=1 matches tokens.doctor doctor_id=1
    setExecute(async (query, params = []) => {
      if (query.startsWith('SELECT id, status, doctor_id, appointment_date, appointment_time FROM appointments WHERE id = ?')) {
        return [[{ id: 1, status: 'pending', doctor_id: 1, appointment_date: '2026-04-20', appointment_time: '09:00:00' }]];
      }
      if (query.startsWith('SELECT id, is_active FROM doctors WHERE id = ?')) {
        return [[{ id: params[0], is_active: 1 }]];
      }
      if (query.includes('FROM appointments') && query.includes('status IN (\'confirmed\', \'in_progress\')')) {
        return [[]]; // no conflicts
      }
      if (query.startsWith('UPDATE appointments')) {
        return [[{ affectedRows: 1 }]];
      }
      throw new Error(`Unexpected query: ${query}`);
    });

    const res = await request(app)
      .patch('/api/admin/appointments/1/confirm')
      .set(authHeader(tokens.doctor))
      .send({});

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/xác nhận/i);
  });

  it('Doctor can take & confirm an unassigned pending appointment (doctor_id null)', async () => {
    setExecute(async (query, params = []) => {
      if (query.startsWith('SELECT id, status, doctor_id, appointment_date, appointment_time FROM appointments WHERE id = ?')) {
        return [[{ id: 3, status: 'pending', doctor_id: null, appointment_date: '2026-04-21', appointment_time: '10:00:00' }]];
      }
      if (query.startsWith('SELECT id, is_active FROM doctors WHERE id = ?')) {
        return [[{ id: params[0], is_active: 1 }]];
      }
      if (query.includes('FROM appointments') && query.includes('status IN (\'confirmed\', \'in_progress\')')) {
        return [[]];
      }
      if (query.startsWith('UPDATE appointments')) {
        return [[{ affectedRows: 1 }]];
      }
      throw new Error(`Unexpected query: ${query}`);
    });

    const res = await request(app)
      .patch('/api/admin/appointments/3/confirm')
      .set(authHeader(tokens.doctor))
      .send({});

    expect(res.status).toBe(200);
  });

  it('Doctor cannot confirm appointment assigned to another doctor', async () => {
    setExecute(async (query) => {
      if (query.startsWith('SELECT id, status, doctor_id, appointment_date, appointment_time FROM appointments WHERE id = ?')) {
        return [[{ id: 2, status: 'pending', doctor_id: 2, appointment_date: '2026-04-22', appointment_time: '14:00:00' }]];
      }
      throw new Error(`Unexpected query: ${query}`);
    });

    const res = await request(app)
      .patch('/api/admin/appointments/2/confirm')
      .set(authHeader(tokens.doctor))
      .send({});

    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/không thể xác nhận/i);
  });

  it('Admin can reschedule a pending/confirmed appointment when no conflict', async () => {
    setExecute(async (query, params = []) => {
      if (query.includes('FROM appointments') && query.includes('WHERE id = ?') && query.includes('LIMIT 1') && query.includes('appointment_time')) {
        return [[{ id: 2, status: 'confirmed', doctor_id: 2, appointment_date: '2026-04-22', appointment_time: '14:00:00' }]];
      }
      if (query.startsWith('SELECT id, is_active FROM doctors WHERE id = ?')) {
        return [[{ id: params[0], is_active: 1 }]];
      }
      if (query.includes('FROM appointments') && query.includes('status IN (\'confirmed\', \'in_progress\')') && query.includes('id <> ?')) {
        return [[]]; // no conflicts
      }
      if (query.startsWith('UPDATE appointments') && query.includes('SET appointment_date')) {
        return [[{ affectedRows: 1 }]];
      }
      throw new Error(`Unexpected query: ${query}`);
    });

    const res = await request(app)
      .patch('/api/admin/appointments/2/reschedule')
      .set(authHeader(tokens.superAdmin))
      .send({ appointment_date: '2026-05-01', appointment_time: '08:30:00', doctor_id: 2 });

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/đổi lịch/i);
  });

  it('Admin reschedule should reject when doctor time conflicts', async () => {
    setExecute(async (query, params = []) => {
      if (query.includes('FROM appointments') && query.includes('WHERE id = ?') && query.includes('LIMIT 1') && query.includes('appointment_time')) {
        return [[{ id: 2, status: 'confirmed', doctor_id: 2, appointment_date: '2026-04-22', appointment_time: '14:00:00' }]];
      }
      if (query.startsWith('SELECT id, is_active FROM doctors WHERE id = ?')) {
        return [[{ id: params[0], is_active: 1 }]];
      }
      if (query.includes('FROM appointments') && query.includes('status IN (\'confirmed\', \'in_progress\')') && query.includes('id <> ?')) {
        return [[{ id: 99 }]]; // conflict exists
      }
      throw new Error(`Unexpected query: ${query}`);
    });

    const res = await request(app)
      .patch('/api/admin/appointments/2/reschedule')
      .set(authHeader(tokens.superAdmin))
      .send({ appointment_date: '2026-05-01', appointment_time: '08:30:00', doctor_id: 2 });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/đã có lịch/i);
  });
});

