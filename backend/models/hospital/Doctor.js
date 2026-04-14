const { pool } = require('../../config/db')

function toInt(value, fallback) {
  const n = Number.parseInt(value, 10)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

const Doctor = {
  async getAll() {
    const [rows] = await pool.query(
      `SELECT
         d.*,
         dep.name as department_name,
         IF(d.is_active = 1, 'active', 'inactive') as status
       FROM doctors d
       LEFT JOIN departments dep ON d.department_id = dep.id
       ORDER BY d.is_active DESC, d.sort_order, d.name`
    )
    return rows
  },

  async getAllPaged(page = 1, limit = 12, departmentId = null) {
    const safePage = toInt(page, 1)
    const safeLimit = Math.min(toInt(limit, 12), 100)
    const offset = (safePage - 1) * safeLimit

    const where = []
    const params = []
    if (departmentId) {
      where.push('d.department_id = ?')
      params.push(departmentId)
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''

    const [rows] = await pool.query(
      `SELECT
         d.*,
         dep.name as department_name,
         IF(d.is_active = 1, 'active', 'inactive') as status
       FROM doctors d
       LEFT JOIN departments dep ON d.department_id = dep.id
       ${whereSql}
       ORDER BY d.is_active DESC, d.sort_order, d.name
       LIMIT ${safeLimit} OFFSET ${offset}`,
      params
    )

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total
       FROM doctors d
       ${whereSql}`,
      params
    )

    return { data: rows, total, page: safePage, limit: safeLimit }
  },

  async getById(id) {
    const [rows] = await pool.query(
      `SELECT
         d.*,
         dep.name as department_name,
         IF(d.is_active = 1, 'active', 'inactive') as status
       FROM doctors d
       LEFT JOIN departments dep ON d.department_id = dep.id
       WHERE d.id = ?`,
      [id]
    )
    return rows[0] || null
  },

  async getByDepartment(departmentId) {
    const [rows] = await pool.query(
      `SELECT
         d.*,
         IF(d.is_active = 1, 'active', 'inactive') as status
       FROM doctors d
       WHERE d.department_id = ?
       ORDER BY d.is_active DESC, d.sort_order, d.name`,
      [departmentId]
    )
    return rows
  },

  async search(query) {
    const like = `%${query}%`
    const [rows] = await pool.query(
      `SELECT
         d.*,
         dep.name as department_name,
         IF(d.is_active = 1, 'active', 'inactive') as status
       FROM doctors d
       LEFT JOIN departments dep ON d.department_id = dep.id
       WHERE d.name LIKE ?
          OR d.specialty LIKE ?
          OR dep.name LIKE ?
          OR d.email LIKE ?
          OR d.phone LIKE ?
       ORDER BY d.is_active DESC, d.sort_order, d.name`,
      [like, like, like, like, like]
    )
    return rows
  },

  async searchPaged(query, page = 1, limit = 12) {
    const safePage = toInt(page, 1)
    const safeLimit = Math.min(toInt(limit, 12), 100)
    const offset = (safePage - 1) * safeLimit
    const like = `%${query}%`

    const [rows] = await pool.query(
      `SELECT
         d.*,
         dep.name as department_name,
         IF(d.is_active = 1, 'active', 'inactive') as status
       FROM doctors d
       LEFT JOIN departments dep ON d.department_id = dep.id
       WHERE d.name LIKE ?
          OR d.specialty LIKE ?
          OR dep.name LIKE ?
          OR d.email LIKE ?
          OR d.phone LIKE ?
       ORDER BY d.is_active DESC, d.sort_order, d.name
       LIMIT ${safeLimit} OFFSET ${offset}`,
      [like, like, like, like, like]
    )

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total
       FROM doctors d
       LEFT JOIN departments dep ON d.department_id = dep.id
       WHERE d.name LIKE ?
          OR d.specialty LIKE ?
          OR dep.name LIKE ?
          OR d.email LIKE ?
          OR d.phone LIKE ?`,
      [like, like, like, like, like]
    )

    return { data: rows, total, page: safePage, limit: safeLimit }
  }
}

module.exports = Doctor
