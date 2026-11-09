/**
 * Static preview of the /websites page: the same components rendered
 * client-side into plain HTML with relative paths, for a shareable private
 * preview. No server, so the intake shows its honest "not switched on" state.
 *   npx vite build --config vite.preview-websites.config.ts   →   preview-websites-dist/
 */
import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

const page = (n: string) => resolve(__dirname, `preview/${n}.html`)

export default defineConfig({
  root: 'preview',
  base: './',
  publicDir: resolve(__dirname, 'public'),
  resolve: { alias: { '~': resolve(__dirname, 'src') } },
  define: {
    'import.meta.env.VITE_STATIC_PREVIEW': JSON.stringify('1'),
    'import.meta.env.VITE_SITE_TARGET': JSON.stringify('websites'),
  },
  plugins: [tailwindcss(), viteReact()],
  build: {
    outDir: resolve(__dirname, 'preview-websites-dist'),
    emptyOutDir: true,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      input: { websites: page('websites'), privacy: page('websites-privacy'), concept: page('websites-concept'), before: page('websites-concept-before') },
    },
  },
})
