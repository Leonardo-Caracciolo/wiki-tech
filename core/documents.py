"""
core/documents.py

Reglas de negocio sobre "qué es un documento" en la wiki: cómo se arma su
metadata para mostrarlo en el frontend. Recibe datos simples (un Path, un
dict de metadata) y devuelve datos simples (un dict) — sin llamar a la red,
sin tocar FastAPI. Ideal para tests unitarios.
"""
from datetime import datetime
from pathlib import Path


def doc_info(f: Path, meta: dict) -> dict:
    """Arma la metadata de un documento combinando el archivo físico con
    lo que haya en _index.json para ese nombre de archivo."""
    doc_meta = meta.get(f.name, {})
    mtime = datetime.fromtimestamp(f.stat().st_mtime)

    return {
        "nombre": f.name,
        "titulo": doc_meta.get("titulo", f.stem.replace("-", " ").replace("_", " ").title()),
        "descripcion": doc_meta.get("descripcion", ""),
        "tags": doc_meta.get("tags", []),
        "tipo": f.suffix.lstrip(".").lower(),
        "fecha": mtime.strftime("%d/%m/%Y"),
        "fecha_iso": mtime.isoformat(),
        "size": f.stat().st_size,
    }
