const { proxyTo } = require('../src/index');

describe('gateway proxy helper', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      text: () => Promise.resolve(JSON.stringify({ ok: true })),
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  function createRes() {
    return {
      statusCode: null,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
      },
      send(payload) {
        this.body = payload;
      },
    };
  }

  it('forwards request to target service', async () => {
    const handler = proxyTo('http://user-service');
    const req = {
      method: 'GET',
      headers: { authorization: 'Bearer token' },
      originalUrl: '/users/healthz',
    };
    const res = createRes();
    const next = jest.fn();

    await handler(req, res, next);

    expect(global.fetch).toHaveBeenCalledWith(
      'http://user-service/users/healthz',
      expect.objectContaining({ method: 'GET' }),
    );
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ ok: true });
    expect(next).not.toHaveBeenCalled();
  });

  it('forwards body for POST', async () => {
    const handler = proxyTo('http://order-service');
    const req = {
      method: 'POST',
      headers: {},
      body: { productId: 'prod-1' },
      originalUrl: '/orders',
    };
    const res = createRes();
    await handler(req, res, () => {});

    const [, init] = global.fetch.mock.calls[0];
    expect(init.body).toBe(JSON.stringify({ productId: 'prod-1' }));
    expect(init.headers['content-type']).toBe('application/json');
  });
});
