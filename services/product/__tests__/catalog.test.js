const { NotFoundError, ValidationError } = require('@mini/shared');
const { setPool, initDb } = require('../src/db');
const { fetchProducts, fetchProduct } = require('../src/service');

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
});
