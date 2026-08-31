/** 404 — GitHub Pages sirve /404.html automáticamente. */

export function e404({ carreras }) {
  return `
<section class="hero hero-compacto">
  <div class="hero-cuerpo">
    <p class="chip chip-neutro">Error 404</p>
    <h1 class="hero-titulo">Esta pista<br><em>no existe</em></h1>
    <p class="hero-sub">La página que buscás no está acá. Pero las carreras sí:</p>
    <ul class="lista-404">
${carreras.map(c => `      <li><a href="/${c.slug}/">${c.nombreCorto}</a></li>`).join('\n')}
    </ul>
    <div class="hero-ctas"><a class="boton boton-rojo" href="/">Ir al inicio</a></div>
  </div>
</section>`;
}
