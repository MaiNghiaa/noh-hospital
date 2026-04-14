// tests/hospital/news.test.js
// ============================================================
// LUỒNG: Tin tức (Public API)
// - Lấy danh sách tin tức (phân trang)
// - Lọc theo category
// - Xem chi tiết tin tức
// ============================================================

const request = require('supertest');
const { createTestApp } = require('../setup/globalSetup');

const app = createTestApp();

describe('News - Public API', () => {
  // ─── GET /api/news ─────────────────────────────────────────
  describe('GET /api/news', () => {
    it('should return list of news with pagination', async () => {
      const res = await request(app).get('/api/news');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
    });

    it('should support pagination params', async () => {
      const res = await request(app).get('/api/news').query({ page: 1, limit: 5 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should filter by category', async () => {
      const res = await request(app).get('/api/news').query({ category: 'su-kien' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should return empty for non-existent category', async () => {
      const res = await request(app).get('/api/news').query({ category: 'khong-ton-tai' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // ─── GET /api/news/:id ────────────────────────────────────
  describe('GET /api/news/:id', () => {
    it('should return news detail with valid ID', async () => {
      const res = await request(app).get('/api/news/1');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('title');
    });

    it('should return 404 for non-existent news', async () => {
      const res = await request(app).get('/api/news/99999');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});

