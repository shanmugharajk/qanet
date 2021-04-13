from fastapi import FastAPI
from starlette.applications import Starlette

from .api import api_router

# we create the ASGI for the app
app = Starlette()

# we create the Web API framework
api = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)

# we add all API routes to the Web API framework
api.include_router(api_router, prefix="/v1")

app.mount("/api", app=api)
