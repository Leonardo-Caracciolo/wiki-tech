---
titulo: Diseño Profesional de Proyectos y Decisiones Técnicas (Python / C#)
categoria: buenas-practicas/arquitectura
tipo_documento: Guía visual (fuente en Excalidraw)
clasificacion: uso interno
fuente_original: _fuentes/arquitectura_proyectos.excalidraw
relacionados:
  - buenas-practicas/git-github-azuredevops/guia-git-github-azuredevops.md
  - buenas-practicas/metodologia-agil/ciclo-vida-proyecto-agil.md
---

> **Nota de mantenimiento (agregada al organizar la wiki):** este documento
> era originalmente un diagrama de Excalidraw (`.excalidraw`, JSON). Como el
> backend de la wiki no renderiza ese formato ni lo indexa en el buscador, se
> convirtió el contenido a Markdown acá. El archivo fuente original queda en
> `_fuentes/` para poder seguir editando el diagrama visual — si lo modificás,
> actualizá también este `.md` a mano, o exportalo como imagen y linkeala
> desde acá. La sección de Git Flow que traía el diagrama original **se quitó
> de este documento** porque ya está cubierta (y más completa) en
> `guia-git-github-azuredevops.md` — evitá volver a agregarla acá para no
> generar una tercera fuente de verdad sobre ramas.

Guía visual aplicable a proyectos chicos y medianos. Cubre: cuándo usar COM vs No-COM para manipular Excel/Word desde Python o C#, y la arquitectura modular estándar recomendada para cualquier proyecto del equipo, sin importar si tiene UI o no.

---

## COM vs No-COM: ¿cuándo usar qué?

### Librerías COM (Python: `pywin32`, `xlwings` · C#: COM interop)

- Usa Excel/Word reales vía COM.
- Ejecuta macros, fórmulas y pivots.
- Fuerte dependencia de versión de Office, arquitectura (32/64 bits) y Windows.
- **Útil cuando:**
  - Ya existen plantillas con mucha lógica.
  - Se exige el mismo resultado que "a mano".

### Librerías sin COM (Python: `openpyxl`, `xlsxwriter`, `pandas` · C#: `EPPlus`)

- No abren Excel, trabajan directo sobre los archivos.
- No ejecutan macros ni fórmulas de Excel.
- Portables (Windows / Linux / Docker / servidores).
- **Útil cuando:**
  - Hay muchos archivos/datos.
  - El proceso corre en servidor sin Office instalado.

### Resumen conceptual

> **COM** → máxima fidelidad con Excel, baja portabilidad.
> **No-COM** → máxima portabilidad, ideal para automatización masiva.

### Árbol de decisión

Preguntas a hacerte en orden, antes de elegir:

1. **¿Necesito macros/tablas dinámicas y comportamiento EXACTO de Excel?** → Si sí, considerar COM.
2. **¿Voy a ejecutarlo en servidor / Docker / Linux o sin Office instalado?** → Si sí, No-COM es obligatorio (COM no es portable).
3. **¿Procesa grandes volúmenes de datos o muchos archivos en paralelo?** → Si sí, No-COM (COM es lento y frágil en paralelo).

---

## Arquitectura modular estándar

Estructura de proyecto base recomendada, independiente de si el proyecto tiene UI o no.

### `config/`

- `.env` / `appsettings.json`.
- Rutas, flags, nombres de archivos.
- Nada hardcodeado en el código.
- Misma idea en Python y C#.

### `core/` (domain)

- Reglas de negocio puras.
- Sin Excel, sin DB, sin GUI.
- Funciones que reciben datos simples y devuelven datos simples.
- Zona ideal para tests unitarios.

### `infra/`

- `ExcelClientCOM` / `ExcelClientNoCOM`.
- Acceso a DB, archivos, APIs.
- Implementa interfaces definidas en `core/`.
- Capa "sucia", pero controlada.

### `app/` (orquestación)

- Punto de entrada (main, API o UI).
- Lee `config/`, llama a `core/` + `infra/`.
- Maneja logs y errores.
- CLI, GUI (PyQt), API (FastAPI), o UI web C#.

---

## Cómo crear la estructura según el tipo de proyecto

### Proyecto estándar (sin GUI)

1. Crear carpeta del proyecto + venv.
2. Crear estructura: `config/`, `core/`, `infra/`, `app/`, `tests/`.
3. Crear `app/main.py` como entrada (CLI o servicio).
4. Escribir primero la lógica en `core/` y luego usarla desde `app/`.
5. Agregar `README` explicando cómo ejecutar y qué hace.

### Proyecto con Streamlit

1. Crear carpeta del proyecto + venv.
2. Estructura sugerida: `config/`, `core/`, `infra/`, `ui/` (pages, componentes), `app/streamlit_app.py`.
3. En `streamlit_app.py`:
   - Importar funciones de `core/`.
   - Usar `infra/` solo para IO.
4. Mantener la lógica pesada en `core/` y usar `session_state` para estado.
5. Documentar en el `README` el comando: `streamlit run app/streamlit_app.py`.

### Proyecto con PyQt / Qt Designer

1. Crear carpeta + venv.
2. Estructura sugerida: `config/`, `core/`, `infra/`, `ui/` (`.ui` + ventanas), `workers/` (QThread, tareas), `app/main.py`.
3. Diseñar `.ui` en Qt Designer.
4. En `main.py`:
   - Crear `QApplication`.
   - Cargar config y crear servicios de `infra/`.
   - Instanciar ventana principal de `ui/` y pasarle dependencias.
5. Mantener la lógica en `core/` y no en los slots de los botones.
