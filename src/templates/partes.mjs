/** Piezas compartidas entre plantillas.
 *  `p` es siempre el prefijo de ruta que calcula layout.mjs ('' o '../'). */

/** Franja de credenciales. Los ocho logos son fondos heterogéneos
 *  (siete claros, uno azul sólido), así que cada uno vive en su propia
 *  chapa clara de altura fija: la franja se lee pareja aunque las marcas
 *  no lo sean. Van a color: son credenciales, no decoración. */
export function franjaAlianzas(site, p, dim, { claro = false } = {}) {
  return `
<!-- ══ ALIANZAS Y CERTIFICACIONES ══ -->
<section class="seccion${claro ? ' seccion-clara' : ''} seccion-alianzas" aria-labelledby="tit-alianzas">
  <p class="etiqueta">Certificaciones y alianzas</p>
  <h2 class="titulo-display" id="tit-alianzas">No lo decimos solo nosotros.<br><em>Está certificado.</em></h2>
  <ul class="alianzas">
${site.alianzas.map(a => `    <li class="alianza revela">
      <span class="alianza-chapa"><img src="${p}assets/img/${a.img}.webp" alt="${a.alt}" loading="lazy" ${dim(`img/${a.img}.webp`)}></span>
      <span class="alianza-nota">${a.nota}</span>
    </li>`).join('\n')}
  </ul>
</section>`;
}

/** Firma de aniversario. El lockup existe a 113 px de ancho: se usa a su
 *  tamaño real, no ampliado. */
export function sello30(p, dim) {
  return `<img class="sello-30" src="${p}assets/logos/logo-30-blanco.png" alt="TAMABA · 30 años" ${dim('logos/logo-30-blanco.png')} loading="lazy">`;
}

/** Separador de forma de onda: el motivo de marca que más sentido tiene
 *  en un instituto de sonido. Decorativo y puramente CSS/SVG, sin peso. */
export function onda() {
  return `<div class="onda" aria-hidden="true"><svg viewBox="0 0 1200 40" preserveAspectRatio="none" focusable="false">${
    Array.from({ length: 120 }, (_, i) => {
      // Envolvente determinista: dos senos desfasados. Misma forma en cada build.
      const h = 4 + Math.abs(Math.sin(i * 0.31) * 13 + Math.sin(i * 0.11) * 6);
      return `<rect x="${i * 10 + 3}" y="${20 - h / 2}" width="4" height="${h.toFixed(1)}" rx="1.5"/>`;
    }).join('')
  }</svg></div>`;
}
