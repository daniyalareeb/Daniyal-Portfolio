import { useEffect } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { Mascot } from '../components/Mascot'
import { Words } from '../components/ProjectStory'
import Topbar from '../components/Topbar'
import PixelSky from '../components/PixelSky'
import { getSonar } from '../lib/sonar.mjs'

const Painter = dynamic(() => import('../components/Painter'), { ssr: false })
const WEEK = 7 * 24 * 3600

// No cron, no commits: Next.js rebuilds this page in the background at most once a week (ISR).
export async function getStaticProps() {
  const sonar = await getSonar()
  return { props: { sonar }, revalidate: sonar.stats.scanned ? WEEK : 3600 }
}

const BANDS = [
  { key: 'repos', title: 'Repos worth a star', note: 'new on GitHub this week', color: '#2F7F86', meta: i => `★ ${i.stars.toLocaleString('en-GB')}${i.lang ? ` · ${i.lang}` : ''}` },
  { key: 'launches', title: 'Launch HN', note: 'YC companies going live', color: '#E0663A', meta: i => `▲ ${i.points} on HN` },
  { key: 'raises', title: 'Money moves', note: 'raises, rounds, funds', color: '#B7791F', meta: () => 'via TechCrunch' },
]

// Stable pseudo-random spot on the scope for each item, so blips don't jump between renders.
const spot = s => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return { a: h % 360, r: 0.25 + ((h >> 9) % 70) / 100 } }

export default function Sonar({ sonar }) {
  useEffect(() => {
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) document.documentElement.classList.add('motion')
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))), { rootMargin: '0px 0px -10% 0px' })
    document.querySelectorAll('.reveal').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  const { week, generatedAt, headline, stats } = sonar
  const nice = d => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  const next = new Date(new Date(generatedAt).getTime() + WEEK * 1000)
  const blips = BANDS.flatMap(b => sonar[b.key].map((it, k) => ({ ...spot(it.title), id: `${b.key}-${k}`, title: it.title, color: b.color })))

  return (
    <>
      <Head>
        <title>Sonar · weekly pings from the deep · Daniyal Ahmad</title>
        <meta name="description" content="A self-updating weekly digest: useful new GitHub repos, YC launches and startup raises, curated by an LLM. Built by Daniyal Ahmad." />
      </Head>
      <Painter scene="sonar" />
      <PixelSky />
      <Topbar />

      <main className="wrap sonar">
        <section className="sonar-hero">
          <div>
            <p className="hand kicker reveal">week of {nice(week)} · auto-curated · rebuilds itself</p>
            <h1 className="display reveal">Sonar</h1>
            <div className="sonar-ping reveal">
              <Mascot who="ping" state="found" size={110} className="bob" />
              <p className="bubble"><Words text={headline || `Ping swept GitHub, Hacker News and TechCrunch for the week of ${nice(week)}. Here’s what came back.`} /></p>
            </div>
          </div>
          <div className="scope reveal" role="img" aria-label={`Sonar scope with ${blips.length} contacts`}>
            <span className="sweep" />
            {blips.map(b => (
              <a key={b.id} href={`#${b.id}`} className="blip" title={b.title} aria-label={b.title}
                style={{ '--c': b.color, left: `${50 + 50 * b.r * Math.sin(b.a * Math.PI / 180)}%`, top: `${50 - 50 * b.r * Math.cos(b.a * Math.PI / 180)}%`, animationDelay: `${(b.a / 360) * 4}s` }} />
            ))}
          </div>
        </section>

        {BANDS.map(b => (
          <section key={b.key} className="band" style={{ '--c': b.color }}>
            <h2 className="display section-title reveal">{b.title}<span className="hand">{b.note}</span></h2>
            {sonar[b.key].length ? (
              <ol className="contacts">
                {sonar[b.key].map((it, k) => (
                  <li key={it.url} id={`${b.key}-${k}`} className="contact note reveal">
                    <p className="mono meta">{String(k + 1).padStart(2, '0')} · {b.meta(it)}</p>
                    <h3><a href={it.url} target="_blank" rel="noreferrer">{it.title} ↗</a></h3>
                    {it.why && <p>{it.why}</p>}
                    {it.hn && <a className="mono small-link" href={it.hn} target="_blank" rel="noreferrer">discussion →</a>}
                  </li>
                ))}
              </ol>
            ) : <p className="hand reveal">quiet waters this week. nothing came back.</p>}
          </section>
        ))}

        <section className="readout note reveal" aria-label="How this page was made">
          <p className="mono"><b>$</b> sonar --since {week}</p>
          <p className="mono">↳ github search · hn algolia · techcrunch rss → <b>{stats.scanned}</b> signals in <b>{stats.ms}</b>ms{stats.failed ? ` (${stats.failed} source${stats.failed > 1 ? 's' : ''} down)` : ''}</p>
          <p className="mono">↳ curated by <b>{stats.model || 'raw ranking (no LLM key)'}</b></p>
          <p className="mono">↳ built {nice(generatedAt)} · next sweep after {nice(next)} · next.js ISR · £0/month</p>
        </section>
      </main>
    </>
  )
}
