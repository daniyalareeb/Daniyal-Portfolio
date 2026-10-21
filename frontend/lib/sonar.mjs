// Sonar: a weekly ping of useful new repos, YC launches and raises. All sources are free and keyless;
// Groq (if GROQ_API_KEY is set) picks the genuinely useful items and writes one-line takes.
const DAY = 86_400_000
const get = (url, opts = {}) => fetch(url, { ...opts, signal: AbortSignal.timeout(10_000) })
  .then(r => { if (!r.ok) throw new Error(`${r.status} ${url}`); return opts.text ? r.text() : r.json() })

async function repos(since) {
  const q = encodeURIComponent(`created:>${since.toISOString().slice(0, 10)} stars:>40 fork:false`)
  const headers = { Accept: 'application/vnd.github+json', ...(process.env.GITHUB_TOKEN && { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }) }
  const { items } = await get(`https://api.github.com/search/repositories?q=${q}&sort=stars&order=desc&per_page=30`, { headers })
  return items.filter(r => r.description).map(r => ({ title: r.full_name, url: r.html_url, blurb: r.description.slice(0, 200), stars: r.stargazers_count, lang: r.language }))
}

async function launches(since) {
  const ts = Math.floor(since / 1000)
  const { hits } = await get(`https://hn.algolia.com/api/v1/search?query=${encodeURIComponent('Launch HN')}&tags=story&numericFilters=created_at_i%3E${ts}&hitsPerPage=30`)
  return hits.filter(h => /^Launch HN:/i.test(h.title)).map(h => ({
    title: h.title.replace(/^Launch HN:\s*/i, ''), url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
    hn: `https://news.ycombinator.com/item?id=${h.objectID}`, points: h.points,
  }))
}

// shortcut: regex RSS parsing, fine for one well-formed feed; swap for a parser if more feeds are added.
export function parseRss(xml, since) {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, it]) => {
    const tag = t => (it.match(new RegExp(`<${t}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${t}>`)) || [])[1]?.trim()
    const decode = s => s?.replace(/&#8217;|&#039;/g, '’').replace(/&#8216;/g, '‘').replace(/&#8220;|&#8221;|&quot;/g, '"').replace(/&amp;/g, '&').replace(/<[^>]+>/g, '')
    return { title: decode(tag('title')), url: tag('link'), blurb: decode(tag('description'))?.slice(0, 200) || '', date: new Date(tag('pubDate')) }
  }).filter(i => i.title && i.url?.startsWith('https://') && i.date >= since)
}

const raises = since => get('https://techcrunch.com/category/venture/feed/', { text: true }).then(x => parseRss(x, since).map(({ date, ...i }) => i))

// Keep only picks that point at real candidates; anything the model invents is dropped.
export function applyPicks(pool, picks, n) {
  const chosen = (Array.isArray(picks) ? picks : []).filter(p => Number.isInteger(p?.i) && pool[p.i])
    .filter((p, k, a) => a.findIndex(o => o.i === p.i) === k).slice(0, n)
    .map(p => ({ ...pool[p.i], why: String(p.why || '').slice(0, 160) }))
  return chosen.length ? chosen : pool.slice(0, n).map(i => ({ ...i, why: i.blurb || '' }))
}

async function curate(pools) {
  if (!process.env.GROQ_API_KEY) return { model: null, picks: {} }
  const model = process.env.GROQ_MODEL || 'openai/gpt-oss-120b'
  const list = Object.fromEntries(Object.entries(pools).map(([k, v]) => [k, v.map((it, i) => ({ i, title: it.title, blurb: it.blurb, stars: it.stars, points: it.points }))]))
  const r = await get('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model, temperature: 0.4, max_completion_tokens: 2000, response_format: { type: 'json_object' },
      ...(model.startsWith('openai/gpt-oss') && { reasoning_effort: 'low' }),
      messages: [
        { role: 'system', content: 'You curate a weekly digest for AI engineers and startup builders. Readers speak English. Prefer repos that are genuinely useful tools or libraries over hype, awesome-lists, or clones. For each pick write "why": one plain sentence, max 18 words, saying what it is and why a builder should care. No emojis, no marketing tone.' },
        { role: 'user', content: `Pick up to 6 repos, 5 launches, 5 raises, by index. Also write "headline": one dry, witty sentence summarising the week. Reply as JSON {"headline": string, "repos":[{"i":0,"why":""}], "launches":[...], "raises":[...]}.\n\n${JSON.stringify(list)}` },
      ],
    }),
  })
  return { model, picks: JSON.parse(r.choices[0].message.content) }
}

export async function getSonar(now = Date.now()) {
  const t0 = Date.now(), since = new Date(now - 7 * DAY)
  const [r, l, f] = await Promise.allSettled([repos(since), launches(since), raises(since)])
  const pools = { repos: r.value || [], launches: l.value || [], raises: f.value || [] }
  const { model, picks } = await curate(pools).catch(e => (console.error('sonar curate', e.message), { model: null, picks: {} }))
  ;[r, l, f].forEach(x => x.status === 'rejected' && console.error('sonar source', x.reason?.message))
  return {
    week: since.toISOString().slice(0, 10), generatedAt: new Date(now).toISOString(),
    headline: typeof picks.headline === 'string' ? picks.headline.slice(0, 200) : null,
    repos: applyPicks(pools.repos, picks.repos, 6),
    launches: applyPicks(pools.launches, picks.launches, 5),
    raises: applyPicks(pools.raises, picks.raises, 5),
    stats: { scanned: pools.repos.length + pools.launches.length + pools.raises.length, ms: Date.now() - t0, model, failed: [r, l, f].filter(x => x.status === 'rejected').length },
  }
}
