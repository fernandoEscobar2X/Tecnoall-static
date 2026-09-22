import mail from 'iconoir/icons/mail.svg';
import menuScale from 'iconoir/icons/menu-scale.svg';
import openNewWindow from 'iconoir/icons/open-new-window.svg';
import phone from 'iconoir/icons/phone.svg';
import xmark from 'iconoir/icons/xmark.svg';

type BundledAsset = string | { src: string };

// Astro representa los SVG importados como ImageMetadata; los componentes
// reciben únicamente la URL estable del recurso.
const assetUrl = (asset: BundledAsset): string => (typeof asset === 'string' ? asset : asset.src);

export const uiIconUrls = {
  mail: assetUrl(mail),
  menuScale: assetUrl(menuScale),
  openNewWindow: assetUrl(openNewWindow),
  phone: assetUrl(phone),
  xmark: assetUrl(xmark),
} as const;

export type UiIconName = keyof typeof uiIconUrls;
