const { pool } = require('../config/database')

const Appointment = {
  async create(data) {
    const { full_name, phone, email, department, date, time, reason } = data
    const [result] = await pool.query(
      `INSERT INTO appointments (full_name, phone, email, department, appointment_date, appointment_time, reason)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [full_name, phone, email, department, date, time, reason]
    )
    return { id: result.insertId, ...data }
  },

  async getByPhone(phone) {
    const [rows] = await pool.query(
      'SELECT * FROM appointments WHERE phone = ? ORDER BY created_at DESC',
      [phone]
    )
    return rows
  }
}

module.exports = Appointment
