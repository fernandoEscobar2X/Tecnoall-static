export type JsonLd = Record<string, unknown> | Array<Record<string, unknown>>;

export interface SeoInput {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  imageAlt?: string;
  ogType?: 'website' | 'article';
  noindex?: boolean;
  jsonLd?: JsonLd;
}
