/** Gracias de RESERVA (post-booking de GHL): visita presencial / encuentro online.
 *  Distinta de gracias.mjs, que confirma una consulta por formulario.
 *  Acá la conversión es "agendó un evento" — la fuga #1 del embudo. */

export function graciasEvento({ site, ev }) {
  const p = '../../';
  return `
<section class="gracias">
  <div class="gracias-cuerpo">
    <p class="chip chip-rojo">${ev.chip}</p>
    <h1 class="gracias-titulo">${ev.hero}</h1>
    <p class="gracias-sub">${ev.sub}</p>

    <ol class="ruta ruta-clara gracias-pasos">
${ev.pasos.map((s, i) => `      <li><span class="ruta-numero">${String(i + 1).padStart(2, '0')}</span><span><strong>${s.t}.</strong> ${s.d}</span></li>`).join('\n')}
    </ol>

    <figure class="gracias-imagen">
      <img src="${p}assets/img/${ev.img}.webp" alt="${ev.imgAlt}" loading="lazy" width="1280" height="720">
    </figure>

    <div class="gracias-ctas">
      <a class="boton boton-rojo boton-grande" href="https://wa.me/${site.whatsappHref}?text=${encodeURIComponent('Hola, agendé un encuentro con TAMABA y quiero hacer una consulta')}" target="_blank" rel="noopener" data-tb="whatsapp-gracias-evento">Tengo una pregunta</a>
      <a class="boton boton-borde-oscuro boton-grande" href="${p}" data-tb="ver-carreras-gracias-evento">Ver las carreras</a>
    </div>

    <div class="gracias-qrs">
      <figure>
        <img src="${p}assets/qr/qr-whatsapp.svg" alt="Código QR para escribirle a TAMABA por WhatsApp" width="140" height="140" loading="lazy">
        <figcaption>¿Estás en la compu? Escaneá y guardá nuestro WhatsApp.</figcaption>
      </figure>
      <figure>
        <img src="${p}assets/qr/qr-instagram.svg" alt="Código QR del Instagram de TAMABA" width="140" height="140" loading="lazy">
        <figcaption>Seguinos en Instagram: @terciariotamaba</figcaption>
      </figure>
    </div>
${ev.conMapa ? `
    <div class="gracias-mapa">
      <h2 class="pie-titulo">Cómo llegar</h2>
      <address>${site.direccion}<br><a href="tel:${site.telefonoHref}" data-tb="tel">${site.telefono}</a></address>
      <iframe class="mapa" src="https://maps.google.com/maps?q=${site.mapaQuery}&z=16&output=embed" title="Mapa: sede de TAMABA en Adolfo Alsina 1994, CABA" loading="lazy"></iframe>
    </div>` : ''}
  </div>
</section>`;
}
