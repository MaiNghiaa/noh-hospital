// backend/routes/doctor.js
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/admin/auth');
const { requireRole } = require('../../middleware/admin/role');
const doctorController = require('../../controllers/admin/doctorController');

router.use(auth);
router.use(requireRole('doctor'));

router.get('/dashboard', doctorController.getDashboard);
router.get('/appointments', doctorController.getMyAppointments);
router.post('/records', doctorController.createRecord);
router.put('/records/:id', doctorController.updateRecord);
router.post('/prescriptions', doctorController.createPrescription);

module.exports = router;
