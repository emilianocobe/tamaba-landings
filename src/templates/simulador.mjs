/** Landing del simulador de equivalencias («Tu carrera no empieza de cero»).
 *  Una sola campaña para Música y Sonido: la carrera se elige adentro del simulador.
 *  Decisiones de Emiliano (2026-09-21): formulario antes del resultado, nada de cantidades de
 *  materias en el copy, «Simulador», próximo inicio en una sola línea.
 *
 *  El simulador corre en esta página y habla con app.tamaba.edu.ar: de ahí salen las opciones
 *  (carreras, escuelas con tabla validada, instrumentos) y ahí se guarda el lead con su
 *  simulación. El resultado viaja a /gracias/simulador-de-equivalencias/ por sessionStorage,
 *  donde también se dispara la conversión. */

import { onda, sello30 } from './partes.mjs';

const PASOS = [
  ['Elegís tu carrera y la escuela de donde venís.', 'Y tu instrumento, si vas por Músico Profesional.'],
  ['Mirás tu simulación, materia por materia.', 'Qué se te acredita, con qué materia de tu escuela y qué podés rendir sin cursar.'],
  ['Presentás tu certificado de materias aprobadas.', 'Admisiones lo revisa y confirma la simulación.'],
  ['Arrancás desde donde te corresponde.', 'Cursás solo lo que te falta.'],
];

const FAQ = [
  ['¿El resultado del simulador es definitivo?', 'Es una simulación hecha con las tablas de equivalencias vigentes. Se confirma cuando Admisiones revisa tu certificado de materias aprobadas.'],
  ['¿Tengo que rendir algo para que me acrediten una materia?', 'No. Si la materia figura en la tabla y la aprobaste, se acredita.'],
  ['¿Sirve si dejé de estudiar hace años?', 'Sí. Una materia aprobada no vence.'],
  ['¿Qué pasa si mi escuela no aparece en la lista?', 'Elegí «Otra institución» e igual hacé la simulación: te mostramos qué materias podés rendir como saberes previos y Admisiones revisa tu caso a mano.'],
  ['¿Y si mi escuela no es oficial?', 'Las materias de una institución sin validez oficial no se pueden acreditar como equivalencia. Pero lo que aprendiste te deja en condiciones de rendir materias de primer año como saberes previos, sin cursarlas.'],
  ['¿Cuánto sale cursar menos materias?', 'Los valores se informan en los encuentros, porque dependen de cuántas materias te queden.'],
];

export function simulador({ site, dim }) {
  const p = '../';
  const wa = `https://wa.me/${site.whatsappHref}?text=${encodeURIComponent('Hola, quiero saber qué materias me acreditan en TAMABA')}`;
  return `
<!-- ══ HERO ══ -->
<section class="hero">
  <div class="hero-fondo" aria-hidden="true">
    <img src="${p}assets/img/estudio-pareja.webp" alt="" fetchpriority="high" ${dim('img/estudio-pareja.webp')} style="object-position:50% 35%">
  </div>
  <div class="hero-cuerpo">
    <p class="chip chip-rojo">Simulador de equivalencias</p>
    <h1 class="hero-titulo">Tu carrera no empieza<br><em>de cero.</em></h1>
    <p class="hero-sub">Las materias que aprobaste en otra escuela se acreditan en TAMABA. Cursás solo lo que te falta y terminás con título oficial.</p>
    <div class="hero-ctas">
      <a class="boton boton-rojo boton-grande" href="#simulador" data-tb="cta-hero">Simular mis equivalencias</a>
      <a class="boton boton-borde" href="#como-funciona" data-tb="cta-hero-secundario">Cómo funciona</a>
    </div>
  </div>
  <div class="hero-cinta" aria-hidden="true">
    <div class="cinta-pista">${'<span>TÍTULO OFICIAL</span><span>·</span><span>30 AÑOS</span><span>·</span><span>A-1441</span><span>·</span><span>MÚSICA Y SONIDO</span><span>·</span>'.repeat(4)}</div>
  </div>
</section>

<!-- ══ SIMULADOR ══ -->
<section class="panel-conversion" id="simulador">
  <div class="conversion-texto">
    <h2 class="titulo-display">Simulá tus<br>equivalencias</h2>
    <p class="conversion-sub">Elegí tu carrera, tu escuela y tu instrumento. En un minuto ves materia por materia qué se te acredita.</p>
    <p class="conversion-nota">Es gratis y sin compromiso. La simulación se confirma con tu certificado de materias aprobadas.</p>
    <p class="conversion-titulo-oficial">Título oficial · Ministerio de Educación</p>
  </div>
  <div class="conversion-form">
    <form class="simu" id="simu" data-api="${site.app}" novalidate>
      <p class="simu-progreso" id="simu-progreso" aria-live="polite">Paso 1 de 3</p>

      <fieldset class="simu-paso" data-paso="1">
        <legend class="simu-pregunta">¿Qué querés estudiar en TAMABA?</legend>
        <div class="simu-opciones" id="simu-carreras"><p class="simu-cargando">Cargando…</p></div>
      </fieldset>

      <fieldset class="simu-paso" data-paso="2" hidden>
        <legend class="simu-pregunta">¿De dónde venís?</legend>
        <label class="simu-campo">Escuela o institución donde estudiaste
          <select id="simu-institucion" required></select>
        </label>
        <label class="simu-campo" id="simu-otra-campo" hidden>¿Cuál?
          <input id="simu-otra" type="text" maxlength="120" autocomplete="organization">
        </label>
        <div id="simu-instrumento-bloque" hidden>
          <p class="simu-subpregunta">¿Qué instrumento tocás?</p>
          <div class="simu-opciones simu-opciones-chicas" id="simu-instrumentos"></div>
        </div>
        <div class="simu-botones">
          <button type="button" class="simu-atras" data-ir="1">← Volver</button>
          <button type="button" class="boton boton-rojo" id="simu-a3">Seguir</button>
        </div>
      </fieldset>

      <fieldset class="simu-paso" data-paso="3" hidden>
        <legend class="simu-pregunta">¿A quién le mostramos el resultado?</legend>
        <div class="simu-fila">
          <label class="simu-campo">Nombre<input id="simu-nombre" type="text" autocomplete="given-name" maxlength="120" required></label>
          <label class="simu-campo">Apellido<input id="simu-apellido" type="text" autocomplete="family-name" maxlength="120"></label>
        </div>
        <label class="simu-campo">Email<input id="simu-email" type="email" autocomplete="email" maxlength="254" required></label>
        <label class="simu-campo">Celular (WhatsApp)<input id="simu-telefono" type="tel" autocomplete="tel" maxlength="40" placeholder="11 2345 6789" required>
          <span class="simu-ayuda">Con código de área, sin 0 ni 15. Si estás fuera de Argentina, con + y el código de tu país.</span>
        </label>
        <label class="simu-trampa" aria-hidden="true">No completar<input id="simu-sitio" type="text" tabindex="-1" autocomplete="off"></label>
        <p class="simu-legal">Al enviar aceptás que TAMABA te contacte por WhatsApp o por mail y la <a href="${p}privacidad/">política de privacidad</a>.</p>
        <div class="simu-botones">
          <button type="button" class="simu-atras" data-ir="2">← Volver</button>
          <button type="submit" class="boton boton-rojo boton-grande" id="simu-enviar">Ver mi simulación</button>
        </div>
      </fieldset>

      <p class="simu-error" id="simu-error" role="alert" hidden></p>
    </form>
    <noscript><p class="simu-sin-js">Para usar el simulador hace falta JavaScript. También podés <a href="${wa}">escribirnos por WhatsApp</a> y lo vemos juntos.</p></noscript>
  </div>
</section>

<!-- ══ CÓMO FUNCIONA ══ -->
<section class="seccion" id="como-funciona">
  <p class="etiqueta">Cómo funciona</p>
  <h2 class="titulo-display">Lo que ya cursaste<br><em>cuenta acá</em></h2>
  <ol class="ruta ruta-oscura">
${PASOS.map(([t, d], i) => `    <li class="revela"><span class="ruta-numero">${String(i + 1).padStart(2, '0')}</span><span><strong>${t}</strong> ${d}</span></li>`).join('\n')}
  </ol>
</section>

<!-- ══ ESCUELAS ══ -->
<section class="seccion seccion-clara">
  <p class="etiqueta">Tablas validadas</p>
  <h2 class="titulo-display">Tus materias ya<br><em>tienen lugar acá</em></h2>
  <div class="simu-escuelas">
    <article class="revela">
      <h3>Músico y Cantante Profesional</h3>
      <p>EMBA · EMPA · ITMC · SITB</p>
    </article>
    <article class="revela">
      <h3>Sonido y Producción Musical</h3>
      <p>EMBA · universidades nacionales · UBA CBC</p>
    </article>
  </div>
  <p class="nota-al-pie">¿Tu escuela no está? Igual hacé la simulación: elegí «Otra institución» y Admisiones revisa tu caso a mano.</p>
</section>

<!-- ══ NO OFICIALES ══ -->
<section class="seccion seccion-clara">
  <p class="etiqueta">Si tu escuela no es oficial</p>
  <h2 class="titulo-display">Lo que aprendiste<br><em>no desaparece</em></h2>
  <p class="parrafo-ancho">Las materias de una institución sin validez oficial no se pueden acreditar como equivalencia. Pero lo que aprendiste te deja en condiciones de rendir materias de primer año como saberes previos, sin cursarlas. El simulador te dice exactamente cuáles.</p>
</section>

<!-- ══ TÍTULO ══ -->
<section class="seccion">
  <p class="etiqueta">Lo que es igual para todos</p>
  <h2 class="titulo-display">Terminás con<br><em>título oficial</em></h2>
  <p class="parrafo-ancho">Título oficial emitido por el Ministerio de Educación de la Ciudad, con validez nacional certificada por la Secretaría de Educación de la Nación. Tres años de carrera, con las certificaciones de Steinberg, AVID y Sibelius incluidas. 30 años formando músicos, cantantes y técnicos de sonido en Buenos Aires.</p>
</section>

<!-- ══ FAQ ══ -->
<section class="seccion seccion-clara" id="preguntas">
  <p class="etiqueta">Preguntas frecuentes</p>
  <h2 class="titulo-display">Lo que todos preguntan<br><em>antes de simular</em></h2>
  <div class="faq">
${FAQ.map(([q, r]) => `    <details class="faq-item" data-tb-faq="${q.replaceAll('"', '&quot;')}"><summary>${q}</summary><p>${r}</p></details>`).join('\n')}
  </div>
</section>

${onda()}

<!-- ══ CIERRE ══ -->
<section class="cierre">
  <h2 class="cierre-titulo">Lo que estudiaste<br>no se perdió</h2>
  <p class="cierre-sub">Próximo inicio: marzo 2027.</p>
  <a class="boton boton-rojo boton-grande" href="#simulador" data-tb="cta-final">Simular mis equivalencias</a>
  <p class="cierre-alternativa">¿Preferís que lo veamos juntos? <a href="${wa}" target="_blank" rel="noopener" data-tb="whatsapp-cierre">Escribinos por WhatsApp</a>.</p>
  ${sello30(p, dim)}
</section>

<script>${SCRIPT}</script>`;
}

/* El simulador. Va en línea para que viaje con la página (sin un asset más que versionar). */
const SCRIPT = String.raw`
(function () {
  var form = document.getElementById('simu');
  if (!form) return;
  var api = form.dataset.api;
  if (location.hostname === 'localhost') { var q = new URLSearchParams(location.search).get('api'); if (q) api = q; }
  var $ = function (id) { return document.getElementById(id); };
  var estado = { carrera: null, institucion: '', instrumento: null };
  var datos = null;
  var dl = function (ev, extra) { (window.dataLayer = window.dataLayer || []).push(Object.assign({ event: ev }, extra || {})); };

  function error(t) { var e = $('simu-error'); e.textContent = t || ''; e.hidden = !t; }
  function ir(n) {
    error('');
    form.querySelectorAll('.simu-paso').forEach(function (f) { f.hidden = f.dataset.paso !== String(n); });
    $('simu-progreso').textContent = 'Paso ' + n + ' de 3';
    dl('simulador_paso', { paso: n, carrera: estado.carrera || '' });
    var p = form.querySelector('[data-paso="' + n + '"] .simu-pregunta');
    if (p && n > 1) { form.scrollIntoView({ block: 'nearest' }); }
  }
  function opcion(nombre, valor, texto, sub) {
    var l = document.createElement('label'); l.className = 'simu-opcion';
    l.innerHTML = '<input type="radio" name="' + nombre + '"><span><strong></strong>' + (sub ? '<small></small>' : '') + '</span>';
    l.querySelector('input').value = valor;
    l.querySelector('strong').textContent = texto;
    if (sub) l.querySelector('small').textContent = sub;
    return l;
  }

  fetch(api + '/api/publico/simulador').then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (d) {
    datos = d;
    var cont = $('simu-carreras'); cont.innerHTML = '';
    var subs = { 'musico-profesional': 'Presencial', 'cantante-profesional': 'Presencial', 'sonido-presencial': 'Semipresencial, en CABA', 'sonido-distancia': '100 % online' };
    d.carreras.forEach(function (c) {
      var o = opcion('carrera', c.id, c.nombre.replace('Sonido y Producción Musical', 'Sonido y Producción'), subs[c.id]);
      o.querySelector('input').addEventListener('change', function () { estado.carrera = c.id; prepararPaso2(); ir(2); });
      cont.appendChild(o);
    });
    var ins = $('simu-instrumentos');
    d.instrumentos.forEach(function (i) {
      var o = opcion('instrumento', i.id, i.nombre);
      o.querySelector('input').addEventListener('change', function () { estado.instrumento = i.id; });
      ins.appendChild(o);
    });
  }).catch(function () {
    $('simu-carreras').innerHTML = '';
    error('No pudimos cargar el simulador. Recargá la página o escribinos por WhatsApp y lo vemos juntos.');
  });

  function carreraActual() { return datos.carreras.find(function (c) { return c.id === estado.carrera; }); }
  function prepararPaso2() {
    var c = carreraActual();
    var sel = $('simu-institucion');
    sel.innerHTML = '<option value="">Elegí una opción</option>';
    datos.instituciones[c.plan].forEach(function (i) { var o = document.createElement('option'); o.value = i.id; o.textContent = i.nombre; sel.appendChild(o); });
    var otra = document.createElement('option'); otra.value = 'otra'; otra.textContent = 'Otra institución'; sel.appendChild(otra);
    sel.value = ''; estado.institucion = ''; $('simu-otra-campo').hidden = true;
    $('simu-instrumento-bloque').hidden = !c.conInstrumento;
    if (!c.conInstrumento) estado.instrumento = null;
  }
  $('simu-institucion').addEventListener('change', function (e) {
    estado.institucion = e.target.value;
    $('simu-otra-campo').hidden = e.target.value !== 'otra';
  });
  form.querySelectorAll('.simu-atras').forEach(function (b) { b.addEventListener('click', function () { ir(b.dataset.ir); }); });
  $('simu-a3').addEventListener('click', function () {
    if (!estado.institucion) return error('Elegí la escuela o institución de donde venís.');
    if (carreraActual().conInstrumento && !estado.instrumento) return error('Elegí tu instrumento.');
    ir(3);
    $('simu-nombre').focus();
  });

  function atribucion() {
    try { return JSON.parse(localStorage.getItem('tb_attr_ultimo') || localStorage.getItem('tb_attr_primero') || '{}') || {}; }
    catch (e) { return {}; }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var persona = { nombre: $('simu-nombre').value.trim(), apellido: $('simu-apellido').value.trim(), email: $('simu-email').value.trim(), telefono: $('simu-telefono').value.trim() };
    if (!persona.nombre) return error('Falta tu nombre.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(persona.email)) return error('Revisá tu email: parece que tiene un error.');
    if (persona.telefono.replace(/\D/g, '').length < 8) return error('Revisá tu celular: incluí la característica.');
    var boton = $('simu-enviar'); boton.disabled = true; boton.textContent = 'Armando tu simulación…'; error('');
    fetch(api + '/api/publico/simulador', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ carrera: estado.carrera, institucion: estado.institucion, instrumento: estado.instrumento,
        institucion_otra: $('simu-otra').value.trim(), persona: persona, atribucion: atribucion(), sitio_web: $('simu-sitio').value })
    }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); }).then(function (x) {
      if (!x.ok) throw new Error(x.d.error || 'No pudimos enviar tu simulación.');
      try { sessionStorage.setItem('tb_simulacion', JSON.stringify(x.d.simulacion)); } catch (err) { /* sin storage: el gracias queda genérico */ }
      location.href = '../gracias/simulador-de-equivalencias/';
    }).catch(function (err) {
      boton.disabled = false; boton.textContent = 'Ver mi simulación';
      error((err && err.message && err.message !== 'Failed to fetch' ? err.message : 'No pudimos conectar.') + ' Si sigue fallando, escribinos por WhatsApp.');
      dl('simulador_error', { motivo: String(err && err.message || 'red').slice(0, 80) });
    });
  });
})();
`;
