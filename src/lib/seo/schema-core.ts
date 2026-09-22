import { homeContent } from '@/content/home';
import type { SiteConfig } from '@/config/site-core';

export type SchemaNode = Record<string, unknown>;

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface ListItem {
  name: string;
  url?: string;
  description?: string;
}

export function createSchemaTools(siteConfig: SiteConfig, absoluteUrl: (path?: string) => string) {
  const organizationId = absoluteUrl('/#organization');
  const websiteId = absoluteUrl('/#website');
  const schemaGraph = (nodes: readonly SchemaNode[]) => ({
    '@context': 'https://schema.org',
    '@graph': nodes,
  });

  function organizationSchema(): SchemaNode {
    const locations = homeContent.trust.locations;
    return {
      '@type': 'Organization',
      '@id': organizationId,
      name: siteConfig.name,
      legalName: siteConfig.legalName,
      url: absoluteUrl('/'),
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl(homeContent.company.logo.src),
        caption: siteConfig.name,
      },
      image: absoluteUrl(siteConfig.defaultOgImage),
      description: homeContent.company.description,
      email: homeContent.contact.email,
      telephone: homeContent.contact.phone,
      sameAs: homeContent.social.map((profile) => profile.href),
      contactPoint: locations.map((location) => ({
        '@type': 'ContactPoint',
        telephone: location.phone,
        contactType: 'sales',
        areaServed: 'MX',
        availableLanguage: ['es'],
      })),
      department: locations.map((location) => ({
        '@id': absoluteUrl(`/empresa/#sede-${location.city.toLowerCase()}`),
      })),
      knowsAbout: homeContent.solutions.map((solution) => solution.title),
    };
  }

  function locationSchemas(): SchemaNode[] {
    return homeContent.trust.locations.map((location) => ({
      '@type': 'ProfessionalService',
      '@id': absoluteUrl(`/empresa/#sede-${location.city.toLowerCase()}`),
      name: `${siteConfig.name} ${location.city}`,
      parentOrganization: { '@id': organizationId },
      url: absoluteUrl('/empresa/#escribanos'),
      image: absoluteUrl(siteConfig.defaultOgImage),
      email: homeContent.contact.email,
      telephone: location.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: location.streetAddress,
        addressLocality: location.city,
        addressRegion: location.region,
        postalCode: location.postalCode,
        addressCountry: location.country,
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: location.latitude,
        longitude: location.longitude,
      },
    }));
  }

  function websiteSchema(): SchemaNode {
    return {
      '@type': 'WebSite',
      '@id': websiteId,
      url: absoluteUrl('/'),
      name: siteConfig.name,
      description: siteConfig.description,
      inLanguage: siteConfig.language,
      publisher: { '@id': organizationId },
    };
  }

  function breadcrumbSchema(items: readonly BreadcrumbItem[], pageUrl: string): SchemaNode {
    return {
      '@type': 'BreadcrumbList',
      '@id': `${pageUrl}#breadcrumb`,
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: absoluteUrl(item.path),
      })),
    };
  }

  function webPageSchema(input: {
    name: string;
    description: string;
    url: string;
    image?: string;
    type?: 'WebPage' | 'CollectionPage' | 'AboutPage';
    mainEntityId?: string;
    hasBreadcrumb?: boolean;
  }): SchemaNode {
    return {
      '@type': input.type ?? 'WebPage',
      '@id': `${input.url}#webpage`,
      url: input.url,
      name: input.name,
      description: input.description,
      inLanguage: siteConfig.language,
      isPartOf: { '@id': websiteId },
      about: { '@id': organizationId },
      ...(input.hasBreadcrumb ? { breadcrumb: { '@id': `${input.url}#breadcrumb` } } : {}),
      ...(input.image
        ? { primaryImageOfPage: { '@type': 'ImageObject', url: absoluteUrl(input.image) } }
        : {}),
      ...(input.mainEntityId ? { mainEntity: { '@id': input.mainEntityId } } : {}),
    };
  }

  function pageSchema(input: {
    name: string;
    description: string;
    path: string;
    image?: string;
    type?: 'WebPage' | 'CollectionPage' | 'AboutPage';
    breadcrumbs?: readonly BreadcrumbItem[];
    mainEntityId?: string;
    includeLocations?: boolean;
    additionalNodes?: readonly SchemaNode[];
  }) {
    const pageUrl = absoluteUrl(input.path);
    const breadcrumbs = input.breadcrumbs ?? [];
    return schemaGraph([
      organizationSchema(),
      websiteSchema(),
      ...(input.includeLocations ? locationSchemas() : []),
      ...(breadcrumbs.length > 0 ? [breadcrumbSchema(breadcrumbs, pageUrl)] : []),
      webPageSchema({
        name: input.name,
        description: input.description,
        url: pageUrl,
        hasBreadcrumb: breadcrumbs.length > 0,
        ...(input.image ? { image: input.image } : {}),
        ...(input.type ? { type: input.type } : {}),
        ...(input.mainEntityId ? { mainEntityId: input.mainEntityId } : {}),
      }),
      ...(input.additionalNodes ?? []),
    ]);
  }

  function serviceSchema(input: {
    name: string;
    description: string;
    url: string;
    id?: string;
  }): SchemaNode {
    return {
      '@type': 'Service',
      '@id': input.id ?? `${input.url}#service`,
      name: input.name,
      description: input.description,
      url: input.url,
      serviceType: input.name,
      provider: { '@id': organizationId },
      areaServed: { '@type': 'Country', name: 'México' },
    };
  }

  function itemListSchema(name: string, url: string, items: readonly ListItem[]): SchemaNode {
    return {
      '@type': 'ItemList',
      '@id': `${url}#items`,
      name,
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Thing',
          name: item.name,
          ...(item.url ? { url: absoluteUrl(item.url) } : {}),
          ...(item.description ? { description: item.description } : {}),
        },
      })),
    };
  }

  return {
    schemaGraph,
    organizationSchema,
    locationSchemas,
    websiteSchema,
    breadcrumbSchema,
    webPageSchema,
    pageSchema,
    serviceSchema,
    itemListSchema,
  };
}
