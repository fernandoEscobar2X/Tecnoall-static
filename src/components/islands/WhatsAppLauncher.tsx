'use client';

import { type MouseEvent as ReactMouseEvent, useEffect, useRef, useState } from 'react';

import ReactUiIcon from '@components/ui/ReactUiIcon';

interface Props {
  href: string;
  qrSvg: string;
}

const isModifiedClick = (event: ReactMouseEvent) =>
  event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

const usesDirectWhatsApp = () =>
  /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
  window.matchMedia('(max-width: 900px) and (pointer: coarse)').matches;

export default function WhatsAppLauncher({ href, qrSvg }: Props) {
  const panelRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) document.documentElement.dataset.whatsappPanel = 'open';
    else delete document.documentElement.dataset.whatsappPanel;
    return () => {
      delete document.documentElement.dataset.whatsappPanel;
    };
  }, [open]);

  useEffect(() => {
    const handleExternalEntry = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const entry = target.closest<HTMLAnchorElement>('[data-whatsapp-entry]');
      if (!entry || entry === triggerRef.current || usesDirectWhatsApp()) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      setOpen(true);
    };
    document.addEventListener('click', handleExternalEntry);
    return () => document.removeEventListener('click', handleExternalEntry);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!panelRef.current?.contains(target) && !triggerRef.current?.contains(target))
        setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  const handleEntry = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (usesDirectWhatsApp() || isModifiedClick(event)) return;
    event.preventDefault();
    setOpen((current) => !current);
  };

  return (
    <>
      <a
        className="whatsapp-float"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        aria-expanded={open}
        data-whatsapp-entry
        onClick={handleEntry}
        ref={triggerRef}
      />
      <aside
        className="whatsapp-dialog"
        role="dialog"
        aria-modal="false"
        aria-labelledby="whatsapp-dialog-title"
        data-whatsapp-dialog
        data-open={open ? 'true' : undefined}
        hidden={!open}
        ref={panelRef}
      >
        <div className="whatsapp-dialog__panel">
          <button
            className="whatsapp-dialog__close"
            type="button"
            data-close-whatsapp
            aria-label="Cerrar"
            onClick={() => setOpen(false)}
          >
            <ReactUiIcon name="xmark" />
          </button>
          <div
            className="whatsapp-dialog__qr"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: qrSvg }}
          />
          <div className="whatsapp-dialog__content">
            <h2 id="whatsapp-dialog-title">WhatsApp</h2>
            <p>Escanee el QR o continúe desde este equipo</p>
            <a href={href} target="_blank" rel="noopener noreferrer">
              <span>Abrir en este equipo</span>
              <ReactUiIcon name="openNewWindow" />
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
