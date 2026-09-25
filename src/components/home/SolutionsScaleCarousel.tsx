import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';
import { gsap } from 'gsap';

gsap.registerPlugin(useGSAP);

export interface SolutionSlide {
  id: string;
  index: string;
  title: string;
  shortTitle: string;
  body: string;
  href?: string;
  image: {
    src: string;
    srcSet: string;
    sizes: string;
    width: number;
    height: number;
    alt: string;
  };
}

interface Props {
  slides: SolutionSlide[];
  label?: string;
  variant?: 'scene' | 'product';
}

const NEIGHBOR_SCALE = 0.58;
const SCALE_FALLOFF = 0.8;

function scaleAt(distance: number) {
  const d = Math.abs(distance);
  if (d <= 1) return 1 + (NEIGHBOR_SCALE - 1) * d;
  return NEIGHBOR_SCALE * SCALE_FALLOFF ** (d - 1);
}

function opacityAt(distance: number) {
  const d = Math.abs(distance);
  if (d <= 1) return 1 - d * 0.08;
  return Math.max(0.42, 0.92 * 0.72 ** (d - 1));
}

function restingOffset(steps: number, cardWidth: number, gap: number) {
  if (steps <= 0) return 0;
  let sum = cardWidth / 2 + steps * gap + (cardWidth * scaleAt(steps)) / 2;
  for (let step = 1; step < steps; step += 1) sum += cardWidth * scaleAt(step);
  return sum;
}

function centerOffset(distance: number, cardWidth: number, gap: number) {
  const d = Math.abs(distance);
  const steps = Math.floor(d);
  const fraction = d - steps;
  const start = restingOffset(steps, cardWidth, gap);
  const end = restingOffset(steps + 1, cardWidth, gap);
  return start + (end - start) * fraction;
}

export default function SolutionsScaleCarousel({
  slides,
  label = 'Soluciones de ingeniería de Tecno All',
  variant = 'scene',
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const seenSelection = useRef(false);
  const isVisibleRef = useRef(false);
  const isPausedRef = useRef(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: 4000,
        playOnInit: false,
        stopOnInteraction: false,
        stopOnMouseEnter: false,
        stopOnFocusIn: false,
      }),
    [],
  );
  const wheelGestures = useMemo(
    () => WheelGesturesPlugin({ forceWheelAxis: 'x', wheelDraggingClass: 'is-wheel-dragging' }),
    [],
  );
  const [viewportRef, emblaApi] = useEmblaCarousel(
    {
      align: 'center',
      containScroll: false,
      dragFree: false,
      duration: 46,
      loop: true,
      skipSnaps: false,
    },
    [autoplay, wheelGestures],
  );

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(media.matches);
    updatePreference();
    media.addEventListener('change', updatePreference);
    return () => media.removeEventListener('change', updatePreference);
  }, []);

  const syncAutoplay = useCallback(() => {
    if (!emblaApi) return;
    const controller = emblaApi.plugins().autoplay;
    if (!controller) return;
    if (reducedMotion || !isVisibleRef.current || isPausedRef.current) controller.stop();
    else controller.play();
  }, [emblaApi, reducedMotion]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit({ duration: reducedMotion ? 0 : 46 });
    syncAutoplay();
  }, [emblaApi, reducedMotion, syncAutoplay]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !emblaApi) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = Boolean(entry?.isIntersecting);
        syncAutoplay();
      },
      { threshold: 0.4 },
    );
    observer.observe(root);

    const pause = () => {
      isPausedRef.current = true;
      syncAutoplay();
    };
    const resume = () => {
      isPausedRef.current = false;
      syncAutoplay();
    };
    const resumeAfterFocus = (event: FocusEvent) => {
      if (event.relatedTarget instanceof Node && root.contains(event.relatedTarget)) return;
      resume();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        emblaApi.scrollNext();
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        emblaApi.scrollPrev();
      }
    };

    root.addEventListener('pointerenter', pause);
    root.addEventListener('pointerleave', resume);
    root.addEventListener('focusin', pause);
    root.addEventListener('focusout', resumeAfterFocus);
    root.addEventListener('keydown', onKeyDown);

    return () => {
      observer.disconnect();
      root.removeEventListener('pointerenter', pause);
      root.removeEventListener('pointerleave', resume);
      root.removeEventListener('focusin', pause);
      root.removeEventListener('focusout', resumeAfterFocus);
      root.removeEventListener('keydown', onKeyDown);
      emblaApi.plugins().autoplay?.stop();
    };
  }, [emblaApi, syncAutoplay]);

  useGSAP(
    () => {
      if (!emblaApi) return;

      const tweenSlides = () => {
        const engine = emblaApi.internalEngine();
        const scrollProgress = emblaApi.scrollProgress();
        const snapCount = emblaApi.scrollSnapList().length;
        const slideNodes = emblaApi.slideNodes();
        const cardWidth = slideNodes[0]?.offsetWidth ?? 0;
        if (!cardWidth || !snapCount) return;
        const gap = Math.max(14, cardWidth * 0.045);

        emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
          let diffToTarget = scrollSnap - scrollProgress;
          const slidesInSnap = engine.slideRegistry[snapIndex] ?? [];

          slidesInSnap.forEach((slideIndex) => {
            if (engine.options.loop) {
              engine.slideLooper.loopPoints.forEach((loopItem) => {
                const target = loopItem.target();
                if (slideIndex === loopItem.index && target !== 0) {
                  const sign = Math.sign(target);
                  if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress);
                  if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress);
                }
              });
            }

            const slidesFromCenter = diffToTarget * snapCount;
            const distance = Math.abs(slidesFromCenter);
            const slide = slideNodes[slideIndex];
            const card = slide?.querySelector<HTMLElement>('.solutions-scale__card');
            if (!slide || !card) return;

            const offset = centerOffset(distance, cardWidth, gap);
            slide.style.zIndex = String(Math.round(30 - distance * 6));
            gsap.set(card, {
              x: Math.sign(slidesFromCenter) * offset - slidesFromCenter * cardWidth,
              scale: scaleAt(distance),
              opacity: opacityAt(distance),
              transformOrigin: 'center center',
              force3D: true,
            });
          });
        });
      };

      const selectSlide = () => setSelectedIndex(emblaApi.selectedScrollSnap());

      tweenSlides();
      selectSlide();
      emblaApi.on('reInit', tweenSlides).on('scroll', tweenSlides).on('select', selectSlide);

      return () => {
        emblaApi.off('reInit', tweenSlides).off('scroll', tweenSlides).off('select', selectSlide);
      };
    },
    { dependencies: [emblaApi], revertOnUpdate: true, scope: rootRef },
  );

  useEffect(() => {
    const copy = copyRef.current;
    if (!copy || reducedMotion) return;
    if (!seenSelection.current) {
      seenSelection.current = true;
      return;
    }

    const tween = gsap.fromTo(
      copy.querySelectorAll('[data-caption]'),
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.42, stagger: 0.045, ease: 'power2.out', overwrite: 'auto' },
    );
    return () => {
      tween.kill();
    };
  }, [reducedMotion, selectedIndex]);

  const selectedSlide = slides[selectedIndex] ?? slides[0];
  if (!selectedSlide) return null;

  return (
    <div
      ref={rootRef}
      className={`solutions-scale${variant === 'product' ? ' solutions-scale--product' : ''}`}
      aria-roledescription="carrusel"
      aria-label={label}
    >
      <div className="solutions-scale__viewport" ref={viewportRef} tabIndex={0}>
        <div className="solutions-scale__track">
          {slides.map((slide, index) => (
            <div
              className="solutions-scale__slide"
              key={slide.id}
              aria-current={index === selectedIndex ? 'true' : undefined}
            >
              <div className="solutions-scale__card">
                <img
                  src={slide.image.src}
                  srcSet={slide.image.srcSet}
                  sizes={slide.image.sizes}
                  width={slide.image.width}
                  height={slide.image.height}
                  alt={slide.image.alt}
                  draggable={false}
                  loading={
                    index === 0 || index === 1 || index === slides.length - 1 ? 'eager' : 'lazy'
                  }
                  decoding="async"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="solutions-scale__copy" ref={copyRef} aria-live="polite">
        <p className="solutions-scale__kicker" data-caption>
          <span>{selectedSlide.index}</span>
          <span className="visually-hidden">
            {selectedIndex + 1} de {slides.length}.{' '}
          </span>
          {selectedSlide.shortTitle}
        </p>
        <h3 data-caption>
          {selectedSlide.href ? (
            <a href={selectedSlide.href}>{selectedSlide.title}</a>
          ) : (
            selectedSlide.title
          )}
        </h3>
        <p data-caption>{selectedSlide.body}</p>
      </div>
    </div>
  );
}
