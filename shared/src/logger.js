function createLogger(serviceName) {
  const prefix = serviceName ? `[${serviceName}]` : '[app]';
  const base = { info: console.log, error: console.error, warn: console.warn }; // eslint-disable-line no-console

  return {
    info: (msg, meta) => base.info(prefix, msg, meta || ''),
    warn: (msg, meta) => base.warn(prefix, msg, meta || ''),
    error: (msg, meta) => base.error(prefix, msg, meta || ''),
  };
}

module.exports = {
  createLogger,
};
