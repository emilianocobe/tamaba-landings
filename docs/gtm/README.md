# Contenedor de Google Tag Manager · TAMABA

`contenedor-tamaba.json` trae la configuración completa de medición lista para importar en **GTM-KTLTXJZ**: 9 etiquetas, 5 activadores y 12 variables.

Se genera con `node tools/generar-contenedor-gtm.mjs` (lee los IDs de `data/site.json`, así que si cambian los IDs se regenera y listo).

---

## Antes de importar: completar dos datos

El archivo tiene dos marcadores que hay que reemplazar, porque son datos que solo están en Google Ads y en Meta:

| Marcador en el JSON | Dónde conseguirlo |
|---------------------|-------------------|
| `PEGAR_ETIQUETA_DE_CONVERSION` | **Google Ads** → Objetivos → Conversiones → abrir la acción «Cliente potencial» → *Configurar con Google Tag Manager*. Ahí muestra el **ID de conversión** (ya está: 11075909129) y la **etiqueta de conversión** (una cadena tipo `AbC-D_efG-hIjKlMnOp`). |
| `PEGAR_ID_DEL_PIXEL` | **Meta Business** → Administrador de Eventos → tu píxel → el número de ~15 dígitos que aparece bajo el nombre. |

Podés reemplazarlos de dos formas:
- **Antes de importar**: abrí el JSON con cualquier editor, buscá el marcador y pegá el valor.
- **Después de importar**: en GTM, editando la etiqueta `Google Ads - Conversion Cliente potencial` y la variable `CONST - Meta Pixel ID`. (El píxel está centralizado en esa variable: se cambia en un solo lugar y aplica a las dos etiquetas de Meta.)

Si preferís, cargá el ID del píxel en `data/site.json → tracking.metaPixelId` y volvé a correr el generador: queda dentro del JSON.

---

## Cómo importar

1. GTM → contenedor **GTM-KTLTXJZ** → **Administración** → **Importar contenedor**.
2. Elegir el archivo `contenedor-tamaba.json`.
3. Espacio de trabajo: **Existente** (o uno nuevo si preferís aislarlo).
4. Opción de importación: **Combinar** → **Renombrar conflictos**.
   > *Combinar* respeta lo que ya tengas configurado. **No usar «Sobrescribir»**: borraría el resto del contenedor.
5. GTM muestra una **vista previa de los cambios** (qué se agrega, qué se modifica). Revisala.
6. **Confirmar**.
7. Probar con **Vista previa** (Preview) antes de publicar: entrá a una landing, completá un formulario y verificá que en `/gracias/…` se disparen `GA4 - generate_lead`, `Google Ads - Conversion` y `Meta Pixel - Lead`.
8. **Publicar**.

---

## Qué queda configurado

### Etiquetas

| Etiqueta | Se dispara en | Qué hace |
|----------|---------------|----------|
| `Google tag - GA4` | Todas las páginas | Base de GA4 (`G-LCTZBVD2L6`) |
| `Conversion Linker` | Todas las páginas | Persiste el `gclid` para atribuir conversiones de Ads |
| `GA4 - generate_lead (Cliente potencial)` | `/gracias/…` | **La conversión.** Manda carrera, canal, UTMs, valor y `event_id` |
| `Google Ads - Conversion Cliente potencial` | `/gracias/…` | Conversión a `AW-11075909129`, con `event_id` como `orderId` (evita duplicados) |
| `Meta Pixel - Lead (Cliente potencial)` | `/gracias/…` | Evento **`Lead`** — en la interfaz en español, «Cliente potencial» |
| `Meta Pixel - Base` | Todas las páginas | `PageView` del píxel |
| `GA4 - form_visible` | Cuando el formulario entra en pantalla | Mide cuántos llegan a ver el form |
| `GA4 - cta_click` | Clic en cualquier CTA | WhatsApp, teléfono, mail, bookings |
| `GA4 - quiz_completado` | Fin del test vocacional | Con la carrera recomendada |

### La deduplicación (importante)

La etiqueta de Meta manda `eventID: {{DLV - event_id}}`. **Si además enviás el evento por la API de Conversiones con ese mismo `event_id`, Meta une los dos y no cuenta doble.** Es lo que sube la calidad de coincidencia.

El token de la API de Conversiones **no va en GTM ni en el sitio** (es una credencial secreta y quedaría expuesta): va del lado del servidor. Lo más simple es cargarlo en **GoHighLevel**, que tiene integración nativa con Meta CAPI y ya tiene email y teléfono del contacto para hashear.

---

## Después de importar: marcar la conversión en GA4

GTM manda el evento, pero GA4 necesita saber que es una conversión:

**GA4 → Administrar → Eventos clave → Marcar `generate_lead` como evento clave.**

Y en Google Ads, si querés importar la conversión desde GA4 como respaldo: Objetivos → Conversiones → Importar → Google Analytics 4.
