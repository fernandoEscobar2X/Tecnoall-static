# ADR 0002 — Astro con React islands deliberadas

## Estado

Aceptada para la publicación corporativa estática.

## Decisión

Astro renderiza estructura, contenido y SEO. React se utiliza solo para navegación móvil, cotización, WhatsApp y el dial de fabricantes.

## Razón

Estas piezas mantienen estado, coordinan eventos o requieren física de interacción. Hidratar secciones estáticas aumentaría JavaScript sin beneficio para el usuario.

## Consecuencia

Cada nueva island debe justificar su directiva de hidratación y no puede importar módulos server-only.
