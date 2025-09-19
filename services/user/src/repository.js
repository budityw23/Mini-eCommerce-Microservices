const crypto = require('node:crypto');
const { getPool } = require('./db');

function mapUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    username: row.username,
    role: row.role,
    passwordHash: row.password_hash,
  };
}

async function findByUsername(username, pool = getPool()) {
  const { rows } = await pool.query('SELECT * FROM users WHERE username = $1 LIMIT 1', [username]);
  return mapUser(rows[0]);
}

async function findById(id, pool = getPool()) {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
  return mapUser(rows[0]);
}

async function createUser({ username, passwordHash, role = 'user' }, pool = getPool()) {
  const id = crypto.randomUUID();
  await pool.query(
    'INSERT INTO users (id, username, password_hash, role) VALUES ($1, $2, $3, $4)',
    [id, username, passwordHash, role],
  );
  return { id, username, role };
}

module.exports = {
  findByUsername,
  findById,
  createUser,
};
