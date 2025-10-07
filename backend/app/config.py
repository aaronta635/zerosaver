from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    # Database URL - defaults to SQLite for local dev, PostgreSQL for production
    database_url: str = os.getenv('DATABASE_URL', 'sqlite:///./test.db')
    secret_key: str = os.getenv('SECRET_KEY', 'supersecret')
    algorithm: str = 'HS256'
    access_token_expire_minutes: int = 30
    
    # Supabase settings
    supabase_url: str = os.getenv('SUPABASE_URL', '')
    supabase_key: str = os.getenv('SUPABASE_KEY', '')
    
    # CORS settings
    cors_origins: list = [
        "http://localhost:3000",
        "https://zerosaver.vercel.app",
        "https://zerosaver-git-main-aaronta635.vercel.app"
    ]

    class Config:
        env_file = '.env'
        extra = 'ignore'  # Ignore extra fields in .env

settings = Settings()
