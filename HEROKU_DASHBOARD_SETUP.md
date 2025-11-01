# 🚀 Heroku Dashboard Deployment Guide

## Since you're deploying from Heroku Dashboard:

### Step 1: Configure Root Directory in Heroku

1. Go to your Heroku app dashboard
2. Navigate to **Settings** tab
3. Scroll to **"Config Vars"** section
4. Click **"Reveal Config Vars"**
5. Add the following environment variables:

```
DATABASE_URL = postgresql://neondb_owner:npg_A8TRlwixOC5m@ep-proud-pond-adyaggro-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
APP_ENV = production
OPENROUTER_API_KEY = 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
OPENROUTER_BASE_URL = https://openrouter.ai/api/v1
OPENROUTER_MODEL = deepseek/deepseek-chat-v3.1:free
ADMIN_PASSWORD = daniyal-admin-2024
JWT_SECRET_KEY = your-super-secret-jwt-key
ADMIN_SECRET = super-secret-string-change-me
ADMIN_EMAIL = daniyalareeb49@gmail.com
RESEND_API_KEY = your-resend-api-key
RESEND_FROM_EMAIL = noreply@daniyalareeb.com
CORS_ORIGINS = ["https://daniyalareeb.com","https://www.daniyalareeb.com"]
```

### Step 2: Set Build Directory

**Option A: Using Heroku Dashboard (Easiest)**
1. Go to **Settings** → **Buildpacks**
2. Click **"Add buildpack"**
3. Select **"heroku/python"**
4. Scroll down to **"Root Directory"** section
5. Set: `backend`
6. Save changes

**Option B: Using Heroku CLI**
```bash
heroku buildpacks:set heroku/python -a your-app-name
```

### Step 3: Deploy

1. Go to **Deploy** tab
2. Select your branch (usually `main`)
3. Click **"Deploy Branch"**
4. Wait for build to complete

### Step 4: Initialize Database

After deployment, go to **More** → **Run console** and run:
```bash
python3 scripts/setup_db.py
```

### Step 5: Verify

- Visit: `https://your-app.herokuapp.com/health`
- Should return: `{"ok":true}`

---

## ⚠️ Important Notes

- **Root Directory**: Must be set to `backend` in Heroku settings
- **Procfile**: Already in `backend/` directory (will be detected)
- **Database**: Using Neon (external, free tier)
- **Environment Variables**: Set all required vars before first deploy

