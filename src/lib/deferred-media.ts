const pendingImages = new WeakMap<HTMLImageElement, Promise<void>>();

export function loadDeferredImage(image: HTMLImageElement | null): Promise<void> {
  if (!image) return Promise.resolve();
  if (image.dataset.mediaState === 'loaded') return Promise.resolve();

  const pending = pendingImages.get(image);
  if (pending) return pending;

  const source = image.dataset.mediaSrc;
  if (!source) return Promise.resolve();

  image.dataset.mediaState = 'loading';
  const promise = new Promise<void>((resolve, reject) => {
    const finish = () => resolve();
    const fail = () => reject(new Error(`No se pudo cargar ${source}`));

    image.addEventListener('load', finish, { once: true });
    image.addEventListener('error', fail, { once: true });
    if (image.dataset.mediaSizes) image.sizes = image.dataset.mediaSizes;
    if (image.dataset.mediaSrcset) image.srcset = image.dataset.mediaSrcset;
    image.src = source;

    if (image.complete && image.naturalWidth > 0) resolve();
  })
    .then(async () => {
      try {
        await image.decode();
      } catch {
        // Safari puede resolver load antes de que decode() esté disponible; la imagen ya es utilizable.
      }
      image.dataset.mediaState = 'loaded';
    })
    .catch((error: unknown) => {
      image.dataset.mediaState = 'error';
      throw error;
    })
    .finally(() => pendingImages.delete(image));

  pendingImages.set(image, promise);
  return promise;
}
