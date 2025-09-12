# Vercel Deployment Guide

## Prerequisites
- GitHub repository with your code
- Vercel account (free)
- Backend deployed (Railway recommended)

## Step 1: Prepare Environment Variables

Create a `.env.local` file for local development:
```bash
# Backend API URL (replace with your actual backend URL)
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

## Step 2: Deploy to Vercel

### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from frontend directory
cd frontend
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name? daniyal-portfolio-frontend
# - Directory? ./
# - Override settings? N
```

### Option B: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Set build settings:
   - Framework: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

## Step 3: Configure Environment Variables

In Vercel Dashboard:
1. Go to your project
2. Click "Settings" → "Environment Variables"
3. Add:
   - `NEXT_PUBLIC_API_URL` = `https://your-backend-url.railway.app`

## Step 4: Update Backend CORS

Update your backend CORS settings to include your Vercel domain:
```python
# In backend/app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
        "https://your-frontend.vercel.app"  # Add your Vercel domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Step 5: Update Vercel Configuration

Update `vercel.json` with your actual backend URL:
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-actual-backend-url.railway.app/api/:path*"
    }
  ]
}
```

## Step 6: Deploy and Test

1. Push changes to GitHub
2. Vercel will automatically redeploy
3. Test your deployed site:
   - Visit your Vercel URL
   - Test chat functionality
   - Test admin panel
   - Check all pages load correctly

## Troubleshooting

### Common Issues:
1. **API calls failing**: Check `NEXT_PUBLIC_API_URL` is set correctly
2. **CORS errors**: Update backend CORS settings
3. **Build failures**: Check for TypeScript errors
4. **Images not loading**: Verify image domains in `next.config.mjs`

### Performance Optimization:
- Images are automatically optimized by Vercel
- Static assets are served from CDN
- API routes are serverless functions
- Automatic HTTPS and compression

## Production Checklist

- [ ] Environment variables set in Vercel
- [ ] Backend CORS updated with Vercel domain
- [ ] All pages load correctly
- [ ] Chat functionality works
- [ ] Admin panel accessible
- [ ] Images load properly
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Fast loading times

## Cost
- **Vercel**: Free (100GB bandwidth, unlimited deployments)
- **Total**: $0/month
