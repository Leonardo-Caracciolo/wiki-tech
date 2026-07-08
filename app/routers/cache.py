"""
app/routers/cache.py

Servir e invalidar el cache de PDFs generados a partir de docx. Mismo fix
de path traversal que en documents.py — `nombre` de acá también viene de
la URL sin validar en la versión original.
"""
from urllib.parse import unquote

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from config.settings import CACHE_DIR
from core.paths import RutaInvalidaError, resolver_ruta_segura

router = APIRouter(prefix="/api/cache", tags=["cache"])


@router.get("/{nombre:path}")
def servir_cache(nombre: str):
    try:
        path = resolver_ruta_segura(CACHE_DIR, unquote(nombre))
    except RutaInvalidaError:
        raise HTTPException(404, "Cache no encontrado")

    if not path.exists():
        raise HTTPException(404, "Cache no encontrado")
    return FileResponse(path, media_type="application/pdf")


@router.delete("/{nombre:path}")
def invalidar_cache(nombre: str):
    try:
        path = resolver_ruta_segura(CACHE_DIR, unquote(nombre))
    except RutaInvalidaError:
        return {"ok": False, "msg": "No había cache"}

    if path.exists():
        path.unlink()
        return {"ok": True}
    return {"ok": False, "msg": "No había cache"}
