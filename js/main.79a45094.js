'use strict';
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.remove('sin-js');
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
(function () {
const els = document.querySelectorAll('.revela');
if (!els.length) return;
const todos = () => els.forEach(e => e.classList.add('visto'));
if (RM || !('IntersectionObserver' in window)) { todos(); return; }
document.documentElement.classList.add('anima');
let vistos = 0;
const io = new IntersectionObserver(entries => {
for (const en of entries) if (en.isIntersecting) { en.target.classList.add('visto'); vistos++; io.unobserve(en.target); }
}, { rootMargin: '0px 0px -8% 0px' });
els.forEach(e => io.observe(e));
setTimeout(() => { if (!vistos) { io.disconnect(); todos(); } }, 2500);
})();
(function () {
if (RM || !('IntersectionObserver' in window)) return;
const CHARSET = '▮▯│┤├┼╫≡=+*·:.0123456789';
const els = document.querySelectorAll('.etiqueta, .franja-alianzas-titulo');
if (!els.length) return;
const revolver = el => {
const fin = el.textContent;
const n = fin.length;
let paso = 0;
const total = n * 3;
const tic = () => {
const listos = Math.floor(paso / 3);
let salida = '';
for (let i = 0; i < n; i++) {
const c = fin[i];
if (i < listos || c === ' ') salida += c;
else salida += CHARSET[(Math.random() * CHARSET.length) | 0];
}
el.textContent = salida;
if (paso++ < total) requestAnimationFrame(tic);
else el.textContent = fin;
};
tic();
};
const io = new IntersectionObserver(es => {
for (const e of es) if (e.isIntersecting) { io.unobserve(e.target); revolver(e.target); }
}, { rootMargin: '0px 0px -15% 0px' });
els.forEach(e => io.observe(e));
})();
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
(function () {
const reloj = document.getElementById('reloj-sede');
const estado = document.getElementById('estado-sede');
if (!reloj && !estado) return;
function pinta() {
try {
const f = new Intl.DateTimeFormat('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', hour: '2-digit', minute: '2-digit', hour12: false });
const partes = Object.fromEntries(f.formatToParts(new Date()).map(p => [p.type, p.value]));
const h = +partes.hour;
const dia = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Buenos_Aires', weekday: 'short' }).format(new Date());
const abierto = dia !== 'Sat' && dia !== 'Sun' && h >= 9 && h < 23;
if (reloj) { reloj.textContent = `BS AS ${partes.hour}:${partes.minute}`; reloj.hidden = false; }
if (estado) {
estado.textContent = abierto ? '● Sede abierta ahora · L a V de 9 a 23 h' : '○ Sede cerrada · L a V de 9 a 23 h';
estado.dataset.abierto = abierto ? 'si' : 'no';
estado.hidden = false;
}
} catch (e) {  }
}
pinta();
setInterval(pinta, 60000);
})();
(function () {
const cta = document.getElementById('cta-movil');
const hero = document.querySelector('.hero');
const form = document.getElementById('inscripcion');
if (!cta || !hero) return;
cta.hidden = false;
const visible = v => { if (v) cta.dataset.visible = ''; else delete cta.dataset.visible; };
if (!('IntersectionObserver' in window)) { visible(true); return; }
let pasoHero = false, enForm = false;
const pinta = () => visible(pasoHero && !enForm);
const ioHero = new IntersectionObserver(es => {
pasoHero = !es[es.length - 1].isIntersecting; pinta();
}, { threshold: 0.15 });
ioHero.observe(hero);
if (form) {
const ioForm = new IntersectionObserver(es => {
enForm = es[es.length - 1].isIntersecting; pinta();
}, { threshold: 0 });
ioForm.observe(form);
}
})();
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
ifr.focus();
if (window.tbEvento) tbEvento('video_play', { video_id: id });
});
});
})();
(function () {
const form = document.getElementById('quiz-form');
if (!form) return;
const pasos = [...form.querySelectorAll('.quiz-paso')];
const num = document.getElementById('quiz-num');
const btn = document.getElementById('quiz-siguiente');
const resultado = document.getElementById('quiz-resultado');
let actual = 0;
const RUTAS = {
produccion: { distancia: 'sonido-distancia', presencial: 'sonido-presencial' }
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
const v = k => (form.querySelector(`input[name="${k}"]:checked`) || {}).value;
const q1 = v('q1'), q2 = v('q2'), q3 = v('q3');
let slug, nombre;
if (q3 === 'curso') { slug = 'curso-de-sonido'; nombre = 'Curso de Sonido y Grabación'; }
else if (q1 === 'produccion') { slug = RUTAS.produccion[q2] || 'sonido-distancia'; nombre = slug === 'sonido-distancia' ? 'Sonido y Producción Musical a Distancia' : 'Sonido y Producción Musical Presencial'; }
else if (q1 === 'tocar') { slug = 'musico-profesional'; nombre = 'Músico Profesional'; }
else { slug = 'cantante-profesional'; nombre = 'Cantante Profesional'; }
const soloPresencial = ['musico-profesional', 'cantante-profesional', 'sonido-presencial'];
let nota = '';
if (q2 === 'distancia' && soloPresencial.includes(slug)) {
nota = `<p class="quiz-nota">Ojo: esta carrera se cursa presencial en CABA. Si necesitás cursar 100 % a distancia, mirá también <a href="sonido-distancia/">Sonido y Producción Musical a Distancia</a> o <a href="eventos/">consultanos en un encuentro online</a>.</p>`;
}
form.hidden = true;
resultado.hidden = false;
resultado.innerHTML = `
<h3>Tu carrera: ${nombre}</h3>
<p>Por lo que respondiste, este es el camino que mejor encaja con vos. Mirá el plan de estudios, la modalidad y todo lo que incluye.</p>${nota}
<a class="boton boton-rojo boton-grande" href="${slug}/" data-tb="quiz-resultado" data-carrera="${slug}">Conocer ${nombre} →</a>`;
resultado.focus?.();
if (window.tbEvento) tbEvento('quiz_completado', { quiz_q1: q1, quiz_q2: q2, quiz_q3: q3, quiz_resultado: slug });
});
})();
(function () {
const el = document.getElementById('cuenta-regresiva');
if (!el) return;
const fin = new Date(el.dataset.fin).getTime();
if (isNaN(fin)) return;
let timer;
function pinta() {
const d = fin - Date.now();
el.hidden = false;
if (d <= 0) { el.textContent = 'La participación cerró.'; if (timer) clearInterval(timer); return false; }
const dias = Math.floor(d / 86400000), h = Math.floor(d / 3600000) % 24, m = Math.floor(d / 60000) % 60;
el.textContent = `Quedan ${dias} día${dias === 1 ? '' : 's'}, ${h} h ${String(m).padStart(2, '0')} min para participar`;
return true;
}
if (pinta()) timer = setInterval(pinta, 30000);
})();
(function () {
document.querySelectorAll('[data-tb-faq]').forEach(det => {
det.addEventListener('toggle', () => {
if (det.open && window.tbEvento) tbEvento('faq_abierta', { faq_pregunta: det.dataset.tbFaq });
});
});
})();
