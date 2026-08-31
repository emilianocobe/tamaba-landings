# Playbook · Lo que un sitio de landings de adquisición necesita y no se estaba teniendo en cuenta
**Versión 1.0 · agosto 2026. Cada ítem: qué es, por qué importa, estado en este proyecto.**

Leyenda: ✅ resuelto acá · 🔧 preparado, requiere acción del equipo · 📋 pendiente de decisión

---

## A · Medición (sin esto, todo lo demás es opinión)

1. **Conversión medible de punta a punta** (clic → lead → inscripto). El sitio viejo no medía nada; la puja optimizaba a ciegas. 🔧 Arquitectura lista (`generate_lead` + dataLayer); falta crear el contenedor GTM y las redirecciones GHL. *Ver TRACKING.md.*
2. **Conversiones offline**: el lead no es el negocio — el inscripto sí. GHL puede devolver a Google/Meta qué leads se inscribieron. 🔧 Integración nativa a activar.
3. **Persistencia de atribución** (primer/último toque). ✅
4. **Micro-conversiones** (WhatsApp, teléfono, bookings, quiz): señales para optimizar antes de tener volumen de leads. ✅
5. **Nomenclatura UTM documentada y obligatoria**: `utm_source=google|facebook`, `utm_medium=cpc|paid_social`, `utm_campaign={carrera}-{objetivo}-{mes}`. 📋 Falta adoptarla en las campañas al migrar.

## B · Velocidad y entrega

6. **Presupuesto de peso por página**: cada segundo de carga móvil cuesta conversión y sube el CPC efectivo. ✅ ~250 KB por landing (HTML+CSS+JS+fuentes) antes de imágenes; imágenes −86 %.
7. **El form debe existir aunque falle el JS**: `<noscript>` con el iframe del canal por defecto. ✅
8. **Caché y CDN**: GitHub Pages sirve con CDN global. ✅ (Cuando haya dominio propio: activar HTTPS forzado en la config de Pages.)
9. **Imágenes al tamaño de uso, no al de origen**: pipeline de optimización documentado (Pillow → WebP). ✅ Regla: ninguna imagen nueva entra sin pasar por él.

## C · Confianza (el multiplicador silencioso)

10. **Señales institucionales arriba**: A-1441, «título oficial del Ministerio», 30 años — el dato que el 86 % pondera no puede estar al fondo. ✅
11. **Política de privacidad + consentimiento**: se piden datos personales; la Ley 25.326 aplica; los formularios GHL ya incluyen casilla de consentimiento de marketing. ✅ Página `/privacidad/` enlazada desde pie y formularios. 🔧 Enlazarla también DENTRO de cada form GHL (se edita en GHL).
12. **Prueba social con nombre y apellido**: egresados reales, prensa, alianzas (AES, AVID, Berklee vía IASJ ya se mencionan). 📋 Falta recolectar testimonios.
13. **Coherencia anuncio↔landing** (message match): el titular de la landing debe repetir la promesa del ad. 📋 Regla editorial a adoptar; el generador permite crear variantes por campaña en minutos si hace falta.

## D · Operación de campañas

14. **Campañas con fecha de vencimiento automatizada**: la beca vencida siguió captando 17 días. ✅ `beca.json` con `activa`/`fechaFin`; la página cerrada captura interesados para la próxima edición (lista de espera = activo, no vergüenza).
15. **Variantes de landing baratas**: para probar ángulos («precio» vs «título oficial» vs «tecnología») sin duplicar mantenimiento. ✅ Un JSON nuevo = una landing nueva.
16. **Páginas de gracias como activo**: son el momento de mayor intención. ✅ Bookings + QRs + próximos pasos; cada gracias es medible por carrera.
17. **Inventario vivo de formularios**: qué form GHL corresponde a qué carrera×canal, en un solo lugar versionado. ✅ `data/carreras/*.json`.
18. **Respuesta al lead en minutos, no días**: la probabilidad de contacto cae ~10× después de la primera hora. 📋 Configurar en GHL: auto-respuesta por WhatsApp/mail inmediata + SLA interno de llamada.

## E · Contenido y oferta

19. **Responder la objeción #1 en la página**: el precio frena al 82 % y el sitio nunca lo mencionaba. ✅ FAQ «¿Qué incluye la cuota?» en cada carrera; 📋 decidir política pública de aranceles/becas.
20. **Segundo CTA de menor compromiso**: no todos están listos para «inscribirme» — la visita/encuentro es el puente (y la fuga actual: 38 % de asistencia). ✅ `/eventos/` + CTA alternativa en cada cierre.
21. **Captura de indecisos**: test vocacional que recomienda carrera y registra la intención. ✅
22. **SEO defensivo**: las landings de pago no deben canibalizarse ni indexar basura. ✅ Canonical en todas; `noindex` en gracias/legales/campañas cerradas; sitemap solo con páginas de valor; robots.txt bloqueando `/gracias/`.

## F · Continuidad técnica

23. **El sitio debe poder reconstruirse desde el repo en un comando** — el WXR viejo no alcanzaba para reconstruir nada (menús, kits, snippets y leads quedaban fuera). ✅ `node build.mjs` reproduce todo; el contenido está versionado en git.
24. **Verificación automática pre-deploy**: las 7 clases de bugs del sitio viejo (anclas rotas, H1 ausentes, alt vacíos, http://, etc.) rompen el build en CI. ✅
25. **Backups del CRM**: los leads viven en GHL, no en el sitio. 📋 Export mensual programado desde GHL.
26. **Dominio**: decidir si `landing.tamaba.edu.ar` apunta a Pages (CNAME) o si se usa otro subdominio; mantener redirecciones 301 de las URLs viejas (`/gads-*`, `/mads-*`, `/pmax-*`) hacia las nuevas. 📋 **Crítico al migrar: sin las 301, los ads activos caen en 404.** Mapa de redirecciones en `docs/REDIRECTS.md`.
