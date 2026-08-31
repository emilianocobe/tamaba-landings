/** Página de gracias: confirmación + próximos pasos + booking + QR.
 *  noindex. Acá se dispara el evento de conversión (tracking.js). */

export function gracias({ site, c }) {
  const p = '../../';
  return `
<section class="gracias">
  <div class="gracias-cuerpo">
    <p class="chip chip-rojo">Consulta enviada</p>
    <h1 class="gracias-titulo">¡Gracias!<br><em>Ya la recibimos.</em></h1>
    <p class="gracias-sub">Tu consulta por <strong>${c.nombre}</strong> llegó bien. Una persona del equipo de admisiones te va a escribir a la brevedad, por WhatsApp o por mail.</p>

    <ol class="ruta ruta-clara gracias-pasos">
      <li><span class="ruta-numero">01</span><span><strong>Revisá tu mail y tu WhatsApp.</strong> Te contactamos dentro del horario de atención — mirá también la carpeta de spam o promociones.</span></li>
      <li><span class="ruta-numero">02</span><span><strong>Mientras tanto, conocenos en persona u online.</strong> Agendá una visita guiada o un encuentro informativo con el botón de abajo.</span></li>
      <li><span class="ruta-numero">03</span><span><strong>Seguinos en redes</strong> para ver cómo se estudia en TAMABA todos los días.</span></li>
    </ol>

    <div class="gracias-ctas">
      <a class="boton boton-rojo boton-grande" href="${site.ghl.bookingBase}${site.ghl.bookings.visitaPresencial}" target="_blank" rel="noopener" data-tb="booking-visita">Agendar visita presencial</a>
      <a class="boton boton-borde-oscuro boton-grande" href="${site.ghl.bookingBase}${site.ghl.bookings.encuentroOnline}" target="_blank" rel="noopener" data-tb="booking-online">Encuentro informativo online</a>
    </div>

    <div class="gracias-qrs">
      <figure>
        <img src="${p}assets/qr/qr-whatsapp.svg" alt="Código QR para abrir una conversación de WhatsApp con TAMABA" width="140" height="140" loading="lazy">
        <figcaption>¿Estás en la compu? Escaneá y escribinos por WhatsApp.</figcaption>
      </figure>
      <figure>
        <img src="${p}assets/qr/qr-instagram.svg" alt="Código QR del Instagram de TAMABA" width="140" height="140" loading="lazy">
        <figcaption>Seguinos en Instagram: @terciariotamaba</figcaption>
      </figure>
    </div>

    <p class="gracias-volver"><a href="${p}${c.slug}/">← Volver a ${c.nombreCorto}</a> · <a href="${p}">Ver todas las carreras</a></p>
  </div>
</section>`;
}
