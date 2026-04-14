const { pool } = require('../../config/db')

function toInt(value, fallback) {
  const n = Number.parseInt(value, 10)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

const News = {
  async getAll(page = 1, limit = 10) {
    const safePage = toInt(page, 1)
    const safeLimit = Math.min(toInt(limit, 10), 100)
    const offset = (safePage - 1) * safeLimit

    const [rows] = await pool.query(
      `SELECT * FROM news
       WHERE is_published = 1
       ORDER BY published_at DESC
       LIMIT ${safeLimit} OFFSET ${offset}`
    )
    const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM news WHERE is_published = 1')
    return { data: rows, total, page: safePage, limit: safeLimit }
  },

  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM news WHERE id = ?', [id])
    return rows[0] || null
  },

  async getBySlug(slug) {
    const [rows] = await pool.query('SELECT * FROM news WHERE slug = ? AND is_published = 1', [slug])
    return rows[0] || null
  },

  async getByCategory(category, page = 1, limit = 10) {
    const safePage = toInt(page, 1)
    const safeLimit = Math.min(toInt(limit, 10), 100)
    const offset = (safePage - 1) * safeLimit

    const [rows] = await pool.query(
      `SELECT * FROM news
       WHERE category = ? AND is_published = 1
       ORDER BY published_at DESC
       LIMIT ${safeLimit} OFFSET ${offset}`,
      [category]
    )
    const [[{ total }]] = await pool.query(
      'SELECT COUNT(*) as total FROM news WHERE category = ? AND is_published = 1',
      [category]
    )
    return { data: rows, total, page: safePage, limit: safeLimit }
  },
}

module.exports = News
