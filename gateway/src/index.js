const { http, logger } = require('@mini/shared');
const config = require('./config');

function proxyTo(baseUrl) {
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

  return async (req, res, next) => {
    try {
      const targetUrl = new URL(req.originalUrl, `${normalizedBase}/`).toString();

      const headers = { ...req.headers };
      delete headers.host;

      const init = {
        method: req.method,
        headers,
      };

      if (req.method !== 'GET' && req.method !== 'HEAD') {
        init.body = req.body ? JSON.stringify(req.body) : undefined;
        init.headers['content-type'] = 'application/json';
      }

      const response = await fetch(targetUrl, init);
      const text = await response.text();
      res.status(response.status);
      try {
        const parsed = JSON.parse(text || '{}');
        res.json(parsed);
      } catch (_err) {
        res.send(text);
      }
    } catch (error) {
      next(error);
    }
  };
}

function createGatewayApp(overrides = {}) {
  const serviceConfig = {
    userServiceUrl: overrides.userServiceUrl || config.USER_SERVICE_URL,
    productServiceUrl: overrides.productServiceUrl || config.PRODUCT_SERVICE_URL,
    orderServiceUrl: overrides.orderServiceUrl || config.ORDER_SERVICE_URL,
  };

  const log = logger.createLogger('api-gateway');
  return http.createApp({
    serviceName: 'api-gateway',
    logger: log,
    routes: (router) => {
      router.use('/users', proxyTo(serviceConfig.userServiceUrl));
      router.use('/products', proxyTo(serviceConfig.productServiceUrl));
      router.use('/orders', proxyTo(serviceConfig.orderServiceUrl));
      router.get('/', (_req, res) => {
        res.json({ message: 'Gateway ready' });
      });
    },
  });
}

async function start() {
  const app = createGatewayApp();
  http.start(app, { port: config.PORT, logger: logger.createLogger('api-gateway') });
}

if (require.main === module) {
  start().catch((error) => {
    // eslint-disable-next-line no-console
    console.error('[api-gateway] failed to start', error);
    process.exit(1);
  });
}

module.exports = {
  createGatewayApp,
  start,
  proxyTo,
};
