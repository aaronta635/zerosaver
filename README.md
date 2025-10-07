# 🍎 ZeroSaver - Food Waste Reduction Platform

A marketplace for surplus food that helps reduce waste and save money. Connect with local businesses to rescue food before it goes to waste.

## 🚀 Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: FastAPI + Python 3.11
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Railway (Backend) + Vercel (Frontend)

## 📁 Project Structure

```
ZeroSaver/
├── frontend/          # Next.js application
├── backend/           # FastAPI application
├── main.py           # Railway deployment entry point
├── requirements.txt  # Python dependencies
├── railway.json      # Railway configuration
├── nixpacks.toml     # Build configuration
└── Procfile          # Alternative deployment config
```

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- Python 3.11+
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ZeroSaver
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   cp .env.example .env  # Configure your environment variables
   uvicorn app.main:app --reload
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## 🗄️ Database Setup (Supabase)

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Save your project URL and API key

### 2. Database Tables
Run these SQL commands in Supabase SQL Editor:

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vendors table
CREATE TABLE IF NOT EXISTS vendors (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(100),
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Deals table
CREATE TABLE IF NOT EXISTS deals (
    id SERIAL PRIMARY KEY,
    vendor_id INTEGER REFERENCES vendors(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    original_price DECIMAL(10,2) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL,
    min_order_qty INTEGER DEFAULT 1,
    category VARCHAR(100),
    image_url VARCHAR(500),
    pickup_address TEXT,
    pickup_start TIMESTAMP,
    pickup_end TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Carts table
CREATE TABLE IF NOT EXISTS carts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    deal_id INTEGER REFERENCES deals(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    deal_id INTEGER REFERENCES deals(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Environment Variables
Create `backend/.env` with your Supabase credentials:

```bash
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres
SUPABASE_URL=https://[PROJECT_REF].supabase.co
SUPABASE_KEY=[YOUR_API_KEY]
SECRET_KEY=your-super-secret-key-here
ENVIRONMENT=development
```

## 🚀 Deployment

### Backend (Railway)

1. **Connect to Railway**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Railway will auto-detect the Python app

2. **Environment Variables**
   Add these in Railway dashboard:
   ```bash
   DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:6543/postgres
   SUPABASE_URL=https://[PROJECT_REF].supabase.co
   SUPABASE_KEY=[YOUR_API_KEY]
   SECRET_KEY=your-super-secret-key-here
   ENVIRONMENT=production
   ```

3. **Deploy**
   - Railway will automatically build and deploy
   - Copy the Railway app URL (e.g., `https://your-app.railway.app`)

### Frontend (Vercel)

1. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set root directory to `frontend`

2. **Environment Variables**
   Add in Vercel dashboard:
   ```bash
   NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app
   ```

3. **Deploy**
   - Vercel will automatically build and deploy
   - Copy the Vercel app URL (e.g., `https://your-app.vercel.app`)

### Update CORS Settings
Update the Railway backend environment variable:
```bash
CORS_ORIGINS=["https://your-vercel-app.vercel.app"]
```

## 📊 Features

- **User Authentication**: Register, login, and user management
- **Vendor Dashboard**: Business registration and deal management
- **Deal Discovery**: Browse and search food deals
- **Shopping Cart**: Add deals to cart and checkout
- **Order Management**: Track orders and order history
- **File Upload**: Image upload for deals
- **Real-time Updates**: Live deal availability

## 🛡️ Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Environment variable security
- Input validation with Pydantic

## 💰 Cost Estimation

- **Railway**: $5/month (Hobby plan)
- **Vercel**: Free (Hobby plan)
- **Supabase**: Free (up to 500MB database)
- **Total**: ~$5/month

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check DATABASE_URL format
   - Verify Supabase database is running
   - Ensure password is URL-encoded

2. **CORS Errors**
   - Update CORS_ORIGINS in backend
   - Verify frontend URL is correct

3. **Build Failures**
   - Check requirements.txt
   - Verify Python version compatibility
   - Check Railway/Vercel build logs

### Debug Commands

```bash
# Test database connection
cd backend
python test_supabase_client.py

# Check Railway logs
railway logs

# Check Vercel build logs
vercel logs
```

## 📞 Support

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for reducing food waste and helping communities save money.**
