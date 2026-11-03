/**
 * Static preview build: the same components as the TanStack Start app,
 * rendered client-side into plain HTML pages (flagship, Studio Edition, concepts) with relative asset
 * paths, so the site can be hosted from any folder (e.g. a shared preview).
 *   npx vite build --config vite.preview.config.ts   →   preview-dist/
 */
import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

export default defineConfig({
  root: 'preview',
  base: './',
  publicDir: resolve(__dirname, 'public'),
  resolve: { alias: { '~': resolve(__dirname, 'src') } },
  define: { 'import.meta.env.VITE_STATIC_PREVIEW': JSON.stringify('1') },
  plugins: [tailwindcss(), viteReact()],
  build: {
    outDir: resolve(__dirname, 'preview-dist'),
    emptyOutDir: true,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'preview/index.html'),
        v2: resolve(__dirname, 'preview/v2.html'),
        'atelier-north': resolve(__dirname, 'preview/atelier-north.html'),
        'atelier-north-before': resolve(__dirname, 'preview/atelier-north-before.html'),
      },
    },
  },
})
