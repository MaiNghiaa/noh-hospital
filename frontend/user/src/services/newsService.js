import api from './api'

const newsService = {
  getAll: (page = 1, limit = 10) => api.get(`/news?page=${page}&limit=${limit}`),
  getById: (id) => api.get(`/news/${id}`),
  getByCategory: (category) => api.get(`/news?category=${category}`)
}

export default newsService
