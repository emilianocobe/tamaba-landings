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
const eventosGracias = JSON.parse(readFileSync(join(ROOT, 'data/eventos-gracias.json'), 'utf8'));


// ── Medidor de imágenes ──────────────────────────────────────────────
// Las dimensiones de cada <img> se leen del archivo, nunca se escriben a
// mano: un width/height desincronizado del asset real es CLS y deforma
// la caja. Soporta los dos formatos que usa el sitio (WebP y PNG).
const _medidas = new Map();
function medir(rutaRel) {
  if (_medidas.has(rutaRel)) return _medidas.get(rutaRel);
  const abs = join(ROOT, 'src/assets', rutaRel);
  if (!existsSync(abs)) throw new Error(`medir(): no existe src/assets/${rutaRel}`);
  const d = readFileSync(abs);
  let m = null;
  if (d.subarray(0, 4).toString('latin1') === 'PNG') {
    m = { w: d.readUInt32BE(16), h: d.readUInt32BE(20) };
  } else if (d.subarray(0, 4).toString('latin1') === 'RIFF' && d.subarray(8, 12).toString('latin1') === 'WEBP') {
    const fmt = d.subarray(12, 16).toString('latin1');
    if (fmt === 'VP8X') m = { w: d.readUIntLE(24, 3) + 1, h: d.readUIntLE(27, 3) + 1 };
    else if (fmt === 'VP8 ') m = { w: d.readUInt16LE(26) & 0x3fff, h: d.readUInt16LE(28) & 0x3fff };
    else if (fmt === 'VP8L') { const n = d.readUInt32LE(21); m = { w: (n & 0x3fff) + 1, h: ((n >> 14) & 0x3fff) + 1 }; }
  }
  if (!m || !m.w || !m.h) throw new Error(`medir(): formato no reconocido en ${rutaRel}`);
  _medidas.set(rutaRel, m);
  return m;
}
/** Atributos listos para pegar en una <img>. */
function dim(rutaRel) {
  const { w, h } = medir(rutaRel);
  return `width="${w}" height="${h}"`;
}

// ── Plantillas ───────────────────────────────────────────────────────
const { layout }   = await import('./src/templates/layout.mjs');
const { landing }  = await import('./src/templates/landing.mjs');
const { home }     = await import('./src/templates/home.mjs');
const { gracias }  = await import('./src/templates/gracias.mjs');
const { graciasEvento } = await import('./src/templates/graciasEvento.mjs');
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

/* Minificador conservador: quita comentarios y espacio sobrante sin
   tocar el contenido de strings ni romper la cascada. */
function minCss(s) {
  return s
    .replace(/\/\*[\s\S]*?\*\//g, '')          // comentarios
    .replace(/\s*([{}:;,>~])\s*/g, '$1')       // espacio alrededor de símbolos
    .replace(/;}/g, '}')                        // punto y coma final
    .replace(/\s+/g, ' ')                       // espacios múltiples
    .replace(/\s*!important/g, '!important')
    .trim();
}
function minJs(s) {
  return s
    .split('\n')
    .map(l => l.replace(/(^|[^:'"\\])\/\/(?![^'"]*['"]\s*[;,)]).*$/, '$1')) // // comentarios de línea
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '')          // bloques /* */
    .replace(/\n\s*\n/g, '\n')                  // líneas vacías
    .replace(/^[ \t]+/gm, '')                   // indentación
    .trim();
}

mkdirSync(join(DIST, 'css'), { recursive: true });
writeFileSync(join(DIST, 'css/styles.css'), minCss(fontsCss + '\n' + css) + '\n');

// JS
mkdirSync(join(DIST, 'js'), { recursive: true });
for (const f of readdirSync(join(ROOT, 'src/js'))) {
  writeFileSync(join(DIST, 'js', f), minJs(readFileSync(join(ROOT, 'src/js', f), 'utf8')) + '\n');
}

// ── Escritura de páginas ─────────────────────────────────────────────
const pages = [];
function page(path, html) {
  const dir = join(DIST, path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
  pages.push(path === '' ? '/' : `/${path}/`);
}

const ctx = { site, carreras, beca, dim };

page('', layout(home(ctx), { ...ctx, depth: 0, titulo: 'TAMABA · Terciario de Sonido y Música', descripcion: site.descripcion, esHome: true, ruta: '/', cta: { href: '#carreras', texto: 'Ver carreras' } }));

for (const c of carreras) {
  // Datos estructurados por carrera: Course + FAQPage + Breadcrumb
  const jsonLdCarrera = [
    {
      '@context': 'https://schema.org', '@type': 'Course',
      name: c.nombre, description: c.metaDescripcion,
      url: `${site.dominio}/${c.slug}/`,
      inLanguage: 'es-AR',
      educationalCredentialAwarded: c.tituloOficial,
      provider: { '@type': 'EducationalOrganization', name: 'Instituto Terciario TAMABA', url: site.dominio, sameAs: [site.redes.instagram, site.redes.youtube] },
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: /distancia/i.test(c.ficha.modalidad) ? 'online' : 'onsite',
        courseWorkload: c.ficha.duracion,
        location: { '@type': 'Place', name: 'TAMABA', address: { '@type': 'PostalAddress', streetAddress: 'Adolfo Alsina 1994', addressLocality: 'Ciudad Autónoma de Buenos Aires', addressCountry: 'AR' } }
      }
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: site.dominio + '/' },
        { '@type': 'ListItem', position: 2, name: c.nombreCorto, item: `${site.dominio}/${c.slug}/` }
      ]
    }
  ];
  if (c.faq && c.faq.length) jsonLdCarrera.push({
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: c.faq.map(f => ({
      '@type': 'Question', name: f.p,
      acceptedAnswer: { '@type': 'Answer', text: f.r }
    }))
  });
  page(c.slug, layout(landing({ ...ctx, c }), { ...ctx, depth: 1, titulo: `${c.nombre} · TAMABA`, descripcion: c.metaDescripcion, ogImg: `assets/img/${c.heroImg}.webp`, ogImgAlt: c.heroImgAlt, jsonLd: jsonLdCarrera, ruta: `/${c.slug}/`, cta: { href: '#inscripcion', texto: 'Consultar ahora' }, conStickyCta: true, waTexto: `Hola, quiero información sobre ${c.nombre}` }));
  page(`gracias/${c.slug}`, layout(gracias({ ...ctx, c }), { ...ctx, depth: 2, titulo: `¡Gracias! · ${c.nombreCorto} · TAMABA`, descripcion: 'Recibimos tu consulta. Te contactamos a la brevedad.', noindex: true, esGracias: true, slugCarrera: c.slug, carreraNombre: c.nombre, ruta: `/gracias/${c.slug}/`, cta: { href: '../../', texto: 'Ver más carreras' } }));
}

// Gracias de reserva de evento (post-booking de GHL)
for (const [clave, ev] of Object.entries(eventosGracias)) {
  if (clave.startsWith('_')) continue;
  page(`gracias-evento/${ev.slug}`, layout(graciasEvento({ ...ctx, ev }), { ...ctx, depth: 2,
    titulo: `${ev.titulo} · TAMABA`, descripcion: ev.sub, noindex: true,
    eventoReserva: ev.evento, ruta: `/gracias-evento/${ev.slug}/`,
    cta: { href: '../../', texto: 'Ver carreras' } }));
}

page('eventos', layout(eventos(ctx), { ...ctx, depth: 1, titulo: 'Conocé TAMABA · Eventos', descripcion: 'Visita guiada presencial o encuentro informativo online: elegí cómo vivir tu primera experiencia con TAMABA.', ruta: '/eventos/', cta: { href: '#agenda', texto: 'Agendar ahora' } }));
page('beca', layout(becaPage(ctx), { ...ctx, depth: 1, titulo: `Beca TAMABA`, descripcion: 'Sorteo de becas TAMABA: participá del encuentro informativo y accedé a descuentos reales en tus cuotas.', noindex: !beca.activa, ruta: '/beca/', cta: beca.activa ? { href: beca.encuestaUrl, texto: 'Participar' } : { href: '../eventos/', texto: 'Conocer TAMABA' } }));
page('privacidad', layout(legal(ctx, 'privacidad'), { ...ctx, depth: 1, titulo: 'Política de Privacidad · TAMABA', descripcion: 'Cómo tratamos tus datos personales en TAMABA.', noindex: true, ruta: '/privacidad/', cta: { href: '../', texto: 'Ver carreras' } }));
page('bases-sorteo-beca', layout(legal(ctx, 'bases'), { ...ctx, depth: 1, titulo: 'Bases y Condiciones · Sorteo de Becas · TAMABA', descripcion: 'Bases y condiciones del sorteo de becas TAMABA.', noindex: true, ruta: '/bases-sorteo-beca/', cta: { href: '../', texto: 'Ver carreras' } }));

// 404 (GitHub Pages la sirve automáticamente)
writeFileSync(join(DIST, '404.html'), layout(e404(ctx), { ...ctx, depth: 0, absoluto: true, titulo: 'Página no encontrada · TAMABA', descripcion: 'La página que buscás no existe.', noindex: true, ruta: '/404', cta: { href: '/', texto: 'Ir al inicio' } }));

// ── Redirecciones desde las URLs del sitio viejo ─────────────────────
// Doble red, a proposito:
//  1) 301 reales en .htaccess — lo que se sirve en Hostinger (Apache).
//  2) paginas stub con meta refresh + JS — respaldo si mod_rewrite no
//     estuviera activo, y lo unico que funcionaria en un host estatico.
// Con el 301 activo la stub nunca llega a servirse; no compiten.
const redirects = JSON.parse(readFileSync(join(ROOT, 'data/redirects.json'), 'utf8'));
let nRedir = 0;
const reglas301 = [];
for (const [viejo, nuevo] of Object.entries(redirects)) {
  if (viejo.startsWith('_')) continue;
  // Regla de servidor: es la que realmente se sirve en Hostinger (Apache).
  // Apache arrastra la query string sola, asi que los UTM sobreviven.
  reglas301.push(`RewriteRule ^${viejo}/?$ ${nuevo} [R=301,L]`);
  const dir = join(DIST, viejo);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), `<!DOCTYPE html>
<html lang="es-AR"><head><meta charset="UTF-8">
<title>Redirigiendo…</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="${site.dominio}${nuevo}">
<meta http-equiv="refresh" content="0; url=${nuevo}">
<script>location.replace(${JSON.stringify(nuevo)} + location.search + location.hash);</script>
</head><body><p>Esta página se mudó. <a href="${nuevo}">Continuar</a></p></body></html>\n`);
  nRedir++;
}
console.log(`✔ ${nRedir} redirecciones de URLs viejas`);

// ── .htaccess (Hostinger = Apache/LiteSpeed) ─────────────────────────
// HTTPS forzado, 404 propia, compresión y caché de assets inmutables.
writeFileSync(join(DIST, '.htaccess'), `# TAMABA · generado por build.mjs — no editar a mano
Options -Indexes
DirectoryIndex index.html

# HTTPS obligatorio + 301 de las URLs del sitio viejo
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} !=on
  RewriteCond %{HTTP:X-Forwarded-Proto} !https
  RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]

  # Las ${reglas301.length} URLs del WordPress viejo. 301 de servidor: transfieren
  # autoridad y no gastan una carga de pagina. Apache arrastra la query
  # string, asi que los UTM de los anuncios activos sobreviven al salto.
${reglas301.map(r => '  ' + r).join('\n')}
</IfModule>

# Página 404 propia
ErrorDocument 404 /404.html

# Compresión
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/plain text/xml application/javascript application/json image/svg+xml
</IfModule>

# Caché: assets con hash de contenido estable, HTML siempre fresco
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>
<IfModule mod_headers.c>
  <FilesMatch "\\.(css|js|webp|png|svg|woff2)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  <FilesMatch "\\.html$">
    Header set Cache-Control "public, max-age=0, must-revalidate"
  </FilesMatch>
  Header set X-Content-Type-Options "nosniff"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
  # El sitio no se embebe en ningun lado; si embebe (GHL, Maps), que es
  # otra cosa y no la afecta esta cabecera.
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set Permissions-Policy "geolocation=(), camera=(), microphone=(), payment=(), interest-cohort=()"
  # HSTS con despliegue gradual (recomendacion OWASP): un dia primero.
  # Subir a 31536000 recien despues de verificar que el certificado
  # renueva solo — un max-age largo con el cert vencido deja el sitio
  # inaccesible y no hay forma de revertirlo del lado del visitante.
  Header always set Strict-Transport-Security "max-age=86400"
</IfModule>
`);

// ── robots.txt + sitemap.xml ─────────────────────────────────────────
const base = site.dominio;
// Sin Disallow de /gracias/: esas páginas llevan noindex, y bloquear el
// crawl impediría que los buscadores lo lean.
writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`);
const indexables = pages.filter(p => !p.startsWith('/gracias') && p !== '/privacidad/' && p !== '/bases-sorteo-beca/' && (beca.activa || p !== '/beca/'));
writeFileSync(join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  indexables.map(p => `  <url><loc>${base}${p}</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod><changefreq>weekly</changefreq><priority>${p === '/' ? '1.0' : p === '/eventos/' ? '0.9' : '0.8'}</priority></url>`).join('\n') + '\n</urlset>\n');

console.log(`✔ ${pages.length + 1} páginas generadas en dist/`);

// ── Verificaciones (--check) ─────────────────────────────────────────
if (process.argv.includes('--check')) {
  let errores = 0;
  const todosHtml = [];
  (function walk(dir, rel) {
    for (const f of readdirSync(dir, { withFileTypes: true })) {
      if (f.isDirectory()) walk(join(dir, f.name), rel + f.name + '/');
      else if (f.name.endsWith('.html')) todosHtml.push([rel + f.name, readFileSync(join(dir, f.name), 'utf8')]);
    }
  })(DIST, '/');

  for (const [ruta, html] of todosHtml) {
    const esRedirect = html.includes('http-equiv="refresh"');
    // enlaces internos → deben resolver a una página o asset existente
    for (const m of html.matchAll(/(?:href|src)="([^"#][^"]*)"/g)) {
      const url = m[1];
      if (/^(https?:|mailto:|tel:|data:)/.test(url)) continue;
      const abs = url.startsWith('/')
        ? join(DIST, url.split('?')[0])
        : join(DIST, dirname(ruta), url.split('?')[0]);
      const candidatos = [abs, join(abs, 'index.html')];
      if (!candidatos.some(existsSync)) { console.error(`✘ ${ruta}: enlace roto → ${url}`); errores++; }
    }
    // anclas: todo href="#x" debe tener id="x" en la misma página
    const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map(m => m[1]));
    for (const m of html.matchAll(/href="#([^"]+)"/g)) {
      if (!ids.has(m[1])) { console.error(`✘ ${ruta}: ancla sin destino → #${m[1]}`); errores++; }
    }
    // IDs duplicados
    const vistosIds = new Set();
    for (const m of html.matchAll(/ id="([^"]+)"/g)) {
      if (vistosIds.has(m[1])) { console.error(`✘ ${ruta}: id duplicado → #${m[1]}`); errores++; }
      vistosIds.add(m[1]);
    }
    // exactamente un h1 (las páginas de redirección quedan exentas)
    const h1s = (html.match(/<h1[\s>]/g) || []).length;
    if (h1s !== 1 && !esRedirect) { console.error(`✘ ${ruta}: ${h1s} <h1> (debe haber exactamente 1)`); errores++; }
    // imágenes sin alt
    for (const m of html.matchAll(/<img(?![^>]*\balt=)[^>]*>/g)) { console.error(`✘ ${ruta}: <img> sin alt → ${m[0].slice(0, 80)}`); errores++; }
    // target=_blank sin noopener
    for (const m of html.matchAll(/<a[^>]*target="_blank"(?![^>]*noopener)[^>]*>/g)) { console.error(`✘ ${ruta}: _blank sin noopener → ${m[0].slice(0, 80)}`); errores++; }
    // http:// inseguro
    for (const m of html.matchAll(/(?:href|src)="http:\/\/[^"]*"/g)) { console.error(`✘ ${ruta}: URL http insegura → ${m[0].slice(0, 90)}`); errores++; }
    // Toda imagen local debe declarar width/height, y esos numeros deben
    // ser los del archivo. Un width/height inventado reserva la caja
    // equivocada: es CLS garantizado y deforma la figura.
    for (const m of html.matchAll(/<img [^>]*>/g)) {
      const tag = m[0];
      const src = (tag.match(/src="([^"]+)"/) || [])[1] || '';
      if (!src || /^https?:/.test(src)) continue;              // remotas: fuera de nuestro control
      const rel = src.replace(/^(?:\.\.\/)+|^\//, '').replace(/^assets\//, '');
      if (/\.svg$/.test(rel)) continue;                        // el SVG escala solo
      const w = +((tag.match(/width="(\d+)"/) || [])[1] || 0);
      const h = +((tag.match(/height="(\d+)"/) || [])[1] || 0);
      if (!w || !h) { console.error(`✘ ${ruta}: <img> sin width/height → ${src}`); errores++; continue; }
      let real;
      try { real = medir(rel); } catch { console.error(`✘ ${ruta}: no se pudo medir → ${rel}`); errores++; continue; }
      if (real.w !== w || real.h !== h) {
        console.error(`✘ ${ruta}: ${src} declara ${w}x${h} pero el archivo es ${real.w}x${real.h}`); errores++;
      }
    }
  }
  // Los woff2 que referencia el CSS deben existir (una @font-face rota
  // no da error de build por sí sola)
  const cssFinal = readFileSync(join(DIST, 'css/styles.css'), 'utf8');
  for (const m of cssFinal.matchAll(/url\('([^']+\.woff2)'\)/g)) {
    if (!existsSync(join(DIST, 'css', m[1]))) { console.error(`✘ css/styles.css: fuente inexistente → ${m[1]}`); errores++; }
  }
  if (errores) { console.error(`\n✘ ${errores} problema(s).`); process.exit(1); }
  console.log('✔ Verificaciones: enlaces, anclas, ids únicos, h1 único, alt, dimensiones reales, noopener, https, fuentes — todo OK');
}
