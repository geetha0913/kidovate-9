const fs = require('fs');
const path = require('path');
// Load .env so DATABASE_URL is available when this script is run directly
require('dotenv').config();
const pool = require('../config/database');

async function run() {
  try {
    const sqlPath = path.join(__dirname, '..', 'config', 'init-db.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Split statements on semicolon followed by newline to avoid splitting inside functions
    // But simple approach: run the whole file using pool.query
    await pool.query(sql);
    console.log('✅ Database initialized successfully');
    process.exit(0);
  } catch (err) {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  }
}

run();
