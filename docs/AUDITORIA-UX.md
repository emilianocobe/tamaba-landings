# Auditoría UX/UI, responsive, mobile y gamificación · TAMABA
**Versión 1.0 · agosto 2026 · método: análisis del export WXR completo (47 páginas, 74 árboles Elementor decodificados) + verificación del sitio nuevo en navegador. Cada ítem indica su estado en la reconstrucción.**

Leyenda: ✅ resuelto en el sitio nuevo · 🔧 resuelto a medias / requiere acción externa · 📋 recomendación a futuro

---

## 1 · UX de conversión

| # | Hallazgo en el sitio viejo | Estado nuevo |
|---|---------------------------|--------------|
| U1 | El CTA del header («Quiero saber más» → `#sabermas`) **no llevaba a ningún lado en 22 de 23 páginas** | ✅ Cada página declara su CTA y su destino; el build **falla** si un ancla no existe |
| U2 | Un formulario redirigía a una página inexistente (404 post-envío); otro agradecía por el curso equivocado | ✅ Gracias únicas por carrera generadas por build; 🔧 falta configurar la redirección en GHL |
| U3 | El mismo iframe de formulario aparecía dos veces por página con el mismo `id` (HTML inválido; el segundo no redimensionaba) | ✅ Un solo form por página, montado con ID único; la CTA final ancla hacia él |
| U4 | `data-height="undefined"` en 9 embeds → iframe sin altura hasta que el script resolvía | ✅ `min-height` explícita por CSS + resize de GHL |
| U5 | Jerarquía de información plana: 15+ bloques al mismo nivel, sin «ficha» de datos duros | ✅ Ficha bento (modalidad/duración/título/requisitos) inmediatamente después del form |
| U6 | Sin FAQ. Las 5 objeciones de la encuesta (precio 82 %, título oficial 86 %, modalidad, requisitos) no se respondían en página | ✅ FAQ por carrera con `<details>`, escritas desde los datos de la encuesta; cada apertura se mide |
| U7 | Sin CTA persistente en móvil: al scrollear, la única vía de conversión quedaba a 8 pantallas | ✅ Barra CTA fija en móvil (aparece tras el hero, se oculta cuando el form está en pantalla) |
| U8 | Página de gracias = callejón sin salida (dos botones y nada más) | ✅ Gracias con próximos pasos numerados, bookings de visita/Zoom, QRs a WhatsApp/Instagram |
| U9 | Restos de demo Envato visibles en páginas publicadas («Awesome People Behind Us», «William Lassiter, Founder», lorem ipsum) | ✅ Eliminados; no existe copy placeholder en el sitio nuevo |
| U10 | La home listaba 32 páginas autogeneradas, incluyendo borradores, gracias e informes internos | ✅ Home curada: 5 carreras + 3 cursos + test + eventos; nada se publica por accidente |

## 2 · UI / diseño visual

| # | Hallazgo | Estado nuevo |
|---|----------|--------------|
| V1 | Sin sistema: 19 versiones de Elementor conviviendo, tipografías y colores por página | ✅ Sistema de tokens único (`tokens.css`): paleta cerrada, 3 familias con rol, escala modular |
| V2 | El rojo de marca variaba (#C90526, #C8102E, #E30613 según la página) | ✅ Canonizado **#E30613** (medido del logo vectorial), con hover #C00511 |
| V3 | Sin jerarquía tipográfica: H6 antes que H2, títulos en 6 tamaños arbitrarios | ✅ Escala `clamp()` de 5 niveles; contraste display extremo (Bebas 8.5rem ↔ Barlow 17px) |
| V4 | Carruseles de 3–6 imágenes para mostrar UNA idea (peso + mareo) | ✅ Una imagen fuerte por concepto, WebP, lazy |
| V5 | Botones de 4 estilos distintos, algunos con texto en inglés («More team», «Learn more») | ✅ Dos variantes de botón (rojo/borde), todo el copy en es-AR |
| V6 | El mapa de Google a plena carga en todas las páginas | ✅ `loading="lazy"` + al final del documento |

## 3 · Responsive y mobile

| # | Hallazgo | Estado nuevo |
|---|----------|--------------|
| R1 | Columnas ocultas por breakpoint a mano (`hide_mobile` en 14 elementos; una galería oculta en TODOS los dispositivos) | ✅ Grillas fluidas; nada se «amputa» por dispositivo — se reordena |
| R2 | Héroes con alturas fijas → cortes con la barra de URL de Chrome Android | ✅ `min-height: 100svh` (par `vh`/`svh` del método) |
| R3 | Targets táctiles chicos (botones de texto de 14px) | ✅ Botones ≥48px de alto en `pointer: coarse` |
| R4 | Tipografías bajo 10px computados en móvil (etiquetas de Elementor en `em` de displays) | ✅ Pisos con `clamp()`; mínimo absoluto 12.8px |
| R5 | Hovers aplicados también en táctil (estados pegajosos) | ✅ Todo `:hover` vive bajo `@media (hover:hover) and (pointer:fine)` |
| R6 | Sin `prefers-reduced-motion` | ✅ Bloque nuclear: animaciones y transiciones a cero, reveals visibles |
| R7 | El formulario (iframe) con doble scroll en pantallas bajas | ✅ `min-height` 560px y sin contenedores con scroll propio |

## 4 · Rendimiento (afecta UX y costo por clic)

| # | Hallazgo | Estado nuevo |
|---|----------|--------------|
| P1 | 160 MB de imágenes originales; 53 de más de 1 MB; capturas de celular en PNG de 3 MB | ✅ Set curado de 29 imágenes: **12,1 MB → 1,65 MB** (−86 %), WebP, dimensionadas al uso |
| P2 | 5 plugins de addons de Elementor cargando assets (3 sin usar ni un widget) | ✅ Cero frameworks: CSS total ~24 KB, JS total ~9 KB, sin dependencias |
| P3 | Fuentes de Google por CDN, bloqueantes | ✅ Auto-alojadas (9 woff2, ~200 KB), `preload` de las 2 críticas, `font-display: swap` |
| P4 | YouTube embebido a plena carga (3 iframes de ~1 MB c/u) | ✅ Facade: miniatura + botón; el iframe se crea al clic (youtube-nocookie) |
| P5 | 60 `loading="lazy"` en todo el sitio | ✅ Lazy por defecto salvo el hero (`fetchpriority="high"`) |

## 5 · Accesibilidad

| # | Hallazgo | Estado nuevo |
|---|----------|--------------|
| A1 | 45 de 47 páginas sin H1; jerarquías invertidas (H6 antes de H2) | ✅ Un H1 por página, **verificado por el build** |
| A2 | 198 imágenes con `alt=""` | ✅ `alt` descriptivo obligatorio (build falla sin él); decorativas declaradas |
| A3 | 252 enlaces `_blank` sin `noopener` | ✅ Verificado por el build |
| A4 | Sin skip-link, sin foco visible consistente | ✅ Skip-link + `:focus-visible` global |
| A5 | Widgets solo-mouse | ✅ FAQ con `<details>` nativo, quiz operable por teclado, video con botón real |

## 6 · Gamificación e interacción (nuevas piezas)

Criterio aplicado (método Panni adaptado): **el presupuesto de motion decrece hacia el formulario**; cada pieza necesita argumento de conversión, no decoración.

| Pieza | Qué hace | Argumento |
|-------|----------|-----------|
| **Test vocacional exprés** (home) | 3 preguntas → recomienda carrera → CTA directa a su landing; emite `quiz_completado` con las respuestas | Convierte indecisos (la encuesta: 12 % «todavía no lo tengo claro») y captura intención declarada |
| **Barra de progreso de lectura** | Línea roja de 3px arriba | Mapa de ruta implícito en páginas largas |
| **Contadores animados** (30 años, fundación) | Animan una sola vez al entrar al viewport | La prueba de trayectoria es el activo #2 de la marca (86 % valora lo oficial) |
| **Reloj real de la sede + ABIERTO/CERRADO** | `Intl.DateTimeFormat` zona Buenos Aires, L–V 9–23 | Una institución con sede real ES un lugar; ancla confianza |
| **Marquesina del hero** («TÍTULO OFICIAL · 30 AÑOS · A-1441») | Cinta lenta, pausada con reduced-motion | Lenguaje clásico de venta; solo en hero, jamás en CTAs |
| **Cuenta regresiva** (campañas) | Días/horas restantes de la beca | Urgencia real (con fecha real, no fake scarcity) |
| **QRs en gracias** | WhatsApp e Instagram escaneables | Puente desktop→teléfono en el momento de mayor intención |
| **Revelado on-scroll + ruta numerada 01/02/03** | Sutil, una vez, con IO | Ritmo de lectura; los números solo donde hay secuencia real (pasos, certificaciones) |

**Descartado con argumento** (candidatos evaluados que NO entraron): cursor custom, WebGL/shaders, scroll horizontal pineado, loaders, transiciones de página decorativas, marquesina dentro de botones, tilt 3D de tarjetas — todos suman fricción o costo en Android de gama media sin mover conversión.

## 7 · Recomendaciones a futuro 📋

1. **Fotografía propia**: las imágenes actuales mezclan stock (heredado) con capturas reales. Una sesión en los estudios (alumnos reales, sede, docentes del staff que ya se nombran) subiría la autenticidad — la encuesta muestra un público que decide por lo académico: mostrarlo.
2. **Audio con argumento máximo**: TAMABA enseña sonido — un reproductor visible «Escuchá lo que se produce acá» (demos de alumnos, 60–90 s) sería la pieza de marca más difícil de copiar. Silenciado por defecto, control explícito.
3. **Testimonios**: no había ninguno en el sitio viejo. 2–3 egresados con nombre, foto y a qué se dedican (la encuesta: 51 % sueña con vivir de la música — mostrar a quienes lo lograron).
4. **Precio/beca above the fold**: la objeción #1 (82 %) es económica y el sitio no la toca hasta el FAQ. Evaluar un módulo «becas y formas de pago» permanente (no solo campañas).
5. **Microsoft Clarity** (gratis) vía GTM para mapas de calor cuando el contenedor exista.
