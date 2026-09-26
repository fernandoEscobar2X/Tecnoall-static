/** Evento compartido por los diálogos, sin cargar el motor de animación. */
export const lockScroll = (locked: boolean) =>
  document.dispatchEvent(new CustomEvent('scroll-lock', { detail: locked }));
