// tests/hospital/departments.test.js
// ============================================================
// LUỒNG: Chuyên khoa (Public API)
// - Lấy danh sách chuyên khoa
// - Lọc theo loại (lâm sàng / cận lâm sàng)
// - Xem chi tiết chuyên khoa
// - Xử lý chuyên khoa không tồn tại
// ============================================================

const request = require('supertest');
const { createTestApp } = require('../setup/globalSetup');

const app = createTestApp();

describe('Departments - Public API', () => {
  // ─── GET /api/departments ──────────────────────────────────
  describe('GET /api/departments', () => {
    it('should return list of departments', async () => {
      const res = await request(app).get('/api/departments');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should filter by type = lam-sang', async () => {
      const res = await request(app).get('/api/departments').query({ type: 'lam-sang' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      // Mỗi item trả về phải là loại lâm sàng (nếu DB mock trả về data)
      if (res.body.data.length > 0) {
        res.body.data.forEach((dept) => {
          expect(dept.type).toBe('lam-sang');
        });
      }
    });

    it('should filter by type = can-lam-sang', async () => {
      const res = await request(app).get('/api/departments').query({ type: 'can-lam-sang' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      if (res.body.data.length > 0) {
        res.body.data.forEach((dept) => {
          expect(dept.type).toBe('can-lam-sang');
        });
      }
    });
  });

  // ─── GET /api/departments/:id ──────────────────────────────
  describe('GET /api/departments/:id', () => {
    it('should return department detail with valid ID', async () => {
      const res = await request(app).get('/api/departments/1');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('name');
    });

    it('should return 404 for non-existent department', async () => {
      const res = await request(app).get('/api/departments/99999');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('success', false);
    });

    it('should handle invalid ID format', async () => {
      const res = await request(app).get('/api/departments/abc');

      // Tùy controller xử lý, có thể 404 hoặc 500
      expect([400, 404, 500]).toContain(res.status);
    });
  });
});

