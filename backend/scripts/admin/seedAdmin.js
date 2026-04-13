// backend/scripts/seedAdmin.js
// Từ thư mục backend: npm run seed:admin   hoặc   node scripts/seedAdmin.js
// Nếu đang trong backend/scripts:          node seedAdmin.js   (không thêm scripts/)
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const envBackend = path.join(__dirname, '..', '.env');
const envRoot = path.join(__dirname, '..', '..', '.env');
require('dotenv').config({ path: fs.existsSync(envBackend) ? envBackend : envRoot });

async function seedAdmin() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'noh_hospital',
  });

  try {
    const hashedPassword = await bcrypt.hash('Admin@2026', 12);

    // Create Super Admin
    await connection.execute(
      `INSERT INTO users (email, password_hash, role, full_name, phone, is_active) 
       VALUES (?, ?, 'super_admin', ?, ?, 1)
       ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
      ['admin@noh.vn', hashedPassword, 'Quản trị viên hệ thống', '0123456789']
    );

    console.log('✅ Super Admin created successfully!');
    console.log('   Email: admin@noh.vn');
    console.log('   Password: Admin@2026');
    console.log('   ⚠️  Please change password after first login!');
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
  } finally {
    await connection.end();
  }
}

seedAdmin();
