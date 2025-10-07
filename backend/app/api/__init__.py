from fastapi import APIRouter

api_router = APIRouter()

from app.api import users, deals, cart, vendor, auth, admin

api_router.include_router(auth.router, prefix='/auth', tags=['Authentication'])
api_router.include_router(users.router, prefix='/users', tags=['users'])
api_router.include_router(deals.router, prefix='/deals', tags=['deals'])
api_router.include_router(cart.router, prefix='/cart', tags=['Cart'])
api_router.include_router(vendor.router, prefix='/vendor', tags=['vendor'])
api_router.include_router(admin.router, prefix='/admin', tags=['Admin'])

