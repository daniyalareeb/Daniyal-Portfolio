# 🌐 Vercel Frontend Configuration for daniyalareeb.com

Configuration guide for deploying your frontend to Vercel with your custom domain.

## 📋 Vercel Environment Variables

Set these in your Vercel project dashboard:

### Required Environment Variable
```bash
NEXT_PUBLIC_API_URL=https://your-app.herokuapp.com
```

*Note: Replace `your-app` with your actual Heroku app name*

## 🚀 Vercel Deployment Steps

### Step 1: Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import your GitHub repository
4. Select **`frontend`** folder as root directory

### Step 2: Configure Build Settings
```
Framework Preset: Next.js
Root Directory: frontend
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### Step 3: Set Environment Variables
1. Go to **Settings** → **Environment Variables**
2. Add: `NEXT_PUBLIC_API_URL` = `https://your-app.herokuapp.com`
3. Save

### Step 4: Deploy
1. Click **"Deploy"**
2. Wait for deployment to complete
3. Note the Vercel URL (e.g., `https://daniyalareeb.vercel.app`)

## 🌍 Domain Configuration

### Namecheap DNS Settings

In your Namecheap account, set these DNS records:

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

## 🔧 Frontend Configuration Files

I've already prepared these files for Vercel:

- `next.config.mjs` - Next.js configuration
- `vercel.json` - Vercel-specific settings
- `.vercelignore` - Files to ignore
- `package.json` - Dependencies and scripts

## 📊 Expected Results

After deployment:

### Frontend URLs
- **Primary**: `https://daniyalareeb.com`
- **WWW**: `https://www.daniyalareeb.com`
- **Vercel**: `https://daniyalareeb.vercel.app`

### Backend Integration
- Frontend will connect to Heroku backend
- API calls will work seamlessly
- 3D avatar will load properly
- AI chat will function

## 🔒 Security Configuration

### CORS Settings
Your Heroku backend is configured with:
```bash
CORS_ORIGINS=["https://daniyalareeb.com", "https://www.daniyalareeb.com", "https://daniyalareeb.vercel.app"]
```

### SSL Certificates
- Vercel provides automatic SSL
- Namecheap domain will have HTTPS
- All API calls will be secure

## 🎯 Testing Checklist

After deployment, test these features:

- [ ] Homepage loads correctly
- [ ] 3D avatar displays properly
- [ ] AI chat works
- [ ] Contact form functions
- [ ] Projects section loads
- [ ] Blog section works
- [ ] Admin panel accessible
- [ ] Mobile responsive design

## 🚨 Troubleshooting

### Common Issues:

#### 1. API Connection Issues
```bash
# Check if NEXT_PUBLIC_API_URL is set correctly
# Verify Heroku backend is running
# Test: https://your-app.herokuapp.com/health
```

#### 2. Domain Not Working
```bash
# Check DNS propagation (can take 24-48 hours)
# Verify Namecheap DNS settings
# Check Vercel domain configuration
```

#### 3. Build Failures
```bash
# Check if all dependencies are installed
npm install
npm run build
```

## 📝 Next Steps

1. **Deploy Backend**: Follow Heroku deployment guide
2. **Deploy Frontend**: Follow this Vercel guide
3. **Configure Domain**: Set up Namecheap DNS
4. **Test Everything**: Verify all features work
5. **Monitor**: Set up analytics and monitoring

## 🎉 Success!

Once complete, your portfolio will be live at:
- **Frontend**: `https://daniyalareeb.com`
- **Backend**: `https://your-app.herokuapp.com`
- **API Docs**: `https://your-app.herokuapp.com/docs`

---

**Vercel Frontend Configuration**  
**Domain**: daniyalareeb.com  
**Last Updated**: January 2024

