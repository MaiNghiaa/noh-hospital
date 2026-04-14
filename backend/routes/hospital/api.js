const express = require('express')
const router = express.Router()

const departmentController = require('../../controllers/hospital/departmentController')
const doctorController = require('../../controllers/hospital/doctorController')
const newsController = require('../../controllers/hospital/newsController')
const appointmentController = require('../../controllers/hospital/appointmentController')

// ─── Departments ───
router.get('/departments', departmentController.getAll)
router.get('/departments/slug/:slug', departmentController.getBySlug)
router.get('/departments/:id', departmentController.getById)

// ─── Doctors ───
router.get('/doctors', doctorController.getAll)
router.get('/doctors/search', doctorController.search)
router.get('/doctors/:id', doctorController.getById)

// ─── News ───
router.get('/news', newsController.getAll)
router.get('/news/slug/:slug', newsController.getBySlug)
router.get('/news/:id', newsController.getById)

// ─── Appointments ───
router.post('/appointments', appointmentController.create)
router.get('/appointments', appointmentController.getByPhone)

// ─── Health check ───
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

module.exports = router
