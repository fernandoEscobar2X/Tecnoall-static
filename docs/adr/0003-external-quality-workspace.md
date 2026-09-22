# ADR 0003 — QA y herramientas fuera de la aplicación

## Estado

Aceptada el 2026-08-17.

## Decisión

Las suites E2E, Lighthouse, reportes y utilidades viven en `tecnoall-corporate-quality`.

## Razón

Mantener el repositorio corporativo enfocado en código desplegable, evitar dependencias de navegador en el install de la app y controlar el consumo de recursos de Playwright.

## Consecuencia

El pipeline futuro deberá ejecutar ambos workspaces de forma coordinada. La app conserva `check`, lint, format y build como gates locales.
