/** 4.º Seminario Internacional de Industria de la Música (19 al 22 de octubre de 2026).
 *  Cuatro masterclasses por Zoom, cada una con su propio calendario de reserva en GoHighLevel.
 *  Fecha, hora (19:00 GMT-3) y duración (1 h) verificadas en los cuatro calendarios el 29/9/2026.
 *  Las reservas se miden como cta_click tipo «booking» (tracking.js); no hay formulario propio. */

import { onda, sello30 } from './partes.mjs';

const RESERVA = 'https://api.leadconnectorhq.com/widget/booking/';

export const MASTERCLASSES = [
  {
    dia: 1, fecha: 'Lunes 19 de octubre', corta: '19/10', reserva: 'PnAUtmUoasvR2eJRsfcN',
    titulo: 'Negocios de la música, ¿cómo nos preparamos?',
    panel: [
      ['Jorge Rocha', 'Director de Academia Dacapo', 'México'],
      ['Miguel Menescau', 'Director de Mousike La Laguna', 'España'],
      ['Andrés Suárez', 'Director de la Escuela Superior de Música de Costa Rica', 'Costa Rica'],
      ['Gabriel Mourelos', 'Director de TAMABA', 'Argentina'],
    ],
  },
  {
    dia: 2, fecha: 'Martes 20 de octubre', corta: '20/10', reserva: 'U674f6ERX2NwoGZ8RA7X',
    titulo: 'Sellos independientes: pasado, presente y… futuro',
    nombre: 'Víctor Ponieman', pais: 'Argentina', foto: 'seminario-ponieman',
    bio: 'En sus 50 años de trayectoria fue directivo de CAPIF y presidente de la Cámara de Discográficas Independientes, y dirigió estudios de grabación, sellos discográficos, distribuidoras y productoras de espectáculos.',
  },
  {
    dia: 3, fecha: 'Miércoles 21 de octubre', corta: '21/10', reserva: 'ACoWme5goN17nQttp2d3',
    titulo: 'Marketing in music business. New releases: challenges and opportunities',
    nombre: 'Ananya Khanna', pais: 'India', foto: 'seminario-khanna',
    bio: 'Licenciada en Economía, con un MBA en MDI Gurgaon. Directora de Marketing y Producto en la plataforma Songdew, donde trabaja en la intersección entre la música, la tecnología y los negocios.',
  },
  {
    dia: 4, fecha: 'Jueves 22 de octubre', corta: '22/10', reserva: '1fHurwWnWDdvmu2rsddM',
    titulo: 'Los 3 errores más caros en music business',
    nombre: 'Juan Alberto Mata', pais: 'Perú', foto: 'seminario-mata',
    bio: 'Fundador de AdMusic Consulting y autor del libro «Music Business sin maquillaje». Experto en derechos de autor para música en publicidad, profesor de music business y miembro del Consejo Consultivo de la Carrera de Música de la UPC.',
  },
];

const PAISES = 'MÉXICO · ESPAÑA · COSTA RICA · ARGENTINA · INDIA · PERÚ';

function tarjeta(m, p, dim) {
  const orador = m.panel
    ? `<ul class="mc-panel">${m.panel.map(([n, cargo, pais]) =>
        `<li><strong>${n}</strong><span>${cargo} · ${pais}</span></li>`).join('')}</ul>`
    : `<div class="mc-orador">
        <img src="${p}assets/img/${m.foto}.webp" alt="${m.nombre}" loading="lazy" ${dim(`img/${m.foto}.webp`)}>
        <div><p class="mc-nombre">${m.nombre} <span>${m.pais}</span></p><p class="mc-bio">${m.bio}</p></div>
      </div>`;
  return `
    <article class="mc revela" id="dia-${m.dia}">
      <p class="mc-cuando"><span class="mc-dia">Día ${m.dia}</span> ${m.fecha} · 19 h</p>
      <h3 class="mc-titulo">«${m.titulo}»</h3>
      ${orador}
      <div class="mc-pie">
        <a class="boton boton-rojo" href="${RESERVA}${m.reserva}" target="_blank" rel="noopener" data-tb="seminario-dia-${m.dia}"
          aria-label="Reservar mi lugar en la masterclass del día ${m.dia}, ${m.fecha.toLowerCase()}">Reservar mi lugar</a>
        <span class="mc-nota">Gratis · cupo limitado</span>
      </div>
    </article>`;
}

export function seminario({ site, dim }) {
  const p = '../';
  return `
<!-- ══ HERO ══ -->
<section class="hero hero-seminario">
  <div class="hero-cuerpo sem-hero">
    <div class="sem-hero-texto">
      <p class="chip chip-rojo">19 al 22 de octubre · Vía Zoom</p>
      <h1 class="hero-titulo">4.º Seminario Internacional de <em>Industria de la Música</em></h1>
      <p class="hero-sub">Cuatro masterclasses con referentes de México, España, Costa Rica, Argentina, India y Perú. Todas a las 19 h (Argentina), en vivo por Zoom. Gratis y abierto a todo público.</p>
      <div class="hero-ctas">
        <a class="boton boton-rojo boton-grande" href="#agenda" data-tb="cta-hero">Elegir masterclass</a>
        <a class="boton boton-borde" href="#como-participar" data-tb="cta-hero-secundario">Cómo participar</a>
      </div>
    </div>
    <figure class="sem-hero-afiche">
      <img src="${p}assets/img/seminario-portada.webp" alt="Afiche del 4.º Seminario Internacional de Industria de la Música: 19, 20, 21 y 22 de octubre de 2026, vía Zoom, 19 h" fetchpriority="high" ${dim('img/seminario-portada.webp')}>
    </figure>
  </div>
  <div class="hero-cinta" aria-hidden="true">
    <div class="cinta-pista">${`<span>${PAISES}</span><span>·</span>`.repeat(4)}</div>
  </div>
</section>

<!-- ══ EN NÚMEROS ══ -->
<section class="franja-confianza" aria-label="El seminario en números">
  <div class="dato-numero"><strong>4</strong><span>masterclasses</span></div>
  <div class="dato-numero"><strong>6</strong><span>países</span></div>
  <div class="dato-numero"><strong>19 h</strong><span>hora de Argentina</span></div>
  <div class="dato-numero"><strong>Gratis</strong><span>con reserva previa</span></div>
</section>

<!-- ══ AGENDA ══ -->
<section class="seccion" id="agenda">
  <p class="etiqueta">La agenda</p>
  <h2 class="titulo-display">Cuatro noches,<br><em>cuatro miradas</em></h2>
  <p class="parrafo-ancho">Cada masterclass se reserva por separado: anotate en las que quieras, o en las cuatro.</p>
  <div class="mcs">
${MASTERCLASSES.map(m => tarjeta(m, p, dim)).join('\n')}
  </div>
</section>

<!-- ══ CÓMO PARTICIPAR ══ -->
<section class="seccion seccion-clara" id="como-participar">
  <p class="etiqueta">Cómo participar</p>
  <h2 class="titulo-display">Tres pasos<br><em>y estás adentro</em></h2>
  <ol class="ruta ruta-clara">
    <li class="revela"><span class="ruta-numero">01</span><span><strong>Elegí la masterclass y reservá tu lugar.</strong> Cada día tiene su propio botón de reserva y el cupo es limitado.</span></li>
    <li class="revela"><span class="ruta-numero">02</span><span><strong>Revisá tu mail.</strong> Te llega la confirmación con el acceso a Zoom. Si no la ves, mirá en spam o promociones.</span></li>
    <li class="revela"><span class="ruta-numero">03</span><span><strong>Conectate a las 19 h de Argentina.</strong> Cada encuentro dura alrededor de una hora.</span></li>
  </ol>
  <div class="sem-horarios revela">
    <p class="etiqueta">Si estás en otro país</p>
    <p>19 h en Argentina, Uruguay y Chile · 17 h en Perú y Colombia · 16 h en México y Costa Rica.</p>
  </div>
</section>

${onda()}

<!-- ══ CIERRE ══ -->
<section class="cierre">
  <h2 class="cierre-titulo">La industria de la música,<br>contada por quienes la hacen</h2>
  <p class="cierre-sub">Del 19 al 22 de octubre, a las 19 h (Argentina), por Zoom.</p>
  <a class="boton boton-rojo boton-grande" href="#agenda" data-tb="cta-final">Elegir masterclass</a>
  <p class="cierre-alternativa">¿Tenés alguna duda? <a href="https://wa.me/${site.whatsappHref}?text=${encodeURIComponent('Hola, tengo una consulta sobre el Seminario Internacional de Industria de la Música')}" target="_blank" rel="noopener" data-tb="whatsapp-cierre">Escribinos por WhatsApp</a>.</p>
  ${sello30(p, dim)}
</section>`;
}
