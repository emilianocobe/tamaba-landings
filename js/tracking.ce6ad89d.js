'use strict';
(function () {
const TB = window.TB || {};
window.dataLayer = window.dataLayer || [];
const push = obj => window.dataLayer.push(obj);
window.tbEvento = (evento, params) => push(Object.assign({ event: evento }, params || {}));
const CLAVES = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'wbraid', 'gbraid'];
const qs = new URLSearchParams(location.search);
const ahora = {};
for (const k of CLAVES) if (qs.get(k)) ahora[k] = qs.get(k);
let attr = {};
try {
const ultimo = JSON.parse(localStorage.getItem('tb_attr_ultimo') || 'null');
const primero = JSON.parse(localStorage.getItem('tb_attr_primero') || 'null');
if (Object.keys(ahora).length) {
localStorage.setItem('tb_attr_ultimo', JSON.stringify({ ...ahora, ts: Date.now() }));
if (!primero) localStorage.setItem('tb_attr_primero', JSON.stringify({ ...ahora, ts: Date.now() }));
attr = ahora;
} else {
attr = ultimo || primero || {};
}
} catch (e) { attr = ahora; }
function canal() {
const src = (attr.utm_source || '').toLowerCase();
const camp = (attr.utm_campaign || '').toLowerCase();
if (camp.includes('pmax') || camp.includes('performance')) return 'pmax';
if (TB.canales && TB.canales[src]) return TB.canales[src];
if (attr.gclid) return 'gads';
if (attr.fbclid) return 'mads';
return null;
}
const CANAL = canal();                 
const CANAL_PAGO = CANAL || 'directo'; 
if (TB.metaPixelId && /^\d{10,20}$/.test(TB.metaPixelId) && !window.fbq) {
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', TB.metaPixelId);
fbq('track', 'PageView');
}
push({
event: 'page_view_landing',
canal_pago: CANAL_PAGO,
carrera: TB.slug || (location.pathname.split('/').filter(Boolean)[0] || 'home'),
utm_source: attr.utm_source || '(directo)',
utm_campaign: attr.utm_campaign || '(sin campaña)'
});
const cont = document.getElementById('ghl-form');
if (cont) {
const formId = (CANAL && cont.dataset[CANAL]) || cont.dataset.gads;
const params = new URLSearchParams();
for (const k of CLAVES) if (attr[k]) params.set(k, attr[k]); 
const q = params.toString();
const src = 'https://api.leadconnectorhq.com/widget/form/' + formId + (q ? '?' + q : '');
const crea = () => {
if (cont.dataset.cargado) return;
cont.dataset.cargado = '1';
const ifr = document.createElement('iframe');
ifr.src = src;
ifr.id = 'ghl-' + formId;
ifr.title = 'Formulario de consulta — ' + (cont.dataset.nombre || 'TAMABA');
ifr.setAttribute('data-form-id', formId);
ifr.setAttribute('data-layout-iframe-id', 'ghl-' + formId);
cont.appendChild(ifr);
const s = document.createElement('script');
s.src = 'https://link.msgsndr.com/js/form_embed.js';
s.async = true;
document.body.appendChild(s);
push({ event: 'form_cargado', form_id: formId, canal_pago: CANAL_PAGO });
};
if ('IntersectionObserver' in window) {
const io = new IntersectionObserver(es => {
if (es.some(e => e.isIntersecting)) { crea(); io.disconnect(); }
}, { rootMargin: '1200px 0px' });
io.observe(cont);
} else crea();
if ('IntersectionObserver' in window) {
const ioVis = new IntersectionObserver(es => {
if (es.some(e => e.isIntersecting && e.intersectionRatio > 0.4)) {
push({ event: 'form_visible', form_id: formId, canal_pago: CANAL_PAGO });
ioVis.disconnect();
}
}, { threshold: 0.4 });
ioVis.observe(cont);
}
}
if (TB.esGracias) {
let yaContada = false;
try {
const clave = 'tb_lead_' + TB.slug;
yaContada = sessionStorage.getItem(clave) === '1';
if (!yaContada) sessionStorage.setItem(clave, '1');
} catch (e) {  }
if (!yaContada) {
const eventId = 'lead-' + TB.slug + '-' + Date.now() + '-' +
Math.random().toString(36).slice(2, 10);
push({
event: 'generate_lead',
carrera: TB.slug,
carrera_nombre: TB.carreraNombre || TB.slug,
canal_pago: CANAL_PAGO,
utm_source: attr.utm_source || '(directo)',
utm_campaign: attr.utm_campaign || '(sin campaña)',
event_id: eventId,
value: 1,
currency: 'ARS'
});
if (window.fbq) {
fbq('track', 'Lead', {
content_name: TB.carreraNombre || TB.slug,
content_category: 'carrera',
content_type: 'product',
value: 1,
currency: 'ARS'
}, { eventID: eventId });
}
push({ event: 'Lead', carrera: TB.slug, event_id: eventId });
}
}
if (TB.eventoReserva) {
let yaContada = false;
try {
const clave = 'tb_reserva_' + TB.eventoReserva;
yaContada = sessionStorage.getItem(clave) === '1';
if (!yaContada) sessionStorage.setItem(clave, '1');
} catch (e) {  }
if (!yaContada) {
const eventId = 'reserva-' + TB.eventoReserva + '-' + Date.now() + '-' +
Math.random().toString(36).slice(2, 10);
push({
event: 'reserva_evento',
tipo_evento: TB.eventoReserva,          
canal_pago: CANAL_PAGO,
utm_source: attr.utm_source || '(directo)',
utm_campaign: attr.utm_campaign || '(sin campaña)',
event_id: eventId
});
if (window.fbq) {
fbq('track', 'Schedule', {
content_name: TB.eventoReserva,
content_category: 'evento'
}, { eventID: eventId });
}
push({ event: 'Schedule', tipo_evento: TB.eventoReserva, event_id: eventId });
}
}
document.addEventListener('click', ev => {
const a = ev.target.closest('a[data-tb], button[data-tb]');
if (!a) return;
const params = { elemento: a.dataset.tb, canal_pago: CANAL_PAGO };
if (a.dataset.carrera) params.carrera = a.dataset.carrera;
if (a.href) {
if (a.href.startsWith('tel:')) params.tipo = 'telefono';
else if (a.href.startsWith('mailto:')) params.tipo = 'email';
else if (a.href.includes('wa.me')) params.tipo = 'whatsapp';
else if (a.href.includes('widget/booking')) params.tipo = 'booking';
}
push(Object.assign({ event: 'cta_click' }, params));
}, { passive: true });
const hitos = [25, 50, 75, 100];
let alcanzado = 0, tick = false;
addEventListener('scroll', () => {
if (tick) return; tick = true;
requestAnimationFrame(() => {
tick = false;
const max = document.documentElement.scrollHeight - innerHeight;
if (max <= 0) return;
const pct = Math.round((scrollY / max) * 100);
while (alcanzado < hitos.length && pct >= hitos[alcanzado]) {
push({ event: 'scroll_depth', profundidad: hitos[alcanzado], canal_pago: CANAL_PAGO });
alcanzado++;
}
});
}, { passive: true });
})();
