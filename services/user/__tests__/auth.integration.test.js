process.env.JWT_SECRET = 'test-secret';
process.env.ADMIN_USERNAME = 'admin';
process.env.ADMIN_PASSWORD = 'admin123';

const { setPool, initDb } = require('../src/db');
const { registerUser, loginUser, getProfile } = require('../src/service');
const { UnauthorizedError } = require('@mini/shared');
const authRequired = require('../src/auth-middleware');

class FakePool {
  constructor() {
    this.byUsername = new Map();
    this.byId = new Map();
  }

  async query(sql, params = []) {
    if (/CREATE TABLE/i.test(sql)) {
      return { rows: [] };
    }

    if (/SELECT id FROM users WHERE username = \$1/i.test(sql)) {
      const username = params[0];
      const user = this.byUsername.get(username);
      return { rows: user ? [{ id: user.id }] : [] };
    }

    if (/INSERT INTO users/i.test(sql)) {
      const [id, username, passwordHash, role] = params;
      const record = { id, username, password_hash: passwordHash, role };
      this.byUsername.set(username, record);
      this.byId.set(id, record);
      return { rows: [] };
    }

    if (/SELECT \* FROM users WHERE username = \$1/i.test(sql)) {
      const username = params[0];
      const user = this.byUsername.get(username);
      return { rows: user ? [user] : [] };
    }

    if (/SELECT \* FROM users WHERE id = \$1/i.test(sql)) {
      const id = params[0];
      const user = this.byId.get(id);
      return { rows: user ? [user] : [] };
    }

    throw new Error(`Query not implemented in FakePool: ${sql}`);
  }
}

describe('user service auth flows', () => {
  beforeEach(async () => {
    const pool = new FakePool();
    setPool(pool);
    await initDb(pool);
  });

  it('registers a new user and returns token', async () => {
    const result = await registerUser({ username: 'alice', password: 'password123' });
    expect(result.user.username).toBe('alice');
    expect(result.token).toBeTruthy();
  });

  it('rejects duplicate usernames', async () => {
    await registerUser({ username: 'alice', password: 'password123' });
    await expect(registerUser({ username: 'alice', password: 'otherpass' })).rejects.toThrow(
      /already taken/,
    );
  });

  it('logs in seeded admin user and fetches profile', async () => {
    const login = await loginUser({ username: 'admin', password: 'admin123' });
    expect(login.user.role).toBe('admin');

    const profile = await getProfile(login.user.id);
    expect(profile.username).toBe('admin');
  });

  it('auth middleware rejects bad token', () => {
    const req = { headers: { authorization: 'Bearer bad' } };
    const res = {};
    const next = jest.fn();

    authRequired(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });
});
