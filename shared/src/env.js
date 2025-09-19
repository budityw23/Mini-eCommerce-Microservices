const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');

function loadEnv({ baseDir = process.cwd(), files = [] } = {}) {
  const candidates = [path.join(baseDir, '.env'), ...files];
  candidates.forEach((file) => {
    if (!file) return;
    const resolved = path.resolve(file);
    if (fs.existsSync(resolved)) {
      dotenv.config({ path: resolved, override: false });
    }
  });
}

function getConfig(schema) {
  if (!schema || typeof schema !== 'object') {
    throw new Error('Config schema must be an object');
  }

  return Object.entries(schema).reduce((acc, [key, options]) => {
    let value = process.env[key];
    const required = !!options?.required;
    const fallback = options?.default;
    const parser = options?.parser;

    if ((value === undefined || value === '') && fallback !== undefined) {
      value = typeof fallback === 'function' ? fallback() : fallback;
    }

    if ((value === undefined || value === '') && required) {
      throw new Error(`Missing required environment variable ${key}`);
    }

    acc[key] = typeof parser === 'function' && value !== undefined ? parser(value) : value;
    return acc;
  }, {});
}

module.exports = {
  loadEnv,
  getConfig,
};
