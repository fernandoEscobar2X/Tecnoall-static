import acueductoAppImage from '@assets/tecnoall/casos/acueducto/app-movil.webp';
import acueductoCoverImage from '@assets/tecnoall/casos/acueducto/portada.webp';
import bombeoCoverImage from '@assets/tecnoall/casos/bombeo/portada.webp';
import bombeoRenderFrontImage from '@assets/tecnoall/casos/bombeo/render-frontal.webp';
import bombeoRenderInteriorImage from '@assets/tecnoall/casos/bombeo/render-interior.webp';
import bombeoTableroImage from '@assets/tecnoall/casos/bombeo/tablero-fabricado.webp';
import cosechadoraHmiImage from '@assets/tecnoall/casos/cosechadora/hmi-operacion.webp';
import cosechadoraCoverImage from '@assets/tecnoall/casos/cosechadora/portada.webp';
import desalinationHmiImage from '@assets/tecnoall/casos/desalinizadora/hmi-proceso.webp';
import desalinationLocalPanelImage from '@assets/tecnoall/casos/desalinizadora/panel-local.webp';
import desalinationPanelsImage from '@assets/tecnoall/casos/desalinizadora/paneles-control.webp';
import desalinationPlantImage from '@assets/tecnoall/casos/desalinizadora/portada.webp';
import lentesAreaImage from '@assets/tecnoall/casos/lentes/area-produccion.webp';
import lentesCoverImage from '@assets/tecnoall/casos/lentes/portada.webp';
import lentesMachineryImage from '@assets/tecnoall/casos/lentes/maquinaria.webp';
import lentesTableroImage from '@assets/tecnoall/casos/lentes/tablero.webp';

type CaseImage = typeof acueductoCoverImage;

/** Evidencia y alcance documentado de una fase del proyecto. */
export interface CaseStage {
  id: string;
  label: string;
  title: string;
  summary: string;
  deliverables: readonly string[];
  tags: readonly string[];
  image: CaseImage;
  imageAlt: string;
}

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  summary: string;
  industry: string;
  location: string;
  year: string;
  duration?: string;
  status?: string;
  services: readonly string[];
  brands: readonly string[];
  solutionIds: readonly string[];
  productIds: readonly string[];
  image: CaseImage;
  imageAlt: string;
  externalUrl?: string;
  /** Alcance compacto utilizado sobre la evidencia del proyecto en el home. */
  homeScope?: string;
  /** Frase del home: línea que abre, línea que cierra; la foto va en medio. */
  homePhrase?: {
    open: string;
    close: string;
    statValue: number;
    statUnit: string;
    statLabel: string;
  };
  stages: readonly CaseStage[];
}

/**
 * Casos respaldados por el Line Card 2025 de Tecno All y por evidencia visual
 * proporcionada por la empresa. No completar resultados o alcances por inferencia.
 */
export const approvedCaseStudies: readonly CaseStudy[] = [
  {
    id: 'case-desalination-plant',
    slug: 'planta-desalinizadora',
    title: 'Automatización y telemetría para planta desalinizadora',
    summary:
      'Suministro de paneles de control, automatización y telemetría para el módulo 4 de una planta desalinizadora, con capacidad de 500 mil galones por día',
    industry: 'Procesos',
    location: 'Los Cabos, B.C.S.',
    year: '2019',
    status: 'Entregado en abril de 2019',
    services: ['Paneles de control', 'Automatización', 'Telemetría'],
    brands: ['Siemens'],
    solutionIds: ['solution-system-integration', 'solution-panels', 'solution-plc-scada'],
    productIds: ['product-plc', 'product-hmi', 'product-enclosures'],
    image: desalinationPlantImage,
    imageAlt: 'Módulo de desalinización de agua de mar automatizado por Tecno All',
    homeScope: 'Paneles de control, automatización y telemetría para 500 mil galones por día.',
    homePhrase: {
      open: 'Módulo 4',
      close: 'Planta desalinizadora',
      statValue: 500,
      statUnit: 'mil',
      statLabel: 'galones por día',
    },
    stages: [
      {
        id: 'stage-control-panels',
        label: 'Paneles',
        title: 'Paneles de control del módulo 4',
        summary:
          'Tecno All suministró los paneles de control requeridos para un módulo de desalinización de agua de mar',
        deliverables: ['Paneles de control del proceso', 'Panel local integrado al módulo'],
        tags: ['Paneles de control', 'Módulo 4'],
        image: desalinationPanelsImage,
        imageAlt: 'Paneles de control suministrados para el módulo de desalinización',
      },
      {
        id: 'stage-automation',
        label: 'Automatización',
        title: 'Automatización y visualización del proceso',
        summary:
          'La solución integra automatización e interfaz HMI para supervisar el proceso del módulo desalinizador',
        deliverables: ['Automatización del módulo 4', 'Visualización del proceso en HMI'],
        tags: ['Automatización', 'HMI'],
        image: desalinationHmiImage,
        imageAlt: 'Interfaz HMI del proceso de desalinización de agua de mar',
      },
      {
        id: 'stage-telemetry',
        label: 'Telemetría',
        title: 'Telemetría para la operación de planta',
        summary:
          'La telemetría forma parte del alcance entregado para el seguimiento operativo del módulo de la planta',
        deliverables: [
          'Telemetría integrada al sistema',
          'Capacidad del módulo: 500 mil galones por día',
        ],
        tags: ['Telemetría', 'Operación'],
        image: desalinationLocalPanelImage,
        imageAlt: 'Panel local del sistema de control de la planta desalinizadora',
      },
    ],
  },
  {
    id: 'case-carl-zeiss-lenses',
    slug: 'linea-lentes-carl-zeiss',
    title: 'Línea de producción de lentes oftálmicas',
    summary:
      'Desarrollo de una línea de producción de lentes oftálmicas de policarbonato mediante procesos de inyección directa',
    industry: 'Fabricación',
    location: 'Tijuana, B.C.',
    year: 'Completado',
    services: ['Integración de sistemas', 'Paneles de control', 'Automatización'],
    brands: ['Siemens'],
    solutionIds: ['solution-system-integration', 'solution-panels', 'solution-plc-scada'],
    productIds: ['product-plc', 'product-hmi', 'product-enclosures'],
    image: lentesCoverImage,
    imageAlt: 'Línea de producción de lentes oftálmicas automatizada',
    homeScope: 'Integración de la línea, paneles de control y automatización.',
    stages: [
      {
        id: 'stage-production-area',
        label: 'Línea',
        title: 'Área de producción integrada',
        summary:
          'La línea conecta maquinaria de inyección y estaciones de proceso bajo un sistema de control unificado',
        deliverables: [
          'Integración de línea de producción',
          'Control de procesos de inyección directa',
        ],
        tags: ['Integración', 'Manufactura'],
        image: lentesAreaImage,
        imageAlt: 'Área de producción de la línea de lentes oftálmicas',
      },
      {
        id: 'stage-machinery',
        label: 'Maquinaria',
        title: 'Maquinaria de la línea de inyección',
        summary:
          'El alcance incluye la integración de equipos de manufactura que forman parte del proceso de producción de lentes',
        deliverables: [
          'Integración de maquinaria de proceso',
          'Señales de campo conectadas al control',
        ],
        tags: ['Manufactura', 'Integración'],
        image: lentesMachineryImage,
        imageAlt: 'Maquinaria integrada en la línea de producción de lentes',
      },
      {
        id: 'stage-control-panel',
        label: 'Tablero',
        title: 'Tablero de control de la línea',
        summary:
          'Tablero de control fabricado e integrado para operar la línea de producción de lentes oftálmicas',
        deliverables: ['Tablero de control de la línea', 'Alambrado e integración en taller'],
        tags: ['Paneles de control', 'Fabricación'],
        image: lentesTableroImage,
        imageAlt: 'Tablero de control fabricado para la línea de lentes oftálmicas',
      },
    ],
  },
  {
    id: 'case-exportadora-sal-harvester',
    slug: 'cosechadora-exportadora-sal',
    title: 'Automatización de cosechadora de sal',
    summary: 'Automatización e instrumentación de cosechadora de sal para operación en salina',
    industry: 'Procesos',
    location: 'Baja California',
    year: '2020',
    status: 'Terminado en marzo de 2020, con 3 máquinas en total',
    services: ['Automatización', 'Instrumentación', 'HMI'],
    brands: ['Siemens'],
    solutionIds: ['solution-system-integration', 'solution-plc-scada'],
    productIds: ['product-plc', 'product-hmi'],
    image: cosechadoraCoverImage,
    imageAlt: 'Cosechadora de sal automatizada por Tecno All',
    homeScope: 'Automatización, instrumentación y HMI en 3 máquinas.',
    stages: [
      {
        id: 'stage-harvester',
        label: 'Equipo',
        title: 'Cosechadora en operación salina',
        summary:
          'Sistema de automatización e instrumentación integrado a la cosechadora de sal en campo',
        deliverables: ['Automatización de cosechadora', 'Instrumentación de proceso'],
        tags: ['Automatización', 'Campo'],
        image: cosechadoraCoverImage,
        imageAlt: 'Cosechadora de sal en operación con sistema automatizado',
      },
      {
        id: 'stage-hmi-operation',
        label: 'HMI',
        title: 'Operación desde interfaz HMI',
        summary:
          'Interfaz gráfica para supervisar y operar la cosechadora desde el equipo en sitio',
        deliverables: ['Pantalla HMI de operación', 'Visualización de variables de proceso'],
        tags: ['HMI', 'Operación'],
        image: cosechadoraHmiImage,
        imageAlt: 'Interfaz HMI de operación de la cosechadora de sal',
      },
    ],
  },
  {
    id: 'case-cespt-acueducto',
    slug: 'acueducto-cespt-tijuana',
    title: 'Telemetría del acueducto Tijuana-Ensenada',
    summary:
      'Sistema de control vía telemetría, aplicación web y aplicación móvil para el acueducto Tijuana-Ensenada',
    industry: 'Procesos',
    location: 'Tijuana, B.C.',
    year: '2020',
    status: 'Entregado en diciembre de 2020',
    services: ['Telemetría', 'Visualización web', 'Aplicación móvil'],
    brands: ['Siemens'],
    solutionIds: ['solution-cloud-web', 'solution-plc-scada'],
    productIds: ['product-hmi', 'product-automation'],
    image: acueductoCoverImage,
    imageAlt: 'Estación de bombeo del acueducto Tijuana-Ensenada con telemetría',
    externalUrl: 'https://portal-cespt.web.app/',
    homeScope:
      'Telemetría con aplicación web y aplicación móvil para el acueducto Tijuana-Ensenada.',
    stages: [
      {
        id: 'stage-pumping-station',
        label: 'Infraestructura',
        title: 'Estación de bombeo del acueducto',
        summary:
          'Infraestructura de bombeo integrada al sistema de telemetría para supervisión remota del acueducto',
        deliverables: ['Telemetría de estaciones', 'Integración al sistema de control'],
        tags: ['Telemetría', 'Bombeo'],
        image: acueductoCoverImage,
        imageAlt: 'Estación de bombeo del acueducto Tijuana-Ensenada',
      },
      {
        id: 'stage-mobile-app',
        label: 'App móvil',
        title: 'Supervisión desde aplicación móvil',
        summary:
          'Aplicación móvil para consultar variables y estado del acueducto fuera de la estación de control',
        deliverables: ['Aplicación móvil de supervisión', 'Acceso remoto a variables de planta'],
        tags: ['App móvil', 'Telemetría'],
        image: acueductoAppImage,
        imageAlt: 'Aplicación móvil de supervisión del acueducto Tijuana-Ensenada',
      },
    ],
  },
  {
    id: 'case-cespt-pbar4',
    slug: 'tableros-pbar4-mexicali',
    title: 'Tableros de control para PBAR4',
    summary:
      'Diseño, especificación y suministro de tableros y gabinetes de control y automatización para PBAR4 en Mexicali',
    industry: 'Procesos',
    location: 'Mexicali, B.C.',
    year: '2023',
    services: ['Diseño de tableros', 'Fabricación', 'Automatización'],
    brands: ['Siemens', 'Rittal'],
    solutionIds: ['solution-panels', 'solution-system-integration'],
    productIds: ['product-enclosures', 'product-plc', 'product-engineering'],
    image: bombeoTableroImage,
    imageAlt: 'Tablero de control fabricado para PBAR4 en Mexicali',
    homeScope: 'Tableros CCM, arrancadores suaves y cajas de automatización para PBAR4.',
    stages: [
      {
        id: 'stage-fabricated-panel',
        label: 'Fabricación',
        title: 'Tablero fabricado en taller',
        summary:
          'Gabinete de control fabricado e integrado en taller propio para la infraestructura de bombeo PBAR4',
        deliverables: [
          'Tablero fabricado bajo norma NEMA',
          'Centro de control de motores y carga auxiliar',
        ],
        tags: ['Fabricación', 'Tableros'],
        image: bombeoTableroImage,
        imageAlt: 'Tablero de control fabricado para PBAR4',
      },
      {
        id: 'stage-render-interior',
        label: 'Ingeniería',
        title: 'Render de ingeniería: interior del tablero',
        summary:
          'Visualización de ingeniería del interior del tablero antes de fabricación e integración en sitio',
        deliverables: ['Diseño eléctrico', 'Distribución interior de componentes'],
        tags: ['Render', 'Ingeniería'],
        image: bombeoRenderInteriorImage,
        imageAlt: 'Render de ingeniería del interior del tablero PBAR4',
      },
      {
        id: 'stage-render-front',
        label: 'Ingeniería',
        title: 'Render de ingeniería: vista frontal',
        summary:
          'Visualización de ingeniería de la vista frontal del gabinete de control para PBAR4',
        deliverables: [
          'Especificación de gabinete',
          'Distribución de control en frente de tablero',
        ],
        tags: ['Render', 'Ingeniería'],
        image: bombeoRenderFrontImage,
        imageAlt: 'Render de ingeniería de la vista frontal del tablero PBAR4',
      },
      {
        id: 'stage-site-context',
        label: 'Contexto',
        title: 'Infraestructura de bombeo PBAR4',
        summary:
          'Proyecto de tableros y automatización para plantas de tratamiento y bombeo en Baja California',
        deliverables: ['Cajas SoftStart 4×400 HP', 'CCM carga auxiliar', 'Cajas de automatización'],
        tags: ['Bombeo', 'Infraestructura'],
        image: bombeoCoverImage,
        imageAlt: 'Infraestructura de bombeo asociada al proyecto PBAR4',
      },
    ],
  },
];

export const usingSampleCases = approvedCaseStudies.length === 0;
export const caseStudies: readonly CaseStudy[] = approvedCaseStudies;

export function getCaseBySlug(slug: string): CaseStudy | undefined {
  return approvedCaseStudies.find((caseStudy) => caseStudy.slug === slug);
}

export function getCaseCover(slug: string): CaseImage {
  const caseStudy = getCaseBySlug(slug);
  if (!caseStudy) {
    throw new Error(`Caso no encontrado: ${slug}`);
  }
  return caseStudy.image;
}

export function getCaseStageImage(slug: string, stageId: string): CaseImage {
  const caseStudy = getCaseBySlug(slug);
  const stage = caseStudy?.stages.find((entry) => entry.id === stageId);
  if (!stage) {
    throw new Error(`Evidencia no encontrada: ${slug}/${stageId}`);
  }
  return stage.image;
}
