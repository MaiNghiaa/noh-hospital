// backend/routes/index.js
// =====================================================
// HƯỚNG DẪN TÍCH HỢP VÀO SERVER HIỆN TẠI
// =====================================================
// Thêm các dòng sau vào file server.js hoặc app.js hiện tại của dự án:
//
// const cookieParser = require('cookie-parser');
// app.use(cookieParser());
// app.use('/uploads', express.static('uploads'));
//
// const authRoutes = require('./routes/auth');
// const adminRoutes = require('./routes/admin');
// const doctorRoutes = require('./routes/doctor');
//
// app.use('/api/auth', authRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/doctor', doctorRoutes);
// =====================================================

const authRoutes = require('./auth');
const adminRoutes = require('./admin');
const doctorRoutes = require('./doctor');

module.exports = { authRoutes, adminRoutes, doctorRoutes };
