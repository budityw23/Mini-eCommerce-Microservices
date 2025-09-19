const { serviceName } = require('../src');

describe('shared helpers', () => {
  it('prefixes names consistently', () => {
    expect(serviceName('user')).toBe('mini-ecommerce:user');
  });

  it('throws when name missing', () => {
    expect(() => serviceName()).toThrow('Name is required');
  });
});
