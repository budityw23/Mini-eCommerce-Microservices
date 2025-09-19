const express = require('express');
const { NotFoundError, AppError } = require('./errors');

function createApp({ serviceName, logger, routes }) {
  if (!serviceName) throw new Error('serviceName is required');
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json());

  app.get('/healthz', (_req, res) => {
    res.json({ service: serviceName, status: 'ok', uptime: process.uptime() });
  });

  if (typeof routes === 'function') {
    routes(app);
  }

  app.use((_req, _res, next) => next(new NotFoundError()));

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, _next) => {
    const error = err instanceof AppError ? err : new AppError('Internal Server Error');
    logger?.error?.('request failed', { code: error.code, status: error.status, id: req.id });
    res.status(error.status).json({ error: { code: error.code, message: error.message } });
  });

  return app;
}

function start(app, { port, logger }) {
  const server = app.listen(port, () => logger?.info?.('listening', { port }));
  const shutdown = () => {
    logger?.info?.('shutting down');
    server.close(() => process.exit(0));
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  return server;
}

module.exports = {
  createApp,
  start,
};
