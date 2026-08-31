/* TAMABA · main.js — interacción de la página.
   Guards del método: RM (reduced motion), FINE (puntero fino).
   Cada módulo es una IIFE independiente con guard propio. */
'use strict';

const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const PHONE = matchMedia('(max-width: 640px)').matches;

document.documentElement.classList.remove('sin-js');

/* ── Cabecera direccional: se oculta al bajar, vuelve al subir ── */
(function () {
  const cab = document.getElementById('cabecera');
  if (!cab) return;
  let prev = scrollY, tick = false;
  addEventListener('scroll', () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      const y = scrollY;
      if (y > 140 && y > prev + 4) cab.classList.add('cabecera-oculta');
      else if (y < prev - 4) cab.classList.remove('cabecera-oculta');
      prev = y; tick = false;
    });
  }, { passive: true });
})();

/* ── Barra de progreso de lectura ── */
(function () {
  const barra = document.getElementById('progreso-lectura');
  if (!barra) return;
  let tick = false;
  const pinta = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    barra.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + '%';
    tick = false;
  };
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(pinta); } }, { passive: true });
  pinta();
})();

/* ── Revelado por scroll (una vez por elemento) ── */
(function () {
  const els = document.querySelectorAll('.revela');
  if (!els.length) return;
  if (RM || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('visto')); return; }
  const io = new IntersectionObserver(entries => {
    for (const en of entries) if (en.isIntersecting) { en.target.classList.add('visto'); io.unobserve(en.target); }
  }, { rootMargin: '0px 0px -8% 0px' });
  els.forEach(e => io.observe(e));
})();

/* ── Contadores animados (confianza) ── */
(function () {
  const els = document.querySelectorAll('.contador');
  if (!els.length) return;
  const fija = el => { el.textContent = el.dataset.hasta; };
  if (RM || !('IntersectionObserver' in window)) { els.forEach(fija); return; }
  const anima = el => {
    const hasta = +el.dataset.hasta, desde = +(el.dataset.desde || 0);
    const dur = 1100, t0 = performance.now();
    (function paso(t) {
      const k = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(desde + (hasta - desde) * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(paso);
    })(t0);
  };
  const io = new IntersectionObserver(entries => {
    for (const en of entries) if (en.isIntersecting) { anima(en.target); io.unobserve(en.target); }
  }, { threshold: 0.6 });
  els.forEach(e => io.observe(e));
})();

/* ── Reloj real de la sede: ABIERTO/CERRADO (L–V 9–23, hora AR) ── */
(function () {
  const reloj = document.getElementById('reloj-sede');
  const estado = document.getElementById('estado-sede');
  if (!reloj && !estado) return;
  function pinta() {
    try {
      const f = new Intl.DateTimeFormat('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', hour: '2-digit', minute: '2-digit', weekday: 'short', hour12: false });
      const partes = Object.fromEntries(f.formatToParts(new Date()).map(p => [p.type, p.value]));
      const h = +partes.hour;
      const dia = partes.weekday.toLowerCase();
      const abierto = !['sáb', 'dom'].some(d => dia.startsWith(d)) && h >= 9 && h < 23;
      if (reloj) { reloj.textContent = `BS AS ${partes.hour}:${partes.minute}`; reloj.hidden = false; }
      if (estado) {
        estado.textContent = abierto ? '● Sede abierta ahora · L a V de 9 a 23 h' : '○ Sede cerrada · L a V de 9 a 23 h';
        estado.dataset.abierto = abierto ? 'si' : 'no';
        estado.hidden = false;
      }
    } catch (e) { /* Intl sin zona: se queda oculto */ }
  }
  pinta();
  setInterval(pinta, 60000);
})();

/* ── CTA móvil fija: aparece pasado el hero ── */
(function () {
  const cta = document.getElementById('cta-movil');
  const hero = document.querySelector('.hero');
  const form = document.getElementById('inscripcion');
  if (!cta || !hero) return;
  cta.hidden = false;
  const visible = v => { if (v) cta.dataset.visible = ''; else delete cta.dataset.visible; };
  if (!('IntersectionObserver' in window)) { visible(true); return; }
  let pasoHero = false, enForm = false;
  const io = new IntersectionObserver(es => {
    for (const en of es) {
      if (en.target === hero) pasoHero = !en.isIntersecting;
      if (en.target === form) enForm = en.isIntersecting;
    }
    visible(pasoHero && !enForm);
  }, { threshold: 0.15 });
  io.observe(hero);
  if (form) io.observe(form);
})();

/* ── Video facade: el iframe de YouTube se crea recién al clic ── */
(function () {
  document.querySelectorAll('.video-tapa').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.video;
      const marco = btn.closest('.video-marco') || btn.parentElement;
      const ifr = document.createElement('iframe');
      ifr.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
      ifr.title = 'Video de TAMABA';
      ifr.allow = 'autoplay; encrypted-media; picture-in-picture';
      ifr.allowFullscreen = true;
      marco.replaceChild(ifr, btn);
      if (window.tbEvento) tbEvento('video_play', { video_id: id });
    });
  });
})();

/* ── Quiz vocacional (home) ── */
(function () {
  const form = document.getElementById('quiz-form');
  if (!form) return;
  const pasos = [...form.querySelectorAll('.quiz-paso')];
  const num = document.getElementById('quiz-num');
  const btn = document.getElementById('quiz-siguiente');
  const resultado = document.getElementById('quiz-resultado');
  let actual = 0;

  const RUTAS = {
    // q1 → destino base; q2/q3 refinan
    produccion: { distancia: 'sonido-distancia', presencial: 'sonido-presencial' },
    tocar: 'musico-profesional',
    cantar: 'cantante-profesional'
  };

  btn.addEventListener('click', () => {
    const sel = pasos[actual].querySelector('input:checked');
    if (!sel) { pasos[actual].querySelector('input').focus(); return; }
    if (actual < pasos.length - 1) {
      pasos[actual].hidden = true;
      actual++;
      pasos[actual].hidden = false;
      num.textContent = actual + 1;
      if (actual === pasos.length - 1) btn.textContent = 'Ver mi resultado';
      pasos[actual].querySelector('input').focus();
      return;
    }
    // Resolver resultado
    const v = k => (form.querySelector(`input[name="${k}"]:checked`) || {}).value;
    const q1 = v('q1'), q2 = v('q2'), q3 = v('q3');
    let slug, nombre;
    if (q3 === 'curso') { slug = 'curso-de-sonido'; nombre = 'Curso de Sonido y Grabación'; }
    else if (q1 === 'produccion') { slug = RUTAS.produccion[q2] || 'sonido-distancia'; nombre = slug === 'sonido-distancia' ? 'Sonido y Producción Musical a Distancia' : 'Sonido y Producción Musical Presencial'; }
    else if (q1 === 'tocar') { slug = 'musico-profesional'; nombre = 'Músico Profesional'; }
    else { slug = 'cantante-profesional'; nombre = 'Cantante Profesional'; }

    form.hidden = true;
    resultado.hidden = false;
    resultado.innerHTML = `
      <h3>Tu carrera: ${nombre}</h3>
      <p>Por lo que respondiste, este es el camino que mejor encaja con vos. Mirá el plan de estudios, la modalidad y todo lo que incluye.</p>
      <a class="boton boton-rojo boton-grande" href="${slug}/" data-tb="quiz-resultado" data-carrera="${slug}">Conocer ${nombre} →</a>`;
    if (window.tbEvento) tbEvento('quiz_completado', { quiz_q1: q1, quiz_q2: q2, quiz_q3: q3, quiz_resultado: slug });
  });
})();

/* ── Cuenta regresiva (beca activa) ── */
(function () {
  const el = document.getElementById('cuenta-regresiva');
  if (!el) return;
  const fin = new Date(el.dataset.fin).getTime();
  if (isNaN(fin)) return;
  function pinta() {
    const d = fin - Date.now();
    if (d <= 0) { el.textContent = 'La participación cerró.'; return; }
    const dias = Math.floor(d / 86400000), h = Math.floor(d / 3600000) % 24, m = Math.floor(d / 60000) % 60;
    el.textContent = `Quedan ${dias} día${dias === 1 ? '' : 's'}, ${h} h ${String(m).padStart(2, '0')} min para participar`;
    el.hidden = false;
  }
  pinta();
  setInterval(pinta, 30000);
})();

/* ── FAQ: evento al abrir cada pregunta ── */
(function () {
  document.querySelectorAll('[data-tb-faq]').forEach(det => {
    det.addEventListener('toggle', () => {
      if (det.open && window.tbEvento) tbEvento('faq_abierta', { faq_pregunta: det.dataset.tbFaq });
    });
  });
})();
