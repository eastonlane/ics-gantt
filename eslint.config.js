import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs.recommended,
  prettier,
  {
    plugins: { 'unused-imports': unusedImports },
    rules: {
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-unused-vars': 'off', // let unused-imports handle it
    },
  },
  {
    languageOptions: {
      parserOptions: {
        // Keep this consistent for TypeScript and Svelte files to avoid project reloads.
        extraFileExtensions: ['.svelte'],
      },
      globals: {
        ...globals.browser,
        // for Sveltekit in non-SPA mode
        ...globals.node,
      },
    },
    // ...
  },
  {
    files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
    // See more details at: https://typescript-eslint.io/packages/parser/
    languageOptions: {
      parserOptions: {
        projectService: true,
        parser: {
          ts: ts.parser,
          typescript: ts.parser,
        },
        svelteConfig,
      },
    },
  },
  {
    // Generated UI primitives accept arbitrary href values for use as links.
    files: ['src/lib/components/ui/**/*.svelte'],
    rules: {
      'svelte/no-navigation-without-resolve': 'off',
    },
  },
  {
    ignores: ['.svelte-kit/**', 'node_modules/**', 'dist/**', 'build/**'],
  },
];
