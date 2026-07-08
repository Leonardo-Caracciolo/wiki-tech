---
titulo: Ciclo de Vida de Proyectos — Metodología Ágil
categoria: buenas-practicas/metodologia-agil
tipo_documento: Guía de mejores prácticas
version: 5.0
fecha: Junio 2026
autor: Equipo de Automatización
equipo: RPA / TaxTec
clasificacion: uso interno
relacionados:
  - buenas-practicas/qa-agil/mejores-practicas-agiles-qa.md
  - buenas-practicas/git-github-azuredevops/guia-git-github-azuredevops.md
---

> **Nota de mantenimiento (agregada al organizar la wiki):**
> Este documento y `mejores-practicas-agiles-qa.md` cubren ambos "agile + QA" con
> enfoques distintos: este es el mapa completo del ciclo de vida (fases 0-7);
> el otro es el detalle operativo de cómo se ejecuta el día a día del sprint
> (estados de la User Story, bug tracking, configuración del Board). Se
> mantienen separados a propósito — no son duplicados, son dos niveles de zoom.
> Si notás que algo queda desactualizado en uno y no en el otro (ej. duración
> de ceremonias), es momento de unificarlos.
>
> **⚠️ Conflicto sin resolver:** la Sección A de este documento define un Git
> Flow con rama `release/*` (main → develop → feature/release/hotfix/bugfix).
> La guía de `git-github-azuredevops` documenta un flujo más simple sin rama
> `release` (main → dev → feature/bugfix/hotfix). Son dos estrategias
> distintas — hay que decidir cuál es la oficial del equipo y dejar solo esa.

# **ESTRUCTURA DEL PROYECTO ÁGIL**

En metodología ágil (Scrum), el proyecto no es una secuencia lineal única. Las fases de Ejecución se repiten en ciclos (sprints). El Sprint Review, la Retrospectiva y el Refinamiento son ceremonias dentro de cada sprint.

| **FASE** | **NOMBRE Y ENTREGABLE CLAVE** |
| --- | --- |
| **FASE 0** | Kick Off — Acta firmada + Azure DevOps configurado |
| **FASE 1** | Relevamiento — PDD preliminar + Flujo AS-IS/TO-BE |
| **FASE 2** | Planificación — PDD final + BDD + Backlog + DoD + RACI |
| **FASE 3** | Ejecución (sprints) — Planning → Dev → Review → Retro (×N) |
| **FASE 4** | QA / Testing Final — UAT + Sign-off de calidad |
| **FASE 5** | Deploy / Entrega — SDD + Acta de Entrega firmada |
| **FASE 6** | Retrospectiva Final — Lecciones aprendidas del proyecto |
| **FASE 7** | Cierre Formal — Archivado + liberación de recursos |

# **SECCIONES TRANSVERSALES**

| **SECCIÓN** | **CONTENIDO** |
| --- | --- |
| **Manifiesto Ágil** | 4 valores + 12 principios aplicados al contexto Deloitte |
| **A — Git Flow** | Estrategia de ramas, naming, commits, versionado semántico |
| **B — BDD** | Behavior Driven Development con Gherkin / pytest-bdd |
| **C — Arquitecturas** | Clean Architecture, Hexagonal, patrones de diseño |
| **D — Transversales** | Riesgos, NFRs, ambientes, dependencias, handoff |

# **LÍNEA DE TIEMPO Y PARTICIPANTES**

## **Ciclo de Vida del Proyecto — Metodología Ágil**

| **0** | **→** | **1** | **→** | **2** | **→** | **3** | **→** | **4** | **→** | **5** | **→** | **6** | **→** | **7** |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Kick** **Off** |  | **Releva-** **miento** |  | **Planifi-** **cación** |  | **Sprint** **(×N)** |  | **QA** **Final** |  | **Deploy** **Entrega** |  | **Retro** **Final** |  | **Cierre** **Formal** |
| PO · PM SR · JR · QA |  | PO SR · JR · QA |  | PO SR · JR · QA |  | Ver detalle abajo |  | PO SR · JR · QA |  | PO · PM SR · JR · QA |  | SR · JR · QA |  | PO · PM SR · JR · QA |

| **🔄 Fase 3: **La fase de Ejecución (Sprint) se repite N veces hasta completar el backlog. Cada ciclo incluye Planning, Desarrollo, Refinamiento, Sprint Review y Retrospectiva de Sprint. |
| --- |

## **Detalle de Participantes — Ceremonias del Sprint (Fase 3)**

| **CEREMONIA (FASE 3)** | **PARTICIPANTES** |
| --- | --- |
| **Sprint Planning** | SR Dev · JR Dev · QA |
| **Daily Standup** | SR Dev · JR Dev · QA |
| **Refinamiento** | PO · SR Dev · JR Dev · QA |
| **Sprint Review** | PO · SR Dev · JR Dev · QA |
| **Retrospectiva de Sprint** | SR Dev · JR Dev · QA |

| **ℹ️ Roles: **PO = negocio, quien pide y aprueba. PM = gerentes Deloitte, visibilidad de hitos. SR Dev = desarrollador senior, líder técnico. JR Dev = 1 o 2 por proyecto. QA = valida calidad en todo el ciclo. |
| --- |

| **📋 Documentación: **No existe rol de funcional. La documentación es responsabilidad del desarrollador como parte de la DoD: docstrings, README, MkDocs y SDD. El que construye, documenta. |
| --- |

# **MANIFIESTO ÁGIL — BASE CONCEPTUAL**

## **Los Cuatro Valores**

El Manifiesto Ágil (2001) establece que si bien los elementos de la derecha tienen valor, los de la izquierda se valoran más.

| **SE VALORA MÁS** |  | **TIENE VALOR, PERO MENOS** |
| --- | --- | --- |
| **Individuos e interacciones** | **>** | Procesos y herramientas |
| **Software funcionando** | **>** | Documentación exhaustiva |
| **Colaboración con el cliente** | **>** | Negociación contractual |
| **Respuesta al cambio** | **>** | Seguir un plan |

## **Los Doce Principios**

Los principios del Manifiesto Ágil y su aplicación concreta en proyectos de automatización en Deloitte.

| **#** | **PRINCIPIO** | **APLICACIÓN EN NUESTRO CONTEXTO** |
| --- | --- | --- |
| **1** | Satisfacción del cliente mediante entrega continua y temprana de software con valor. | Entregar incrementos funcionales al PO al final de cada sprint, no esperar al final del proyecto. |
| **2** | Bienvenidos los cambios de requisitos, incluso en etapas tardías. | El backlog es vivo. El PO puede reordenar prioridades entre sprints. El control de cambios formal aplica solo a cambios de alcance, no de prioridad. |
| **3** | Entrega frecuente de software funcionando, en ciclos cortos. | Sprints de 2 semanas con un incremento desplegable al final. No 'casi listo'. |
| **4** | Negocio y desarrollo trabajan juntos a diario. | El PO participa en Refinamiento y Sprint Review. No desaparece entre el Kick Off y la entrega. |
| **5** | Proyectos con individuos motivados. Darles el entorno y la confianza para hacer el trabajo. | El SR Dev tiene autoridad para tomar decisiones técnicas sin necesitar aprobación en cada paso. |
| **6** | La comunicación cara a cara es el método más eficiente. | Daily Standup presencial o por videollamada. No reemplazable por mensajes de Teams. |
| **7** | El software funcionando es la medida principal de progreso. | El avance no se mide por documentos escritos ni tareas completadas, sino por incrementos desplegables. |
| **8** | Desarrollo sostenible: el equipo debe poder mantener un ritmo constante indefinidamente. | No sobrecargar sprints. Velocidad constante > velocidad alta que termina en burnout. |
| **9** | Atención continua a la excelencia técnica y al buen diseño. | TDD, BDD, Clean Architecture, SOLID y Git Flow no son opcionales. Son lo que sostiene la velocidad en el tiempo. |
| **10** | Simplicidad: el arte de maximizar la cantidad de trabajo no realizado. | No construir lo que el PO no pidió. No sobre-ingenierizar. La solución más simple que funciona es la correcta. |
| **11** | Las mejores arquitecturas emergen de equipos autoorganizados. | El SR Dev diseña la arquitectura. No se espera que un gerente tome decisiones técnicas. |
| **12** | El equipo reflexiona regularmente sobre cómo ser más efectivo y ajusta su comportamiento. | Retrospectivas de sprint con acciones concretas. Retrospectiva Final del proyecto completo. |

| **💡 Principio rector: **El Manifiesto Ágil no dice 'no documentar'. Dice que el software funcionando vale más que la documentación exhaustiva. La documentación necesaria (SDD, DoD, BDD, README) es parte de la definición de 'terminado'. |
| --- |

| **0** | **KICK OFF** |
| --- | --- |

## **Objetivo**

Alinear a todos los involucrados desde el primer momento. Se define el objetivo, el alcance macro y se configura la infraestructura del proyecto.

| **👥 Participantes: **PO · PM · SR Dev · JR Dev · QA |
| --- |

## **Acta de Kick Off (Word)**

- Objetivo del proyecto en una oración medible y verificable.

- Alcance macro: qué está IN y qué está OUT. Si no figura, está OUT.

- Equipo asignado con roles y responsabilidades claros.

- Cronograma macro: cantidad estimada de sprints y fecha de entrega objetivo.

- Cadencia de sprints: duración (2 semanas), día de inicio, día de Review.

- Canal de comunicación único: canal de Teams dedicado. No DMs dispersos.

- Primer registro de riesgos con probabilidad e impacto.

- Firmas del SR Dev, PO y PM.

## **Azure DevOps: Configuración Inicial**

- Crear la Épica del proyecto con descripción completa y objetivo.

- Invitar a todos los integrantes con roles correctos.

- Configurar el board: To Do / In Progress / In Review / Testing / Done.

- Crear el repositorio Git con estructura base y protecciones de rama.

| **✅ Manifiesto Ágil: **Principio 4: negocio y desarrollo trabajan juntos. El Kick Off no es una reunión de gerencia que luego se le comunica al equipo. Es una reunión de todos. |
| --- |

## **Checklist de Salida**

- **✓ **Acta de Kick Off firmada (PO + PM + SR Dev) y en SharePoint

- **✓ **Objetivo medible definido y acordado por todos

- **✓ **Cadencia de sprints definida y en calendario

- **✓ **Repositorio Git creado con ramas protegidas

- **✓ **Canal de Teams del proyecto creado

| **1** | **RELEVAMIENTO** |
| --- | --- |

## **Objetivo**

Entender en profundidad el proceso de negocio antes de diseñar la solución. El SR Dev trabaja con el PO para capturar requerimientos, casos borde y restricciones.

| **👥 Participantes: **PO · SR Dev · JR Dev · QA |
| --- |

## **Actividades Principales**

### **Relevamiento del Proceso**

- Mapear el proceso actual (AS-IS): cómo se hace hoy, paso a paso, con todas las variantes.

- Definir el proceso futuro (TO-BE): cómo debe funcionar con la automatización.

- Identificar todas las fuentes de datos: PDFs, Excel, APIs, sistemas internos.

- Documentar excepciones y casos borde: qué pasa cuando los datos son incorrectos, incompletos o ausentes.

- Validar la viabilidad técnica de cada requerimiento.

### **Artefactos del Relevamiento**

- PDD preliminar: contexto, problema, objetivos medibles, alcance IN/OUT, NFRs, riesgos.

- Flujo AS-IS documentado.

- Flujo TO-BE validado con el PO.

- Backlog inicial: Épicas, Features y User Stories de alto nivel sin estimar todavía.

| **⚠️ Punto crítico: **Todo lo que no se releva en esta fase aparecerá como cambio de alcance en plena ejecución. Preguntar siempre: '¿Hay algún caso donde esto no funcionaría?' |
| --- |

## **Checklist de Salida**

- **✓ **Proceso AS-IS documentado y validado con el PO

- **✓ **Proceso TO-BE definido y aprobado

- **✓ **PDD preliminar en SharePoint

- **✓ **Backlog inicial creado en Azure DevOps

- **✓ **Casos borde y excepciones documentados

| **2** | **PLANIFICACIÓN** |
| --- | --- |

## **Objetivo**

Convertir el relevamiento en un plan ejecutable. En ágil la planificación es continua: esta fase produce el plan inicial, no un plan cerrado.

| **👥 Participantes: **PO · SR Dev · JR Dev · QA |
| --- |

## **PDD Final — Project Design Document**

Versión definitiva, aprobada por PO y SR Dev antes de arrancar el Sprint 1.

- Contexto y problema de negocio (refinado post-relevamiento)

- Objetivos medibles con KPIs definidos

- Alcance detallado: qué entra, qué no entra, qué queda para una segunda fase

- NFRs: performance, seguridad, disponibilidad, escalabilidad

- Dependencias externas: accesos, APIs de terceros, datos, licencias

- Riesgos con plan de mitigación

- Arquitectura y patrones seleccionados con justificación (ver Sección C)

- Criterios de aceptación de alto nivel — base para los escenarios BDD (ver Sección B)

## **Azure DevOps: Jerarquía del Backlog**

| **NIVEL** | **QUÉ REPRESENTA** | **MEJOR PRÁCTICA** |
| --- | --- | --- |
| **Épica** | Objetivo de negocio de alto nivel | Una por proyecto. Ej: Automatización conciliación ARCA. |
| **Feature** | Capacidad funcional entregable | 3 a 8 por épica. Ej: Parsing PDFs EDICOM. |
| **User Story** | Funcionalidad desde perspectiva del usuario | Como [rol], quiero [acción], para [beneficio]. |
| **Task** | Tarea técnica concreta | Máx. 8 horas. Si supera, dividir. |

## **Estimación y Capacidad**

- Story Points con escala Fibonacci: 1, 2, 3, 5, 8, 13. Story de 13 = demasiado grande, dividir.

- Capacidad real = (días hábiles − feriados − reuniones) × horas productivas. Nunca 8hs completas.

- Reservar 20% de la capacidad para deuda técnica y bugs inesperados.

## **Definition of Done (DoD)**

Se define aquí. Aplica a TODAS las User Stories. Sin DoD, la story no entra al sprint.

- Código revisado por al menos un par (PR aprobado).

- Tests escritos y pasando: unitarios (TDD) y de comportamiento (BDD).

- Sin bugs críticos ni mayores abiertos.

- Documentación actualizada: docstring, README o MkDocs.

- Desplegado en staging, nunca solo en localhost.

- Guía de contexto para QA completa: flujo, datos de entrada, casos borde.

- Aceptado por el PO.

## **Matriz RACI**

| **DECISIÓN / ACTIVIDAD** | **ROL** | **RACI** |
| --- | --- | --- |
| **Aprobación de cambios de alcance** | PM + PO | A — Accountable |
| **Diseño de arquitectura** | SR Dev | R — Responsible |
| **Revisión de PRs** | SR Dev | R — Responsible |
| **Validación funcional (UAT)** | PO | A — Accountable |
| **Ejecución de tests** | SR Dev + JR Dev + QA | R — Responsible |
| **Firma de Acta de Entrega** | PO + PM | A — Accountable |
| **Comunicación de estado al negocio** | SR Dev | R — Responsible |
| **Decisión de deploy a producción** | SR Dev + PM | C — Consulted |

## **Checklist de Salida**

- **✓ **PDD final aprobado (PO + SR Dev) y en SharePoint

- **✓ **Backlog completo en Azure DevOps

- **✓ **DoD definida y comunicada a todo el equipo

- **✓ **Escenarios BDD escritos para las stories del Sprint 1

- **✓ **Sprint 1 planificado con capacidad calculada

| **3** | **EJECUCIÓN — CICLO DE SPRINTS** |
| --- | --- |

## **Objetivo**

Construir el software de forma incremental. La Fase 3 se repite en ciclos de 2 semanas hasta completar el backlog.

| **🔄 Ciclo por sprint: **Sprint Planning → Desarrollo + Daily Standup → Refinamiento → Sprint Review → Retrospectiva de Sprint → [siguiente sprint] |
| --- |

## **1. Sprint Planning**

| **👥 Participantes: **SR Dev · JR Dev · QA |
| --- |

- Duración máxima: 2 horas para un sprint de 2 semanas.

- Seleccionar stories según velocidad del equipo y capacidad real del sprint.

- Definir el Sprint Goal: una oración que describe el valor que entrega este sprint.

- Verificar que todas las stories tienen DoD y escenarios BDD definidos antes de arrancar.

## **2. Daily Standup**

| **👥 Participantes: **SR Dev · JR Dev · QA |
| --- |

- Máx. 15 minutos. Mismo horario todos los días.

- ¿Qué hice ayer? ¿Qué voy a hacer hoy? ¿Qué me bloquea?

- Los impedimentos se resuelven fuera del daily. El SR Dev los elimina en el día.

## **3. Desarrollo — TDD y Git Flow**

### **TDD — Test Driven Development**

Ciclo obligatorio para toda lógica de negocio: Red → Green → Refactor.

- **Red: **Escribir el test que falla. Define el comportamiento antes de implementar.

- **Green: **Mínimo código para que el test pase.

- **Refactor: **Limpiar manteniendo tests en verde. Aquí se aplican SOLID y Clean Code.

| **⚠️ No aplica TDD a: **Flujos UiPath ni UI scraping. Para esos, usar tests de integración al finalizar. |
| --- |

### **Flujo de PR**

- Rama por feature: feature/nombre. Nunca commitear directo a develop o main.

- PR con template: descripción, checklist de DoD, screenshots si aplica.

- Mínimo 1 aprobador. El autor no puede aprobarse a sí mismo.

- CI/CD debe pasar antes de habilitar el merge.

### **Estados en Azure DevOps**

| **ESTADO** | **CUÁNDO MOVER** |
| --- | --- |
| **To Do** | Task creada en planning. No se tocó. |
| **In Progress** | El dev comienza. Límite WIP: 2 tasks por persona. |
| **In Review** | PR abierto, esperando revisión. |
| **Testing** | Mergeado a develop, listo para QA en staging. |
| **Done** | DoD completa: tests pasando, QA aprobado, docs actualizada. |

## **4. Refinamiento del Backlog**

| **👥 Participantes: **PO · SR Dev · JR Dev · QA |
| --- |

- A mitad de sprint. Máx. 1 hora.

- Verificar criterios de aceptación y escenarios BDD de las stories a entrar.

- Estimar stories nuevas. Dividir stories grandes (13 puntos).

- El PO reordena prioridades si cambió el contexto de negocio.

## **5. Sprint Review**

| **👥 Participantes: **PO · SR Dev · JR Dev · QA |
| --- |

- Máx. 1 hora. Demo siempre sobre staging, nunca localhost.

- Cada desarrollador demuestra lo propio. Promueve ownership.

- Solo se presenta lo que está en Done. Si no pasó la DoD, no se muestra.

- Todo el feedback capturado en Azure DevOps como nuevas stories o ajustes.

| **ℹ️ Manifiesto Ágil: **Principio 7: el software funcionando es la medida de progreso. La Sprint Review es la demostración de ese progreso, no un informe de estado. |
| --- |

## **6. Retrospectiva de Sprint**

| **👥 Participantes: **SR Dev · JR Dev · QA |
| --- |

- Máx. 45 minutos. ¿Qué salió bien? ¿Qué no? ¿Qué mejoramos?

- Máximo 2–3 acciones concretas con responsable y fecha.

- Al inicio del siguiente planning, verificar si las acciones se aplicaron.

| **ℹ️ Manifiesto Ágil: **Principio 12: el equipo reflexiona regularmente sobre cómo ser más efectivo. La retro no es opcional ni una formalidad. |
| --- |

## **Checklist de Salida (por sprint)**

- **✓ **Todas las stories del sprint en estado Done

- **✓ **Tests unitarios y BDD pasando en CI/CD

- **✓ **Sprint Review realizada con PO presente

- **✓ **Feedback del PO capturado en Azure DevOps

- **✓ **Retrospectiva realizada con acciones definidas

- **✓ **Backlog del siguiente sprint refinado y estimado

| **4** | **QA / TESTING FINAL** |
| --- | --- |

## **Objetivo**

Validación formal antes del deploy. En ágil el testing es continuo durante la Fase 3. Esta fase es el cierre de calidad del producto completo.

| **👥 Participantes: **PO · SR Dev · JR Dev · QA |
| --- |

## **Pirámide de Testing**

| **CAPA** | **CUÁNDO Y CÓMO** |
| --- | --- |
| **Unit Testing** | Fase 3, en cada story. pytest. Cobertura mínima 70% en lógica de negocio. |
| **BDD / Aceptación** | Fase 3, escenarios definidos en Fase 2. pytest-bdd. (Ver Sección B). |
| **Integration** | Al cierre de cada sprint. Prueba interacción entre módulos. |
| **Regression** | Automatizado en Azure Pipelines. Nada anterior debe romperse. |
| **UAT** | Fase 4. El PO prueba el producto completo sobre staging. |
| **Smoke Test** | Post-deploy a Prod. Flujos críticos en menos de 10 minutos. |

## **Clasificación de Bugs**

| **SEVERIDAD** | **CRITERIO Y ACCIÓN** |
| --- | --- |
| **Crítico** | Sistema no funciona o produce datos incorrectos. Bloquea el deploy. |
| **Mayor** | Funcionalidad importante falla pero hay workaround. Resolver en el sprint siguiente. |
| **Menor** | Problema de UX no crítico. Va al backlog. |
| **Cosmético** | Alineación, typos. Se registra pero no bloquea entrega. |

| **✅ Regla de cierre: **Cero bugs críticos o mayores para hacer deploy a producción. Sin excepción. |
| --- |

## **Checklist de Salida**

- **✓ **Todos los tests unitarios y BDD pasando

- **✓ **UAT firmado por el PO

- **✓ **Cero bugs críticos abiertos

- **✓ **Informe de QA en SharePoint

| **5** | **DEPLOY / ENTREGA** |
| --- | --- |

## **Objetivo**

Pasar el producto a producción de forma controlada y entregar formalmente con toda la documentación.

| **👥 Participantes: **PO · PM · SR Dev · JR Dev · QA |
| --- |

## **SDD — Solution Design Document**

El SR Dev lo escribe al finalizar el desarrollo. Documenta CÓMO está construida la solución.

- Arquitectura general: diagrama de componentes y flujo de datos.

- Stack tecnológico con versiones exactas.

- Patrones de diseño aplicados con justificación.

- Decisiones de diseño y por qué.

- Dependencias externas: APIs, servicios, credenciales.

- Instrucciones de deploy reproducibles.

- Variables de entorno y dónde configurarlas.

- Plan de rollback documentado y probado.

## **Plan de Deploy**

- Deploy en horario de bajo tráfico. Nunca un viernes a las 17hs.

- Backup del estado anterior antes de cualquier deploy.

- Smoke test inmediato post-deploy en menos de 10 minutos.

- Monitoreo activo las primeras 24hs.

## **Checklist de Salida**

- **✓ **SDD en SharePoint

- **✓ **Sistema en producción verificado con smoke test

- **✓ **Acta de Entrega firmada por PO y PM

- **✓ **Tag de versión SemVer creado en el repositorio

| **6** | **RETROSPECTIVA FINAL DEL PROYECTO** |
| --- | --- |

## **Objetivo**

Analizar el proyecto completo. Esta retro define qué cambia en el próximo proyecto, no en el próximo sprint.

| **👥 Participantes: **SR Dev · JR Dev · QA |
| --- |

| **ℹ️ Diferencia clave: **Retrospectiva de sprint: mejorar las próximas 2 semanas. Retrospectiva Final: qué aprendimos de este proyecto que cambia cómo encaramos el próximo. |
| --- |

## **Estructura**

| **PREGUNTA** | **DESCRIPCIÓN** |
| --- | --- |
| **¿Qué salió bien?** | Prácticas a mantener y replicar. |
| **¿Qué no salió bien?** | Problemas recurrentes o estructurales. Sin culpas. |
| **¿Qué cambiaríamos?** | Acciones concretas con responsable y fecha para el próximo proyecto. |
| **¿Qué aprendimos?** | Conocimiento técnico o de negocio a documentar. |
| **¿Las retros de sprint funcionaron?** | Verificar si las acciones de cada sprint se implementaron. |

## **Métricas del Proyecto**

- Velocidad real vs. estimada por sprint.

- Bugs por severidad: en QA vs. en producción.

- Cambios de alcance: cuántos, por qué, impacto en tiempo.

- Cumplimiento del Sprint Goal por sprint.

- Satisfacción del PO: escala 1–5 con comentario.

## **Checklist de Salida**

- **✓ **Documento de lecciones aprendidas en SharePoint

- **✓ **Métricas del proyecto completo registradas

- **✓ **Acciones para el próximo proyecto definidas

| **7** | **CIERRE FORMAL** |
| --- | --- |

## **Objetivo**

Liberar recursos, archivar correctamente y dejar el proyecto en un estado en que cualquier persona pueda retomarlo sin conocimiento previo.

| **👥 Participantes: **PO · PM · SR Dev · JR Dev · QA |
| --- |

## **Azure DevOps: Cierre**

- Cerrar todas las Épicas, Features y User Stories. Estado: Closed / Done.

- Archivar el repositorio si no tendrá mantenimiento activo.

- Desactivar o configurar el pipeline CI/CD solo para mantenimiento.

## **Estructura de Archivo en SharePoint**

| **CARPETA** | **CONTENIDO** |
| --- | --- |
| **00_Kick Off** | Acta de Kick Off firmada, registro inicial de riesgos |
| **01_Relevamiento** | Flujo AS-IS, flujo TO-BE, PDD preliminar |
| **02_Planificación** | PDD final, backlog inicial, DoD, Matriz RACI |
| **03_Desarrollo** | PRs relevantes, decisiones técnicas, escenarios BDD |
| **04_QA** | Informe de QA, resultados de UAT, registro de bugs |
| **05_Entrega** | SDD, Acta de Entrega firmada, manual de usuario |
| **06_Retrospectiva** | Lecciones aprendidas, métricas del proyecto completo |

## **Comunicación de Cierre**

- Mensaje en Teams a PO y PM confirmando el cierre oficial.

- Incluir: fecha de cierre, link a SharePoint, contacto para soporte.

- Liberar formalmente a todos los integrantes del equipo.

## **Checklist de Salida**

- **✓ **Azure DevOps: Épica cerrada, todas las Stories en Done

- **✓ **SharePoint: documentación completa en estructura estándar

- **✓ **Comunicación de cierre enviada a PO y PM

- **✓ **Equipo liberado formalmente

# **SECCIÓN A — GIT FLOW: ESTRATEGIA DE RAMAS**

## **Estructura de Ramas**

| **RAMA** | **PROPÓSITO** | **REGLAS CLAVE** |
| --- | --- | --- |
| **main** | Código en producción. Siempre estable. | Solo recibe merges de release/* y hotfix/*. NUNCA directo. |
| **develop** | Integración continua. Base de todo el desarrollo. | Siempre debe compilar y pasar tests. Origen de feature/*. |
| **feature/*** | Nueva funcionalidad. | Nace de develop. Muere en develop. Ej: feature/parser-edicom. |
| **release/*** | Preparación de versión para producción. | Nace de develop. Merges a main Y develop. Solo bugfixes. |
| **hotfix/*** | Corrección urgente en producción. | Nace de main. Merges a main Y develop. Ej: hotfix/crash-iva. |
| **bugfix/*** | Corrección de bug en develop o staging. | Nace de develop. Muere en develop. Ej: bugfix/null-arca. |

## **Conventional Commits**

| **TIPO** | **CUÁNDO USARLO Y EJEMPLO** |
| --- | --- |
| **feat** | feat(parser): agregar soporte PDF multi-pagina |
| **fix** | fix(arca): corregir encoding UTF-8 en respuesta |
| **refactor** | refactor(utils): extraer helper de fechas |
| **test** | test(parser): agregar caso borde archivo vacío |
| **docs** | docs(readme): actualizar instrucciones de deploy |
| **chore** | chore(deps): actualizar pytest a 7.4 |
| **ci** | ci(pipeline): agregar stage de smoke test |
| **perf** | perf(pdf): paralelizar con ThreadPoolExecutor |

## **Protecciones y Versionado**

- main y develop protegidas. Merge solo vía PR aprobado. CI/CD debe pasar.

- Mínimo 1 aprobador en PRs a develop. Mínimo 2 en PRs a main. Autor no aprueba su propio PR.

- SemVer: MAJOR.MINOR.PATCH. Tag en cada release: git tag -a v1.2.0 -m 'Release v1.2.0'

- Pre-commit hooks: ruff/flake8 + black + pytest rápido + detect-secrets.

| **✅ Regla de oro: **main siempre debe estar en estado desplegable a producción. |
| --- |

# **SECCIÓN B — BDD: BEHAVIOR DRIVEN DEVELOPMENT**

| **NIVEL** | **ENFOQUE Y USO** |
| --- | --- |
| **TDD** | Cómo está construido internamente. Nivel unitario. SR/JR Dev. |
| **BDD** | Cómo se comporta desde afuera. Nivel funcional. Lo entiende el PO y el QA. |

## **Lenguaje Gherkin**

| **KEYWORD** | **SIGNIFICADO** |
| --- | --- |
| **Feature** | Funcionalidad que se describe. |
| **Scenario** | Caso de uso concreto a validar. |
| **Given** | Contexto inicial. |
| **When** | La acción ejecutada. |
| **Then** | Resultado esperado y verificable. |
| **And / But** | Extensión de Given, When o Then. |

## **Ejemplo — Conciliación ARCA/Deloitte**

| **Feature: **Conciliación automática de facturas ARCA |
| --- |

| **Scenario: **Factura presente en ambos sistemas |
| --- |

Given  que tengo 500 facturas del proveedor EDICOM del mes de Mayo

And    el sistema ARCA tiene registros para ese periodo

When   ejecuto el proceso de conciliacion

Then   el reporte debe mostrar 0 facturas sin match

And    el archivo de salida debe generarse en menos de 2 minutos

| **Scenario: **Factura en EDICOM pero no en ARCA |
| --- |

Given  que tengo una factura con CUIT 20-12345678-9

And    la factura no existe en el sistema ARCA

When   ejecuto el proceso de conciliacion

Then   la factura debe aparecer en la columna 'Sin match ARCA'

And    se debe registrar en el log con nivel WARNING

| **✅ Regla: **Los escenarios BDD son los criterios de aceptación. Se escriben en Fase 2 y se refinan en cada sprint. Si el PO no entiende el escenario, la story no está bien definida. |
| --- |

# **SECCIÓN C — ARQUITECTURAS Y PATRONES DE DISEÑO**

## **Arquitecturas Principales**

### **Clean Architecture**

| **CAPA** | **RESPONSABILIDAD** | **EJEMPLO EN TU CONTEXTO** |
| --- | --- | --- |
| **Entities** | Reglas de negocio puras. | Clase Factura, Clase Conciliacion, reglas ARCA. |
| **Use Cases** | Orquestan el flujo de negocio. | ConciliarFacturasUseCase, GenerarReporteUseCase. |
| **Interface Adapters** | Convierten datos entre capas. | FastAPIController, PDFParser, ARCAGateway. |
| **Frameworks ****&**** Drivers** | Todo lo externo. | FastAPI, PostgreSQL, Azure OCR, Streamlit. |

- ¿Cuándo? Proyectos medianos a grandes con lógica compleja y múltiples integraciones.

### **Arquitectura Hexagonal (Ports ****&**** Adapters)**

- Puerto de entrada: cómo el exterior invoca la app. Ej: endpoint FastAPI, trigger UiPath.

- Puerto de salida: cómo la app invoca el exterior. Ej: repo PostgreSQL, cliente ARCA.

- ¿Cuándo? Múltiples formas de ser invocado o múltiples integraciones externas.

### **Arquitectura por Capas (Layered)**

- Presentación → Aplicación → Dominio → Infraestructura.

- ¿Cuándo? Proyectos pequeños, equipos JR, bots RPA simples.

## **Patrones de Diseño: Cuándo Aplicar**

| **PATRÓN** | **CUÁNDO USARLO** | **EJEMPLO EN TU CONTEXTO** |
| --- | --- | --- |
| **Repository** | Abstraer acceso a datos. | FacturaRepository: get_by_periodo(), save(). |
| **Factory** | Crear objetos complejos sin exponer la construcción. | PDFParserFactory: PyMuPDF o AzureOCR según tipo. |
| **Strategy** | Intercambiar algoritmos en runtime. | ConciliacionStrategy: por CUIT, monto o fecha. |
| **Observer** | Notificar múltiples componentes ante un evento. | Al terminar: log + email + Power BI. |
| **Decorator** | Agregar comportamiento sin modificar la clase. | @retry, @cache, @log_execution en ARCA API. |
| **Singleton** | Una única instancia de recurso caro. | DatabaseConnection, ARCAClient. |
| **Template Method** | Esqueleto de algoritmo con pasos en subclases. | BaseProcessor: cargar, validar, procesar, exportar. |
| **Command** | Encapsular operación para encolarse o deshacer. | ConciliarFacturasCommand en cola de tareas. |

## **SOLID — Referencia Rápida**

| **PRINCIPIO** | **EN LA PRÁCTICA** |
| --- | --- |
| **S — Single Responsibility** | Cada clase tiene una sola razón para cambiar. |
| **O — Open/Closed** | Nuevo tipo de PDF = nueva clase, no modificar la existente. |
| **L — Liskov Substitution** | Una subclase reemplaza a su padre sin romper el sistema. |
| **I — Interface Segregation** | Interfaces pequeñas y especÚtaficas. |
| **D — Dependency Inversion** | Inyectar dependencias. Depender de abstracciones. |

## **Patrones Específicos RPA**

- Stateless Bot: cada ejecución es independiente.

- Idempotencia: ejecutar dos veces = mismo resultado. Crítico para conciliaciones.

- Dead Letter Queue: si un ítem falla, aislarlo y continuar.

- Checkpoint / Restart: guardar progreso para reanudar desde donde falló.

| **ℹ️ Selección: **Bot simple: Layered + Repository. API compleja: Clean Architecture + Strategy. Múltiples integraciones: Hexagonal. La más simple que resuelve el problema es la correcta. |
| --- |

# **SECCIÓN D — ELEMENTOS TRANSVERSALES**

## **Registro Activo de Riesgos**

Se registran en el Kick Off y se revisan en cada Sprint Review.

| **RIESGO** | **PROBABILIDAD / IMPACTO** | **MITIGACIÓN** |
| --- | --- | --- |
| **Cambio de layout en PDF del proveedor** | Media / Alto | Parser configurable. Tests de regresión con PDFs históricos. |
| **Vencimiento de credenciales ARCA** | Alta / Alto | Alerta 30 días antes. Responsable designado. |
| **Cambio de API sin aviso** | Media / Alto | Versionar contrato. Circuit breaker implementado. |
| **Rotación de integrante del equipo** | Media / Medio | Documentación actualizada. Knowledge transfer formal. |
| **Ambiente de producción no disponible** | Baja / Alto | Plan de rollback documentado. |

## **NFRs — Non-Functional Requirements**

| **NFR** | **CÓMO MEDIRLO** |
| --- | --- |
| **Performance** | X minutos para Y registros. Ej: 1000 facturas en < 2 minutos. |
| **Seguridad** | Credenciales en variables de entorno. Sin secretos en Git. |
| **Escalabilidad** | Soporta X veces el volumen actual sin rediseño. |
| **Mantenibilidad** | Cobertura mínima 70% en lógica de negocio. |
| **Auditabilidad** | Operaciones críticas en logs estructurados con nivel y timestamp. |

## **Ambientes**

| **AMBIENTE** | **PROPÓSITO** | **REGLAS** |
| --- | --- | --- |
| **Development** | SR/JR Dev y QA prueban localmente. | Datos de test. Nunca datos reales. |
| **Staging** | Espejo de Prod. QA y UAT se hacen aquí. | Datos anonimizados. PO valida aquí. |
| **Production** | Sistema real. | Solo merges desde release/*. Monitoreo activo. |

## **Control de Cambios**

- Todo cambio de alcance post-Kick Off requiere solicitud escrita. Nunca verbal.

- SR Dev evalúa impacto. Respuesta en máx. 48hs. Acta de Cambio firmada por PO y PM.

## **Knowledge Transfer y Handoff**

- Toda decisión técnica queda en el SDD o en comentarios del PR.

- Si un integrante sale, Knowledge Transfer formal de al menos 2hs.

- El README debe permitir levantar el entorno en menos de 30 minutos.

# **RESUMEN GENERAL**

## **Fases del Proyecto**

| **FASE** | **NOMBRE** | **PARTICIPANTES** |
| --- | --- | --- |
| **0** | Kick Off | PO · PM · SR Dev · JR Dev · QA |
| **1** | Relevamiento | PO · SR Dev · JR Dev · QA |
| **2** | Planificación | PO · SR Dev · JR Dev · QA |
| **3** | Ejecución (sprints) | Ver detalle de ceremonias |
| **4** | QA / Testing Final | PO · SR Dev · JR Dev · QA |
| **5** | Deploy / Entrega | PO · PM · SR Dev · JR Dev · QA |
| **6** | Retrospectiva Final | SR Dev · JR Dev · QA |
| **7** | Cierre Formal | PO · PM · SR Dev · JR Dev · QA |

## **Ceremonias del Sprint (Fase 3)**

| **CEREMONIA** | **PARTICIPANTES** |
| --- | --- |
| **Sprint Planning** | SR Dev · JR Dev · QA |
| **Daily Standup** | SR Dev · JR Dev · QA |
| **Refinamiento** | PO · SR Dev · JR Dev · QA |
| **Sprint Review** | PO · SR Dev · JR Dev · QA |
| **Retrospectiva de Sprint** | SR Dev · JR Dev · QA |

| **💡 Principio rector: **En ágil, el plan inicial es una hipótesis. Los sprints son los experimentos. El feedback de cada Sprint Review es el aprendizaje. El desarrollador que construye, documenta. No existe un rol de funcional separado cuando se aplican buenas prácticas y metodología ágil. |
| --- |

RPA / TaxTec — Deloitte Argentina | Junio 2026 | Metodología Ágil v5