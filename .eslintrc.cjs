module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  settings: {
    'import/parser': '@typescript-eslint/parser',
    'import/resolver': {
      node: {
        paths: ['~/'],
        extensions: ['.js', '.ts', '.tsx', '.jsx'],
      },
      alias: {
        map: [['~', './']],
        extensions: ['.ts', '.js', '.tsx'],
      },
    },
  },
  plugins: [
    '@typescript-eslint',
    'prettier',
    'eslint-plugin-import-helpers',
    'mocha',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:eslint-comments/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:sonarjs/recommended',
    'plugin:unicorn/recommended',
  ],
  ignorePatterns: ['README.md'],
  overrides: [
    {
      files: ['**/scripts/**/*.ts'],
      rules: {
        'unicorn/no-process-exit': 'off',
        'unicorn/prefer-top-level-await': 'off',
      },
    },
    {
      files: ['**/test/**/*.ts'],
      rules: {
        'unicorn/filename-case': 'off',
      },
    },
  ],
  rules: {
    eqeqeq: 'error',
    'prettier/prettier': 'warn',
    'prefer-const': 'warn',
    'no-console': 'off',
    'eslint-comments/no-unused-disable': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    'unicorn/filename-case': [
      'error',
      { case: 'kebabCase', ignore: [/^\$/, 'README.md$'] },
    ],
    'import/order': [
      'warn',
      {
        'newlines-between': 'always',
      },
    ],
    'unicorn/prevent-abbreviations': ['error'],
  },
}
