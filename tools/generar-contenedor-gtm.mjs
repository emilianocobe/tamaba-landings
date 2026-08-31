#!/usr/bin/env node
/**
 * Genera el archivo de contenedor de Google Tag Manager listo para importar.
 *
 *   node tools/generar-contenedor-gtm.mjs
 *   → escribe docs/gtm/contenedor-tamaba.json
 *
 * Se importa en GTM con: Administración → Importar contenedor →
 * elegir el archivo → espacio de trabajo existente → **Combinar** →
 * "Renombrar conflictos" → revisar la vista previa → Confirmar.
 *
 * Lee los IDs de data/site.json: si cambian ahí, se regenera y listo.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(readFileSync(join(ROOT, 'data/site.json'), 'utf8'));
const T = site.tracking;

// Google Ads: el ID de conversión es la parte numérica de AW-XXXXXXXXX
const adsConversionId = (T.googleAdsId || '').replace(/^AW-/, '');
// La etiqueta de conversión es específica de cada acción de conversión y hay
// que copiarla desde Google Ads (Objetivos → Conversiones → la acción → Configurar con GTM).
const ETIQUETA_ADS = 'PEGAR_ETIQUETA_DE_CONVERSION';
const PIXEL_META = T.metaPixelId || 'PEGAR_ID_DEL_PIXEL';

let id = 0;
const nextId = () => String(++id);

// ── Variables de capa de datos ───────────────────────────────────────
const dlvNombres = ['carrera', 'carrera_nombre', 'canal_pago', 'utm_source',
  'utm_campaign', 'event_id', 'elemento', 'tipo', 'profundidad', 'value', 'currency'];

const variable = dlvNombres.map(n => ({
  accountId: '0', containerId: '0', variableId: nextId(),
  name: `DLV - ${n}`, type: 'v',
  parameter: [
    { type: 'INTEGER', key: 'dataLayerVersion', value: '2' },
    { type: 'BOOLEAN', key: 'setDefaultValue', value: 'false' },
    { type: 'TEMPLATE', key: 'name', value: n }
  ]
}));

// Constante con el ID del píxel de Meta (se edita en un solo lugar)
variable.push({
  accountId: '0', containerId: '0', variableId: nextId(),
  name: 'CONST - Meta Pixel ID', type: 'c',
  parameter: [{ type: 'TEMPLATE', key: 'value', value: PIXEL_META }]
});

// ── Activadores (eventos personalizados que emite el sitio) ──────────
const eventos = ['generate_lead', 'form_visible', 'cta_click', 'quiz_completado', 'scroll_depth'];
const trigger = eventos.map(ev => ({
  accountId: '0', containerId: '0', triggerId: nextId(),
  name: `CE - ${ev}`, type: 'CUSTOM_EVENT',
  customEventFilter: [{
    type: 'EQUALS',
    parameter: [
      { type: 'TEMPLATE', key: 'arg0', value: '{{_event}}' },
      { type: 'TEMPLATE', key: 'arg1', value: ev }
    ]
  }]
}));
const trg = ev => ({ triggerId: trigger.find(t => t.name === `CE - ${ev}`).triggerId });
const TODAS_LAS_PAGINAS = '2147479553'; // activador integrado "All Pages"

// Parámetros de evento reutilizables para GA4
const paramsGA4 = pares => ({
  type: 'LIST', key: 'eventSettingsTable',
  list: pares.map(([k, v]) => ({
    type: 'MAP',
    map: [
      { type: 'TEMPLATE', key: 'parameter', value: k },
      { type: 'TEMPLATE', key: 'parameterValue', value: v }
    ]
  }))
});

// ── Etiquetas ────────────────────────────────────────────────────────
const tag = [
  // 1 · Google tag (GA4 + base de Ads)
  {
    accountId: '0', containerId: '0', tagId: nextId(),
    name: 'Google tag - GA4', type: 'googtag',
    parameter: [{ type: 'TEMPLATE', key: 'tagId', value: T.ga4Id }],
    firingTriggerId: [TODAS_LAS_PAGINAS]
  },
  // 2 · GA4 · generate_lead (la conversión)
  {
    accountId: '0', containerId: '0', tagId: nextId(),
    name: 'GA4 - generate_lead (Cliente potencial)', type: 'gaawe',
    parameter: [
      { type: 'TEMPLATE', key: 'eventName', value: 'generate_lead' },
      { type: 'TEMPLATE', key: 'measurementIdOverride', value: T.ga4Id },
      paramsGA4([
        ['carrera', '{{DLV - carrera}}'],
        ['carrera_nombre', '{{DLV - carrera_nombre}}'],
        ['canal_pago', '{{DLV - canal_pago}}'],
        ['utm_source', '{{DLV - utm_source}}'],
        ['utm_campaign', '{{DLV - utm_campaign}}'],
        ['value', '{{DLV - value}}'],
        ['currency', '{{DLV - currency}}'],
        ['event_id', '{{DLV - event_id}}']
      ])
    ],
    firingTriggerId: [trg('generate_lead').triggerId]
  },
  // 3 · GA4 · form_visible
  {
    accountId: '0', containerId: '0', tagId: nextId(),
    name: 'GA4 - form_visible', type: 'gaawe',
    parameter: [
      { type: 'TEMPLATE', key: 'eventName', value: 'form_visible' },
      { type: 'TEMPLATE', key: 'measurementIdOverride', value: T.ga4Id },
      paramsGA4([['carrera', '{{DLV - carrera}}'], ['canal_pago', '{{DLV - canal_pago}}']])
    ],
    firingTriggerId: [trg('form_visible').triggerId]
  },
  // 4 · GA4 · cta_click
  {
    accountId: '0', containerId: '0', tagId: nextId(),
    name: 'GA4 - cta_click', type: 'gaawe',
    parameter: [
      { type: 'TEMPLATE', key: 'eventName', value: 'cta_click' },
      { type: 'TEMPLATE', key: 'measurementIdOverride', value: T.ga4Id },
      paramsGA4([
        ['elemento', '{{DLV - elemento}}'],
        ['tipo', '{{DLV - tipo}}'],
        ['carrera', '{{DLV - carrera}}'],
        ['canal_pago', '{{DLV - canal_pago}}']
      ])
    ],
    firingTriggerId: [trg('cta_click').triggerId]
  },
  // 5 · GA4 · quiz_completado
  {
    accountId: '0', containerId: '0', tagId: nextId(),
    name: 'GA4 - quiz_completado', type: 'gaawe',
    parameter: [
      { type: 'TEMPLATE', key: 'eventName', value: 'quiz_completado' },
      { type: 'TEMPLATE', key: 'measurementIdOverride', value: T.ga4Id },
      paramsGA4([['carrera', '{{DLV - carrera}}']])
    ],
    firingTriggerId: [trg('quiz_completado').triggerId]
  },
  // 6 · Vinculador de conversiones de Google Ads
  {
    accountId: '0', containerId: '0', tagId: nextId(),
    name: 'Conversion Linker', type: 'gclidw',
    parameter: [
      { type: 'BOOLEAN', key: 'enableCrossDomain', value: 'false' },
      { type: 'BOOLEAN', key: 'acceptIncoming', value: 'true' }
    ],
    firingTriggerId: [TODAS_LAS_PAGINAS]
  },
  // 7 · Google Ads · conversión "Cliente potencial"
  {
    accountId: '0', containerId: '0', tagId: nextId(),
    name: 'Google Ads - Conversion Cliente potencial', type: 'awct',
    parameter: [
      { type: 'TEMPLATE', key: 'conversionId', value: adsConversionId },
      { type: 'TEMPLATE', key: 'conversionLabel', value: ETIQUETA_ADS },
      { type: 'TEMPLATE', key: 'conversionValue', value: '{{DLV - value}}' },
      { type: 'TEMPLATE', key: 'currencyCode', value: '{{DLV - currency}}' },
      { type: 'TEMPLATE', key: 'orderId', value: '{{DLV - event_id}}' },
      { type: 'BOOLEAN', key: 'enableConversionLinker', value: 'true' },
      { type: 'BOOLEAN', key: 'enableProductReportingCheckbox', value: 'false' }
    ],
    firingTriggerId: [trg('generate_lead').triggerId]
  },
  // 8 · Meta Pixel · base
  {
    accountId: '0', containerId: '0', tagId: nextId(),
    name: 'Meta Pixel - Base', type: 'html',
    parameter: [
      { type: 'BOOLEAN', key: 'supportDocumentWrite', value: 'false' },
      {
        type: 'TEMPLATE', key: 'html', value:
          `<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', {{CONST - Meta Pixel ID}});
fbq('track', 'PageView');
</script>`
      }
    ],
    firingTriggerId: [TODAS_LAS_PAGINAS]
  },
  // 9 · Meta Pixel · Lead ("Cliente potencial") con deduplicación por event_id
  {
    accountId: '0', containerId: '0', tagId: nextId(),
    name: 'Meta Pixel - Lead (Cliente potencial)', type: 'html',
    parameter: [
      { type: 'BOOLEAN', key: 'supportDocumentWrite', value: 'false' },
      {
        type: 'TEMPLATE', key: 'html', value:
          `<script>
// eventID = el mismo id que envía la API de Conversiones → Meta deduplica
fbq('track', 'Lead', {
  content_name: {{DLV - carrera_nombre}},
  content_category: 'carrera',
  content_type: 'product',
  value: {{DLV - value}},
  currency: {{DLV - currency}}
}, { eventID: {{DLV - event_id}} });
</script>`
      }
    ],
    firingTriggerId: [trg('generate_lead').triggerId],
    tagFiringOption: 'ONCE_PER_EVENT'
  }
];

const contenedor = {
  exportFormatVersion: 2,
  exportTime: '2026-08-31 00:00:00',
  containerVersion: {
    path: 'accounts/0/containers/0/versions/0',
    accountId: '0', containerId: '0', containerVersionId: '0',
    name: 'TAMABA Landings — medición de leads',
    description: 'Generado por tools/generar-contenedor-gtm.mjs',
    container: {
      path: 'accounts/0/containers/0',
      accountId: '0', containerId: '0',
      name: new URL(site.dominio).hostname,
      publicId: T.gtmId,
      usageContext: ['WEB']
    },
    tag, trigger, variable
  }
};

mkdirSync(join(ROOT, 'docs/gtm'), { recursive: true });
const salida = join(ROOT, 'docs/gtm/contenedor-tamaba.json');
writeFileSync(salida, JSON.stringify(contenedor, null, 2) + '\n');

console.log(`✔ ${salida}`);
console.log(`  ${tag.length} etiquetas · ${trigger.length} activadores · ${variable.length} variables`);
console.log(`  GA4 ${T.ga4Id} · Ads ${T.googleAdsId} · GTM ${T.gtmId}`);
if (ETIQUETA_ADS.startsWith('PEGAR')) console.log('  ⚠ Falta la etiqueta de conversión de Google Ads');
if (PIXEL_META.startsWith('PEGAR')) console.log('  ⚠ Falta el ID numérico del píxel de Meta');
