import type { APIRoute } from 'astro';

const getRobotsTxt = (sitemapUrl: URL) =>
  `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: ${sitemapUrl.href}\n`;

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    return new Response('User-agent: *\nDisallow: /\n', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  return new Response(getRobotsTxt(new URL('sitemap-index.xml', site)), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
