/** Páginas legales: política de privacidad y bases del sorteo (archivo). */

export function legal({ site }, cual) {
  if (cual === 'privacidad') {
    return `
<article class="legal">
  <h1>Política de Privacidad</h1>
  <p class="legal-fecha">Última actualización: agosto de 2026</p>

  <h2>1 · Responsable del tratamiento</h2>
  <p>${site.nombreLegal}, CUIT ${site.cuit}, con domicilio en ${site.direccion} (en adelante, «TAMABA»), es responsable del tratamiento de los datos personales recabados a través de este sitio.</p>

  <h2>2 · Qué datos recolectamos</h2>
  <p>A través de los formularios de consulta recolectamos: nombre, número de teléfono y dirección de correo electrónico, junto con la carrera o curso por el que consultás y, opcionalmente, el texto de tu consulta. También registramos datos de navegación anónimos (páginas visitadas, origen de la visita) con fines estadísticos y de mejora del sitio.</p>

  <h2>3 · Para qué los usamos</h2>
  <p>Usamos tus datos exclusivamente para: (a) responder tu consulta y brindarte información sobre nuestra oferta académica; (b) gestionar tu inscripción si decidís avanzar; (c) invitarte a eventos informativos de TAMABA; y (d) elaborar estadísticas internas. No vendemos ni cedemos tus datos a terceros con fines comerciales.</p>

  <h2>4 · Dónde se almacenan</h2>
  <p>Los datos de los formularios se procesan y almacenan en nuestra plataforma de gestión de contactos (GoHighLevel / LeadConnector) y en los sistemas internos de TAMABA, con acceso restringido al personal de admisiones y comunicaciones.</p>

  <h2>5 · Tus derechos</h2>
  <p>Conforme a la Ley 25.326 de Protección de los Datos Personales, podés ejercer en cualquier momento tus derechos de acceso, rectificación y supresión escribiendo a <a href="mailto:${site.emails.info}">${site.emails.info}</a>. La Agencia de Acceso a la Información Pública, órgano de control de la Ley 25.326, tiene la atribución de atender las denuncias y reclamos que se interpongan con relación al incumplimiento de las normas sobre protección de datos personales.</p>

  <h2>6 · Cookies y mediciones</h2>
  <p>Este sitio utiliza herramientas de medición de audiencia y conversión (Google Tag Manager, Google Analytics y píxeles publicitarios) que pueden emplear cookies. Podés bloquearlas desde la configuración de tu navegador sin que eso afecte la navegación del sitio.</p>

  <h2>7 · Contacto</h2>
  <p>Ante cualquier duda sobre esta política, escribinos a <a href="mailto:${site.emails.info}">${site.emails.info}</a> o llamanos al <a href="tel:${site.telefonoHref}">${site.telefono}</a>.</p>
</article>`;
  }

  // Bases del sorteo (texto corregido de la edición agosto 2026, archivado)
  return `
<article class="legal">
  <p class="chip chip-neutro">Documento de archivo · edición julio–agosto 2026</p>
  <h1>Bases y Condiciones · Sorteo de Becas TAMABA</h1>

  <h2>1 · Organizador</h2>
  <p>La presente promoción (la «Promoción») es organizada por ${site.nombreLegal}, CUIT ${site.cuit}, con domicilio en ${site.direccion} (en adelante, «TAMABA»).</p>

  <h2>2 · Vigencia</h2>
  <p>La Promoción tuvo vigencia desde el 16 de julio de 2026 hasta el 14 de agosto de 2026, inclusive (el «Período de Vigencia»). Toda participación registrada fuera de dicho período se considera nula.</p>

  <h2>3 · Ámbito y participantes</h2>
  <p>Pudieron participar las personas humanas mayores de 18 años, residentes en la República Argentina, que cumplieran con la totalidad de los requisitos establecidos en estas Bases. Quedó excluido el personal de TAMABA, sus autoridades y sus familiares directos.</p>

  <h2>4 · Gratuidad</h2>
  <p>La participación fue libre y gratuita, sin ningún tipo de compra, contratación ni pago previo.</p>

  <h2>5 · Mecánica de participación</h2>
  <p>Para participar, el interesado debió cumplir, de manera conjunta y sucesiva, tres pasos: (a) completar en su totalidad la encuesta de perfil del estudiante; (b) registrarse en el encuentro informativo online de TAMABA; y (c) participar efectivamente y en vivo de dicho encuentro. El cumplimiento de los tres pasos fue condición excluyente.</p>

  <h2>6 · Premios</h2>
  <p>Entre los participantes habilitados se sortearon: 1 (una) beca del 50 % sobre el valor de las cuotas/arancel durante el primer año (1 o 2 cuatrimestres) y 5 (cinco) becas del 30 % sobre el mismo concepto, para cursar cualquiera de las carreras disponibles en TAMABA. Las becas no incluyen matrícula, materiales ni otros conceptos adicionales; son personales, intransferibles y no convertibles en dinero.</p>

  <h2>7 · Datos personales</h2>
  <p>Los datos suministrados por los participantes fueron tratados conforme a la Ley 25.326 de Protección de los Datos Personales y a nuestra <a href="../privacidad/">Política de Privacidad</a>. El titular de los datos puede ejercer sus derechos de acceso, rectificación y supresión escribiendo a <a href="mailto:${site.emails.info}">${site.emails.info}</a>.</p>

  <p class="nota-al-pie">Este documento se conserva publicado como archivo de la edición julio–agosto 2026. Cuando se lance una nueva edición del sorteo, sus bases se publicarán en esta misma dirección con su período de vigencia actualizado.</p>
</article>`;
}
