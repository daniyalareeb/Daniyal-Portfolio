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
    summary: 'Graduates get binned by CV filters before a human hears them. BeRelentless started as interview prep that turns preparation into hiring: a live voice interview with a real-time avatar that asks follow-ups like a real engineer, then a RAG layer ranks candidates for each startup. Today it’s Tally, a free Claude Code plugin that sits in your coding sessions, turns how you actually build into a verified profile, and lets founders hire the best builders.',
    metrics: [['<800ms', 'voice response time'], ['3 months', 'tuning it to feel human'], ['25', 'users'], ['free', 'Claude Code plugin']],
    pipeline: ['LiveKit', 'Whisper STT', 'GPT-4o interviewer', 'Cartesia TTS', 'Keyframe avatar', 'Qdrant + BGE-M3'],
    demo: {
      cta: 'Take a 3-question mock interview', start: 'Start the interview.', placeholder: 'your answer…', voice: true,
      note: 'Text version on a small model. The real one is live voice with a Keyframe Labs avatar.',
      prompt: 'You are the BeRelentless AI interviewer for a junior software engineering role. First ask, in one sentence, which role or stack they are targeting. Then ask 3 questions in total, one at a time; after each answer ask one short follow-up that probes their reasoning, like a sharp but kind senior engineer. Keep every turn under 45 words, in natural spoken style. After the third question is answered, give a skill score out of 10, one strength and one thing to improve, then stop.',
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
    id: 'castly', name: 'Castly', kind: 'Two-sided casting marketplace', when: '2025 · client project', url: 'https://castly.co.uk',
    color: '#D9479F',
    summary: 'A casting agency running on spreadsheets. I rebuilt it as a two-sided marketplace and automated applications, the casting-director database and opportunity scraping. Tried AI voice booking calls, then switched them off when they cost more than they earned.',
    metrics: [['460+', 'verified performers'], ['−40%', 'manual work'], ['2×', 'bookings']],
    pipeline: ['Applications', 'Director DB', 'Scrapers', 'Bookings'],
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
  'AI & Agents': ['Multi-agent orchestration', 'Tool calling (MCP)', 'Memory layers', 'RAG', 'BGE-M3', 'Qdrant', 'ChromaDB', 'Pydantic', 'Prompt caching', 'OpenAI', 'OpenRouter'],
  'Real-time voice': ['LiveKit', 'Whisper', 'Cartesia', 'ElevenLabs'],
  'Languages': ['Python', 'TypeScript', 'JavaScript', 'SQL', 'Java'],
  'Backend & web': ['FastAPI', 'asyncio', 'REST', 'Next.js', 'React', 'Node.js'],
  'Data': ['PostgreSQL', 'Supabase', 'PocketBase', 'Redis'],
  'Ops': ['Docker', 'GitHub Actions', 'DigitalOcean', 'Vercel', 'Cloudflare', 'Linux', 'Sentry', 'PostHog', 'OpenTelemetry', 'Grafana'],
}

export const cvText = [
  `${profile.name}, ${profile.role}, ${profile.location}. Email ${profile.email}. LinkedIn ${profile.linkedin}. GitHub ${profile.github}.`,
  'EXPERIENCE',
  ...experience.map(e => `${e.company} | ${e.role} | ${e.when}${e.url ? ` | ${e.url}` : ''}\n- ${e.points.join('\n- ')}`),
  'PROJECTS',
  ...projects.map(p => `${p.name} (${p.kind}, ${p.when}): ${p.summary} ${p.metrics.map(([v, k]) => `${v} ${k}`).join(', ')}. Stack: ${p.pipeline.join(', ')}.`),
  `EDUCATION\n${education.school}, ${education.degree}, ${education.when}. ${education.grades.map(([k, v]) => `${k} ${v}%`).join(', ')}.`,
  `SKILLS\n${Object.entries(skills).map(([k, v]) => `${k}: ${v.join(', ')}`).join('\n')}`,
].join('\n\n')
