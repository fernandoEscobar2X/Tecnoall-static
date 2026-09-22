# Arquitectura de publicación

## Frontera

```text
Navegador
   │
   ├── páginas corporativas prerenderizadas
   ├── islas React para interacción puntual
   └── POST de formularios al servicio administrado Netlify Forms

Sin BFF · Sin API propia · Sin Odoo · Sin base de datos · Sin tienda
```

Astro genera el sitio completo en `dist/`. Netlify publica únicamente ese directorio; ningún archivo
fuera de `dist/` forma parte del despliegue. React se limita a cotización, WhatsApp y animaciones que
mantienen estado en el navegador.

## Estructura

```text
src/
├── assets/       fotografías, logotipos y medios corporativos autorizados
├── components/   composición, islas y primitivas de interfaz
├── config/       navegación y URL pública
├── content/      contenido comercial y casos aprobados
├── layouts/      documento y shell compartidos
├── lib/          utilidades de cliente, SEO y formularios
├── pages/        rutas Astro estáticas
└── styles/       sistema visual global
```

## Formularios

`contacto` y `solicitud-cotizacion` se detectan en el HTML generado. El navegador envía formularios
codificados a la raíz del mismo origen; Netlify procesa y almacena la solicitud. La dirección que
recibe notificaciones se configura en Netlify y nunca se publica en el bundle.

Ambos formularios incluyen honeypot, estado de envío y recuperación visible ante error. No aceptan
archivos ni datos de pago. WhatsApp continúa como canal independiente.

## Contenido y privacidad comercial

- No se inventan fotografías, clientes, métricas ni autorizaciones.
- Un nombre de cliente sin permiso no aparece en texto, metadatos, alt, slugs ni nombres públicos de
  archivos.
- Odoo y la API de comercio no son dependencias de este despliegue.
- La tienda se reincorporará únicamente en su arquitectura transaccional y despliegue separados.

## Calidad

El repositorio valida formato, lint, tipos, build y dependencias. Las pruebas E2E, Lighthouse y
capturas viven en `../tecnoall-corporate-quality`.
