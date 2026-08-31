# Diseño del back-end con CRM propio · TAMABA
**Versión 1.0 · agosto 2026 · insumo: [GHL-AUDIT.md](GHL-AUDIT.md) + el sitio estático de este repo.**

Propuesta para construir un back-end propio que reemplace (total o parcialmente) el rol de GoHighLevel como CRM de captación de leads. El objetivo no es tirar GHL de un día para el otro, sino tener **la base de datos y la lógica del embudo en infraestructura propia**, con GHL degradado a lo que hace bien (o retirado del todo).

---

## 1 · Principio rector

El sitio nuevo ya emite **eventos de lead limpios** (`generate_lead`, `form_visible`, `cta_click`) y ya tiene **una arquitectura de atribución por UTM** (ver `docs/TRACKING.md`). El back-end propio se enchufa a eso: recibe el lead, lo guarda con su atribución, y lo hace avanzar por un pipeline. GHL puede seguir recibiendo el mismo lead en paralelo durante la transición.

## 2 · Modelo de datos (derivado 1:1 de la auditoría GHL)

### Tabla `leads` (= Contacto)
```sql
id                    uuid primary key
created_at            timestamptz not null default now()
updated_at            timestamptz not null default now()
-- identidad
nombre                text not null
apellido              text
email                 text not null
celular               text not null
-- perfilado (los 7 campos propios de TAMABA)
es_alumno             boolean default false          -- ¿Sos Alumno de Tamaba?
carrera_interes       text                           -- slug: sonido-distancia, musico-profesional, ...
nivel_estudios        text                           -- secundario_completo | secundario_en_curso | terciario
instrumento_interes   text                           -- solo Músico
nivel_instrumento     text                           -- solo Músico
nivel_canto           text                           -- solo Cantante
tiempo_canto          text                           -- solo Cantante
-- atribución (de tracking.js)
canal_pago            text                           -- gads | mads | pmax | directo
utm_source            text
utm_medium            text
utm_campaign          text
utm_term              text
utm_content           text
gclid                 text
fbclid                text
-- consentimiento (Ley 25.326)
consent_marketing     boolean not null default false
consent_ts            timestamptz
-- estado del embudo
etapa                 text not null default 'nuevo'  -- ver pipeline §3
propietario           text                           -- usuario asignado
motivo_perdido        text
```

### Tabla `interacciones` (timeline del lead)
```sql
id           uuid primary key
lead_id      uuid references leads(id)
tipo         text     -- form_submit | whatsapp | email | llamada | booking_visita | booking_online | asistio_evento | nota
payload      jsonb    -- datos del evento
created_at   timestamptz default now()
```

### Tabla `eventos_analytics` (opcional, espejo del dataLayer)
```sql
id        bigserial primary key
lead_id   uuid null references leads(id)
evento    text     -- page_view_landing | form_visible | cta_click | generate_lead | scroll_depth
params    jsonb
session   text
ts        timestamptz default now()
```

## 3 · El pipeline (lo que GHL no tiene y la encuesta ya dibuja)

```
nuevo → contactado → agendo_evento → asistio_evento → en_proceso → inscripto
                                                              ↘ perdido (con motivo)
```

Cada etapa es medible y ataca la fuga real: **solo el 38 % asiste al evento** (dato de la encuesta). El pipeline hace visible dónde se cae cada lead.

## 4 · Arquitectura técnica recomendada

Manteniendo la filosofía del proyecto (simple, sin dependencias pesadas, portable):

| Capa | Opción recomendada | Por qué |
|------|-------------------|---------|
| **Ingesta** | Un endpoint serverless (`/api/lead`) — Cloudflare Workers, Vercel Functions o un PHP simple en el mismo Hostinger | Recibe el POST del formulario y el `generate_lead`. Sin servidor que mantener. |
| **Base de datos** | PostgreSQL gestionado (Supabase capa gratis, Neon) o MySQL del propio Hostinger | Supabase da además API REST + auth + panel gratis; encaja con el modelo de §2. |
| **Panel/CRM UI** | Supabase Studio para empezar; después un panel propio (mismo stack estático del sitio + API) | Ver y mover leads por el pipeline sin construir todo de cero. |
| **Notificaciones** | Webhook → WhatsApp Business API / email (SMTP del Hostinger) | Avisar al equipo de admisiones al instante (la conversión cae ~10× tras la 1.ª hora). |
| **Sincronización con Ads** | Job que envía conversiones offline a Google/Meta cuando `etapa` pasa a `inscripto` | Lo que hoy GHL no hace: optimizar la puja a inscripción real. |

## 5 · Estrategia de convivencia con GHL (3 fases)

**Fase 1 — Espejo (sin riesgo).** Los formularios siguen siendo GHL. Se agrega un webhook de GHL → `/api/lead` que copia cada lead nuevo a la base propia. GHL sigue siendo la fuente de verdad; la base propia se llena en paralelo para validar el modelo.

**Fase 2 — Doble escritura.** El sitio nuevo puede postear el lead a AMBOS (GHL vía iframe + `/api/lead` propio) o reemplazar el iframe por un formulario propio que escribe en la base y opcionalmente reenvía a GHL. Se estrena el panel propio para el seguimiento del pipeline.

**Fase 3 — Corte.** Cuando el panel propio cubre lo que el equipo necesita, los formularios GHL se retiran y el iframe se reemplaza por un formulario nativo del sitio (más rápido, sin dependencia de terceros, atribución 100 % propia). GHL se da de baja o queda solo para calendarios.

## 6 · Migración de datos existentes

Los contactos históricos viven en GHL. Antes de cortar:
1. Exportar contactos desde GHL (Contactos → Exportar CSV) — incluye los 7 campos custom.
2. Exportar las opciones de cada desplegable (abrir cada campo en Configuración → Campos personalizados).
3. `INSERT` en la tabla `leads` mapeando por la clave GHL de §2 del audit.
4. Guardar el CSV con fecha en `data/backup/AAAA-MM-DD/` del repo.

## 7 · Qué falta relevar para completar esto (pendientes)

- **Las opciones exactas de los 7 desplegables** (no se transcribieron campo por campo en la auditoría).
- **El volumen de contactos** en GHL (la UI no lo expone por texto; se obtiene del export CSV).
- **Los detalles de los calendarios** (disponibilidad, duración, notificaciones) si se quieren replicar.
- **Las integraciones de Ads** que hoy dan «Error al cargar datos» — decidir si se reconectan en GHL o se resuelven directo desde el back-end propio.
