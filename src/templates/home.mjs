/** Home: selector de carreras + test vocacional + confianza. */

export function home({ site, carreras }) {
  const carrerasPrincipales = carreras.filter(c => c.tipo === 'carrera');
  const cursos = carreras.filter(c => c.tipo !== 'carrera');

  return `
<!-- ══ HERO ══ -->
<section class="hero hero-home">
  <div class="hero-fondo" aria-hidden="true">
    <img src="assets/img/hero-consola.webp" alt="" fetchpriority="high">
  </div>
  <div class="hero-cuerpo">
    <p class="chip chip-rojo">Terciario oficial · A-1441</p>
    <h1 class="hero-titulo">Viví de la música.<br><em>En serio.</em></h1>
    <p class="hero-sub">Carreras terciarias oficiales de sonido, producción musical, música y canto. 30 años formando profesionales en Buenos Aires y a distancia.</p>
    <div class="hero-ctas">
      <a class="boton boton-rojo boton-grande" href="#carreras" data-tb="cta-hero">Elegí tu carrera</a>
      <a class="boton boton-borde" href="#test" data-tb="cta-hero-secundario">¿No sabés cuál? Hacé el test</a>
    </div>
  </div>
  <div class="hero-cinta" aria-hidden="true">
    <div class="cinta-pista">${'<span>SONIDO</span><span>·</span><span>PRODUCCIÓN</span><span>·</span><span>MÚSICA</span><span>·</span><span>CANTO</span><span>·</span>'.repeat(4)}</div>
  </div>
</section>

<!-- ══ CONFIANZA ══ -->
<section class="franja-confianza" aria-label="TAMABA en números">
  <div class="dato-numero"><strong class="contador" data-hasta="30">30</strong><span>años de trayectoria</span></div>
  <div class="dato-numero"><strong>A-1441</strong><span>instituto oficial</span></div>
  <div class="dato-numero"><strong class="contador" data-hasta="${carrerasPrincipales.length}" >${carrerasPrincipales.length}</strong><span>carreras oficiales</span></div>
  <div class="dato-numero"><strong>CABA + online</strong><span>presencial y a distancia</span></div>
</section>

<!-- ══ CARRERAS ══ -->
<section class="seccion" id="carreras">
  <p class="etiqueta">Carreras terciarias</p>
  <h2 class="titulo-display">Título oficial.<br><em>Elegí tu camino.</em></h2>
  <div class="tarjetas">
${carrerasPrincipales.map(c => `    <a class="tarjeta revela" href="${c.slug}/" data-tb="tarjeta-carrera" data-carrera="${c.slug}">
      <figure><img src="assets/img/${c.heroImg}.webp" alt="${c.heroImgAlt}" loading="lazy" width="700" height="460"></figure>
      <div class="tarjeta-cuerpo">
        <h3>${c.nombreCorto}</h3>
        <p>${c.cardTexto || c.heroSub.split('.')[0] + '.'}</p>
        <div class="tarjeta-meta"><span>${c.ficha.modalidad}</span><span>${c.ficha.duracion}</span></div>
        <span class="tarjeta-cta">Conocer la carrera →</span>
      </div>
    </a>`).join('\n')}
  </div>
</section>

<!-- ══ CURSOS ══ -->
<section class="seccion seccion-clara">
  <p class="etiqueta">Cursos y certificaciones</p>
  <h2 class="titulo-display">Formatos cortos,<br><em>certificados en serio</em></h2>
  <div class="tarjetas tarjetas-compactas">
${cursos.map(c => `    <a class="tarjeta tarjeta-clara revela" href="${c.slug}/" data-tb="tarjeta-curso" data-carrera="${c.slug}">
      <div class="tarjeta-cuerpo">
        <span class="chip chip-oscuro">${c.eyebrow}</span>
        <h3>${c.nombreCorto}</h3>
        <p>${c.cardTexto || c.heroSub.split('.')[0] + '.'}</p>
        <span class="tarjeta-cta">Ver detalles →</span>
      </div>
    </a>`).join('\n')}
  </div>
</section>

<!-- ══ TEST VOCACIONAL ══ -->
<section class="seccion" id="test">
  <p class="etiqueta">Test vocacional exprés</p>
  <h2 class="titulo-display">Tres preguntas.<br><em>Tu carrera.</em></h2>
  <div class="quiz" id="quiz">
    <form class="quiz-form" id="quiz-form">
      <fieldset class="quiz-paso" data-paso="1">
        <legend>1 · ¿Qué te imaginás haciendo dentro de cinco años?</legend>
        <label><input type="radio" name="q1" value="produccion"><span>Produciendo y mezclando discos en un estudio</span></label>
        <label><input type="radio" name="q1" value="tocar"><span>Tocando mi instrumento en vivo o en sesiones</span></label>
        <label><input type="radio" name="q1" value="cantar"><span>Cantando en escenarios o grabaciones</span></label>
      </fieldset>
      <fieldset class="quiz-paso" data-paso="2" hidden>
        <legend>2 · ¿Cómo preferís cursar?</legend>
        <label><input type="radio" name="q2" value="distancia"><span>100 % a distancia, desde donde esté</span></label>
        <label><input type="radio" name="q2" value="presencial"><span>Presencial, en el instituto y sus estudios</span></label>
      </fieldset>
      <fieldset class="quiz-paso" data-paso="3" hidden>
        <legend>3 · ¿Cuánto tiempo querés invertir?</legend>
        <label><input type="radio" name="q3" value="carrera"><span>Una carrera completa, con título oficial</span></label>
        <label><input type="radio" name="q3" value="curso"><span>Un curso corto para arrancar ya</span></label>
      </fieldset>
      <div class="quiz-controles">
        <span class="quiz-progreso" aria-live="polite"><b id="quiz-num">1</b> / 3</span>
        <button type="button" class="boton boton-rojo" id="quiz-siguiente">Siguiente</button>
      </div>
    </form>
    <div class="quiz-resultado" id="quiz-resultado" hidden aria-live="polite" tabindex="-1"></div>
  </div>
</section>

<!-- ══ EVENTOS ══ -->
<section class="seccion seccion-clara">
  <p class="etiqueta">Antes de decidir</p>
  <h2 class="titulo-display">Vení a conocernos.<br><em>Es gratis.</em></h2>
  <p class="parrafo-ancho">Visitá el instituto en una recorrida guiada o sumate a un encuentro informativo online. Conocé los estudios, los docentes y el plan de estudios antes de dar el paso.</p>
  <div class="hero-ctas">
    <a class="boton boton-rojo boton-grande" href="eventos/" data-tb="cta-eventos">Agendar mi visita</a>
  </div>
</section>

<!-- ══ VIDEO ══ -->
<section class="seccion">
  <p class="etiqueta">Conocé el instituto</p>
  <h2 class="titulo-display">Mirá TAMABA<br><em>por dentro</em></h2>
  <div class="video-marco revela">
    <button class="video-tapa" data-video="${site.videos.institucional}" aria-label="Reproducir video institucional de TAMABA">
      <img src="https://i.ytimg.com/vi/${site.videos.institucional}/hqdefault.jpg" alt="" loading="lazy" width="480" height="360">
      <span class="video-play" aria-hidden="true">▶</span>
    </button>
    <noscript><p><a href="https://www.youtube.com/watch?v=${site.videos.institucional}" target="_blank" rel="noopener">Ver el video en YouTube</a></p></noscript>
  </div>
</section>

<!-- ══ MAPA ══ -->
<section class="seccion-mapa">
  <div class="mapa-datos">
    <h2 class="titulo-display">Estamos en<br><em>el centro de CABA</em></h2>
    <address>
      ${site.direccion}<br>
      <a href="tel:${site.telefonoHref}" data-tb="tel">${site.telefono}</a><br>
      <a href="mailto:${site.emails.info}" data-tb="mail">${site.emails.info}</a>
    </address>
    <p class="mapa-estado" id="estado-sede" hidden></p>
  </div>
  <iframe class="mapa" src="https://maps.google.com/maps?q=${site.mapaQuery}&z=16&output=embed" title="Mapa: sede de TAMABA en Adolfo Alsina 1994, CABA" loading="lazy"></iframe>
</section>`;
}
