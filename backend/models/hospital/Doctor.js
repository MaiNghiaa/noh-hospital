const { pool } = require('../../config/db')

const Doctor = {
  async getAll() {
    const [rows] = await pool.query(
      `SELECT d.*, dep.name as department_name
       FROM doctors d
       LEFT JOIN departments dep ON d.department_id = dep.id
       ORDER BY d.name`
    )
    return rows
  },

  async getById(id) {
    const [rows] = await pool.query(
      `SELECT d.*, dep.name as department_name
       FROM doctors d
       LEFT JOIN departments dep ON d.department_id = dep.id
       WHERE d.id = ?`,
      [id]
    )
    return rows[0] || null
  },

  async getByDepartment(departmentId) {
    const [rows] = await pool.query(
      'SELECT * FROM doctors WHERE department_id = ? ORDER BY name',
      [departmentId]
    )
    return rows
  },

  async search(query) {
    const like = `%${query}%`
    const [rows] = await pool.query(
      `SELECT d.*, dep.name as department_name
       FROM doctors d
       LEFT JOIN departments dep ON d.department_id = dep.id
       WHERE d.name LIKE ? OR d.specialty LIKE ? OR dep.name LIKE ?
       ORDER BY d.name`,
      [like, like, like]
    )
    return rows
  }
}

module.exports = Doctor
