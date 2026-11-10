const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function rodarSetup() {
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await pool.query(sql);
    console.log('✅ Tabelas e dados iniciais criados com sucesso no banco Neon!');
  } catch (err) {
    console.error('❌ Erro ao executar o setup no Neon:', err.message);
  } finally {
    await pool.end();
  }
}

rodarSetup();
