@echo off
REM ═══════════════════════════════════════════════════════════
REM  setup.bat — Inicializa la wiki BPS completa
REM  Ejecutar desde: C:\Users\Usuario\Documents\docshub\
REM ═══════════════════════════════════════════════════════════

echo.
echo  Wiki BPS — Setup
echo  ================
echo.

echo [1/4] Creando estructura de carpetas docs/...

mkdir docs 2>nul
mkdir docs\python 2>nul
mkdir docs\csharp 2>nul
mkdir docs\vba 2>nul
mkdir docs\sql 2>nul
mkdir docs\testing 2>nul
mkdir docs\github 2>nul
mkdir docs\metodologias 2>nul
mkdir docs\cookiecutter 2>nul
mkdir docs\buenas-practicas 2>nul
mkdir docs\patrones 2>nul
mkdir docs\arquitectura 2>nul
mkdir cache 2>nul

echo [2/4] Moviendo docs existentes a sus secciones...

REM ── PYTHON ──────────────────────────────────────────────────
if exist "pandas_referencia.html"                  move /Y "pandas_referencia.html"                  docs\python\ >nul 2>&1
if exist "scraping_playwright_bs4_selenium.html"   move /Y "scraping_playwright_bs4_selenium.html"   docs\python\ >nul 2>&1
if exist "dax_referencia_powerbi.html"             move /Y "dax_referencia_powerbi.html"             docs\python\ >nul 2>&1

REM ── C# ───────────────────────────────────────────────────────
if exist "documentacion_CSharp_Python.html"        move /Y "documentacion_CSharp_Python.html"        docs\csharp\ >nul 2>&1
if exist "documentacion_CSharp_Python_.html"       move /Y "documentacion_CSharp_Python_.html"       docs\csharp\ >nul 2>&1

REM ── VBA ──────────────────────────────────────────────────────
if exist "doc_demo_vba_csharp (1).html"            move /Y "doc_demo_vba_csharp (1).html"            docs\vba\ >nul 2>&1
if exist "doc_demo_vba_csharp.html"                move /Y "doc_demo_vba_csharp.html"                docs\vba\ >nul 2>&1

REM ── SQL ──────────────────────────────────────────────────────
if exist "referencia-sql.html"                     move /Y "referencia-sql.html"                     docs\sql\ >nul 2>&1

REM ── TESTING ──────────────────────────────────────────────────
if exist "docs_dev-analista_qa.html"               move /Y "docs_dev-analista_qa.html"               docs\testing\ >nul 2>&1
if exist "Documentacion_y_Testings.html"           move /Y "Documentacion_y_Testings.html"           docs\testing\ >nul 2>&1
if exist "testing_CSharp_Python_VBA.html"          move /Y "testing_CSharp_Python_VBA.html"          docs\testing\ >nul 2>&1

REM ── GITHUB ───────────────────────────────────────────────────
if exist "guia-github.html"                        move /Y "guia-github.html"                        docs\github\ >nul 2>&1

REM ── METODOLOGÍAS ─────────────────────────────────────────────
if exist "metodologias.html"                       move /Y "metodologias.html"                       docs\metodologias\ >nul 2>&1
if exist "FODA (1).docx"                           move /Y "FODA (1).docx"                           docs\metodologias\ >nul 2>&1

REM ── COOKIECUTTER ─────────────────────────────────────────────
if exist "guia-cookiecutter.html"                  move /Y "guia-cookiecutter.html"                  docs\cookiecutter\ >nul 2>&1

REM ── BUENAS PRÁCTICAS ─────────────────────────────────────────
if exist "buenas_practicas.html"                   move /Y "buenas_practicas.html"                   docs\buenas-practicas\ >nul 2>&1
if exist "recursos_proyecto.html"                  move /Y "recursos_proyecto.html"                  docs\buenas-practicas\ >nul 2>&1
if exist "recursos_proyecto_ES.html"               move /Y "recursos_proyecto_ES.html"               docs\buenas-practicas\ >nul 2>&1
if exist "unified_docs (1).html"                   move /Y "unified_docs (1).html"                   docs\buenas-practicas\ >nul 2>&1
if exist "PDD_Template.docx"                       move /Y "PDD_Template.docx"                       docs\buenas-practicas\ >nul 2>&1
if exist "SDD_Template (2).docx"                   move /Y "SDD_Template (2).docx"                   docs\buenas-practicas\ >nul 2>&1

REM ── PATRONES ─────────────────────────────────────────────────
if exist "patrones-diseno.html"                    move /Y "patrones-diseno.html"                    docs\patrones\ >nul 2>&1

REM ── ARQUITECTURA ─────────────────────────────────────────────
if exist "tipos-arquitectura.html"                 move /Y "tipos-arquitectura.html"                 docs\arquitectura\ >nul 2>&1

echo [3/4] Instalando dependencias del frontend React...
cd wiki-bps
call npm install
cd ..

echo [4/4] Todo listo.
echo.
echo  Para iniciar la wiki:
echo  ─────────────────────────────────────
echo  Terminal 1 (backend):
echo    uvicorn main:app --reload
echo.
echo  Terminal 2 (frontend):
echo    cd wiki-bps
echo    npm run dev
echo.
echo  Abrir en el browser:
echo    http://localhost:5173
echo  ─────────────────────────────────────
echo.
pause
