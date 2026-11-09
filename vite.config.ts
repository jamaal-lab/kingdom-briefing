import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import { fileURLToPath } from 'node:url'

/**
 * Content Security Policy. Everything is first-party: no third-party scripts,
 * fonts or images. 'unsafe-inline' scripts are needed for TanStack Start's
 * SSR hydration payload; tighten to nonces if a CSP nonce strategy is added.
 * Same-origin frames are required by the Transformation Lab.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "frame-src 'self'",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ')

const SECURITY_HEADERS = {
  'content-security-policy': CSP,
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'cross-origin-opener-policy': 'same-origin',
}

/**
 * Hosting: Nitro builds a self-contained server in .output/.
 * Default preset is Node (`npm start`); set NITRO_PRESET=vercel, netlify,
 * cloudflare_module, etc. at build time to target a platform instead.
 * Route rules become platform headers on those presets. See docs/DEPLOYMENT.md.
 */
/**
 * Build targets. Default: the full project (flagship at /, editions, concepts).
 * SITE_TARGET=websites: the Bridge to Better Solutions "Web Design & Digital
 * Experiences" page, built to live under /websites on the parent domain —
 * every route, asset, image, font and API sits beneath that path.
 */
const TARGET = process.env.SITE_TARGET === 'websites' ? 'websites' : 'project'
const BASE = TARGET === 'websites' ? '/websites/' : '/'

export default defineConfig({
  base: BASE,
  define: { 'import.meta.env.VITE_SITE_TARGET': JSON.stringify(TARGET) },
  resolve: {
    tsconfigPaths: true,
    // The websites build has its own route tree (project-only pages left out entirely).
    alias:
      TARGET === 'websites'
        ? [
            { find: /^\.\/routeTree\.gen$/, replacement: fileURLToPath(new URL('./src/routeTree.websites.gen.ts', import.meta.url)) },
            { find: /^~\/components\/site\/HomePage$/, replacement: fileURLToPath(new URL('./src/websites/no-flagship.ts', import.meta.url)) },
          ]
        : [],
  },
  plugins: [
    tailwindcss(),
    tanstackStart(
      TARGET === 'websites'
        ? {
            router: {
              generatedRouteTree: 'routeTree.websites.gen.ts',
              // Flagship-only routes (Studio Edition, render studio, the in-project preview) are not part of /websites.
              routeFileIgnorePattern: '^(v2|studio|websites)\\.tsx$',
            },
          }
        : undefined,
    ),
    nitro({
      baseURL: BASE,
      output: TARGET === 'websites' ? { dir: '.output-websites' } : undefined,
      routeRules: {
        '/**': { headers: SECURITY_HEADERS },
        // Content-hashed build output: cache forever.
        '/assets/**': { headers: { ...SECURITY_HEADERS, 'cache-control': 'public, max-age=31536000, immutable' } },
        // Stable filenames, replaced only by re-rendering: cache for a week, revalidate in the background.
        '/media/**': { headers: { ...SECURITY_HEADERS, 'cache-control': 'public, max-age=604800, stale-while-revalidate=86400' } },
        '/fonts/**': { headers: { ...SECURITY_HEADERS, 'cache-control': 'public, max-age=2592000, immutable' } },
        // Fictional project imagery must not surface in image search without its "concept" context.
        '/media/atelier/**': { headers: { ...SECURITY_HEADERS, 'cache-control': 'public, max-age=604800, stale-while-revalidate=86400', 'x-robots-tag': 'noindex' } },
        // Fictional concept pages and the dev-only studio are never indexed.
        '/concepts/**': { headers: { ...SECURITY_HEADERS, 'x-robots-tag': 'noindex, nofollow' } },
      },
    }),
    viteReact(),
  ],
})
