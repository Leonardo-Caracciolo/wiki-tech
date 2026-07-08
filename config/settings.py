"""
config/settings.py

Configuración del proyecto. Nada de lógica acá — solo constantes y lectura
de variables de entorno. Si mañana agregás una sección nueva, editás SECTIONS
en este archivo y listo, no tocás nada de app/ ni infra/.
"""
import os
from pathlib import Path

# ─────────────────────────────────────────────────
#  RUTAS BASE
# ─────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent
DOCS_DIR = BASE_DIR / "docs"
CACHE_DIR = BASE_DIR / "cache"

DOCS_DIR.mkdir(exist_ok=True)
CACHE_DIR.mkdir(exist_ok=True)

EXTENSIONS_VALIDAS = {".md", ".docx", ".html", ".pdf"}


# ─────────────────────────────────────────────────
#  SECCIONES
#  Agregar / editar secciones acá. No hace falta tocar el resto del backend.
# ─────────────────────────────────────────────────
SECTIONS = [
    {"id": "arquitectura", "nombre": "Arquitectura", "icono": "🏗️", "color": "#a855f7",
     "descripcion": "Tipos de arquitectura, patrones de diseño, templates SDD/PDD y libros de referencia"},
    {"id": "tecnologias", "nombre": "Tecnologías", "icono": "💻", "color": "#3b82f6",
     "descripcion": "Python, C#, VBA, SQL — guías completas, referencias y recursos del equipo"},
    {"id": "buenas-practicas", "nombre": "Buenas Prácticas", "icono": "✅", "color": "#22c55e",
     "descripcion": "Metodologías ágiles, flujo de proyecto, commits, documentación y GitHub"},
    {"id": "testing", "nombre": "Testing / QA", "icono": "🧪", "color": "#ef4444",
     "descripcion": "pytest, Robot Framework, xUnit, Moq y testing VBA con Rubberduck"},

    # "proyectos" se sacó: quedó sin documentos al borrar catalogo-proyectos.html.
    # Si en algún momento hay contenido nuevo para esa sección, es agregar 3 líneas acá.
]

SECTIONS_MAP = {s["id"]: s for s in SECTIONS}


# ─────────────────────────────────────────────────
#  CORS
#  Antes: allow_origins=["*"] (cualquier sitio puede pegarle a la API).
#  Ahora: whitelist explícita. En prod, seteá WIKI_ALLOWED_ORIGINS como
#  variable de entorno con la URL real separada por comas, ej:
#    WIKI_ALLOWED_ORIGINS=https://wiki.miempresa.internal
#  Si no está seteada, cae a los puertos de desarrollo local únicamente.
# ─────────────────────────────────────────────────
_origins_env = os.getenv("WIKI_ALLOWED_ORIGINS")
if _origins_env:
    ALLOWED_ORIGINS = [o.strip() for o in _origins_env.split(",") if o.strip()]
else:
    ALLOWED_ORIGINS = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
