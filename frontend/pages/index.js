import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Mascot } from '../components/Mascot'
import ProjectStory, { Words } from '../components/ProjectStory'
import AskByte from '../components/AskByte'
import Topbar from '../components/Topbar'
import PixelSky from '../components/PixelSky'
import Sprite from '../components/Sprite'
import { profile, experience, projects, education, skills, workflow } from '../data/cv'

const Painter = dynamic(() => import('../components/Painter'), { ssr: false })

// Lines take the current edition, so Ping always points at the other one.
const HELLO = [
  { mood: 'idle', text: () => 'Hi! I’m Ping. That’s Byte. We live inside Daniyal’s projects.' },
  { mood: 'found', text: px => `This is the ${px ? '8-bit' : 'hand-painted'} edition. Catch me and the whole world flips to the ${px ? 'painted' : '8-bit'} one.` },
  { mood: 'idle', text: () => 'Most of his code is private, so scroll down: every product has a live sandbox you can poke.' },
  { mood: 'done', text: () => 'Questions about him? Tap Byte on the bridge. Byte has read his CV. Twice. And Sonar up top pings the week’s best new repos.' },
]
const TAUNTS = ['Too slow!', 'Nope! Over here.', 'Ha! Almost.']

const PROOF = [
  ['<800ms', 'voice agent response time'],
  ['460+', 'performers on Castly'],
  ['25', 'users on BeRelentless'],
  ['daily', 'ChildrenStudy in school use'],
]

export default function Home() {
  const [hi, setHi] = useState(0)
  const [pixel, setPixel] = useState(true)
  const [quip, setQuip] = useState(null) // a one-off line that overrides HELLO until the next beat
  const [dodge, setDodge] = useState({ n: 0, x: 0, y: 0 })

  useEffect(() => {
    const sync = () => {
      const on = document.documentElement.classList.contains('pixel')
      setPixel(on)
      return on
    }
    sync()
    const flipped = () => setQuip({ mood: 'done', text: `Whoa, ${sync() ? 'pixels' : 'paint'}! Catch me again to flip back.` })
    addEventListener('pixelchange', flipped)
    const beat = setInterval(() => { setQuip(null); setHi(n => (n + 1) % HELLO.length) }, 7000)
    return () => { removeEventListener('pixelchange', flipped); clearInterval(beat) }
  }, [])

  // Mouse only: Ping hops away twice, then lets itself be caught. Touch and keyboard catch on the first try.
  const flee = e => {
    if (e.pointerType !== 'mouse' || dodge.n >= 2) return
    setDodge({ n: dodge.n + 1, x: dodge.n ? 0 : -(80 + Math.random() * 80), y: -(40 + Math.random() * 60) })
    setQuip({ mood: 'found', text: TAUNTS[dodge.n] })
  }
  const caught = () => {
    setDodge({ n: 0, x: 0, y: 0 })
    dispatchEvent(new Event('flipworld'))
  }

  useEffect(() => {
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) document.documentElement.classList.add('motion')
    const reveal = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add('in'), reveal.unobserve(e.target))), { rootMargin: '0px 0px -10% 0px' })
    document.querySelectorAll('.reveal').forEach(el => reveal.observe(el))
    // The painting belongs to the hero; it fades back once you scroll into the work.
    const hero = new IntersectionObserver(([e]) => document.documentElement.classList.toggle('past-hero', !e.isIntersecting), { threshold: 0.15 })
    hero.observe(document.getElementById('top'))
    return () => { reveal.disconnect(); hero.disconnect(); document.documentElement.classList.remove('past-hero') }
  }, [])

  const beat = quip || { ...HELLO[hi], text: HELLO[hi].text(pixel) }

  return (
    <>
      <Painter scene="hero" />
      <PixelSky />
      <a href="#main" className="skip">Skip to content</a>

      <Topbar />

      <main id="main">
        <section id="top" className="hero">
          <div className="hero-copy">
            <p className="mono kicker reveal">{profile.role} · {profile.location}</p>
            <h1 className="display reveal">Daniyal <em>Ahmad</em><Sprite name="heart" className="sticker heart" /></h1>
            <p className="lede reveal">{profile.tagline}</p>
            <dl className="metrics proof reveal">
              {PROOF.map(([v, k]) => <div key={k}><dt>{v}</dt><dd>{k}</dd></div>)}
            </dl>
            <div className="ctas reveal">
              <a className="btn" href="#projects">Try the projects</a>
              <a className="btn ghost" href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a>
              <a className="btn ghost" href={profile.cv} download>CV ↓</a>
            </div>
          </div>

          <div className="hero-crew reveal">
            <Sprite name="sparkle" className="sticker spark-a" />
            <Sprite name="sparkle" className="sticker spark-b" />
            <Sprite name="coin" className="sticker coin" />
            <p className="bubble" key={beat.text} aria-live="polite"><Words text={beat.text} /></p>
            <button className="byte" onClick={() => dispatchEvent(new Event('openbyte'))} aria-label="Ask Byte about Daniyal">
              <Mascot who="byte" state={beat.mood} size={104} className="bob slow" />
              <span className="catch-me ask-me hand" aria-hidden="true">ask me!</span>
            </button>
            <button className="crew" onPointerEnter={flee} onClick={caught} style={{ '--dx': `${dodge.x}px`, '--dy': `${dodge.y}px` }}
              aria-label={`Catch Ping: switch to the ${pixel ? 'painted' : '8-bit'} edition`}>
              <Mascot who="ping" state={beat.mood} size={118} className="bob" />
              <span className="catch-me hand" aria-hidden="true">catch me!</span>
            </button>
          </div>
        </section>

        <section id="experience" className="wrap">
          <h2 className="display section-title reveal">Experience<span className="hand">where I’ve shipped</span></h2>
          <ol className="timeline">
            {experience.map(e => (
              <li key={e.company} className="entry note reveal">
                <p className="mono when">{e.when}</p>
                <h3 className="display">{e.url ? <a href={e.url} target="_blank" rel="noreferrer">{e.company} ↗</a> : e.company}</h3>
                <p className="role">{e.role}</p>
                <ul>{e.points.map((pt, k) => <li key={k}>{pt}</li>)}</ul>
              </li>
            ))}
          </ol>

          <div className="toolbox note reveal">
            <h3 className="display">Stack</h3>
            {Object.entries(skills).map(([k, v]) => (
              <div key={k} className="skills"><p className="hand">{k}</p><p>{v.map(s => <span key={s} className="tag">{s}</span>)}</p></div>
            ))}
            <p className="edu"><b>{education.degree}</b>, {education.school}, {education.when}. {education.grades.map(([k, v]) => `${k} ${v}%`).join(' · ')}</p>
          </div>
        </section>

        <section id="projects" className="wrap">
          <h2 className="display section-title reveal">Projects<span className="hand">most code is private, so each one has a live sandbox. try them.</span></h2>
          {projects.map((p, i) => <ProjectStory key={p.id} project={p} index={i} />)}
          <section className="readout note reveal" aria-label="How I build">
            <p className="mono"><b>$</b> cat how-i-build</p>
            {workflow.map(w => <p key={w} className="mono">↳ {w}</p>)}
          </section>
        </section>

        <section id="ask" className="wrap ask-wrap">
          <AskByte />
          <section className="readout note reveal" aria-label="How this site works">
            <p className="mono"><b>$</b> cat how-this-site-works</p>
            <p className="mono">↳ next.js · one data file (data/cv.js) renders the page and grounds every LLM prompt</p>
            <p className="mono">↳ chat + sandboxes: one api route → open-weight LLM on groq · prompts live server-side · rate-limited per IP</p>
            <p className="mono">↳ <Link href="/sonar">sonar</Link>: github + hn + techcrunch → LLM-curated weekly digest · ISR rebuild, no cron</p>
            <p className="mono">↳ design season 01: tower bridge → golden gate, painted stroke by stroke with p5.brush</p>
            <p className="mono">↳ <b>£0/month</b> to run</p>
          </section>
          <footer className="foot reveal">
            <p className="display">Let’s build something that does real work.</p>
            <p className="links">
              <a href={`mailto:${profile.email}`}><Sprite name="envelope" className="inline-sprite" />{profile.email}</a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
              <a href={profile.cv} download>CV (PDF)</a>
            </p>
          </footer>
        </section>
      </main>
    </>
  )
}
