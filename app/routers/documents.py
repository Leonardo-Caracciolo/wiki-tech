"""
app/routers/documents.py

Renderizado y descarga directa de documentos. Antes, `nombre` (que viene de
la URL) se pegaba directo a un Path sin validar — alguien podía pedir
`../../../../etc/passwd` y el endpoint se lo servía. Ahora todo pasa por
`resolver_ruta_segura`, que garantiza que el archivo resuelto siga dentro
de `DOCS_DIR / section_id`. Si no, se corta con 404 (no con un mensaje que
confirme "encontraste el bug").
"""
from urllib.parse import unquote

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from config.settings import CACHE_DIR, DOCS_DIR
from core.paths import RutaInvalidaError, resolver_ruta_segura
from infra.docx_converter import convertir_docx
from infra.markdown_renderer import renderizar_markdown
from infra.repository import leer_texto

router = APIRouter(prefix="/api", tags=["documents"])


def _resolver_o_404(section_id: str, nombre: str):
    nombre = unquote(nombre)
    try:
        path = resolver_ruta_segura(DOCS_DIR, section_id, nombre)
    except RutaInvalidaError:
        raise HTTPException(404, "Documento no encontrado")

    if not path.exists():
        raise HTTPException(404, "Documento no encontrado")
    return path


@router.get("/render/{section_id}/{nombre:path}")
def render_doc(section_id: str, nombre: str):
    """Renderiza un documento."""
    path = _resolver_o_404(section_id, nombre)
    tipo = path.suffix.lstrip(".").lower()

    if tipo == "md":
        html = renderizar_markdown(leer_texto(path))
        return {"tipo": "html_fragment", "html": html}

    elif tipo == "docx":
        return convertir_docx(path, CACHE_DIR)

    elif tipo in ("html", "pdf"):
        return {"tipo": "iframe", "url": f"/api/file/{section_id}/{nombre}"}

    raise HTTPException(400, f"Tipo no soportado: {tipo}")


@router.get("/file/{section_id}/{nombre:path}")
def servir_archivo(section_id: str, nombre: str):
    path = _resolver_o_404(section_id, nombre)
    return FileResponse(path)
