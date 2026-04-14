const Department = require('../../models/hospital/Department')

// Mock data khi không có DB
const mockDepartments = [
  { id: 1, name: 'Khoa Họng - Thanh quản', slug: 'khoa-hong-thanh-quan', type: 'lam-sang', description: 'Khám chữa bệnh vùng họng – thanh quản' },
  { id: 2, name: 'Khoa Tai', slug: 'khoa-tai', type: 'lam-sang', description: 'Khám chữa bệnh chuyên sâu về tai' },
  { id: 3, name: 'Khoa Mũi Xoang', slug: 'khoa-mui-xoang', type: 'lam-sang', description: 'Điều trị các bệnh lý mũi xoang' },
  { id: 4, name: 'Khoa Xét nghiệm', slug: 'khoa-xet-nghiem', type: 'can-lam-sang', description: 'Xét nghiệm tổng hợp' }
]

const departmentController = {
  // GET /api/departments
  async getAll(req, res) {
    try {
      const { type } = req.query
      let data
      try {
        data = type ? await Department.getByType(type) : await Department.getAll()
      } catch {
        // Fallback to mock
        data = type ? mockDepartments.filter(d => d.type === type) : mockDepartments
      }
      res.json({ success: true, data })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  },

  // GET /api/departments/:id
  async getById(req, res) {
    try {
      let data
      try {
        data = await Department.getById(req.params.id)
      } catch {
        data = mockDepartments.find(d => d.id === Number(req.params.id))
      }
      if (!data) return res.status(404).json({ success: false, message: 'Không tìm thấy' })
      res.json({ success: true, data })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  },

  // GET /api/departments/slug/:slug
  async getBySlug(req, res) {
    try {
      let data
      try {
        data = await Department.getBySlug(req.params.slug)
      } catch {
        data = mockDepartments.find(d => d.slug === req.params.slug)
      }
      if (!data) return res.status(404).json({ success: false, message: 'Không tìm thấy' })
      res.json({ success: true, data })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

module.exports = departmentController
