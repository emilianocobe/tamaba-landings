# GHL — datos crudos capturados (subcuenta Tamaba, locationId 2PAzxM0e3lqoGjTWNoAo)

## Dashboard
- Google Analytics (12m): 110.82K visitantes, 201.7K páginas vistas, 14.77K directo, 28.14K pago, 81.99K social insights, 22.62K orgánico.
- Informe Google Ads y Facebook Ads: "Error al cargar datos" (integraciones caídas o sin permiso).

## Campos personalizados — 40 totales (Contacto 22 · Oportunidad 8 · Empresa 10) · 7 carpetas

### Contacto — campos PROPIOS de TAMABA (7, dropdown único salvo aclaración):
1. ¿Sos Alumno de Tamaba?        contact.sos_alumno_de_tamaba          (creado Aug 05 2026)
2. Carrera de interés            contact.carrera_de_inters             (Apr 03 2026)
3. ¿Qué nivel de estudio del instrumento tenés?  contact.qu_nivel_de_estudio_del_instrumento_tens
4. ¿Qué instrumento te interesa?  contact.qu_instrumento_te_interesa
5. ¿Cuánto tiempo hace que cantás de forma aficionada?  contact.cunto_tiempo_hace_que_cants_de_forma_aficionada
6. ¿Qué nivel de estudio de canto tenés?  contact.qu_nivel_de_estudio_de_canto_tens
7. ¿Cuál es tu nivel de estudios actual?  contact.cul_es_tu_nivel_de_estudios_actual

### Contacto — estándar GHL (carpeta General Info / Contact):
company_name, address1, city, country(dropdown), state, postal_code, website, timezone(dropdown),
first_name, last_name  [+ pág 2: faltan 2, probablemente email/phone/DND]

### Oportunidad — 8 campos, TODOS estándar de GHL (sin personalizados):
name, pipeline_id(dropdown), pipeline_stage_id(dropdown), status(dropdown),
monetary_value(monetario), assigned_to(propietario, dropdown), source(1 línea), lost_reason(dropdown)
→ Implicación CRM: la oportunidad no lleva datos custom; toda la info del lead vive en el CONTACTO.

### Empresa — 10 campos (pendiente de detallar; en general estándar de negocio)

## Pipelines / Secuencias
- **"Aún no hay secuencias"** → NO hay pipelines de oportunidades configurados.
- Implicación: los leads de los formularios entran como CONTACTOS, no como oportunidades en un embudo.
  El seguimiento comercial (contactado / evento / inscripto) hoy no está modelado como etapas.
  → Oportunidad clave para el CRM propio: definir el pipeline que la encuesta ya sugiere
     (Nuevo → Contactado → Agendó evento → Asistió → En proceso → Inscripto / Perdido).

## Etiquetas (tags): 0 — no hay etiquetas configuradas.
## Objetos: solo los estándar (Contacto, Oportunidad, Empresa) — sin objetos custom.

## Valores personalizados (custom values): 0 — no hay.
## Formularios: existen (15 IDs conocidos del export WXR). El builder no cargó por deep-link;
   estructura de campos reconstruida desde los campos personalizados + el WXR.
## Perfil de empresa: Tamaba, CABA, CABA. Usuario agencia: hola@ecobe.digital.
