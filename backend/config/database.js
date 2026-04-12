const mysql = require('mysql2/promise')
require('dotenv').config()

// ─── Connection Pool ───
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'noh_hospital',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

// ─── Test connection ───
async function testConnection() {
  try {
    const conn = await pool.getConnection()
    console.log('✅ MySQL connected successfully')
    conn.release()
    return true
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message)
    console.log('ℹ️  Server will continue without database. API returns mock data.')
    return false
  }
}

module.exports = { pool, testConnection }
