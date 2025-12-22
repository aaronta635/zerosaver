from .auth_user import *
from .product import *
from .cart import *
from .order import *
from .customer import *
from .vendor import *

from core.db import engine  # noqa: F401

# Table creation is handled at app startup (see main.py) to avoid
# concurrent create_all calls from multiple containers.
# Uncomment the lines below if you want to force create_all here (not recommended in multi-container setups).
# auth_user.Base.metadata.create_all(bind=engine)
# product.Base.metadata.create_all(bind=engine)
# cart.Base.metadata.create_all(bind=engine)
# order.Base.metadata.create_all(bind=engine)
# customer.Base.metadata.create_all(bind=engine)
# vendor.Base.metadata.create_all(bind=engine)
