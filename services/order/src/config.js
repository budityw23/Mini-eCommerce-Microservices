const path = require('node:path');
const { env } = require('@mini/shared');

env.loadEnv({ files: [path.join(__dirname, '..', '.env')] });

const config = env.getConfig({
  PORT: { default: 3003, parser: Number },
  DATABASE_URL: { default: 'postgres://order_service:password@localhost:5435/order_db' },
  JWT_SECRET: { default: 'devsecret', required: true },
  USER_SERVICE_URL: { default: 'http://localhost:3001' },
  PRODUCT_SERVICE_URL: { default: 'http://localhost:3002' },
});

module.exports = config;
