import cabinetImage from '@assets/tecnoall/sesion/tablero-plc-alambrado.webp';
import { getCaseCover, getCaseStageImage } from './cases';
// Assets exactos de la demo aprobada.
const heroProject = getCaseCover('linea-lentes-carl-zeiss');
// Soluciones ilustradas solo con evidencia real de proyectos (sin fotos de stock).
const serviceImage = getCaseStageImage('planta-desalinizadora', 'stage-control-panels');
const controlImage = getCaseStageImage('planta-desalinizadora', 'stage-automation');
const heroImage = getCaseCover('acueducto-cespt-tijuana');
const aboutImage = getCaseStageImage('linea-lentes-carl-zeiss', 'stage-machinery');
import carloControlsImage from '@assets/tecnoall/productos-controles-carlos-gavazzi.jpg';
import carloSensorsImage from '@assets/tecnoall/productos-sensores-carlo-gavazzi.jpg';
import eplanImage from '@assets/tecnoall/productos-ingenieria-tablero-control-automatizacion-eplan.jpg';
import rittalCabinetImage from '@assets/tecnoall/productos-armarios-distribucion-rittal.jpg';
import rittalClimateImage from '@assets/tecnoall/productos-climatizacion-rittal.jpg';
import siemensHmiImage from '@assets/tecnoall/productos-siemens-hmis.jpg';
import siemensMotorsImage from '@assets/tecnoall/productos-siemens-motores.jpg';
import siemensPlcImage from '@assets/tecnoall/productos-siemens-plc.jpg';
import siemensDriveImage from '@assets/tecnoall/productos-siemens-variadores.jpg';
import wagoAutomationImage from '@assets/tecnoall/productos-tecnologia-automatizacion-wago-wago.jpg';
import wagoConnectionImage from '@assets/tecnoall/productos-tecnologia-conexion-wago.jpg';

import bannerLogo from '@assets/tecnoall/logos-transparent/logo-banner.png';
import carloLogo from '@assets/tecnoall/logos-transparent/logo-carlo.png';
import datalogicLogo from '@assets/tecnoall/logos-transparent/logo-dataloginc.png';
import enocableLogo from '@assets/tecnoall/logos-transparent/logo-enocable.png';
import eplanLogo from '@assets/tecnoall/logos-transparent/logo-eplan2.png';
import festoLogo from '@assets/tecnoall/logos-transparent/logo-festo.png';
import meltricLogo from '@assets/tecnoall/logos-transparent/logo-meltric.png';
import mitsubishiLogo from '@assets/tecnoall/logos-transparent/logo-mitsubishi.png';
import nexansLogo from '@assets/tecnoall/logos-transparent/logo-nexans.png';
import rittalLogo from '@assets/tecnoall/logos-transparent/logo-rittal.png';
import siemensLogo from '@assets/tecnoall/logos-transparent/logo-siemens.png';
import smcLogo from '@assets/tecnoall/logos-transparent/smc-logo.png';
import wagoLogo from '@assets/tecnoall/logos-transparent/logo-wago.png';
import wegLogo from '@assets/tecnoall/logos-transparent/logo-weg.png';
import brandLogo from '@assets/tecnoall/logo-2.webp';
// Variante para fondos claros: mismo logotipo, texto en tinta.
import brandLogoDark from '@assets/tecnoall/logo-2-dark.webp';
// Wordmark blanco recortado: header mobile sobre foto / fondo oscuro.
import brandLogoOnDark from '@assets/tecnoall/logo-on-dark.png';
import brandSymbol from '@assets/tecnoall/imagotipo.webp';

export const homeContent = {
  company: {
    name: 'Tecno All',
    legalName: 'Tecno All de México S.A. de C.V.',
    description:
      'Empresa mexicana de automatización y control. Ingeniería, tableros y suministro para plantas de proceso y manufactura en Baja California.',
    logo: brandLogo,
    logoDark: brandLogoDark,
    logoOnDark: brandLogoOnDark,
    symbol: brandSymbol,
    brochureUrl: '/brochure-tecnoall.pdf',
  },
  hero: {
    title: 'Diseñamos e integramos el control de su planta',
    lead: 'Ingeniería, tableros y suministro para plantas de proceso y manufactura, desde Tijuana y Mexicali.',
    /** Foto del hero: evidencia real de proyecto. El video de la sesión la sustituirá. */
    art: heroProject,
    artAlt: 'Proyecto de automatización desarrollado por Tecno All',
  },
  solutionsIntro: {
    eyebrow: 'QUÉ HACEMOS',
    title: 'Del tablero a la visualización remota',
    body: 'Diseñamos el tablero, programamos el PLC y dejamos el proceso visible: en planta o en remoto.',
  },
  solutions: [
    {
      id: 'solution-system-integration',
      index: '01',
      title: 'Integración de sistemas industriales',
      shortTitle: 'Integración',
      body: 'Conectamos maquinaria, sensores y controladores en un sistema que la planta puede operar.',
      image: serviceImage,
      imageAlt: 'Paneles de control integrados por Tecno All en una planta desalinizadora',
      tags: ['Ingeniería', 'Integración', 'Manufactura'],
    },
    {
      id: 'solution-panels',
      index: '02',
      title: 'Diseño y fabricación de tableros',
      shortTitle: 'Tableros',
      body: 'Diseño, integración y fabricación del tablero de control en taller propio, listo para sitio.',
      image: cabinetImage,
      imageAlt: 'Tablero de control con PLC Siemens S7-1500 alambrado en el taller de Tecno All',
      tags: ['Diseño', 'Fabricación', 'Control'],
    },
    {
      id: 'solution-plc-scada',
      index: '03',
      title: 'PLC, SCADA y mantenimiento',
      shortTitle: 'PLC / SCADA',
      body: 'Actualizamos, convertimos o reparamos PLC y SCADA para ver el proceso en tiempo real.',
      image: controlImage,
      imageAlt: 'Interfaz HMI del proceso de desalinización integrada por Tecno All',
      tags: ['PLC', 'SCADA', 'Servicio'],
    },
    {
      id: 'solution-cloud-web',
      index: '04',
      title: 'Control, telemetría y visualización web',
      shortTitle: 'Cloud / Web',
      body: 'Telemetría y pantallas web para supervisar el proceso fuera de planta.',
      image: heroImage,
      imageAlt: 'Estación de bombeo del acueducto Tijuana-Ensenada supervisada por telemetría',
      tags: ['Telemetría', 'Web', 'Datos'],
    },
    {
      id: 'solution-industry4',
      index: '05',
      title: 'Software para Industria 4.0',
      shortTitle: 'Industria 4.0',
      body: 'Software para digitalizar y conectar planta, producción y datos de proceso.',
      image: aboutImage,
      imageAlt: 'Maquinaria de la línea de lentes integrada por Tecno All',
      tags: ['Software', 'Procesos', 'Datos'],
    },
  ],
  brandsIntro: {
    eyebrow: 'MARCAS',
    title: 'Fabricantes que integramos en su proyecto',
    body: 'Suministramos e integramos el equipo: canal autorizado cuando aplica, y otras marcas cuando el proceso o la planta lo piden.',
  },
  brands: {
    authorized: [
      { name: 'Siemens', logo: siemensLogo, url: 'https://www.siemens.com/mx/es.html' },
      { name: 'WAGO', logo: wagoLogo, url: 'https://www.wago.com/mx-es/' },
      { name: 'Rittal', logo: rittalLogo, url: 'https://www.rittal.com/mx-es/' },
      { name: 'Carlo Gavazzi', logo: carloLogo, url: 'https://www.gavazzionline.com/CGNA/' },
      { name: 'EPLAN', logo: eplanLogo, url: 'https://www.eplan.com.mx/' },
      {
        name: 'Datalogic',
        logo: datalogicLogo,
        url: 'https://www.a3mexico.com.mx/companies/datalogic-mexico',
      },
      { name: 'Meltric', logo: meltricLogo, url: 'https://meltric.com.mx/' },
    ],
    additional: [
      { name: 'Enokable', logo: enocableLogo, url: 'https://enokable.com.mx/' },
      { name: 'WEG', logo: wegLogo, url: 'https://www.weg.net/institutional/MX/es/' },
      { name: 'Festo', logo: festoLogo, url: 'https://www.festo.com/mx/es/' },
      { name: 'Nexans', logo: nexansLogo, url: 'https://www.nexans.com/' },
      { name: 'SMC', logo: smcLogo, url: 'https://smc.com.mx/' },
      {
        name: 'Banner',
        logo: bannerLogo,
        url: 'https://www.bannerengineering.com/mx/es.html',
      },
      {
        name: 'Mitsubishi Electric',
        logo: mitsubishiLogo,
        url: 'https://mx.mitsubishielectric.com/fa/es/',
      },
    ],
  },
  productsIntro: {
    eyebrow: 'HARDWARE + SOFTWARE',
    title: 'Familias de producto para construir el sistema completo',
    body: 'PLC, HMI, variadores, conexión, gabinetes y sensores para armar o reponer el sistema.',
  },
  products: [
    {
      id: 'product-plc',
      index: 'P.01',
      title: 'Controladores PLC',
      brand: 'Siemens',
      body: 'PLC S7-1200 y S7-1500 para automatización y control.',
      image: siemensPlcImage,
      imageAlt: 'Controladores PLC Siemens mostrados en el catálogo Tecno All',
    },
    {
      id: 'product-drives',
      index: 'P.02',
      title: 'Variadores',
      brand: 'Siemens',
      body: 'Familias SINAMICS y MICROMASTER para control de movimiento.',
      image: siemensDriveImage,
      imageAlt: 'Variadores Siemens mostrados en el catálogo Tecno All',
    },
    {
      id: 'product-hmi',
      index: 'P.03',
      title: 'HMI y paneles',
      brand: 'Siemens',
      body: 'Paneles de operación básicos, comfort, móviles y de teclas.',
      image: siemensHmiImage,
      imageAlt: 'Paneles HMI Siemens mostrados en el catálogo Tecno All',
    },
    {
      id: 'product-motors',
      index: 'P.04',
      title: 'Motores',
      brand: 'Siemens',
      body: 'Motores trifásicos y monofásicos para aplicaciones industriales.',
      image: siemensMotorsImage,
      imageAlt: 'Motores industriales Siemens mostrados en el catálogo Tecno All',
    },
    {
      id: 'product-connectivity',
      index: 'P.05',
      title: 'Tecnología de conexión',
      brand: 'WAGO',
      body: 'Bornas, conectores, componentes pasamuros y cableado de campo.',
      image: wagoConnectionImage,
      imageAlt: 'Tecnología de conexión WAGO mostrada en el catálogo Tecno All',
    },
    {
      id: 'product-automation',
      index: 'P.06',
      title: 'Automatización y E/S',
      brand: 'WAGO',
      body: 'Sistemas de E/S, controladores, paneles táctiles y switches industriales.',
      image: wagoAutomationImage,
      imageAlt: 'Sistemas de automatización WAGO mostrados en el catálogo Tecno All',
    },
    {
      id: 'product-enclosures',
      index: 'P.07',
      title: 'Gabinetes y climatización',
      brand: 'Rittal',
      body: 'Armarios, cajas, distribución de corriente y climatización para tableros.',
      image: rittalCabinetImage,
      supportingImage: rittalClimateImage,
      imageAlt: 'Gabinetes industriales Rittal mostrados en el catálogo Tecno All',
    },
    {
      id: 'product-sensors',
      index: 'P.08',
      title: 'Sensores y controles',
      brand: 'Carlo Gavazzi',
      body: 'Sensores de proximidad, relés, contactores, monitoreo y medición de energía.',
      image: carloSensorsImage,
      supportingImage: carloControlsImage,
      imageAlt: 'Sensores Carlo Gavazzi mostrados en el catálogo Tecno All',
    },
    {
      id: 'product-engineering',
      index: 'P.09',
      title: 'Ingeniería de tableros',
      brand: 'EPLAN',
      body: 'Software de ingeniería para tableros y automatización bajo normas NEMA o IEC.',
      image: eplanImage,
      imageAlt: 'Software EPLAN aplicado a ingeniería de tableros',
    },
  ],
  industries: [
    {
      id: 'industry-process',
      title: 'Procesos',
      body: 'Control, telemetría y SCADA para procesos que no pueden operar a ciegas.',
      applications: ['Control eléctrico', 'Telemetría', 'SCADA', 'Mantenimiento'],
    },
    {
      id: 'industry-manufacturing',
      title: 'Manufactura',
      body: 'Tableros, PLC y visualización para líneas de manufactura.',
      applications: ['PLC', 'HMI', 'Tableros', 'Industria 4.0'],
    },
  ],
  industryImage: aboutImage,
  industryImageAlt: 'Instalación industrial mostrada por Tecno All',
  trust: {
    eyebrow: 'BAJA CALIFORNIA',
    title: 'Ingeniería y taller en Baja California',
    statements: [
      'Empresa mexicana de automatización y control, con taller en Tijuana y sucursal en Mexicali.',
      'Proyectos llave en mano: ingeniería, suministro y arranque en sitio.',
      'Rittal lista a Tecno All entre sus distribuidores autorizados en Baja California.',
    ],
    locations: [
      {
        city: 'Tijuana',
        role: 'Sucursal matriz',
        streetAddress: 'Calle Cinco Sur #140, Col. Ciudad Industrial',
        region: 'Baja California',
        postalCode: '22444',
        country: 'MX',
        latitude: 32.5345016,
        longitude: -116.918665,
        address:
          'Calle Cinco Sur #140, Col. Ciudad Industrial, Tijuana, Baja California, C.P. 22444.',
        phone: '(664) 682-1244',
        phoneHref: 'tel:+526646821244',
      },
      {
        city: 'Mexicali',
        role: 'Sucursal',
        streetAddress: 'Calz. Héctor Terán Terán L12, F5, Union Park Local 2, Col. Bordo Wisteria',
        region: 'Baja California',
        postalCode: '21147',
        country: 'MX',
        latitude: 32.6130717,
        longitude: -115.5124053,
        address:
          'Calz. Héctor Terán Terán L12, F5, Union Park Local 2, Col. Bordo Wisteria, Mexicali, B.C., C.P. 21147.',
        phone: '(686) 107-6383',
        phoneHref: 'tel:+526861076383',
      },
    ],
  },
  finalCta: {
    eyebrow: 'INICIAR PROYECTO',
    title: 'Cuéntenos qué necesita automatizar',
    body: 'Describa el proceso o el material. Le respondemos con una propuesta y el siguiente paso.',
    primary: { label: 'Hablar con ingeniería', href: '/empresa/#escribanos' },
    secondary: { label: 'Ver catálogo', href: '/productos/' },
  },
  contact: {
    email: 'ventas@tecnoall.com',
    emailHref: 'mailto:ventas@tecnoall.com',
    phone: '(664) 682-1244',
    phoneHref: 'tel:+526646821244',
    whatsapp: '(664) 370-8067',
    whatsappHref: 'https://wa.me/526643708067',
  },
  social: [
    { name: 'Facebook', href: 'https://www.facebook.com/tecnoallmx' },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/company/tecno-all/' },
  ],
  maps: {
    tijuana:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3363.6871504735172!2d-116.91866498450705!3d32.53450160361791!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80d94769bddae6d5%3A0x3cfc8ab3d45a029f!2sC.%205%20Sur%20140%2C%20Cd%20Industrial%2C%2022444%20Tijuana%2C%20B.C.!5e0!3m2!1ses-419!2smx!4v1642140103536!5m2!1ses-419!2smx',
    mexicali:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3360.741501622237!2d-115.51240532806045!3d32.613071707491855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x1f6aa15422d834b4!2zMzLCsDM2JzQ3LjAiTiAxMTXCsDMwJzM4LjAiVw!5e0!3m2!1ses!2smx!4v1642232787318!5m2!1ses!2smx',
  },
} as const;

export type HomeContent = typeof homeContent;
