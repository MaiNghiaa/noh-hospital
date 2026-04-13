import api from './api'

const departmentService = {
  getAll: () => api.get('/departments'),
  getById: (id) => api.get(`/departments/${id}`),
  getByType: (type) => api.get(`/departments?type=${type}`)
}

export default departmentService
