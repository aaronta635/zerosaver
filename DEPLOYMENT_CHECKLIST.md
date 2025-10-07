# 🚀 Deployment Checklist

## **Pre-Deployment Setup**

### ✅ **1. Supabase Database**
- [ ] Create Supabase project at [supabase.com](https://supabase.com)
- [ ] Save database connection details:
  - Host: `db.xxxxxxxxxxxxx.supabase.co`
  - Database: `postgres`
  - Port: `5432`
  - User: `postgres`
  - Password: `[YOUR_PASSWORD]`
- [ ] Test connection to Supabase database

### ✅ **2. Railway Backend Environment Variables**
Add these in Railway dashboard → Variables:

```bash
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.[YOUR_PROJECT_REF].supabase.co:5432/postgres
SECRET_KEY=your-super-secret-key-here-make-it-long-and-random-at-least-32-characters
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=["https://your-app.vercel.app"]
ENVIRONMENT=production
```

### ✅ **3. Vercel Frontend Environment Variables**
Add these in Vercel dashboard → Settings → Environment Variables:

```bash
NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app
```

## **Deployment Steps**

### ✅ **4. Deploy Backend to Railway**
- [ ] Go to [railway.app](https://railway.app)
- [ ] Connect GitHub repository
- [ ] Select `ZeroSaver` repository
- [ ] Railway auto-detects Python project
- [ ] Add environment variables (from step 2)
- [ ] Deploy automatically starts
- [ ] Copy the Railway app URL (e.g., `https://your-app.railway.app`)

### ✅ **5. Deploy Frontend to Vercel**
- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Connect GitHub repository
- [ ] Select `ZeroSaver` repository
- [ ] Set root directory to `frontend`
- [ ] Add environment variables (from step 3)
- [ ] Deploy automatically starts
- [ ] Copy the Vercel app URL (e.g., `https://your-app.vercel.app`)

### ✅ **6. Update CORS Settings**
- [ ] Go back to Railway dashboard
- [ ] Update `CORS_ORIGINS` with your actual Vercel URL
- [ ] Redeploy backend

## **Post-Deployment Testing**

### ✅ **7. Test Backend API**
- [ ] Visit `https://your-railway-app.railway.app/` (should show API message)
- [ ] Test API endpoints:
  - [ ] `GET /api/users/` (should return empty array)
  - [ ] `POST /api/auth/register` (test user registration)
  - [ ] `POST /api/auth/login` (test user login)

### ✅ **8. Test Frontend**
- [ ] Visit your Vercel URL
- [ ] Test user registration
- [ ] Test user login
- [ ] Test main application features
- [ ] Check browser console for errors

### ✅ **9. Test Database Connection**
- [ ] Create a test user through the frontend
- [ ] Check Supabase dashboard → Table Editor
- [ ] Verify data is being saved correctly

## **Security & Performance**

### ✅ **10. Security Checklist**
- [ ] Strong SECRET_KEY (32+ characters)
- [ ] CORS properly configured
- [ ] HTTPS enabled (automatic on Railway/Vercel)
- [ ] Environment variables secured
- [ ] Database credentials protected

### ✅ **11. Performance Optimization**
- [ ] Enable Vercel Analytics
- [ ] Monitor Railway metrics
- [ ] Set up error tracking (optional)
- [ ] Configure caching (optional)

## **Monitoring & Maintenance**

### ✅ **12. Set Up Monitoring**
- [ ] Bookmark Railway dashboard
- [ ] Bookmark Vercel dashboard
- [ ] Bookmark Supabase dashboard
- [ ] Set up uptime monitoring (optional)

### ✅ **13. Backup Strategy**
- [ ] Supabase provides automatic backups
- [ ] Export database schema
- [ ] Document deployment process

## **Troubleshooting**

### Common Issues:
- **CORS Errors**: Update CORS_ORIGINS in Railway
- **Database Connection**: Check DATABASE_URL format
- **Build Failures**: Check requirements.txt and logs
- **API 404s**: Verify NEXT_PUBLIC_API_URL in Vercel

### Debug Commands:
```bash
# Check Railway logs
railway logs

# Check Vercel build logs
vercel logs

# Test database connection
psql $DATABASE_URL
```

## **Cost Summary**
- **Railway**: $5/month (Hobby plan)
- **Vercel**: Free (Hobby plan)  
- **Supabase**: Free (up to 500MB database)
- **Total**: ~$5/month

## **Next Steps**
- [ ] Set up custom domain (optional)
- [ ] Configure staging environment
- [ ] Set up CI/CD pipeline
- [ ] Add error tracking (Sentry)
- [ ] Set up monitoring alerts
