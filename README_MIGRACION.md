# Backend reestructurado — `config / core / infra / app`

Esto sigue el mismo patrón que ya documentaste en
`docs/buenas-practicas/arquitectura/arquitectura-proyectos-python-csharp.md`.
Tu backend ahora predica con el ejemplo.

## Cómo instalarlo en tu proyecto

1. Copiá las carpetas `config/`, `core/`, `infra/`, `app/` y el archivo `tests/`
   a la raíz de tu repo (donde hoy está tu `main.py`).
2. **Reemplazá tu `main.py` actual** por el `main.py` de este paquete (es un
   shim de 3 líneas, no el código completo — el código real ahora vive en
   `app/main.py`).
3. Copiá también tu `docs/` y `cache/` reales encima (no uses los de prueba
   que traiga este zip, si trae alguno).
4. Instalá lo nuevo que se suma: `pip install pytest` (para correr los
   tests). El resto de las dependencias son las mismas que ya tenías.

## Cómo correrlo

**Exactamente igual que antes:**
```
uvicorn main:app --reload --port 8000
```
El shim en la raíz hace que este comando siga funcionando sin que tengas
que cambiar nada en tu flujo de trabajo ni en ningún script/atajo que ya
tengas armado.

## Cómo correr los tests

```
pytest tests/ -v
```

10 tests, todos pasando. Cubren el fix de path traversal (lo más importante)
y la lógica de búsqueda.

## Mapeo: qué función vieja quedó dónde

| Antes (en `main.py`) | Ahora |
|---|---|
| `SECTIONS`, `SECTIONS_MAP`, `DOCS_DIR`, `CACHE_DIR`, `EXTENSIONS_VALIDAS` | `config/settings.py` |
| CORS `allow_origins=["*"]` | `config/settings.py` → `ALLOWED_ORIGINS` (ver "Qué cambió de verdad" abajo) |
| `leer_meta()` | `infra/repository.py` |
| `doc_info()` | `core/documents.py` |
| `convertir_docx()` | `infra/docx_converter.py` |
| Lógica de matching en `buscar()` | `core/search.py` (`evaluar_metadata`, `matchea_contenido`) |
| `@app.get("/api/sections")` | `app/routers/sections.py` |
| `@app.get("/api/sections/{id}")` | `app/routers/sections.py` |
| `@app.get("/api/render/...")` | `app/routers/documents.py` |
| `@app.get("/api/file/...")` | `app/routers/documents.py` |
| `@app.get("/api/cache/...")` / `DELETE` | `app/routers/cache.py` |
| `@app.get("/api/search")` | `app/routers/search.py` |
| `@app.get("/")` (sirve `index.html`) | `app/main.py` |

**Ningún endpoint cambió de URL.** El frontend no necesita ningún cambio —
probé cada ruta con `TestClient` antes de mandarte esto.

## Qué cambió de verdad (no es solo reorganizar carpetas)

1. **Path traversal arreglado.** `core/paths.py` tiene la función
   `resolver_ruta_segura()` que ahora usan `documents.py` y `cache.py` antes
   de tocar cualquier archivo. Un intento de `../../../etc/passwd` ahora da
   `404`, antes servía el archivo. Test que lo prueba:
   `tests/test_paths.py`.

2. **CORS ya no es `["*"]`.** Por defecto ahora solo permite
   `http://localhost:5173` (tu Vite dev). En producción, seteá la variable
   de entorno `WIKI_ALLOWED_ORIGINS` con la URL real de tu wiki:
   ```
   WIKI_ALLOWED_ORIGINS=https://wiki.tuempresa.internal
   ```
   Si no la seteás, en producción vas a tener el mismo problema de CORS que
   tenías en desarrollo con Vite al principio — no es opcional, hay que
   configurarla antes de deployar.

3. **La búsqueda ya no re-lee contenido de más.** Está separada en
   `evaluar_metadata()` (gratis, en memoria) y `matchea_contenido()` (lee el
   archivo, se llama solo si la metadata no alcanzó) — mismo comportamiento
   que el original, pero ahora es explícito y testeable por separado.

## Lo que NO toqué (a propósito)

- `docx2pdf` sigue siendo síncrono/bloqueante — lo dejé documentado en
  `infra/docx_converter.py` como algo a resolver más adelante si se vuelve
  un problema real, pero cambiarlo ahora hubiera sido un cambio de
  comportamiento (async/background tasks) mezclado con la reestructuración,
  y son dos cosas distintas. Mejor un PR aparte para eso.
- No agregué autenticación. Sigue siendo una decisión de equipo, no algo
  que yo deba resolver en silencio.

## Cómo lo subirías (con el flujo de ramas que ya definiste)

```bash
git checkout dev
git pull origin dev
git checkout -b refactor/backend-config-core-infra-app

# copiar los archivos de este paquete sobre tu repo

git add .
git commit -m "refactor(backend): reestructura en config/core/infra/app

Para: alinear el backend con el patron de arquitectura ya documentado
en la wiki, y resolver path traversal + CORS abierto de paso."

git push -u origin refactor/backend-config-core-infra-app
# abrir PR a dev — es un cambio grande, pedí revisión aunque sea de vos mismo en otro momento
```
