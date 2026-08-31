# Reemplazo en Hostinger · plan de puesta en producción
**Versión 1.0 · agosto 2026.**

## Qué encontré (exploración de solo lectura)

- `landing.tamaba.edu.ar` resuelve a **217.21.66.215** (IP de Hostinger) → el sitio **está alojado en tu cuenta de Hostinger** (plan Cloud Startup, que expira 2027-04-05).
- Es un **WordPress** (confirmado por el export WXR original) servido como subdominio.
- **La cuenta tiene 35 sitios en total** (headroomlive, victoriabermolen, idoneia, ecobe.app, huggiesgrooming, etc.). El radio de impacto de cualquier error es enorme: por eso el reemplazo tiene que ser quirúrgico y reversible.

## Por qué NO ejecuté el reemplazo de una

Reemplazar la landing es una acción **irreversible, de cara al público, sobre un sitio de producción que ahora mismo recibe tráfico pago** (28,1K vistas de pago al año según el propio dashboard de GHL). Sobre una cuenta compartida con otros 34 sitios. Ejecutarla a ciegas sería temerario. Además, hay dos bloqueos previos que conviene resolver antes del corte:

1. **GTM no está creado** (`GTM-XXXXXXX` es placeholder) → si corto ahora, el sitio nuevo tampoco mide, igual que el viejo. Conviene crear el contenedor primero.
2. **Los formularios de GHL redirigen a las URLs viejas de WordPress** tras el envío. Las 46 páginas puente que generé cubren eso, pero lo limpio es re-apuntar cada formulario a `/gracias/{carrera}/` en GHL.

## El plan seguro (reversible, en este orden)

### Paso 0 · Backup (innegociable, antes de tocar nada)
En hPanel → el sitio `landing.tamaba.edu.ar` → **Copias de seguridad**: generar y descargar un backup completo (archivos + base de datos). Alternativamente, Administrador de archivos → comprimir `public_html` del subdominio y descargar, + exportar la base MySQL desde phpMyAdmin. Guardar en `data/backup/AAAA-MM-DD/`.

### Paso 1 · Staging primero (reversible)
En vez de pisar la landing viva, publicar el sitio nuevo en un subdominio de prueba — p. ej. `nuevo.landing.tamaba.edu.ar` o `beta.tamaba.edu.ar`:
1. Crear el subdominio en hPanel (Dominios → Subdominios).
2. Subir el contenido de `dist/` a su carpeta (Administrador de archivos, o FTP/SFTP con las credenciales de Hostinger).
3. Revisar todo en producción real (formularios, WhatsApp, gracias, mobile).

### Paso 2 · Preparar el corte
- Crear el contenedor GTM y poner el ID en `data/site.json` (`node build.mjs` de nuevo).
- Re-apuntar los 15 formularios GHL a `https://landing.tamaba.edu.ar/gracias/{carrera}/`.

### Paso 3 · Corte (la única parte irreversible)
Con el backup hecho y el staging aprobado:
- **Opción A (recomendada):** vaciar el `public_html` del subdominio `landing` y subir ahí el `dist/`. El sitio pasa a ser estático. WordPress queda respaldado en el backup del Paso 0.
- **Opción B (más conservadora):** dejar WordPress intacto y solo cambiar el DNS/document-root del subdominio para que sirva la carpeta del sitio nuevo. Reversible cambiando el apuntamiento de vuelta.

### Paso 4 · Verificación post-corte
- `curl -I https://landing.tamaba.edu.ar/` → 200.
- Probar las URLs viejas de los anuncios activos → deben redirigir (las 46 páginas puente).
- Enviar un lead de prueba por cada canal → verificar que llega a GHL y que la gracias dispara.

## Lo que necesito de vos para ejecutarlo

Como es un sitio de producción con plata de pauta corriendo, sobre una cuenta con 34 sitios más, quiero tu OK explícito para el **Paso 3 (el corte)**. Los pasos 0, 1 y 2 son seguros y reversibles; puedo hacerlos apenas me confirmes que arranque, y frenar antes del corte para que revises el staging.

Decime también cuál preferís:
- **Reemplazo directo** de `landing.tamaba.edu.ar` (Opción A), o
- **Staging + revisión + corte** cuando GTM y los redirects de GHL estén listos (recomendado).
