import { PUBLIC_STORE_URL } from 'astro:env/client';
import { homeContent } from '@/content/home';
import { solutionSlugs } from '@/content/routes';

export interface NavLink {
  label: string;
  href: string;
  detail?: string;
}

export interface NavColumn {
  label: string;
  href: string;
  links: NavLink[];
}

export interface NavItem {
  label: string;
  href: string;
  links?: NavLink[];
  columns?: NavColumn[];
}

/** URL de la tienda en línea. Si no está configurada, el sitio no muestra el enlace. */
export const storeUrl = PUBLIC_STORE_URL || undefined;

const productBrands = ['Siemens', 'WAGO', 'Rittal'] as const;
// Cada familia apunta a su propia tarjeta del catálogo, no solo al filtro de marca.
const catalogHref = (brand: string, productId?: string) =>
  `/productos/?marca=${encodeURIComponent(brand)}${productId ? `#${productId}` : ''}`;

export const primaryNavigation: NavItem[] = [
  {
    label: 'Soluciones',
    href: '/soluciones/',
    links: homeContent.solutions.map((service) => ({
      label: service.title,
      detail: service.body,
      href: `/soluciones/${solutionSlugs[service.id]}/`,
    })),
  },
  { label: 'Casos', href: '/casos-de-exito/' },
  { label: 'Marcas', href: '/marcas/' },
  {
    label: 'Productos',
    href: '/productos/',
    columns: productBrands.map((brand) => ({
      label: brand,
      href: catalogHref(brand),
      links: homeContent.products
        .filter((product) => product.brand === brand)
        .map((product) => ({
          label: product.title,
          detail: product.body,
          href: catalogHref(brand, product.id),
        })),
    })),
  },
  { label: 'Sobre nosotros', href: '/empresa/' },
];
