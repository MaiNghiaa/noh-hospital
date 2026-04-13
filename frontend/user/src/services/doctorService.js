import api from './api'

const doctorService = {
  getAll: () => api.get('/doctors'),
  getById: (id) => api.get(`/doctors/${id}`),
  getByDepartment: (deptId) => api.get(`/doctors?department=${deptId}`),
  search: (query) => api.get(`/doctors/search?q=${query}`)
}

export default doctorService
