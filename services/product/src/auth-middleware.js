const jwt = require('jsonwebtoken');
const config = require('./config');
const { UnauthorizedError } = require('@mini/shared');

function authRequired(req, _res, next) {
  const header = req.headers.authorization || '';
  const [, token] = header.split(' ');

  if (!token) {
    return next(new UnauthorizedError('Missing bearer token'));
  }

  try {
    const payload = jwt.verify(token, config.JWT_SECRET);
    req.user = { id: payload.sub, username: payload.username, role: payload.role };
    return next();
  } catch (error) {
    return next(new UnauthorizedError('Invalid token'));
  }
}

module.exports = authRequired;
