# Brandbook · TAMABA Landings
**Versión 1.0 · agosto 2026 · fuentes de verdad, en orden de autoridad: logos oficiales (carpeta «9. Logos»), sede física, copy real del sitio, encuesta de perfil de estudiante (161 casos).**

---

## 1 · La marca en una frase

**TAMABA es el terciario oficial de sonido y música: 30 años, título del Ministerio, estudios propios.** No es una academia de hobby ni un curso online: es una institución (A-1441) donde se estudia para vivir de esto. Todo lo visual debe transmitir ese doble carácter: **institución seria + mundo del estudio de grabación**.

### Voz
- **Rioplatense y directa**: voseo siempre («Completá», «Conocé», «Estudiá»). Nada de «tú».
- **Datos antes que adjetivos**: «título oficial válido en Sudamérica, Panamá, México, Italia y España» le gana a «excelencia educativa».
- **Sin instrucciones de interfaz** («hacé clic», «scrolleá»): los CTAs dicen qué se obtiene («Quiero más información»), no cómo operar la página.
- Términos que se escriben SIEMPRE igual: **TAMABA** (mayúsculas), **A-1441**, **30 años**, **Técnico Superior en Sonido y Producción Musical** (título oficial completo), **Adolfo Alsina 1994, CABA, Argentina** (la forma completa, porque el público a distancia es internacional; en contexto local puede omitirse «Argentina»).
- **Validez internacional de los títulos**: el sitio heredado enuncia listas de países distintas según el título (Sonido: «Sudamérica, Panamá, México, Italia y España»; Músico/Cantante agrega «El Salvador»). Se conservan tal cual hasta que Secretaría Académica confirme la lista real de cada título — **pendiente de verificación institucional**; al confirmarse, unificar redacción y orden en `data/carreras/*.json`.

## 2 · Logo

| Versión | Archivo | Uso |
|---------|---------|-----|
| **Institucional** (paralelogramo rojo, «TERCIARIO TamaBa A-1441» calado en blanco) | `logo-tamaba-rojo.png` | Pie de página, papelería, avatar |
| Wordmark blanco / negro (con TERCIARIO y A-1441) | `logo-tamaba-blanco.png` / `-negro.png` | Header sobre fondo oscuro / claro |
| Wordmark simple (solo «TamaBa») | `logo-tamaba-{blanco,negro}-simple.png` | Espacios reducidos |
| Sello 30 años | `logo-30-{rojo,blanco,negro}.png` | Acompañamiento, nunca reemplaza al principal |

**Reglas**: no recomponer el logo con tipografía del sistema; no estirar; no recolorear fuera de la paleta; zona de respeto = altura de la «T». **Pendiente recomendado**: vectorizar el wordmark a SVG (existe el PSD `AES TAMABA NEW LOGO 2021.psd` como fuente) — hoy se usa PNG con transparencia.

**Favicon**: `favicon.svg` — paralelogramo rojo con la T calada, derivado del logo institucional.

## 3 · Color

Paleta **cerrada y enumerada** (`src/css/tokens.css`). Prohibido cualquier color fuera de esta lista.

### Marca
| Token | Hex | Rol |
|-------|-----|-----|
| `--rojo` | **#E30613** | El rojo TAMABA (medido del logo vectorial). Botones primarios, acentos sobre claro |
| `--rojo-hover` | #C00511 | Hover de botones |
| `--rojo-profundo` | #8E040D | Degradados, sombras del rojo |
| `--rojo-neon` | #FF2B36 | Acento sobre fondos muy oscuros (el #E30613 pierde luminancia sobre negro) |

### Grises (sesgo cálido — cabina de estudio, no gris de sistema)
| Token | Hex | Rol |
|-------|-----|-----|
| `--negro` | #0D0C0C | Fondo del sitio |
| `--carbon` | #161514 | Superficies (tarjetas, paneles oscuros) |
| `--humo` | #201E1D | Superficie elevada |
| `--grafito` | #2C2A28 | Chips neutros |
| `--ceniza` | #8B8580 | Texto terciario sobre oscuro (5.4:1 sobre negro, AA) |
| `--niebla` | #A9A4A0 | Texto secundario sobre oscuro |
| `--hueso` | #F5F2EF | **Panel claro** (zonas de conversión) y texto principal sobre oscuro |
| `--blanco` | #FFFFFF | Tarjetas sobre panel claro, texto de botones rojos |

### La regla de los dos mundos
El sitio es **oscuro por defecto** (el mundo del estudio). Las secciones **claras** (`--hueso`) señalan una cosa: *acá se decide* — el formulario, los datos duros del plan, las FAQ. La inversión de tema es semántica, no decorativa. **El bloque del formulario no lleva ningún efecto**: fondo claro, estático, cero motion.

Contrastes verificados: hueso sobre negro 15.9:1 · blanco sobre rojo 4.8:1 · niebla sobre negro 9.4:1 (todos AA o mejor; el cuerpo de texto, AAA).

## 4 · Tipografía

Tres familias, auto-alojadas (woff2, `src/assets/fonts/`), con rol nombrado:

| Rol | Familia | Uso | Reglas |
|-----|---------|-----|--------|
| **Display** (`--f-display`) | **Bebas Neue** | H1/H2, cifras gigantes, códigos de módulo | Nunca bajo 26px. Mayúsculas naturales. El `<em>` interior va en rojo o en contorno (`-webkit-text-stroke`) |
| **Cuerpo** (`--f-cuerpo`) | **Barlow** (400–800) | Todo el texto corrido, botones, formularios | 17px base, línea 1.65, máximo ~68ch |
| **Dato** (`--f-dato`) | **Barlow Condensed** (500–600) | Etiquetas, eyebrows, metadatos, reloj | SIEMPRE mayúsculas + letter-spacing 0.14em. Nunca sobre 15px |

**El contraste tipográfico es la firma**: titulares Bebas de hasta 8.5rem contra etiquetas condensadas de 12px. Escala: `--t-xs` 12.8 · `--t-sm` 14.4 · base 17 · `--t-md` 20 · `--t-lg` 26 · `--t-xl` clamp(30–42) · `--t-2xl` clamp(42–70) · `--t-hero` clamp(54–136).

Patrón de titular de sección: dos líneas, la segunda en rojo/contorno:
> TÍTULO OFICIAL.
> **CUATRO CAMINOS.**

## 5 · Componentes canónicos

- **Chip** (`chip-rojo`): eyebrow del hero — estado o campaña («Inscripción abierta»).
- **Franja de confianza**: 4 celdas con cifra Bebas + etiqueta condensed (30 años · A-1441 · fundación · modalidad). Contadores animan una sola vez.
- **Panel de conversión**: grid claro texto/form; a la izquierda el pitch y el título oficial subrayado en rojo; a la derecha el form GHL. Es el único componente con prohibición total de motion.
- **Ficha bento**: 6 datos duros con ícono de línea (stroke 1.8, `currentColor` rojo).
- **Ruta numerada**: pasos con numeral Bebas rojo (01/02/03) — solo para secuencias reales.
- **Checklist de beneficios**: tilde roja (clip-path), 2 columnas → 1 en móvil.
- **Cita**: borde izquierdo rojo 4px, Bebas mayúsculas — para afirmaciones de marca, no para testimonios.
- **Tarjeta de carrera**: foto con `grayscale(0.5) brightness(0.75)` que recupera color al hover (solo pointer fino).
- **Botones**: `boton-rojo` (primario, único por vista si es posible) y `boton-borde` (secundario). Texto = resultado esperado.

## 6 · Fotografía

- **Tratamiento hero**: `grayscale(0.35) brightness(0.42)` + gradiente a negro hacia abajo — la foto es atmósfera, el titular es protagonista.
- **Preferencia absoluta por lo propio**: estudios de TAMABA, alumnos reales, la sede. El stock heredado (parejas en estudio, cantantes genéricos) se tolera como transición y se reemplaza en cuanto haya sesión propia.
- Formato: WebP, ancho máximo según uso (hero 1920, bloques 1100–1400, logos de alianzas 560).

## 7 · Motion

Presupuesto **decreciente hacia la conversión** (contrato, no sugerencia):
1. **Hero**: marquesina lenta (36s), contadores, revelado sutil. Máximo permitido.
2. **Secciones de argumento**: revelado on-scroll (18px, una vez), hover de tarjetas. Poco.
3. **Panel de formulario y gracias**: **nada**. Ni entrada animada, ni parallax, ni grano.

`prefers-reduced-motion: reduce` desactiva TODO (bloque nuclear en CSS + guard `RM` en JS). Duraciones: micro 160ms · corta 320ms · media 640ms, curva `cubic-bezier(0.22,1,0.36,1)`.

## 8 · Los números de la marca (para copy y diseño)

De la encuesta 2026 (161 respondentes) — cada pieza nueva debería apoyarse en al menos uno:
- **86 %** valora el título oficial → el título va arriba, siempre.
- **82 %** no elige por costo → hablar de becas y formas de pago sin que pregunten.
- **78 %** viene a desarrollar una carrera profesional → tono profesionalizante, no lúdico.
- **63 %** quiere cursar virtual → la modalidad a distancia es el motor de volumen.
- **38 %** asiste al evento → cada página empuja a la visita/encuentro como segundo CTA.
- Oído ecléctico (pop/rock/jazz/folklore reparten parejo) → referentes variados, nunca un solo género.
