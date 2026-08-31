/* TAMABA · tracking.js — arquitectura de medición de adquisición.
   Reemplaza el esquema viejo de "una URL por canal" (gads-/mads-/pmax-)
   por UNA página por carrera con atribución por UTM.

   Qué hace:
   1. Captura y persiste UTMs + gclid/fbclid (primer toque y último toque).
   2. Inserta el iframe de GoHighLevel eligiendo el form del canal correcto
      y propagándole los UTMs (GHL los guarda como atribución del contacto).
   3. Empuja eventos tipados a dataLayer (GTM los enruta a GA4/Ads/Meta):
      page_view_landing, form_cargado, form_visible, scroll_depth,
      cta_click (con tipo: whatsapp/telefono/email/booking) y
      generate_lead (en /gracias/, deduplicado por sesión).
   Ver docs/TRACKING.md para el plan completo y el mapa de etiquetas GTM. */
'use strict';

(function () {
  const TB = window.TB || {};
  window.dataLayer = window.dataLayer || [];
  const push = obj => window.dataLayer.push(obj);
  window.tbEvento = (evento, params) => push(Object.assign({ event: evento }, params || {}));

  /* ── 1 · Captura y persistencia de atribución ─────────────── */
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

  /* Canal: utm_source/campaign → gads | mads | pmax, o null sin señales.
     El tráfico sin atribución se reporta como 'directo' — nunca se
     inventa un canal de pago (inflaría a Google Ads en GHL y GA4). */
  function canal() {
    const src = (attr.utm_source || '').toLowerCase();
    const camp = (attr.utm_campaign || '').toLowerCase();
    if (camp.includes('pmax') || camp.includes('performance')) return 'pmax';
    if (TB.canales && TB.canales[src]) return TB.canales[src];
    if (attr.gclid) return 'gads';
    if (attr.fbclid) return 'mads';
    return null;
  }
  const CANAL = canal();                 // null = sin canal de pago
  const CANAL_PAGO = CANAL || 'directo'; // lo que se reporta en eventos

  /* ── 2 · Google Tag Manager (contenedor único para todo) ───── */
  if (TB.gtmId && /^GTM-[A-Z0-9]+$/.test(TB.gtmId) && !/XXXXXXX/.test(TB.gtmId)) {
    push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=' + TB.gtmId;
    document.head.appendChild(s);
  }

  /* Contexto base de la página */
  push({
    event: 'page_view_landing',
    canal_pago: CANAL_PAGO,
    carrera: TB.slug || (location.pathname.split('/').filter(Boolean)[0] || 'home'),
    utm_source: attr.utm_source || '(directo)',
    utm_campaign: attr.utm_campaign || '(sin campaña)'
  });

  /* ── 3 · Formulario GHL: canal correcto + UTMs propagados ──── */
  const cont = document.getElementById('ghl-form');
  if (cont) {
    const formId = (CANAL && cont.dataset[CANAL]) || cont.dataset.gads;
    const params = new URLSearchParams();
    for (const k of CLAVES) if (attr[k]) params.set(k, attr[k]); // solo atribución real
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
    /* Carga diferida: recién cuando el bloque se acerca al viewport
       (el form está alto en la página, así que en la práctica es casi eager) */
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => {
        if (es.some(e => e.isIntersecting)) { crea(); io.disconnect(); }
      }, { rootMargin: '1200px 0px' });
      io.observe(cont);
    } else crea();

    /* Visibilidad real del form (para medir cuántos llegan a verlo) */
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

  /* ── 4 · Conversión en /gracias/ ──────────────────────────── */
  if (TB.esGracias) {
    // Deduplicación: recargar /gracias/ o volver con el botón atrás
    // no debe contar una segunda conversión en la misma sesión.
    let yaContada = false;
    try {
      const clave = 'tb_lead_' + TB.slug;
      yaContada = sessionStorage.getItem(clave) === '1';
      if (!yaContada) sessionStorage.setItem(clave, '1');
    } catch (e) { /* sin storage: se cuenta igual */ }
    if (!yaContada) {
      push({
        event: 'generate_lead',
        carrera: TB.slug,
        canal_pago: CANAL_PAGO,
        utm_source: attr.utm_source || '(directo)',
        utm_campaign: attr.utm_campaign || '(sin campaña)'
      });
    }
  }

  /* ── 5 · Clics medidos ────────────────────────────────────── */
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

  /* ── 6 · Profundidad de scroll (25/50/75/100) ─────────────── */
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
