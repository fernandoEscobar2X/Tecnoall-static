import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';

export interface ResponsiveMediaSource {
  src: string;
  srcSet: string;
  sizes: string;
  width: number;
  height: number;
  alt: string;
}

interface ResponsiveMediaOptions {
  src: ImageMetadata;
  widths: readonly number[];
  sizes: string;
  alt: string;
  quality?: number;
}

export const deferredImagePlaceholder =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%221%22 height=%221%22/%3E';

export async function createResponsiveMedia({
  src,
  widths,
  sizes,
  alt,
  quality = 90,
}: ResponsiveMediaOptions): Promise<ResponsiveMediaSource> {
  const candidates = [...new Set(widths)]
    .filter((width) => width > 0 && width <= src.width)
    .sort((left, right) => left - right);

  if (candidates.length === 0) candidates.push(src.width);
  if (candidates.at(-1) !== src.width && src.width < Math.max(...widths)) {
    candidates.push(src.width);
  }

  const variants = await Promise.all(
    candidates.map((width) => getImage({ src, width, format: 'webp', quality })),
  );
  const fallback = variants.at(-1);

  if (!fallback) throw new Error(`No se pudo preparar el recurso responsive: ${alt}`);

  return {
    src: fallback.src,
    srcSet: variants.map((variant, index) => `${variant.src} ${candidates[index]}w`).join(', '),
    sizes,
    width: src.width,
    height: src.height,
    alt,
  };
}
