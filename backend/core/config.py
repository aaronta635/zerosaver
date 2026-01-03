from typing import Any
from pydantic import AnyHttpUrl, RedisDsn
from pydantic_settings import BaseSettings
from pathlib import Path

path = Path.cwd()
env_path = path / ".env"


class PaystackConfig(BaseSettings):
    BASE_URL: str = "https://api.paystack.co/"
    SECRET_KEY: str = ""
    CALLBACK_URL: str = "https://127.0.0.0.1:8000/cart/checkout"

    class Config:
        case_sensitve = True
        env_prefix = "PAYSTACK_"
        env_path = env_path
        env_file_encoding = "utf-8"


class Settings(BaseSettings):
    SQLALCHEMY_DATABASE_URL: str = ""
    DATABASE_URL: str = ""  # Railway uses this variable name
    TEST_SQLALCHEMY_DATABASE_URL: str = ""
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    JWT_SECRET_KEY: str = ""
    ALGORITHM: str = ""
    ACCESS_TOKEN_EXPIRY_TIME: int = 20
    REFRESH_TOKEN_EXPIRY_TIME: int = 30
    FORGET_PASSWORD_EXPIRY_TIME: int = 5
    STRIPE_PUBLISHABLE_KEY: str = ""
    STRIPE_SECRET_KEY: str = ""
    POSTMARK_SERVER_TOKEN: str = ""
    POSTMARK_FROM_EMAIL: str = ""
    # Notification Service Configuration
    NOTIFICATION_SERVICE_URL: str = "http://localhost:8001"  # Default to local mock service
    NOTIFICATION_SERVICE_API_KEY: str = ""  # API key for authentication (if needed)
    NOTIFICATION_SERVICE_ENABLED: bool = True  # Toggle to enable/disable notifications
    paystack_config: PaystackConfig = PaystackConfig()

    @property
    def database_url(self) -> str:
        """Get database URL, preferring SQLALCHEMY_DATABASE_URL but falling back to DATABASE_URL (Railway standard)."""
        url = self.SQLALCHEMY_DATABASE_URL or self.DATABASE_URL
        if not url:
            raise ValueError("Database URL not configured. Set either SQLALCHEMY_DATABASE_URL or DATABASE_URL environment variable.")
        # Railway may provide postgres:// URLs, but SQLAlchemy 1.4+ requires postgresql://
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        return url

    class Config:
        env_path = env_path
        env_file_encoding = "utf-8"


settings = Settings()
