import { PUBLIC_SITE_URL } from 'astro:env/client';
import { absoluteUrlFor, createSiteConfig } from './site-core';

export const siteConfig = createSiteConfig(PUBLIC_SITE_URL);

export const absoluteUrl = (path = '/') => absoluteUrlFor(siteConfig, path);
