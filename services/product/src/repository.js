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

async function createProduct({ id, name, description, price }, pool = getPool()) {
  await pool.query(
    'INSERT INTO products (id, name, description, price) VALUES ($1, $2, $3, $4)',
    [id, name, description, price],
  );
  return getProductById(id, pool);
}

async function updateProduct(id, updates, pool = getPool()) {
  const fields = [];
  const values = [];
  let index = 1;

  if (Object.prototype.hasOwnProperty.call(updates, 'name')) {
    fields.push(`name = $${index++}`);
    values.push(updates.name);
  }
  if (Object.prototype.hasOwnProperty.call(updates, 'description')) {
    fields.push(`description = $${index++}`);
    values.push(updates.description);
  }
  if (Object.prototype.hasOwnProperty.call(updates, 'price')) {
    fields.push(`price = $${index++}`);
    values.push(updates.price);
  }

  if (fields.length === 0) {
    return getProductById(id, pool);
  }

  values.push(id);
  await pool.query(`UPDATE products SET ${fields.join(', ')} WHERE id = $${index}`, values);
  return getProductById(id, pool);
}

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
};
