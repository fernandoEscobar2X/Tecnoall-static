/** @type {import('prettier').Config} */
export default {
  plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
  printWidth: 100,
  singleQuote: true,
  trailingComma: 'all',
  tailwindStylesheet: './src/styles/global.css',
  overrides: [
    {
      files: '*.astro',
      options: { parser: 'astro' },
    },
  ],
};
