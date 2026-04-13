// frontend/user/src/services/patientService.js
import api from './api';

const patientService = {
  // Dashboard
  getDashboard: () => api.get('/user/dashboard'),

  // Appointments
  getMyAppointments: () => api.get('/user/appointments'),
  createAppointment: (data) => api.post('/user/appointments', data),
  getAppointmentDetail: (id) => api.get(`/user/appointments/${id}`),
  cancelAppointment: (id, reason) => api.patch(`/user/appointments/${id}/cancel`, { reason }),

  // Medical Records
  getMyRecords: () => api.get('/user/medical-records'),
  getRecordDetail: (id) => api.get(`/user/medical-records/${id}`),

  // Prescriptions
  getMyPrescriptions: () => api.get('/user/prescriptions'),
};

export default patientService;
