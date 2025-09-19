const path = require('node:path');
const { env, logger, http } = require('@mini/shared');

env.loadEnv({ files: [path.join(__dirname, '..', '.env')] });

const config = env.getConfig({
  PORT: { default: 3001, parser: Number },
  DATABASE_URL: { default: 'postgres://user_service:password@localhost:5433/user_db' },
  JWT_SECRET: { default: process.env.JWT_SECRET || 'devsecret' },
});

const log = logger.createLogger('user-service');

const app = http.createApp({
  serviceName: 'user-service',
  logger: log,
});

http.start(app, { port: config.PORT, logger: log });
