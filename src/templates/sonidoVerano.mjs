const esc = texto => String(texto).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');

function whatsapp(site, mensaje, texto, etiqueta, clase = 'boton-rojo') {
  const href = `https://wa.me/${site.whatsappHref}?text=${encodeURIComponent(mensaje)}`;
  return `<a class="boton ${clase}" href="${href}" target="_blank" rel="noopener noreferrer" data-tb="${etiqueta}">${esc(texto)}</a>`;
}

export function sonidoVerano({ site, curso, dim }) {
  return `<article class="verano">
  <section class="verano-hero" aria-labelledby="verano-titulo">
    <div class="verano-hero-interior">
      <div class="verano-intro">
        <p class="etiqueta verano-edicion">${esc(curso.edicion)}</p>
        <h1 id="verano-titulo">${esc(curso.titulo[0])} <br><em>${esc(curso.titulo[1])}</em></h1>
        <p class="verano-bajada">${esc(curso.bajada)}</p>
        <dl class="verano-fecha">
          <div><dt>Inicio</dt><dd><time datetime="${esc(curso.inicio)}">${esc(curso.fecha)}</time></dd></div>
          <div><dt>Cursada</dt><dd>${esc(curso.dias)}</dd></div>
        </dl>
        <div class="verano-acciones">
          <a class="boton boton-rojo" href="#modalidades" data-tb="verano-horarios">Ver sedes y horarios</a>
          <a class="verano-enlace" href="#temario" data-tb="verano-temario">Ver temario</a>
        </div>
        <p class="verano-estado">${esc(curso.estado)}.</p>
      </div>
      <div class="verano-visual">
        <img src="../assets/${esc(curso.imagen)}" alt="${esc(curso.imagenAlt)}" ${dim(curso.imagen)} fetchpriority="high">
      </div>
    </div>
  </section>

  <section class="verano-seccion verano-claro" id="modalidades" aria-labelledby="verano-modalidades">
    <div class="verano-ancho">
      <h2 id="verano-modalidades">Sedes y horarios</h2>
      <p class="verano-lead">${esc(curso.dias)}. ${esc(curso.zonaHoraria)}</p>
      <div class="verano-modalidades">
        ${curso.modalidades.map(modo => `<article class="verano-modalidad">
          <h3>${esc(modo.nombre)}</h3>
          <p>${esc(modo.bajada)}</p>
          <dl class="verano-turnos">
            ${modo.turnos.map(turno => `<div><dt>${esc(turno.nombre)}</dt><dd>${esc(turno.horario)}</dd></div>`).join('')}
          </dl>
          <div class="verano-acciones">
            ${modo.contactos.map(canal => whatsapp(site, `Hola, quiero información sobre el ${curso.nombre}, modalidad ${canal.modo}.`, canal.texto, `verano-whatsapp-${canal.id}`)).join('')}
          </div>
        </article>`).join('')}
      </div>
    </div>
  </section>

  <section class="verano-seccion" id="temario" aria-labelledby="verano-temario">
    <div class="verano-ancho verano-temario">
      <div>
        <h2 id="verano-temario">Qué vas a aprender</h2>
        <p class="verano-lead">${esc(curso.publico)}</p>
      </div>
      <ul class="verano-contenidos">
        ${curso.temario.map(tema => `<li>${esc(tema)}</li>`).join('')}
      </ul>
    </div>
  </section>

  <section class="verano-seccion verano-claro" aria-label="Materiales y certificaciones">
    <div class="verano-ancho verano-recursos">
      <div>
        <h2>Materiales y práctica</h2>
        <ul class="verano-lista">${curso.materiales.map(item => `<li>${esc(item)}</li>`).join('')}</ul>
      </div>
      <div>
        <h2>Tres certificaciones</h2>
        <ul class="verano-certificados">
          ${curso.certificados.map(cert => `<li><strong>${esc(cert.nombre)}</strong><span>${esc(cert.detalle)}</span></li>`).join('')}
        </ul>
      </div>
    </div>
  </section>

  <section class="verano-seccion verano-cierre" id="inscripcion" aria-labelledby="verano-contacto">
    <div class="verano-ancho">
      <h2 id="verano-contacto">Consultá por tu inscripción</h2>
      <p class="verano-lead">Admisiones te orienta sobre los cupos, los turnos y cómo anotarte.</p>
      <div class="verano-acciones">
        ${whatsapp(site, curso.contacto, 'Escribinos por WhatsApp', 'verano-whatsapp-general')}
        <a class="verano-enlace" href="mailto:${esc(site.emails.admisiones)}?subject=${encodeURIComponent(curso.nombre)}" data-tb="verano-mail">Escribinos por mail</a>
      </div>
    </div>
  </section>
</article>`;
}
