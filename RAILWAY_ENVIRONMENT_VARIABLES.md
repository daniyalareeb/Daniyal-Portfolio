# 🚂 Railway Environment Variables for DanPortfolio

**⚠️ SECURITY NOTICE: Replace all placeholder values with your actual credentials!**

## 📋 Environment Variables to Set in Railway

Go to your Railway service → **Variables** tab and add these:

### 🔧 Server Configuration
```bash
APP_ENV=production
APP_HOST=0.0.0.0
APP_PORT=$PORT
```

### 🗄️ Database (Automatically Set by Railway)
```bash
DATABASE_URL=postgresql://postgres:password@host:port/database
```
*Note: Railway will automatically set this when you add PostgreSQL database*

### 🤖 AI Configuration
```bash
OPENROUTER_API_KEY=YOUR_OPENROUTER_API_KEY_HERE
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=deepseek/deepseek-chat-v3.1:free
```

### 🔒 Security Configuration
```bash
ADMIN_PASSWORD=YOUR_SECURE_ADMIN_PASSWORD
JWT_SECRET_KEY=YOUR_32_CHARACTER_JWT_SECRET_KEY
ADMIN_SECRET=YOUR_ADMIN_SECRET_KEY
```

### 🌐 CORS Configuration
```bash
CORS_ORIGINS=["https://daniyalareeb.com", "https://www.daniyalareeb.com", "https://daniyalareeb.vercel.app"]
```

### 📧 Email Configuration
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=YOUR_EMAIL@gmail.com
SMTP_PASSWORD=YOUR_GMAIL_APP_PASSWORD
ADMIN_EMAIL=YOUR_EMAIL@gmail.com
GITHUB_USERNAME=daniyalareeb
```

## 🚀 Step-by-Step Railway Setup

### Step 1: Create Railway Project
1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository: `daniyalareeb/Daniyal-Portfolio`
5. Select **`backend`** folder as root directory

### Step 2: Add PostgreSQL Database
1. In your project dashboard, click **"New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Wait for database creation
4. Railway will automatically set `DATABASE_URL`

### Step 3: Set Environment Variables
1. Go to your service → **Variables** tab
2. Add each variable from the list above
3. **IMPORTANT**: Replace all placeholder values with your actual credentials
4. Click **"Add Variable"** for each one

### Step 4: Deploy
1. Railway will automatically detect Python app
2. It will install dependencies from `requirements.txt`
3. The deployment will start automatically
4. Monitor the deployment logs

### Step 5: Initialize Database
1. Go to service → **Deployments** → **Logs**
2. Click **"Open Console"**
3. Run: `python3 scripts/setup_db.py`
4. Verify database tables created

### Step 6: Test Deployment
1. **Health Check**: `https://your-app-name.railway.app/health`
2. **API Docs**: `https://your-app-name.railway.app/docs`
3. **Test Endpoint**: `https://your-app-name.railway.app/api/v1/tools/list`

## 🔒 Security Notes

### Production Security Checklist
- [ ] **OpenRouter API Key**: Set your actual API key
- [ ] **Admin Password**: Use a strong, unique password
- [ ] **JWT Secret**: Generate a secure 32+ character key
- [ ] **Admin Secret**: Generate a secure secret key
- [ ] **CORS Origins**: Updated for your domain
- [ ] **Email SMTP**: Configured with your Gmail app password

### Important Security Reminders
- Never commit real credentials to Git
- Use environment variables for all sensitive data
- Change default passwords and secrets
- Use HTTPS in production
- Monitor access logs regularly

## 📊 Expected Results

After deployment, you'll have:

### Backend (Railway)
- **URL**: `https://your-app-name.railway.app`
- **Health**: `https://your-app-name.railway.app/health`
- **API Docs**: `https://your-app-name.railway.app/docs`
- **Database**: PostgreSQL with all tables initialized

### Frontend (Vercel)
- **URL**: `https://daniyalareeb.com`
- **Backup**: `https://daniyalareeb.vercel.app`
- **API Integration**: Connected to Railway backend

## 🚨 Troubleshooting

### Common Issues:

#### 1. Build Failures
```bash
# Check if all dependencies are in requirements.txt
pip install -r requirements.txt
```

#### 2. Database Connection
```bash
# Verify DATABASE_URL is set correctly
echo $DATABASE_URL
```

#### 3. CORS Issues
```bash
# Ensure CORS_ORIGINS includes your domain
CORS_ORIGINS=["https://daniyalareeb.com", "https://www.daniyalareeb.com"]
```

#### 4. AI Features Not Working
```bash
# Check OpenRouter API key and credits
# Verify OPENROUTER_API_KEY is set correctly
```

## 🎉 Success Checklist

- [ ] Railway project created
- [ ] PostgreSQL database added
- [ ] All environment variables set with REAL values
- [ ] Deployment successful
- [ ] Database initialized
- [ ] Health check passes
- [ ] API docs accessible
- [ ] Frontend connected to backend
- [ ] Domain configured
- [ ] All features working

---

**Railway Environment Variables**  
**Domain**: daniyalareeb.com  
**Frontend**: Vercel  
**Backend**: Railway  
**Last Updated**: January 2024
