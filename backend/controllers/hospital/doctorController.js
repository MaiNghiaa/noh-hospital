const Doctor = require('../../models/hospital/Doctor')

const mockDoctors = [
  { id: 1, name: 'PGS-TS. Phạm Tuấn Cảnh', specialty: 'Tai mũi họng', department_name: 'Khoa PT Tạo hình' },
  { id: 2, name: 'TS.BSCC. Lê Anh Tuấn', specialty: 'Tai Mũi Họng', department_name: 'Khoa TMH Trẻ em' }
]

const doctorController = {
  async getAll(req, res) {
    try {
      let payload
      try {
        const { department, page, limit } = req.query
        const wantsPaging = page !== undefined || limit !== undefined

        if (wantsPaging) {
          payload = await Doctor.getAllPaged(Number(page) || 1, Number(limit) || 12, department || null)
        } else if (department) {
          const rows = await Doctor.getByDepartment(department)
          payload = { data: rows, total: rows.length, page: 1, limit: rows.length }
        } else {
          const rows = await Doctor.getAll()
          payload = { data: rows, total: rows.length, page: 1, limit: rows.length }
        }
      } catch {
        payload = { data: mockDoctors, total: mockDoctors.length, page: 1, limit: mockDoctors.length }
      }
      res.json({ success: true, ...payload })
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
      const { q, page, limit } = req.query
      if (!q) return res.json({ success: true, data: [], total: 0, page: 1, limit: Number(limit) || 12 })
      let payload
      try {
        payload = await Doctor.searchPaged(q, Number(page) || 1, Number(limit) || 12)
      } catch {
        const filtered = mockDoctors.filter(d => d.name.toLowerCase().includes(q.toLowerCase()))
        payload = { data: filtered, total: filtered.length, page: 1, limit: filtered.length }
      }
      res.json({ success: true, ...payload })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

module.exports = doctorController
