# 📚 Wiki BPS — Dev Team · Deloitte

Base de conocimiento centralizada del equipo de desarrollo y automatización RPA.

## Stack

| Capa | Tecnología |
|------|-----------|
| Backend | FastAPI + Python 3.10+ |
| Frontend | React 18 + Vite + CSS Modules |
| Render `.docx` | docx2pdf (Word COM) + mammoth (fallback) |
| Render `.md` | markdown-it |

---

## Estructura del proyecto

```
docshub/
├── main.py              ← Backend FastAPI
├── setup.bat            ← Instala dependencias (Windows)
├── README.md
├── .gitignore
├── cache/               ← PDFs generados desde .docx (auto, ignorado por git)
├── docs/                ← Documentos organizados por sección
│   ├── arquitectura/    ← Tipos de arquitectura, patrones GoF, SDD/PDD
│   ├── tecnologias/     ← Python, C#, VBA, SQL, DAX, pandas
│   ├── buenas-practicas/← Metodologías, flujo de proyecto, GitHub, Cookiecutter
│   └── testing/         ← pytest, Robot Framework, xUnit, VBA testing
└── wiki-bps/            ← Frontend React + Vite
    ├── package.json
    ├── vite.config.js   ← Proxy /api → :8000
    └── src/
        ├── api/         ← Capa de datos
        ├── hooks/       ← useWiki, useTheme
        ├── styles/      ← Themes dark/light, globals
        └── components/
            ├── Layout/  ← Header + Sidebar
            ├── Home/    ← Grid de secciones
            ├── Section/ ← Lista de docs + descarga
            ├── DocViewer/← Viewer + modo lectura
            └── Search/  ← Resultados de búsqueda
```

---

## Instalación

### Requisitos
- Python 3.10+
- Node.js 18+ → https://nodejs.org (LTS)
- Microsoft Word (opcional, para convertir `.docx` a PDF)

### 1. Dependencias Python
```bash
pip install fastapi uvicorn markdown docx2pdf mammoth
```

### 2. Dependencias frontend
```bash
cd wiki-bps
npm install
```

---

## Levantar el proyecto

Dos terminales simultáneas:

**Terminal 1 — Backend:**
```bash
uvicorn main:app --reload
```

**Terminal 2 — Frontend:**
```bash
cd wiki-bps
npm run dev
```

Abrir en el browser: **http://localhost:5173**

---

## Agregar documentos

1. Copiar el archivo (`.html`, `.md`, `.docx`, `.pdf`) a la carpeta de la sección correspondiente dentro de `docs/`
2. Opcionalmente editar el `_index.json` de esa sección para agregar título, descripción y tags

```json
{
  "mi-documento.pdf": {
    "titulo": "Título visible en la wiki",
    "descripcion": "Descripción breve del contenido",
    "tags": ["tag1", "tag2"]
  }
}
```

Sin `_index.json` funciona igual — usa el nombre del archivo como título.

## Agregar una nueva sección

1. Crear la carpeta en `docs/nombre-seccion/`
2. Agregar la entrada en `SECTIONS` dentro de `main.py`:
```python
{"id": "nombre-seccion", "nombre": "Nombre visible", "icono": "📋", "color": "#06b6d4", "descripcion": "Descripción"}
```
3. Reiniciar uvicorn

---

## Atajos de teclado

| Tecla | Acción |
|-------|--------|
| `/` | Enfocar búsqueda global |
| `Esc` | Cerrar búsqueda / volver |
| `F` | Modo lectura enfocado |

---

## Formatos soportados

| Formato | Cómo se renderiza |
|---------|-------------------|
| `.pdf` | Visor nativo del browser |
| `.docx` | Conversión a PDF (requiere Word) · fallback a HTML |
| `.html` | iframe (preserva estilos propios) |
| `.md` | Convertido a HTML con soporte de tablas y código |

---

Wiki BPS · Dev Team · Deloitte