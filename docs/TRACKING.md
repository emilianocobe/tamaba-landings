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

## 3 · Mapa de etiquetas a crear en GTM (checklist de implementación)

1. **Crear contenedor GTM** → copiar el ID a `data/site.json → tracking.gtmId` (hoy `GTM-XXXXXXX`; el script no inyecta nada hasta que haya un ID real).
2. **GA4**: etiqueta de configuración + eventos `generate_lead`, `cta_click`, `form_visible`, `quiz_completado` como eventos clave.
3. **Google Ads**: conversión «Lead» disparada por `generate_lead`, con `carrera` como variable de conversión. Importar también la conversión desde GA4 como respaldo. Activar **Enhanced Conversions** (GHL puede enviar email/teléfono hasheados vía su integración nativa con Google Ads — configurarlo en GHL).
4. **Meta Píxel + API de Conversiones**: `Lead` en `generate_lead`. La CAPI conviene resolverla **desde GoHighLevel** (integración nativa con Meta), que tiene el dato del contacto; el píxel del sitio queda como señal de navegador.
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
