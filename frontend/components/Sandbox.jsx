import { useEffect, useRef, useState } from 'react'
import { Mascot } from './Mascot'
import { ask, speak } from './AskByte'

const MAX = 20 // messages per session; enough for the full mock interview, cheap enough for the free quota

// A simulated slice of a private product: Ping drives /api/chat with that project's demo prompt.
export default function Sandbox({ project: p }) {
  const [msgs, setMsgs] = useState(null) // null until started; the hidden opener is msgs[0]
  const [input, setInput] = useState('')
  const [mood, setMood] = useState('idle')
  const [voice, setVoice] = useState(false)
  const [canSpeak, setCanSpeak] = useState(false)
  const log = useRef(null)

  useEffect(() => { log.current?.scrollTo({ top: log.current.scrollHeight, behavior: 'smooth' }) }, [msgs, mood])
  useEffect(() => { setCanSpeak('speechSynthesis' in window); return () => window.speechSynthesis?.cancel() }, [])

  async function send(history) {
    setMsgs(history); setMood('thinking')
    try {
      const answer = await ask(history, p.id)
      setMsgs([...history, { role: 'assistant', content: answer }]); setMood('found')
      if (voice) speak(answer)
    } catch (e) {
      setMsgs([...history, { role: 'assistant', content: e.message, error: true }]); setMood('warning')
    }
  }

  function submit(e) {
    e.preventDefault()
    const q = input.trim().slice(0, 500)
    if (!q || mood === 'thinking') return
    setInput('')
    send([...msgs, { role: 'user', content: q }])
  }

  const over = msgs && msgs.length >= MAX

  return (
    <div className="sandbox">
      <div className="sandbox-bar mono">
        <span className="lights" aria-hidden="true"><i /><i /><i /></span>
        <span>sandbox://{p.id}</span>
        {p.demo.voice && canSpeak && (
          <label className="voice"><input type="checkbox" checked={voice} onChange={e => setVoice(e.target.checked)} /> read aloud</label>
        )}
      </div>

      {!msgs ? (
        <div className="sandbox-start">
          <Mascot who="ping" state="idle" size={96} className="bob" />
          <button className="btn" onClick={() => send([{ role: 'user', content: p.demo.start }])}>{p.demo.cta} →</button>
          <p className="hand">{p.demo.note}</p>
        </div>
      ) : (
        <>
          <div className="sandbox-log" ref={log} aria-live="polite">
            {msgs.slice(1).map((m, i) => <p key={i} className={`msg ${m.role}${m.error ? ' error' : ''}`}>{m.content}</p>)}
            {mood === 'thinking' && <p className="msg assistant"><span className="dots">···</span></p>}
          </div>
          {over ? (
            <p className="hand sandbox-end">Demo over. <button className="linkish" onClick={() => { setMsgs(null); setMood('idle') }}>start again ↺</button></p>
          ) : (
            <form className="ask-form" onSubmit={submit}>
              <label htmlFor={`try-${p.id}`} className="sr-only">Reply to the {p.name} demo</label>
              <input id={`try-${p.id}`} value={input} maxLength={500} onChange={e => setInput(e.target.value)} placeholder={p.demo.placeholder} autoComplete="off" />
              <button type="submit" disabled={mood === 'thinking' || !input.trim()}>send</button>
            </form>
          )}
        </>
      )}
    </div>
  )
}
