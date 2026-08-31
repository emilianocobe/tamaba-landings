/** Piezas compartidas entre plantillas.
 *  `p` es siempre el prefijo de ruta que calcula layout.mjs ('' o '../'). */

/** Franja de credenciales, en marquesina.
 *  Patron de Panni (Catalogo de efectos #19 / METODO seccion 5.1):
 *  el set se duplica y la pista corre a translateX(-50%) en loop; pausa
 *  al pasar el cursor; con reduced-motion la animacion muere y queda una
 *  fila legible. Los logos van en grises y recuperan color al hover
 *  ("grises que recuperan color en hover", metodo Panni) — eso ademas
 *  empareja ocho marcas con fondos incompatibles entre si.
 *  Panel claro: es una franja de confianza, no una pieza de atmosfera. */
export function franjaAlianzas(site, p, dim, medir) {
  /* Normalizacion optica: a altura constante un logo apaisado (Cubase,
     3.6:1) pesa el triple que uno cuadrado (AES, 1:1) y la fila se lee
     despareja. Se iguala el AREA aparente — h = sqrt(area / proporcion) —
     acotada para que la franja no se deforme. Sale de las medidas reales
     del archivo, asi que un logo nuevo se acomoda solo. */
  const AREA = 5200, MIN = 38, MAX = 68;
  const alto = a => {
    const { w, h } = medir(`img/${a.img}.webp`);
    return Math.round(Math.min(MAX, Math.max(MIN, Math.sqrt(AREA / (w / h)))));
  };
  const logo = (a, copia) => `<li class="alianza" style="--alto:${alto(a)}px"${copia ? ' aria-hidden="true"' : ''}>` +
    `<img src="${p}assets/img/${a.img}.webp" alt="${copia ? '' : a.alt}" loading="lazy" ${dim(`img/${a.img}.webp`)}>` +
    `</li>`;
  const set = site.alianzas.map(a => logo(a, false)).join('');
  const copia = site.alianzas.map(a => logo(a, true)).join('');

  return `
<!-- ══ ALIANZAS Y CERTIFICACIONES ══ -->
<section class="franja-alianzas" aria-labelledby="tit-alianzas">
  <h2 class="franja-alianzas-titulo" id="tit-alianzas">Certificaciones y alianzas</h2>
  <div class="alianzas-pista">
    <ul class="alianzas">${set}${copia}</ul>
  </div>
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
