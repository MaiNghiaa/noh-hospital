const express = require('express')
const cors = require('cors')
require('dotenv').config()

const apiRoutes = require('./routes/api')
const { testConnection } = require('./config/database')

const app = express()
const PORT = process.env.PORT || 5000

// ─── Middleware ───
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ─── Request logging ───
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`)
  next()
})

// ─── Routes ───
app.use('/api', apiRoutes)

// ─── Root ───
app.get('/', (req, res) => {
  res.json({
    name: 'NOH Hospital API',
    version: '1.0.0',
    endpoints: {
      departments: '/api/departments',
      doctors: '/api/doctors',
      news: '/api/news',
      appointments: '/api/appointments',
      health: '/api/health'
    }
  })
})

// ─── 404 Handler ───
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// ─── Error Handler ───
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack)
  res.status(500).json({ success: false, message: 'Internal server error' })
})

// ─── Start Server ───
async function start() {
  // Test DB connection (non-blocking)
  await testConnection()

  app.listen(PORT, () => {
    console.log(`\n🏥 NOH Hospital API Server`)
    console.log(`   Running on: http://localhost:${PORT}`)
    console.log(`   API Base:   http://localhost:${PORT}/api`)
    console.log(`   Health:     http://localhost:${PORT}/api/health\n`)
  })
}

start()
