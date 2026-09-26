import { ArrowRightIcon } from '@phosphor-icons/react';
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { useEffect, useRef } from 'react';

interface Props {
  imageSrc: string;
  imageSrcSet: string;
  imageSizes: string;
  imageWidth: number;
  imageHeight: number;
  imageAlt: string;
  voice: string;
  title: string;
  body: string;
  statValue: number;
  statUnit: string;
  statLabel: string;
  href: string;
}

/** Caso destacado: la foto del proyecto a sangre y la cifra real que sube al entrar en pantalla. */
export default function HomeCase({
  imageSrc,
  imageSrcSet,
  imageSizes,
  imageWidth,
  imageHeight,
  imageAlt,
  voice,
  title,
  body,
  statValue,
  statUnit,
  statLabel,
  href,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const statRef = useRef<HTMLParagraphElement>(null);
  const inView = useInView(statRef, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const count = useMotionValue(reduce ? statValue : 0);
  const rounded = useTransform(count, (value) => Math.round(value).toString());
  // Profundidad: la foto se acerca despacio mientras la sección cruza la pantalla.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.14, 1]);
  const imageY = useTransform(scrollYProgress, [0, 1], ['-4%', '4%']);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(count, statValue, { duration: 1.6, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [count, inView, reduce, statValue]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="home-case-title"
      className="relative isolate bg-deep-900"
    >
      <div className="relative h-[clamp(480px,70vh,640px)] overflow-hidden">
        <motion.img
          style={reduce ? {} : { scale: imageScale, y: imageY }}
          src={imageSrc}
          srcSet={imageSrcSet}
          sizes={imageSizes}
          width={imageWidth}
          height={imageHeight}
          alt={imageAlt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(90deg,rgb(var(--scrim-deep)/0.85)_0%,rgb(var(--scrim-deep)/0.45)_40%,rgb(var(--scrim-deep)/0)_68%),linear-gradient(0deg,rgb(var(--scrim-deep)/0.6)_0%,rgb(var(--scrim-deep)/0)_40%)]"
        />

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-[1360px] px-[var(--gutter)] pb-[clamp(56px,9vh,104px)]">
            <p className="text-[length:var(--text-sm)] text-control-muted">{voice}</p>
            <p ref={statRef} className="mt-3 text-control-ink">
              <span className="sr-only">
                {statValue} {statUnit} {statLabel}
              </span>
              <span aria-hidden className="flex flex-wrap items-baseline gap-x-3">
                <span className="font-display text-[length:var(--text-display)] leading-[var(--leading-display)] font-semibold tracking-[var(--tracking-display)] tabular-nums">
                  <motion.span>{rounded}</motion.span> {statUnit}
                </span>
                <span className="text-[length:var(--text-lead)] text-control-text">
                  {statLabel}
                </span>
              </span>
            </p>
            <h2
              id="home-case-title"
              className="mt-6 max-w-[22ch] font-display text-[length:var(--text-h3)] leading-[var(--leading-heading)] font-semibold tracking-[var(--tracking-heading)] text-balance text-control-ink"
            >
              {title}
            </h2>
            <p className="mt-3 max-w-[52ch] text-[length:var(--text-body)] leading-[var(--leading-body)] text-control-text">
              {body}
            </p>
            <a
              href={href}
              className="group mt-7 inline-flex items-center gap-2 text-[length:var(--text-sm)] font-semibold text-control-ink no-underline"
            >
              <span className="underline decoration-[rgb(var(--light-rgb)/0.4)] underline-offset-[0.4em] transition-colors group-hover:decoration-control-ink">
                Ver el caso
              </span>
              <ArrowRightIcon className="size-4 transition-transform duration-[var(--dur-state)] group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
