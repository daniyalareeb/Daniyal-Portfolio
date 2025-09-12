# ✅ Railway Deployment Checklist

Complete checklist to deploy DanPortfolio backend to Railway successfully.

## 📋 Pre-Deployment Checklist

### 1. Required Information from You

I need the following information to complete the deployment:

#### 🔑 **OpenRouter API Key** (Required for AI features)
- Do you have an OpenRouter account?
- What's your OpenRouter API key?
- If you don't have one, you can sign up at [openrouter.ai](https://openrouter.ai)

#### 🔒 **Security Credentials** (Critical for production)
- **Admin Password**: What password do you want for the admin dashboard?
- **JWT Secret**: Should I generate a secure 32-character secret for you?
- **Admin Secret**: What secret key do you want for admin operations?

#### 🌐 **Domain Information** (For CORS configuration)
- What's your frontend domain? (e.g., `daniyalareeb.me`, `www.daniyalareeb.me`)
- Do you have a custom domain for the backend? (optional)

#### 📧 **Email Configuration** (Optional)
- Do you want to enable email notifications for contact form?
- What's your Gmail address for SMTP?
- Do you have an App Password for Gmail? (required for SMTP)

### 2. Railway Account Setup

- [ ] Create Railway account at [railway.app](https://railway.app)
- [ ] Sign up with GitHub
- [ ] Verify email address
- [ ] Connect GitHub repository

### 3. Repository Preparation

- [ ] Ensure backend code is in `backend/` folder
- [ ] Verify `requirements.txt` exists
- [ ] Check all configuration files are present

## 🚀 Deployment Steps

### Step 1: Create Railway Project
- [ ] Click "New Project" in Railway dashboard
- [ ] Select "Deploy from GitHub repo"
- [ ] Choose your repository
- [ ] Select `backend` folder as root directory

### Step 2: Add PostgreSQL Database
- [ ] Click "New" → "Database" → "PostgreSQL"
- [ ] Wait for database creation
- [ ] Note the connection details

### Step 3: Configure Environment Variables

#### Required Variables (Must be set):
- [ ] `APP_ENV=production`
- [ ] `APP_HOST=0.0.0.0`
- [ ] `APP_PORT=$PORT`
- [ ] `DATABASE_URL` (automatically set by Railway)
- [ ] `OPENROUTER_API_KEY=your-key-here`
- [ ] `OPENROUTER_BASE_URL=https://openrouter.ai/api/v1`
- [ ] `OPENROUTER_MODEL=deepseek/deepseek-chat-v3-0324:free`
- [ ] `ADMIN_PASSWORD=your-secure-password`
- [ ] `JWT_SECRET_KEY=your-32-char-secret`
- [ ] `ADMIN_SECRET=your-admin-secret`
- [ ] `CORS_ORIGINS=["https://your-domain.com"]`

#### Optional Variables:
- [ ] `SMTP_HOST=smtp.gmail.com`
- [ ] `SMTP_PORT=587`
- [ ] `SMTP_USER=your-email@gmail.com`
- [ ] `SMTP_PASSWORD=your-app-password`
- [ ] `ADMIN_EMAIL=your-email@gmail.com`
- [ ] `GITHUB_USERNAME=daniyalareeb`

### Step 4: Deploy
- [ ] Railway automatically detects Python app
- [ ] Installs dependencies from `requirements.txt`
- [ ] Starts the application
- [ ] Monitor deployment logs

### Step 5: Initialize Database
- [ ] Go to service → Deployments → Logs
- [ ] Click "Open Console"
- [ ] Run: `python3 scripts/setup_db.py`
- [ ] Verify database tables created

### Step 6: Test Deployment
- [ ] Health check: `https://your-app.railway.app/health`
- [ ] API docs: `https://your-app.railway.app/docs`
- [ ] Test endpoint: `https://your-app.railway.app/api/v1/tools/list`

## 🔧 Configuration Files Created

I've created these files for Railway deployment:

- [x] `railway.json` - Railway configuration
- [x] `Procfile` - Process definition
- [x] `runtime.txt` - Python version
- [x] `.railwayignore` - Ignore unnecessary files
- [x] `start.sh` - Startup script with database initialization
- [x] `RAILWAY_DEPLOYMENT.md` - Detailed deployment guide

## 🚨 Critical Security Items

### Before Going Live:
- [ ] **Change `ADMIN_PASSWORD`** from default `daniyal-admin-2024`
- [ ] **Generate strong `JWT_SECRET_KEY`** (32+ characters)
- [ ] **Set secure `ADMIN_SECRET`** (not default)
- [ ] **Update `CORS_ORIGINS`** with your actual domain
- [ ] **Set `APP_ENV=production`**

### Security Checklist:
- [ ] No hardcoded secrets in code
- [ ] All environment variables set
- [ ] HTTPS enabled (automatic on Railway)
- [ ] Database credentials secure
- [ ] API endpoints protected

## 📊 Post-Deployment Verification

### API Endpoints Test:
- [ ] `GET /health` - Returns `{"ok": true}`
- [ ] `GET /api/v1/tools/list` - Returns tools list
- [ ] `GET /api/v1/projects/list` - Returns projects list
- [ ] `GET /api/v1/news/list` - Returns blog posts
- [ ] `POST /api/v1/login` - Admin login works
- [ ] `POST /api/v1/chat/send` - AI chat works

### Database Verification:
- [ ] Tables created successfully
- [ ] Sample data populated
- [ ] Vector database (ChromaDB) initialized
- [ ] Admin user can login

### Performance Check:
- [ ] Response times under 2 seconds
- [ ] No memory leaks
- [ ] Database connections stable
- [ ] AI responses working

## 🆘 Troubleshooting

### Common Issues:

#### Build Failures:
```bash
# Check Python version compatibility
python3 --version

# Verify all dependencies
pip install -r requirements.txt
```

#### Database Issues:
```bash
# Check DATABASE_URL format
echo $DATABASE_URL
# Should be: postgresql://user:pass@host:port/db
```

#### Environment Variables:
```bash
# Verify all required variables
railway variables
```

#### Port Issues:
```bash
# Ensure using Railway's PORT variable
python3 -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

## 📞 Support

If you encounter issues:

1. **Check Railway Logs**: Service → Deployments → Logs
2. **Verify Environment Variables**: Service → Variables
3. **Test Database Connection**: Use Railway console
4. **Check API Documentation**: Visit `/docs` endpoint

## 🎯 Next Steps After Deployment

1. **Update Frontend**: Set `NEXT_PUBLIC_API_URL` to your Railway URL
2. **Test All Features**: Admin panel, AI chat, contact form
3. **Set Up Monitoring**: Railway metrics and alerts
4. **Configure Backups**: Database backup strategy
5. **Domain Setup**: Custom domain configuration (optional)

## 📝 Information I Need From You

To complete the deployment, please provide:

1. **OpenRouter API Key** (for AI features)
2. **Admin Password** (for dashboard access)
3. **Frontend Domain** (for CORS configuration)
4. **Email Configuration** (optional)

Once you provide this information, I can help you set up the environment variables and complete the deployment!

---

**Railway Deployment Checklist**  
**Version**: 1.0.0  
**Last Updated**: January 2024  
**Author**: Daniyal Ahmad

