// Single source of truth: the page renders from this and the chat prompt is built from it.
export const profile = {
  name: 'Daniyal Ahmad',
  role: 'Software Engineer',
  tagline: 'I build AI agents that do real work: voice interviewers, company brains, school chiefs of staff.',
  location: 'London, UK',
  email: 'daniyalareeb123@gmail.com',
  linkedin: 'https://linkedin.com/in/daniyalareeb',
  github: 'https://github.com/daniyalareeb',
  cv: '/daniyal-ahmad-cv.pdf',
}

export const experience = [
  {
    company: 'CompanyOS', role: 'Founder & Software Engineer', when: 'Aug 2026 – Present', url: 'https://usecompanyos.com',
    points: [
      'Building an AI company brain: a multi-agent system that connects to a company’s tools through Nango’s MCP server and unifies scattered data into one memory layer that learns from every decision users approve or reject.',
      'Tool-calling agents that produce daily per-employee briefings over iMessage and a web dashboard, plus alerts when a leadership decision conflicts with what the company data shows.',
      'Spend analysis that finds where a company is burning money and generates per-employee efficiency plans. Pre-launch with an early waitlist.',
    ],
  },
  {
    company: 'BeRelentless', role: 'Founder & Software Engineer', when: 'Jan 2026 – Jun 2026', url: 'https://berelentless.dev',
    points: [
      'Turned my final-year dissertation into a startup: an interview-prep platform that turns preparation into hiring. Graduates filtered out by CV screens practise in live voice interviews with a real-time Keyframe Labs avatar, earn a verified skill score, and get found by startups. 25 users; won a Cartesia startup credit grant.',
      'Engineered the real-time voice agent pipeline end to end: LiveKit transport, Whisper speech-to-text, a GPT-4o interviewer handling follow-ups, Cartesia text-to-speech, Keyframe Labs avatar. Spent 3 months tuning turn-taking and latency to under 800ms per response so it feels like talking to a person.',
      'Now ships as Tally, a free open-source Claude Code plugin: a SessionEnd hook tallies how you actually build with your coding agent (prompts with secrets redacted, plus numeric stats, never code), verifies it against your GitHub commits, and lets founders find the best builders.',
      'RAG matching layer on Qdrant with BGE-M3 embeddings that ranks candidates against each startup’s role requirements, plus a verified skill score founders search by.',
      'Designed AI-allowed assessments that score judgment and live verbal defence instead of recall. Ran engineering, design and go-to-market solo.',
    ],
  },
  {
    company: 'Castly (Next Stage Talent)', role: 'Freelance Software Engineer · client project', when: '2025', url: 'https://castly.co.uk',
    points: [
      'Rebuilt a casting agency’s spreadsheet-driven operations into an automated two-sided marketplace, now with 460+ verified performers.',
      'Automated applications, the casting-director database and opportunity scraping, cutting manual work by 40% and doubling bookings. Ran ElevenLabs voice for booking calls, then retired it when per-call cost outweighed the value.',
    ],
  },
  {
    company: 'Stealth Health-Tech Startup (NDA)', role: 'Software Engineer', when: 'Sep 2025 – Dec 2025',
    points: [
      'FastAPI and Supabase backend that ingests smartwatch data and turns it into personalised habit and supplement recommendations instead of raw metrics.',
      'Instrumented services with OpenTelemetry tracing and metrics, with Grafana dashboards for performance and usage.',
    ],
  },
]

// Most code is private, so each project carries a sandbox: /api/chat runs `demo.prompt` as a simulated slice of the product.
export const projects = [
  {
    id: 'berelentless', name: 'BeRelentless', kind: 'Real-time AI voice interviews', when: '2026 · Cartesia grant', url: 'https://berelentless.dev',
    color: '#F08A3C',
    repo: 'https://github.com/daniyalareeb/tally',
    summary: 'Graduates get binned by CV filters before a human hears them. BeRelentless started as interview prep that turns preparation into hiring: a live voice interview with a real-time avatar that asks follow-ups like a real engineer, then a RAG layer ranks candidates for each startup. Today it’s Tally, a free Claude Code plugin that sits in your coding sessions, turns how you actually build into a verified profile, and lets founders hire the best builders. Next chapter: FairShot, below.',
    metrics: [['<800ms', 'voice response time'], ['3 months', 'tuning it to feel human'], ['25', 'users'], ['free', 'Claude Code plugin']],
    pipeline: ['LiveKit', 'Whisper STT', 'GPT-4o interviewer', 'Cartesia TTS', 'Keyframe avatar', 'Qdrant + BGE-M3'],
    demo: {
      cta: 'Take a 3-question mock interview', start: 'Start the interview.', placeholder: 'your answer…', voice: true,
      note: 'Text version on a small model. The real one is live voice with a Keyframe Labs avatar.',
      prompt: 'You are the BeRelentless AI interviewer for a junior software engineering role. First ask, in one sentence, which role or stack they are targeting. Then ask 3 questions in total, one at a time; after each answer ask one short follow-up that probes their reasoning, like a sharp but kind senior engineer. Keep every turn under 45 words, in natural spoken style. After the third question is answered, give a skill score out of 10, one strength and one thing to improve, then stop.',
    },
  },
  {
    id: 'fairshot', name: 'FairShot', kind: 'Agentic job board', when: '2026 · in build',
    color: '#F2C94C',
    summary: 'The next step for BeRelentless. Graduates send hundreds of blind applications and hear nothing back. FairShot pulls fresh jobs from public feeds, reads each one once for what it actually requires, and tiers it against your CV as Strong, Worth it or Reach using rules you can check, not a fuzzy score. An agent then tailors your CV (every bullet traced to your real CV, anything untraceable dropped), finds who to contact, and a Chrome extension fills in the form. You always press send.',
    metrics: [['7 days', 'max job age in the feed'], ['3 tiers', 'no fake percentages'], ['280+', 'automated tests'], ['0', 'applications sent without you']],
    pipeline: ['Public job feeds', 'Python worker · LLM extraction', 'pgvector + SQL filters', 'Rule-based tiers', 'Traced CV tailoring', 'Chrome autofill'],
    demo: {
      cta: 'Check your real odds on a job', start: 'Hi', placeholder: 'your skills, then paste a job post',
      note: 'One job at a time on a small model. The real one reads every new job every 6 hours.',
      prompt: 'You are FairShot, an honest job-matching agent. First ask, in one line, for their skills, years of experience and target role (a pasted CV summary is fine). Then ask them to paste a job post. Read it, list its must-haves and nice-to-haves, and mark each must-have as met or missing based on what they told you; count the same skill under another name (Postgres = SQL, TypeScript = JavaScript). Give one tier: Strong if every must-have is met, Worth it if exactly one is short, Reach if two or more are short or a required degree or seniority level is missing. Never give a percentage or a score. Then one honest sentence on why, and the one CV line they should lead with for this job, built only from what they told you. Plain lines, under 140 words.',
    },
  },
  {
    id: 'childrenstudy', name: 'ChildrenStudy', kind: 'Multi-agent school operations', when: '2026 · in daily use', url: 'https://childrenstudyschool.com',
    color: '#C7B5EE',
    summary: 'A 20-year-old school for first-generation learners in Varanasi can’t hire a chief of staff, or a tutor for every child. Agents check attendance, lesson plans and progress daily, draft lesson slides that teachers approve, and send the principal a weekly report. Every child gets Buddy, an owl study helper for homework and spoken English. Runs on free tiers.',
    metrics: [['daily', 'in use since Sep 2026'], ['5 + 10', 'teachers + students'], ['~£0', 'monthly running cost']],
    pipeline: ['Admin agent', 'Teacher agent', 'AI tutor', 'PocketBase', 'Cloudflare Pages'],
    demo: {
      cta: 'Ask Buddy a homework question', start: 'Hi', placeholder: 'e.g. what is 3/4 + 1/8?',
      note: 'Same tutoring rules as the Buddy students use: hints, not answers.',
      prompt: 'You are Buddy, the friendly owl study helper at Children Study school, talking to a student aged 5 to 14. Greet them in one short line and ask what they are stuck on, or offer to practise speaking English. Never give the final answer straight away: guide with one hint or question at a time, praise effort, and check understanding before moving on. Use simple words and keep each turn under 50 words. Kindly decline anything unsafe or unrelated to schoolwork.',
    },
  },
  {
    id: 'companyos', name: 'CompanyOS', kind: 'AI company brain', when: '2026 · pre-launch', url: 'https://usecompanyos.com',
    color: '#8CCB7A',
    summary: 'Company knowledge is scattered across twenty tools. CompanyOS connects to all of them through Nango’s MCP server, builds one memory layer that learns from every decision users approve or reject, and briefs each employee every morning over iMessage.',
    metrics: [['MCP', 'tool connectors via Nango'], ['daily', 'per-employee briefings'], ['pre-launch', 'early waitlist']],
    pipeline: ['Nango MCP', 'Memory layer', 'Tool-calling agents', 'iMessage briefing'],
    demo: {
      cta: 'Get a sample morning briefing', start: 'Hi', placeholder: 'e.g. Head of Sales at a 40-person SaaS',
      note: 'Simulated on a made-up company. The real one reads your actual tools.',
      prompt: 'You are CompanyOS, an AI company brain. First ask, in one line, for their role and what kind of company they work at. Then write a short iMessage-style morning briefing for a made-up company (say once that it is a fictional example) with: three things that changed overnight across tools like Slack, HubSpot, Linear and Stripe; one alert where a leadership decision conflicts with what the data shows; one place money is leaking, with a fix. Under 130 words, plain lines, no markdown. Then offer to dig into any item.',
    },
  },
  {
    id: 'phathom', name: 'Phathom', kind: 'AI that answers your WhatsApp calls', when: '2026 · open source',
    color: '#5FD1B5',
    repo: 'https://github.com/daniyalareeb/phathom',
    summary: 'WhatsApp calls have no voicemail and no notes. Phathom is a Chrome extension plus a local Python server that joins WhatsApp Web calls. It either takes notes quietly, or picks up as your assistant using today’s brief (“if Ahmed asks about the report, it goes out tonight”) and talks back in English or Urdu. Every call is recorded, transcribed and summarised, so later you can just ask “what did Ahmed want?”.',
    metrics: [['EN + UR', 'spoken replies'], ['2 modes', 'silent notes or answer for me'], ['local-first', 'own server + embedded DB'], ['£0', 'free-tier Groq']],
    pipeline: ['Chrome extension', 'WebRTC audio tap', 'Whisper on Groq', 'gpt-oss live replies', 'edge-tts EN/UR', 'SurrealDB call memory'],
    demo: {
      cta: 'Call Daniyal and let Phathom pick up', start: 'Ring ring', placeholder: 'say who you are and why you’re calling', voice: true,
      note: 'Text version with an example brief. The real one speaks inside the WhatsApp call.',
      prompt: 'You are Phathom, the AI assistant answering a WhatsApp call for Daniyal, who cannot pick up right now. Open with one short spoken line: say you are his assistant and ask who is calling and what it is about. Example brief for today: he is heads-down building until 6pm; Thursday afternoon is free for a meeting; never share his location or personal details. Keep every turn under 35 words, warm and natural. If the caller writes in Urdu, reply in Urdu. Take a message, read it back in one line, and say goodbye. Then, on a new line starting "Note for Daniyal:", write a two-line call summary: who called, what they want, and any follow-up.',
    },
  },
  {
    id: 'castly', name: 'Castly', kind: 'Two-sided casting marketplace', when: '2025 · client project', url: 'https://castly.co.uk',
    color: '#D9479F',
    summary: 'A casting agency running on spreadsheets. I rebuilt it as a two-sided marketplace and automated applications, the casting-director database and opportunity scraping. Tried AI voice booking calls, then switched them off when they cost more than they earned.',
    metrics: [['460+', 'verified performers'], ['−40%', 'manual work'], ['2×', 'bookings']],
    pipeline: ['Applications', 'Director DB', 'Scrapers', 'Bookings'],
  },
  {
    id: 'pixelinventory', name: 'Pixel Inventory', kind: 'Android gear-tracking app', when: '2026 · client project',
    color: '#FF8A65',
    summary: 'A photography studio needs to know where every camera, lens and light is: which room, rack and shelf, or which renter has it. I built them a native Android app for staff. Scan a QR label to find or move any item, print labels in batches, check gear out to renters and back in with its condition, and get reminders for overdue returns. Owner and staff roles are enforced in the database, backups are automated, and it all runs on free tiers.',
    metrics: [['4 levels', 'studio → room → rack → shelf'], ['QR', 'scan to find or move'], ['10', 'build phases, e2e tested'], ['£0', 'monthly running cost']],
    pipeline: ['React + Capacitor', 'ML Kit QR scanning', 'Label printing', 'Rentals + returns', 'Supabase + RLS', 'GitHub Actions backups'],
    demo: {
      cta: 'Walk through a check-out', start: 'Hi', placeholder: 'e.g. where is the Canon 24-70?',
      note: 'The app has no chatbot. This plays its screens as text, on a made-up catalogue.',
      prompt: 'You play the screens of Pixel Inventory, an Android app photography-studio staff use to track gear, as short plain-text steps. Say once that the catalogue is made up. Greet them in one line and offer three things: find an item, check gear out to a renter, or check it back in. Invent a small believable catalogue on the fly (cameras, lenses, lights, stands). Finding an item: show its location as Studio > Room > Rack > Shelf, or which renter has it and when it is due. Check-out: ask for the renter and the return date, then show the confirmation as the app would. Check-in: ask for the condition, then say which shelf to put it on. Keep each turn under 50 words.',
    },
  },
  {
    id: 'nexus', name: 'Nexus GTM', kind: 'AI outbound engine', when: '2026',
    color: '#8FC7EE',
    summary: 'One sentence in, a go-to-market plan out. A planner agent defines the ICP, then research, lead and content agents run in parallel: researching competitors and the market, finding and enriching leads through an Apollo → Snov → Hunter waterfall, and writing personalised ad campaigns, cold emails, social posts and a marketing strategy. It ran BeRelentless’s outbound.',
    metrics: [['4', 'agents, 3 in parallel'], ['7-sheet', 'GTM pack per run'], ['£0', 'free-tier models']],
    pipeline: ['Planner · ICP', 'Research agent', 'Lead agent', 'Content agent', 'GTM pack'],
    demo: {
      cta: 'Get a sample GTM plan', start: 'Hi', placeholder: 'what you sell, and to whom',
      note: 'Leads here are invented. The real one enriches from Apollo and the web.',
      prompt: 'You are Nexus GTM, an AI outbound engine. First ask, in one line, what they sell and who their ideal customer is. Then reply with: a one-line ICP summary; two invented example lead profiles, clearly labelled as fictional, each with role, company type and the signal that makes them a fit; one personalised ad (headline plus one line, and the channel to run it on); one cold email under 70 words; and three short marketing-strategy moves for the next 30 days. Plain lines, no markdown.',
    },
  },
]

export const education = {
  school: 'University of East London', degree: 'BSc (Hons) Computer Science', when: '2026',
  grades: [['Software Development', 94], ['Artificial Intelligence', 93], ['Web Development', 89], ['Data Structures & Algorithms', 88]],
}

export const skills = {
  'AI & Agents': ['Multi-agent orchestration', 'Tool calling (MCP)', 'Memory layers', 'RAG', 'BGE-M3', 'Qdrant', 'ChromaDB', 'Pydantic', 'Prompt caching', 'OpenAI', 'OpenRouter', 'Groq'],
  'Real-time voice': ['LiveKit', 'WebRTC', 'Whisper', 'Cartesia', 'ElevenLabs', 'edge-tts'],
  'Languages': ['Python', 'TypeScript', 'JavaScript', 'SQL', 'Java'],
  'Backend & web': ['FastAPI', 'asyncio', 'REST', 'Next.js', 'React', 'Node.js', 'Chrome extensions', 'Capacitor (Android)'],
  'Data': ['PostgreSQL', 'pgvector', 'Supabase', 'PocketBase', 'SurrealDB', 'Redis'],
  'Ops': ['Docker', 'GitHub Actions', 'Railway', 'DigitalOcean', 'Vercel', 'Cloudflare', 'Linux', 'Sentry', 'PostHog', 'OpenTelemetry', 'Grafana'],
}

// How I work with coding agents. Each line must stay true of the repos above.
export const workflow = [
  'claude code is my pair · every repo has a CLAUDE.md with its rules: plan first, list the files before touching more than 3, done means tests pass',
  'skills + hooks: a knowledge graph of the codebase rebuilds after every edit, so the agent checks callers and blast radius before changing code',
  'smallest complete change: no speculative abstractions · every deliberate corner cut is a `shortcut:` comment, listed later as debt',
  'secure by default: row-level security on every table · PII redacted before any LLM call · secrets never enter the agent’s context · tests never touch prod',
  'shipped with checks: 280+ tests on FairShot, Playwright e2e + CI on Pixel Inventory, a written security review before launch',
  'measured: Tally scores my own agent sessions against my real commits',
]

export const cvText = [
  `${profile.name}, ${profile.role}, ${profile.location}. Email ${profile.email}. LinkedIn ${profile.linkedin}. GitHub ${profile.github}.`,
  'EXPERIENCE',
  ...experience.map(e => `${e.company} | ${e.role} | ${e.when}${e.url ? ` | ${e.url}` : ''}\n- ${e.points.join('\n- ')}`),
  'PROJECTS',
  ...projects.map(p => `${p.name} (${p.kind}, ${p.when}): ${p.summary} ${p.metrics.map(([v, k]) => `${v} ${k}`).join(', ')}. Stack: ${p.pipeline.join(', ')}.`),
  `HOW I BUILD\n- ${workflow.join('\n- ')}`,
  `EDUCATION\n${education.school}, ${education.degree}, ${education.when}. ${education.grades.map(([k, v]) => `${k} ${v}%`).join(', ')}.`,
  `SKILLS\n${Object.entries(skills).map(([k, v]) => `${k}: ${v.join(', ')}`).join('\n')}`,
].join('\n\n')
