#!/bin/bash

# ZeroSaver Development Startup Script

echo "🚀 Starting ZeroSaver Development Environment..."

# Check if we're in the right directory
if [ ! -f "backend/app/main.py" ] || [ ! -f "frontend/package.json" ]; then
    echo "❌ Please run this script from the ZeroSaver root directory"
    exit 1
fi

# Start backend
echo "🔧 Starting FastAPI backend..."
cd backend
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file for local development..."
    cat > .env << EOF
SECRET_KEY=dev-secret-key-not-for-production
DATABASE_URL=sqlite:///./test.db
ENVIRONMENT=development
EOF
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
pip install -r requirements.txt

# Create database if it doesn't exist
echo "🗄️ Setting up database..."
python -c "from app.database import db_engine; from app.models.base import Base; Base.metadata.create_all(bind=db_engine); print('✅ Database ready!')"

# Start backend server
echo "🚀 Starting backend server on http://localhost:8000"
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Go back to root and start frontend
cd ../frontend

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Set up frontend environment
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file for frontend..."
    cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8000
EOF
fi

# Start frontend server
echo "🚀 Starting frontend server on http://localhost:3000"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ ZeroSaver is running!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait

# Cleanup
echo "🛑 Stopping servers..."
kill $BACKEND_PID 2>/dev/null
kill $FRONTEND_PID 2>/dev/null
echo "✅ Servers stopped"
