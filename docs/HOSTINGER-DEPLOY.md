# Deploy en Hostinger · estado y operación
**Versión 2.0 · agosto 2026 · el sitio nuevo YA está en producción.**

## Estado actual

`https://landing.tamaba.edu.ar` sirve el sitio estático nuevo desde Hostinger. Verificado en vivo: home 200, todas las carreras 200, gracias 200, legales 200, assets 200, HTTPS forzado sin loop, gzip activo, caché inmutable en assets, 404 propia, y las 46 redirecciones de las URLs viejas de los anuncios funcionando.

| Dato | Valor |
|------|-------|
| Hosting | Hostinger, plan Cloud Startup (cuenta `tamaba.edu.ar`) |
| Ruta en el servidor | `public_html/landing/` |
| IP | 217.21.66.215 |
| DNS | **AWS Route 53** (nameservers `awsdns-*`) — no se tocó |
| Repo | `github.com/emilianocobe/tamaba-landings` |
| Rama de contenido | **`deploy`** — sitio ya construido, `index.html` en la raíz |

## Cómo se publicó

El WordPress viejo se borró (backup previo del cliente). El contenido de la rama `deploy` se subió a `public_html/landing/` vía la API del File Manager de Hostinger: 73 carpetas creadas y 125 archivos subidos, cero fallos.

## Cómo publicar cambios (hoy)

1. Editás el contenido (`data/*.json`) o el código.
2. `node build.mjs --check` y commit + push a `main`.
3. GitHub Actions regenera automáticamente la rama **`deploy`** con el sitio construido.
4. Subir esa rama al hosting: hoy es el único paso manual. Dos opciones:
   - **Integración Git de Hostinger** (recomendada, ver abajo) → automático.
   - **Manual**: hPanel → Administrador de archivos → `public_html/landing` → subir los archivos nuevos.

## Pendiente: activar la integración Git (deploys 100 % automáticos)

Hostinger tiene **hPanel → Avanzado → GIT**, que clona un repo directamente al hosting. Con eso, publicar sería solo `git push`. Requiere **un click tuyo**: la pantalla pide conectar GitHub por OAuth y ese permiso solo lo puede otorgar el titular de la cuenta.

Pasos (2 minutos, una sola vez):
1. hPanel → sitio `tamaba.edu.ar` → **Avanzado → GIT** → «Continúa con GitHub» → autorizar.
2. Crear el repositorio con estos datos exactos:
   - **Repositorio:** `https://github.com/emilianocobe/tamaba-landings`
   - **Rama:** `deploy` ← importante, NO `main` (main tiene el código fuente; `deploy` tiene el sitio construido)
   - **Directorio de destino:** `public_html/landing`
3. Activar el **auto-deploy / webhook** para que cada push publique solo.

Desde ese momento: `git push` a `main` → Actions construye → rama `deploy` se actualiza → Hostinger la despliega. Sin intervención manual.

## Notas técnicas

- El `.htaccess` lo genera `build.mjs` (HTTPS forzado, `ErrorDocument 404`, gzip, caché). No editarlo a mano en el servidor: se pisa en cada deploy.
- GitHub Pages quedó **sin dominio propio** (se retiró el CNAME) y sigue disponible como preview en `emilianocobe.github.io/tamaba-landings/`.
- El DNS en Route 53 no se modificó y no hace falta tocarlo mientras el hosting siga en Hostinger.
