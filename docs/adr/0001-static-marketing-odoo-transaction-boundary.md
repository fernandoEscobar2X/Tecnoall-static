# ADR 0001 — Static marketing frontend, Odoo transaction boundary

- **Status:** Accepted for the starter
- **Date:** 2026-08-11

## Context

Tecno All needs a visually flexible corporate website while its product catalog, commerce and operational data already live in Odoo. Rebuilding those transactional capabilities in a second frontend would create duplicated state, additional integration work and more failure modes.

## Decision

Use Astro as a static-first corporate/marketing frontend. Use React only for deliberately hydrated interactive islands. Keep Odoo as the transactional source of truth and link the storefront through its own hostname. Authenticated writes to Odoo require a trusted server boundary and are not implemented in the static browser bundle.

## Consequences

### Positive

- Corporate pages remain cacheable and JavaScript-light.
- Visual design can evolve independently of Odoo templates.
- Catalog, orders, customers and invoices are not duplicated.
- SEO/content architecture can grow without coupling to the ERP.

### Tradeoffs

- The team owns two deployment surfaces and must keep branding/navigation coherent.
- Cross-system analytics and authenticated integrations require deliberate implementation.
- A future requirement for server-rendered or authenticated marketing routes may require an Astro adapter or a separate server/API runtime.

## Revisit when

Revisit this decision only when a validated product requirement cannot be met cleanly through the static frontend plus Odoo boundary.
