# Tecno All Corporate Static

Sitio corporativo público de Tecno All, generado completamente como archivos estáticos con Astro.
Esta copia de publicación no contiene tienda, carrito, administración, BFF, rutas de API, conexión a
Odoo ni secretos de servidor.

## Desarrollo

Requiere Node `24.14.1` y npm `11.19.0`.

```bash
npm ci
npm run dev
```

## Verificación

```bash
npm run quality
```

La suite de navegador compartida vive en `../tecnoall-corporate-quality`. Este repositorio conserva
formato, lint, tipos, build, auditoría de dependencias y detección de secretos como puertas propias.

## Publicación en Netlify

`netlify.toml` fija el build en `npm run build` y publica exclusivamente `dist/`. Astro produce HTML,
CSS, JavaScript y medios estáticos; no se despliega ningún proceso Node ni función serverless.

Los formularios `contacto` y `solicitud-cotizacion` usan Netlify Forms. Después del primer deploy:

1. activar la detección de formularios en **Forms**;
2. hacer un deploy nuevo para que Netlify registre ambos formularios;
3. enviar una solicitud de prueba y comprobar que aparece en **Forms**;
4. cuando Tecno All defina el destinatario, crear la notificación en **Forms > Submission notifications**.

Hasta configurar esa notificación, las solicitudes se almacenan en Netlify pero no se reenvían por
correo. El correo receptor no se guarda en el código.

## Alcance deliberado

- `/productos/` presenta familias y fabricantes con contenido corporativo local.
- Las cotizaciones capturan un lead; no consultan precio, inventario ni crean documentos en Odoo.
- La tienda y la API de comercio continúan en sus repositorios y ramas independientes.
- La fotografía de Tijuana y la de Mexicali son activos reales versionados dentro del frontend.
