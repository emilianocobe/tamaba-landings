# Plan de tracking de adquisición de leads · TAMABA
**Versión 1.0 · agosto 2026 · insumos: export WXR del sitio viejo (auditado), formularios GoHighLevel existentes, encuesta Beca Agosto 2026 (161 respondentes)**

---

## 1 · Diagnóstico del sistema actual

El sitio viejo trackeaba el canal **por URL**: cada carrera existía tres veces (`/gads-…`, `/mads-…`, `/pmax-…`), cada copia con su propio formulario de GoHighLevel. Problemas medidos en la auditoría:

| # | Problema | Evidencia | Costo |
|---|----------|-----------|-------|
| 1 | **Cero etiquetas de medición en el sitio.** Ni GTM, ni GA4, ni etiqueta de conversión de Ads, ni píxel de Meta en ninguna de las 47 páginas exportadas. | 0 ocurrencias de `gtag`, `dataLayer`, `GTM-`, `AW-`, `fbq` en 6,58 MB | Si tampoco están vía WPCode, **las campañas nunca midieron conversiones**: la puja de Google/Meta optimizó a ciegas |
| 2 | **15 URLs para 5 productos.** Triplica el mantenimiento, divide el historial de calidad de página de los ads, produce contenido duplicado y errores de sincronización (páginas Mads/Pmax con copy desactualizado respecto de Gads). | Matriz de páginas de la auditoría | Cada cambio de copy = 3 ediciones; QS de Ads diluido |
| 3 | **La conversión real ocurre dentro de un iframe de GHL**, invisible para analytics del sitio: no hay evento de envío, ni página de gracias consistente que lo señale. | 17 iframes `api.leadconnectorhq.com/widget/form/` | No se puede atribuir lead → campaña → keyword |
| 4 | **11 páginas de gracias duplicadas y 14 huérfanas**, varias sin conexión con ningún formulario. | Auditoría CNV-05 | El destino post-envío (donde se dispara la conversión) es incierto |
| 5 | **UTMs no persistidos**: si el usuario navegaba de la landing a otra página y volvía, la atribución se perdía. | Sin JS de captura en el export | Leads «(direct)» que en realidad son de pago |
| 6 | **Sin medición de micro-conversiones**: clics a WhatsApp, teléfono, bookings de visita/Zoom — todos invisibles. | — | El embudo intermedio (el que la encuesta señala como la fuga: solo 38 % asiste al evento) no se medía |

## 2 · Arquitectura nueva (implementada en `src/js/tracking.js`)

### 2.1 Una URL por carrera, canal por UTM
- `/{carrera}/?utm_source=google&utm_medium=cpc&utm_campaign=…` reemplaza a `/gads-{carrera}`.
- `tracking.js` resuelve el canal (`gads` | `mads` | `pmax`) desde `utm_source`/`utm_campaign`/`gclid`/`fbclid` (mapa configurable en `data/site.json → tracking.canales`). **Sin señales de pago, el canal se reporta como `directo`** — nunca se inventa atribución de pago; en ese caso el formulario embebido es el de Gads (hay que mostrar alguno) pero sin UTMs inyectados.
- **Los 15 formularios GHL existentes se preservan**: cada carrera lleva sus tres IDs (`ghlForms.gads/mads/pmax`) y el script monta el iframe del canal correcto. Los pipelines y automatizaciones de GHL siguen intactos; el día que quieran unificar a un formulario por carrera, es borrar dos claves del JSON.

### 2.2 Persistencia de atribución (primer y último toque)
- Se capturan `utm_source/medium/campaign/term/content`, `gclid`, `fbclid`, `wbraid`, `gbraid`.
- Se guardan en `localStorage` como **primer toque** (solo si no existía) y **último toque** (siempre). Un usuario que vuelve mañana en directo conserva su campaña de origen.

### 2.3 UTMs propagados al iframe de GHL
- El iframe se monta con los UTMs en la query string. **GoHighLevel captura los parámetros UTM del src del iframe y los asocia al contacto** → cada lead entra al CRM con su campaña, término y clid. Esta es la pieza que une el clic del ad con el contacto en el pipeline.

### 2.4 Capa de eventos (dataLayer → GTM)
Eventos tipados que ya emite el sitio, listos para enrutar desde un único contenedor GTM:

| Evento | Cuándo | Parámetros |
|--------|--------|-----------|
| `page_view_landing` | Cada carga | `canal_pago`, `carrera`, `utm_source`, `utm_campaign` |
| `form_cargado` | El iframe GHL se monta | `form_id`, `canal_pago` |
| `form_visible` | ≥40 % del form en pantalla | `form_id`, `canal_pago` |
| `cta_click` | Enlaces y botones con `data-tb` | `elemento`, `tipo` (whatsapp/telefono/email/booking), `carrera`, `canal_pago` |
| `scroll_depth` | 25/50/75/100 % | `profundidad`, `canal_pago` |
| `faq_abierta` | Se abre una pregunta | `faq_pregunta` |
| `video_play` | Play del video | `video_id` |
| `quiz_completado` | Test vocacional | `quiz_q1..q3`, `quiz_resultado` |
| **`generate_lead`** | **Carga de `/gracias/{carrera}/`** — deduplicado por sesión (recargas y botón «atrás» no cuentan dos veces) | `carrera`, `canal_pago`, `utm_source`, `utm_campaign` |

### 2.5 La conversión: `/gracias/{carrera}/`
- **Una** página de gracias por carrera (plantilla única), `noindex`, que dispara `generate_lead`.
- **Acción requerida en GHL**: configurar la redirección post-envío de cada formulario hacia `https://{dominio}/gracias/{carrera}/`. Es un campo por formulario en el editor de GHL.

## 2.6 · IDs configurados (agosto 2026)

| Servicio | ID | Dónde vive |
|----------|----|-----------|
| Google Tag Manager | **GTM-KTLTXJZ** | Cargado en el `<head>` de todas las páginas + `<noscript>` |
| Google Analytics 4 | **G-LCTZBVD2L6** | Se dispara **desde GTM** |
| Google Ads | **AW-11075909129** | Se dispara **desde GTM** |
| Meta Pixel | *(pendiente el ID numérico)* | Preferentemente desde GTM; el sitio soporta carga directa si se completa `metaPixelId` en `site.json` |

> **El token de la API de Conversiones de Meta NO va en el sitio.** Es una credencial secreta: si se pone en el navegador queda expuesta a cualquiera (y este repo es público). Va del lado del servidor — lo natural acá es cargarlo en **GoHighLevel** (que tiene integración nativa con Meta CAPI y ya tiene los datos del contacto) o en un endpoint propio del back-end (ver `CRM-BACKEND.md`).

## 2.7 · El evento de conversión: «Cliente potencial» / Lead

En las páginas `/gracias/{carrera}/` se dispara, una sola vez por sesión:

| Plataforma | Nombre del evento | Notas |
|-----------|-------------------|-------|
| GA4 / Google Ads | `generate_lead` | Con `carrera`, `carrera_nombre`, `canal_pago`, `utm_*`, `value: 1`, `currency: ARS` |
| Meta | **`Lead`** | La interfaz en español lo muestra como **«Cliente potencial»**. Se envía con `content_name` (la carrera), `content_category`, `content_type`, `value` y `currency` |
| dataLayer (espejo) | `Lead` | Por si preferís enrutar en GTM por ese nombre |

**Deduplicación navegador ↔ servidor:** cada conversión genera un `event_id` único que viaja tanto en el `dataLayer` como en el `eventID` del pixel. Si además enviás el evento por la API de Conversiones con **ese mismo `event_id`**, Meta une ambos y no cuenta doble. Es la razón por la que el `event_id` existe.

## 3 · Mapa de etiquetas a crear en GTM (checklist de implementación)

El contenedor **GTM-KTLTXJZ** ya está instalado en el sitio y recibiendo el `dataLayer`. Falta crear dentro de GTM estas etiquetas (todo se configura en GTM, no hace falta tocar el sitio):

1. **Variables de capa de datos** (Variables → Nueva → Variable de capa de datos), una por cada uno: `carrera`, `carrera_nombre`, `canal_pago`, `utm_source`, `utm_campaign`, `event_id`, `elemento`, `tipo`, `profundidad`.
2. **Activadores** (Activadores → Nuevo → Evento personalizado), con el nombre exacto del evento: `generate_lead`, `form_visible`, `cta_click`, `quiz_completado`, `scroll_depth`.
3. **GA4 — Configuración**: etiqueta «Google Tag» con ID `G-LCTZBVD2L6`, activador *Todas las páginas*.
4. **GA4 — Evento de conversión**: etiqueta «Evento de GA4», nombre `generate_lead`, con los parámetros `carrera`, `canal_pago`, `utm_source`, `utm_campaign`, `value`, `currency`; activador: evento personalizado `generate_lead`. Después marcarlo como **evento clave** en GA4.
5. **Google Ads — Conversión**: etiqueta «Conversión de Google Ads» con ID `AW-11075909129` y la etiqueta de conversión de «Cliente potencial»; activador: `generate_lead`. Activar **Conversiones mejoradas** (los datos hasheados los puede aportar GHL).
6. **Meta Pixel**: etiqueta HTML personalizada con el `fbq('init', <ID>)` en *Todas las páginas*, y otra con `fbq('track','Lead', {...}, {eventID: {{event_id}}})` en el activador `generate_lead`. **Usar la variable `event_id`** para que deduplique contra la API de Conversiones.
7. **Consent Mode v2** en GTM (deja el sitio listo para tráfico internacional; el hero mismo dice «desde cualquier lugar del mundo»).
5. **Conversiones secundarias (micro)**: `cta_click` con `tipo=whatsapp|booking|telefono` como conversiones «blandas» en Ads (observación, no puja) — son el proxy del evento informativo, la fuga #1 según la encuesta.
6. **Consent Mode v2** en GTM (región AR no lo exige aún, pero deja el sitio listo para campañas internacionales — hay estudiantes de «cualquier lugar del mundo» según el propio hero).

## 4 · Lo que hay que decidir/hacer del lado de GoHighLevel

| Acción | Por qué |
|--------|---------|
| Redirigir cada form a `/gracias/{carrera}/` | Sin esto no hay evento `generate_lead` medible |
| Verificar que el mapeo de campos UTM esté activo en cada formulario | Para que el contacto entre con atribución |
| Crear formularios para Curso de Sonido, Mediciones Acústicas y Pro Tools | Hoy esas páginas capturan por WhatsApp/mail (los forms viejos eran de Elementor y murieron con WordPress) |
| Conectar GHL ↔ Google Ads y GHL ↔ Meta (integraciones nativas) | Conversiones offline: cuando un lead pasa a «inscripto» en el pipeline, GHL lo reporta al canal → la puja aprende de inscripciones reales, no solo de formularios |
| Etiquetar la fuente en el pipeline usando el UTM capturado, no el nombre del formulario | El nombre del form deja de codificar el canal |

## 5 · Métricas del embudo (tablero mínimo)

Del clic a la inscripción, con la fuga que la encuesta ya identificó (38 % de asistencia al evento):

```
impresión → clic → page_view_landing → form_visible → [envío GHL] → generate_lead
   → cta_click(booking) → asistencia al evento (GHL) → inscripto (GHL, offline conversion)
```

KPIs: costo por lead por carrera y canal · tasa `form_visible`/`page_view` (¿el form se ve?) · tasa `generate_lead`/`form_visible` (¿el form convierte?) · tasa booking/lead (¿pasan al evento?) · CPA final por inscripto (con conversiones offline).

## 6 · Qué NO se implementó y por qué

- **Server-side tagging (sGTM)**: recomendable a futuro (mejor calidad de dato post-ITP), pero requiere infraestructura paga; el volumen actual no lo justifica. Documentado para revisión al superar ~5.000 visitas/mes.
- **A/B testing formal**: sin herramienta gratuita decente post-Optimize. La alternativa práctica: duplicar una landing con otro slug y dividir tráfico desde Ads (el generador hace que crear variantes cueste un JSON).
- **Heatmaps (Clarity/Hotjar)**: Microsoft Clarity es gratis y compatible — agregarlo vía GTM cuando el contenedor exista, no antes.
