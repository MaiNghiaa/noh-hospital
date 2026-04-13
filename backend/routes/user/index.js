// backend/routes/user/index.js
// Routes cho bệnh nhân (đăng ký, đăng nhập, profile, lịch hẹn, bệnh án, đơn thuốc)
const express = require('express');
const router = express.Router();
const userAuth = require('../../middleware/user/auth');
const userAuthController = require('../../controllers/user/authController');
const patientController = require('../../controllers/user/patientController');

// ═══════════════════════════════════════════════════════════════
// AUTH (không cần đăng nhập)
// ═══════════════════════════════════════════════════════════════
router.post('/auth/register', userAuthController.register);
router.post('/auth/login', userAuthController.login);
router.post('/auth/refresh', userAuthController.refresh);
router.post('/auth/logout', userAuthController.logout);

// ═══════════════════════════════════════════════════════════════
// AUTHENTICATED ROUTES (cần đăng nhập)
// ═══════════════════════════════════════════════════════════════
router.use(userAuth); // Tất cả routes bên dưới đều cần đăng nhập

// ─── Profile ───
router.get('/auth/me', userAuthController.me);
router.put('/auth/profile', userAuthController.updateProfile);
router.put('/auth/change-password', userAuthController.changePassword);

// ─── Dashboard ───
router.get('/dashboard', patientController.getDashboard);

// ─── Appointments (Lịch hẹn) ───
router.get('/appointments', patientController.getMyAppointments);
router.post('/appointments', patientController.createAppointment);
router.get('/appointments/:id', patientController.getAppointmentDetail);
router.patch('/appointments/:id/cancel', patientController.cancelAppointment);

// ─── Medical Records (Bệnh án) ───
router.get('/medical-records', patientController.getMyRecords);
router.get('/medical-records/:id', patientController.getRecordDetail);

// ─── Prescriptions (Đơn thuốc) ───
router.get('/prescriptions', patientController.getMyPrescriptions);

module.exports = router;
