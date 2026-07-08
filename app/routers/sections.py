"""
app/routers/sections.py

Endpoints de listado de secciones y sus documentos. Orquesta config + core
+ infra — no decide reglas nuevas acá.
"""
from fastapi import APIRouter, HTTPException

from config.settings import DOCS_DIR, SECTIONS, SECTIONS_MAP
from core.documents import doc_info
from infra.repository import contar_documentos, leer_meta, listar_documentos

router = APIRouter(prefix="/api/sections", tags=["sections"])


@router.get("")
def get_sections():
    """Lista todas las secciones con conteo de docs."""
    result = []
    for s in SECTIONS:
        section_path = DOCS_DIR / s["id"]
        result.append({**s, "count": contar_documentos(section_path)})
    return result


@router.get("/{section_id}")
def get_section_docs(section_id: str):
    """Lista los docs de una sección con metadata."""
    if section_id not in SECTIONS_MAP:
        raise HTTPException(404, f"Sección no encontrada: {section_id}")

    section_path = DOCS_DIR / section_id
    meta = leer_meta(section_path)
    docs = [doc_info(f, meta) for f in listar_documentos(section_path)]

    return {"section": SECTIONS_MAP[section_id], "docs": docs}
