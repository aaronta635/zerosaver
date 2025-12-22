from fastapi import FastAPI

from core.middleware import start_up_db
from core.db import Base, engine
import models  # ensure models are imported so metadata is populated
from api.endpoints import router


app = FastAPI()


@app.on_event("startup")
def start_up():
    start_up_db()
    # Create all tables once at startup (no Alembic usage).
    Base.metadata.create_all(bind=engine)


app.include_router(router)
