# strict mode

Modo opt-in de JavaScript que desactiva comportamientos legacy "permisivos" del lenguaje. Se activa poniendo `'use strict';` al inicio del archivo (o de una función).

## Qué cambia

- **Asignación a variable no declarada**: `ReferenceError` (sin strict, se crea una variable global silenciosamente, el bug clásico que strict elimina).
- **Asignación a propiedad de solo lectura**: `TypeError` (sin strict, falla en silencio).
- **`this` en función normal**: `undefined` (sin strict, apunta al objeto global `window` / `globalThis`).
- Prohíbe ciertos errores de sintaxis que el modo legacy toleraba (p.ej. parámetros duplicados en una función).

## Cuándo se aplica automáticamente (sin escribir `'use strict'`)

En 2026 raramente lo escribirás a mano porque ya está implícito en:

- **Módulos ESM** ([[ESM]]): todo archivo importado como módulo es strict por defecto.
- **Classes** ([[js-classes]]): el cuerpo de una clase es strict por defecto.

Solo necesitas la directiva explícita en scripts sueltos sin módulos (cada vez más raros).

## Por qué importa entenderlo

Aunque no lo escribas, explica por qué cierto código moderno lanza errores que en código legacy no lanzaría. Si ves un `ReferenceError` por una asignación que "debería funcionar", es strict mode haciendo su trabajo.

## Fuentes

- [MDN: Strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode)
- [javascript.info: The modern mode, "use strict"](https://javascript.info/strict-mode)
