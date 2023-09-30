module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier'
  ],
  plugins: ['@typescript-eslint', 'import', 'prettier', 'no-autofix'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./suisei/tsconfig.json', './suisei-dom/tsconfig.json'],
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaVersion: 'latest',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-default-export': 'error',
    'import/no-duplicates': 'error',
    'import/order': [
      'error',
      {
        'groups': ['external', 'internal', 'parent', 'index', 'sibling', 'type'],
        'newlines-between': 'ignore',
        'alphabetize': { order: 'asc', caseInsensitive: false }
      }
    ],
    'import/prefer-default-export': 'off',
    'camelcase': ['error', { properties: 'never' }],
    'class-methods-use-this': 'off',
    'curly': ['error', 'all'],
    'lines-around-comment': [
      'error',
      {
        beforeBlockComment: false,
        afterBlockComment: false,
        beforeLineComment: false,
        afterLineComment: false,
      },
    ],
    'max-len': 'off',
    'no-confusing-arrow': 'off',
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-multi-spaces': ['error', { ignoreEOLComments: true }],
    'no-tabs': 'error',
    'prefer-const': 'off',
    'no-autofix/prefer-const': 'error',
    'prefer-promise-reject-errors': 'off',
    'prettier/prettier': 'error',
    'quotes': ['error', 'single', {
      avoidEscape: true,
      allowTemplateLiterals: false,
    }],
    'quote-props': ['error', 'consistent']
  },
  settings: {
    'import/internal-regex': '^(?:suisei|suisei-dom|@suisei/|@suisei-dom/)',
    'import/resolver': {
      typescript: {},
    },
  },
  ignorePatterns: ['dist', 'node_modules'],
};
