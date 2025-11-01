# 🚀 Vercel Setup - Quick Guide

## ✅ Step-by-Step Vercel Deployment

### Step 1: Connect GitHub Repository
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository: `daniyalareeb/Daniyal-Portfolio`
4. Click **"Import"**

### Step 2: Configure Project Settings
**IMPORTANT:** Set these before deploying:

```
Framework Preset: Next.js (auto-detected)
Root Directory: frontend
Build Command: npm run build (auto-detected)
Output Directory: .next (auto-detected)
Install Command: npm install (auto-detected)
```

**Click "Edit" next to Root Directory:**
- Change from `./` to `frontend`
- Click "Continue"

### Step 3: Set Environment Variable (CRITICAL!)
Before deploying, click **"Environment Variables"** and add:

```
Variable Name: NEXT_PUBLIC_API_URL
Value: https://daniyalportfolio-4bc9ee1ed36d.herokuapp.com
Environment: Production, Preview, Development (select all)
```

Click **"Save"**

### Step 4: Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. Your site will be live at: `https://your-project.vercel.app`

### Step 5: Verify Deployment
After deployment:
- ✅ Check homepage loads
- ✅ Test chat functionality
- ✅ Test contact form
- ✅ Check projects/blog sections

---

## 🌍 Custom Domain (Optional)

### Add Your Domain
1. Go to project **Settings** → **Domains**
2. Add: `daniyalareeb.com`
3. Add: `www.daniyalareeb.com`
4. Follow Vercel's DNS instructions

---

## ✅ What's Already Configured

- ✅ `vercel.json` - Vercel settings (already points to Heroku backend)
- ✅ `next.config.mjs` - Next.js optimization
- ✅ API rewrites configured
- ✅ Security headers set

---

## 🔧 After Deployment Checklist

- [ ] Environment variable `NEXT_PUBLIC_API_URL` is set
- [ ] Root directory is `frontend`
- [ ] Build completes successfully
- [ ] Homepage loads
- [ ] Chat works
- [ ] Contact form works
- [ ] Projects/blog sections load

---

## ⚠️ Common Issues

**Build Fails:**
- Make sure Root Directory is `frontend`, not `.`

**API Calls Fail:**
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check Heroku backend is running: https://daniyalportfolio-4bc9ee1ed36d.herokuapp.com/health

**CORS Errors:**
- Backend CORS is already configured for Vercel domains
- If you add a custom domain, update Heroku CORS_ORIGINS config var

---

**That's it! Your frontend will be live on Vercel.** 🎉

