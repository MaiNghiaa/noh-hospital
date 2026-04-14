// tests/hospital/doctors.test.js
// ============================================================
// LUỒNG: Bác sĩ / Chuyên gia (Public API)
// - Lấy danh sách bác sĩ
// - Lọc theo chuyên khoa
// - Tìm kiếm bác sĩ
// - Xem chi tiết bác sĩ
// ============================================================

const request = require('supertest');
const { createTestApp } = require('../setup/globalSetup');

const app = createTestApp();

describe('Doctors - Public API', () => {
  // ─── GET /api/doctors ──────────────────────────────────────
  describe('GET /api/doctors', () => {
    it('should return list of doctors', async () => {
      const res = await request(app).get('/api/doctors');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should filter by department', async () => {
      const res = await request(app).get('/api/doctors').query({ department: 1 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // ─── GET /api/doctors/search ───────────────────────────────
  describe('GET /api/doctors/search', () => {
    it('should search doctors by keyword', async () => {
      const res = await request(app).get('/api/doctors/search').query({ q: 'Phạm' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should return empty array when no query', async () => {
      const res = await request(app).get('/api/doctors/search');

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });

    it('should return empty for non-matching query', async () => {
      const res = await request(app).get('/api/doctors/search').query({ q: 'XYZKhongTonTai' });

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(0);
    });
  });

  // ─── GET /api/doctors/:id ─────────────────────────────────
  describe('GET /api/doctors/:id', () => {
    it('should return doctor detail with valid ID', async () => {
      const res = await request(app).get('/api/doctors/1');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('name');
    });

    it('should return 404 for non-existent doctor', async () => {
      const res = await request(app).get('/api/doctors/99999');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});

