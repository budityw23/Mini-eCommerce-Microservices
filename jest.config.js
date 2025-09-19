module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  roots: ['<rootDir>/services', '<rootDir>/gateway', '<rootDir>/shared'],
  collectCoverageFrom: ['services/**/*.js', 'gateway/**/*.js', 'shared/**/*.js', '!**/__tests__/**'],
};
