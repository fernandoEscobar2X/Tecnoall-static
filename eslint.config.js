import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import eslintPluginAstro from 'eslint-plugin-astro';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  {
    ignores: ['.astro/**', '.netlify/**', 'dist/**', 'coverage/**', 'node_modules/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginAstro.configs['jsx-a11y-recommended'],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      /**
       * Un contenedor con desplazamiento horizontal debe poder recibir foco:
       * WCAG 2.1.1 exige que el área sea operable por teclado, y sin `tabindex`
       * no hay forma de desplazarla con las flechas. La regla, tal cual, lo lee
       * como un elemento no interactivo. Se admite solo sobre `role="group"`,
       * que es como se marcan esas tiras; el resto de la regla sigue activo.
       */
      'astro/jsx-a11y/no-noninteractive-tabindex': ['error', { roles: ['group'] }],
    },
  },
  eslintConfigPrettier,
);
