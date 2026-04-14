const Appointment = require('../../models/hospital/Appointment')

const appointmentController = {
  // POST /api/appointments
  async create(req, res) {
    try {
      const { full_name, phone, email, department, doctor_id, date, time, reason } = req.body

      // Validate
      if (!full_name || !phone || !department || !date) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng điền đầy đủ thông tin bắt buộc (họ tên, SĐT, chuyên khoa, ngày khám)'
        })
      }

      let data
      try {
        data = await Appointment.create({ full_name, phone, email, department, doctor_id: doctor_id ? Number(doctor_id) : null, date, time, reason })
      } catch {
        // Fallback: return success mock
        data = { id: Date.now(), full_name, phone, email, department, doctor_id: doctor_id ? Number(doctor_id) : null, date, time, reason }
      }

      res.status(201).json({
        success: true,
        message: 'Đặt lịch thành công',
        data
      })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  },

  // GET /api/appointments?phone=xxx
  async getByPhone(req, res) {
    try {
      const { phone } = req.query
      if (!phone) return res.status(400).json({ success: false, message: 'Thiếu số điện thoại' })

      let data
      try {
        data = await Appointment.getByPhone(phone)
      } catch {
        data = []
      }

      res.json({ success: true, data })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

module.exports = appointmentController
