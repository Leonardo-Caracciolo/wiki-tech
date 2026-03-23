from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from urllib.parse import unquote
from datetime import datetime
from typing import Optional
import markdown
import json
import logging

logger = logging.getLogger("wiki")

app = FastAPI(title="Wiki BPS")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DOCS_DIR  = Path("docs")
CACHE_DIR = Path("cache")
CACHE_DIR.mkdir(exist_ok=True)
DOCS_DIR.mkdir(exist_ok=True)

# ─────────────────────────────────────────────────
#  CONFIGURACIÓN DE SECCIONES
#  Podés agregar / editar secciones acá
# ─────────────────────────────────────────────────
SECTIONS = [
    {"id": "arquitectura",    "nombre": "Arquitectura",         "icono": "🏗️", "color": "#a855f7", "descripcion": "Tipos de arquitectura, patrones de diseño, templates SDD/PDD y libros de referencia"},
    {"id": "tecnologias",     "nombre": "Tecnologías",          "icono": "💻", "color": "#3b82f6", "descripcion": "Python, C#, VBA, SQL — guías completas, referencias y recursos del equipo"},
    {"id": "buenas-practicas","nombre": "Buenas Prácticas",     "icono": "✅", "color": "#22c55e", "descripcion": "Metodologías ágiles, flujo de proyecto, commits, documentación y GitHub"},
    {"id": "testing",         "nombre": "Testing / QA",         "icono": "🧪", "color": "#ef4444", "descripcion": "pytest, Robot Framework, xUnit, Moq y testing VBA con Rubberduck"},
]

SECTIONS_MAP = {s["id"]: s for s in SECTIONS}

EXTENSIONS_VALIDAS = {".md", ".docx", ".html", ".pdf"}


# ─────────────────────────────────────────────────
#  HELPERS
# ─────────────────────────────────────────────────
def leer_meta(section_path: Path) -> dict:
    """Lee el _index.json de una sección si existe."""
    meta_file = section_path / "_index.json"
    if meta_file.exists():
        try:
            return json.loads(meta_file.read_text(encoding="utf-8"))
        except Exception:
            pass
    return {}


def doc_info(f: Path, meta: dict) -> dict:
    doc_meta = meta.get(f.name, {})
    mtime    = datetime.fromtimestamp(f.stat().st_mtime)
    return {
        "nombre":      f.name,
        "titulo":      doc_meta.get("titulo", f.stem.replace("-", " ").replace("_", " ").title()),
        "descripcion": doc_meta.get("descripcion", ""),
        "tags":        doc_meta.get("tags", []),
        "tipo":        f.suffix.lstrip(".").lower(),
        "fecha":       mtime.strftime("%d/%m/%Y"),
        "fecha_iso":   mtime.isoformat(),
        "size":        f.stat().st_size,
    }


def convertir_docx(path: Path) -> dict:
    """docx2pdf con fallback a mammoth."""
    pdf_cache = CACHE_DIR / (path.parent.name + "__" + path.stem + ".pdf")

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


# ─────────────────────────────────────────────────
#  ENDPOINTS
# ─────────────────────────────────────────────────

@app.get("/api/sections")
def get_sections():
    """Lista todas las secciones con conteo de docs."""
    result = []
    for s in SECTIONS:
        section_path = DOCS_DIR / s["id"]
        count = 0
        if section_path.exists():
            count = sum(
                1 for f in section_path.iterdir()
                if f.suffix.lower() in EXTENSIONS_VALIDAS and f.name != "_index.json"
            )
        result.append({**s, "count": count})
    return result


@app.get("/api/sections/{section_id}")
def get_section_docs(section_id: str):
    """Lista los docs de una sección con metadata."""
    if section_id not in SECTIONS_MAP:
        raise HTTPException(404, f"Sección no encontrada: {section_id}")

    section_path = DOCS_DIR / section_id
    if not section_path.exists():
        return {"section": SECTIONS_MAP[section_id], "docs": []}

    meta = leer_meta(section_path)
    docs = []
    for f in sorted(section_path.iterdir(), key=lambda x: x.name.lower()):
        if f.suffix.lower() in EXTENSIONS_VALIDAS and f.name != "_index.json":
            docs.append(doc_info(f, meta))

    return {"section": SECTIONS_MAP[section_id], "docs": docs}


@app.get("/api/render/{section_id}/{nombre:path}")
def render_doc(section_id: str, nombre: str):
    """Renderiza un documento."""
    nombre = unquote(nombre)
    path   = DOCS_DIR / section_id / nombre
    if not path.exists():
        raise HTTPException(404, "Documento no encontrado")

    tipo = path.suffix.lstrip(".").lower()

    if tipo == "md":
        texto = path.read_text(encoding="utf-8")
        html  = markdown.markdown(texto, extensions=["tables", "fenced_code", "toc"])
        return {"tipo": "html_fragment", "html": html}

    elif tipo == "docx":
        return convertir_docx(path)

    elif tipo == "html":
        return {"tipo": "iframe", "url": f"/api/file/{section_id}/{nombre}"}

    elif tipo == "pdf":
        return {"tipo": "iframe", "url": f"/api/file/{section_id}/{nombre}"}

    raise HTTPException(400, f"Tipo no soportado: {tipo}")


@app.get("/api/file/{section_id}/{nombre:path}")
def servir_archivo(section_id: str, nombre: str):
    nombre = unquote(nombre)
    path   = DOCS_DIR / section_id / nombre
    if not path.exists():
        raise HTTPException(404, "Archivo no encontrado")
    return FileResponse(path)


@app.get("/api/cache/{nombre:path}")
def servir_cache(nombre: str):
    path = CACHE_DIR / unquote(nombre)
    if not path.exists():
        raise HTTPException(404, "Cache no encontrado")
    return FileResponse(path, media_type="application/pdf")


@app.get("/api/search")
def buscar(
    q:       str            = Query(..., min_length=1),
    section: Optional[str] = Query(default=None)
):
    """Búsqueda global o por sección."""
    q_lower = q.lower().strip()
    resultados = []

    sections_a_buscar = (
        [DOCS_DIR / section] if section and (DOCS_DIR / section).exists()
        else [DOCS_DIR / s["id"] for s in SECTIONS]
    )

    for section_path in sections_a_buscar:
        if not section_path.exists():
            continue
        section_id = section_path.name
        meta       = leer_meta(section_path)

        for f in section_path.iterdir():
            if f.suffix.lower() not in EXTENSIONS_VALIDAS or f.name == "_index.json":
                continue

            info     = doc_info(f, meta)
            matched  = False
            match_en = []

            # Buscar en nombre y título
            if q_lower in f.name.lower() or q_lower in info["titulo"].lower():
                matched = True
                match_en.append("título")

            # Buscar en descripción
            if q_lower in info["descripcion"].lower():
                matched = True
                match_en.append("descripción")

            # Buscar en tags
            if any(q_lower in tag.lower() for tag in info["tags"]):
                matched = True
                match_en.append("tags")

            # Buscar en contenido (solo md y html)
            if not matched and f.suffix.lower() in [".md", ".html"]:
                try:
                    if q_lower in f.read_text(encoding="utf-8").lower():
                        matched = True
                        match_en.append("contenido")
                except Exception:
                    pass

            if matched:
                resultados.append({
                    **info,
                    "section_id":     section_id,
                    "section_nombre": SECTIONS_MAP.get(section_id, {}).get("nombre", section_id),
                    "section_icono":  SECTIONS_MAP.get(section_id, {}).get("icono", "📄"),
                    "match_en":       match_en,
                })

    return resultados


@app.delete("/api/cache/{nombre:path}")
def invalidar_cache(nombre: str):
    path = CACHE_DIR / unquote(nombre)
    if path.exists():
        path.unlink()
        return {"ok": True}
    return {"ok": False, "msg": "No había cache"}


@app.get("/")
def frontend():
    return FileResponse("index.html")