import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  PhoneIcon,
  WhatsappLogoIcon,
} from '@phosphor-icons/react';
import { AnimatePresence, motion, useInView } from 'motion/react';
import { Tabs } from 'radix-ui';
import { useRef, useState } from 'react';

export interface Sede {
  city: string;
  role: string;
  address: string;
  phone: string;
  phoneHref: string;
  directionsHref: string;
  mapSrc: string;
}

interface Props {
  title: string;
  body: string;
  whatsappHref: string;
  image: { src: string; srcSet: string; width: number; height: number; alt: string };
  sedes: Sede[];
}

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Cierre del recorrido en un solo nivel: a la izquierda la invitación a cotizar, a la derecha
 * dónde encontrarnos. Dos tarjetas de la misma altura y el mismo radio.
 */
export default function ContactAndLocations({ title, body, whatsappHref, image, sedes }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  // El mapa solo se carga cuando la sección está cerca de la pantalla.
  const near = useInView(rootRef, { once: true, margin: '600px 0px' });
  const [active, setActive] = useState(sedes[0]?.city ?? '');
  const sede = sedes.find((item) => item.city === active) ?? sedes[0];

  return (
    <section
      ref={rootRef}
      id="contacto"
      aria-labelledby="contact-title"
      className="bg-paper py-[var(--section-space)]"
    >
      <div className="mx-auto grid max-w-[1360px] gap-6 px-[var(--gutter)] lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative isolate flex min-h-[560px] flex-col justify-end overflow-hidden rounded-[var(--radius-lg)] bg-deep-900 text-control-text"
        >
          <img
            src={image.src}
            srcSet={image.srcSet}
            sizes="(min-width: 1024px) 660px, 100vw"
            width={image.width}
            height={image.height}
            alt={image.alt}
            loading="lazy"
            className="absolute inset-0 -z-10 size-full object-cover object-[center_30%]"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgb(var(--scrim-deep))_0%,rgb(var(--scrim-deep)/0.85)_42%,rgb(var(--scrim-deep)/0.1)_78%)]"
          />
          <div className="p-7 sm:p-10 lg:p-12">
            <h2
              id="contact-title"
              className="max-w-[14ch] font-display text-[length:var(--text-h2)] leading-[var(--leading-heading)] font-semibold tracking-[var(--tracking-heading)] text-balance text-control-ink"
            >
              {title}
            </h2>
            <p className="mt-4 max-w-[40ch] text-[length:var(--text-lead)] leading-[var(--leading-body)]">
              {body}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
              <button type="button" data-open-quote className="brand-button brand-button--on-dark">
                Solicitar cotización
                <ArrowRightIcon className="size-4" />
              </button>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                data-whatsapp-entry
                className="text-link text-link--on-dark"
              >
                <WhatsappLogoIcon className="size-5" />
                Escribir por WhatsApp
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.12 }}
          className="flex"
        >
          <Tabs.Root
            value={active}
            onValueChange={setActive}
            className="flex min-h-[560px] w-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 p-5 pb-4 sm:px-6 sm:pt-6">
              <h2 className="font-display text-[length:var(--text-h3)] leading-[var(--leading-heading)] font-semibold tracking-[var(--tracking-heading)] text-deep">
                Dos sedes, un mismo equipo
              </h2>
              <Tabs.List
                aria-label="Sedes Tecno All"
                className="inline-flex rounded-[var(--radius)] border border-line bg-paper p-1"
              >
                {sedes.map((item) => (
                  <Tabs.Trigger
                    key={item.city}
                    value={item.city}
                    className="relative rounded-[calc(var(--radius)-4px)] px-4 py-2 text-[length:var(--text-sm)] font-medium text-muted transition-colors duration-[var(--dur-state)] data-[state=active]:text-paper"
                  >
                    {item.city === active && (
                      <motion.span
                        layoutId="sede-activa"
                        transition={{ duration: 0.4, ease: EASE }}
                        className="absolute inset-0 rounded-[calc(var(--radius)-4px)] bg-deep"
                      />
                    )}
                    <span className="relative">{item.city}</span>
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
            </div>

            <div className="relative mx-3 min-h-[300px] flex-1 overflow-hidden rounded-[var(--radius)] bg-line sm:mx-4">
              {near &&
                sedes.map((item) => (
                  <iframe
                    key={item.city}
                    src={item.mapSrc}
                    title={`Mapa de Tecno All ${item.city}`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className={`absolute inset-0 size-full border-0 transition-opacity duration-[var(--dur-enter)] ${
                      item.city === active ? 'opacity-100' : 'pointer-events-none opacity-0'
                    }`}
                    aria-hidden={item.city !== active}
                    tabIndex={item.city === active ? 0 : -1}
                  />
                ))}
            </div>

            {sede && (
              <div className="p-5 pt-4 sm:px-6 sm:pb-6">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={sede.city}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.28, ease: EASE }}
                    className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2"
                  >
                    <div>
                      <p className="text-[length:var(--text-sm)] text-muted">{sede.role}</p>
                      <address className="mt-1 max-w-[38ch] text-[length:var(--text-body)] leading-[var(--leading-body)] text-text not-italic">
                        {sede.address}
                      </address>
                    </div>
                    <div className="flex flex-wrap gap-x-6">
                      <a href={sede.phoneHref} className="text-link">
                        <PhoneIcon className="size-4" />
                        {sede.phone}
                      </a>
                      <a
                        href={sede.directionsHref}
                        target="_blank"
                        rel="noreferrer"
                        className="text-link"
                      >
                        Cómo llegar
                        <ArrowUpRightIcon className="size-4" />
                      </a>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </Tabs.Root>
        </motion.div>
      </div>
    </section>
  );
}
