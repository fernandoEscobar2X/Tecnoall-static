# Seguridad

- No almacenar credenciales, claves de Odoo, datos de clientes ni exportaciones de producción.
- La única variable de entorno admitida es `PUBLIC_SITE_URL`; no hay secretos de runtime.
- Netlify publica exclusivamente `dist/` y no recibe código de servidor.
- Los formularios son fronteras de entrada no confiable y usan la detección y el honeypot de Netlify.
- No solicitar contraseñas, datos fiscales, información de pago ni archivos mediante estos formularios.
- Mantener dependencias fijadas y revisar sus cambios antes de integrar.
- Los encabezados de `public/_headers` son parte del contrato de despliegue y deben comprobarse en la
  URL de preview antes de promover a producción.
- El escáner de secretos revisa historial y cambios preparados con salida redactada.

## Reporte

Reportar vulnerabilidades en privado al responsable del repositorio. No abrir incidencias públicas
que contengan credenciales, datos personales, detalles de explotación o configuración de producción.
