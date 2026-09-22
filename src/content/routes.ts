import { homeContent } from './home';

export const solutionSlugs = {
  'solution-system-integration': 'integracion-de-sistemas',
  'solution-panels': 'tableros-de-control',
  'solution-plc-scada': 'plc-scada',
  'solution-cloud-web': 'telemetria-visualizacion-web',
  'solution-industry4': 'industria-4-0',
} as const;

export const industrySlugs = {
  'industry-process': 'procesos',
  'industry-manufacturing': 'manufactura',
} as const;

export const solutionPages = homeContent.solutions.map((solution) => ({
  ...solution,
  slug: solutionSlugs[solution.id],
}));

export const industryPages = homeContent.industries.map((industry) => ({
  ...industry,
  slug: industrySlugs[industry.id],
}));

export type SolutionPage = (typeof solutionPages)[number];
export type IndustryPage = (typeof industryPages)[number];
