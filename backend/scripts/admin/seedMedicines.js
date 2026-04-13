// backend/scripts/seedMedicines.js
// Từ backend: npm run seed:medicines   hoặc   node scripts/seedMedicines.js
// Từ backend/scripts:                 node seedMedicines.js
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');
const envBackend = path.join(__dirname, '..', '.env');
const envRoot = path.join(__dirname, '..', '..', '.env');
require('dotenv').config({ path: fs.existsSync(envBackend) ? envBackend : envRoot });

const medicines = [
  { name: 'Amoxicillin 500mg', active_ingredient: 'Amoxicillin', unit: 'viên', category: 'Kháng sinh' },
  { name: 'Paracetamol 500mg', active_ingredient: 'Paracetamol', unit: 'viên', category: 'Giảm đau hạ sốt' },
  { name: 'Ibuprofen 400mg', active_ingredient: 'Ibuprofen', unit: 'viên', category: 'Kháng viêm' },
  { name: 'Cetirizine 10mg', active_ingredient: 'Cetirizine', unit: 'viên', category: 'Kháng dị ứng' },
  { name: 'Omeprazole 20mg', active_ingredient: 'Omeprazole', unit: 'viên', category: 'Dạ dày' },
  { name: 'Dexamethasone 0.5mg', active_ingredient: 'Dexamethasone', unit: 'viên', category: 'Corticoid' },
  { name: 'Ofloxacin nhỏ tai 0.3%', active_ingredient: 'Ofloxacin', unit: 'lọ', category: 'Nhỏ tai' },
  { name: 'Naphazoline nhỏ mũi', active_ingredient: 'Naphazoline', unit: 'lọ', category: 'Nhỏ mũi' },
  { name: 'Clarithromycin 500mg', active_ingredient: 'Clarithromycin', unit: 'viên', category: 'Kháng sinh' },
  { name: 'Prednisolone 5mg', active_ingredient: 'Prednisolone', unit: 'viên', category: 'Corticoid' },
  { name: 'Xylometazoline 0.1%', active_ingredient: 'Xylometazoline', unit: 'lọ', category: 'Nhỏ mũi' },
  { name: 'Loratadine 10mg', active_ingredient: 'Loratadine', unit: 'viên', category: 'Kháng dị ứng' },
  { name: 'Fluticasone xịt mũi', active_ingredient: 'Fluticasone', unit: 'lọ', category: 'Corticoid xịt' },
  { name: 'Ciprofloxacin nhỏ mắt 0.3%', active_ingredient: 'Ciprofloxacin', unit: 'lọ', category: 'Nhỏ mắt' },
  { name: 'Vitamin C 500mg', active_ingredient: 'Ascorbic acid', unit: 'viên', category: 'Vitamin' },
];

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'noh_hospital',
  });

  try {
    for (const med of medicines) {
      await connection.execute(
        `INSERT INTO medicines (name, active_ingredient, unit, category, is_active)
         VALUES (?, ?, ?, ?, 1)
         ON DUPLICATE KEY UPDATE name = VALUES(name)`,
        [med.name, med.active_ingredient, med.unit, med.category]
      );
    }
    console.log(`✅ Seeded ${medicines.length} medicines successfully!`);
  } catch (error) {
    console.error('❌ Error seeding medicines:', error.message);
  } finally {
    await connection.end();
  }
}

seed();
