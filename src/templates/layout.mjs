/** Cáscara de página: head, header, footer, CTA móvil, scripts. */

const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');

export function layout(contenido, o) {
  // o.absoluto: rutas desde la raíz (la 404 se sirve en cualquier URL)
  const p = o.absoluto ? '/' : '../'.repeat(o.depth);
  const { site } = o;
  const canonical = site.dominio + (o.ruta || '/');
  return `<!DOCTYPE html>
<html lang="es-AR" class="sin-js">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(o.titulo)}</title>
<meta name="description" content="${esc(o.descripcion)}">
${o.noindex ? '<meta name="robots" content="noindex, nofollow">' : `<link rel="canonical" href="${canonical}">`}
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(o.titulo)}">
<meta property="og:description" content="${esc(o.descripcion)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${site.dominio}/${o.ogImg || 'assets/img/sede-tamaba.webp'}">
<meta property="og:locale" content="es_AR">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/svg+xml" href="${p}assets/favicon.svg">
<link rel="preload" href="${p}assets/fonts/bebas-neue-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${p}assets/fonts/barlow-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${p}css/styles.css">
<script>window.TB={canales:${JSON.stringify(site.tracking.canales)},gtmId:"${site.tracking.gtmId}",esGracias:${!!o.esGracias},slug:"${o.slugCarrera || ''}"};</script>
<script src="${p}js/tracking.js" defer></script>
<script src="${p}js/main.js" defer></script>
${o.jsonLd ? `<script type="application/ld+json">${JSON.stringify(o.jsonLd)}</script>` : ''}
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'EducationalOrganization',
    name: 'Instituto Terciario TAMABA', url: site.dominio, logo: site.dominio + '/assets/logos/logo-tamaba-rojo.png',
    telephone: site.telefono, email: site.emails.info,
    address: { '@type': 'PostalAddress', streetAddress: 'Adolfo Alsina 1994', addressLocality: 'Ciudad Autónoma de Buenos Aires', addressCountry: 'AR' },
    sameAs: [site.redes.instagram, site.redes.youtube],
    foundingDate: String(site.fundacion)
  })}</script>
</head>
<body>
<a class="salto" href="#contenido">Ir al contenido</a>
<div class="progreso" aria-hidden="true"><span id="progreso-lectura"></span></div>

<header class="cabecera" id="cabecera">
  <a class="cabecera-logo" href="${p || './'}" aria-label="TAMABA — inicio">
    <img src="${p}assets/logos/logo-tamaba-blanco.png" alt="TAMABA · Instituto Terciario A-1441" width="126" height="57">
  </a>
  <div class="cabecera-datos" aria-hidden="true">
    <span class="cabecera-anios">30 AÑOS</span>
    <span class="cabecera-reloj" id="reloj-sede" hidden></span>
  </div>
  <a class="boton boton-rojo cabecera-cta" href="${o.cta ? o.cta.href : '#inscripcion'}" data-tb="cta-header">${o.cta ? o.cta.texto : 'Quiero inscribirme'}</a>
</header>

<main id="contenido">
${contenido}
</main>

<footer class="pie">
  <div class="pie-marca">
    <img src="${p}assets/logos/logo-tamaba-rojo.png" alt="TAMABA · Instituto Terciario A-1441" width="180" height="99" loading="lazy">
    <p class="pie-lema">30 años formando profesionales del sonido y la música.</p>
  </div>
  <div class="pie-columnas">
    <div class="pie-col">
      <h2 class="pie-titulo">Sede</h2>
      <address>
        <a href="https://maps.google.com/?q=${site.mapaQuery}" target="_blank" rel="noopener" data-tb="mapa">${site.direccion}</a><br>
        <a href="tel:${site.telefonoHref}" data-tb="tel">${site.telefono}</a><br>
        <a href="mailto:${site.emails.info}" data-tb="mail">${site.emails.info}</a>
      </address>
    </div>
    <div class="pie-col">
      <h2 class="pie-titulo">Carreras y cursos</h2>
      <ul>
${o.carreras.map(c => `        <li><a href="${p}${c.slug}/">${c.nombreCorto}</a></li>`).join('\n')}
      </ul>
    </div>
    <div class="pie-col">
      <h2 class="pie-titulo">Conocenos</h2>
      <ul>
        <li><a href="${p}eventos/">Visitas y encuentros</a></li>
        <li><a href="${site.redes.instagram}" target="_blank" rel="noopener" data-tb="instagram">Instagram</a></li>
        <li><a href="${site.redes.youtube}" target="_blank" rel="noopener" data-tb="youtube">YouTube</a></li>
      </ul>
    </div>
  </div>
  <div class="pie-legal">
    <p>${site.nombreLegal} · CUIT ${site.cuit} · Instituto incorporado a la enseñanza oficial ${site.registro}</p>
    <p><a href="${p}privacidad/">Política de privacidad</a> · <a href="${p}bases-sorteo-beca/">Bases del sorteo de becas</a></p>
  </div>
</footer>

${o.conStickyCta ? `<div class="cta-movil" id="cta-movil" hidden>
  <a class="boton boton-rojo" href="#inscripcion" data-tb="cta-sticky">Consultar ahora</a>
</div>` : ''}
</body>
</html>`;
}
