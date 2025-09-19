const path = require('node:path');
const { env } = require('@mini/shared');

env.loadEnv({ files: [path.join(__dirname, '..', '.env')] });

const config = env.getConfig({
  PORT: { default: 3002, parser: Number },
  DATABASE_URL: { default: 'postgres://product_service:password@localhost:5434/product_db' },
});

module.exports = config;
