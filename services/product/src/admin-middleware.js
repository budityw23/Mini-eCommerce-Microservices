const { UnauthorizedError } = require('@mini/shared');

function adminOnly(req, _res, next) {
  if (!req.user) {
    return next(new UnauthorizedError('Auth required'));
  }

  if (req.user.role !== 'admin') {
    return next(new UnauthorizedError('Admin access required'));
  }

  next();
}

module.exports = adminOnly;
