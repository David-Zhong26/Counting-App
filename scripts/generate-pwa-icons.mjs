/**
 * Builds PWA / Apple icons from public/logo.png (theme background for transparency).
 * Run: npm run generate:pwa-icons  (requires sharp)
 * If public/logo.png is missing, exits 0 and leaves existing icons unchanged.
 */
import sharp from 'sharp'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const pub = join(root, 'public')
const logoPath = join(pub, 'logo.png')

/** --pc-bg #d8e6e2 */
const BG = { r: 216, g: 230, b: 226, alpha: 1 }

async function squareIcon(srcPath, size, outName) {
  await sharp(srcPath)
    .resize(size, size, { fit: 'contain', background: BG })
    .png({ compressionLevel: 9 })
    .toFile(join(pub, outName))
  console.log('wrote', outName, size)
}

async function maskable512(srcPath) {
  const innerBuf = await sharp(srcPath)
    .resize(410, 410, { fit: 'contain', background: BG })
    .png()
    .toBuffer()
  const meta = await sharp(innerBuf).metadata()
  const w = meta.width ?? 410
  const h = meta.height ?? 410
  await sharp({
    create: { width: 512, height: 512, channels: 4, background: BG },
  })
    .composite([{ input: innerBuf, left: Math.floor((512 - w) / 2), top: Math.floor((512 - h) / 2) }])
    .png({ compressionLevel: 9 })
    .toFile(join(pub, 'pwa-512-maskable.png'))
  console.log('wrote pwa-512-maskable.png 512 (maskable)')
}

if (!existsSync(logoPath)) {
  console.warn('[generate-pwa-icons] public/logo.png not found — skip regeneration (keep existing icons).')
  process.exit(0)
}

await squareIcon(logoPath, 180, 'apple-touch-icon.png')
await squareIcon(logoPath, 192, 'pwa-192.png')
await squareIcon(logoPath, 512, 'pwa-512.png')
await maskable512(logoPath)
