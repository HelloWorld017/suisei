// @ts-check

import { resolve } from 'node:path';
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import importX from 'eslint-plugin-import-x';
import noAutofix from 'eslint-plugin-no-autofix';
import prettier from 'eslint-plugin-prettier/recommended';
import ts from 'typescript-eslint';

export default ts.config({
  files: ['packages/**/*.ts', 'packages/**/*.tsx', 'eslint.config.js'],
  extends: [
    js.configs.recommended,
    ...ts.configs.recommendedTypeChecked,
    importX.flatConfigs.recommended,
    importX.flatConfigs.typescript,
    prettier,
  ],
  rules: {
    '@stylistic/lines-around-comment': [
      'error',
      {
        beforeBlockComment: false,
        afterBlockComment: false,
        beforeLineComment: false,
        afterLineComment: false,
      },
    ],
    '@stylistic/no-confusing-arrow': 'off',
    '@stylistic/no-multi-spaces': ['error', { ignoreEOLComments: true }],
    '@stylistic/no-tabs': 'error',
    '@stylistic/quotes': [
      'error',
      'single',
      { avoidEscape: true, allowTemplateLiterals: false },
    ],
    '@stylistic/quote-props': ['error', 'consistent'],
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'import-x/first': 'error',
    'import-x/newline-after-import': 'error',
    'import-x/no-default-export': 'error',
    'import-x/no-duplicates': 'error',
    'import-x/order': [
      'error',
      {
        'groups': [
          'builtin',
          'external',
          'internal',
          'parent',
          'index',
          'sibling',
          'type',
        ],
        'newlines-between': 'ignore',
        'alphabetize': { order: 'asc', caseInsensitive: false },
      },
    ],
    'import-x/prefer-default-export': 'off',
    'prettier/prettier': 'error',
    'camelcase': ['error', { properties: 'never' }],
    'class-methods-use-this': 'off',
    'curly': ['error', 'all'],
    'max-len': 'off',
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'prefer-const': 'off',
    'no-autofix/prefer-const': 'error',
    'prefer-promise-reject-errors': 'off',
  },
  languageOptions: {
    parser: ts.parser,
    parserOptions: {
      tsconfigRootDir: import.meta.dirname,
      project: [resolve(import.meta.dirname, './tsconfig.json')],
      projectService: true,
      ecmaVersion: 'latest',
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  plugins: {
    '@stylistic': stylistic,
    'no-autofix': noAutofix,
  },
  settings: {
    'import-x/internal-regex': '^(?:suisei|suisei-dom|@suisei/|@suisei-dom/)',
  },
});
