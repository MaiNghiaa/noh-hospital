const { pool } = require('../../config/db')

const News = {
  async getAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit
    const [rows] = await pool.query(
      'SELECT * FROM news ORDER BY published_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    )
    const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM news')
    return { data: rows, total, page, limit }
  },

  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM news WHERE id = ?', [id])
    return rows[0] || null
  },

  async getByCategory(category) {
    const [rows] = await pool.query(
      'SELECT * FROM news WHERE category = ? ORDER BY published_at DESC',
      [category]
    )
    return rows
  }
}

module.exports = News
