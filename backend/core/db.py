from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import create_engine
from core import settings

engine = create_engine(url=settings.database_url)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        return db
    finally:
        db.close()
