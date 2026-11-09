/**
 * Derivatives for the /websites page from owner-supplied source files in
 * brand-sources/ (official emblem and founder portraits, taken from
 * bridge2bettersolutions.com; concept previews from the owner's Lovable
 * reference, bridgeweb.lovable.app). Never edits the sources.
 *   node scripts/prepare-brand-assets.mjs
 */
import sharp from 'sharp'
import { mkdirSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const out = (p) => join('public', p)
mkdirSync(out('brand'), { recursive: true })
const emblem = 'brand-sources/btbs-emblem-original.png'
for (const w of [96, 192, 384, 768]) {
  await sharp(emblem).resize(w).webp({ quality: 90 }).toFile(out(`brand/btbs-emblem-${w}.webp`))
  await sharp(emblem).resize(w).png({ compressionLevel: 9 }).toFile(out(`brand/btbs-emblem-${w}.png`))
}
await sharp(emblem).resize(32).png().toFile(out('brand/favicon-32.png'))
await sharp(emblem).resize(180).flatten({ background: '#10243A' }).png().toFile(out('brand/apple-touch-icon.png'))

mkdirSync(out('media/founder'), { recursive: true })
for (const w of [480, 720, 960]) {
  // The portrait source is 1920²; take a centred 4:5 head-and-shoulders frame.
  const img = sharp('brand-sources/founder-portrait-square-original.jpg').extract({ left: 192, top: 0, width: 1536, height: 1920 }).resize(w)
  await img.clone().avif({ quality: 55 }).toFile(out(`media/founder/jamaal-peavy-${w}.avif`))
  await img.clone().webp({ quality: 82 }).toFile(out(`media/founder/jamaal-peavy-${w}.webp`))
}

mkdirSync(out('media/concepts'), { recursive: true })
const src = 'brand-sources/lovable-concepts'
for (const f of readdirSync(src).filter((x) => x.endsWith('.jpg'))) {
  const name = f.replace(/-[A-Za-z0-9_]{6,10}\.jpg$/, '')
  for (const w of [640, 960, 1280]) {
    const img = sharp(join(src, f)).resize({ width: w, withoutEnlargement: true })
    await img.clone().avif({ quality: 55 }).toFile(out(`media/concepts/${name}-${w}.avif`))
    await img.clone().webp({ quality: 82 }).toFile(out(`media/concepts/${name}-${w}.webp`))
  }
}
console.log('done')
