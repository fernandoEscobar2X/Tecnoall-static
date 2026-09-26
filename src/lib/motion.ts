import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/** Mismos valores que los tokens --ease-out y --dur-* de global.css, para GSAP. */
export const EASE_OUT = 'expo.out';
export const DUR = { feedback: 0.12, state: 0.24, enter: 0.48, authored: 0.8 } as const;

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenis: Lenis | null = null;

/**
 * Scroll suavizado con Lenis sobre el reloj de GSAP, para que ScrollTrigger lea la misma
 * posición en cada frame. Con "reducir movimiento" el scroll queda nativo.
 */
export function startSmoothScroll() {
  if (lenis || prefersReducedMotion()) return;
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: { offset: -76 } });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  // Un diálogo puede abrirse antes de que termine la carga diferida del motor.
  if (document.querySelector('dialog[open]')) lenis.stop();

  // Diálogos y menús piden bloquear el scroll del documento con este evento.
  document.addEventListener('scroll-lock', (event) => {
    if ((event as CustomEvent<boolean>).detail) lenis?.stop();
    else lenis?.start();
  });
}

export { lockScroll } from './scroll-lock';

/**
 * Coreografía de entrada para el marcado de Astro:
 * - data-reveal="lines": el titular sube línea por línea desde una máscara.
 * - data-reveal="fade": el texto de apoyo llega un poco después.
 * - data-reveal="media": la foto se descubre de abajo hacia arriba y se asienta.
 * Con "reducir movimiento" todo queda en su lugar desde el inicio.
 */
export async function initReveals(root: ParentNode = document) {
  if (prefersReducedMotion()) return;
  const { SplitText } = await import('gsap/SplitText');
  gsap.registerPlugin(SplitText);

  root.querySelectorAll<HTMLElement>('[data-reveal="lines"]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      onSplit: (split) => {
        const productHeading = el.matches('.section-heading--products h2');
        if (productHeading) {
          // Amplía la máscara para g, p, q y otras descendentes sin mover las líneas.
          split.masks.forEach((mask) => {
            const style = (mask as HTMLElement).style;
            style.paddingBottom = '0.18em';
            style.marginBottom = '-0.18em';
          });
        }
        return gsap.from(split.lines, {
          yPercent: productHeading ? 125 : 105,
          duration: 0.9,
          ease: EASE_OUT,
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      },
    });
  });

  root.querySelectorAll<HTMLElement>('[data-reveal="fade"]').forEach((el) => {
    gsap.from(el, {
      y: 24,
      opacity: 0,
      duration: DUR.authored,
      ease: EASE_OUT,
      delay: 0.15,
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });

  root.querySelectorAll<HTMLElement>('[data-reveal="media"]').forEach((el) => {
    const img = el.querySelector('img');
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
    tl.from(el, { clipPath: 'inset(18% 0% 0% 0%)', duration: 1.1, ease: EASE_OUT });
    if (img) tl.from(img, { scale: 1.12, duration: 1.4, ease: EASE_OUT }, 0);
  });
}
