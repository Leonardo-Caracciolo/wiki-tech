"""
tests/test_paths.py

Cubre justamente lo que antes era la vulnerabilidad: que no se pueda salir
del directorio base con un nombre de archivo malicioso.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import pytest
from core.paths import RutaInvalidaError, resolver_ruta_segura


def test_ruta_normal_se_resuelve_bien(tmp_path):
    (tmp_path / "seccion").mkdir()
    (tmp_path / "seccion" / "doc.md").write_text("hola")

    resultado = resolver_ruta_segura(tmp_path, "seccion", "doc.md")

    assert resultado == (tmp_path / "seccion" / "doc.md").resolve()


def test_path_traversal_con_dobles_puntos_se_rechaza(tmp_path):
    (tmp_path / "seccion").mkdir()

    with pytest.raises(RutaInvalidaError):
        resolver_ruta_segura(tmp_path, "seccion", "../../../../etc/passwd")


def test_path_traversal_absoluto_se_rechaza(tmp_path):
    with pytest.raises(RutaInvalidaError):
        resolver_ruta_segura(tmp_path, "seccion", "/etc/passwd")
