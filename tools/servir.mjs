#!/usr/bin/env node
/** Servidor estático para revisar dist/ localmente. Sin dependencias.
 *  Replica lo esencial del hosting: index.html por directorio y 404 propia.
 *      node tools/servir.mjs [puerto]                                    */
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const PUERTO = Number(process.argv[2]) || 4321;
const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json',
  '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8'
};

createServer((req, res) => {
  const ruta = decodeURIComponent(req.url.split('?')[0]);
  let f = join(DIST, ruta);
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
  if (!existsSync(f)) {
    const e = join(DIST, '404.html');
    res.writeHead(404, { 'Content-Type': TIPOS['.html'] });
    return res.end(existsSync(e) ? readFileSync(e) : 'No encontrado');
  }
  res.writeHead(200, { 'Content-Type': TIPOS[extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  res.end(readFileSync(f));
}).listen(PUERTO, () => console.log(`Sitio en http://localhost:${PUERTO}/`));
