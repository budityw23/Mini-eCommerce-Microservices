process.env.JWT_SECRET = 'test-secret';

const jwt = require('jsonwebtoken');
const { UnauthorizedError, ValidationError } = require('@mini/shared');
const { setPool, initDb } = require('../src/db');
const { listUserOrders, recordOrder } = require('../src/service');
const authRequired = require('../src/auth-middleware');

class FakePool {
  constructor() {
    this.rows = [];
  }

  async query(sql, params = []) {
    if (/CREATE TABLE/i.test(sql)) {
      return { rows: [] };
    }

    if (/INSERT INTO orders/i.test(sql)) {
      const [id, userId, productId] = params;
      const row = { id, user_id: userId, product_id: productId, created_at: new Date() };
      this.rows.push(row);
      return { rows: [] };
    }

    if (/SELECT \* FROM orders WHERE user_id = \$1/i.test(sql)) {
      const userId = params[0];
      const limit = params[1];
      const offset = params[2];

      const filtered = this.rows
        .filter((row) => row.user_id === userId)
        .slice(offset, offset + limit);

      return { rows: filtered };
    }

    throw new Error(`Unhandled query: ${sql}`);
  }
}

describe('order service basics', () => {
  beforeEach(async () => {
    const pool = new FakePool();
    setPool(pool);
    await initDb(pool);
  });

  it('records and retrieves orders for a user', async () => {
    const created = await recordOrder({ userId: 'user-1', productId: 'prod-1' });
    expect(created.userId).toBe('user-1');

    const orders = await listUserOrders('user-1');
    expect(orders).toHaveLength(1);
    expect(orders[0].productId).toBe('prod-1');
  });

  it('validates pagination inputs', async () => {
    await expect(listUserOrders('user-1', { limit: 'abc' })).rejects.toThrow(ValidationError);
  });

  it('auth middleware populates req.user', () => {
    const token = jwt.sign({ sub: 'user-1', username: 'anna', role: 'user' }, process.env.JWT_SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = {};
    const next = jest.fn();
    authRequired(req, res, next);
    expect(req.user.id).toBe('user-1');
    expect(next).toHaveBeenCalledWith();
  });

  it('auth middleware rejects missing token', () => {
    const req = { headers: {} };
    const res = {};
    const next = jest.fn();
    authRequired(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });
});
