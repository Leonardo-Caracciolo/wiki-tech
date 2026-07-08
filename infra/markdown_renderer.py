"""
infra/markdown_renderer.py

Wrapper fino sobre la librería `markdown`. Existe como módulo propio para
que si el día de mañana cambiás de librería (o agregás una extensión nueva),
lo tocás en un solo lugar y no en medio del router.
"""
import markdown


def renderizar_markdown(texto: str) -> str:
    return markdown.markdown(texto, extensions=["tables", "fenced_code", "toc"])
