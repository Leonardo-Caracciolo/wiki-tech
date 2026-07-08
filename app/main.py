"""
app/main.py

Punto de entrada de la API. Solo orquesta: crea la app, configura CORS y
conecta los routers. Ninguna lógica de negocio vive acá — si estás por
agregar un endpoint nuevo, probablemente va en app/routers/, no acá.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from config.settings import ALLOWED_ORIGINS
from app.routers import cache, documents, search, sections

app = FastAPI(title="Wiki BPS")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sections.router)
app.include_router(documents.router)
app.include_router(cache.router)
app.include_router(search.router)


@app.get("/")
def frontend():
    return FileResponse("index.html")
