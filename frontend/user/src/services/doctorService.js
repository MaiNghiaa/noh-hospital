import api from './api'

const doctorService = {
  getAll: ({ page = 1, limit = 12, department } = {}) =>
    api.get(`/doctors?page=${page}&limit=${limit}${department ? `&department=${department}` : ''}`),
  getById: (id) => api.get(`/doctors/${id}`),
  search: ({ q, page = 1, limit = 12 } = {}) =>
    api.get(`/doctors/search?q=${encodeURIComponent(q || '')}&page=${page}&limit=${limit}`)
}

export default doctorService
