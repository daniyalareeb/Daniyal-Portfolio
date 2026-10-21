// Hand-drawn 8-bit stickers for pixel mode. One character per pixel; '.' is transparent.
const PAL = { k: '#1B2A3D', r: '#E0453A', w: '#FFFFFF', y: '#FFD23F', o: '#E8A93A', p: '#FF8FB8', c: '#F4EDE0' }

const ART = {
  heart: [
    '.kkk...kkk.',
    'krrrk.krrrk',
    'krwwrkrrrrk',
    'krwrrrrrrrk',
    'krrrrrrrrrk',
    '.krrrrrrrk.',
    '..krrrrrk..',
    '...krrrk...',
    '....krk....',
    '.....k.....',
  ],
  envelope: [
    'kkkkkkkkkkkkk',
    'kkccccccccckk',
    'kckccccccckck',
    'kcckccccckcck',
    'kccckccckccck',
    'kcccckrkcccck',
    'kccccckccccck',
    'kccccccccccck',
    'kccccccccccck',
    'kkkkkkkkkkkkk',
  ],
  sparkle: [
    '...y...',
    '...y...',
    '..yyy..',
    'yyywyyy',
    '..yyy..',
    '...y...',
    '...y...',
  ],
  coin: [
    '..kkkk..',
    '.kyyyyk.',
    'kyywyyok',
    'kywyykok',
    'kyyyykok',
    'kyyyykok',
    '.kooook.',
    '..kkkk..',
  ],
}

export default function Sprite({ name, className = '' }) {
  const rows = ART[name]
  return (
    <svg className={`sprite px-only ${className}`} viewBox={`0 0 ${rows[0].length} ${rows.length}`} shapeRendering="crispEdges" aria-hidden="true">
      {rows.flatMap((row, y) => [...row].map((ch, x) => PAL[ch] && <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={PAL[ch]} />))}
    </svg>
  )
}
