const { UnauthorizedError } = require('@mini/shared');
const { verifyToken } = require('./security');

function authRequired(req, _res, next) {
  const header = req.headers.authorization || '';
  const [, token] = header.split(' ');

  if (!token) {
    return next(new UnauthorizedError('Missing bearer token'));
  }

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, username: payload.username, role: payload.role };
    return next();
  } catch (error) {
    return next(new UnauthorizedError('Invalid token'));
  }
}

module.exports = authRequired;
