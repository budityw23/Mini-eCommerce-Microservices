const { getPool } = require('./db');

function mapOrder(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    productId: row.product_id,
    createdAt: row.created_at,
  };
}

async function listOrdersByUser(userId, { limit = 50, offset = 0 } = {}, pool = getPool()) {
  const safeLimit = Math.min(Math.max(Number(limit) || 0, 1), 100);
  const safeOffset = Math.max(Number(offset) || 0, 0);

  const { rows } = await pool.query(
    'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
    [userId, safeLimit, safeOffset],
  );

  return rows.map(mapOrder);
}

async function createOrder({ id, userId, productId }, pool = getPool()) {
  await pool.query(
    'INSERT INTO orders (id, user_id, product_id) VALUES ($1, $2, $3)',
    [id, userId, productId],
  );
  return mapOrder({ id, user_id: userId, product_id: productId, created_at: new Date() });
}

module.exports = {
  listOrdersByUser,
  createOrder,
};
