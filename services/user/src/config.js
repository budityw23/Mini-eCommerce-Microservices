const path = require('node:path');
const { env } = require('@mini/shared');

env.loadEnv({ files: [path.join(__dirname, '..', '.env')] });

const config = env.getConfig({
  PORT: { default: 3001, parser: Number },
  DATABASE_URL: { default: 'postgres://user_service:password@localhost:5433/user_db' },
  JWT_SECRET: { default: 'devsecret', required: true },
  ADMIN_USERNAME: { default: 'admin' },
  ADMIN_PASSWORD: { default: 'admin123' },
});

module.exports = config;
