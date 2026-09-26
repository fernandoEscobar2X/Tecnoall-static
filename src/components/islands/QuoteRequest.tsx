'use client';

import {
  type MouseEvent as ReactMouseEvent,
  type SubmitEvent as ReactSubmitEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

import ReactUiIcon from '@components/ui/ReactUiIcon';
import { lockScroll } from '@/lib/motion';
import { submitNetlifyForm } from '@/lib/netlify-forms';

interface Props {
  whatsappHref: string;
}

type QuoteStep = 1 | 2;
type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

const FORM_NAME = 'solicitud-cotizacion';

export default function QuoteRequest({ whatsappHref }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const openerRef = useRef<HTMLElement>(null);
  const wasOpenRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<QuoteStep>(1);
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('idle');

  useEffect(() => {
    const dialog = dialogRef.current;
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const quoteTrigger = target.closest<HTMLElement>('[data-open-quote]');
      if (quoteTrigger) {
        event.preventDefault();
        openerRef.current = quoteTrigger;
        // El botón que abre el formulario decide el tipo: data-open-quote="proyecto|suministro".
        const intent = quoteTrigger.dataset.openQuote;
        const radio = dialog?.querySelector<HTMLInputElement>(
          intent === 'suministro' ? '#request-supply' : '#request-project',
        );
        if (radio && (intent === 'suministro' || intent === 'proyecto')) radio.checked = true;
        setStep(1);
        setSubmissionStatus('idle');
        setOpen(true);
      }
    };

    document.addEventListener('click', handleDocumentClick);
    dialog?.setAttribute('data-quote-ready', 'true');
    return () => {
      document.removeEventListener('click', handleDocumentClick);
      dialog?.removeAttribute('data-quote-ready');
    };
  }, []);

  useEffect(() => {
    syncDialog(dialogRef.current, open, () => titleRef.current?.focus({ preventScroll: true }));
    lockScroll(open);
    if (!open && wasOpenRef.current) {
      requestAnimationFrame(() => openerRef.current?.focus({ preventScroll: true }));
    }
    wasOpenRef.current = open;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const keepFocusedControlVisible = () => {
      requestAnimationFrame(() => {
        const focused = document.activeElement as HTMLElement | null;
        const scroll = scrollRef.current;
        if (!focused || !scroll?.contains(focused)) return;
        if (!focused.matches('input:not([type="radio"]), textarea, select')) return;
        const viewport = window.visualViewport;
        const visibleTop = viewport?.offsetTop ?? 0;
        const visibleBottom = visibleTop + (viewport?.height ?? window.innerHeight);
        const rect = focused.getBoundingClientRect();
        const topLimit = visibleTop + 24;
        const bottomLimit = visibleBottom - 24;
        if (rect.bottom > bottomLimit)
          scroll.scrollBy({ top: rect.bottom - bottomLimit, behavior: 'smooth' });
        else if (rect.top < topLimit)
          scroll.scrollBy({ top: rect.top - topLimit, behavior: 'smooth' });
      });
    };

    const viewport = window.visualViewport;
    viewport?.addEventListener('resize', keepFocusedControlVisible, { passive: true });
    viewport?.addEventListener('scroll', keepFocusedControlVisible, { passive: true });
    return () => {
      viewport?.removeEventListener('resize', keepFocusedControlVisible);
      viewport?.removeEventListener('scroll', keepFocusedControlVisible);
    };
  }, [open]);

  const handleBackdropClick = (event: ReactMouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) setOpen(false);
  };

  const continueToContact = () => {
    if (!messageRef.current?.reportValidity()) return;
    setStep(2);
    scrollRef.current?.scrollTo({ top: 0 });
  };

  const handleSubmit = async (event: ReactSubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const element = event.currentTarget;
    const form = new FormData(element);
    const name = String(form.get('nombre') ?? '');
    const company = String(form.get('empresa') ?? '');
    const senderEmail = String(form.get('email') ?? '');
    const phone = String(form.get('telefono') ?? '');
    const requestType = String(form.get('tipo_solicitud') ?? 'Solicitud comercial');
    const message = String(form.get('requerimiento') ?? '');
    const submitter = event.nativeEvent.submitter as HTMLButtonElement | null;
    const body = `${requestType}\n\nNombre: ${name}\nEmpresa: ${company || 'No indicada'}\nCorreo: ${senderEmail || 'No indicado'}\nTeléfono: ${phone || 'No indicado'}\n\nSolicitud:\n${message}`;

    if (submitter?.value === 'email') {
      form.set('pagina', window.location.href);
      form.set('fecha_envio', new Date().toISOString());
      form.set('canal', 'Correo');
      setSubmissionStatus('submitting');
      try {
        await submitNetlifyForm(FORM_NAME, form);
        element.reset();
        setSubmissionStatus('success');
      } catch {
        setSubmissionStatus('error');
      }
      return;
    }
    const separator = whatsappHref.includes('?') ? '&' : '?';
    window.open(
      `${whatsappHref}${separator}text=${encodeURIComponent(body)}`,
      '_blank',
      'noopener',
    );
  };

  return (
    <dialog
      className="quote-dialog"
      data-quote-dialog
      data-lenis-prevent
      aria-labelledby="quote-title"
      ref={dialogRef}
      onCancel={() => setOpen(false)}
      onClick={handleBackdropClick}
    >
      <div className="quote-dialog__head">
        <div>
          <p className="quote-dialog__step-label">Paso {step} de 2</p>
          <h2 id="quote-title" tabIndex={-1} ref={titleRef}>
            {step === 1 ? 'Inicie su solicitud' : 'Datos de contacto'}
          </h2>
        </div>
        <button
          type="button"
          data-close-quote
          aria-label="Cerrar cotización"
          onClick={() => setOpen(false)}
        >
          <ReactUiIcon name="xmark" />
        </button>
      </div>
      <div className="quote-dialog__body" data-quote-scroll ref={scrollRef}>
        <form
          name={FORM_NAME}
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="website"
          data-quote-form
          onSubmit={handleSubmit}
        >
          <input type="hidden" name="form-name" value={FORM_NAME} />
          <input
            type="hidden"
            name="subject"
            value="[Tecno All] Nueva solicitud de cotización · %{submissionId}"
            data-remove-prefix
          />
          <input type="hidden" name="origen" value="Cotizador corporativo" />
          <input type="hidden" name="pagina" value="" />
          <input type="hidden" name="fecha_envio" value="" />
          <p className="netlify-honeypot" aria-hidden="true">
            <label>
              No llenar este campo: <input name="website" autoComplete="off" tabIndex={-1} />
            </label>
          </p>
          {submissionStatus === 'success' ? (
            <div className="quote-dialog__result" role="status">
              <h3>Solicitud recibida</h3>
              <p>El equipo de Tecno All revisará la información y se pondrá en contacto.</p>
              <button type="button" onClick={() => setOpen(false)}>
                Cerrar
              </button>
            </div>
          ) : null}
          <div className="quote-dialog__step" data-quote-step="1" hidden={step !== 1}>
            <fieldset className="quote-dialog__type">
              <legend>Tipo de solicitud</legend>
              <label htmlFor="request-project" aria-label="Proyecto de automatización">
                <input
                  id="request-project"
                  type="radio"
                  name="tipo_solicitud"
                  value="Proyecto de automatización"
                  defaultChecked
                />
                <span>
                  <strong>Proyecto de automatización</strong>
                  <small>Ingeniería, integración o servicio</small>
                </span>
              </label>
              <label htmlFor="request-supply" aria-label="Suministro industrial">
                <input
                  id="request-supply"
                  type="radio"
                  name="tipo_solicitud"
                  value="Suministro industrial"
                />
                <span>
                  <strong>Suministro industrial</strong>
                  <small>Productos, fabricantes o reposición</small>
                </span>
              </label>
            </fieldset>
            <label className="quote-dialog__message">
              Descripción del requerimiento
              <textarea
                name="requerimiento"
                rows={4}
                maxLength={4000}
                required
                enterKeyHint="next"
                placeholder="Proyecto, proceso o productos requeridos"
                ref={messageRef}
              />
            </label>
            <button
              className="brand-button quote-dialog__next"
              type="button"
              data-quote-next
              onClick={continueToContact}
            >
              Continuar
            </button>
          </div>

          <div
            className="quote-dialog__step"
            data-quote-step="2"
            hidden={step !== 2 || submissionStatus === 'success'}
          >
            <div className="quote-dialog__contact">
              <label>
                Nombre
                <input
                  type="text"
                  name="nombre"
                  autoComplete="name"
                  autoCapitalize="words"
                  enterKeyHint="next"
                  maxLength={100}
                  required
                />
              </label>
              <label>
                Empresa
                <input
                  type="text"
                  name="empresa"
                  autoComplete="organization"
                  autoCapitalize="words"
                  enterKeyHint="next"
                  maxLength={120}
                />
              </label>
              <label>
                Correo
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  enterKeyHint="next"
                  maxLength={254}
                  required
                />
              </label>
              <label>
                Teléfono
                <input
                  type="tel"
                  name="telefono"
                  autoComplete="tel"
                  enterKeyHint="done"
                  maxLength={30}
                />
              </label>
            </div>
            <p className="form-privacy-note">
              Al enviar sus datos, acepta su tratamiento para atender esta solicitud conforme al{' '}
              <a href="/aviso-de-privacidad/">aviso de privacidad</a>.
            </p>
            <div className="quote-dialog__submit">
              <button
                className="text-link"
                type="button"
                data-quote-back
                onClick={() => setStep(1)}
              >
                Volver
              </button>
              <div className="quote-dialog__send">
                <button
                  className="text-link"
                  type="submit"
                  name="canal"
                  value="whatsapp"
                  disabled={submissionStatus === 'submitting'}
                >
                  Continuar por WhatsApp
                </button>
                <button
                  className="brand-button"
                  type="submit"
                  name="canal"
                  value="email"
                  disabled={submissionStatus === 'submitting'}
                >
                  {submissionStatus === 'submitting' ? 'Enviando…' : 'Enviar solicitud'}
                </button>
              </div>
            </div>
            {submissionStatus === 'error' ? (
              <p className="quote-dialog__error" role="alert">
                No fue posible enviar la solicitud. Intente de nuevo o continúe por WhatsApp.
              </p>
            ) : null}
          </div>
        </form>
      </div>
    </dialog>
  );
}

function syncDialog(dialog: HTMLDialogElement | null, shouldOpen: boolean, onOpened: () => void) {
  if (!dialog) return;
  if (shouldOpen && !dialog.open) {
    dialog.showModal();
    requestAnimationFrame(onOpened);
  } else if (!shouldOpen && dialog.open) {
    dialog.close();
  }
}
