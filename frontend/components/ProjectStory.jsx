import Sandbox from './Sandbox'
import { profile } from '../data/cv'

export const Words = ({ text }) => text.split(' ').map((w, i) => (
  <span key={i} className="word" style={{ animationDelay: `${i * 28}ms` }}>{w} </span>
))

// A case study on the left; on the right, a sandbox for private products or the live site for public ones.
export default function ProjectStory({ project: p, index }) {
  const walkthrough = `mailto:${profile.email}?subject=${encodeURIComponent(`${p.name} walkthrough`)}`
  return (
    <article className="project reveal" style={{ '--c': p.color }}>
      <div className="case">
        <p className="mono label">{String(index + 1).padStart(2, '0')} · {p.kind} · {p.when}</p>
        <h3 className="display">{p.name}</h3>
        <p>{p.summary}</p>
        <dl className="metrics">
          {p.metrics.map(([v, k]) => <div key={k}><dt>{v}</dt><dd>{k}</dd></div>)}
        </dl>
        <ol className="pipeline" aria-label="Architecture">
          {p.pipeline.map((s, k) => <li key={k} style={{ animationDelay: `${k * 120}ms` }}>{s}</li>)}
        </ol>
        <p className="mono project-links">
          {p.url && <a href={p.url} target="_blank" rel="noreferrer">live ↗</a>}
          {p.repo ? <a href={p.repo} target="_blank" rel="noreferrer">code ↗</a> : <a href={walkthrough}>code is private · ask for a walkthrough →</a>}
        </p>
      </div>
      {p.demo ? <Sandbox project={p} /> : (
        <a className="live-card" href={p.url} target="_blank" rel="noreferrer">
          <span className="mono">{p.url.replace('https://', '')}</span>
          <span className="display">It’s live. Go poke it ↗</span>
        </a>
      )}
    </article>
  )
}
