# 🚀 ZeroSaver Deployment Guide

## **📋 Overview**
- **Backend (FastAPI)**: Railway
- **Frontend (Next.js)**: Vercel  
- **Database**: Supabase (PostgreSQL)
- **File Storage**: Railway (for uploads)

---

## **🗄️ Step 1: Supabase Database Setup**

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Choose organization
5. Enter project details:
   - **Name**: `zerosaver-db`
   - **Database Password**: Generate strong password (save it!)
   - **Region**: Choose closest to your users
6. Click "Create new project"

### 1.2 Get Database Connection Details
1. Go to **Settings** → **Database**
2. Copy the connection details:
   - **Host**: `db.xxxxxxxxxxxxx.supabase.co`
   - **Database**: `postgres`
   - **Port**: `5432`
   - **User**: `postgres`
   - **Password**: (the one you created)

### 1.3 Update Backend Configuration
Update your backend to use Supabase PostgreSQL instead of SQLite.

---

## **🚂 Step 2: Railway Backend Deployment**

### 2.1 Prepare Backend for Railway
1. **Update requirements.txt** (if needed)
2. **Create railway.json** (optional)
3. **Update database configuration**

### 2.2 Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Sign up/Login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `ZeroSaver` repository
5. Railway will auto-detect it's a Python project

### 2.3 Configure Environment Variables
In Railway dashboard, go to **Variables** tab and add:

```bash
# Database
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres

# Security
SECRET_KEY=your-super-secret-key-here-make-it-long-and-random

# App Settings
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS (for frontend)
CORS_ORIGINS=https://your-vercel-app.vercel.app
```

### 2.4 Railway Configuration
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Port**: Railway will set `$PORT` automatically

---

## **⚡ Step 3: Vercel Frontend Deployment**

### 3.1 Prepare Frontend for Vercel
1. **Update API URLs** to point to Railway backend
2. **Configure environment variables**

### 3.2 Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your `ZeroSaver` repository
5. Select **frontend** folder as root directory

### 3.3 Configure Environment Variables
In Vercel dashboard, go to **Settings** → **Environment Variables**:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app

# Optional: Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-analytics-id
```

### 3.4 Vercel Configuration
- **Framework Preset**: Next.js
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

---

## **🔧 Step 4: Configuration Updates**

### 4.1 Update Backend Database Config
Replace SQLite with PostgreSQL connection.

### 4.2 Update Frontend API Calls
Ensure all API calls use the Railway backend URL.

### 4.3 CORS Configuration
Update backend CORS to allow Vercel domain.

---

## **🌐 Step 5: Domain & SSL**

### 5.1 Custom Domains (Optional)
- **Railway**: Add custom domain in project settings
- **Vercel**: Add custom domain in project settings

### 5.2 SSL Certificates
- Both Railway and Vercel provide automatic SSL
- Custom domains get automatic SSL certificates

---

## **📊 Step 6: Monitoring & Analytics**

### 6.1 Railway Monitoring
- Built-in metrics and logs
- Health checks available

### 6.2 Vercel Analytics
- Enable in project settings
- Real-time performance metrics

### 6.3 Supabase Monitoring
- Database performance metrics
- Query analytics

---

## **🔒 Step 7: Security Checklist**

- [ ] Strong SECRET_KEY in production
- [ ] CORS properly configured
- [ ] Environment variables secured
- [ ] Database credentials protected
- [ ] HTTPS enabled everywhere
- [ ] Rate limiting configured

---

## **🚨 Troubleshooting**

### Common Issues:
1. **CORS Errors**: Check CORS_ORIGINS in Railway
2. **Database Connection**: Verify DATABASE_URL format
3. **Build Failures**: Check requirements.txt and build logs
4. **API 404s**: Verify NEXT_PUBLIC_API_URL in Vercel

### Debug Commands:
```bash
# Check Railway logs
railway logs

# Check Vercel build logs
vercel logs

# Test database connection
psql $DATABASE_URL
```

---

## **💰 Cost Estimation**

- **Railway**: $5/month (Hobby plan)
- **Vercel**: Free (Hobby plan)
- **Supabase**: Free (up to 500MB database)

**Total**: ~$5/month for production deployment

---

## **🎯 Next Steps After Deployment**

1. Test all API endpoints
2. Verify file uploads work
3. Test user authentication
4. Monitor performance
5. Set up error tracking (Sentry)
6. Configure backups
7. Set up staging environment

---

## **📞 Support Resources**

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
