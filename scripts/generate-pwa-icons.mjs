/**
 * Generates PNG icons from SVG sources for PWA / Apple touch icon.
 * Run: node scripts/generate-pwa-icons.mjs (requires sharp: npm i -D sharp)
 */
import sharp from 'sharp'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const pub = join(root, 'public')

const iconSvg = readFileSync(join(pub, 'pwa-source-icon.svg'))

/** --pc-bg #d8e6e2 */
const BG = { r: 216, g: 230, b: 226, alpha: 1 }

async function png(buf, size, outName) {
  await sharp(buf).resize(size, size).png({ compressionLevel: 9 }).toFile(join(pub, outName))
  console.log('wrote', outName, size)
}

await png(iconSvg, 180, 'apple-touch-icon.png')
await png(iconSvg, 192, 'pwa-192.png')
await png(iconSvg, 512, 'pwa-512.png')

const inner = await sharp(iconSvg).resize(410, 410).png().toBuffer()
await sharp({
  create: { width: 512, height: 512, channels: 4, background: BG },
})
  .composite([{ input: inner, left: 51, top: 51 }])
  .png({ compressionLevel: 9 })
  .toFile(join(pub, 'pwa-512-maskable.png'))
console.log('wrote pwa-512-maskable.png 512 (maskable safe zone)')
