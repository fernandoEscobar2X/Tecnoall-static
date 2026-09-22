'use client';

import {
  type MouseEvent as ReactMouseEvent,
  type SubmitEvent as ReactSubmitEvent,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';

import ReactUiIcon from '@components/ui/ReactUiIcon';
import {
  clearQuoteItems,
  getQuotePicks,
  isQuoted,
  subscribeQuote,
  toggleQuoteItem,
} from '@/lib/quote-selection';
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
  const lines = useSyncExternalStore(subscribeQuote, getQuotePicks, getQuotePicks);

  useEffect(() => {
    const dialog = dialogRef.current;
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const quoteTrigger = target.closest<HTMLElement>('[data-open-quote]');
      if (quoteTrigger) {
        event.preventDefault();
        openerRef.current = quoteTrigger;
        setStep(1);
        setSubmissionStatus('idle');
        setOpen(true);
        return;
      }

      const productTrigger = target.closest<HTMLButtonElement>('[data-quote-product]');
      if (!productTrigger) return;
      const id = productTrigger.dataset.quoteProduct;
      const title = productTrigger.dataset.productTitle;
      if (!id || !title) return;
      toggleQuoteItem(id, title);
    };

    document.addEventListener('click', handleDocumentClick);
    dialog?.setAttribute('data-quote-ready', 'true');
    return () => {
      document.removeEventListener('click', handleDocumentClick);
      dialog?.removeAttribute('data-quote-ready');
    };
  }, []);

  useEffect(() => {
    document.querySelectorAll<HTMLButtonElement>('[data-quote-product]').forEach((button) => {
      const selected = Boolean(
        button.dataset.quoteProduct && isQuoted(button.dataset.quoteProduct),
      );
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }, [lines]);

  useEffect(() => {
    syncDialog(dialogRef.current, open, () => titleRef.current?.focus({ preventScroll: true }));
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
    const name = String(form.get('name') ?? '');
    const company = String(form.get('company') ?? '');
    const senderEmail = String(form.get('email') ?? '');
    const phone = String(form.get('phone') ?? '');
    const requestType = String(form.get('requestType') ?? 'Solicitud comercial');
    const message = String(form.get('message') ?? '');
    const submitter = event.nativeEvent.submitter as HTMLButtonElement | null;
    const products = lines.length
      ? lines.map((line) => `- ${line.title}`).join('\n')
      : 'Sin productos preseleccionados';
    const subject = `${requestType} — ${company || name}`;
    const body = `${requestType}\n\nNombre: ${name}\nEmpresa: ${company || 'No indicada'}\nCorreo: ${senderEmail || 'No indicado'}\nTeléfono: ${phone || 'No indicado'}\n\nSelección:\n${products}\n\nSolicitud:\n${message}`;

    if (submitter?.value === 'email') {
      form.set('selection', products);
      form.set('subject', subject);
      setSubmissionStatus('submitting');
      try {
        await submitNetlifyForm(FORM_NAME, form);
        element.reset();
        clearQuoteItems();
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
      aria-labelledby="quote-title"
      ref={dialogRef}
      onCancel={() => setOpen(false)}
      onClick={handleBackdropClick}
    >
      <div className="quote-dialog__head">
        <div>
          <h2 id="quote-title" tabIndex={-1} ref={titleRef}>
            Inicie su solicitud
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
        {lines.length > 0 ? (
          <div className="quote-dialog__selection">
            <h3>Productos seleccionados</h3>
            <ul>
              {lines.map((line) => (
                <li key={line.id}>
                  <span>{line.title}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <form
          name={FORM_NAME}
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="website"
          data-quote-form
          onSubmit={handleSubmit}
        >
          <input type="hidden" name="form-name" value={FORM_NAME} />
          <input type="hidden" name="selection" value="" />
          <input type="hidden" name="subject" value="Nueva solicitud comercial" />
          <p hidden>
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
                  name="requestType"
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
                  name="requestType"
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
                name="message"
                rows={4}
                required
                enterKeyHint="next"
                placeholder="Proyecto, proceso o productos requeridos"
                ref={messageRef}
              />
            </label>
            <button
              className="action action--primary quote-dialog__next"
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
            <h3 tabIndex={-1}>Datos de contacto</h3>
            <div className="quote-dialog__contact">
              <label>
                Nombre
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  autoCapitalize="words"
                  enterKeyHint="next"
                  required
                />
              </label>
              <label>
                Empresa
                <input
                  type="text"
                  name="company"
                  autoComplete="organization"
                  autoCapitalize="words"
                  enterKeyHint="next"
                />
              </label>
              <label>
                Correo
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  enterKeyHint="next"
                  required
                />
              </label>
              <label>
                Teléfono
                <input type="tel" name="phone" autoComplete="tel" enterKeyHint="done" />
              </label>
            </div>
            <div className="quote-dialog__submit">
              <button type="button" data-quote-back onClick={() => setStep(1)}>
                Volver
              </button>
              <button
                className="action action--primary"
                type="submit"
                name="channel"
                value="whatsapp"
                disabled={submissionStatus === 'submitting'}
              >
                Continuar por WhatsApp
              </button>
              <button
                type="submit"
                name="channel"
                value="email"
                disabled={submissionStatus === 'submitting'}
              >
                {submissionStatus === 'submitting' ? 'Enviando…' : 'Enviar solicitud'}
              </button>
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
