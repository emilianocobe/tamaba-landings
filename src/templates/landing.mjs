/** Plantilla de landing de carrera/curso. Una sola página por carrera:
 *  el canal (gads/mads/pmax) se resuelve por UTM en tracking.js.
 *  Un solo formulario por página (#inscripcion) — la CTA final vuelve a él. */

const FICHA_ICONOS = {
  modalidad: 'M4 6h16M4 12h16M4 18h10',
  duracion: 'M12 6v6l4 2M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z',
  certificados: 'M9 12l2 2 4-4M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z',
  titulo: 'M22 10L12 5 2 10l10 5 10-5zM6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5',
  requisitos: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 2h6v4H9zM9 12l2 2 4-4',
  cursada: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z'
};
const FICHA_ETIQUETAS = {
  modalidad: 'Modalidad', duracion: 'Duración', certificados: 'Certificaciones',
  titulo: 'Título', requisitos: 'Requisitos', cursada: 'Cursada'
};

function icono(d) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
}

export function landing({ site, c }) {
  const p = '../';
  const esCarrera = c.tipo === 'carrera';

  return `
<!-- ══ HERO ══ -->
<section class="hero">
  <div class="hero-fondo" aria-hidden="true">
    <img src="${p}assets/img/${c.heroImg}.webp" alt="" fetchpriority="high">
  </div>
  <div class="hero-cuerpo">
    <p class="chip chip-rojo">${c.eyebrow}</p>
    <h1 class="hero-titulo">${c.heroTitulo}</h1>
    <p class="hero-sub">${c.heroSub}</p>
    <div class="hero-ctas">
      <a class="boton boton-rojo boton-grande" href="#inscripcion" data-tb="cta-hero">Quiero más información</a>
      <a class="boton boton-borde" href="#detalle" data-tb="cta-hero-secundario">Conocer ${esCarrera ? 'la carrera' : c.tipo === 'taller' ? 'el taller' : 'el curso'}</a>
    </div>
  </div>
  <div class="hero-cinta" aria-hidden="true">
    <div class="cinta-pista">${'<span>TÍTULO OFICIAL</span><span>·</span><span>30 AÑOS</span><span>·</span><span>A-1441</span><span>·</span><span>ESTUDIOS PROPIOS</span><span>·</span>'.repeat(4)}</div>
  </div>
</section>

<!-- ══ CONFIANZA ══ -->
<section class="franja-confianza" aria-label="TAMABA en números">
  <div class="dato-numero"><strong class="contador" data-hasta="30">30</strong><span>años de trayectoria</span></div>
  <div class="dato-numero"><strong>A-1441</strong><span>instituto oficial</span></div>
  <div class="dato-numero"><strong class="contador" data-hasta="${site.fundacion}" data-desde="1990">${site.fundacion}</strong><span>año de fundación</span></div>
  <div class="dato-numero"><strong>${esCarrera ? 'Terciario' : 'Certificado'}</strong><span>${esCarrera ? 'título oficial' : 'con respaldo oficial'}</span></div>
</section>

<!-- ══ FORMULARIO (panel claro · cero motion) ══ -->
<section class="panel-conversion" id="inscripcion">
  <div class="conversion-texto">
    <h2 class="titulo-display">${c.formTitulo}</h2>
    <p class="conversion-sub">${c.formSub}</p>
    <p class="conversion-nota">${c.formNota}</p>
    <p class="conversion-titulo-oficial">${c.tituloOficial}</p>
  </div>
  <div class="conversion-form">
${c.ghlForms ? `    <div class="ghl-form" id="ghl-form" data-gads="${c.ghlForms.gads}" data-mads="${c.ghlForms.mads}" data-pmax="${c.ghlForms.pmax}" data-nombre="${c.ghlFormNombre}">
      <noscript>
        <iframe src="${site.ghl.formBase}${c.ghlForms.gads}" title="Formulario de consulta — ${c.ghlFormNombre}" loading="eager"></iframe>
      </noscript>
    </div>` : `    <div class="contacto-directo">
      <p class="contacto-directo-titulo">Escribinos y te contamos todo:</p>
      <a class="boton boton-rojo boton-grande" href="https://wa.me/${site.telefonoHref.replace('+', '')}?text=${encodeURIComponent('Hola, quiero información sobre ' + c.nombre)}" target="_blank" rel="noopener" data-tb="whatsapp-form">Consultar por WhatsApp</a>
      <a class="boton boton-borde-oscuro" href="mailto:${site.emails.info}?subject=${encodeURIComponent('Consulta: ' + c.nombre)}" data-tb="mail-form">Escribir por mail</a>
      <p class="contacto-directo-nota">También podés llamarnos al <a href="tel:${site.telefonoHref}">${site.telefono}</a>.</p>
    </div>`}
  </div>
</section>

<div id="detalle"></div>
${c.pilares ? `
<!-- ══ PILARES ══ -->
<section class="seccion">
  <p class="etiqueta">Por qué esta carrera</p>
  <h2 class="titulo-display">Pensada para que llegues<br><em>a trabajar de esto</em></h2>
  <div class="pilares">
${c.pilares.map(pi => `    <article class="pilar revela"><h3>${pi.titulo}</h3><p>${pi.texto}</p></article>`).join('\n')}
  </div>
</section>` : ''}

<!-- ══ FICHA ══ -->
<section class="seccion">
  <p class="etiqueta">La ficha</p>
  <h2 class="titulo-display">Datos concretos,<br><em>sin letra chica</em></h2>
  <div class="ficha">
${Object.entries(c.ficha).map(([k, v]) => `    <div class="ficha-dato revela">${icono(FICHA_ICONOS[k] || FICHA_ICONOS.modalidad)}<span class="ficha-etiqueta">${FICHA_ETIQUETAS[k] || k}</span><span class="ficha-valor">${v}</span></div>`).join('\n')}
  </div>
</section>
${c.planPractico ? `
<!-- ══ PLAN PRÁCTICO ══ -->
<section class="seccion seccion-clara">
  <p class="etiqueta">${c.planPractico.titulo}</p>
  <h2 class="titulo-display">${c.planPractico.sub}</h2>
  <ol class="ruta">
${c.planPractico.items.map((it, i) => `    <li class="revela"><span class="ruta-numero">${String(i + 1).padStart(2, '0')}</span><span>${it}</span></li>`).join('\n')}
  </ol>
</section>` : ''}
${c.planAreas ? `
<!-- ══ PLAN POR ÁREAS ══ -->
<section class="seccion seccion-clara">
  <p class="etiqueta">El plan de estudios</p>
  <h2 class="titulo-display">Cuatro áreas,<br><em>una formación completa</em></h2>
  <div class="areas">
${c.planAreas.map(a => `    <article class="area revela"><h3>${a.area}</h3><p>${a.materias}</p></article>`).join('\n')}
  </div>
</section>` : ''}
${c.temario ? `
<!-- ══ TEMARIO ══ -->
<section class="seccion seccion-clara">
  <p class="etiqueta">${c.temario.titulo}</p>
  <h2 class="titulo-display">Qué vas a aprender</h2>
  <div class="temario">
    <div class="revela"><h3>Temas destacados</h3><p>${c.temario.temas}</p></div>
    <div class="revela"><h3>A quién está orientado</h3><p>${c.temario.orientado}</p></div>
  </div>
</section>` : ''}
${c.modulos ? `
<!-- ══ MÓDULOS (Pro Tools) ══ -->
<section class="seccion seccion-clara">
  <p class="etiqueta">La certificación</p>
  <h2 class="titulo-display">Dos cursos,<br><em>una credencial oficial</em></h2>
  <div class="modulos">
${c.modulos.map(m => `    <article class="modulo revela">
      <span class="modulo-codigo">${m.codigo}</span>
      <h3>${m.nombre}</h3>
      <p>${m.texto}</p>
      <p class="modulo-meta"><strong>Para quién:</strong> ${m.publico}</p>
      <p class="modulo-meta"><strong>Formato:</strong> ${m.detalle}</p>
    </article>`).join('\n')}
  </div>
  <p class="nota-destacada">${c.notaCertificacion}</p>
</section>` : ''}
${c.certificaciones ? `
<!-- ══ TRIPLE CERTIFICACIÓN ══ -->
<section class="seccion">
  <p class="etiqueta">Certificados oficiales</p>
  <h2 class="titulo-display">Triple<br><em>certificación</em></h2>
  <ol class="ruta ruta-oscura">
${c.certificaciones.map((cert, i) => `    <li class="revela"><span class="ruta-numero">${String(i + 1).padStart(2, '0')}</span><span>${cert}</span></li>`).join('\n')}
  </ol>
</section>` : ''}
${c.tecnologia ? `
<!-- ══ TECNOLOGÍA ══ -->
<section class="seccion">
  <p class="etiqueta">Herramientas de estudio</p>
  <h2 class="titulo-display">Máxima tecnología<br><em>de apoyo al aprendizaje</em></h2>
  <div class="alternadas">
${c.tecnologia.map((t, i) => `    <article class="alternada revela${i % 2 ? ' alternada-inversa' : ''}">
      <figure><img src="${p}assets/img/${t.img}.webp" alt="${t.alt}" loading="lazy" width="1100" height="620"></figure>
      <div class="alternada-texto"><h3>${t.titulo}</h3><p>${t.texto}</p></div>
    </article>`).join('\n')}
  </div>
</section>` : ''}
${c.practicas ? `
<!-- ══ PRÁCTICAS ══ -->
<section class="seccion seccion-clara">
  <p class="etiqueta">${c.practicas.eyebrow}</p>
  <h2 class="titulo-display">${c.practicas.titulo}</h2>
  <div class="practicas">
    <figure class="revela"><img src="${p}assets/img/${c.practicas.img}.webp" alt="${c.practicas.imgAlt}" loading="lazy" width="1400" height="1000"></figure>
    <div class="practicas-texto revela">
      <p>${c.practicas.texto}</p>
      <blockquote class="cita"><p>${c.practicas.destacado}</p></blockquote>
      <p>${c.practicas.textoDestacado}</p>
    </div>
    <figure class="revela practicas-img2"><img src="${p}assets/img/${c.practicas.img2}.webp" alt="${c.practicas.img2Alt}" loading="lazy" width="1200" height="675"></figure>
  </div>
</section>` : ''}
${c.convenios ? `
<!-- ══ CONVENIOS ══ -->
<section class="seccion">
  <p class="etiqueta">${c.convenios.titulo}</p>
  <h2 class="titulo-display">Una red que llega<br><em>hasta Berklee</em></h2>
  <p class="parrafo-ancho">${c.convenios.texto}</p>
  <blockquote class="cita cita-oscura"><p>${c.convenios.profesores}</p></blockquote>
</section>` : ''}
${c.beneficios ? `
<!-- ══ BENEFICIOS ══ -->
<section class="seccion seccion-clara">
  <p class="etiqueta">Estudiar en TAMABA</p>
  <h2 class="titulo-display">Todo lo que incluye,<br><em>punto por punto</em></h2>
  <ul class="beneficios">
${c.beneficios.map(b => `    <li class="revela">${b}</li>`).join('\n')}
  </ul>
${c.notaBeneficios ? `  <p class="nota-al-pie">${c.notaBeneficios}</p>` : ''}
</section>` : ''}
${c.video ? `
<!-- ══ VIDEO ══ -->
<section class="seccion">
  <p class="etiqueta">Conocé el instituto</p>
  <h2 class="titulo-display">Mirá TAMABA<br><em>por dentro</em></h2>
  <div class="video-marco revela">
    <button class="video-tapa" data-video="${c.video}" aria-label="Reproducir video institucional de TAMABA">
      <img src="https://i.ytimg.com/vi/${c.video}/hqdefault.jpg" alt="" loading="lazy" width="480" height="360">
      <span class="video-play" aria-hidden="true">▶</span>
    </button>
    <noscript><p><a href="https://www.youtube.com/watch?v=${c.video}" target="_blank" rel="noopener">Ver el video en YouTube</a></p></noscript>
  </div>
</section>` : ''}
${c.faq ? `
<!-- ══ FAQ ══ -->
<section class="seccion seccion-clara" id="preguntas">
  <p class="etiqueta">Preguntas frecuentes</p>
  <h2 class="titulo-display">Lo que todos preguntan<br><em>antes de decidir</em></h2>
  <div class="faq">
${c.faq.map(f => `    <details class="faq-item" data-tb-faq="${f.p.replaceAll('"', '&quot;')}"><summary>${f.p}</summary><p>${f.r}</p></details>`).join('\n')}
  </div>
</section>` : ''}

<!-- ══ CTA FINAL ══ -->
<section class="cierre">
  <h2 class="cierre-titulo">Tu carrera empieza<br>con una consulta</h2>
  <p class="cierre-sub">Sin compromiso. Te contamos aranceles, horarios y cómo inscribirte.</p>
  <a class="boton boton-rojo boton-grande" href="#inscripcion" data-tb="cta-final">Quiero más información</a>
  <p class="cierre-alternativa">¿Preferís verlo con tus propios ojos? <a href="${p}eventos/">Agendá una visita o un encuentro online</a>.</p>
</section>

<!-- ══ MAPA ══ -->
<section class="seccion-mapa">
  <div class="mapa-datos">
    <h2 class="titulo-display">Estamos en<br><em>el centro de CABA</em></h2>
    <address>
      ${site.direccion}<br>
      <a href="tel:${site.telefonoHref}" data-tb="tel">${site.telefono}</a><br>
      <a href="mailto:${site.emails.info}" data-tb="mail">${site.emails.info}</a>
    </address>
    <p class="mapa-estado" id="estado-sede" hidden></p>
  </div>
  <iframe class="mapa" src="https://maps.google.com/maps?q=${site.mapaQuery}&z=16&output=embed" title="Mapa: sede de TAMABA en Adolfo Alsina 1994, CABA" loading="lazy"></iframe>
</section>`;
}
