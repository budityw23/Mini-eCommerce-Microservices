const { Pool } = require('pg');
const config = require('./config');

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
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);
}

module.exports = {
  getPool,
  setPool,
  initDb,
};
