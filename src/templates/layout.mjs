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
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${site.tracking.gtmId}');</script>
<!-- End Google Tag Manager -->
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
<script>window.TB={canales:${JSON.stringify(site.tracking.canales)},gtmId:"${site.tracking.gtmId}",metaPixelId:"${site.tracking.metaPixelId || ''}",esGracias:${!!o.esGracias},slug:"${o.slugCarrera || ''}",carreraNombre:${JSON.stringify(o.carreraNombre || '')}};</script>
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
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${site.tracking.gtmId}" height="0" width="0" style="display:none;visibility:hidden" title="Google Tag Manager"></iframe></noscript>
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
  <a class="boton boton-rojo cabecera-cta" href="${o.cta ? o.cta.href : '#inscripcion'}" data-tb="cta-header">${o.cta ? o.cta.texto : 'Consultar ahora'}</a>
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
<a class="wa-flotante" href="https://wa.me/${site.whatsappHref}?text=${encodeURIComponent(o.waTexto || 'Hola, quiero información sobre las carreras de TAMABA')}" target="_blank" rel="noopener" aria-label="Escribinos por WhatsApp" data-tb="whatsapp-flotante">
  <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
</a>
</body>
</html>`;
}
