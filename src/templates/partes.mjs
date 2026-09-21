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
 *  tamaño real, no ampliado. `tono` elige la version segun el fondo:
 *  'blanco' para el mundo oscuro, 'negro' para los paneles claros. */
export function sello30(p, dim, tono = 'blanco') {
  const f = `logos/logo-30-${tono}.png`;
  return `<img class="sello-30" src="${p}assets/${f}" alt="TAMABA · 30 años" ${dim(f)} loading="lazy">`;
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

/** Formulario de consulta propio (reemplazo del de GoHighLevel). Mismas preguntas que el
 *  formulario unificado de GHL; lo envía main.js a app.tamaba.edu.ar y, si sale bien, lleva a
 *  /gracias/{slug}/, donde se dispara la conversión como hasta ahora. Se activa por página con
 *  `"formularioPropio": true` en data/carreras/{slug}.json. */
export function formularioPropio(site, c, p) {
  const opciones = (nombre, pares) => pares.map(([v, t]) =>
    `<label class="simu-opcion"><input type="radio" name="${nombre}" value="${v}" required><span><strong>${t}</strong></span></label>`).join('');
  const esMusico = c.slug === 'musico-profesional', esCantante = c.slug === 'cantante-profesional';
  const NIVELES = [['mas_de_un_anio', 'Más de un año'], ['tutoriales', 'Solo tutoriales'], ['sin_estudios', 'Ningún estudio']];
  return `    <form class="simu form-propio" data-api="${site.app}" data-carrera="${c.slug}" data-gracias="${p}gracias/${c.slug}/" novalidate>
      <p class="simu-pregunta">Dejanos tus datos y te escribimos</p>
      <div class="simu-fila">
        <label class="simu-campo">Nombre<input name="nombre" type="text" autocomplete="given-name" maxlength="120" required></label>
        <label class="simu-campo">Apellido<input name="apellido" type="text" autocomplete="family-name" maxlength="120"></label>
      </div>
      <label class="simu-campo">Email<input name="email" type="email" autocomplete="email" maxlength="254" required></label>
      <label class="simu-campo">Celular (WhatsApp)<input name="telefono" type="tel" autocomplete="tel" maxlength="40" placeholder="11 2345 6789" required>
        <span class="simu-ayuda">Con código de área, sin 0 ni 15. Si estás fuera de Argentina, con + y el código de tu país.</span>
      </label>
      <label class="simu-campo">¿Cuál es tu nivel de estudios actual?
        <select name="nivel_estudios" required>
          <option value="">Elegí una opción</option>
          <option value="secundario_completo">Secundario completo o superior</option>
          <option value="faltan_materias">Me faltan rendir materias del secundario</option>
          <option value="ultimo_anio">Estoy en el último año del secundario</option>
          <option value="cursando">Estoy cursando el secundario</option>
        </select>
      </label>
${esMusico ? `      <fieldset class="form-grupo"><legend class="simu-subpregunta">¿Qué instrumento te interesa?</legend>
        <div class="simu-opciones simu-opciones-chicas">${opciones('instrumento', [['guitarra', 'Guitarra'], ['bajo', 'Bajo'], ['bateria', 'Batería'], ['piano', 'Piano'], ['saxo', 'Saxo']])}</div>
      </fieldset>
      <fieldset class="form-grupo"><legend class="simu-subpregunta">¿Cuánto estudiaste tu instrumento?</legend>
        <div class="simu-opciones simu-opciones-chicas">${opciones('nivel_instrumento', NIVELES)}</div>
      </fieldset>` : ''}
${esCantante ? `      <fieldset class="form-grupo"><legend class="simu-subpregunta">¿Cuánto estudiaste canto?</legend>
        <div class="simu-opciones simu-opciones-chicas">${opciones('nivel_canto', NIVELES)}</div>
      </fieldset>
      <fieldset class="form-grupo"><legend class="simu-subpregunta">¿Hace cuánto cantás?</legend>
        <div class="simu-opciones simu-opciones-chicas">${opciones('tiempo_canto', [['mas_de_un_anio', 'Más de un año'], ['menos_de_un_anio', 'Menos de un año'], ['no_canta', 'Todavía no canto']])}</div>
      </fieldset>` : ''}
      <label class="simu-trampa" aria-hidden="true">No completar<input name="sitio_web" type="text" tabindex="-1" autocomplete="off"></label>
      <p class="simu-legal">Al enviar aceptás que TAMABA te contacte por WhatsApp o por mail y la <a href="${p}privacidad/">política de privacidad</a>.</p>
      <button type="submit" class="boton boton-rojo boton-grande form-enviar">Quiero más información</button>
      <p class="simu-error" role="alert" hidden></p>
    </form>
    <noscript><p class="simu-sin-js">Para enviar el formulario hace falta JavaScript. También podés <a href="https://wa.me/${site.whatsappHref}">escribirnos por WhatsApp</a>.</p></noscript>`;
}
