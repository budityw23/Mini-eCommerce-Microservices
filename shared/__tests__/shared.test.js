const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');
const { env, logger, http, NotFoundError, ValidationError } = require('..');

describe('shared package', () => {
  afterEach(() => {
    delete process.env.TEST_REQUIRED;
  });

  it('loads env files and returns config with defaults', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mini-env-'));
    const envPath = path.join(dir, '.env');
    fs.writeFileSync(envPath, 'TEST_REQUIRED=value\n');

    env.loadEnv({ baseDir: dir });
    const config = env.getConfig({
      TEST_REQUIRED: { required: true },
      OPTIONAL: { default: 'fallback' },
    });

    expect(config.TEST_REQUIRED).toBe('value');
    expect(config.OPTIONAL).toBe('fallback');
  });

  it('throws when required env missing', () => {
    expect(() => env.getConfig({ TEST_REQUIRED: { required: true } })).toThrow(/Missing required/);
  });

  it('creates simple logger wrapper', () => {
    const log = logger.createLogger('test');
    expect(typeof log.info).toBe('function');
  });

  it('exposes http helpers that return express app', () => {
    const app = http.createApp({ serviceName: 'test', logger: logger.createLogger('test') });
    expect(typeof app).toBe('function');
    expect(app.get).toBeDefined();
  });

  it('exports error classes', () => {
    expect(new NotFoundError()).toBeInstanceOf(Error);
    expect(new ValidationError().status).toBe(400);
  });
});
