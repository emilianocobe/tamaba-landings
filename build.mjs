#!/usr/bin/env node
/**
 * TAMABA Landings — generador estático sin dependencias.
 *
 * Lee data/ (site.json + carreras/*.json), renderiza las plantillas de
 * src/templates/ y escribe el sitio completo en dist/.
 *
 *   node build.mjs            → build completo
 *   node build.mjs --check    → build + verificaciones (enlaces internos, anclas)
 *
 * Sin npm install. Node ≥ 18.
 */
import { readFileSync, writeFileSync, mkdirSync, cpSync, readdirSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, 'dist');

// ── Datos ────────────────────────────────────────────────────────────
const site = JSON.parse(readFileSync(join(ROOT, 'data/site.json'), 'utf8'));
const carreras = readdirSync(join(ROOT, 'data/carreras'))
  .filter(f => f.endsWith('.json'))
  .map(f => JSON.parse(readFileSync(join(ROOT, 'data/carreras', f), 'utf8')))
  .sort((a, b) => a.orden - b.orden);
const beca = JSON.parse(readFileSync(join(ROOT, 'data/campanias/beca.json'), 'utf8'));

// ── Plantillas ───────────────────────────────────────────────────────
const { layout }   = await import('./src/templates/layout.mjs');
const { landing }  = await import('./src/templates/landing.mjs');
const { home }     = await import('./src/templates/home.mjs');
const { gracias }  = await import('./src/templates/gracias.mjs');
const { eventos }  = await import('./src/templates/eventos.mjs');
const { becaPage } = await import('./src/templates/beca.mjs');
const { legal }    = await import('./src/templates/legal.mjs');
const { e404 }     = await import('./src/templates/e404.mjs');

// ── Preparar dist ────────────────────────────────────────────────────
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
writeFileSync(join(DIST, '.nojekyll'), '');

// Assets
cpSync(join(ROOT, 'src/assets'), join(DIST, 'assets'), { recursive: true });

// CSS concatenado (tokens → base → componentes), en ese orden
const css = ['tokens.css', 'base.css', 'components.css']
  .map(f => readFileSync(join(ROOT, 'src/css', f), 'utf8'))
  .join('\n');
const fontsCss = readFileSync(join(ROOT, 'src/assets/fonts/fonts.css'), 'utf8')
  .replaceAll('./fonts/', '../assets/fonts/');
mkdirSync(join(DIST, 'css'), { recursive: true });
writeFileSync(join(DIST, 'css/styles.css'), fontsCss + '\n' + css);

// JS
mkdirSync(join(DIST, 'js'), { recursive: true });
for (const f of readdirSync(join(ROOT, 'src/js'))) {
  cpSync(join(ROOT, 'src/js', f), join(DIST, 'js', f));
}

// ── Escritura de páginas ─────────────────────────────────────────────
const pages = [];
function page(path, html) {
  const dir = join(DIST, path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
  pages.push(path === '' ? '/' : `/${path}/`);
}

const ctx = { site, carreras, beca };

page('', layout(home(ctx), { ...ctx, depth: 0, titulo: 'TAMABA · Terciario de Sonido y Música', descripcion: site.descripcion, esHome: true, ruta: '/', cta: { href: '#carreras', texto: 'Ver carreras' } }));

for (const c of carreras) {
  page(c.slug, layout(landing({ ...ctx, c }), { ...ctx, depth: 1, titulo: `${c.nombre} · TAMABA`, descripcion: c.metaDescripcion, ogImg: `assets/img/${c.heroImg}.webp`, ruta: `/${c.slug}/`, cta: { href: '#inscripcion', texto: 'Quiero inscribirme' }, conStickyCta: true }));
  page(`gracias/${c.slug}`, layout(gracias({ ...ctx, c }), { ...ctx, depth: 2, titulo: `¡Gracias! · ${c.nombreCorto} · TAMABA`, descripcion: 'Recibimos tu consulta. Te contactamos a la brevedad.', noindex: true, esGracias: true, slugCarrera: c.slug, ruta: `/gracias/${c.slug}/`, cta: { href: '../../', texto: 'Ver más carreras' } }));
}

page('eventos', layout(eventos(ctx), { ...ctx, depth: 1, titulo: 'Conocé TAMABA · Eventos', descripcion: 'Visita guiada presencial o encuentro informativo online: elegí cómo vivir tu primera experiencia con TAMABA.', ruta: '/eventos/', cta: { href: '#agenda', texto: 'Agendar ahora' } }));
page('beca', layout(becaPage(ctx), { ...ctx, depth: 1, titulo: `Beca TAMABA`, descripcion: 'Sorteo de becas TAMABA: participá del encuentro informativo y accedé a descuentos reales en tus cuotas.', noindex: !beca.activa, ruta: '/beca/', cta: beca.activa ? { href: beca.encuestaUrl, texto: 'Participar' } : { href: '../eventos/', texto: 'Conocer TAMABA' } }));
page('privacidad', layout(legal(ctx, 'privacidad'), { ...ctx, depth: 1, titulo: 'Política de Privacidad · TAMABA', descripcion: 'Cómo tratamos tus datos personales en TAMABA.', noindex: true, ruta: '/privacidad/', cta: { href: '../', texto: 'Ver carreras' } }));
page('bases-sorteo-beca', layout(legal(ctx, 'bases'), { ...ctx, depth: 1, titulo: 'Bases y Condiciones · Sorteo de Becas · TAMABA', descripcion: 'Bases y condiciones del sorteo de becas TAMABA.', noindex: true, ruta: '/bases-sorteo-beca/', cta: { href: '../', texto: 'Ver carreras' } }));

// 404 (GitHub Pages la sirve automáticamente)
writeFileSync(join(DIST, '404.html'), layout(e404(ctx), { ...ctx, depth: 0, titulo: 'Página no encontrada · TAMABA', descripcion: 'La página que buscás no existe.', noindex: true, ruta: '/404', cta: { href: './', texto: 'Ir al inicio' } }));

// ── robots.txt + sitemap.xml ─────────────────────────────────────────
const base = site.dominio;
writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /gracias/\nSitemap: ${base}/sitemap.xml\n`);
const indexables = pages.filter(p => !p.startsWith('/gracias') && p !== '/privacidad/' && p !== '/bases-sorteo-beca/' && (beca.activa || p !== '/beca/'));
writeFileSync(join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  indexables.map(p => `  <url><loc>${base}${p}</loc></url>`).join('\n') + '\n</urlset>\n');

console.log(`✔ ${pages.length + 1} páginas generadas en dist/`);

// ── Verificaciones (--check) ─────────────────────────────────────────
if (process.argv.includes('--check')) {
  let errores = 0;
  const rutas = new Set(pages.map(p => p === '/' ? '/' : p));
  const todosHtml = [];
  (function walk(dir, rel) {
    for (const f of readdirSync(dir, { withFileTypes: true })) {
      if (f.isDirectory()) walk(join(dir, f.name), rel + f.name + '/');
      else if (f.name.endsWith('.html')) todosHtml.push([rel + f.name, readFileSync(join(dir, f.name), 'utf8')]);
    }
  })(DIST, '/');

  for (const [ruta, html] of todosHtml) {
    // enlaces internos relativos → deben resolver a una página o asset existente
    for (const m of html.matchAll(/(?:href|src)="([^"#][^"]*)"/g)) {
      const url = m[1];
      if (/^(https?:|mailto:|tel:|data:)/.test(url)) continue;
      const abs = join(DIST, dirname(ruta), url.split('?')[0]);
      const candidatos = [abs, join(abs, 'index.html')];
      if (!candidatos.some(existsSync)) { console.error(`✘ ${ruta}: enlace roto → ${url}`); errores++; }
    }
    // anclas: todo href="#x" debe tener id="x" en la misma página
    const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map(m => m[1]));
    for (const m of html.matchAll(/href="#([^"]+)"/g)) {
      if (!ids.has(m[1])) { console.error(`✘ ${ruta}: ancla sin destino → #${m[1]}`); errores++; }
    }
    // exactamente un h1
    const h1s = (html.match(/<h1[\s>]/g) || []).length;
    if (h1s !== 1) { console.error(`✘ ${ruta}: ${h1s} <h1> (debe haber exactamente 1)`); errores++; }
    // imágenes sin alt
    for (const m of html.matchAll(/<img(?![^>]*\balt=)[^>]*>/g)) { console.error(`✘ ${ruta}: <img> sin alt → ${m[0].slice(0, 80)}`); errores++; }
    // target=_blank sin noopener
    for (const m of html.matchAll(/<a[^>]*target="_blank"(?![^>]*noopener)[^>]*>/g)) { console.error(`✘ ${ruta}: _blank sin noopener → ${m[0].slice(0, 80)}`); errores++; }
    // http:// inseguro
    for (const m of html.matchAll(/(?:href|src)="http:\/\/[^"]*"/g)) { console.error(`✘ ${ruta}: URL http insegura → ${m[0].slice(0, 90)}`); errores++; }
  }
  if (errores) { console.error(`\n✘ ${errores} problema(s).`); process.exit(1); }
  console.log('✔ Verificaciones: enlaces, anclas, h1 único, alt, noopener, https — todo OK');
}
