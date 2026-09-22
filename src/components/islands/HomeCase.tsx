'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Props {
  imageSrc: string;
  imageSrcSet: string;
  imageSizes: string;
  imageWidth: number;
  imageHeight: number;
  imageAlt: string;
  voice: string;
  openLine: string;
  closeLine: string;
  statValue: number;
  statUnit: string;
  statLabel: string;
  href: string;
}

export default function HomeCase({
  imageSrc,
  imageSrcSet,
  imageSizes,
  imageWidth,
  imageHeight,
  imageAlt,
  voice,
  openLine,
  closeLine,
  statValue,
  statUnit,
  statLabel,
  href,
}: Props) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const statNode = root.querySelector<HTMLElement>('[data-case-stat]');
      const statTrigger = root.querySelector<HTMLElement>('.home-case__stat');
      if (!statNode || !statTrigger) return;

      const stat = { value: 0 };
      const runStat = () => {
        gsap.to(stat, {
          value: statValue,
          duration: 1.6,
          ease: 'power2.out',
          snap: { value: 1 },
          onUpdate: () => {
            statNode.textContent = String(Math.round(stat.value));
          },
        });
      };

      statNode.textContent = '0';
      if (statTrigger.getBoundingClientRect().top < window.innerHeight * 0.92) {
        runStat();
      } else {
        ScrollTrigger.create({
          trigger: statTrigger,
          start: 'top 92%',
          once: true,
          onEnter: runStat,
        });
      }
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="home-case" aria-labelledby="home-case-title">
      <div className="home-case__stage">
        <div className="home-case__shot">
          <img
            src={imageSrc}
            srcSet={imageSrcSet}
            sizes={imageSizes}
            alt={imageAlt}
            width={imageWidth}
            height={imageHeight}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="home-case__veil" aria-hidden="true" />
        <div className="home-case__copy">
          <p className="home-case__voice">{voice}</p>
          <p className="home-case__stat">
            <span className="visually-hidden">
              {statValue} {statUnit} {statLabel}
            </span>
            <span aria-hidden="true">
              <span className="home-case__stat-value">
                <span data-case-stat>{statValue}</span>
                <span> {statUnit}</span>
              </span>
              <span className="home-case__stat-label">{statLabel}</span>
            </span>
          </p>
          <h2 id="home-case-title">
            <span>{openLine}</span>
            <span>{closeLine}</span>
          </h2>
          <a className="home-case__link" href={href}>
            Ver el caso
          </a>
        </div>
      </div>
    </section>
  );
}
