import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, envField } from 'astro/config';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');
const site = env.PUBLIC_SITE_URL || 'https://www.tecnoall.com.mx';

export default defineConfig({
  site,
  output: 'static',
  // Una sola convención para que Netlify sirva cada página como archivo estático.
  trailingSlash: 'always',
  integrations: [
    react(),
    sitemap({
      // Contacto se consolida en /empresa/#escribanos. Industrias permanece
      // preparada, pero oculta y no indexable hasta su lanzamiento comercial.
      filter: (page) => {
        const path = page.replace(/\/$/, '');
        const isCaseDetail = /\/casos-de-exito\/.+/.test(path);
        return (
          !page.endsWith('/404/') &&
          !page.endsWith('/404') &&
          !page.includes('/contacto/') &&
          !page.includes('/industrias/') &&
          !page.includes('/admin/') &&
          !page.includes('/api/') &&
          !isCaseDetail
        );
      },
    }),
  ],
  env: {
    schema: {
      PUBLIC_SITE_URL: envField.string({
        context: 'client',
        access: 'public',
        default: 'https://www.tecnoall.com.mx',
      }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    inlineStylesheets: 'always',
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'viewport',
  },
});
