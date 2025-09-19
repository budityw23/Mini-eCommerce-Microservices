const http = require('node:http');

const SERVICE_NAME = 'order-service';
const PORT = Number(process.env.PORT || 3003);

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/healthz') {
    const payload = JSON.stringify({ service: SERVICE_NAME, status: 'ok' });
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
    });
    res.end(payload);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(PORT, () => {
  console.log(`[${SERVICE_NAME}] listening on port ${PORT}`);
});

const shutdown = () => {
  console.log(`[${SERVICE_NAME}] shutting down`);
  server.close(() => process.exit(0));
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

module.exports = server;
