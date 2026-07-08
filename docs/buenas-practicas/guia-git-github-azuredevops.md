---
titulo: Guía Profesional de Git, GitHub y Azure DevOps
categoria: buenas-practicas/git-github-azuredevops
tipo_documento: Guía de mejores prácticas
enfoque: Tech Lead / Project Lead / Scrum Master
fecha: 28 de junio de 2026
autor: Leonardo Caracciolo
clasificacion: uso interno
relacionados:
  - buenas-practicas/metodologia-agil/ciclo-vida-proyecto-agil.md
  - buenas-practicas/arquitectura/arquitectura-proyectos-python-csharp.md
---

> **⚠️ Conflicto sin resolver (agregado al organizar la wiki):** esta guía
> documenta un flujo de ramas **sin** `release/*` (`main` → `dev` →
> `feature/bugfix/hotfix`). El documento `ciclo-vida-proyecto-agil.md`
> (Sección A) documenta un Git Flow **con** rama `release/*` (`main` →
> `develop` → `feature/release/hotfix/bugfix`). Son dos estrategias
> distintas — definir cuál es la oficial y dejar solo esa antes de que el
> equipo empiece a mezclarlas.

Comandos, ramas, workflow de versiones, commits y Pull Requests.

## Idea central

Git no es solo guardar código: es una forma de coordinar trabajo, proteger ramas estables, revisar cambios y dejar trazabilidad técnica para el equipo.

## Modelo mental de Git

```
Working Directory → Staging Area → Local Repo → Remote
  (archivos que      (git add)      (commits en    (GitHub /
   estás editando)                   tu máquina)     Azure Repos)
```

## Qué vas a encontrar en esta guía

1. **Comandos** básicos, intermedios y avanzados: significado y casos de uso.
2. **Branches** — nomenclatura recomendada: `main`, `dev`, `feature`, `bugfix`, `hotfix`.
3. **Workflow** — flujo visual: `feature` → `dev` → `main` + tag de versión.
4. **Commits** — buenas prácticas, Conventional Commits y el "para qué".
5. **PR/MR** — buenas prácticas para crear, revisar y aprobar cambios en GitHub y Azure DevOps.

---

## 1. Comandos Git básicos

Cubren el ciclo mínimo de trabajo: crear o clonar repo, revisar cambios, preparar archivos, commitear y sincronizar con remoto.

| Comando | Significado | Cuándo usarlo |
|---|---|---|
| `git config --global user.name "Nombre"` | Configura el nombre que aparecerá en tus commits. | Al instalar Git por primera vez o en una nueva PC. |
| `git config --global user.email "mail"` | Configura el email asociado a tus commits. | Debe coincidir con tu cuenta de GitHub/Azure para trazabilidad correcta. |
| `git init` | Inicializa un repositorio Git en una carpeta existente. | Cuando arrancás un proyecto local sin control de versiones. |
| `git clone <url>` | Copia un repositorio remoto a tu máquina. | Cuando te sumás a un proyecto ya existente. |
| `git status` | Muestra archivos modificados, staged, no trackeados y rama actual. | Antes de `add`, `commit`, `pull` o `push`. El comando de chequeo más importante. |
| `git add <archivo>` | Agrega un archivo al staging area. | Cuando querés preparar solo ciertos cambios para el próximo commit. |
| `git add .` | Agrega todos los cambios actuales al staging area. | Útil cuando todo lo modificado pertenece a la misma idea de commit. |
| `git restore <archivo>` | Descarta cambios locales no confirmados en un archivo. | Cuando tocaste algo por error y querés volver al último commit. |
| `git restore --staged <archivo>` | Quita un archivo del staging sin borrar el cambio. | Cuando agregaste algo con `add` pero no querés incluirlo en ese commit. |
| `git commit -m "mensaje"` | Guarda los cambios preparados en el historial local. | Cuando terminaste una unidad pequeña de trabajo y querés dejar trazabilidad. |
| `git log --oneline` | Muestra historial resumido de commits. | Para revisar últimos cambios o encontrar un commit rápidamente. |
| `git diff` | Muestra cambios no staged. | Antes de hacer `add` para revisar qué modificaste. |
| `git diff --staged` | Muestra cambios preparados para commit. | Antes de confirmar, para validar exactamente qué va a entrar. |
| `git remote -v` | Lista repositorios remotos configurados. | Cuando querés verificar a qué URL estás haciendo push/pull. |
| `git remote add origin <url>` | Asocia tu repo local a un remoto llamado `origin`. | Cuando creaste el repo local y luego lo vinculaste a GitHub/Azure. |
| `git fetch` | Descarga cambios remotos sin mezclarlos en tu rama. | Cuando querés ver qué hay nuevo sin modificar tu trabajo actual. |
| `git pull` | Descarga y fusiona cambios remotos en la rama actual. | Cuando necesitás actualizar tu rama con lo último del remoto. |
| `git push -u origin <branch>` | Sube la rama al remoto y deja tracking configurado. | La primera vez que publicás una rama nueva. |

## 1b. Comandos Git intermedios

Aparecen cuando ya trabajás en equipo: ramas, integración, sincronización, stashes y versiones.

| Comando | Significado | Cuándo usarlo |
|---|---|---|
| `git branch` | Lista ramas locales. | Para ver dónde estás trabajando y qué ramas existen localmente. |
| `git switch <branch>` | Cambia a otra rama. | Recomendado para moverte entre ramas de forma clara. |
| `git switch -c <branch>` | Crea una rama y cambia a ella. | Alternativa moderna a `git checkout -b`. |
| `git checkout -b <branch>` | Crea y cambia a una nueva rama. | Muy usado; equivalente histórico para crear ramas de trabajo. |
| `git merge <branch>` | Fusiona otra rama en la rama actual. | Cuando querés integrar `feature` → `dev` o `dev` → `main`. |
| `git rebase <branch>` | Reaplica tus commits sobre otra base. | Para mantener historial lineal antes de abrir PR. Cuidado si la rama ya es compartida. |
| `git pull --rebase` | Actualiza tu rama poniendo tus commits arriba de lo remoto. | Útil para evitar merges innecesarios en ramas personales. |
| `git stash push -m "mensaje"` | Guarda temporalmente cambios no commiteados. | Cuando necesitás cambiar de rama sin perder trabajo incompleto. |
| `git stash list` | Lista stashes guardados. | Cuando tenés varios cambios temporales y querés elegir cuál recuperar. |
| `git stash apply` | Aplica un stash sin eliminarlo de la lista. | Más seguro que `pop` si querés probar recuperar cambios. |
| `git stash pop` | Aplica el último stash y lo elimina. | Cuando estás seguro de recuperar y limpiar el stash. |
| `git tag -a v1.0.0 -m "mensaje"` | Crea un tag anotado de versión. | Para marcar una versión estable desplegable. |
| `git push origin --tags` | Sube tags locales al remoto. | Después de crear una versión, para que todo el equipo la vea. |
| `git revert <commit>` | Crea un nuevo commit que deshace otro. | Recomendado en ramas compartidas porque no reescribe historial. |
| `git reset --soft <commit>` | Vuelve a un commit manteniendo cambios staged. | Cuando querés rehacer commits locales sin perder el trabajo. |
| `git reset --hard <commit>` | Vuelve a un commit descartando cambios. | Solo si estás seguro. Riesgoso: puede borrar trabajo local. |
| `git branch -d <branch>` | Elimina una rama local ya fusionada. | Después de mergear un PR, para limpiar el entorno. |
| `git push origin --delete <branch>` | Elimina una rama remota. | Después de completar y mergear una feature/bugfix. |

## 1c. Comandos Git avanzados

Sirven para limpieza de historial, investigación, recuperación, repos grandes y escenarios complejos. Usarlos con criterio y comunicar cuando pueden alterar historia compartida.

| Comando | Significado | Cuándo usarlo |
|---|---|---|
| `git add -p` | Permite agregar cambios por bloques. | Cuando un archivo tiene cambios de distintas tareas y querés commits atómicos. |
| `git commit --amend` | Modifica el último commit. | Para corregir mensaje o sumar un archivo olvidado antes de pushear. |
| `git rebase -i HEAD~3` | Rebase interactivo para editar, unir o reordenar commits. | Para limpiar historial de una rama personal antes de PR. |
| `git cherry-pick <commit>` | Aplica un commit específico en tu rama actual. | Para traer un fix puntual sin mergear toda la rama origen. |
| `git reflog` | Muestra movimientos de HEAD y referencias locales. | Para recuperar commits perdidos tras `reset`/`rebase`/`checkout`. |
| `git log --graph --decorate --all --oneline` | Historial visual de ramas y merges. | Para entender divergencias, merges y estructura del repo. |
| `git blame <archivo>` | Muestra qué commit/autor modificó cada línea. | Para investigar el origen de una línea o cambio crítico. |
| `git bisect` | Búsqueda binaria del commit que introdujo un bug. | Cuando sabés que antes funcionaba y ahora falla, pero no desde cuándo. |
| `git grep "texto"` | Busca texto dentro del repo versionado. | Para localizar funciones, variables o TODOs rápidamente. |
| `git clean -fd` | Elimina archivos no trackeados. | Para limpiar outputs temporales. Usar primero `git clean -n` para simular. |
| `git worktree add ../ruta <branch>` | Permite tener otra rama en otra carpeta del mismo repo. | Útil para revisar un hotfix mientras seguís en tu feature. |
| `git submodule add <url>` | Agrega otro repositorio como dependencia versionada. | Cuando un proyecto necesita incluir otro repo con versión fija. |
| `git lfs track "*.zip"` | Versiona archivos grandes mediante Git LFS. | Para binarios grandes que no conviene guardar directo en Git. |
| `git sparse-checkout set <ruta>` | Descarga/trabaja solo una parte del repo. | Para monorepos grandes donde no necesitás todo el contenido. |
| `git shortlog -sn` | Resume commits por autor. | Para reportes rápidos de actividad histórica. |
| `git rerere` | Recuerda resoluciones de conflictos repetidos. | Útil en ramas largas con conflictos recurrentes. |

---

## 2. Nomenclatura de branches

**Regla:** `main` siempre desplegable; `dev` integra; las ramas cortas nacen, se revisan por PR/MR y se eliminan al terminar.

| Rama | Significado | Regla de uso |
|---|---|---|
| `main` | Siempre estable, versión desplegable. | No trabajar directo. Proteger con PR, aprobaciones y validaciones. |
| `dev` | Integración de features antes de pasar a `main`. | Base de trabajo para features y bugfixes. Debe mantenerse lo más estable posible. |
| `feature/<nombre>` | Nueva funcionalidad. | Nace desde `dev` y vuelve a `dev` por PR/MR. |
| `bugfix/<nombre>` | Corrección sobre `dev`. | Para bugs detectados en integración, QA o desarrollo. |
| `hotfix/<nombre>` | Arreglo urgente sobre `main`. | Nace desde `main`, vuelve a `main` por PR/MR y después se sincroniza hacia `dev`. |

### Formato recomendado

```
<tipo>/<ticket-opcional>-<descripcion-corta>
```

Ejemplos:
```
feature/ado-123-control-totales
bugfix/ado-245-filtro-linea-servicio
hotfix/prod-cuit-null
```

- Usar minúsculas, guiones medios y nombres descriptivos: `feature/control-totales`.
- Evitar espacios, acentos, nombres personales o ramas genéricas como `cambios-final`.
- Incluir ID de Azure Boards/Jira si existe: mejora trazabilidad con User Story, Bug o Task.
- Mantener ramas cortas: cuanto más vive una rama, más probables son los conflictos.
- Eliminar la rama después del merge para mantener limpio el repositorio.

---

## 3. Workflow de versiones: feature → dev → main

En GitHub se gestiona con Pull Requests; en Azure DevOps con Pull Requests y Branch Policies.

```
1. Pull dev (base actualizada)
2. Crear rama feature/nombre
3. Commits pequeños + atómicos
4. Push a rama remota
5. PR/MR a dev → revisión + CI
6. dev estable → QA/integración
7. main + tag vX.Y.Z
```

### Paso a paso con comandos

```bash
# 1) Partir de dev
git checkout dev
git pull origin dev

# 2) Crear rama de trabajo
git checkout -b feature/nueva-funcionalidad

# 3) Programar, revisar y hacer commits pequeños
git status
git add .
git commit -m "feat: agrega control de totales"

# 4) Subir la rama
git push -u origin feature/nueva-funcionalidad

# 5) Crear PR/MR hacia dev, revisar y hacer merge

# 6) Cuando dev está estable, integrar a main
git checkout main
git pull origin main
git merge dev
git push origin main

# 7) Tag de versión
git tag -a v1.0.0 -m "Primera version estable"
git push origin --tags
```

> **Recomendación profesional:** aunque el ejemplo muestra merge por consola, en entornos de equipo conviene que `dev` → `main` también pase por PR/MR con aprobaciones, build validation y comentarios resueltos.

## 3b. Flujo de hotfix urgente

```bash
git checkout main
git pull origin main
git checkout -b hotfix/corrige-login-prod

# corregir, testear y commitear
git add .
git commit -m "fix(auth): corrige login en produccion"
git push -u origin hotfix/corrige-login-prod

# PR/MR a main, merge, tag y luego sincronizar a dev
git checkout dev
git pull origin dev
git merge main
git push origin dev
```

> **Criterio Tech Lead:** un hotfix debe ser mínimo, probado y trazable. No mezclar mejoras o refactors en una rama urgente de producción.

---

## 4. Buenas prácticas de commits

**Regla clave:** un commit = una idea. Si el cambio no se puede explicar con una frase clara, probablemente está mezclando demasiadas cosas.

### Formato recomendado

```
<tipo>(scope opcional): <que se hizo>
Para: <para que sirve el cambio / que problema resuelve>
```

Ejemplo:
```
feat(reportes): agrega control de totales
Para: detectar diferencias antes de publicar el reporte y evitar salidas inconsistentes.
```

| Tipo | Uso | Ejemplo |
|---|---|---|
| `feat` | Nueva funcionalidad. | `feat(ventas): agrega validacion de CUIT` |
| `fix` | Corrección de bug. | `fix(filtros): evita valores en blanco` |
| `refactor` | Cambio interno sin alterar comportamiento. | `refactor(ocr): simplifica lectura de archivos` |
| `docs` | Documentación. | `docs(readme): agrega pasos de instalacion` |
| `test` | Pruebas unitarias/integración. | `test(api): cubre validacion de totales` |
| `chore` | Tareas de mantenimiento. | `chore(deps): actualiza dependencias` |
| `perf` | Mejora de performance. | `perf(query): reduce tiempo de consulta` |
| `ci` | Cambios en pipelines/CI. | `ci(azure): agrega build validation` |

### Evitar mensajes pobres

| Evitar | Mejor | Excelente (con "para qué") |
|---|---|---|
| `fix final` | `fix(filtros): corrige linea de servicio` | `fix(filtros): corrige linea de servicio` — Para: evitar que el tablero muestre registros en blanco al filtrar. |
| `cambios varios` | `feat(reportes): agrega control de totales` | `feat(reportes): agrega control de totales` — Para: detectar diferencias entre input y output antes de enviar el reporte. |
| `update` | `docs(git): documenta flujo feature-dev-main` | `docs(git): documenta flujo feature-dev-main` — Para: estandarizar la forma de trabajo del equipo. |

---

## 5. Checklist antes de cada push

| # | Comando / acción | Objetivo |
|---|---|---|
| 1 | `git status` | Confirmar que no hay archivos olvidados o cambios no deseados. |
| 2 | `git diff` / `git diff --staged` | Revisar exactamente qué vas a commitear. |
| 3 | Ejecutar tests / lint / validaciones | No enviar código que rompe build o pruebas básicas. |
| 4 | `git pull --rebase origin dev` | Actualizar tu rama personal con la base más reciente. |
| 5 | `git push -u origin feature/<nombre>` | Publicar la rama para abrir PR/MR. |

### Buenas prácticas resumidas

- Commits pequeños y atómicos: una idea por commit.
- Mensajes consistentes con Conventional Commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`.
- Agregar el "para qué" cuando el impacto no sea obvio: facilita revisión y auditoría.
- No commitear secretos, credenciales, archivos temporales, outputs pesados o datos sensibles.
- No usar mensajes como "fix final", "cambio varios" o "actualización".
- No reescribir historial de ramas compartidas sin acordarlo con el equipo.

---

## 6. Mejores prácticas para Pull Requests / Merge Requests

Un PR/MR es una unidad de colaboración: propone un cambio, permite revisarlo, ejecuta validaciones y deja trazabilidad. En Scrum debería estar vinculado a una User Story, Bug o Task y cumplir la Definition of Done.

### Ciclo de vida de un PR/MR

```
Crear (rama pequeña + descripción clara)
  → Validar (tests, lint, build, seguridad)
  → Revisar (comentarios + mejoras)
  → Aprobar (reviewers + políticas)
  → Merge (historial limpio + rama borrada)
```

### Descripción recomendada del PR/MR

```
Título: feat(reportes): agrega control de totales

Qué cambió:
- Agrega validación entre input y output.
- Muestra diferencias antes de generar el archivo final.

Para qué sirve:
- Evita entregar reportes con totales inconsistentes.

Cómo probar:
1. Ejecutar el proceso con el archivo de prueba.
2. Verificar que el control detecte diferencias.
3. Confirmar que el output se genera solo si pasa la validación.

Impacto / riesgos:
- Impacta solamente el módulo de reportes.
- No modifica la estructura del input.
```

### Crear, revisar y aprobar PR/MR

| Momento | Mejor práctica | Criterio profesional |
|---|---|---|
| Antes de crear | Actualizar rama base, ejecutar tests, revisar diff, borrar logs/debug. | El reviewer no debería encontrar errores obvios que el autor pudo detectar antes. |
| Título | Título claro y consistente, idealmente con Conventional Commits. | Permite entender impacto desde la lista de PRs y generar changelog. |
| Descripción | Incluir qué cambió, para qué, cómo probar, riesgos y capturas si aplica. | Reduce ida y vuelta y acelera la revisión. |
| Trazabilidad | Linkear Work Item/Bug/User Story. | Conecta código con backlog, sprint y criterios de aceptación. |
| Tamaño | Mantener PRs pequeños y enfocados. | Un PR gigante tarda más, se revisa peor y aumenta riesgo de bugs. |
| CI/CD | No aprobar si fallan build, tests, lint o escaneos obligatorios. | La automatización protege la rama estable. |
| Review | Comentar con respeto, foco en código y criterio técnico. | El objetivo es mejorar calidad y compartir conocimiento, no ganar discusiones. |
| Cambios pedidos | Responder comentarios, aplicar ajustes y pedir re-review. | No resolver conversaciones sin explicar qué se corrigió. |
| Aprobación | Requiere reviewers definidos y comentarios resueltos. | Para `main`/`dev` conviene usar branch protection/policies. |
| Merge | Usar estrategia definida por el equipo: merge, squash o rebase. | La consistencia del historial importa más que la preferencia individual. |
| Post-merge | Eliminar rama y verificar que `dev`/`main` siguen verdes. | Mantiene el repo ordenado y evita ramas obsoletas. |

### Políticas recomendadas en GitHub / Azure DevOps

- Proteger `main` y, si el equipo lo necesita, también `dev`.
- Requerir mínimo 1 o 2 aprobaciones según criticidad del repositorio.
- Requerir build validation / status checks en verde antes del merge.
- Requerir resolución de comentarios antes de completar el PR.
- Requerir Work Item vinculado cuando el equipo trabaje con Azure Boards.
- Agregar reviewers automáticos por carpeta o módulo cuando haya ownership técnico.
- Limitar tipos de merge si se quiere mantener historial lineal o squash por feature.

---

## 7. Checklists finales

### Checklist del autor del PR

- [ ] La rama nace desde `dev` o `main` según corresponda.
- [ ] El PR tiene título claro y descripción con qué, para qué y cómo probar.
- [ ] Los commits son pequeños, atómicos y con mensajes consistentes.
- [ ] No hay credenciales, archivos temporales ni datos sensibles.
- [ ] Tests/lint/build ejecutados localmente o por pipeline.
- [ ] Work Item / User Story / Bug vinculado.
- [ ] Capturas, evidencia o logs agregados si aplica.

### Checklist del reviewer

- [ ] El cambio cumple el objetivo funcional y criterios de aceptación.
- [ ] La solución es mantenible, legible y no duplica lógica innecesaria.
- [ ] Hay manejo de errores, validaciones y casos borde razonables.
- [ ] No introduce riesgos de seguridad, secretos o exposición de datos.
- [ ] Las pruebas cubren lo importante o se justifica por qué no aplican.
- [ ] Los comentarios fueron respondidos y resueltos correctamente.
- [ ] CI/CD está en verde antes de aprobar.

### Reglas de oro del equipo

- `main` debe estar siempre desplegable.
- Nadie trabaja directo sobre `main`.
- Todo cambio relevante entra por PR/MR.
- Un PR sin descripción obliga al reviewer a adivinar; eso es deuda de comunicación.
- El "para qué" del cambio es tan importante como el "qué se hizo".
- Las políticas de rama no son burocracia: son control de calidad automatizado.

---

## Resumen rápido para pegar en el README del equipo

```bash
# Flujo diario
git checkout dev
git pull origin dev
git checkout -b feature/ado-123-descripcion-corta

# Trabajar
git status
git diff
git add .
git commit -m "feat(scope): describe que se hizo"

# Subir y abrir PR
git push -u origin feature/ado-123-descripcion-corta
```

```
# Commit recomendado
feat(scope): agrega control de totales
Para: detectar inconsistencias antes de publicar el reporte.

# Ramas
main              # estable / desplegable
dev               # integracion
feature/<nombre>  # nueva funcionalidad
bugfix/<nombre>   # fix sobre dev
hotfix/<nombre>   # fix urgente sobre main
```

---

## Fuentes y referencias consultadas

- Documentación de GitHub sobre Pull Requests y revisiones de código.
- Documentación de Microsoft Learn sobre Azure Repos, Pull Requests y Branch Policies.
- Especificación de Conventional Commits 1.0.0 para estructura de mensajes de commit.
