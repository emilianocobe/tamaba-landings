# Auditoría de GoHighLevel · Subcuenta TAMABA
**Versión 1.0 · agosto 2026 · método: inspección directa de la subcuenta en vivo (locationId `2PAzxM0e3lqoGjTWNoAo`, agencia Emiliano Cobe / hola@ecobe.digital), leyendo cada sección de configuración. Verificado por navegación, no de memoria.**

El objetivo es doble: (a) documentar exactamente qué se usa en GHL, y (b) extraer el esquema de datos para poder construir un back-end con CRM propio. La conclusión de fondo: **TAMABA usa GHL como captador de leads (formularios + calendarios de reserva) con un esquema de contacto simple, sin pipelines, tags ni automatización compleja.** Eso hace que replicarlo en un CRM propio sea perfectamente abordable.

---

## 1 · Resumen ejecutivo

| Componente GHL | Estado en la subcuenta | Implicación para el CRM propio |
|----------------|------------------------|--------------------------------|
| **Campos personalizados** | 40 (22 contacto, 8 oportunidad, 10 empresa) — **7 propios de TAMABA**, el resto estándar | Son el **esquema de datos** a replicar. Detalle en §2. |
| **Pipelines / oportunidades** | **Ninguno** («Aún no hay secuencias») | El seguimiento comercial no está modelado. Oportunidad de mejora: §5. |
| **Etiquetas (tags)** | **0** | Sin segmentación por tags. El CRM propio puede introducirlas. |
| **Valores personalizados** | **0** | Sin constantes de negocio centralizadas. |
| **Objetos** | Solo estándar (Contacto, Oportunidad, Empresa) | Sin objetos custom. Modelo relacional simple. |
| **Formularios** | 15 formularios embebidos (IDs conocidos) | El punto de captura. Mapa en §3. |
| **Calendarios** | 2 bookings activos (visita presencial, encuentro online) | Reservas de eventos. §4. |
| **Analítica (dashboard)** | GA integrado: 110,8K visitantes/año, 28,1K vistas de pago | Confirma el volumen de tráfico pago. Ads/Facebook: «Error al cargar datos». |

---

## 2 · El esquema de datos (campos personalizados)

### 2.1 Campos PROPIOS de TAMABA — objeto Contacto (7)

Estos son los que definen el negocio y **deben existir en el CRM propio**. Todos son de tipo *menú desplegable (selección única)* salvo indicación:

| # | Nombre | Clave GHL | Propósito |
|---|--------|-----------|-----------|
| 1 | ¿Sos Alumno de Tamaba? | `contact.sos_alumno_de_tamaba` | Distingue prospecto de alumno actual (creado ago-2026, el más nuevo) |
| 2 | Carrera de interés | `contact.carrera_de_inters` | La carrera/curso por la que consulta |
| 3 | ¿Qué nivel de estudio del instrumento tenés? | `contact.qu_nivel_de_estudio_del_instrumento_tens` | Perfilado para Músico Profesional |
| 4 | ¿Qué instrumento te interesa? | `contact.qu_instrumento_te_interesa` | Perfilado para Músico Profesional |
| 5 | ¿Cuánto tiempo hace que cantás de forma aficionada? | `contact.cunto_tiempo_hace_que_cants_de_forma_aficionada` | Perfilado para Cantante Profesional |
| 6 | ¿Qué nivel de estudio de canto tenés? | `contact.qu_nivel_de_estudio_de_canto_tens` | Perfilado para Cantante Profesional |
| 7 | ¿Cuál es tu nivel de estudios actual? | `contact.cul_es_tu_nivel_de_estudios_actual` | Secundario completo / en curso — requisito de ingreso |

### 2.1.b Opciones exactas de cada desplegable

Capturadas una por una abriendo cada campo en GHL. **Este es el diccionario de valores que el CRM propio debe replicar.**

**`carrera_de_inters` — Carrera de interés** (4 opciones)
- Cantante Profesional
- Músico Profesional
- Sonido y Producción Musical Presencial
- Sonido y Producción Musical a Distancia

> Ojo: no incluye MDQ, Curso de Sonido, Mediciones Acústicas ni Pro Tools, que sí existen como landings. Los leads de esos productos no tienen valor propio en este campo.

**`cul_es_tu_nivel_de_estudios_actual` — ¿Cuál es tu nivel de estudios actual?** (4)
- Secundario completo o grado superior
- Me faltan rendir materias del secundario
- Estoy en el último año de cursada del secundario
- Estoy cursando el secundario (Aún no llegué al último año)

**`sos_alumno_de_tamaba` — ¿Sos Alumno de Tamaba?** (2)
- Si · No

**`qu_instrumento_te_interesa` — ¿Qué instrumento te interesa?** (7)
- Bajo · Bandoneón · Flauta · Guitarra · Piano · Saxo · Teclado

**`qu_nivel_de_estudio_del_instrumento_tens` — Nivel de instrumento** (3)
- Más de un año · Solo he visto tutoriales · No tengo ningún estudio

**`qu_nivel_de_estudio_de_canto_tens` — Nivel de canto** (3)
- Más de un año de estudio · Solo he visto tutoriales · No tengo ningún estudio

**`cunto_tiempo_hace_que_cants_de_forma_aficionada` — Tiempo cantando** (3)
- Más de un año · Menos de un año · No canto

### 2.2 Campos estándar de Contacto (los 15 restantes)

`first_name`, `last_name`, `email`, `phone` (el core de GHL), más: `company_name`, `address1`, `city`, `state`, `country` (desplegable), `postal_code`, `website`, `timezone` (desplegable), **`contact.source`** (Fuente de contacto) y **`contact.type`**. Carpetas «General Info» / «Contact».

> `contact.source` es relevante para el CRM: hoy es el campo donde GHL deja la procedencia del lead. En el modelo propio se reemplaza por los campos de atribución (`canal_pago`, `utm_*`, `gclid`, `fbclid`).

### 2.3 Campos de Oportunidad (8) — TODOS estándar

`name`, `pipeline_id`, `pipeline_stage_id`, `status`, `monetary_value` (monetario), `assigned_to` (propietario), `source`, `lost_reason`. **No hay campos custom en oportunidad**: si algún día se usa el pipeline, toda la info del lead vive en el contacto.

### 2.4 Campos de Empresa (10) — estándar de negocio

`business.name`, `business.email`, `business.phone`, `business.website`, `business.address`, `business.city`, `business.state`, `business.country` (desplegable), `business.postalcode`, `business.description`. No se usan activamente (TAMABA trabaja a nivel contacto, no empresa).

---

## 3 · Formularios (los 15 puntos de captura)

Los formularios son iframes de `api.leadconnectorhq.com/widget/form/{id}`. Del cruce con el export WXR del sitio viejo, los IDs por carrera×canal son:

| Carrera | Gads | Mads | Pmax |
|---------|------|------|------|
| Sonido a Distancia | `WXYBDJYAFGG8xlRJhZlw` | `NjfOWmICeOeELPxF30in` | `vfgt61jPBGIghkYzYaKb` |
| Sonido Presencial | `d8RJhGMJ0WtMxOV9pmd4` | `rklNeVJSwLKPscjn5sHy` | `yfFpRT3aaj0d3aHwaQuV` |
| Músico Profesional | `yYofFCXvb09pTsXKh0Tk` | `Nj2ubdhcVCWF6nTntJBl` | `JkBrGuNbzDaE0y4pVoVX` |
| Cantante Profesional | `NJYRnusRZwy9gQFBzaNy` | `kKH6VTuUiYSUyeRwNLnb` | `23UrjewAZo0BbGvrF9vy` |
| Sonido a Distancia MDQ | `1IXyyW6m9XkvUqOYuQKw` | `aDvzkXf4Iy1PHBMmilzV` | `RF6ze343O7r1J4YJvUgJ` |

**Campos comunes de los formularios** (del WXR): Nombre, Celular (tel), Email, y según el caso el desplegable «¿Cuál es tu nivel de estudios actual?». Todos mapean a los campos de contacto de §2.

**El único formulario que exporta el WXR con casilla de consentimiento** es el del sitio nuevo. Recomendación: que todos los formularios GHL incluyan la casilla de consentimiento de marketing (Ley 25.326).

---

## 4 · Calendarios (reservas de eventos)

Dos bookings activos, embebidos como `api.leadconnectorhq.com/widget/booking/{id}`:

| Evento | ID de booking |
|--------|---------------|
| Visita presencial | `B32S9qH8gZ9pOZ5q3Fcm` |
| Encuentro informativo online | `QpZjHqnAWdW0HvH5nKsO` |

Son el «segundo CTA» del embudo (la fuga que la encuesta identificó: solo 38 % asiste). El sitio nuevo ya los enlaza desde `/eventos/` y desde cada página de gracias.

---

## 5 · Lo que NO está configurado (y debería, en el CRM propio)

1. **Pipeline de oportunidades**: hoy los leads son solo contactos. El embudo que la encuesta ya dibuja debería modelarse como etapas:
   `Nuevo → Contactado → Agendó evento → Asistió al evento → En proceso → Inscripto` (+ `Perdido` con motivo).
2. **Tags de segmentación**: por carrera, por canal (gads/mads/pmax), por estado del embudo, por campaña (beca).
3. **Conversiones offline hacia Ads/Meta**: el dashboard muestra «Error al cargar datos» en Google Ads y Facebook Ads — las integraciones de reporte están caídas o sin conectar. Sin esto, la puja optimiza a lead, no a inscripto.
4. **Valores personalizados**: constantes de negocio (aranceles, fechas de cursada, links) centralizadas para automatizaciones.

---

## 6 · Conclusión para el CRM propio

El modelo de datos a replicar es **simple y acotado**, lo cual es una buena noticia:

- **Una entidad central: el Contacto (= Lead).** Con los campos de §2.1 + §2.2.
- **Una entidad de seguimiento: la Oportunidad**, que hoy no se usa pero conviene introducir con el pipeline de §5.1.
- **Sin objetos custom, sin automatizaciones complejas que migrar.**

El diseño del back-end propio está en [CRM-BACKEND.md](CRM-BACKEND.md).
