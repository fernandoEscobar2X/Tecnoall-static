const MAP_WARMUP_MARGIN = '1400px 0px';

export const initializeLocationExperiences = () => {
  const experiences = [...document.querySelectorAll<HTMLElement>('[data-location-experience]')];

  experiences.forEach((experience) => {
    if (experience.dataset.locationInitialized === 'true') return;
    experience.dataset.locationInitialized = 'true';

    const scope = experience.parentElement ?? document;
    const triggers = [...scope.querySelectorAll<HTMLButtonElement>('[data-location-trigger]')];
    const panels = [...scope.querySelectorAll<HTMLElement>('[data-location-panel]')];
    const maps = [...scope.querySelectorAll<HTMLElement>('[data-location-map]')];
    const mapFrames = maps.flatMap((map) => [
      ...map.querySelectorAll<HTMLIFrameElement>('[data-map-frame]'),
    ]);

    const loadMap = (index: number) => {
      const frame = mapFrames[index];
      const source = frame?.dataset.mapSource;
      if (!frame || !source || frame.getAttribute('src') === source) return;

      frame.loading = 'eager';
      frame.src = source;
    };

    const getActiveIndex = () => {
      const selected = triggers.find((trigger) => trigger.getAttribute('aria-selected') === 'true');
      return Number(selected?.dataset.locationTrigger ?? 0);
    };

    const loadActiveMap = () => loadMap(getActiveIndex());
    const loadRemainingMaps = () => mapFrames.forEach((_, index) => loadMap(index));

    const scheduleRemainingMaps = () => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(loadRemainingMaps, { timeout: 1200 });
      } else {
        globalThis.setTimeout(loadRemainingMaps, 250);
      }
    };

    if ('IntersectionObserver' in window) {
      const warmupObserver = new IntersectionObserver(
        (entries, observer) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          loadActiveMap();
          observer.disconnect();
        },
        { rootMargin: MAP_WARMUP_MARGIN, threshold: 0.01 },
      );
      warmupObserver.observe(experience);

      const visibleObserver = new IntersectionObserver(
        (entries, observer) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          loadActiveMap();
          scheduleRemainingMaps();
          observer.disconnect();
        },
        { rootMargin: '160px 0px', threshold: 0.01 },
      );
      visibleObserver.observe(experience);
    } else {
      loadActiveMap();
    }

    triggers.forEach((trigger) => {
      const index = Number(trigger.dataset.locationTrigger ?? 0);
      const prepareMap = () => loadMap(index);

      trigger.addEventListener('pointerenter', prepareMap, { passive: true });
      trigger.addEventListener('pointerdown', prepareMap, { passive: true });
      trigger.addEventListener('focus', prepareMap);
      trigger.addEventListener('keydown', (event) => {
        if (!trigger.closest('.sedes-contact')) return;
        const position = triggers.indexOf(trigger);
        let next: number;
        if (event.key === 'ArrowRight') next = (position + 1) % triggers.length;
        else if (event.key === 'ArrowLeft')
          next = (position - 1 + triggers.length) % triggers.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = triggers.length - 1;
        else return;
        event.preventDefault();
        triggers[next]?.focus();
        triggers[next]?.click();
      });
      trigger.addEventListener('click', () => {
        if (trigger.getAttribute('aria-selected') === 'true') return;
        prepareMap();
        const selectedIndex = trigger.dataset.locationTrigger ?? '0';
        triggers.forEach((item) => {
          const active = item === trigger;
          item.classList.toggle('is-active', active);
          item.setAttribute('aria-selected', String(active));
          item.tabIndex = active ? 0 : -1;
        });
        panels.forEach((panel) => (panel.hidden = panel.dataset.locationPanel !== selectedIndex));
        maps.forEach((map) => (map.hidden = map.dataset.locationMap !== selectedIndex));
      });
    });
  });
};
