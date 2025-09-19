const { Pool } = require('pg');
const crypto = require('node:crypto');
const config = require('./config');
const { hashPassword } = require('./security');

let pool;

function setPool(customPool) {
  pool = customPool;
}

function getPool() {
  if (pool) return pool;
  pool = new Pool({ connectionString: config.DATABASE_URL });
  return pool;
}

async function initDb(customPool = getPool()) {
  await customPool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  const { rows } = await customPool.query('SELECT id FROM users WHERE username = $1 LIMIT 1', [
    config.ADMIN_USERNAME,
  ]);

  if (rows.length === 0 && config.ADMIN_PASSWORD) {
    const passwordHash = await hashPassword(config.ADMIN_PASSWORD);
    await customPool.query(
      'INSERT INTO users (id, username, password_hash, role) VALUES ($1, $2, $3, $4)',
      [crypto.randomUUID(), config.ADMIN_USERNAME, passwordHash, 'admin'],
    );
  }
}

module.exports = {
  getPool,
  setPool,
  initDb,
};
