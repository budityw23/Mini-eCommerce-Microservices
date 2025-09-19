const { getPool } = require('./db');

function mapProduct(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    createdAt: row.created_at,
  };
}

async function listProducts({ limit = 50, offset = 0 } = {}, pool = getPool()) {
  const safeLimit = Math.min(Math.max(Number(limit) || 0, 1), 100);
  const safeOffset = Math.max(Number(offset) || 0, 0);

  const { rows } = await pool.query(
    'SELECT * FROM products ORDER BY created_at DESC LIMIT $1 OFFSET $2',
    [safeLimit, safeOffset],
  );

  return rows.map(mapProduct);
}

async function getProductById(id, pool = getPool()) {
  const { rows } = await pool.query('SELECT * FROM products WHERE id = $1 LIMIT 1', [id]);
  return mapProduct(rows[0]);
}

module.exports = {
  listProducts,
  getProductById,
};
