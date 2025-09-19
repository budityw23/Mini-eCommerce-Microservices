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
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price NUMERIC(10,2) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `);

  const { rows } = await customPool.query('SELECT COUNT(*)::int FROM products');
  const count = rows[0]?.count ?? 0;

  if (count === 0) {
    const sample = [
      {
        id: 'prod-1001',
        name: 'Wireless Mouse',
        description: 'Compact mouse suitable for everyday tasks',
        price: 19.99,
      },
      {
        id: 'prod-1002',
        name: 'Mechanical Keyboard',
        description: 'Tenkeyless keyboard with tactile switches',
        price: 74.5,
      },
      {
        id: 'prod-1003',
        name: 'USB-C Charger',
        description: '45W charger compatible with most laptops',
        price: 32.0,
      },
    ];

    for (const item of sample) {
      await customPool.query(
        'INSERT INTO products (id, name, description, price) VALUES ($1, $2, $3, $4)',
        [item.id, item.name, item.description, item.price],
      );
    }
  }
}

module.exports = {
  getPool,
  setPool,
  initDb,
};
