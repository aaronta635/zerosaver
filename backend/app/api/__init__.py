from fastapi import APIRouter

api_router = APIRouter()

from app.api import users, deals

api_router.include_router(users.router, prefix='/users', tags=['users'])
api_router.include_router(deals.router, prefix='/deals', tags=['deals'])

