import { limited } from './chat'

// Byte's voice: Groq's Orpheus TTS. Any failure returns an error and the browser falls back to its own voice.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const raw = String(req.body?.text || '').slice(0, 300)
  // Cut at the last full sentence so the voice never stops mid-word.
  const text = raw.length < 300 ? raw : raw.slice(0, raw.search(/[.!?][^.!?]*$/) + 1) || raw
  if (!text.trim() || !process.env.GROQ_API_KEY) return res.status(400).end()

  const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim()
  if (limited(ip)) return res.status(429).end()

  try {
    const r = await fetch('https://api.groq.com/openai/v1/audio/speech', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'canopylabs/orpheus-v1-english', voice: process.env.GROQ_VOICE || 'hannah', input: `[cheerful] ${text}`, response_format: 'wav' }),
      signal: AbortSignal.timeout(15_000),
    })
    if (!r.ok) { console.error('groq tts', r.status, (await r.text()).slice(0, 200)); return res.status(502).end() }
    res.setHeader('Content-Type', 'audio/wav')
    res.send(Buffer.from(await r.arrayBuffer()))
  } catch (e) {
    console.error('groq tts', e.message)
    res.status(502).end()
  }
}
