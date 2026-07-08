"""
core/paths.py

Regla de negocio: cualquier archivo que la wiki sirva tiene que quedar
DENTRO de la carpeta de la sección (o de cache). Esto es lo que antes
faltaba: `nombre` venía de la URL y se pegaba directo a un Path, así que
algo como `../../../../etc/passwd` en la URL lo servía sin problema
(path traversal). Ahora se resuelve la ruta final y se verifica que siga
siendo descendiente del directorio base antes de devolverla.

Es una regla de dominio, no un detalle de infraestructura — por eso vive acá
y no en infra/. infra/ solo la usa, no la redefine.
"""
from pathlib import Path


class RutaInvalidaError(Exception):
    """La ruta pedida queda fuera del directorio permitido."""


def resolver_ruta_segura(base_dir: Path, *partes: str) -> Path:
    """
    Combina base_dir con las partes dadas (típicamente section_id + nombre
    de archivo) y devuelve la ruta resuelta, garantizando que el resultado
    siga siendo descendiente de base_dir.

    Lanza RutaInvalidaError si no lo es — el caller decide qué HTTPException
    devolver (normalmente 404, para no confirmarle a quien esté probando
    que encontró un endpoint vulnerable).
    """
    base_resuelta = base_dir.resolve()
    candidato = (base_dir / Path(*partes)).resolve()

    if not candidato.is_relative_to(base_resuelta):
        raise RutaInvalidaError(f"Ruta fuera de {base_dir}: {candidato}")

    return candidato
