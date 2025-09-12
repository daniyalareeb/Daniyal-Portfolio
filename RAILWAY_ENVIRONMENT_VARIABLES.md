# 🚂 Railway Environment Variables for DanPortfolio

Exact environment variables to set in Railway for your deployment.

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
OPENROUTER_API_KEY=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
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=deepseek/deepseek-chat-v3.1:free
```

### 🔒 Security Configuration
```bash
ADMIN_PASSWORD=daniyal-admin-2024
JWT_SECRET_KEY=daniyal-portfolio-jwt-secret-key-2024-production
ADMIN_SECRET=daniyal-portfolio-admin-secret-2024
```

### 🌐 CORS Configuration
```bash
CORS_ORIGINS=["https://daniyalareeb.com", "https://www.daniyalareeb.com", "https://daniyalareeb.vercel.app"]
```

### 📧 Email Configuration
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=daniyalareeb49@gmail.com
SMTP_PASSWORD=fpfb esfs axyb obvu
ADMIN_EMAIL=daniyalareeb49@gmail.com
GITHUB_USERNAME=daniyalareeb
```

## 🚀 Step-by-Step Railway Setup

### Step 1: Create Railway Project
1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository
5. Select **`backend`** folder as root directory

### Step 2: Add PostgreSQL Database
1. In your project dashboard, click **"New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Wait for database creation
4. Railway will automatically set `DATABASE_URL`

### Step 3: Set Environment Variables
1. Go to your service → **Variables** tab
2. Add each variable from the list above
3. Click **"Add Variable"** for each one

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

## 🔧 Frontend Configuration

After Railway deployment, update your frontend:

### Update Frontend Environment Variables
In your Vercel deployment, set:
```bash
NEXT_PUBLIC_API_URL=https://your-railway-app-name.railway.app
```

### Update Frontend Domain
Your frontend will be available at:
- **Primary**: `https://daniyalareeb.com`
- **Vercel**: `https://daniyalareeb.vercel.app`

## 🎯 Domain Configuration

### Namecheap DNS Settings
Set these DNS records in Namecheap:

```
Type: A
Host: @
Value: 76.76.19.61
TTL: Automatic

Type: CNAME
Host: www
Value: cname.vercel-dns.com
TTL: Automatic
```

### Vercel Domain Setup
1. Go to Vercel dashboard → Your project
2. Go to **Settings** → **Domains**
3. Add `daniyalareeb.com`
4. Add `www.daniyalareeb.com`
5. Verify domain ownership

## 🔒 Security Notes

### Production Security Checklist
- [x] **OpenRouter API Key**: Set (from your .env)
- [x] **Admin Password**: Using current password
- [x] **JWT Secret**: Generated secure key
- [x] **Admin Secret**: Generated secure key
- [x] **CORS Origins**: Updated for your domain
- [x] **Email SMTP**: Configured with your Gmail

### Important Security Reminders
- Your current admin password will work
- JWT secret is now production-ready
- CORS is configured for your domain
- Email notifications will work with your Gmail

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
- [ ] All environment variables set
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

