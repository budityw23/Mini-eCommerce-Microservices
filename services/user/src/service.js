const { ValidationError } = require('@mini/shared');
const { findByUsername, createUser, findById } = require('./repository');
const { hashPassword, verifyPassword, issueToken } = require('./security');

async function registerUser({ username, password }) {
  if (!username || !password) {
    throw new ValidationError('username and password are required');
  }

  const existing = await findByUsername(username);
  if (existing) {
    throw new ValidationError('username already taken');
  }

  const passwordHash = await hashPassword(password);
  const user = await createUser({ username, passwordHash });
  const token = issueToken({ sub: user.id, username: user.username, role: user.role });
  return { user, token };
}

async function loginUser({ username, password }) {
  if (!username || !password) {
    throw new ValidationError('username and password are required');
  }

  const existing = await findByUsername(username);
  if (!existing) {
    throw new ValidationError('invalid credentials');
  }

  const ok = await verifyPassword(password, existing.passwordHash);
  if (!ok) {
    throw new ValidationError('invalid credentials');
  }

  const user = { id: existing.id, username: existing.username, role: existing.role };
  const token = issueToken({ sub: user.id, username: user.username, role: user.role });
  return { user, token };
}

async function getProfile(userId) {
  const user = await findById(userId);
  if (!user) {
    return null;
  }
  return { id: user.id, username: user.username, role: user.role };
}

module.exports = {
  registerUser,
  loginUser,
  getProfile,
};
