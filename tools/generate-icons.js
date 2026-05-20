import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import pngToIco from 'png-to-ico'

const root = process.cwd()
const sourceSvg = path.join(root, 'public', 'app-icon.svg')
const outDir = path.join(root, 'assets', 'icons')
const pngDir = path.join(outDir, 'png')

const sizes = [16, 32, 48, 64, 128, 256, 512, 1024]
const icnsEntries = [
  ['icp4', 16],
  ['icp5', 32],
  ['icp6', 64],
  ['ic07', 128],
  ['ic08', 256],
  ['ic09', 512],
  ['ic10', 1024],
]

await fs.mkdir(pngDir, { recursive: true })

for (const size of sizes) {
  await sharp(sourceSvg)
    .resize(size, size)
    .png()
    .toFile(path.join(pngDir, `app-icon-${size}.png`))
}

await fs.copyFile(path.join(pngDir, 'app-icon-512.png'), path.join(outDir, 'app-icon.png'))
await fs.copyFile(sourceSvg, path.join(outDir, 'app-icon.svg'))

const ico = await pngToIco([
  path.join(pngDir, 'app-icon-16.png'),
  path.join(pngDir, 'app-icon-32.png'),
  path.join(pngDir, 'app-icon-48.png'),
  path.join(pngDir, 'app-icon-256.png'),
])
await fs.writeFile(path.join(outDir, 'app-icon.ico'), ico)

const entryBuffers = []
let totalLength = 8
for (const [type, size] of icnsEntries) {
  const png = await fs.readFile(path.join(pngDir, `app-icon-${size}.png`))
  const header = Buffer.alloc(8)
  header.write(type, 0, 4, 'ascii')
  header.writeUInt32BE(png.length + 8, 4)
  entryBuffers.push(header, png)
  totalLength += png.length + 8
}

const icnsHeader = Buffer.alloc(8)
icnsHeader.write('icns', 0, 4, 'ascii')
icnsHeader.writeUInt32BE(totalLength, 4)
await fs.writeFile(path.join(outDir, 'app-icon.icns'), Buffer.concat([icnsHeader, ...entryBuffers], totalLength))

console.log(`Icons generated in ${outDir}`)
