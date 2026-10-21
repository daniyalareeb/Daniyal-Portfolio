import { useEffect, useRef, useState } from 'react'
import { Mascot } from './Mascot'
import { Words } from './ProjectStory'
import { profile } from '../data/cv'

const SUGGEST = ['What is he building right now?', 'How does the voice interviewer work?', 'What’s his strongest stack?', 'How do I reach him?']

// Shared by Byte's chat and Ping's per-project questions.
export async function ask(messages, project) {
  const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: messages.slice(-8), project }) })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `I dozed off. Email him instead: ${profile.email}`)
  return data.answer
}

// Groq's Orpheus voice when it answers, the browser's own voice when it doesn't.
let playing
export async function speak(text) {
  playing?.pause(); window.speechSynthesis?.cancel()
  try {
    const r = await fetch('/api/speak', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) })
    if (!r.ok) throw new Error(r.status)
    playing = new Audio(URL.createObjectURL(await r.blob()))
    await playing.play()
  } catch {
    if (!window.speechSynthesis) return
    const u = new SpeechSynthesisUtterance(text)
    u.pitch = 1.5; u.rate = 1.05
    speechSynthesis.speak(u)
  }
}

// The chat at the foot of the page. Tapping Byte on the bridge (or "ask" in the nav) brings you here.
export default function AskByte() {
  const [voice, setVoice] = useState(false)
  const [msgs, setMsgs] = useState([])
  const [input, setInput] = useState('')
  const [mood, setMood] = useState('idle')
  const box = useRef(null)
  const log = useRef(null)
  const field = useRef(null)

  useEffect(() => { log.current?.scrollTo({ top: log.current.scrollHeight, behavior: 'smooth' }) }, [msgs, mood])
  useEffect(() => {
    const show = () => { box.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); field.current?.focus({ preventScroll: true }) }
    addEventListener('openbyte', show)
    return () => { removeEventListener('openbyte', show); playing?.pause(); window.speechSynthesis?.cancel() }
  }, [])

  async function send(text) {
    const q = text.trim().slice(0, 500)
    if (!q || mood === 'thinking') return
    const next = [...msgs, { role: 'user', content: q }]
    setMsgs(next); setInput(''); setMood('thinking')
    try {
      const answer = await ask(next)
      setMsgs(m => [...m, { role: 'assistant', content: answer }]); setMood('found')
      if (voice) speak(answer)
    } catch (e) {
      setMsgs(m => [...m, { role: 'assistant', content: e.message, error: true }]); setMood('warning')
    }
  }

  return (
    <div className="ask note reveal" ref={box}>
      <div className="ask-head">
        <Mascot who="byte" state={mood} size={110} className="bob" title="Byte the leaf sheep" />
        <div>
          <h2 className="display">Ask Byte</h2>
          <p className="hand">an LLM grounded on my CV. ask it anything about my work, it can answer out loud.</p>
        </div>
        <button type="button" className="voice-btn" aria-pressed={voice} onClick={() => setVoice(v => !v)}>{voice ? '🔊 talking' : '🔈 voice off'}</button>
      </div>

      <div className="ask-log" ref={log}>
        {msgs.length === 0 && (
          <div className="suggest">
            {SUGGEST.map(s => <button key={s} onClick={() => send(s)}>{s}</button>)}
          </div>
        )}
        {msgs.map((m, i) => (
          <p key={i} className={`msg ${m.role}${m.error ? ' error' : ''}`}>
            {m.role === 'assistant' ? <Words text={m.content} /> : m.content}
          </p>
        ))}
        {mood === 'thinking' && <p className="msg assistant"><span className="dots">···</span></p>}
      </div>

      <form className="ask-form" onSubmit={e => { e.preventDefault(); send(input) }}>
        <label htmlFor="ask-input" className="sr-only">Your question</label>
        <input id="ask-input" ref={field} value={input} maxLength={500} onChange={e => setInput(e.target.value)} placeholder="e.g. what did he build at Castly?" autoComplete="off" />
        <button type="submit" disabled={mood === 'thinking' || !input.trim()}>ask</button>
      </form>
    </div>
  )
}
