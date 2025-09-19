const path = require('node:path');
const { env, logger, http } = require('@mini/shared');

env.loadEnv({ files: [path.join(__dirname, '..', '.env')] });

const config = env.getConfig({
  PORT: { default: 8080, parser: Number },
  USER_SERVICE_URL: { default: 'http://localhost:3001' },
  PRODUCT_SERVICE_URL: { default: 'http://localhost:3002' },
  ORDER_SERVICE_URL: { default: 'http://localhost:3003' },
});

const log = logger.createLogger('api-gateway');

const app = http.createApp({
  serviceName: 'api-gateway',
  logger: log,
  routes: (router) => {
    router.get('/', (_req, res) => {
      res.json({ message: 'Gateway ready', routes: ['/users', '/products', '/orders'] });
    });
  },
});

http.start(app, { port: config.PORT, logger: log });
