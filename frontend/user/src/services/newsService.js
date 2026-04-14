import api from './api'

const newsService = {
  getAll: (page = 1, limit = 10) => api.get(`/news?page=${page}&limit=${limit}`),
  getById: (id) => api.get(`/news/${id}`),
  getBySlug: (slug) => api.get(`/news/slug/${slug}`),
  getByCategory: (category, page = 1, limit = 10) => api.get(`/news?category=${category}&page=${page}&limit=${limit}`)
}

export default newsService
