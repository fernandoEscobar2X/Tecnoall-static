import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export interface SolutionRosterItem {
  id: string;
  index: string;
  title: string;
  shortTitle: string;
  body: string;
  href: string;
  tags: string[];
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
  items: SolutionRosterItem[];
}

export default function SolutionsRoster({ items }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef(0);
  const reducedRef = useRef(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const paintedRef = useRef(false);
  const dragRef = useRef({ x: 0, y: 0, active: false, locked: false });
  const [selected, setSelected] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const count = items.length;

  const nodes = useCallback(
    (name: string) =>
      rootRef.current
        ? [...rootRef.current.querySelectorAll<HTMLElement>(`[data-roster="${name}"]`)]
        : [],
    [],
  );

  const go = useCallback(
    (next: number) => {
      const total = items.length;
      const from = selectedRef.current;
      if (next === from || next < 0 || next >= total) return;
      const forward = (next - from + total) % total;
      const backward = (from - next + total) % total;
      const dir = forward <= backward ? 1 : -1;
      selectedRef.current = next;
      setSelected(next);

      const shots = nodes('shot');
      const metas = nodes('meta');
      shots.forEach((el, index) => {
        if (index !== from && index !== next) gsap.set(el, { autoAlpha: 0, x: 0 });
      });
      metas.forEach((el, index) => {
        if (index !== from && index !== next) gsap.set(el, { autoAlpha: 0, x: 0 });
      });

      if (reducedRef.current) {
        if (shots[from]) gsap.set(shots[from], { autoAlpha: 0, x: 0 });
        if (metas[from]) gsap.set(metas[from], { autoAlpha: 0, x: 0 });
        if (shots[next]) gsap.set(shots[next], { autoAlpha: 1, x: 0 });
        if (metas[next]) gsap.set(metas[next], { autoAlpha: 1, x: 0 });
        return;
      }

      timelineRef.current?.kill();
      const timeline = gsap.timeline();
      timelineRef.current = timeline;
      if (shots[from]) {
        timeline.to(
          shots[from],
          { x: dir * -88, autoAlpha: 0, duration: 0.32, ease: 'power2.inOut' },
          0,
        );
      }
      if (metas[from]) {
        timeline.to(
          metas[from],
          { x: dir * -36, autoAlpha: 0, duration: 0.28, ease: 'power2.inOut' },
          0,
        );
      }
      if (shots[next]) {
        timeline.fromTo(
          shots[next],
          { x: dir * 100, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: 0.5, ease: 'power2.inOut' },
          0.12,
        );
      }
      if (metas[next]) {
        timeline.fromTo(
          metas[next],
          { x: dir * 42, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: 0.45, ease: 'power2.inOut' },
          0.14,
        );
      }
    },
    [items.length, nodes],
  );

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      reducedRef.current = reduced;
      const shots = nodes('shot');
      const metas = nodes('meta');
      shots.forEach((el, index) => gsap.set(el, { autoAlpha: index === 0 ? 1 : 0, x: 0 }));
      metas.forEach((el, index) => gsap.set(el, { autoAlpha: index === 0 ? 1 : 0, x: 0 }));
      if (reduced) return;

      // Entrada: las filas llegan en orden y la foto se descubre de abajo hacia arriba.
      const frame = root.querySelector<HTMLElement>('.solution-roster__frame');
      const intro = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top 80%', once: true },
      });
      intro.from(
        nodes('row'),
        { y: 28, autoAlpha: 0, duration: 0.8, ease: 'expo.out', stagger: 0.07 },
        0,
      );
      if (frame) {
        intro.from(
          frame,
          { clipPath: 'inset(16% 0% 0% 0% round 10px)', duration: 1.1, ease: 'expo.out' },
          0.1,
        );
        intro.from(
          frame.querySelectorAll('img'),
          { scale: 1.12, duration: 1.4, ease: 'expo.out' },
          0.1,
        );
      }
      intro.from(
        root.querySelector('.solution-roster__meta'),
        { y: 20, autoAlpha: 0, duration: 0.8, ease: 'expo.out' },
        0.35,
      );
    },
    { scope: rootRef },
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = reducedRef.current || !paintedRef.current;
    paintedRef.current = true;
    nodes('name').forEach((el, index) => {
      const on = index === selected || index === hovered;
      gsap.to(el, {
        scale: on ? 1.02 : 1,
        duration: reduced ? 0 : 0.3,
        ease: 'power1.inOut',
        transformOrigin: 'left center',
        overwrite: 'auto',
      });
    });
  }, [hovered, nodes, selected]);

  const onFramePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (window.innerWidth >= 768) return;
    if (timelineRef.current?.isActive()) return;
    if ((event.target as HTMLElement).closest('button')) return;
    dragRef.current = { x: event.clientX, y: event.clientY, active: true, locked: false };
  };

  const onFramePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.active) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.locked) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      if (Math.abs(dy) > Math.abs(dx)) {
        drag.active = false;
        return;
      }
      drag.locked = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    const shot = nodes('shot')[selectedRef.current];
    if (shot) gsap.set(shot, { x: dx * 0.45 });
  };

  const onFramePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.active) return;
    const dx = event.clientX - drag.x;
    drag.active = false;
    const locked = drag.locked;
    drag.locked = false;
    if (!locked) return;
    if (dx <= -56) go((selectedRef.current + 1) % count);
    else if (dx >= 56) go((selectedRef.current - 1 + count) % count);
    else {
      const shot = nodes('shot')[selectedRef.current];
      if (shot)
        gsap.to(shot, { x: 0, duration: reducedRef.current ? 0 : 0.35, ease: 'power2.out' });
    }
  };

  if (!count) return null;
  const previous = (selected - 1 + count) % count;
  const following = (selected + 1) % count;

  return (
    <div
      ref={rootRef}
      className="solution-roster"
      aria-label="Soluciones de Tecno All"
      onKeyDown={(event) => {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
        if ((event.target as HTMLElement).closest('a')) return;
        event.preventDefault();
        go(event.key === 'ArrowRight' ? following : previous);
      }}
    >
      <div className="solution-roster__list">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className="solution-roster__row"
            data-roster="row"
            aria-current={index === selected ? 'true' : undefined}
            onClick={() => go(index)}
            onPointerEnter={(event) => {
              if (event.pointerType === 'touch' || window.innerWidth < 768) return;
              setHovered(index);
              go(index);
            }}
            onPointerLeave={() => setHovered(null)}
            onKeyDown={(event) => {
              if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
              event.preventDefault();
              const next =
                event.key === 'ArrowDown' ? (index + 1) % count : (index - 1 + count) % count;
              go(next);
              nodes('row')[next]?.focus();
            }}
          >
            <span className="solution-roster__label">
              <span className="solution-roster__name" data-roster="name">
                {item.title}
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="solution-roster__preview">
        <div
          className="solution-roster__frame"
          onPointerDown={onFramePointerDown}
          onPointerMove={onFramePointerMove}
          onPointerUp={onFramePointerUp}
          onPointerCancel={onFramePointerUp}
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              className="solution-roster__shot"
              data-roster="shot"
              data-index={index}
              aria-hidden={index === selected ? undefined : true}
            >
              <img
                src={item.image.src}
                srcSet={item.image.srcSet}
                sizes={item.image.sizes}
                width={item.image.width}
                height={item.image.height}
                alt={item.image.alt}
                draggable={false}
                decoding="async"
              />
            </div>
          ))}

          <div className="solution-roster__arrows">
            <button type="button" aria-label="Solución anterior" onClick={() => go(previous)}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button type="button" aria-label="Solución siguiente" onClick={() => go(following)}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
          <div className="solution-roster__dots">
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-label={item.title}
                aria-current={index === selected ? 'true' : undefined}
                onClick={() => go(index)}
              />
            ))}
          </div>
        </div>

        <div className="solution-roster__meta">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="solution-roster__panel"
              data-roster="meta"
              data-index={index}
              aria-hidden={index === selected ? undefined : true}
            >
              <h3>{item.title}</h3>
              <p className="solution-roster__body">{item.body}</p>
              <a className="solution-roster__link" href={item.href}>
                Ver solución
                <span aria-hidden="true">→</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
