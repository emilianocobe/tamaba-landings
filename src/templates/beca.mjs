/** Campaña de becas. El estado (activa / cerrada) vive en data/campanias/beca.json:
 *  al vencer la campaña se cambia "activa" a false y el sitio muestra el cierre
 *  — nunca más una promo vencida captando participantes (hallazgo LEG-01). */

export function becaPage({ site, beca, carreras }) {
  const p = '../';

  if (!beca.activa) {
    return `
<section class="hero hero-compacto">
  <div class="hero-fondo" aria-hidden="true"><img src="${p}assets/img/sede-tamaba.webp" alt="" fetchpriority="high"></div>
  <div class="hero-cuerpo">
    <p class="chip chip-neutro">Edición ${beca.fechaFin.slice(0, 7)} · cerrada</p>
    <h1 class="hero-titulo">El sorteo de becas<br><em>ya cerró</em></h1>
    <p class="hero-sub">${beca.cierreTexto}</p>
    <div class="hero-ctas">
      <a class="boton boton-rojo boton-grande" href="${p}eventos/" data-tb="cta-beca-cerrada">Conocer TAMABA igual</a>
      <a class="boton boton-borde" href="https://wa.me/${site.telefonoHref.replace('+', '')}?text=${encodeURIComponent('Hola, quiero que me avisen cuando abra el próximo sorteo de becas')}" target="_blank" rel="noopener" data-tb="whatsapp-beca">Avisame de la próxima</a>
    </div>
  </div>
</section>
<section class="seccion">
  <p class="etiqueta">Mientras tanto</p>
  <h2 class="titulo-display">Las carreras siguen<br><em>con inscripción abierta</em></h2>
  <div class="tarjetas">
${carreras.filter(c => c.tipo === 'carrera').map(c => `    <a class="tarjeta revela" href="${p}${c.slug}/" data-tb="tarjeta-carrera" data-carrera="${c.slug}">
      <figure><img src="${p}assets/img/${c.heroImg}.webp" alt="${c.heroImgAlt}" loading="lazy" width="700" height="460"></figure>
      <div class="tarjeta-cuerpo"><h3>${c.nombreCorto}</h3><span class="tarjeta-cta">Conocer la carrera →</span></div>
    </a>`).join('\n')}
  </div>
</section>`;
  }

  return `
<section class="hero">
  <div class="hero-fondo" aria-hidden="true"><img src="${p}assets/img/sede-tamaba.webp" alt="" fetchpriority="high"></div>
  <div class="hero-cuerpo">
    <p class="chip chip-rojo">${beca.nombre}</p>
    <h1 class="hero-titulo">Ganá tu beca<br><em>del ${beca.premios[0].pct}</em></h1>
    <p class="hero-sub">Participá del encuentro informativo de TAMABA y accedé a la chance de estudiar con un descuento real en tus cuotas. Empezá con un solo paso.</p>
    <div class="hero-ctas">
      <a class="boton boton-rojo boton-grande" href="${beca.encuestaUrl}" target="_blank" rel="noopener" data-tb="cta-beca-encuesta">Completar la encuesta</a>
    </div>
    <p class="cuenta-regresiva" id="cuenta-regresiva" data-fin="${beca.fechaFin}T23:59:59-03:00" hidden></p>
  </div>
</section>

<section class="seccion seccion-clara">
  <p class="etiqueta">Cómo participar</p>
  <h2 class="titulo-display">Tres pasos,<br><em>en orden</em></h2>
  <ol class="ruta">
${beca.pasos.map((paso, i) => `    <li class="revela"><span class="ruta-numero">${String(i + 1).padStart(2, '0')}</span><span><em class="ruta-cuando">${paso.cuando}</em><strong>${paso.titulo}.</strong> ${paso.texto}</span></li>`).join('\n')}
  </ol>
</section>

<section class="seccion">
  <p class="etiqueta">Los premios</p>
  <h2 class="titulo-display">Descuentos reales<br><em>en tus cuotas</em></h2>
  <div class="premios">
${beca.premios.map(pr => `    <article class="premio revela"><strong class="premio-pct">${pr.pct}</strong><p>${pr.detalle}</p><span class="premio-cantidad">${pr.cantidad} ${pr.cantidad === 1 ? 'beca' : 'becas'}</span></article>`).join('\n')}
  </div>
  <ul class="condiciones">
${beca.condiciones.map(cond => `    <li>${cond}</li>`).join('\n')}
  </ul>
  <p class="nota-al-pie"><a href="${p}bases-sorteo-beca/">Bases y condiciones completas</a></p>
</section>

<section class="cierre">
  <h2 class="cierre-titulo">¿Qué esperás?</h2>
  <p class="cierre-sub">El encuentro es gratis. Tu primer paso, también.</p>
  <a class="boton boton-rojo boton-grande" href="${beca.encuestaUrl}" target="_blank" rel="noopener" data-tb="cta-beca-final">Completar la encuesta</a>
</section>`;
}
