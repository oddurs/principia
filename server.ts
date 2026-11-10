/**
 * ============================================================================
 * PRINCIPIA (@principia/core) — PRODUCTION HTTP WEB SERVER (Bun.serve)
 * ============================================================================
 * Serves the compiled production `dist/` bundle with:
 *   - On-the-fly Gzip compression for HTML, CSS, JS, JSON, and SVG
 *   - Weak ETag generation & 304 Not Modified conditional responses
 *   - Immutable long-term caching for hashed `/assets/*` & KaTeX fonts
 *   - Direct `/favicon.ico` -> `/favicon.png` (macOS Apple Color Emoji Book 📖)
 *   - SPA history fallback & `/api/health` telemetry endpoint
 */

import { join, extname } from 'node:path';
import { statSync, readFileSync, existsSync } from 'node:fs';

const DIST_DIR = join(import.meta.dir, 'dist');
const START_TIME = Date.now();

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/png',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

const COMPRESSIBLE_EXTS = new Set(['.html', '.css', '.js', '.mjs', '.json', '.svg']);

interface CachedAsset {
  raw: Uint8Array;
  gzip: Uint8Array | null;
  etag: string;
  contentType: string;
  cacheControl: string;
  mtimeMs: number;
}

const assetCache = new Map<string, CachedAsset>();

function getAsset(relPath: string): CachedAsset | null {
  const normalized = relPath === '/favicon.ico' ? '/favicon.png' : relPath;
  const fullPath = join(DIST_DIR, normalized);

  if (!fullPath.startsWith(DIST_DIR) || !existsSync(fullPath)) {
    return null;
  }

  let st;
  try {
    st = statSync(fullPath);
    if (!st.isFile()) return null;
  } catch {
    return null;
  }

  const existing = assetCache.get(normalized);
  if (existing && existing.mtimeMs === st.mtimeMs) {
    return existing;
  }

  const ext = extname(fullPath).toLowerCase();
  const raw = new Uint8Array(readFileSync(fullPath));
  const gzip = COMPRESSIBLE_EXTS.has(ext) ? Bun.gzipSync(raw) : null;
  const etag = `W/"${st.size.toString(16)}-${Math.floor(st.mtimeMs).toString(16)}"`;
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const isImmutable = normalized.startsWith('/assets/');
  const cacheControl = isImmutable
    ? 'public, max-age=31536000, immutable'
    : 'public, max-age=0, must-revalidate';

  const entry: CachedAsset = {
    raw,
    gzip,
    etag,
    contentType,
    cacheControl,
    mtimeMs: st.mtimeMs,
  };
  assetCache.set(normalized, entry);
  return entry;
}

function handleRequest(req: Request): Response {
  const url = new URL(req.url);
  const pathname = decodeURIComponent(url.pathname);

  if (pathname === '/api/health') {
    return Response.json(
      {
        status: 'ok',
        name: 'Principia Design System (@principia/core)',
        version: '2.4.0',
        uptimeSeconds: Math.round((Date.now() - START_TIME) / 1000),
      },
      {
        headers: {
          'Server': 'Principia/2.4 (Bun)',
          'Cache-Control': 'no-store',
        },
      }
    );
  }

  let asset = pathname === '/' ? getAsset('/index.html') : getAsset(pathname);
  if (!asset && !extname(pathname)) {
    asset = getAsset('/index.html');
  }

  if (!asset) {
    return new Response('Not Found', {
      status: 404,
      headers: { 'Server': 'Principia/2.4 (Bun)' },
    });
  }

  const ifNoneMatch = req.headers.get('if-none-match');
  if (ifNoneMatch === asset.etag) {
    return new Response(null, {
      status: 304,
      headers: {
        'ETag': asset.etag,
        'Cache-Control': asset.cacheControl,
        'Server': 'Principia/2.4 (Bun)',
      },
    });
  }

  const acceptEncoding = req.headers.get('accept-encoding') || '';
  const useGzip = asset.gzip !== null && acceptEncoding.includes('gzip');
  const body = useGzip ? asset.gzip! : asset.raw;

  const headers: Record<string, string> = {
    'Content-Type': asset.contentType,
    'Cache-Control': asset.cacheControl,
    'ETag': asset.etag,
    'Vary': 'Accept-Encoding',
    'X-Content-Type-Options': 'nosniff',
    'Server': 'Principia/2.4 (Bun)',
  };

  if (useGzip) {
    headers['Content-Encoding'] = 'gzip';
  }

  return new Response(body, { status: 200, headers });
}

const primaryPort = Number(process.env.PORT || 3000);
const secondaryPort = 5173;

const primaryServer = Bun.serve({
  port: primaryPort,
  hostname: '0.0.0.0',
  fetch: handleRequest,
});

console.log(
  `📖 Principia Production Web Server listening on http://localhost:${primaryServer.port} (0.0.0.0:${primaryServer.port})`
);

if (primaryPort !== secondaryPort) {
  try {
    const mirrorServer = Bun.serve({
      port: secondaryPort,
      hostname: '0.0.0.0',
      fetch: handleRequest,
    });
    console.log(
      `📖 Mirroring production server on http://localhost:${mirrorServer.port} (0.0.0.0:${mirrorServer.port})`
    );
  } catch {
    // Port 5173 already occupied; primary port 3000 remains active.
  }
}
