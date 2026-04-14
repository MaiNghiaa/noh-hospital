// tests/hospital/errorHandling.test.js
// ============================================================
// LUỒNG: Xử lý lỗi chung
// - 404 Route not found
// - Invalid JSON body
// - Method not allowed
// ============================================================

const request = require('supertest');
const { createTestApp } = require('../setup/globalSetup');

const app = createTestApp();

describe('Error Handling', () => {
  describe('404 - Route not found', () => {
    it('should return 404 for non-existent route', async () => {
      const res = await request(app).get('/api/khong-ton-tai');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message');
    });

    it('should return 404 for random path', async () => {
      const res = await request(app).get('/random/path/here');

      expect(res.status).toBe(404);
    });

    it('should return JSON response for 404', async () => {
      const res = await request(app).get('/api/nothing');

      expect(res.headers['content-type']).toMatch(/json/);
    });
  });

  describe('Invalid requests', () => {
    it('should handle POST with invalid JSON body', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }');

      // Express sẽ trả 400 cho JSON parse error
      expect([400, 500]).toContain(res.status);
    });

    it('should handle very long URL', async () => {
      const longPath = '/api/' + 'a'.repeat(5000);
      const res = await request(app).get(longPath);

      expect([404, 414, 500]).toContain(res.status);
    });
  });
});

