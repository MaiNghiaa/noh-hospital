// tests/hospital/health.test.js
// ============================================================
// LUỒNG: Health Check API
// Kiểm tra server đang hoạt động bình thường
// ============================================================

const request = require('supertest');
const { createTestApp } = require('../setup/globalSetup');

const app = createTestApp();

describe('GET /api/health', () => {
  it('should return status ok', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('timestamp should be valid ISO string', async () => {
    const res = await request(app).get('/api/health');
    const date = new Date(res.body.timestamp);
    expect(date.toString()).not.toBe('Invalid Date');
  });
});

