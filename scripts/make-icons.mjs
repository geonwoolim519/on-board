import { deflateSync, crc32 } from 'zlib'
import { mkdirSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const dir = join(dirname(fileURLToPath(import.meta.url)), '../public/icons')
mkdirSync(dir, { recursive: true })

function chunk(type, data) {
  const payload = Buffer.concat([Buffer.from(type), data])
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(payload) >>> 0)
  return Buffer.concat([length, payload, crc])
}

function png(size, painter) {
  const stride = size * 4 + 1
  const raw = Buffer.alloc(stride * size)
  for (let y = 0; y < size; y++) {
    raw[y * stride] = 0
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = painter(x + 0.5, y + 0.5, size)
      const i = y * stride + 1 + x * 4
      raw[i] = r
      raw[i + 1] = g
      raw[i + 2] = b
      raw[i + 3] = a
    }
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

function mix(a, b, t) {
  const k = Math.max(0, Math.min(1, t))
  return [
    Math.round(a[0] + (b[0] - a[0]) * k),
    Math.round(a[1] + (b[1] - a[1]) * k),
    Math.round(a[2] + (b[2] - a[2]) * k),
    255,
  ]
}

function cover(dst, src, alpha) {
  if (alpha <= 0) return dst
  if (alpha >= 1) return src
  return mix(dst, src, alpha)
}

function ring(px, py, cx, cy, radius, stroke) {
  const d = Math.abs(Math.hypot(px - cx, py - cy) - radius)
  return 1 - Math.max(0, Math.min(1, (d - stroke / 2) / 0.85))
}

function strokeLine(px, py, x1, y1, x2, y2, width) {
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.hypot(dx, dy) || 1
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (len * len)))
  const dist = Math.hypot(px - (x1 + dx * t), py - (y1 + dy * t))
  return 1 - Math.max(0, Math.min(1, (dist - width / 2) / 0.9))
}

function triangle(px, py, ax, ay, bx, by, cx, cy) {
  const sign = (x1, y1, x2, y2, x3, y3) => (x1 - x3) * (y2 - y3) - (x2 - x3) * (y1 - y3)
  const b1 = sign(px, py, ax, ay, bx, by) < 0
  const b2 = sign(px, py, bx, by, cx, cy) < 0
  const b3 = sign(px, py, cx, cy, ax, ay) < 0
  return b1 === b2 && b2 === b3 ? 1 : 0
}

function paintMark(px, py, size, pad = 0) {
  const navy = [11, 31, 51]
  const white = [245, 247, 250]
  const blue = [37, 99, 235]
  let color = navy
  const inner = size * (1 - pad * 2)
  const ox = size * pad
  const oy = size * pad
  const cx = ox + inner / 2
  const cy = oy + inner / 2
  const r = inner * 0.23
  const stroke = inner * 0.055
  color = cover(color, white, ring(px, py, cx, cy, r, stroke))
  color = cover(
    color,
    blue,
    strokeLine(px, py, cx - inner * 0.21, cy + inner * 0.12, cx + inner * 0.14, cy - inner * 0.16, stroke * 0.78),
  )
  color = cover(
    color,
    blue,
    triangle(
      px,
      py,
      cx + inner * 0.12,
      cy - inner * 0.28,
      cx + inner * 0.27,
      cy - inner * 0.22,
      cx + inner * 0.16,
      cy - inner * 0.1,
    ),
  )
  return color
}

writeFileSync(join(dir, 'icon-192.png'), png(192, (x, y, s) => paintMark(x, y, s, 0)))
writeFileSync(join(dir, 'icon-512.png'), png(512, (x, y, s) => paintMark(x, y, s, 0)))
writeFileSync(join(dir, 'icon-512-maskable.png'), png(512, (x, y, s) => paintMark(x, y, s, 0.12)))
writeFileSync(join(dir, 'apple-touch-icon.png'), png(180, (x, y, s) => paintMark(x, y, s, 0)))
console.log('icons written')
