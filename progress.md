# Bitácora de aprendizaje

Cada entrada al inicio. Las más recientes arriba.

---

## 2026-05-16. Arranque del repo + Módulo 1 de JavaScript

### Tema

Primera sesión. Diseño del plan de aprendizaje y arranque del curso de JavaScript.

### Qué se hizo

- **Plan completo de JavaScript** diseñado en [`languages/javascript/README.md`](languages/javascript/README.md): 70 módulos en 13 fases, con 3 proyectos integradores (CLI guess-game tras módulo 7, SPA vanilla con API tras Fase 6, app markdown-notes al final).
- **MOC del vault** creado en [`notes/languages/javascript/JavaScript.md`](notes/languages/javascript/JavaScript.md) con wikilinks preparados para todas las notas conceptuales del curso.
- **Módulo 1, Sintaxis y entorno**: visto y cerrado. Cubrió sintaxis mínima, literales de los 7 primitivos, `'use strict'` (y por qué casi no hace falta escribirlo en 2026), runtimes JS (Node / navegador / Deno / Bun). Ejercicio `hello.js` hecho y revisado.
- **Notas del vault del módulo 1** escritas:
  - [`notes/languages/javascript/strict-mode.md`](notes/languages/javascript/strict-mode.md)
  - [`notes/languages/javascript/js-runtimes.md`](notes/languages/javascript/js-runtimes.md)

### Decisiones tomadas

- **Salto a React** previsto tras módulo 55 (fin de Fase 9), saltándose Fases 4 (OOP/prototipos) y 5 (Symbols/Proxy/GC profundo). Iván puede cambiar de opinión.
- **Obsidian sigue apuntando a `notes/`**, no al root del repo. Decisión expresa.
- **Archivos de módulo se llaman `README.md`** (convención mantenida).
- **Yo redacto las notas del vault** al cerrar cada módulo, sin que Iván las pida (guardado como `vault-notes-author` en memoria).
- **Planes de curso siempre completos**, sin recortes anticipados; Iván decide qué saltar (guardado como `course-scope-completeness`).
- **Nunca usar guion largo (em dash)** en ningún archivo (guardado como `no-em-dash`).

### Qué quedó claro / qué no

Sin dudas abiertas del módulo 1. Insight clave que Iván verbalizó bien: sin strict, una asignación a variable no declarada crea una global silenciosamente; con strict, lanza `ReferenceError`.

### Siguiente paso

**Módulo 2, Variables y bindings**: `var` / `let` / `const`, hoisting, Temporal Dead Zone, block vs function scope. Pendiente de arrancar.

Nota didáctica para el módulo 2: en el ejercicio del 1, Iván usó `let` para todo. Recordar que la regla moderna es `const` por defecto, `let` solo si se reasigna. Esto cae de lleno en el módulo 2, aprovechar para reforzarlo.
