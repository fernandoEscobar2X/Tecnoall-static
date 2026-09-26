# Optimización web — 26 de septiembre de 2026

Estado previo guardado en `85598c9` (rama `hardening-formularios-social-preview`).

## Alcance

- Pulido del menú móvil manteniendo enlaces, orden, acordeones y acceso a cotización.
- Recortes transparentes de las seis fotografías del carrusel de productos, solamente en home. Los originales del catálogo se conservan.
- Carga responsiva, prioridad del hero y carga diferida de fotografías secundarias.
- Inicialización de animaciones después del primer render, sin quitar animaciones. Navegación de escritorio inicializada solamente cuando corresponde al ancho de pantalla.
- Bloqueo de scroll separado del motor de animación.
- Ajuste posterior solicitado: carrusel de productos inicializado al cargar la página, también fuera de pantalla; intervalo de 2.5 a 2.2 segundos. Se conservan las pausas al interactuar y la preferencia de reducir movimiento.
- Referencias ARIA del selector de sedes y áreas táctiles de indicadores corregidas.
- Fuente variable restringida a los pesos utilizados (400–700): 45,712 → 36,096 bytes. Comparación de los 232 caracteres en pesos 400, 500, 600 y 700: contornos y anchos idénticos.
- Estilos de interiores cargados solamente en interiores; estilos de tableros solamente en su página.
- Máscara del título de productos ampliada 0.18em por abajo, con margen compensado, para mostrar la descendente de la g sin mover las líneas.

## Imágenes

Archivos integrados en `src/assets/tecnoall/home/`:

- `plc-siemens-s7-1200-transparent.webp`
- `conexion-wago-221-transparent.webp`
- `gabinete-rittal-transparent.webp`
- `variadores-siemens-transparent.webp`
- `hmi-siemens-transparent.webp`
- `automatizacion-wago-transparent.webp`

Edición con la herramienta integrada `image_gen`; codificación WebP con Sharp (calidad 95, alfa 100). Verificado canal alfa con valores 0–255 en los seis archivos. Astro genera variantes responsivas sin superar la resolución del archivo.

### Prompt de recorte

> Use case: background-extraction. Edit target: attached original product photograph. Asset: Tecno All website product carousel. Remove ONLY the background, white/gray rectangle, floor and scenery; produce actual transparent alpha, NOT checkerboard drawn into pixels. Preserve every product, precise silhouettes, original relative arrangement, perspective, colors, logos, labeling, small connectors and visible components. Do not invent, replace, beautify or redesign equipment. Keep the same composition and aspect ratio, with all original products intact and uncropped. Clean anti-aliased cutout edges and transparent space surrounding products. For translucent plastic retain its optical character. No new text, objects, props, outlines or shadows. Output a high fidelity transparent PNG usable on any colored web background.

La primera salida de HMI cambió la marca y se descartó. Se repitió desde el original con esta indicación:

> Create a precise transparent-background cutout of this ORIGINAL Siemens HMI product family photograph. Preserve the same four devices and their relative sizes, colors, perspective, configuration, original screen contents and composition. Remove the gray backdrop only. Important: these are SIEMENS SIMATIC devices; do not substitute any other manufacturer. The small brand logo must read SIEMENS on each device, never TECNO, and do not invent any model numbers or any other lettering. Retain original text where legible, otherwise retain the original indistinct detail. Do not redesign screens or redraw equipment. Actual transparent alpha, no painted checkerboard. Clean edges, no white rectangle, no shadows or other objects. Same landscape aspect ratio.

## Verificación

Lighthouse sobre compilación de producción, URL local `http://127.0.0.1:4400/`, configuración móvil predeterminada. Medición inicial: rendimiento 82, accesibilidad 92, buenas prácticas 100, SEO 100. Los resultados son de laboratorio local, no de PageSpeed del sitio publicado.

Medición final, incluyendo la corrección del título y el autoplay desde la carga (`tmp/lighthouse/after-mobile.json`): rendimiento **95**, accesibilidad **100**, buenas prácticas **100**, SEO **100**. LCP 2.8 s. Informe navegable en `tmp/lighthouse/after-mobile.html`.

El carrusel se hidrata durante la carga inicial (`client:idle` con timeout de 100 ms), sin esperar a entrar en pantalla. Mantiene la interpolación de Embla y la misma geometría 3D con transformaciones nativas; el texto conserva duración y easing mediante Web Animations. Se almacenan referencias y medidas para evitar consultas de layout por fotograma. Fuera de pantalla continúa avanzando la selección y se omiten solamente escrituras visuales invisibles.

Compilación de las 20 páginas completada, análisis de tipos sin errores ni advertencias, lint y `git diff --check` correctos.

Menú, acordeón de productos y apertura de cotización comprobados en Edge; tamaños de teléfono 390 y 320 px. Recorte de la g comprobado visualmente a 320 px. Página de empresa comprobada a 1280 px tras separar estilos, sin desbordamiento horizontal.

Lighthouse escribió informes válidos (sin `runtimeError` en los datos), aunque su limpieza de carpetas temporales devolvió EPERM en Windows. Ese error pertenece a la limpieza posterior, no se trata como una auditoría inválida cuando el informe contiene todas las categorías y métricas.

Referencias técnicas: [hidratación de Astro](https://docs.astro.build/es/reference/directives-reference/#clientvisible), [optimización de LCP](https://web.dev/articles/optimize-lcp).
