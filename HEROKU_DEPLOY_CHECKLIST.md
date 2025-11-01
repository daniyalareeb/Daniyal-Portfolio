# ✅ Heroku Deployment Checklist

## Your Neon Database Connection String
```
postgresql://neondb_owner:npg_A8TRlwixOC5m@ep-proud-pond-adyaggro-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## Deployment Steps

### 1. Create Heroku App (if not done)
```bash
heroku create your-app-name
```

### 2. Set Neon Database URL
```bash
heroku config:set DATABASE_URL="postgresql://neondb_owner:npg_A8TRlwixOC5m@ep-proud-pond-adyaggro-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require" -a your-app-name
```

### 3. Set All Required Environment Variables
```bash
heroku config:set APP_ENV=production -a your-app-name
heroku config:set OPENROUTER_API_KEY="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" -a your-app-name
heroku config:set OPENROUTER_BASE_URL="https://openrouter.ai/api/v1" -a your-app-name
heroku config:set OPENROUTER_MODEL="deepseek/deepseek-chat-v3.1:free" -a your-app-name
heroku config:set ADMIN_PASSWORD="daniyal-admin-2024" -a your-app-name
heroku config:set JWT_SECRET_KEY="your-super-secret-jwt-key" -a your-app-name
heroku config:set ADMIN_SECRET="super-secret-string-change-me" -a your-app-name
heroku config:set ADMIN_EMAIL="daniyalareeb49@gmail.com" -a your-app-name
heroku config:set RESEND_API_KEY="your-resend-api-key" -a your-app-name
heroku config:set RESEND_FROM_EMAIL="noreply@daniyalareeb.com" -a your-app-name
heroku config:set CORS_ORIGINS='["https://daniyalareeb.com","https://www.daniyalareeb.com"]' -a your-app-name
```

### 4. Deploy from Backend Directory
```bash
cd backend
heroku git:remote -a your-app-name
git push heroku HEAD:main
```

### 5. Initialize Database
```bash
heroku run python3 scripts/setup_db.py -a your-app-name
```

### 6. Verify Deployment
```bash
heroku open
heroku logs --tail
```

## ✅ Files Ready
- ✅ Procfile
- ✅ runtime.txt (Python 3.11.7)
- ✅ requirements.txt
- ✅ app.json
- ✅ setup.py (Python buildpack detection)
- ✅ .slugignore
- ✅ All code in backend/

## 🚀 Ready to Deploy!

