/** Gracias del simulador de equivalencias: resultado + invitación a los encuentros.
 *  noindex. Acá se dispara la conversión (tracking.js, slug simulador-de-equivalencias).
 *
 *  El resultado lo deja el simulador en sessionStorage bajo la clave
 *  `tb_simulacion`, con esta forma:
 *    { carreraNombre, institucionNombre, instrumento, tipo: 'equivalencia' | 'saberes_previos',
 *      acreditadas:   [{ materia, origen: [..], condicion }],
 *      saberesPrevios:[{ materia }] }
 *  Sin simulación guardada (visita directa, otra pestaña) el bloque no se muestra
 *  y la página queda como un gracias común. Nada viaja por la URL. */

import { sello30 } from './partes.mjs';

export function graciasSimulador({ site, dim }) {
  const p = '../../';
  return `
<section class="gracias">
  <div class="gracias-cuerpo">
    <p class="chip chip-rojo">Simulación lista</p>
    <h1 class="gracias-titulo">¡Listo!<br><em>Tu carrera no empieza de cero.</em></h1>
    <p class="gracias-sub" id="sim-sub">Recibimos tus datos. Una persona del equipo de admisiones te va a escribir por WhatsApp para revisar tu caso materia por materia.</p>

    <div class="sim-resultado" id="sim-resultado" hidden>
      <div class="sim-bloque" id="sim-acreditadas" hidden>
        <h2 class="sim-titulo">Materias que se acreditan</h2>
        <ul class="sim-lista"></ul>
      </div>
      <div class="sim-bloque" id="sim-previos" hidden>
        <h2 class="sim-titulo">Materias que podés rendir como saberes previos</h2>
        <p class="sim-nota" id="sim-previos-nota"></p>
        <ul class="sim-lista"></ul>
      </div>
      <p class="sim-aviso">Es una simulación. La confirmamos cuando revisemos tu certificado de materias aprobadas.</p>
    </div>

    <ol class="ruta ruta-clara gracias-pasos">
      <li><span class="ruta-numero">01</span><span><strong>Te escribimos por WhatsApp.</strong> Admisiones revisa tu caso y te dice qué tenés que presentar. Mirá también tu mail, y la carpeta de spam o promociones.</span></li>
      <li><span class="ruta-numero">02</span><span><strong>Vení a un encuentro y lo vemos juntos.</strong> En el encuentro grupal online o en una visita al instituto repasamos tu simulación, te contamos cómo sigue la cursada y te informamos los valores, que dependen de las materias que te queden.</span></li>
      <li><span class="ruta-numero">03</span><span><strong>Tené a mano tu certificado de materias aprobadas.</strong> Es lo único que necesitamos para confirmar las equivalencias.</span></li>
    </ol>

    <div class="gracias-ctas">
      <a class="boton boton-rojo boton-grande" href="${site.ghl.bookingBase}${site.ghl.bookings.encuentroOnline}" target="_blank" rel="noopener" data-tb="booking-online">Anotarme al encuentro grupal online</a>
      <a class="boton boton-borde-oscuro boton-grande" href="${site.ghl.bookingBase}${site.ghl.bookings.visitaPresencial}" target="_blank" rel="noopener" data-tb="booking-visita">Agendar visita presencial</a>
    </div>
    <p class="sim-cuando">Encuentro grupal por Zoom: todos los jueves a las 19 hs (hora de Argentina). Visita guiada: Adolfo Alsina 1994, CABA.</p>

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

    <p class="gracias-volver"><a href="${p}simulador-de-equivalencias/">← Volver al simulador</a> · <a href="${p}">Ver todas las carreras</a></p>
    ${sello30(p, dim, 'negro')}
  </div>
</section>
<script>
(function () {
  var s;
  try { s = JSON.parse(sessionStorage.getItem('tb_simulacion') || 'null'); } catch (e) { s = null; }
  if (!s || !s.carreraNombre) return;
  var $ = function (id) { return document.getElementById(id); };
  function llenar(bloque, items) {
    if (!items || !items.length) return false;
    var ul = bloque.querySelector('.sim-lista');
    items.forEach(function (it) {
      var li = document.createElement('li');
      var b = document.createElement('strong');
      b.textContent = it.materia;
      li.appendChild(b);
      if (it.origen && it.origen.length) {
        var o = document.createElement('span');
        o.className = 'sim-origen';
        o.textContent = 'Con ' + it.origen.join(' + ');
        li.appendChild(o);
      }
      if (it.condicion) {
        var c = document.createElement('span');
        c.className = 'sim-condicion';
        c.textContent = it.condicion;
        li.appendChild(c);
      }
      ul.appendChild(li);
    });
    bloque.hidden = false;
    return true;
  }
  var desde = s.institucionNombre ? ' según lo que aprobaste en ' + s.institucionNombre : '';
  $('sim-sub').textContent = 'Esta es tu simulación para ' + s.carreraNombre + desde +
    '. Una persona del equipo de admisiones te va a escribir por WhatsApp para revisarla con vos.';
  if (s.tipo === 'saberes_previos') {
    $('sim-previos-nota').textContent = 'Tu escuela no tiene validez oficial, por eso no se otorgan equivalencias. ' +
      'Pero lo que aprobaste te deja en condiciones de rendir estas materias sin cursarlas.';
  } else {
    $('sim-previos-nota').textContent = 'Además de lo que se acredita, estas materias de primer año se pueden rendir sin cursarlas.';
  }
  var hay = llenar($('sim-acreditadas'), s.tipo === 'saberes_previos' ? [] : s.acreditadas);
  hay = llenar($('sim-previos'), s.saberesPrevios) || hay;
  if (hay) $('sim-resultado').hidden = false;
})();
</script>`;
}
