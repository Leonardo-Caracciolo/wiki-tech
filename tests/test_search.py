import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from core.search import evaluar_metadata, matchea_contenido


def _info(titulo="", descripcion="", tags=None):
    return {"titulo": titulo, "descripcion": descripcion, "tags": tags or []}


def test_matchea_por_titulo():
    info = _info(titulo="Guía de Git")
    assert "título" in evaluar_metadata("git", "guia-git.md", info)


def test_matchea_por_nombre_de_archivo():
    info = _info(titulo="Otra cosa")
    assert "título" in evaluar_metadata("guia-git", "guia-git.md", info)


def test_matchea_por_descripcion():
    info = _info(titulo="X", descripcion="Todo sobre UiPath")
    assert "descripción" in evaluar_metadata("uipath", "x.md", info)


def test_matchea_por_tags():
    info = _info(titulo="X", tags=["python", "testing"])
    assert "tags" in evaluar_metadata("testing", "x.md", info)


def test_no_matchea_si_no_hay_coincidencia():
    info = _info(titulo="Arquitectura", descripcion="Patrones", tags=["diseño"])
    assert evaluar_metadata("uipath", "arquitectura.md", info) == []


def test_matchea_contenido():
    assert matchea_contenido("factura", "el sistema procesa la factura")


def test_no_matchea_contenido_vacio():
    assert not matchea_contenido("factura", None)
