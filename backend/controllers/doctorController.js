const Doctor = require('../models/Doctor')

const mockDoctors = [
  { id: 1, name: 'PGS-TS. Phạm Tuấn Cảnh', specialty: 'Tai mũi họng', department_name: 'Khoa PT Tạo hình' },
  { id: 2, name: 'TS.BSCC. Lê Anh Tuấn', specialty: 'Tai Mũi Họng', department_name: 'Khoa TMH Trẻ em' }
]

const doctorController = {
  async getAll(req, res) {
    try {
      let data
      try {
        const { department } = req.query
        data = department ? await Doctor.getByDepartment(department) : await Doctor.getAll()
      } catch {
        data = mockDoctors
      }
      res.json({ success: true, data })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  },

  async getById(req, res) {
    try {
      let data
      try {
        data = await Doctor.getById(req.params.id)
      } catch {
        data = mockDoctors.find(d => d.id === Number(req.params.id))
      }
      if (!data) return res.status(404).json({ success: false, message: 'Không tìm thấy' })
      res.json({ success: true, data })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  },

  async search(req, res) {
    try {
      const { q } = req.query
      if (!q) return res.json({ success: true, data: [] })
      let data
      try {
        data = await Doctor.search(q)
      } catch {
        data = mockDoctors.filter(d =>
          d.name.toLowerCase().includes(q.toLowerCase())
        )
      }
      res.json({ success: true, data })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

module.exports = doctorController
