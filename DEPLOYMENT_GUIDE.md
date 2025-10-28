# 🚀 DanPortfolio Deployment Guide

Complete deployment guide for both frontend and backend components of the DanPortfolio project.

## 📋 Table of Contents

- [Overview](#overview)
- [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
- [Backend Deployment (Fly.io)](#backend-deployment)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Domain Configuration](#domain-configuration)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

DanPortfolio consists of two main components:
- **Frontend**: Next.js application (deploy to Vercel)
- **Backend**: FastAPI application (deploy to Heroku)

### Recommended Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Vercel)      │◄──►│   (Heroku)      │◄──►│   (PostgreSQL)  │
│   daniyalareeb.me│    │   API Server    │    │   Vector DB     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🌐 Frontend Deployment (Vercel)

### Prerequisites
- GitHub repository with frontend code
- Vercel account (free tier available)

### Step 1: Prepare Frontend for Deployment

1. **Update Environment Variables**
   ```bash
   # In frontend/.env.local
   NEXT_PUBLIC_API_URL=https://your-app.herokuapp.com
   ```

2. **Verify Build**
   ```bash
   cd frontend
   npm run build
   ```

3. **Test Production Build**
   ```bash
   npm start
   ```

### Step 2: Deploy to Vercel

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `frontend` folder as root directory

2. **Configure Build Settings**
   ```
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

3. **Set Environment Variables**
   ```
   NEXT_PUBLIC_API_URL = https://your-app.herokuapp.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Note the deployment URL

### Step 3: Custom Domain (Optional)

1. **Add Domain**
   - Go to Project Settings → Domains
   - Add your custom domain (e.g., `daniyalareeb.me`)

2. **Configure DNS**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   
   Type: A
   Name: @
   Value: 76.76.19.61
   ```

## 🖥️ Backend Deployment

### Heroku

Heroku offers the easiest deployment experience with automatic builds and PostgreSQL integration.

#### Step 1: Install Heroku CLI

```bash
# macOS
brew install heroku/brew/heroku

# Windows: Download installer from https://devcenter.heroku.com/articles/heroku-cli
# Linux: See https://devcenter.heroku.com/articles/heroku-cli
```

#### Step 2: Login and Create App

```bash
# Login to Heroku
heroku login

# Create a new app
heroku create your-app-name

# Or deploy from GitHub
heroku create --region us
```

#### Step 3: Add PostgreSQL Database

```bash
# Add PostgreSQL addon (mini tier for free)
heroku addons:create heroku-postgresql:mini

# Verify DATABASE_URL is set
heroku config:get DATABASE_URL
```

#### Step 4: Configure Environment Variables

```bash
# Set required configuration variables
heroku config:set APP_ENV=production
heroku config:set OPENROUTER_API_KEY=your-openrouter-key
heroku config:set ADMIN_PASSWORD=your-secure-password
heroku config:set JWT_SECRET_KEY=your-jwt-secret
heroku config:set ADMIN_SECRET=your-admin-secret
heroku config:set CORS_ORIGINS='["https://daniyalareeb.com","https://www.daniyalareeb.com"]'

# Optional email configuration
heroku config:set SMTP_HOST=smtp.gmail.com
heroku config:set SMTP_PORT=587
heroku config:set SMTP_USER=your-email@gmail.com
heroku config:set SMTP_PASSWORD=your-app-password
```

#### Step 5: Deploy

```bash
# Initialize git if needed
git init
git add .
git commit -m "Initial commit"

# Add Heroku remote
heroku git:remote -a your-app-name

# Deploy
git push heroku main
```

#### Step 6: Initialize Database

```bash
# Run database initialization
heroku run python3 scripts/setup_db.py

# Or manually run commands
heroku run python3 -c "from app.database import engine, Base; Base.metadata.create_all(bind=engine)"
```

#### Step 7: Verify Deployment

```bash
# Check app status
heroku ps

# View logs
heroku logs --tail

# Open app
heroku open
```

## ⚙️ Environment Configuration

### Required Environment Variables

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=https://your-app.herokuapp.com
```

#### Backend (.env)
```bash
# Server
APP_ENV=production
APP_HOST=0.0.0.0
APP_PORT=8000

# Database
DATABASE_URL=postgresql://user:pass@host:port/db

# AI Services
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=deepseek/deepseek-chat-v3-0324:free

# Security (CRITICAL: Change these!)
ADMIN_PASSWORD=your-secure-password-here
JWT_SECRET_KEY=your-32-character-secret-key-minimum
ADMIN_SECRET=your-admin-secret-key

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
ADMIN_EMAIL=your-email@gmail.com

# CORS
CORS_ORIGINS=["https://daniyalareeb.me", "https://www.daniyalareeb.me"]
```

### Security Checklist

- [ ] Change default `ADMIN_PASSWORD`
- [ ] Generate strong `JWT_SECRET_KEY` (32+ characters)
- [ ] Set secure `ADMIN_SECRET`
- [ ] Configure production `CORS_ORIGINS`
- [ ] Set `APP_ENV=production`
- [ ] Use HTTPS URLs in production

## 🗄️ Database Setup

### PostgreSQL Configuration

1. **Create Database**
   ```sql
   CREATE DATABASE danportfolio;
   CREATE USER danportfolio_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE danportfolio TO danportfolio_user;
   ```

2. **Initialize Tables**
   ```bash
   # Run after deployment
   python3 scripts/setup_db.py
   ```

3. **Verify Setup**
   ```bash
   # Check tables created
   python3 -c "
   from app.database import engine
   from sqlalchemy import text
   with engine.connect() as conn:
       result = conn.execute(text('SELECT table_name FROM information_schema.tables WHERE table_schema = \\'public\\''))
       print([row[0] for row in result])
   "
   ```

### Database Migration (if needed)

```bash
# Create migration
alembic revision --autogenerate -m "Description"

# Apply migration
alembic upgrade head
```

## 🌍 Domain Configuration

### Custom Domain Setup

1. **Frontend Domain (Vercel)**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   
   Type: A
   Name: @
   Value: 76.76.19.61
   ```

2. **Backend Subdomain (Optional)**
   ```
   Type: CNAME
   Name: api
   Value: your-app.herokuapp.com
   ```

3. **SSL Certificates**
   - Vercel: Automatic SSL
   - Heroku: Automatic SSL

## 📊 Monitoring & Maintenance

### Health Checks

1. **Frontend Health**
   ```bash
   curl https://daniyalareeb.me/api/health
   ```

2. **Backend Health**
   ```bash
   curl https://your-app.herokuapp.com/health
   ```

3. **Database Health**
   ```bash
   curl https://your-app.herokuapp.com/api/v1/scheduler/status
   ```

### Monitoring Tools

1. **Vercel Analytics**
   - Built-in performance monitoring
   - Real-time analytics
   - Error tracking

2. **Heroku Metrics**
   - CPU/Memory usage
   - Request logs
   - Error tracking

3. **External Monitoring**
   - UptimeRobot (free tier)
   - Pingdom
   - StatusCake

### Backup Strategy

1. **Database Backups**
   ```bash
   # Daily automated backup
   pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
   ```

2. **Code Backups**
   - GitHub repository (primary)
   - Local development copies

3. **Static Files**
   - Uploaded images in `/static/uploads/`
   - Consider CDN for production

## 🔧 Troubleshooting

### Common Issues

#### 1. Frontend Build Failures

**Error**: `Module not found`
```bash
# Solution: Check dependencies
cd frontend
npm install
npm run build
```

**Error**: `API_URL not defined`
```bash
# Solution: Set environment variable
NEXT_PUBLIC_API_URL=https://your-app.herokuapp.com
```

#### 2. Backend Deployment Issues

**Error**: `ModuleNotFoundError: No module named 'app'`
```bash
# Solution: Check working directory
# Ensure you're in the backend folder
cd backend
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

**Error**: `Database connection failed`
```bash
# Solution: Check DATABASE_URL
echo $DATABASE_URL
# Should be: postgresql://user:pass@host:port/db
```

#### 3. Authentication Issues

**Error**: `401 Unauthorized`
```bash
# Solution: Check JWT secret and admin password
# Ensure they're set correctly in environment variables
```

**Error**: `CORS error`
```bash
# Solution: Update CORS_ORIGINS
CORS_ORIGINS=["https://daniyalareeb.me", "https://www.daniyalareeb.me"]
```

#### 4. AI Features Not Working

**Error**: `OpenRouter API error`
```bash
# Solution: Check API key and credits
# Verify OPENROUTER_API_KEY is correct
# Check OpenRouter dashboard for usage/credits
```

### Debug Commands

```bash
# Check backend logs
heroku logs --tail

# Test API endpoints
curl https://your-app.herokuapp.com/health
curl https://your-app.herokuapp.com/api/v1/tools/list

# Check database connection
python3 -c "
from app.database import engine
from sqlalchemy import text
with engine.connect() as conn:
    result = conn.execute(text('SELECT 1'))
    print('Database connected:', result.fetchone())
"
```

### Performance Optimization

1. **Frontend**
   - Enable Vercel Analytics
   - Optimize images with Next.js Image component
   - Use CDN for static assets

2. **Backend**
   - Enable database connection pooling
   - Implement caching for frequently accessed data
   - Monitor API response times

3. **Database**
   - Add indexes for frequently queried columns
   - Regular VACUUM and ANALYZE
   - Monitor query performance

## 📝 Deployment Checklist

### Pre-Deployment
- [ ] Update all environment variables
- [ ] Change default passwords and secrets
- [ ] Test local build (`npm run build`)
- [ ] Verify API endpoints work locally
- [ ] Update CORS origins for production domains

### Frontend Deployment
- [ ] Connect repository to Vercel
- [ ] Set environment variables
- [ ] Configure custom domain
- [ ] Test production build
- [ ] Verify API communication

### Backend Deployment
- [ ] Deploy to Heroku
- [ ] Set all environment variables
- [ ] Initialize database
- [ ] Test API endpoints
- [ ] Verify authentication works
- [ ] Test AI features

### Post-Deployment
- [ ] Update frontend API URL
- [ ] Test all functionality
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Update documentation

## 🎉 Success!

Once deployed, your DanPortfolio will be available at:
- **Frontend**: https://daniyalareeb.me
- **Backend**: https://your-app.herokuapp.com
- **API Docs**: https://your-app.herokuapp.com/docs

### Next Steps
1. Share your portfolio with potential employers/clients
2. Monitor performance and user engagement
3. Regularly update content through admin dashboard
4. Consider adding analytics and user feedback

---

**Deployment Guide Version**: 1.0.0  
**Last Updated**: January 2024  
**Author**: Daniyal Ahmad  
**Repository**: https://github.com/daniyalareeb/portfolio

