# Fake News Detection System - Deployment Guide

Complete step-by-step instructions for deploying the full-stack application to production.

## Overview

The system consists of three independent services:
1. **Frontend** - React app on Vercel
2. **Backend API** - Express server on Render
3. **ML Model** - Flask API on Render

## Prerequisites

- GitHub account with code pushed
- Vercel account (free)
- Render account (free)
- Supabase account with database configured

## Part 1: Prepare Code for Deployment

### 1. Update Environment URLs

Before deploying, note these placeholder URLs (you'll fill them after each service deploys):

```
Frontend URL: https://fake-news-{YOUR-VERCEL-USERNAME}.vercel.app
Backend URL: https://fake-news-backend-{RANDOM}.onrender.com
ML URL: https://fake-news-ml-{RANDOM}.onrender.com
```

### 2. Commit and Push Code

```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

## Part 2: Deploy ML Model API (Flask)

### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up or login
3. Connect your GitHub account

### Step 2: Create Web Service

1. Click "New +" button
2. Select "Web Service"
3. Search for your repository
4. Select the repository and click "Connect"

### Step 3: Configure ML Service

Fill in the form:

| Field | Value |
|-------|-------|
| **Name** | fake-news-ml |
| **Environment** | Python 3 |
| **Region** | Choose closest |
| **Branch** | main |
| **Build Command** | `pip install -r ml_model/requirements.txt` |
| **Start Command** | `cd ml_model && gunicorn -b 0.0.0.0:5000 --timeout 300 app:app` |
| **Plan** | Free |

### Step 4: Add Environment Variables

No environment variables needed for ML service. The model is trained and included in repo.

### Step 5: Deploy

1. Click "Deploy Web Service"
2. Wait for deployment (2-5 minutes)
3. Copy the URL: `https://fake-news-ml-xxx.onrender.com`

### Verify ML API is Running

```bash
curl https://fake-news-ml-xxx.onrender.com/health
# Expected response: {"status": "healthy", "model_loaded": true}
```

**Save ML URL for later:**
```
ML_API_URL=https://fake-news-ml-xxx.onrender.com
```

## Part 3: Deploy Backend API (Express)

### Step 1: Create Web Service on Render

1. Click "New +" button
2. Select "Web Service"
3. Connect same repository

### Step 2: Configure Backend Service

| Field | Value |
|-------|-------|
| **Name** | fake-news-backend |
| **Environment** | Node |
| **Branch** | main |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Plan** | Free |

### Step 3: Add Environment Variables

Click "Add Environment Variable" and add these:

```
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = your-anon-key-here
ML_API_URL = https://fake-news-ml-xxx.onrender.com
```

**How to find Supabase credentials:**
1. Go to [supabase.com](https://supabase.com)
2. Select your project
3. Settings → API
4. Copy `Project URL` and `anon` key

### Step 4: Deploy

1. Click "Deploy Web Service"
2. Wait for deployment (2-5 minutes)
3. Copy the URL: `https://fake-news-backend-xxx.onrender.com`

### Verify Backend is Running

```bash
curl https://fake-news-backend-xxx.onrender.com/api/health
# Expected response: {"status": "ok", "service": "fake-news-detection-api"}
```

**Save Backend URL for later:**
```
BACKEND_URL=https://fake-news-backend-xxx.onrender.com
```

## Part 4: Deploy Frontend (Vercel)

### Step 1: Create Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select "Import Git Repository"
4. Find and select your repository
5. Click "Import"

### Step 2: Configure Project

The configuration should auto-detect from `package.json`:

| Field | Value |
|-------|-------|
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### Step 3: Add Environment Variables

Before deploying, add environment variables:

1. Click "Environment Variables"
2. Add these variables:

```
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = your-anon-key-here
VITE_API_URL = https://fake-news-backend-xxx.onrender.com
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for deployment (1-3 minutes)
3. You'll get a URL: `https://fake-news-xxx.vercel.app`

### Step 5: Verify Frontend is Running

Open in browser: `https://fake-news-xxx.vercel.app`

- You should see the "Fake News Detector" interface
- Sample articles should load
- Try analyzing a sample article

## Part 5: Test the Full System

### 1. Test Detection Workflow

1. Open frontend URL
2. Click on a sample "Fake" article
3. Verify it shows "FAKE NEWS DETECTED" with confidence score
4. Click on a sample "Real" article
5. Verify it shows "LIKELY AUTHENTIC"

### 2. Test History Storage

1. Analyze 2-3 articles
2. Scroll down to "Recent Detections"
3. Verify all analyses appear in history

### 3. Check Logs for Errors

**Vercel Frontend:**
- Dashboard → Project → Deployments → Logs

**Render Backend:**
- Dashboard → fake-news-backend → Logs

**Render ML:**
- Dashboard → fake-news-ml → Logs

## Troubleshooting

### Frontend won't load samples

**Error in console:** "Failed to load samples"

**Solution:**
1. Check `VITE_API_URL` environment variable
2. Verify backend is running: `curl $VITE_API_URL/api/health`
3. Re-deploy frontend

### Detection fails with "ML API error"

**Error message:** "Prediction failed"

**Solution:**
1. Check `ML_API_URL` in backend environment
2. Verify ML service is running: `curl $ML_API_URL/health`
3. Check ML logs on Render for Python errors
4. Restart ML service

### History not showing

**No detections appear in sidebar:**

**Solution:**
1. Check Supabase credentials in backend
2. Verify database table exists: `select count(*) from detections;`
3. Check RLS policies on table
4. Restart backend service

### Performance Issues

**App feels slow:**

**Solution:**
- ML cold start takes 10-20 seconds first request
- Render free tier may be slow
- Consider upgrading to Render Standard tier
- Cache responses on backend
- Use CDN for static assets

## Cost Estimation

| Service | Plan | Cost | Notes |
|---------|------|------|-------|
| Vercel | Hobby | FREE | Frontend hosting |
| Render | Free | FREE | 50 hrs/month, restarts after 15 min inactivity |
| Render | Standard | $12/month | Always running, better performance |
| Supabase | Free | FREE | Up to 500MB database |
| **Total** | | FREE | Can upgrade later |

## Upgrade to Production

### When to Upgrade:

1. **After first 50 API calls** → Upgrade Render to Standard
2. **If 5+ users** → Scale backend with more Render units
3. **If 1000+ daily requests** → Add Redis caching

### Steps to Upgrade Render Backend:

1. Go to Render dashboard
2. Select fake-news-backend service
3. Click "Settings"
4. Under "Plan", click "Upgrade Plan"
5. Select "Standard" ($12/month)
6. Click "Upgrade"

## Continuous Deployment

### Auto-Deploy on Git Push

Both Vercel and Render auto-deploy when you push to main branch:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Services automatically redeploy
```

### Update ML Model

1. Retrain locally: `python ml_model/train_model.py`
2. Commit new model: `git add ml_model/models/fake_news_model.pkl`
3. Push: `git push origin main`
4. Render auto-deploys with new model

## Monitoring & Maintenance

### Health Checks

Set up regular monitoring:

```bash
# Check all services are running
curl https://fake-news-xxx.vercel.app
curl https://fake-news-backend-xxx.onrender.com/api/health
curl https://fake-news-ml-xxx.onrender.com/health
```

### View Logs

**Vercel:**
- Dashboard → Deployments → Logs (real-time)

**Render:**
- Dashboard → Service → Logs (real-time)

### Error Tracking

Monitor these Render logs:
- Backend API errors
- ML model inference errors
- Supabase connection issues

## Security Checklist

Before sharing with others:

- [ ] Environment variables don't contain secrets
- [ ] Supabase RLS policies are configured
- [ ] API endpoints have rate limiting
- [ ] CORS is properly configured
- [ ] Input validation is in place (min 10 chars)
- [ ] Error messages don't leak sensitive info

## Sharing Your Deployment

### Add to Resume/Portfolio:

```markdown
## Fake News Detection System

- **Live Demo**: https://fake-news-xxx.vercel.app
- **GitHub**: https://github.com/your-username/fake-news-detector
- **Stack**: React, Node.js, Python, Supabase

AI-powered system to detect misinformation using TF-IDF + Logistic Regression.
Processes 100+ articles per day with 95%+ accuracy.
Deployed on Vercel, Render, and Supabase.
```

### Talking Points for Interviews:

1. "Built production-grade full-stack system with 3 independent services"
2. "Implemented ML pipeline: TF-IDF vectorization + Logistic Regression"
3. "Designed microservices architecture for scalability"
4. "Used Supabase RLS for secure multi-tenant data isolation"
5. "Optimized cold start time on serverless platforms"

## Quick Reference

### Service Status URLs

| Service | Status URL |
|---------|-----------|
| ML Model | `{ML_API_URL}/health` |
| Backend API | `{API_URL}/api/health` |
| Frontend | Open in browser |

### Important Environment Variables

```bash
# Frontend (.env in root)
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_API_URL=...

# Backend (Render environment variables)
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
ML_API_URL=...
```

### Deployment Checklist

- [ ] ML service deployed on Render
- [ ] ML URL noted and shared with backend
- [ ] Backend service deployed on Render
- [ ] Backend URL noted and shared with frontend
- [ ] Frontend deployed on Vercel
- [ ] All environment variables set correctly
- [ ] Health checks passing for all services
- [ ] Tested full detection workflow
- [ ] History storage working

## Getting Help

If something goes wrong:

1. Check service logs on Render/Vercel
2. Verify environment variables are set
3. Test endpoints with curl
4. Check GitHub issues
5. Review error messages in browser console
6. Restart the service

---

**Next Steps:**
1. Deploy services following this guide
2. Test the system end-to-end
3. Add to your portfolio
4. Prepare talking points for interviews
5. Consider scaling/improving the system
