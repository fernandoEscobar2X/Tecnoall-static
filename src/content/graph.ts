import { homeContent } from './home';
import { solutionSlugs, industrySlugs } from './routes';

type Solution = (typeof homeContent.solutions)[number];
type Product = (typeof homeContent.products)[number];
type Industry = (typeof homeContent.industries)[number];

export type SolutionId = Solution['id'];
export type ProductId = Product['id'];
export type IndustryId = Industry['id'];

/** Qué familias de producto intervienen en cada línea de solución. */
export const solutionProducts: Record<SolutionId, readonly ProductId[]> = {
  'solution-system-integration': ['product-plc', 'product-automation', 'product-connectivity'],
  'solution-panels': [
    'product-enclosures',
    'product-connectivity',
    'product-engineering',
    'product-sensors',
  ],
  'solution-plc-scada': ['product-plc', 'product-hmi', 'product-drives', 'product-motors'],
  'solution-cloud-web': ['product-automation', 'product-hmi', 'product-sensors'],
  'solution-industry4': ['product-automation', 'product-sensors', 'product-hmi'],
};

/** En qué sectores se aplica cada línea. */
export const solutionIndustries: Record<SolutionId, readonly IndustryId[]> = {
  'solution-system-integration': ['industry-process', 'industry-manufacturing'],
  'solution-panels': ['industry-process', 'industry-manufacturing'],
  'solution-plc-scada': ['industry-process', 'industry-manufacturing'],
  'solution-cloud-web': ['industry-process'],
  'solution-industry4': ['industry-manufacturing'],
};

const byId = <T extends { id: string }>(items: readonly T[], ids: readonly string[]) =>
  ids.map((id) => items.find((item) => item.id === id)).filter((item): item is T => Boolean(item));

export const productsForSolution = (id: SolutionId) =>
  byId(homeContent.products, solutionProducts[id] ?? []);

export const industriesForSolution = (id: SolutionId) =>
  byId(homeContent.industries, solutionIndustries[id] ?? []).map((industry) => ({
    ...industry,
    slug: industrySlugs[industry.id],
  }));

export const solutionsForIndustry = (id: IndustryId) =>
  homeContent.solutions
    .filter((solution) => (solutionIndustries[solution.id] ?? []).includes(id))
    .map((solution) => ({ ...solution, slug: solutionSlugs[solution.id] }));

export const productsForIds = (ids: readonly string[]) => byId(homeContent.products, ids);

export const solutionsForIds = (ids: readonly string[]) =>
  byId(homeContent.solutions, ids).map((solution) => ({
    ...solution,
    slug: solutionSlugs[solution.id],
  }));
