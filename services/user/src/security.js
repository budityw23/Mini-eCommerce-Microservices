const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('./config');

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

function issueToken(payload) {
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: '1h' });
}

function verifyToken(token) {
  return jwt.verify(token, config.JWT_SECRET);
}

module.exports = {
  hashPassword,
  verifyPassword,
  issueToken,
  verifyToken,
};
