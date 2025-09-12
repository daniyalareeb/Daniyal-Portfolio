# 🚂 Railway Deployment Guide for DanPortfolio Backend

Complete guide to deploy the DanPortfolio backend to Railway with PostgreSQL database.

## 📋 Prerequisites

- GitHub repository with backend code
- Railway account (free tier available)
- OpenRouter API key for AI features

## 🚀 Step-by-Step Deployment

### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Verify your email

### Step 2: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository
4. Select the **`backend`** folder as the root directory

### Step 3: Add PostgreSQL Database

1. In your project dashboard, click **"New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway will automatically create a PostgreSQL database
4. Note the connection details (you'll need them for environment variables)

### Step 4: Configure Environment Variables

Go to your service → **Variables** tab and add these environment variables:

#### Required Variables
```bash
# Server Configuration
APP_ENV=production
APP_HOST=0.0.0.0
APP_PORT=$PORT

# Database (automatically set by Railway PostgreSQL)
DATABASE_URL=postgresql://postgres:password@host:port/database

# AI Configuration (REQUIRED)
OPENROUTER_API_KEY=your-openrouter-api-key-here
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=deepseek/deepseek-chat-v3-0324:free

# Security (CRITICAL: Change these!)
ADMIN_PASSWORD=your-secure-admin-password
JWT_SECRET_KEY=your-32-character-secret-key-minimum
ADMIN_SECRET=your-admin-secret-key

# CORS (Update with your frontend domain)
CORS_ORIGINS=["https://daniyalareeb.me", "https://www.daniyalareeb.me"]
```

#### Optional Variables
```bash
# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
ADMIN_EMAIL=your-email@gmail.com

# GitHub
GITHUB_USERNAME=daniyalareeb
```

### Step 5: Deploy

1. Railway will automatically detect the Python application
2. It will install dependencies from `requirements.txt`
3. The deployment will start automatically
4. Monitor the deployment logs

### Step 6: Initialize Database

After successful deployment:

1. Go to your service → **Deployments** tab
2. Click on the latest deployment
3. Go to **"Logs"** tab
4. Click **"Open Console"**
5. Run the database initialization:

```bash
python3 scripts/setup_db.py
```

### Step 7: Verify Deployment

1. **Health Check**: Visit `https://your-app-url.railway.app/health`
2. **API Docs**: Visit `https://your-app-url.railway.app/docs`
3. **Test Endpoint**: Visit `https://your-app-url.railway.app/api/v1/tools/list`

## 🔧 Configuration Files

Railway will automatically detect these files:

- `requirements.txt` - Python dependencies
- `railway.json` - Railway-specific configuration
- `Procfile` - Process definition
- `runtime.txt` - Python version specification

## 📊 Monitoring

### Railway Dashboard
- **Metrics**: CPU, Memory, Network usage
- **Logs**: Real-time application logs
- **Deployments**: Deployment history and status

### Health Checks
- **Endpoint**: `/health`
- **Response**: `{"ok": true}`
- **Timeout**: 100 seconds

## 🔒 Security Checklist

Before going live, ensure:

- [ ] Changed `ADMIN_PASSWORD` from default
- [ ] Generated strong `JWT_SECRET_KEY` (32+ characters)
- [ ] Set secure `ADMIN_SECRET`
- [ ] Updated `CORS_ORIGINS` with your domain
- [ ] Set `APP_ENV=production`
- [ ] Added `OPENROUTER_API_KEY`

## 🚨 Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Check Python version
python3 --version

# Verify requirements.txt
pip install -r requirements.txt
```

#### 2. Database Connection Issues
```bash
# Check DATABASE_URL format
echo $DATABASE_URL
# Should be: postgresql://user:pass@host:port/db
```

#### 3. Environment Variables
```bash
# Check all required variables are set
railway variables
```

#### 4. Port Issues
```bash
# Ensure using $PORT environment variable
python3 -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Debug Commands

```bash
# Check application logs
railway logs

# Access console
railway shell

# Check environment variables
railway variables

# Test database connection
python3 -c "
from app.database import engine
from sqlalchemy import text
with engine.connect() as conn:
    result = conn.execute(text('SELECT 1'))
    print('Database connected:', result.fetchone())
"
```

## 📈 Scaling

### Free Tier Limits
- **$5 credit monthly** (enough for small-medium traffic)
- **512MB RAM**
- **1GB storage**
- **Unlimited deployments**

### Upgrade Options
- **Pro Plan**: $5/month per service
- **Team Plan**: $20/month per team
- **Enterprise**: Custom pricing

## 🔄 Updates & Maintenance

### Automatic Deployments
- Railway automatically deploys on Git push
- No manual intervention required
- Rollback available in dashboard

### Database Backups
```bash
# Create backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore backup
psql $DATABASE_URL < backup_file.sql
```

### Monitoring
- Set up alerts for downtime
- Monitor resource usage
- Track API performance

## 📝 Next Steps

After successful deployment:

1. **Update Frontend**: Set `NEXT_PUBLIC_API_URL` to your Railway URL
2. **Test All Features**: Verify AI chat, admin panel, etc.
3. **Set Up Monitoring**: Configure alerts and analytics
4. **Backup Strategy**: Set up regular database backups
5. **Domain Setup**: Configure custom domain if needed

## 🎉 Success!

Your backend will be available at:
- **API Base**: `https://your-app-name.railway.app`
- **Health Check**: `https://your-app-name.railway.app/health`
- **API Docs**: `https://your-app-name.railway.app/docs`

---

**Railway Deployment Guide**  
**Version**: 1.0.0  
**Last Updated**: January 2024  
**Author**: Daniyal Ahmad

