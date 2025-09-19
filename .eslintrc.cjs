module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: ['eslint:recommended', 'plugin:import/recommended', 'plugin:jest/recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'script',
  },
  plugins: ['import', 'jest'],
  rules: {
    'no-console': 'off',
  },
  ignorePatterns: ['node_modules/', 'coverage/', 'dist/'],
};
