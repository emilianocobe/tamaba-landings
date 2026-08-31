# TAMABA · Landings

Sitio de landing pages de adquisición de leads del **Instituto Terciario TAMABA** (A-1441, 30 años), reconstruido desde cero como sitio estático. Reemplaza al WordPress + Elementor de `landing.tamaba.edu.ar`.

**Stack:** HTML/CSS/JS generados por un script de Node **sin dependencias** (`build.mjs`). Sin frameworks, sin `npm install`, deploy automático a GitHub Pages.

## Uso

```bash
node build.mjs           # genera el sitio completo en dist/
node build.mjs --check   # build + verificaciones (enlaces, anclas, h1, alt, noopener, https)
```

Para verlo local: cualquier servidor estático sobre `dist/` (ej. `python -m http.server 8749 --directory dist`).

## Estructura

```
data/
  site.json              ← datos globales: contacto, redes, GHL, tracking
  carreras/*.json        ← una carrera/curso por archivo (todo el copy vive acá)
  campanias/beca.json    ← campaña de becas (activa: true/false controla el cierre)
src/
  templates/*.mjs        ← plantillas (funciones JS que devuelven HTML)
  css/                   ← tokens.css → base.css → components.css (en ese orden)
  js/                    ← main.js (interacción) · tracking.js (medición + GHL)
  assets/                ← logos, imágenes WebP, fuentes auto-alojadas, QR
docs/                    ← brandbook, plan de tracking, auditorías, playbook
build.mjs                ← generador + verificador
.github/workflows/       ← build y deploy a Pages en cada push a main
```

## Decisiones clave

1. **Una página por carrera** — se eliminó la triplicación Gads/Mads/Pmax. El canal se resuelve por UTM en `tracking.js`, que elige el formulario de GoHighLevel correcto (los tres IDs viven en el JSON de cada carrera) y le propaga los UTMs al iframe. Los pipelines de GHL existentes siguen funcionando sin tocar nada.
2. **Un solo formulario por página** (`#inscripcion`), creado dinámicamente con ID único — se acabaron los iframes duplicados con el mismo `id`.
3. **El copy vive en `data/`**, no en las plantillas: cambiar un texto o una fecha es editar un JSON, y el build lo replica donde corresponda.
4. **`build.mjs --check` corre en CI**: enlaces rotos, anclas sin destino, H1 duplicados o ausentes, imágenes sin `alt`, `_blank` sin `noopener` y URLs `http://` **rompen el build**. Las siete clases de bugs que tenía el sitio viejo no pueden volver a entrar.
5. **Campañas con fecha**: `beca.json` tiene `activa` y `fechaFin`. Al cerrar la campaña se cambia un booleano y la página pasa a estado «cerrado» con captura de interesados para la próxima edición.

## Pendientes al publicar (ver docs/TRACKING.md)

- [ ] Reemplazar `GTM-XXXXXXX` en `data/site.json` por el contenedor real de Google Tag Manager.
- [ ] Crear formularios GHL para Curso de Sonido, Mediciones Acústicas y Pro Tools (hoy usan contacto directo por WhatsApp/mail); al crearlos, cargar los IDs en `ghlForms` del JSON correspondiente.
- [ ] Configurar la redirección post-envío de cada formulario GHL hacia `/gracias/<carrera>/`.
- [ ] Configurar el dominio (CNAME) en GitHub Pages y actualizar `dominio` en `site.json` si cambia.
