module.exports = {
  parser: 'babel-eslint',
  plugins: ['import', 'jest'],
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  env: {
    node: true,
    jest: true,
  },
  extends: ['airbnb-base'],
  rules: {
    'jest/no-focused-tests': 2,
    'jest/no-identical-title': 2,
  },
};
