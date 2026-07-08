"""
main.py (raíz del proyecto)

Shim de compatibilidad: así seguís pudiendo correr `uvicorn main:app
--reload --port 8000` como ya lo tenías en tu terminal, sin tener que
acordarte del nuevo path `app.main:app`. Toda la app real vive en
app/main.py — este archivo no debería crecer.
"""
from app.main import app  # noqa: F401
