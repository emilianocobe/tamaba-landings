/** Eventos: visita presencial + encuentro online (bookings de GHL como enlaces). */

export function eventos({ site }) {
  const p = '../';
  return `
<section class="hero hero-compacto">
  <div class="hero-fondo" aria-hidden="true"><img src="${p}assets/img/sede-tamaba.webp" alt="" fetchpriority="high"></div>
  <div class="hero-cuerpo">
    <p class="chip chip-rojo">Vamos a conocernos</p>
    <h1 class="hero-titulo">Tu primera experiencia<br><em>con TAMABA</em></h1>
    <p class="hero-sub">Antes de decidir dónde estudiar, vení a ver cómo se estudia acá. Elegí el formato que te quede más cómodo — los dos son gratuitos.</p>
  </div>
</section>

<section class="seccion">
  <div class="opciones-evento" id="agenda">
    <article class="opcion-evento revela">
      <span class="chip chip-rojo">Presencial · CABA</span>
      <h2>Visita guiada</h2>
      <p>Recorré el instituto y los estudios de grabación, y conversá con nuestro equipo. Vas a ver las aulas, el equipamiento y cómo es un día de cursada.</p>
      <ul class="beneficios beneficios-oscuros">
        <li>Recorrida completa por los estudios</li>
        <li>Charla con el equipo de admisiones</li>
        <li>Adolfo Alsina 1994, a metros del Congreso</li>
      </ul>
      <a class="boton boton-rojo boton-grande" href="${site.ghl.bookingBase}${site.ghl.bookings.visitaPresencial}" target="_blank" rel="noopener" data-tb="booking-visita">Agendar visita presencial</a>
    </article>
    <article class="opcion-evento revela">
      <span class="chip chip-rojo">Online · en vivo</span>
      <h2>Encuentro informativo</h2>
      <p>Sumate a un encuentro por videollamada: te contamos el plan de estudios, los aranceles y el sistema de becas, y respondemos todas tus preguntas en vivo.</p>
      <ul class="beneficios beneficios-oscuros">
        <li>Ideal si estás lejos de Buenos Aires</li>
        <li>Aranceles, becas y plan de estudios, sin vueltas</li>
        <li>Preguntas y respuestas en vivo</li>
      </ul>
      <a class="boton boton-rojo boton-grande" href="${site.ghl.bookingBase}${site.ghl.bookings.encuentroOnline}" target="_blank" rel="noopener" data-tb="booking-online">Reservar mi lugar online</a>
    </article>
  </div>
</section>

<section class="franja-confianza" aria-label="TAMABA en números">
  <div class="dato-numero"><strong class="contador" data-hasta="30">30</strong><span>años de trayectoria</span></div>
  <div class="dato-numero"><strong>A-1441</strong><span>instituto oficial</span></div>
  <div class="dato-numero"><strong>Gratis</strong><span>las dos opciones</span></div>
  <div class="dato-numero"><strong>${site.fundacion}</strong><span>año de fundación</span></div>
</section>

<section class="cierre">
  <h2 class="cierre-titulo">¿Preferís escribirnos<br>directamente?</h2>
  <p class="cierre-sub">Contanos qué carrera te interesa y te respondemos con toda la información.</p>
  <a class="boton boton-rojo boton-grande" href="https://wa.me/${site.whatsappHref}?text=${encodeURIComponent('Hola, quiero información sobre las carreras de TAMABA')}" target="_blank" rel="noopener" data-tb="whatsapp-eventos">Escribinos por WhatsApp</a>
</section>`;
}
