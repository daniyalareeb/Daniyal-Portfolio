import { useEffect, useRef } from 'react'

const PAPER = [244, 237, 224]
const INK = '#1B2A3D'
const ACCENT = { hero: '#2F7F86', sonar: '#2F7F86' }

const r = (a, b) => a + Math.random() * (b - a)

// Marks: each paints one brush gesture. The queue runs one or two per frame so the picture draws itself.
const wash = (x, y, rad, color, op = 70) => b => {
  b.noStroke(); b.noHatch()
  b.fill(color, op); b.fillBleed(r(0.2, 0.45), 'out'); b.fillTexture(0.55, 0.5)
  b.circle(x, y, rad, true)
  b.noFill()
}
const ink = (b, name, color, w) => { b.noFill(); b.noHatch(); b.set(name, color, w) }
const bubble = (x, y, rad) => b => { ink(b, 'HB', INK, 0.9); b.circle(x, y, rad, 0.4) }
const current = (x, y, len, color) => b => {
  b.field('seabed'); ink(b, '2B', color, 0.8); b.flowLine(x, y, len, r(-10, 10)); b.noField()
}
const lines = (ls, color, w = 1, name = '2B') => b => { ink(b, name, color, w); ls.forEach(l => b.line(...l)) }
const curve = (pts, color, w = 1, name = '2B') => b => { ink(b, name, color, w); b.spline(pts, 0.5) }
const tower = (x, y, tw, th) => b => {
  b.noFill(); b.set('HB', INK, 0.8); b.hatch(5, 80, { rand: 0.1 })
  b.rect(x, y - th / 2, tw, th, 'center'); b.noHatch()
}
// Parabolic cable from (x1, top) to (x2, top) sagging to `low`; `half` keeps only one side (side spans).
const sag = (x1, x2, top, low, half = 0) => Array.from({ length: 11 }, (_, i) => {
  const u = half < 0 ? 0.5 + i / 20 : half > 0 ? i / 20 : i / 10
  return [x1 + (x2 - x1) * (half ? i / 10 : u), low + (top - low) * (2 * u - 1) ** 2]
})

// London's Tower Bridge: two gothic towers, high walkways, chains down to the banks.
function towerBridge(cx, deck, s) {
  const tw = s * 0.24, th = s, gap = s * 0.72, m = []
  for (const x of [cx - gap, cx + gap]) {
    m.push(tower(x, deck + s * 0.12, tw, th + s * 0.12))
    m.push(lines([[x - tw / 2, deck - th, x, deck - th - s * 0.3], [x, deck - th - s * 0.3, x + tw / 2, deck - th],
      [x - tw / 2, deck - th, x - tw / 2, deck - th - s * 0.14], [x + tw / 2, deck - th, x + tw / 2, deck - th - s * 0.14]], INK, 1))
  }
  const inL = cx - gap + tw / 2, inR = cx + gap - tw / 2
  m.push(lines([[inL, deck - th * 0.84, inR, deck - th * 0.84], [inL, deck - th * 0.74, inR, deck - th * 0.74], [inL, deck, inR, deck]], INK, 1.1))
  m.push(curve([[cx - gap - tw / 2, deck - th * 0.72], [cx - gap * 1.4, deck - th * 0.3], [cx - gap * 1.9, deck]], '#4A6FA5', 1.2))
  m.push(curve([[cx + gap + tw / 2, deck - th * 0.72], [cx + gap * 1.4, deck - th * 0.3], [cx + gap * 1.9, deck]], '#4A6FA5', 1.2))
  return m
}

// San Francisco's Golden Gate: twin towers, a sagging main cable, suspenders down to the deck.
function goldenGate(x1, x2, deck, s, w) {
  const top = deck - s * 1.7, low = deck - s * 0.12, red = '#C0362C', span = x2 - x1, m = []
  for (const x of [x1, x2]) {
    const d = s * 0.06
    m.push(lines([[x - d, deck + s * 0.15, x - d, top], [x + d, deck + s * 0.15, x + d, top],
      ...[0.15, 0.45, 0.75].map(k => [x - d, top + (deck - top) * k, x + d, top + (deck - top) * k])], red, 1.4, 'marker'))
  }
  const main = sag(x1, x2, top, low)
  m.push(curve(main, red, 1.2, 'marker'))
  m.push(curve(sag(x1 - span * 0.5, x1, top, low, -1), red, 1, 'marker'))
  m.push(curve(sag(x2, x2 + span * 0.5, top, low, 1), red, 1, 'marker'))
  m.push(lines(main.slice(1, -1).map(([x, y]) => [x, y, x, deck]), red, 0.5, 'HB'))
  m.push(lines([[x1 - span * 0.5, deck, Math.max(w + 40, x2 + span * 0.5), deck]], red, 1.3, 'marker'))
  return m
}

// Pencil skyline from `a` to `b`, London's landmarks into San Francisco's, growing from scale ts to s.
function skyline(a, b, deck, s, ts) {
  const at = u => a + (b - a) * u, k = u => ts + (s - ts) * u, m = []
  // A dense, low block line (fixed pseudo-random heights so repaints match), landmarks drawn over it.
  for (let i = 0; i < 18; i++) { const u = (i + 0.5) / 18, hh = 0.22 + ((i * 37) % 11) / 30; m.push(tower(at(u), deck, k(u) * (0.1 + (i % 3) * 0.04), k(u) * hh)) }
  const peak = (u, w, hh) => [[at(u) - k(u) * w, deck, at(u), deck - k(u) * hh], [at(u), deck - k(u) * hh, at(u) + k(u) * w, deck]]
  m.push(tower(at(0), deck, k(0) * 0.12, k(0) * 1.05), lines(peak(0, 0.07, 1.25), INK, 0.8, 'HB')) // Big Ben
  m.push(lines(peak(0.22, 0.2, 1.35), INK, 0.9, 'HB')) // the Shard
  m.push(tower(at(0.8), deck, k(0.8) * 0.16, k(0.8) * 1.45)) // Salesforce Tower
  m.push(lines(peak(0.94, 0.15, 1.1), '#46546A', 0.9, 'HB')) // Transamerica
  return m
}

function scene(name, w, h) {
  const m = []
  const edgeX = () => (Math.random() < 0.5 ? r(-0.05, 0.22) : r(0.78, 1.05)) * w
  if (name === 'hero') {
    // London to San Francisco along the bottom right, clear of the hero copy: Tower Bridge into the Golden Gate.
    // Keep in sync with .hero-crew's --s in globals.css: the mascots are placed on these bridges.
    // London on the left, smaller (far across the ocean, and under the hero buttons); San Francisco on the right; a skyline between.
    const s = Math.min(h * 0.22, w * 0.088), ts = s * 0.7, deck = h * 0.93
    const gg2 = w - s * 0.35, gg1 = gg2 - s * 2.2, tb = ts * 1.45
    m.push(wash(tb, deck - ts * 0.8, ts * 1.6, '#9FB4C7', 70), wash(gg1 + s * 1.1, deck - s * 1.4, s * 1.8, '#F6B37A', 70), wash(gg1 + s * 1.1, deck - s * 2, s * 0.6, '#E8A93A', 80))
    m.push(...skyline(tb + ts * 1.45, gg1 - s * 1.15, deck, s, ts), ...towerBridge(tb, deck, ts), ...goldenGate(gg1, gg2, deck, s, w))
    // LHR → SFO: a dotted flight path from one bridge to the other.
    const arc = sag(tb, gg2, deck - s * 1.5, deck - s * 2.1)
    m.push(lines(arc.slice(0, -1).flatMap(([x, y], i) => i % 2 ? [] : [[x, y, ...arc[i + 1]]]), '#46546A', 0.6, 'HB'))
    // Water last: the idle loop repaints the final few marks, so ripples are what keeps moving.
    for (let i = 0; i < 8; i++) { const x = r(0, w), y = r(deck + 6, h - 4); m.push(lines([[x, y, x + r(20, 70), y]], ACCENT.hero, 0.6, '2H')) }
  } else if (name === 'sonar') {
    const cx = w * 0.82, cy = h * 0.78
    m.push(wash(cx, cy, h * 0.45, '#8FC7EE', 55), wash(w * 0.08, h * 0.15, h * 0.3, '#C7B5EE', 55))
    for (let i = 1; i <= 6; i++) m.push(b => { ink(b, 'HB', '#2F7F86', 0.8); b.circle(cx, cy, i * h * 0.11, 0.25) })
    m.push(b => { ink(b, '2H', INK, 0.7); b.line(cx - h * 0.7, cy, cx + h * 0.7, cy); b.line(cx, cy - h * 0.7, cx, cy + h * 0.7) })
    for (let i = 0; i < 10; i++) m.push(bubble(edgeX(), r(0.05, 0.95) * h, r(3, 14)))
  }
  return m
}

const fade = (p, alpha) => () => { p.push(); p.noStroke(); p.fill(...PAPER, alpha); p.rect(-10, -10, p.width + 20, p.height + 20); p.pop() }

export default function Painter({ scene: active }) {
  const host = useRef(null)
  const api = useRef(null)
  const activeRef = useRef(active)

  useEffect(() => {
    let inst, dead = false
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = matchMedia('(pointer: fine)').matches
    const pixel = () => document.documentElement.classList.contains('pixel')

    ;(async () => {
      const { default: P5 } = await import('p5')
      P5.disableFriendlyErrors = true // its sketch verifier can't parse minified code
      window.p5 = P5 // p5.brush registers its lifecycle hooks on the global p5
      const brush = await import('p5.brush')
      if (dead) return

      inst = new P5(p => {
        brush.instance(p)
        let queue = [], mouse = null, prev = null, tick = 0, current

        const paint = name => {
          current = name
          const fades = Array.from({ length: 8 }, () => fade(p, 50))
          queue = [...fades, ...scene(name, p.width, p.height).map(f => () => f(brush))]
          if (reduce) p.redraw()
        }
        api.current = paint

        p.setup = () => {
          p.pixelDensity(Math.min(window.devicePixelRatio || 1, 1.5))
          p.createCanvas(window.innerWidth, window.innerHeight, p.WEBGL)
          brush.load()
          brush.scaleBrushes(2.2)
          p.background(...PAPER)
          if (reduce || pixel()) p.noLoop()
          paint(activeRef.current)
        }

        p.draw = () => {
          p.translate(-p.width / 2, -p.height / 2)
          const n = reduce ? queue.length : 2
          for (let i = 0; i < n && queue.length; i++) queue.shift()()
          if (reduce) return

          // Idle: a faint veil plus one fresh mark now and then keeps the page breathing without saturating.
          if (!queue.length && ++tick % 90 === 0) {
            fade(p, 10)()
            const s = scene(current, p.width, p.height)
            s[s.length - 1 - Math.floor(Math.random() * 6)](brush)
          }
          if (fine && mouse && prev && Math.hypot(mouse[0] - prev[0], mouse[1] - prev[1]) > 6) {
            ink(brush, 'charcoal', ACCENT[current], 0.5)
            brush.line(prev[0], prev[1], mouse[0], mouse[1])
          }
          if (mouse) prev = mouse
        }

        p.windowResized = () => {
          if (Math.abs(window.innerWidth - p.width) < 80 && Math.abs(window.innerHeight - p.height) < 160) return
          p.resizeCanvas(window.innerWidth, window.innerHeight)
          brush.load()
          p.background(...PAPER)
          paint(current)
        }

        // Pixel mode has its own scene (PixelSky); the brush loop sleeps until it's switched off.
        const onPixel = () => (pixel() || reduce ? p.noLoop() : p.loop())

        const onMove = e => { mouse = [e.clientX, e.clientY] }
        window.addEventListener('pointermove', onMove, { passive: true })
        window.addEventListener('pixelchange', onPixel)
        p._cleanupMove = () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('pixelchange', onPixel) }
      }, host.current)
    })()

    return () => { dead = true; api.current = null; inst?._cleanupMove?.(); inst?.remove() }
  }, [])

  useEffect(() => { activeRef.current = active; api.current?.(active) }, [active])

  return <div ref={host} aria-hidden="true" className="painter" />
}
