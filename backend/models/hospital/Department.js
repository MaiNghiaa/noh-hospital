const { pool } = require('../../config/db')

const Department = {
  // Lấy tất cả chuyên khoa
  async getAll() {
    const [rows] = await pool.query(
      'SELECT * FROM departments ORDER BY type, name'
    )
    return rows
  },

  // Lấy theo ID
  async getById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM departments WHERE id = ?',
      [id]
    )
    return rows[0] || null
  },

  // Lấy theo slug
  async getBySlug(slug) {
    const [rows] = await pool.query(
      'SELECT * FROM departments WHERE slug = ?',
      [slug]
    )
    return rows[0] || null
  },

  // Lấy theo loại (lam-sang / can-lam-sang)
  async getByType(type) {
    const [rows] = await pool.query(
      'SELECT * FROM departments WHERE type = ? ORDER BY name',
      [type]
    )
    return rows
  }
}

module.exports = Department
