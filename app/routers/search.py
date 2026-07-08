"""
app/routers/search.py

Endpoint de búsqueda. La lógica de "qué es un match" vive en core/search.py
(pura); acá solo se orquesta: por qué secciones recorrer, qué archivos leer,
y armar la respuesta.
"""
from typing import Optional

from fastapi import APIRouter, Query

from config.settings import DOCS_DIR, SECTIONS, SECTIONS_MAP
from core.documents import doc_info
from core.search import evaluar_metadata, matchea_contenido
from infra.repository import leer_meta, leer_texto, listar_documentos

router = APIRouter(prefix="/api/search", tags=["search"])


@router.get("")
def buscar(
    q: str = Query(..., min_length=1),
    section: Optional[str] = Query(default=None),
):
    """Búsqueda global o por sección."""
    q_lower = q.lower().strip()
    resultados = []

    if section and (DOCS_DIR / section).exists():
        sections_a_buscar = [DOCS_DIR / section]
    else:
        sections_a_buscar = [DOCS_DIR / s["id"] for s in SECTIONS]

    for section_path in sections_a_buscar:
        section_id = section_path.name
        meta = leer_meta(section_path)

        for f in listar_documentos(section_path):
            info = doc_info(f, meta)
            match_en = evaluar_metadata(q_lower, f.name, info)

            if not match_en and f.suffix.lower() in (".md", ".html"):
                try:
                    contenido = leer_texto(f)
                except Exception:
                    contenido = None
                if matchea_contenido(q_lower, contenido):
                    match_en.append("contenido")

            if match_en:
                resultados.append({
                    **info,
                    "section_id": section_id,
                    "section_nombre": SECTIONS_MAP.get(section_id, {}).get("nombre", section_id),
                    "section_icono": SECTIONS_MAP.get(section_id, {}).get("icono", "📄"),
                    "match_en": match_en,
                })

    return resultados
