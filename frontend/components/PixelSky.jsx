import { useEffect, useRef } from 'react'

const PX = 4 // CSS pixels per art pixel

// Every colour is a [sunset, night] pair; scrolling past the hero blends the whole scene from one to the other.
const PAL = {
  skyTop: ['#FF8FB8', '#050A24'],
  skyLow: ['#FFE08A', '#1A3485'],
  sun: ['#FFD23F', '#FF9A3F'],
  cloud: ['#FFFFFF', '#1E2D6B'],
  cloudShade: ['#FFC2DA', '#141F52'],
  hill: ['#C08ADF', '#16205A'],
  city: ['#8FC7EE', '#0D1847'],
  cityDark: ['#6FA6D6', '#0A1238'],
  window: ['#D8EEFC', '#FFD86B'],
  stone: ['#F5DFA8', '#2B3C7E'],
  stoneDark: ['#D9B26E', '#1D2B62'],
  slit: ['#1B2A3D', '#FFD86B'],
  ink: ['#1B2A3D', '#02040F'],
  red: ['#E0453A', '#B5333C'],
  cable: ['#B8322B', '#7E2433'],
  chain: ['#4A6FA5', '#6A8BE0'],
  green: ['#5BC46A', '#123B48'],
  water: ['#5FB8E8', '#0B1C55'],
  waterDeep: ['#3C8FD0', '#06123E'],
  shimmer: ['#FFFFFF', '#6A8BE0'],
  sail: ['#FFFFFF', '#AFC0F0'],
}

const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const RGB = Object.fromEntries(Object.entries(PAL).map(([k, v]) => [k, v.map(hex)]))
const mix = (a, b, u) => a.map((v, i) => Math.round(v + (b[i] - v) * u))
const css = ([r, g, b]) => `rgb(${r},${g},${b})`
const colours = u => k => css(mix(RGB[k][0], RGB[k][1], u))

// Seeded so the skyline, stars and clouds are the same on every repaint.
function rng(seed) {
  return () => {
    seed = (seed + 0x6D2B79F5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const box = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)) }
const disc = (g, cx, cy, r, c) => { for (let dy = -r; dy <= r; dy++) { const w = Math.round(Math.sqrt(r * r - dy * dy)); box(g, cx - w, cy + dy, 2 * w + 1, 1, c) } }
// Triangle rows from a point at the top down to a base of 2*half+1 at y.
const spire = (g, cx, y, half, h, c) => { for (let r = 0; r < h; r++) { const w = Math.round(half * (r + 1) / h); box(g, cx - w, y - h + r, 2 * w + 1, 1, c) } }
// Plots y = f(x) between two x's with no gaps, so steep cables stay connected.
function curve(g, xa, xb, f, c) {
  let prev = null
  for (let x = Math.round(Math.min(xa, xb)); x <= Math.round(Math.max(xa, xb)); x++) {
    const y = Math.round(f(x)), p = prev ?? y
    box(g, x, Math.min(y, p), 1, Math.abs(y - p) + 1, c)
    prev = y
  }
}
// Draws each rect grown by one pixel in ink, then the fill on top: the hard outline pixel art lives on.
function outlined(g, rects, fill, ink) {
  for (const [x, y, w, h] of rects) box(g, x - 1, y - 1, w + 2, h + 2, ink)
  for (const [x, y, w, h] of rects) box(g, x, y, w, h, fill)
}

// Desktop mirrors the hero geometry in Painter.jsx (and .hero-crew in globals.css), so Ping and Byte still stand on the Golden Gate.
// London on the left at ts (smaller: it's far across the ocean, and stays under the hero buttons), San Francisco on the right at s.
function layout(W, H, wide) {
  if (wide) {
    const s = Math.round(Math.min(H * 0.22, W * 0.088)), ts = Math.round(s * 0.7), g2 = Math.round(W - s * 0.35), g1 = g2 - Math.round(s * 2.2)
    const tb = Math.round(ts * 1.45)
    return { W, H, wide, s, ts, tb, g1, g2, hz: Math.round(H * 0.93), gap: Math.round(ts * 0.72), gtop: 1.7, sunX: g1 + Math.round(s * 1.1), moonX: tb }
  }
  const s = Math.max(12, Math.round(Math.min(H * 0.2, W * 0.16)))
  return {
    W, H, wide, s, ts: s, tb: Math.round(W * 0.24), g1: Math.round(W * 0.6), g2: Math.round(W * 0.95),
    hz: Math.round(H * 0.85), gap: Math.round(s * 0.78), gtop: 1.45, sunX: Math.round(W * 0.78), moonX: Math.round(W * 0.6),
  }
}

function paintSky(g, L, u) {
  const { W, hz } = L, N = 10, bh = hz / N
  const top = mix(RGB.skyTop[0], RGB.skyTop[1], u), low = mix(RGB.skyLow[0], RGB.skyLow[1], u)
  const band = i => css(mix(top, low, i / (N - 1)))
  for (let i = 0; i < N; i++) box(g, 0, i * bh, W, bh + 1, band(i))
  // Checkerboard dither on each band edge, so the gradient steps like a 16-colour palette.
  for (let i = 1; i < N; i++) {
    const y = Math.round(i * bh)
    g.fillStyle = band(i)
    for (let x = 0; x < W; x += 2) g.fillRect(x + (y & 1), y - 1, 1, 1)
    for (let x = 0; x < W; x += 4) g.fillRect(x + (y & 2), y - 2, 1, 1)
  }
}

function towerBridge(g, L, c) {
  const { hz: deck, ts: s, tb: cx } = L
  const { gap } = L
  const tw = Math.max(5, Math.round(s * 0.24)) | 1, hw = (tw - 1) / 2, th = s
  const chainTop = deck - Math.round(th * 0.7)
  for (const d of [-1, 1]) {
    const x0 = cx + d * gap, x1 = cx + d * gap * 1.95
    curve(g, x0, x1, x => { const u = Math.abs(x - x0) / Math.abs(x1 - x0); return chainTop + (deck - chainTop) * (1 - (1 - u) ** 2) }, c('chain'))
  }
  const inL = cx - gap + hw, inR = cx + gap - hw
  outlined(g, [[inL, deck - Math.round(th * 0.84), inR - inL, 2], [inL, deck - Math.round(th * 0.74), inR - inL, 2], [inL, deck - 2, inR - inL, 2]], c('chain'), c('ink'))
  for (const x of [cx - gap, cx + gap]) {
    const top = deck - th
    spire(g, x, top, hw + 1, Math.round(tw * 0.9) + 1, c('ink'))
    spire(g, x, top, hw, Math.round(tw * 0.9), c('stoneDark'))
    outlined(g, [[x - hw, top, tw, th + Math.round(s * 0.12)]], c('stone'), c('ink'))
    for (const dx of [-hw, hw]) box(g, x + dx, top - 3, 1, 3, c('ink'))
    for (let k = 0; k < 3; k++) {
      const y = top + 3 + k * Math.round(th * 0.27)
      box(g, x - 1, y, 1, 3, c('slit')); box(g, x + 1, y, 1, 3, c('slit'))
    }
  }
}

function goldenGate(g, L, c) {
  const { hz: deck, s, g1: x1, g2: x2, W, gtop } = L
  const top = deck - Math.round(s * gtop), low = deck - 3, side = Math.round((x2 - x1) * 0.5)
  const main = x => low + (top - low) * (2 * (x - x1) / (x2 - x1) - 1) ** 2
  const hang = (x0, xEnd) => x => { const u = Math.abs(x - x0) / Math.abs(xEnd - x0); return top + (deck - 2 - top) * (1 - (1 - u) ** 2) }
  for (let x = x1 + 2; x < x2 - 1; x += 2) box(g, x, main(x), 1, deck - main(x), c('cable'))
  curve(g, x1, x2, main, c('red'))
  curve(g, x1 - side, x1, hang(x1, x1 - side), c('red'))
  curve(g, x2, x2 + side, hang(x2, x2 + side), c('red'))
  outlined(g, [[x1 - side, deck - 2, Math.max(W + 2, x2 + side) - (x1 - side), 2]], c('red'), c('ink'))
  const lw = Math.max(1, Math.round(s * 0.05)), half = Math.max(3, Math.round(s * 0.1))
  for (const x of [x1, x2]) {
    const legs = [[x - half, top, lw, deck + 3 - top], [x + half - lw + 1, top, lw, deck + 3 - top]]
    const bars = [0, 0.32, 0.64].map(k => [x - half, Math.round(top + (deck - top) * k), 2 * half + 1, 2])
    outlined(g, [...legs, ...bars], c('red'), c('ink'))
  }
}

function paintLand(g, L, c) {
  const { W, H, hz, s, ts, tb, g1, wide } = L
  const R = rng(7)
  // SF's hills, then one skyline along the far shore that grows from London's scale to San Francisco's.
  for (let x = wide ? Math.round(g1 - s * 1.6) : Math.round(W * 0.5); x < W; x++) {
    const h = Math.round(s * 0.4 + Math.sin(x * 0.07) * s * 0.15 + Math.sin(x * 0.023 + 1) * s * 0.25)
    box(g, x, hz - h, 1, h, c('hill'))
  }
  for (let x = 0; x < W;) {
    const w = 4 + Math.floor(R() * 6), h = Math.round((ts + (s - ts) * x / W) * (0.2 + R() * 0.55))
    box(g, x, hz - h, w, h, c(R() < 0.5 ? 'city' : 'cityDark'))
    for (let y = hz - h + 2; y < hz - 2; y += 3) for (let wx = x + 1; wx < x + w - 1; wx += 2) if (R() < 0.5) box(g, wx, y, 1, 1, c('window'))
    x += w + (R() < 0.3 ? 1 : 0)
  }
  // Landmarks, London's fading into San Francisco's. Desktop spreads them between the bridges, growing from London's scale
  // to SF's; mobile keeps the old spots by each bridge and skips the Gherkin and Salesforce Tower.
  const from = tb + ts * 1.45, to = g1 - s * 1.15
  const place = (u, alt) => wide ? [Math.round(from + (to - from) * u), ts + (s - ts) * u] : [Math.round(alt), s]
  const bullet = ([x, q], w, h, col) => {
    disc(g, x, hz - h + w, w + 1, c('ink'))
    outlined(g, [[x - w, hz - h + w, 2 * w + 1, h - w]], c(col), c('ink'))
    disc(g, x, hz - h + w, w, c(col))
    for (let y = hz - h + w + 2; y < hz - 2; y += 3) box(g, x - w + 1, y, 2 * w - 1, 1, c('window'))
  }
  const [bb, bq] = place(0, tb - s * 1.75), bw = Math.max(3, Math.round(bq * 0.12)), bh = Math.round(bq * 1.05)
  spire(g, bb + (bw >> 1), hz - bh, (bw >> 1) + 1, Math.round(bw * 1.4) + 1, c('ink'))
  outlined(g, [[bb, hz - bh, bw, bh]], c('stone'), c('ink'))
  disc(g, bb + (bw >> 1), hz - bh + 3, Math.max(1, (bw >> 1) - 1), c('window'))
  const [sx, sq] = place(0.22, tb + s * 0.25)
  spire(g, sx, hz, Math.round(sq * 0.22), Math.round(sq * 1.35), c('cityDark'))
  if (wide) {
    const gh = place(0.42), sf = place(0.8)
    bullet(gh, Math.max(2, Math.round(gh[1] * 0.11)), Math.round(gh[1] * 0.75), 'cityDark')
    bullet(sf, Math.max(2, Math.round(sf[1] * 0.08)), Math.round(sf[1] * 1.5), 'stoneDark')
  }
  const [tx, tq] = place(0.94, g1 - s * 0.6)
  spire(g, tx, hz, Math.round(tq * 0.16), Math.round(tq * 1.1), c('city'))
  // Tree line along the shore.
  for (let x = 0; x < W; x += 3) disc(g, x, hz - 1, 1 + ((x * 7) % 3 > 0 ? 1 : 0), c('green'))
  // Water: two bands with a dithered seam.
  const deep = Math.round(hz + (H - hz) * 0.5)
  box(g, 0, hz, W, H - hz, c('water'))
  box(g, 0, deep, W, H - deep, c('waterDeep'))
  g.fillStyle = c('waterDeep')
  for (let x = 0; x < W; x += 2) g.fillRect(x + (deep & 1), deep - 1, 1, 1)
  towerBridge(g, L, c)
  goldenGate(g, L, c)
}

function makeLife(L) {
  const R = rng(42), { W, H, hz } = L
  return {
    stars: Array.from({ length: Math.round(W * hz / 300) }, () => [Math.floor(R() * W), Math.floor(R() * hz * 0.85), Math.floor(R() * 13)]),
    clouds: Array.from({ length: 6 }, () => [R() * (W + 40), H * 0.06 + R() * hz * 0.5, 10 + Math.floor(R() * 14), 0.0012 + R() * 0.0025]),
    ripples: Array.from({ length: Math.round(W / 6) }, () => [R() * W, hz + 2 + Math.floor(R() * (H - hz - 3)), 2 + Math.floor(R() * 4), 0.002 + R() * 0.004]),
    boats: Array.from({ length: 3 }, (_, i) => [R() * W, hz + 4 + i * Math.max(3, Math.round((H - hz) / 4)), (R() < 0.5 ? -1 : 1) * (0.0008 + R() * 0.001)]),
  }
}

// Side-on airliner flying right; k = outline, w = body.
const PLANE = [
  'kk..........',
  'kwk.........',
  'kwwkkkkkkkk.',
  'kwwwwwwwwwwk',
  '.kkkkwwwkkk.',
  '.....kwk....',
  '......k.....',
]

const wrap = (v, n) => ((v % n) + n) % n

// Everything that moves and sits behind the shoreline: stars, moon, sun, clouds, a shooting star.
function drawSkyLife(g, L, life, t, now, c) {
  const { W, H, hz, s, sunX, moonX } = L
  if (t > 0.02) {
    g.globalAlpha = t
    for (const [x, y, p] of life.stars) {
      const phase = (p + Math.floor(now / 350)) % 13
      if (phase === 0) { box(g, x - 1, y, 3, 1, '#FFFFFF'); box(g, x, y - 1, 1, 3, '#FFFFFF') }
      else if (phase < 10) box(g, x, y, 1, 1, phase < 4 ? '#FFFFFF' : '#9FB4FF')
    }
    const mr = Math.max(3, Math.round(s * 0.3)), my = Math.round(H * 0.1 + (1 - t) * H * 0.3)
    disc(g, moonX, my, mr, '#F4EDE0')
    box(g, moonX - 1, my - 1, 2, 2, '#D9CFB8'); box(g, moonX + 2, my + 1, 1, 1, '#D9CFB8')
    const u = (now % 7000) / 800
    if (u < 1) for (let k = 0; k < 8; k++) box(g, W * 0.25 + (u * W * 0.3) - k * 2, H * 0.06 + u * H * 0.1 - k, 1, 1, `rgba(255,255,255,${1 - k / 8})`)
    g.globalAlpha = 1
  }
  const r = Math.max(4, Math.round(s * 0.55)), sy = Math.round(hz - s * 1.5 + t * s * 2.6)
  disc(g, sunX, sy, r, c('sun'))
  for (let k = 0; k < 3; k++) box(g, sunX - r - 1, sy + Math.round(r * 0.2) + k * 3, 2 * r + 3, 1 + (k > 0 ? 1 : 0), c('skyLow'))
  for (const [x0, y, w, sp] of life.clouds) {
    const x = wrap(x0 + now * sp, W + 40) - 20
    box(g, x, y, w, 3, c('cloud'))
    box(g, x + 2, y - 2, w - 6, 2, c('cloud'))
    box(g, x + 4, y - 4, Math.round(w * 0.35), 2, c('cloud'))
    box(g, x + 1, y + 3, w - 2, 1, c('cloudShade'))
  }
}

// Everything that moves in front: sun glitter, ripples, sailboats, and the LHR → SFO flight.
function drawWaterLife(g, L, life, t, now, c) {
  const { W, hz, s, sunX, moonX, tb, g1 } = L
  const r = Math.max(4, Math.round(s * 0.55))
  for (let k = 0; k < 6; k++) {
    const len = Math.max(1, 2 * r - k * 3), jig = Math.round(Math.sin(now / 300 + k) * 1.5)
    g.globalAlpha = 1 - t
    box(g, sunX - len / 2 + jig, hz + 2 + k * 2, len, 1, c('sun'))
    g.globalAlpha = t
    box(g, moonX - len / 4 + jig, hz + 2 + k * 2, len / 2, 1, '#F4EDE0')
  }
  g.globalAlpha = 0.7
  for (const [x0, y, len, sp] of life.ripples) box(g, wrap(x0 + now * sp, W + 10) - 5, y, len, 1, c('shimmer'))
  g.globalAlpha = 1
  for (const [x0, y0, sp] of life.boats) {
    const x = Math.round(wrap(x0 + now * sp, W + 20) - 10), y = Math.round(y0 + Math.sin(now / 500 + x0))
    box(g, x, y, 7, 1, c('ink')); box(g, x + 1, y + 1, 5, 1, c('ink'))
    box(g, x + 3, y - 5, 1, 5, c('ink'))
    for (let k = 0; k < 4; k++) box(g, x + 4, y - 1 - k, 3 - Math.floor(k * 0.75), 1, c('sail'))
  }
  const u = (now % 16000) / 16000, to = g1 + s * 0.6
  const at = v => [tb + (to - tb) * v, hz - s * 2.1 - Math.sin(Math.PI * v) * s * 0.7]
  for (let v = 0; v < u - 0.03; v += 0.025) { const [x, y] = at(v); box(g, x, y + 1, 1, 1, c('shimmer')) }
  const [px, py] = at(u).map(Math.round)
  PLANE.forEach((row, y) => [...row].forEach((ch, x) => ch !== '.' && box(g, px - 6 + x, py - 3 + y, 1, 1, c(ch === 'k' ? 'ink' : 'sail'))))
  if (t > 0.5 && Math.floor(now / 400) % 2) box(g, px + 3, py, 1, 1, '#FF4040')
}

export default function PixelSky() {
  const ref = useRef(null)

  useEffect(() => {
    const cv = ref.current, g = cv.getContext('2d'), root = document.documentElement
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const wide = () => innerWidth > 860 // same breakpoint as .hero-crew
    const sky = document.createElement('canvas'), land = document.createElement('canvas')
    let L, life, bucket = -1, raf = 0
    let t = root.classList.contains('past-hero') ? 1 : 0

    const size = () => {
      L = layout(Math.ceil(innerWidth / PX), Math.ceil(innerHeight / PX), wide())
      life = makeLife(L)
      for (const el of [cv, sky, land]) { el.width = L.W; el.height = L.H }
      // Whole art pixels, never a fractional stretch: the canvas may overhang the right/bottom edge by a few px.
      Object.assign(cv.style, { width: `${L.W * PX}px`, height: `${L.H * PX}px` })
      bucket = -1
    }

    const frame = ms => {
      raf = 0
      if (!root.classList.contains('pixel')) return
      const now = reduce ? 0 : ms, target = root.classList.contains('past-hero') ? 1 : 0
      t = reduce || Math.abs(target - t) < 0.01 ? target : t + (target - t) * 0.05
      // Static layers repaint only when the day/night blend moves a step.
      const b = Math.round(t * 32)
      if (b !== bucket) {
        bucket = b
        const c = colours(b / 32), lg = land.getContext('2d')
        paintSky(sky.getContext('2d'), L, b / 32)
        lg.clearRect(0, 0, L.W, L.H)
        paintLand(lg, L, c)
      }
      const c = colours(t)
      g.drawImage(sky, 0, 0)
      drawSkyLife(g, L, life, t, now, c)
      g.drawImage(land, 0, 0)
      drawWaterLife(g, L, life, t, now, c)
      if (!reduce) raf = requestAnimationFrame(frame)
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(frame) }
    const onResize = () => { size(); kick() }

    size(); kick()
    const watch = new MutationObserver(kick)
    watch.observe(root, { attributes: true, attributeFilter: ['class'] })
    addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(raf); watch.disconnect(); removeEventListener('resize', onResize) }
  }, [])

  return <canvas ref={ref} className="pixel-sky" aria-hidden="true" />
}
