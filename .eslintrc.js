module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:import/errors',
      'plugin:import/warnings',
      'plugin:node/recommended',
    ],
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn', // Warn on usage of `any`
      '@typescript-eslint/explicit-function-return-type': 'error', // Require explicit return types on functions and class methods
      '@typescript-eslint/explicit-module-boundary-types': 'error', // Require explicit return types on exported functions and classes
      '@typescript-eslint/no-inferrable-types': 'warn', // Warn when types can be inferred
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // Prevent unused variables, ignore arguments that start with `_`
      'import/order': ['error', { groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'] }],
      'node/no-unpublished-require': 'off',
    },
    settings: {
      'import/resolver': {
        typescript: {},
      },
    },
  };
  