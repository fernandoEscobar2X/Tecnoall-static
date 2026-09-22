import { absoluteUrl, siteConfig } from '@config/site';
import { createSchemaTools } from './schema-core';

export type { BreadcrumbItem, ListItem, SchemaNode } from './schema-core';

export const {
  schemaGraph,
  organizationSchema,
  locationSchemas,
  websiteSchema,
  breadcrumbSchema,
  webPageSchema,
  pageSchema,
  serviceSchema,
  itemListSchema,
} = createSchemaTools(siteConfig, absoluteUrl);
