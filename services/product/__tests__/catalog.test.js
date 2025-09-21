process.env.JWT_SECRET = 'test-secret';

const { NotFoundError, ValidationError, UnauthorizedError } = require('@mini/shared');
const { setPool, initDb } = require('../src/db');
const {
  fetchProducts,
  fetchProduct,
  createProductRecord,
  updateProductRecord,
} = require('../src/service');
const authRequired = require('../src/auth-middleware');
const adminOnly = require('../src/admin-middleware');

class FakePool {
  constructor() {
    this.rows = new Map();
    this.order = [];
  }

  async query(sql, params = []) {
    if (/CREATE TABLE/i.test(sql)) {
      return { rows: [] };
    }

    if (/SELECT COUNT/gi.test(sql)) {
      return { rows: [{ count: this.order.length }] };
    }

    if (/INSERT INTO products/i.test(sql)) {
      const [id, name, description, price] = params;
      this.rows.set(id, {
        id,
        name,
        description,
        price,
        created_at: new Date(),
      });
      this.order.push(id);
      return { rows: [] };
    }

    if (/SELECT \* FROM products WHERE id = \$1/i.test(sql)) {
      const id = params[0];
      const item = this.rows.get(id);
      return { rows: item ? [item] : [] };
    }

    if (/SELECT \* FROM products ORDER BY created_at DESC LIMIT \$1 OFFSET \$2/i.test(sql)) {
      const limit = params[0];
      const offset = params[1];
      const slice = this.order.slice(offset, offset + limit).map((id) => this.rows.get(id));
      return { rows: slice };
    }

    if (/UPDATE products SET/i.test(sql)) {
      const id = params[params.length - 1];
      const record = this.rows.get(id);
      if (!record) {
        return { rows: [] };
      }

      const assignments = sql
        .split('SET')[1]
        .split('WHERE')[0]
        .split(',')
        .map((chunk) => chunk.trim().split(' = ')[0]);

      assignments.forEach((field, idx) => {
        const value = params[idx];
        if (field === 'name') record.name = value;
        if (field === 'description') record.description = value;
        if (field === 'price') record.price = value;
      });

      return { rows: [record] };
    }

    throw new Error(`Query not handled: ${sql}`);
  }
}

describe('product catalog service', () => {
  beforeEach(async () => {
    const pool = new FakePool();
    setPool(pool);
    await initDb(pool);
  });

  it('returns seeded products', async () => {
    const products = await fetchProducts();
    expect(products.length).toBeGreaterThan(0);
  });

  it('rejects invalid pagination', async () => {
    await expect(fetchProducts({ limit: 'abc' })).rejects.toThrow(ValidationError);
  });

  it('fetches product by id', async () => {
    const products = await fetchProducts();
    const product = await fetchProduct(products[0].id);
    expect(product.id).toBe(products[0].id);
  });

  it('throws for unknown product id', async () => {
    await expect(fetchProduct('unknown')).rejects.toThrow(NotFoundError);
  });

  it('creates and updates products with validation', async () => {
    const created = await createProductRecord({
      name: 'Webcam',
      description: '1080p webcam',
      price: 49.99,
    });

    expect(created.name).toBe('Webcam');

    const updated = await updateProductRecord(created.id, { price: 59.5 });
    expect(updated.price).toBe(59.5);
  });

  it('admin middleware rejects non-admin tokens', () => {
    const req = { user: { role: 'user' } };
    const res = {};
    const next = jest.fn();
    adminOnly(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });

  it('auth middleware attaches decoded token', () => {
    const token = require('jsonwebtoken').sign(
      { sub: 'user-1', username: 'admin', role: 'admin' },
      process.env.JWT_SECRET,
    );

    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = {};
    const next = jest.fn();

    authRequired(req, res, next);
    expect(req.user.role).toBe('admin');
    expect(next).toHaveBeenCalledWith();
  });
});
