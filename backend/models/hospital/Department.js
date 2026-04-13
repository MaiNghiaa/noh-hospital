const { pool } = require('../../config/db')

const Department = {
  // Lấy tất cả chuyên khoa
  async getAll() {
    const [rows] = await pool.query(
      `SELECT
         d.*,
         d.sort_order as display_order,
         IF(d.is_active = 1, 'active', 'inactive') as status
       FROM departments d
       ORDER BY d.type, d.sort_order, d.name`
    )
    return rows
  },

  // Lấy theo ID
  async getById(id) {
    const [rows] = await pool.query(
      `SELECT
         d.*,
         d.sort_order as display_order,
         IF(d.is_active = 1, 'active', 'inactive') as status
       FROM departments d
       WHERE d.id = ?`,
      [id]
    )
    return rows[0] || null
  },

  // Lấy theo slug
  async getBySlug(slug) {
    const [rows] = await pool.query(
      `SELECT
         d.*,
         d.sort_order as display_order,
         IF(d.is_active = 1, 'active', 'inactive') as status
       FROM departments d
       WHERE d.slug = ?`,
      [slug]
    )
    return rows[0] || null
  },

  // Lấy theo loại (lam-sang / can-lam-sang)
  async getByType(type) {
    const [rows] = await pool.query(
      `SELECT
         d.*,
         d.sort_order as display_order,
         IF(d.is_active = 1, 'active', 'inactive') as status
       FROM departments d
       WHERE d.type = ?
       ORDER BY d.sort_order, d.name`,
      [type]
    )
    return rows
  }
}

module.exports = Department
