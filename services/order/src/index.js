const path = require('node:path');
const { env, logger, http } = require('@mini/shared');

env.loadEnv({ files: [path.join(__dirname, '..', '.env')] });

const config = env.getConfig({
  PORT: { default: 3003, parser: Number },
  DATABASE_URL: { default: 'postgres://order_service:password@localhost:5435/order_db' },
  USER_SERVICE_URL: { default: 'http://localhost:3001' },
  PRODUCT_SERVICE_URL: { default: 'http://localhost:3002' },
  JWT_SECRET: { default: process.env.JWT_SECRET || 'devsecret' },
});

const log = logger.createLogger('order-service');

const app = http.createApp({
  serviceName: 'order-service',
  logger: log,
});

http.start(app, { port: config.PORT, logger: log });
