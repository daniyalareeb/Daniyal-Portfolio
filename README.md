# daniyalareeb.com

An illustrated, self-painting portfolio. The background is painted live with [p5.brush](https://github.com/acamposuribe/p5.brush), one stroke per frame, and repaints a new underwater scene for each section. Ping (one of the CompanyOS mascots) hops from project to project explaining each one and taking questions; Byte answers anything about the CV (Groq).

`/sonar` is a self-updating weekly digest: useful new GitHub repos, YC launches (Launch HN) and raises (TechCrunch), curated by Groq. It's Next.js ISR, so the page rebuilds itself at most once a week on the next visit. No cron, no commits, no database.

Runs for free: one Next.js app on Vercel's Hobby tier plus Groq's free API tier. No database, no backend server.

## Run

```bash
cd frontend
cp env.example .env.local   # add GROQ_API_KEY (free at console.groq.com/keys)
npm install
npm run dev
```

## Edit content

Everything lives in `frontend/data/cv.js`: experience, projects (with the mascot's story beats), skills. The chat prompt is built from the same file, so the page and Byte never disagree.

## Deploy (Vercel, free)

- Root directory: `frontend`
- Env vars: `GROQ_API_KEY` (required), `GROQ_MODEL` (optional, default `openai/gpt-oss-120b`), `GITHUB_TOKEN` (optional, a no-scope token; only raises GitHub's rate limit for Sonar)

`npm test` runs the Sonar parser checks.
