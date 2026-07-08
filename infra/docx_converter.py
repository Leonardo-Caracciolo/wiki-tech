"""
infra/docx_converter.py

Conversión de .docx a algo renderizable. Depende de docx2pdf (requiere Word
vía COM, Windows) con fallback a mammoth (portable, HTML directo). Es
infraestructura pura: implementa una capacidad ("convertir este archivo"),
no decide reglas de negocio.

Nota para más adelante: docx2pdf es bloqueante y puede tardar varios
segundos. Hoy corre sync dentro del request. Si se vuelve un cuello de
botella real, este es el lugar donde envolverlo en un BackgroundTask o
correrlo en un threadpool — el resto del proyecto no debería enterarse.
"""
import logging
from pathlib import Path

from fastapi import HTTPException

logger = logging.getLogger("wiki")


def convertir_docx(path: Path, cache_dir: Path) -> dict:
    pdf_cache = cache_dir / (path.parent.name + "__" + path.stem + ".pdf")

    if not pdf_cache.exists():
        try:
            from docx2pdf import convert
            convert(str(path.resolve()), str(pdf_cache.resolve()))
        except Exception as e:
            logger.warning(f"docx2pdf falló '{path.name}': {e} — usando mammoth")
            if pdf_cache.exists():
                pdf_cache.unlink()

    if pdf_cache.exists() and pdf_cache.stat().st_size > 0:
        return {"tipo": "pdf", "url": f"/api/cache/{pdf_cache.name}"}

    try:
        import mammoth
        with open(path, "rb") as f:
            result = mammoth.convert_to_html(f)
        return {"tipo": "html_fragment", "html": result.value}
    except Exception as e:
        raise HTTPException(500, f"No se pudo renderizar '{path.name}': {e}")
