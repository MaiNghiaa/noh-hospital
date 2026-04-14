// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/admin/auth');
const { requireRole } = require('../../middleware/admin/role');
const adminController = require('../../controllers/admin/adminController');
const reportController = require('../../controllers/admin/reportController');
const upload = require('../../middleware/admin/upload');

// All admin routes require authentication
router.use(auth);

// ==================== STATS ====================
router.get('/stats/overview', requireRole('admin', 'super_admin'), reportController.getOverview);
router.get('/stats/appointments', requireRole('admin', 'super_admin'), reportController.getAppointmentStats);
router.get('/stats/by-department', requireRole('admin', 'super_admin'), reportController.getByDepartment);
router.get('/stats/by-status', requireRole('admin', 'super_admin'), reportController.getByStatus);
router.get('/stats/top-doctors', requireRole('admin', 'super_admin'), reportController.getTopDoctors);
router.get('/stats/patients-growth', requireRole('admin', 'super_admin'), reportController.getPatientsGrowth);
router.get('/stats/patients', requireRole('admin', 'super_admin'), reportController.getPatientCount);
router.get('/stats/appointments/today', requireRole('admin', 'super_admin'), reportController.getTodayAppointments);
router.get('/stats/doctors/active', requireRole('admin', 'super_admin'), reportController.getActiveDoctors);
router.get('/stats/appointments/pending', requireRole('admin', 'super_admin'), reportController.getPendingAppointments);
router.get('/stats/appointments/monthly', requireRole('admin', 'super_admin'), reportController.getMonthlyAppointments);
router.get('/stats/departments', requireRole('admin', 'super_admin'), reportController.getDepartmentCount);
router.get('/stats/recent-appointments', requireRole('admin', 'super_admin'), reportController.getRecentAppointments);

// ==================== DOCTORS ====================
router.post('/doctors', requireRole('admin', 'super_admin'), adminController.createDoctor);
router.put('/doctors/:id', requireRole('admin', 'super_admin'), adminController.updateDoctor);
router.delete('/doctors/:id', requireRole('admin', 'super_admin'), adminController.deleteDoctor);
router.patch('/doctors/:id/toggle', requireRole('admin', 'super_admin'), adminController.toggleDoctor);
router.get('/doctors/available', requireRole('admin', 'super_admin'), adminController.getAvailableDoctors);

// ==================== APPOINTMENTS ====================
router.get('/appointments', requireRole('admin', 'super_admin', 'doctor'), adminController.getAppointments);
router.get('/appointments/calendar', requireRole('admin', 'super_admin'), adminController.getAppointmentCalendar);
router.get('/appointments/:id', requireRole('admin', 'super_admin', 'doctor'), adminController.getAppointmentById);
router.patch('/appointments/:id/assign-doctor', requireRole('admin', 'super_admin'), adminController.assignAppointmentDoctor);
router.patch('/appointments/:id/confirm', requireRole('admin', 'super_admin'), adminController.confirmAppointment);
router.patch('/appointments/:id/cancel', requireRole('admin', 'super_admin'), adminController.cancelAppointment);

// ==================== PATIENTS ====================
router.get('/patients', requireRole('admin', 'super_admin'), adminController.getPatients);
router.get('/patients/:id', requireRole('admin', 'super_admin', 'doctor'), adminController.getPatientById);
router.get('/patients/:id/appointments', requireRole('admin', 'super_admin'), adminController.getPatientAppointments);
router.get('/patients/:id/records', requireRole('admin', 'super_admin', 'doctor'), adminController.getPatientRecords);
router.patch('/patients/:id/toggle', requireRole('admin', 'super_admin'), adminController.togglePatient);

// ==================== DEPARTMENTS ====================
router.post('/departments', requireRole('admin', 'super_admin'), adminController.createDepartment);
router.put('/departments/:id', requireRole('admin', 'super_admin'), adminController.updateDepartment);
router.delete('/departments/:id', requireRole('admin', 'super_admin'), adminController.deleteDepartment);
router.patch('/departments/reorder', requireRole('admin', 'super_admin'), adminController.reorderDepartments);

// ==================== NEWS ====================
router.post('/news', requireRole('admin', 'super_admin'), adminController.createNews);
router.put('/news/:id', requireRole('admin', 'super_admin'), adminController.updateNews);
router.delete('/news/:id', requireRole('admin', 'super_admin'), adminController.deleteNews);
router.patch('/news/:id/publish', requireRole('admin', 'super_admin'), adminController.togglePublishNews);

// ==================== USERS (Super Admin only) ====================
router.get('/users', requireRole('super_admin'), adminController.getUsers);
router.post('/users', requireRole('super_admin'), adminController.createUser);
router.patch('/users/:id/role', requireRole('super_admin'), adminController.updateUserRole);
router.patch('/users/:id/toggle', requireRole('super_admin'), adminController.toggleUser);
router.patch('/users/:id/reset-password', requireRole('super_admin'), adminController.resetUserPassword);

// ==================== MEDICINES ====================
router.get('/medicines', requireRole('admin', 'super_admin', 'doctor'), adminController.getMedicines);
router.post('/medicines', requireRole('admin', 'super_admin'), adminController.createMedicine);
router.put('/medicines/:id', requireRole('admin', 'super_admin'), adminController.updateMedicine);
router.patch('/medicines/:id/stock-in', requireRole('admin', 'super_admin'), adminController.stockInMedicine);

// ==================== UPLOAD ====================
router.post('/upload', requireRole('admin', 'super_admin'), upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Không tìm thấy file' });
  }
  res.json({ url: `/uploads/${req.file.filename}`, filename: req.file.filename });
});

module.exports = router;
