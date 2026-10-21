import { useEffect, useState } from 'react'
import Link from 'next/link'
import { profile } from '../data/cv'

// Old-console screen change: blocks fill the screen in random order, the mode swaps underneath, then they clear.
function wipe(swap) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return swap()
  const B = 40, cols = Math.ceil(innerWidth / B), rows = Math.ceil(innerHeight / B)
  const c = Object.assign(document.createElement('canvas'), { width: cols, height: rows, className: 'wipe' })
  document.body.append(c)
  const g = c.getContext('2d'), cells = [...Array(cols * rows).keys()].sort(() => Math.random() - 0.5)
  const per = Math.ceil(cells.length / 10)
  g.fillStyle = '#1B2A3D'
  let i = 0, filling = true
  const step = () => {
    for (const n of cells.slice(i, i + per)) (filling ? g.fillRect : g.clearRect).call(g, n % cols, Math.floor(n / cols), 1, 1)
    i += per
    if (i < cells.length) return requestAnimationFrame(step)
    if (!filling) return c.remove()
    swap(); filling = false; i = 0
    requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

export default function Topbar() {
  const [pixel, setPixel] = useState(false)

  const toggle = () => !document.querySelector('.wipe') && wipe(() => {
    const on = document.documentElement.classList.toggle('pixel')
    setPixel(on)
    try { localStorage.pixel = on ? '1' : '0' } catch {}
    window.dispatchEvent(new Event('pixelchange'))
  })

  // Catching Ping in the hero fires 'flipworld'; the switch here does the same.
  useEffect(() => {
    setPixel(document.documentElement.classList.contains('pixel'))
    addEventListener('flipworld', toggle)
    return () => removeEventListener('flipworld', toggle)
  }, [])

  return (
    <header className="topbar">
      <a href="/#top" className="monogram display" aria-label="Home">D<span>a</span></a>
      <nav aria-label="Sections">
        <a href="/#experience">experience</a><a href="/#projects">projects</a>
        <a href="/#ask">ask</a>
        <Link href="/sonar" className="keep sonar-link"><i className="radar" aria-hidden="true" />sonar</Link>
        <button type="button" className="world-toggle" role="switch" aria-checked={pixel} aria-label="8-bit edition" onClick={toggle}>
          <span className={pixel ? 'on' : ''}>8-bit</span><span className={pixel ? '' : 'on'}>painted</span>
        </button>
        <a href={profile.cv} className="cv" download>CV ↓</a>
      </nav>
      {/* Blocky mosaic for SVGs in pixel mode: sample one dot per 6px cell, then grow it to fill the cell. */}
      <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
        <filter id="pixelate" x="0" y="0">
          <feFlood x="3" y="3" height="1" width="1" />
          <feComposite width="6" height="6" />
          <feTile result="grid" />
          <feComposite in="SourceGraphic" in2="grid" operator="in" />
          <feMorphology operator="dilate" radius="3" />
        </filter>
      </svg>
    </header>
  )
}
