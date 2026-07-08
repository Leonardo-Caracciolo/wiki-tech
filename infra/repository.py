"""
infra/repository.py

Toda la lectura del filesystem vive acá: listar documentos de una sección,
leer _index.json, leer el texto de un archivo. Es la capa "sucia" — hace
IO — pero controlada: nadie más en el proyecto llama directo a `open()` o
`Path.iterdir()` fuera de este módulo (además de docx_converter.py, que
tiene su propia lectura binaria específica).
"""
import json
from pathlib import Path

from config.settings import EXTENSIONS_VALIDAS


def leer_meta(section_path: Path) -> dict:
    """Lee el _index.json de una sección si existe."""
    meta_file = section_path / "_index.json"
    if meta_file.exists():
        try:
            return json.loads(meta_file.read_text(encoding="utf-8"))
        except Exception:
            pass
    return {}


def listar_documentos(section_path: Path) -> list[Path]:
    """Devuelve los archivos válidos de una sección, ordenados por nombre."""
    if not section_path.exists():
        return []

    return sorted(
        (
            f for f in section_path.iterdir()
            if f.suffix.lower() in EXTENSIONS_VALIDAS and f.name != "_index.json"
        ),
        key=lambda x: x.name.lower(),
    )


def contar_documentos(section_path: Path) -> int:
    if not section_path.exists():
        return 0
    return len(listar_documentos(section_path))


def leer_texto(path: Path) -> str:
    return path.read_text(encoding="utf-8")
