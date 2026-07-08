---
titulo: Mejores Prácticas Ágiles y QA
categoria: buenas-practicas/qa-agil
tipo_documento: Guía de mejores prácticas
version: 1.0
fecha: Mayo 2025
autor: Leonardo Caracciolo
equipo: BPS Dev Team — Deloitte Argentina
clasificacion: uso interno
relacionados:
  - buenas-practicas/metodologia-agil/ciclo-vida-proyecto-agil.md
  - testing/documentacion-y-testing.html
---

> **Nota de mantenimiento (agregada al organizar la wiki):**
> Este documento es el detalle operativo día a día del sprint (DoD, estados
> de la User Story, bug tracking, configuración del Board). Para el mapa
> completo del ciclo de vida del proyecto (fases 0 a 7), ver
> `ciclo-vida-proyecto-agil.md`. Es más viejo (v1.0, mayo 2025) que ese
> documento (v5, junio 2026) — si hay contradicción entre ambos en algo que
> no sea el detalle operativo (ej. duración de ceremonias), probablemente
> este quedó desactualizado y gana el más nuevo.


# **Tabla de Contenidos**

1. Introduccion

2. Mejores practicas agiles

   2.1 Definition of Done (DoD)

   2.2 Refinement semanal

   2.3 Criterios de aceptacion

   2.4 Ceremonias y timeboxing

   2.5 Velocity como herramienta

   2.6 Retrospectivas efectivas

3. QA en cada sprint

   3.1 El anti-patron: QA al final del sprint

   3.2 QA continuo — el modelo correcto

   3.3 Flujo de estados por User Story

   3.4 QA por tecnologia (Python, VBA, UiPath)

   3.5 Piramide de testing

   3.6 Bug tracking dentro del sprint

4. Implementacion en Azure DevOps

5. Glosario

6. Historial de revisiones

# **1. Introduccion**

## **1.1 Proposito del documento**

Este documento describe las mejores practicas de metodologias agiles y la implementacion de QA por sprint para el BPS Dev Team de Deloitte Argentina. Esta orientado al equipo tecnico, al gerente de proyecto y como referencia para la incorporacion de nuevos integrantes.

## **1.2 Contexto del equipo**

El BPS Dev Team trabaja en proyectos de automatizacion RPA en tres tecnologias: Python, VBA y UiPath. Los proyectos tienen ciclos cortos, clientes con bajo conocimiento tecnico, y un portfolio de bots en produccion que requiere mantenimiento continuo. Este contexto hace que las practicas agiles sean especialmente valiosas para gestionar la incertidumbre y entregar valor de forma incremental.

## **1.3 Principio fundamental**

La mayoria de los equipos implementan Scrum de forma incompleta y despues concluyen que Agile no funciona. Lo que falla generalmente no es el framework — son las practicas especificas que se ignoran o se aplican de forma superficial. Este documento identifica esas practicas y propone como implementarlas de forma concreta en el contexto del equipo.

# **2. Mejores practicas agiles**

## **2.1 Definition of Done (DoD)**

La Definition of Done es el conjunto de criterios que debe cumplir un item para considerarse terminado. Es la practica mas ignorada y la mas importante. Sin un DoD compartido, cada dev tiene su propia definicion de terminado y el QA aparece como sorpresa al final del sprint.

**DoD minimo recomendado para el BPS Dev Team**

| **Criterio** | **Descripcion** | **Responsable** |
| --- | --- | --- |
| Codigo revisado | Al menos un dev del equipo reviso el codigo antes de mergearlo. | Dev + revisor |
| Tests pasando | Todos los tests automatizados corren sin errores en el entorno de integracion. | Dev |
| Criterios de aceptacion cumplidos | El QA verifico que todos los criterios de aceptacion de la Story se cumplen. | QA |
| Documentacion actualizada | El README, SDD o Manual de Usuario fue actualizado si el cambio lo requiere. | Dev |
| Verificado fuera de la maquina del dev | El item fue probado en un entorno que no es la maquina del dev que lo desarrollo. | QA |
| Sin deuda tecnica nueva conocida | Si se genero deuda tecnica, fue registrada como PBI en el Backlog. | Dev |

|  | *El DoD se define UNA vez y se aplica a TODOS los items del sprint. No se negocia por item. Si un item no cumple el DoD, no esta Done.* |
| --- | --- |

## **2.2 Refinement semanal**

El Backlog se degrada si no se trabaja continuamente. Un Sprint Planning caotico casi siempre es consecuencia de un Backlog mal mantenido. El refinement semanal evita este problema.

| **Atributo** | **Valor** |
| --- | --- |
| Frecuencia | Una vez por semana, mitad del sprint |
| Duracion | 45 minutos — timeboxed estricto |
| Participantes | Dev Lead + QA + opcionalmente todo el equipo |
| Objetivo | Revisar los proximos 2 sprints del Backlog |
| Output | PBIs estimados, con criterios de aceptacion, listos para el proximo Sprint Planning |

Actividades en cada refinement:

- Revisar y dividir PBIs que son demasiado grandes para caber en un sprint.

- Agregar o refinar criterios de aceptacion a los proximos items.

- Estimar Story Points con Planning Poker para los items sin estimacion.

- Identificar y registrar dependencias entre items.

- Eliminar o archivar items que ya no son relevantes.

## **2.3 Criterios de aceptacion**

Los criterios de aceptacion definen exactamente cuando una User Story esta lista. Son el contrato entre el dev y el QA. Sin criterios de aceptacion escritos antes de empezar a codear, el dev no sabe cuando terminar y el QA no sabe que validar.

**Formato recomendado: Given / When / Then**

| **Componente** | **Descripcion** | **Ejemplo** |
| --- | --- | --- |
| Given | El contexto o precondicion del escenario. | Dado que el bot Lectura BDH WW esta configurado y el archivo de entrada existe |
| When | La accion que se ejecuta. | Cuando el bot corre en el horario programado |
| Then | El resultado esperado y verificable. | Entonces el archivo Excel de salida contiene todos los registros del dia sin errores y el estado queda como SUCCESS en el sistema de monitoreo |

|  | *Los criterios de aceptacion se escriben ANTES de que el dev empiece. Si el QA no puede escribir un test basado en los criterios, los criterios son insuficientes.* |
| --- | --- |

## **2.4 Ceremonias y timeboxing**

Las ceremonias sin timebox destruyen la cultura del equipo. Si las reuniones se extienden sistematicamente, el equipo deja de participar con ganas. Los tiempos son proporcionales a la duracion del sprint.

| **Ceremonia** | **Frecuencia** | **Duracion (sprint 2 sem.)** | **Objetivo** |
| --- | --- | --- | --- |
| Sprint Planning | Inicio del sprint | 2 horas maximo | Seleccionar y descomponer los PBIs del sprint |
| Daily Standup | Diaria | 15 minutos — improrrogable | Sincronizar al equipo e identificar bloqueos |
| Refinement | Semanal | 45 minutos | Preparar el Backlog para el proximo sprint |
| Sprint Review | Fin del sprint | 1 hora | Mostrar lo entregado al liderazgo y cliente |
| Retrospectiva | Fin del sprint | 45 minutos | Identificar mejoras de proceso con action items |

Estructura del Daily Standup — tres preguntas, sin desviarse:

- Que hice desde el ultimo Daily que avanza hacia el objetivo del sprint.

- Que voy a hacer hasta el proximo Daily.

- Que me esta bloqueando o podria bloquearme.

|  | *El Daily no es una reunion de status para el manager. Es para el equipo. Si un tema necesita mas de 2 minutos, se resuelve despues del Daily con las personas involucradas.* |
| --- | --- |

## **2.5 Velocity como herramienta de proyeccion**

La velocity mide cuantos Story Points entrega el equipo por sprint en promedio. Es una herramienta de proyeccion, no de evaluacion de performance individual. Usarla para presionar al equipo destruye la confianza en los datos.

| **Uso correcto** | **Uso incorrecto** |
| --- | --- |
| Proyectar cuando se va a terminar el proyecto con datos reales. | Comparar la velocidad de un dev con la de otro. |
| Calibrar cuantos Story Points entran en el proximo sprint. | Exigir que la velocity aumente sprint a sprint. |
| Identificar si algo externo esta afectando la capacidad del equipo. | Usar la velocity como metrica de productividad ante el cliente. |
| Detectar sprints atipicos (muchas interrupciones, deuda tecnica, etc.). | Comprometer fechas basadas en la velocity de un solo sprint. |

|  | *La velocity se estabiliza despues de 3 a 4 sprints. Antes de ese punto, las proyecciones son orientativas.* |
| --- | --- |

## **2.6 Retrospectivas efectivas**

Una retrospectiva sin action items concretos es una charla. El objetivo no es quejarse del sprint — es identificar una o dos mejoras que el equipo puede implementar en el proximo sprint.

Estructura recomendada (45 minutos):

| **Etapa** | **Tiempo** | **Actividad** |
| --- | --- | --- |
| Check-in | 5 min | Una palabra o frase de como se sintio cada uno con el sprint. |
| Que salio bien | 10 min | El equipo identifica practicas o resultados positivos a mantener. |
| Que mejorar | 15 min | El equipo identifica fricciones o problemas del sprint pasado. |
| Action items | 10 min | De los problemas identificados se seleccionan maximo 2-3 mejoras concretas, cada una con responsable y fecha. |
| Cierre | 5 min | Revision de los action items del sprint anterior — se cumplieron o no. |

|  | *Los action items de la retro van al Backlog como tareas del proximo sprint. Si no tienen responsable y fecha, no existen.* |
| --- | --- |

# **3. QA en cada sprint**

## **3.1 El anti-patron: QA al final del sprint**

El error mas comun en equipos que adoptan Scrum es tratar el QA como una fase al final del sprint. Esto se conoce como mini-waterfall dentro de Scrum y tiene consecuencias predecibles:

| **Sintoma** | **Consecuencia** |
| --- | --- |
| El QA empieza a testear en los ultimos 2 dias del sprint. | No hay tiempo para corregir los bugs encontrados. Se arrastra deuda al proximo sprint. |
| El dev termina todo antes que el QA pueda testearlo. | El QA se convierte en el cuello de botella sistematico. |
| Los bugs se encuentran tarde. | El costo de correccion es alto — el dev ya cambio de contexto. |
| El sprint termina con items 'casi listos'. | La velocity es artificialmente baja y el DoD se degrada. |

## **3.2 QA continuo — el modelo correcto**

El QA participa en el sprint desde el primer dia, no solo al final. Su rol cambia segun la etapa del sprint:

| **Etapa del sprint** | **Rol del QA** |
| --- | --- |
| Sprint Planning | Cuestiona los criterios de aceptacion. Si no puede escribir un test basado en ellos, el PBI no esta listo. |
| Dias 1-3 (inicio) | Escribe los casos de test en paralelo con el desarrollo. No espera a que el dev termine. |
| Durante el desarrollo | Disponible para aclarar dudas sobre los criterios de aceptacion. Testea los items que el dev va completando. |
| Dias finales del sprint | Cierra los items en QA. Reporta bugs. Valida correcciones. |
| Sprint Review | Participa mostrando que se verifico, no solo que se desarrollo. |

## **3.3 Flujo de estados por User Story**

Cada User Story transita por cuatro estados dentro del sprint. El equipo no arranca un nuevo PBI hasta que el QA tenga capacidad de testear el actual.

| **Estado** | **Definicion** | **Responsable** | **Criterio de salida** |
| --- | --- | --- | --- |
| To Do | El item esta en el sprint pero aun no se inicio. | — | El dev arranca el desarrollo. |
| In Progress | El dev esta desarrollando. | Dev | El dev termino y lo probo en su maquina. |
| QA In Progress | El QA esta testeando contra los criterios de aceptacion. | QA | El QA cerro sin bugs bloqueantes O los bugs fueron corregidos. |
| Done | El item cumple el DoD completo. | QA + Dev | Todos los criterios de aceptacion verificados. DoD completo. |

|  | *Si el QA encuentra un bug en QA In Progress, el item vuelve a In Progress. El dev lo corrige y pasa nuevamente a QA In Progress. No se skipea el re-testeo.* |
| --- | --- |

## **3.4 QA por tecnologia**

**Python**

Para los bots Python, el QA tiene cuatro niveles disponibles:

- Smoke test: el bot arranca sin errores y no explota en el primer paso.

- Unit tests con pytest: cada funcion hace lo que tiene que hacer con inputs conocidos.

- Integration tests: el bot completo procesa un dataset de prueba y produce el output esperado.

- Regression tests: lo que funcionaba en el sprint anterior sigue funcionando.

El dataset de prueba es critico — el QA necesita un set de datos de entrada conocido y el output esperado documentado para poder comparar mecanicamente.

**VBA**

Para los scripts VBA las opciones de testing automatizado son limitadas. El foco esta en:

- Smoke test manual: la macro corre sin errores en el workbook del cliente.

- Validacion del output: el Excel generado tiene los valores correctos en las celdas esperadas. Se puede automatizar con un script Python de comparacion.

- RubberDuck VBA: plugin gratuito para el editor VBA que agrega analisis estatico y deteccion de code smells basicos.

- Prueba en la maquina del cliente o en una maquina con la misma configuracion — nunca solo en la del dev.

**UiPath**

Para los procesos UiPath el QA trabaja con:

- Workflow Analyzer nativo de UiPath Studio: detecta violaciones a best practices (nombres de variables, manejo de excepciones, uso de Try/Catch).

- Tests de regresion con datos conocidos ejecutados desde el Orchestrator.

- Validacion del output del proceso contra el output esperado documentado.

- Revision manual del log de ejecucion en el Orchestrator para detectar warnings o excepciones manejadas que podrian ser problematicas.

## **3.5 Piramide de testing**

La piramide de testing define la proporcion correcta de cada tipo de test. Cuanto mas arriba en la piramide, mas caro y lento es el test. El objetivo es tener la base solida de tests automatizados rapidos para que el testing manual se enfoque en lo que realmente necesita ojo humano.

| **Nivel** | **Tipo** | **Volumen** | **Velocidad** | **Costo** |
| --- | --- | --- | --- | --- |
| Nivel 4 (tope) | Tests exploratorios manuales | Pocos | Lento | Alto |
| Nivel 3 | Tests de integracion (bot completo) | Moderado | Medio | Medio |
| Nivel 2 | Tests de regresion | Moderado | Medio | Medio |
| Nivel 1 (base) | Unit tests automatizados | Muchos | Rapido | Bajo |

Para el stack del equipo:

- Python: los cuatro niveles son alcanzables. Priorizar unit tests y tests de integracion.

- VBA: el foco esta en el nivel 3 (validacion del output completo) y nivel 4 (manual en la maquina del cliente).

- UiPath: el nivel 1 lo cubre el Workflow Analyzer. Los niveles 2 y 3 se hacen con datasets conocidos en el Orchestrator.

## **3.6 Bug tracking dentro del sprint**

No todos los bugs tienen el mismo tratamiento. La regla es simple: los bugs del sprint actual se resuelven en el mismo sprint. Los bugs de sprints anteriores van al Backlog.

| **Tipo de bug** | **Cuando ocurre** | **Como se trata** |
| --- | --- | --- |
| Bug del sprint actual | El QA encuentra un bug en un item del sprint en curso. | Se corrige en el mismo sprint. El item vuelve a In Progress, se corrige y vuelve a QA In Progress. No va al Backlog. |
| Bug de sprint anterior (menor) | Aparece un bug en algo que ya estaba Done en un sprint pasado. | Va al Backlog como PBI nuevo. El Product Owner le asigna prioridad. Entra en el proximo sprint o en el siguiente segun impacto. |
| Bug critico en produccion | Un bot en produccion falla y afecta al cliente. | Se interrumpe el sprint. Se crea un PBI de alta prioridad. Se corrige y deploya antes de continuar con el sprint. |

Campos requeridos para cada bug en Azure DevOps:

- Titulo descriptivo: que falla, donde, con que datos.

- Pasos para reproducir: secuencia exacta que genera el error.

- Resultado actual: que pasa.

- Resultado esperado: que deberia pasar.

- Severidad: Critico / Alto / Medio / Bajo.

- Evidencia: screenshot, log, archivo de output erroneo.

# **4. Implementacion en Azure DevOps**

## **4.1 Configuracion del Board**

El Board de Azure DevOps debe reflejar el flujo de estados definido en la seccion 3.3. La configuracion recomendada para el equipo es:

| **Columna del Board** | **Mapea a** | **WIP limit recomendado** |
| --- | --- | --- |
| To Do | Items seleccionados para el sprint, no iniciados. | Sin limite |
| In Progress | Dev trabajando activamente en el item. | 2 por dev |
| QA In Progress | QA testeando el item. | 3 en total |
| Done | Item cerrado con DoD completo. | Sin limite |

## **4.2 Campos recomendados por nivel**

| **Nivel** | **Campos obligatorios** | **Campos recomendados** |
| --- | --- | --- |
| Epica | Titulo, Area Path, Estado | Descripcion, fecha de inicio y fin estimadas |
| Feature | Titulo, Story Points, Start Date, Target Date, Iteration Path | Area Path, descripcion, criterios de exito |
| User Story | Titulo, Story Points, Criterios de aceptacion, Iteration Path | Start Date, Target Date, descripcion en formato Given/When/Then |
| Task | Titulo, Horas estimadas, Asignado a | Descripcion tecnica |
| Bug | Titulo, Severidad, Pasos para reproducir, Resultado esperado vs actual | Evidencia adjunta, version afectada |

## **4.3 Integracion con el Delivery Plan del cliente**

El Delivery Plan de Azure DevOps (seccion de Boards) genera automaticamente el Gantt que se le entrega al cliente. Para que funcione correctamente, todos los items de nivel Feature deben tener Start Date y Target Date completados. Ver documento Guia Delivery Plans Azure DevOps para el detalle de configuracion.

# **5. Glosario**

| **Termino** | **Definicion** |
| --- | --- |
| Agile | Marco de trabajo iterativo e incremental para el desarrollo de software. |
| Backlog | Lista priorizada de todo el trabajo pendiente del proyecto. |
| Daily Standup | Reunion diaria de 15 minutos del equipo para sincronizar avance e identificar bloqueos. |
| Definition of Done (DoD) | Conjunto de criterios que debe cumplir un item para considerarse terminado. |
| PBI | Product Backlog Item — cualquier unidad de trabajo en el Backlog (Feature, User Story, Bug, Task). |
| Planning Poker | Tecnica de estimacion donde cada miembro del equipo vota Story Points de forma independiente. |
| QA | Quality Assurance — proceso de verificacion de que el software cumple los criterios de calidad. |
| Refinement | Sesion semanal para preparar y estimar los proximos items del Backlog. |
| Retrospectiva | Ceremonia al final del sprint para identificar mejoras de proceso. |
| Scrum | Framework agil basado en sprints, roles definidos y ceremonias especificas. |
| Sprint | Periodo fijo de tiempo (1-4 semanas) en el que el equipo entrega un incremento de valor. |
| Sprint Planning | Ceremonia de inicio del sprint donde el equipo selecciona y descompone los PBIs. |
| Sprint Review | Ceremonia de fin del sprint donde se muestra lo entregado al liderazgo y cliente. |
| Story Points | Unidad de medida del esfuerzo relativo de una User Story. |
| User Story | Descripcion de una funcionalidad desde la perspectiva del usuario en formato: Como [rol], quiero [accion], para [beneficio]. |
| Velocity | Promedio de Story Points entregados por sprint. Usada para proyectar fechas de entrega. |
| WIP Limit | Work In Progress Limit — cantidad maxima de items que pueden estar en un estado simultaneamente. |

# **6. Historial de revisiones**

| **Version** | **Fecha** | **Autor** | **Descripcion** |
| --- | --- | --- | --- |
| 1.0 | Mayo 2025 | Leonardo Caracciolo | Version inicial del documento. |

*— Fin del documento —*

	Mejores Practicas Agiles y QA — BPS Dev Team