# 🔴 Heroku H10 App Crashed - Fix Guide

## Problem
Your app shows **14 critical errors** with **H10 (App Crashed)** - app is crashing on startup.

## Most Common Causes

### 1. Missing or Invalid DATABASE_URL
Check if `DATABASE_URL` is set correctly in Heroku Config Vars.

### 2. Database Connection Error
PostgreSQL connection string might be wrong format.

### 3. Missing Environment Variables
Required vars not set:
- `OPENROUTER_API_KEY`
- `JWT_SECRET_KEY`
- `ADMIN_SECRET`
- `ADMIN_PASSWORD`

### 4. Import/Module Errors
Code trying to import something that doesn't exist.

## How to Check Logs (No CLI Needed)

### Via Heroku Dashboard:
1. Go to your app: `daniyalportfolio`
2. Click **"More"** → **"View Logs"**
3. Look for **red error messages** at the bottom
4. Copy the error - it will show exactly what's failing

### Common Errors You'll See:

**If DATABASE_URL missing:**
```
sqlalchemy.exc.OperationalError: could not connect to server
```

**If import error:**
```
ModuleNotFoundError: No module named 'app'
```

**If config error:**
```
pydantic.ValidationError: field required
```

## Quick Fixes

### Fix 1: Check DATABASE_URL
In Heroku Dashboard → Settings → Config Vars:
- Make sure `DATABASE_URL` is set
- Format: `postgresql://user:pass@host:port/dbname?sslmode=require`

### Fix 2: Verify All Required Vars
Make sure these are set:
```
DATABASE_URL=postgresql://...
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=deepseek/deepseek-chat-v3.1:free
ADMIN_PASSWORD=your-password
JWT_SECRET_KEY=your-secret
ADMIN_SECRET=your-secret
ADMIN_EMAIL=daniyalareeb49@gmail.com
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=hello@daniyalareeb.com
CORS_ORIGINS=["https://daniyalareeb.com","https://www.daniyalareeb.com"]
```

### Fix 3: Restart Dyno
In Dashboard → Resources → Click **"Restart all dynos"**

## Next Steps

1. **Check Logs** → Copy the exact error
2. **Share error** → I'll provide specific fix
3. **Or try** → Restart dyno and redeploy

The logs will tell us exactly what's wrong!

