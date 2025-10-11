// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginImportX from 'eslint-plugin-import-x';
import { createNextImportResolver } from 'eslint-import-resolver-next';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },

  eslint.configs.recommended,

  ...tseslint.configs.recommendedTypeChecked,

  // Plugin documentation: https://www.npmjs.com/package/eslint-plugin-import-x
  pluginImportX.flatConfigs.recommended,
  pluginImportX.flatConfigs.typescript,

  eslintPluginPrettierRecommended,

  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // Settings for plugins
  {
    settings: {
      'import-x/resolver-next': [createNextImportResolver()],
    },
  },

  {
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },

  // Import rules
  {
    rules: {
      'import-x/default': 'off',
      'import-x/no-named-as-default-member': 'off',
      'import-x/no-nodejs-modules': 'off',
      'import-x/no-absolute-path': 'error',
      'import-x/consistent-type-specifier-style': ['warn', 'prefer-top-level'],
      'import-x/export': 'warn',
      'import-x/first': 'warn',
      'import-x/newline-after-import': 'warn',
      'import-x/no-dynamic-require': 'warn',
      'import-x/no-extraneous-dependencies': 'warn',
      'import-x/no-named-default': 'warn',
      'import-x/no-unused-modules': 'warn',
      'import-x/no-useless-path-segments': 'warn',
      'import-x/order': [
        'warn',
        {
          groups: [
            'type',
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
          ],
          pathGroups: [
            {
              pattern: '@icc/**',
              group: 'external',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['type'],
          'newlines-between': 'never',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      // Alphabetize named members within import specifiers: { A, B, C }
      // Use core rule alongside import-x/order (ignoreDeclarationSort avoids conflicts)
      'sort-imports': [
        'warn',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          allowSeparatedGroups: false,
        },
      ],
    },
  },
);
