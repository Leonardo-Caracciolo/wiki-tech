"""
core/search.py

Lógica de "qué cuenta como un match" en la búsqueda. Pura: recibe la query
y los datos ya leídos (info del doc, contenido opcional) y devuelve en qué
campos matcheó. No lee archivos del disco — eso es responsabilidad de
infra/repository.py.

Se separa en dos funciones a propósito: matchear metadata es gratis (ya la
tenemos en memoria), matchear contenido implica leer el archivo entero.
El router solo debería pagar ese costo si la metadata no alcanzó — por eso
no conviene una única función que reciba "contenido" siempre.
"""
from typing import Optional


def evaluar_metadata(q_lower: str, nombre_archivo: str, info: dict) -> list[str]:
    """Matchea contra nombre, título, descripción y tags — todo en memoria."""
    match_en: list[str] = []

    if q_lower in nombre_archivo.lower() or q_lower in info["titulo"].lower():
        match_en.append("título")

    if q_lower in info["descripcion"].lower():
        match_en.append("descripción")

    if any(q_lower in tag.lower() for tag in info["tags"]):
        match_en.append("tags")

    return match_en


def matchea_contenido(q_lower: str, contenido: Optional[str]) -> bool:
    """Matchea contra el contenido completo del archivo. Llamar solo cuando
    evaluar_metadata() no encontró nada, para no leer archivos de más."""
    return contenido is not None and q_lower in contenido.lower()
