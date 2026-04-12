const express = require('express')
const router = express.Router()

const departmentController = require('../controllers/departmentController')
const doctorController = require('../controllers/doctorController')
const newsController = require('../controllers/newsController')
const appointmentController = require('../controllers/appointmentController')

// ─── Departments ───
router.get('/departments', departmentController.getAll)
router.get('/departments/:id', departmentController.getById)

// ─── Doctors ───
router.get('/doctors', doctorController.getAll)
router.get('/doctors/search', doctorController.search)
router.get('/doctors/:id', doctorController.getById)

// ─── News ───
router.get('/news', newsController.getAll)
router.get('/news/:id', newsController.getById)

// ─── Appointments ───
router.post('/appointments', appointmentController.create)
router.get('/appointments', appointmentController.getByPhone)

// ─── Health check ───
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

module.exports = router
