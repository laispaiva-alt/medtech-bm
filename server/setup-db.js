const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runSetup() {
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await pool.query(sql);
    console.log('Banco de dados PostgreSQL configurado com sucesso!');
  } catch (err) {
    console.error('Erro ao executar o setup do banco:', err);
  } finally {
    await pool.end();
  }
}

runSetup();
