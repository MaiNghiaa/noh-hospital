const path = require('path');
const fs = require('fs');

// Load env for the whole backend
require('./config/loadEnv');

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const hospitalApiRoutes = require('./routes/hospital/api');
const { authRoutes, adminRoutes, doctorRoutes } = require('./routes/admin');
const userRoutes = require('./routes/user');
const { pool } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

const uploadDir = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, 'uploads'));
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const originsFromEnv = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const defaultOrigins = [
  'http://localhost:5173', // Vite (common)
  'http://localhost:5174', // Vite second app
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
];

app.use(
  cors({
    origin: originsFromEnv.length ? originsFromEnv : defaultOrigins,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Admin upload serving
app.use('/uploads', express.static(uploadDir));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// ===== Hospital (user-facing) APIs =====
// Keeps original endpoints: /api/departments, /api/doctors, /api/news, /api/appointments, /api/health
app.use('/api', hospitalApiRoutes);

// ===== Admin APIs =====
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctor', doctorRoutes);

// ===== User (Patient) APIs =====
app.use('/api/user', userRoutes);

app.get('/', (req, res) => {
  res.json({
    name: 'NOH Monorepo API',
    version: '1.0.0',
    endpoints: {
      hospital: '/api/*',
      adminAuth: '/api/auth/*',
      admin: '/api/admin/*',
      doctor: '/api/doctor/*',
      user: '/api/user/*',
      uploads: '/uploads/*',
    },
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack || err);
  res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});

const server = app.listen(PORT, () => {
  console.log(`\nNOH Monorepo API`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`   API: http://localhost:${PORT}/api\n`);
});

server.on('error', (err) => {
  if (err?.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Exiting so nodemon can restart cleanly.`);
    process.exit(1);
  }
  console.error('Server listen error:', err);
  process.exit(1);
});

let shuttingDown = false;
async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  try {
    console.log(`\nReceived ${signal}. Shutting down...`);
    await new Promise((resolve) => server.close(resolve));
  } catch (e) {
    // ignore
  }
  try {
    await pool.end();
  } catch (e) {
    // ignore
  }
  process.exit(0);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

