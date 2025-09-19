const path = require('node:path');
const { env, logger, http } = require('@mini/shared');

env.loadEnv({ files: [path.join(__dirname, '..', '.env')] });

const config = env.getConfig({
  PORT: { default: 3002, parser: Number },
  DATABASE_URL: { default: 'postgres://product_service:password@localhost:5434/product_db' },
  JWT_SECRET: { default: process.env.JWT_SECRET || 'devsecret' },
});

const log = logger.createLogger('product-service');

const app = http.createApp({
  serviceName: 'product-service',
  logger: log,
});

http.start(app, { port: config.PORT, logger: log });
