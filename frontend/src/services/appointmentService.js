import api from './api'

const appointmentService = {
  create: (data) => api.post('/appointments', data),
  getByPhone: (phone) => api.get(`/appointments?phone=${phone}`)
}

export default appointmentService
