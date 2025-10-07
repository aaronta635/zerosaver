"""
Railway deployment entry point
This file imports and runs the FastAPI app from the backend directory
"""

import sys
import os

# Add backend directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Import and run the FastAPI app
from app.main import app

if __name__ == "__main__":
    import uvicorn
    # Get port from environment variable, default to 8000
    port = os.getenv("PORT", "8000")
    port = int(port) if port.isdigit() else 8000
    uvicorn.run(app, host="0.0.0.0", port=port)
