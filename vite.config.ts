import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

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
export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    tailwindcss(),
    tanstackStart(),
    nitro({
      routeRules: {
        '/**': { headers: SECURITY_HEADERS },
        // Content-hashed build output: cache forever.
        '/assets/**': { headers: { ...SECURITY_HEADERS, 'cache-control': 'public, max-age=31536000, immutable' } },
        // Stable filenames, replaced only by re-rendering: cache for a week, revalidate in the background.
        '/media/**': { headers: { ...SECURITY_HEADERS, 'cache-control': 'public, max-age=604800, stale-while-revalidate=86400' } },
        '/fonts/**': { headers: { ...SECURITY_HEADERS, 'cache-control': 'public, max-age=2592000, immutable' } },
        // Fictional concept pages and the dev-only studio are never indexed.
        '/concepts/**': { headers: { ...SECURITY_HEADERS, 'x-robots-tag': 'noindex, nofollow' } },
      },
    }),
    viteReact(),
  ],
})
