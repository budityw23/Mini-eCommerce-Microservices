const { http, logger } = require('@mini/shared');
const config = require('./config');
const { initDb } = require('./db');
const routes = require('./routes');

async function start() {
  await initDb();

  const log = logger.createLogger('product-service');
  const app = http.createApp({
    serviceName: 'product-service',
    logger: log,
    routes: (router) => {
      router.use(routes);
    },
  });

  http.start(app, { port: config.PORT, logger: log });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[product-service] failed to start', err);
  process.exit(1);
});
