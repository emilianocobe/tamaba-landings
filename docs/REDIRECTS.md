# Mapa de redirecciones · URLs viejas → nuevas
**Fuente de verdad: `data/redirects.json`. El build genera una página de redirección por entrada (meta refresh 0s + JS que preserva los parámetros UTM). Este documento explica el criterio.**

## Por qué existe

Las campañas activas de Google Ads, Meta y Performance Max apuntan a las URLs del sitio WordPress viejo (`/gads-…`, `/mads-…`, `/pmax-…`). Al migrar el dominio a este sitio, esas URLs deben seguir resolviendo — un 404 en la URL final de un anuncio activo desaprueba el anuncio y quema presupuesto.

GitHub Pages no permite 301 de servidor, así que se usan páginas puente: `meta refresh` de 0 segundos + `location.replace()` que **conserva la query string** (los UTM llegan intactos a la página nueva y la atribución no se pierde). Todas llevan `noindex` y `canonical` a la URL nueva, con lo cual los buscadores consolidan la señal correctamente.

## Criterio de mapeo

| Grupo viejo | Destino | Nota |
|-------------|---------|------|
| Landings Gads/Mads/Pmax de cada carrera (3 URLs c/u) | `/{carrera}/` única | El canal ahora viaja por UTM; `tracking.js` elige el formulario GHL correcto |
| Páginas de gracias (hasta 4 variantes por carrera) | `/gracias/{carrera}/` | Ahí se dispara `generate_lead` |
| `borrador-sonido-…` (borrador publicado por error) | `/sonido-distancia/` | |
| `gracias-encuentro-zoom`, `gracias-visita-presencial`, `gracias-…-beca` | `/eventos/` | Eran confirmaciones de bookings; el booking vive en GHL |
| `cartelera` | `/` | La página estaba funcionalmente vacía |
| `beca-agosto-2026`, bases del sorteo | `/beca/`, `/bases-sorteo-beca/` | La campaña se archiva con estado en `beca.json` |
| `resultados-encuesta` | **sin redirección, a propósito** | Era un informe interno publicado por error: debe devolver 404 |

## Al ejecutar la migración

1. Actualizar las **URLs finales de los anuncios** a las rutas nuevas con UTM (no depender de las redirecciones para siempre: son un puente).
2. Verificar en vivo las 46 redirecciones tras el cambio de DNS (`tools/` puede scriptearlo con `curl`).
3. Revisar Search Console a las 2 semanas: las URLs viejas deben ir desapareciendo del índice a favor de las nuevas.
