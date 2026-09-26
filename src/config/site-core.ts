const DEFAULT_SITE_URL = 'https://www.tecnoall.com.mx';

export function createSiteConfig(siteUrlInput?: string) {
  const siteUrl = (siteUrlInput || DEFAULT_SITE_URL).replace(/\/+$/, '');
  return {
    name: 'Tecno All',
    legalName: 'Tecno All de México S.A. de C.V.',
    description:
      'Ingeniería de tableros, integración de control y suministro industrial para plantas en Baja California.',
    siteUrl,
    locale: 'es_MX',
    language: 'es-MX',
    defaultOgImage: '/og/corporativo.png?v=20260922',
  } as const;
}

export type SiteConfig = ReturnType<typeof createSiteConfig>;

export const absoluteUrlFor = (siteConfig: SiteConfig, path = '/') =>
  new URL(path, `${siteConfig.siteUrl}/`).toString();
