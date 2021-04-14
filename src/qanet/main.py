import os

from fastapi import FastAPI

from starlette.staticfiles import StaticFiles

from .config import STATIC_DIR
from .api import api_router

app = FastAPI()

frontend = FastAPI()

# we create the Web API framework
api = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)

# we add all API routes to the Web API framework
api.include_router(api_router, prefix="/v1")

static_dir = f"{os.getcwd()}/{STATIC_DIR}"
frontend.mount("/", StaticFiles(directory=static_dir, html=True), name="app")

app.mount("/api", app=api)
app.mount("/", app=frontend)
