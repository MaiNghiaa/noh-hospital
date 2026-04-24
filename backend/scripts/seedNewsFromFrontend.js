#!/usr/bin/env node
/**
 * Seed bảng news từ dữ liệu mock frontend (MOCK_NEWS + ADMISSION → category tuyen-sinh).
 * Ảnh: copy từ frontend/user/public hoặc tải URL → backend/uploads/news/seed
 *
 * Chạy: node backend/scripts/seedNewsFromFrontend.js
 *       node backend/scripts/seedNewsFromFrontend.js --upsert
 *       node backend/scripts/seedNewsFromFrontend.js --wipe   (XÓA toàn bộ bảng news rồi chèn lại 17 bài)
 */

const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');
const { flattenForSeed } = require('./data/frontendNewsData');
const { resolveNewsImage } = require('./lib/resolveNewsImage');

const envBackend = path.join(__dirname, '..', '.env');
const envRoot = path.join(__dirname, '..', '..', '.env');
require('dotenv').config({ path: fs.existsSync(envBackend) ? envBackend : envRoot });

const uploadDir = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads'), 'news', 'seed');

async function ensureTuyenSinhEnum(conn) {
  const [[row]] = await conn.query(
    "SELECT COLUMN_TYPE FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'news' AND COLUMN_NAME = 'category'"
  );
  const col = row && row.COLUMN_TYPE ? String(row.COLUMN_TYPE) : '';
  if (col.includes('tuyen-sinh')) return;
  await conn.query(`
    ALTER TABLE news MODIFY category
    ENUM('su-kien', 'nghien-cuu', 'hop-tac', 'thong-bao', 'hoi-dap', 'tuyen-sinh')
    NOT NULL DEFAULT 'su-kien'
  `);
  console.log('   ✅ Đã mở rộng ENUM category (thêm tuyen-sinh)');
}

async function insertOne(conn, row) {
  const image = await resolveNewsImage(row.image, row.slug, uploadDir);
  const published = row.date ? `${row.date} 10:00:00` : null;
  await conn.execute(
    `INSERT INTO news (title, slug, category, excerpt, content, image, author, view_count, is_featured, is_published, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, 1, ?)`,
    [row.title, row.slug, row.category, row.excerpt, row.content, image, 'Ban biên tập', row.is_featured || 0, published]
  );
}

/**
 * Dùng từ seedAll.js sau khi TRUNCATE news.
 * @param {import('mysql2/promise').Connection} conn
 */
async function seedNewsFromFrontendData(conn) {
  await ensureTuyenSinhEnum(conn);
  const { all } = flattenForSeed();
  for (const row of all) {
    await insertOne(conn, row);
  }
  return all.length;
}

async function main() {
  const useUpsert = process.argv.includes('--upsert');
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'noh_hospital',
    multipleStatements: true
  });

  try {
    await ensureTuyenSinhEnum(connection);
    if (process.argv.includes('--wipe')) {
      await connection.query('DELETE FROM news');
      console.log('   🗑  Đã xóa toàn bộ bảng news (--wipe)');
    }
    const { all } = flattenForSeed();
    let n = 0;
    for (const row of all) {
      const image = await resolveNewsImage(row.image, row.slug, uploadDir);
      const published = row.date ? `${row.date} 10:00:00` : null;
      if (useUpsert) {
        await connection.execute(
          `INSERT INTO news (title, slug, category, excerpt, content, image, author, view_count, is_featured, is_published, published_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, 1, ?)
           ON DUPLICATE KEY UPDATE
             title = VALUES(title),
             category = VALUES(category),
             excerpt = VALUES(excerpt),
             content = VALUES(content),
             image = VALUES(image),
             is_featured = VALUES(is_featured),
             published_at = VALUES(published_at)`,
          [row.title, row.slug, row.category, row.excerpt, row.content, image, 'Ban biên tập', row.is_featured || 0, published]
        );
        n += 1;
      } else {
        const [r] = await connection.execute('SELECT id FROM news WHERE slug = ?', [row.slug]);
        if (r.length) {
          console.log(`   ⏭  Đã tồn tại slug: ${row.slug} (bỏ qua, dùng --upsert)`);
          continue;
        }
        await connection.execute(
          `INSERT INTO news (title, slug, category, excerpt, content, image, author, view_count, is_featured, is_published, published_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, 1, ?)`,
          [row.title, row.slug, row.category, row.excerpt, row.content, image, 'Ban biên tập', row.is_featured || 0, published]
        );
        n += 1;
      }
    }
    console.log(`\n📰 Đã xử lý ${n} bài (từ ${all.length} mục nguồn). Ảnh: ${uploadDir}\n`);
  } catch (e) {
    console.error('❌', e);
    process.exitCode = 1;
  } finally {
    await connection.end();
  }
}

module.exports = { seedNewsFromFrontendData, ensureTuyenSinhEnum };

if (require.main === module) {
  main();
}
