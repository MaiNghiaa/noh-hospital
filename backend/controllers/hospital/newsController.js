const News = require('../../models/hospital/News')

const mockNews = [
  { id: 1, title: 'Hàng trăm bác sĩ ra quân khám miễn phí', category: 'su-kien', published_at: '2026-04-07' },
  { id: 2, title: 'Viêm tai giữa mãn tính: Cảnh báo biến chứng', category: 'nghien-cuu', published_at: '2026-03-25' }
]

const newsController = {
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10, category } = req.query
      let data
      try {
        data = category
          ? await News.getByCategory(category)
          : await News.getAll(Number(page), Number(limit))
      } catch {
        const filtered = category ? mockNews.filter(n => n.category === category) : mockNews
        data = { data: filtered, total: filtered.length, page: 1, limit: 10 }
      }
      res.json({ success: true, ...data })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  },

  async getById(req, res) {
    try {
      let data
      try {
        data = await News.getById(req.params.id)
      } catch {
        data = mockNews.find(n => n.id === Number(req.params.id))
      }
      if (!data) return res.status(404).json({ success: false, message: 'Không tìm thấy' })
      res.json({ success: true, data })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}

module.exports = newsController
