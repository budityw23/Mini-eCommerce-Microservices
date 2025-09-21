const path = require('node:path');
const { env } = require('@mini/shared');

env.loadEnv({ files: [path.join(__dirname, '..', '.env')] });

const config = env.getConfig({
  PORT: { default: 8080, parser: Number },
  USER_SERVICE_URL: { default: 'http://localhost:3001' },
  PRODUCT_SERVICE_URL: { default: 'http://localhost:3002' },
  ORDER_SERVICE_URL: { default: 'http://localhost:3003' },
});

module.exports = config;
