# Módulo 1. Sintaxis y entorno

## Objetivos

Al terminar este módulo sabrás:

- Cómo se escribe un programa JS mínimo: statements, comentarios, literales.
- Qué es `'use strict'` y por qué importa.
- Dónde se ejecuta JavaScript hoy: navegador, **Node.js**, Deno, Bun (qué son y cuándo se usa cada uno).
- Cómo ejecutar un archivo `.js` desde la terminal con Node.

## 1. Sintaxis mínima

```js
// Comentario de una línea
/* Comentario
   multilínea */

let greeting = "Hello, world!";
console.log(greeting);
```

Detalles a notar:

- **Case-sensitive**: `name` y `Name` son cosas distintas.
- **Punto y coma**: técnicamente *opcional* (hay un mecanismo llamado ASI, Automatic Semicolon Insertion, que los inserta solo). En la práctica, la mayoría de equipos los ponen explícitos o usan Prettier que decide. **Vamos a ponerlos explícitos** durante el curso.
- **Identificadores**: pueden empezar por letra, `_`, o `$`. No por número.
- **Statements vs expressions**: una statement *hace* algo, una expression *produce un valor*. `let x = 2;` es statement; `2 + 3` es expression. Importa más adelante.

## 2. Literales primitivos

JS tiene 7 tipos primitivos. Sus literales:

```js
let aNumber = 42;          // number
let aBigInt = 42n;         // bigint (con la 'n' al final)
let aString = "hello";     // string (también 'hello' o `hello`)
let aBoolean = true;       // boolean
let nothing = null;        // null (valor "vacío" explícito)
let notAssigned;           // undefined (sin asignar todavía)
let unique = Symbol("id"); // symbol (lo veremos en Fase 5)
```

> Detalle bonito: los tres tipos de comillas para strings (`"..."`, `'...'`, `` `...` ``) son intercambiables; las backticks además permiten interpolación (`` `Hello ${name}` ``). Lo vemos en profundidad en el módulo 8.

## 3. `'use strict'`

JavaScript arrastra decisiones de diseño de los 90 que hoy son trampas. **Strict mode** desactiva las peores. Se activa poniendo esta línea al principio del archivo:

```js
"use strict";
```

Qué cambia con strict mode (ejemplos clásicos):

| Sin strict | Con strict |
|---|---|
| `x = 10;` (sin declarar) crea variable global silenciosamente | Lanza `ReferenceError` |
| Asignar a una propiedad de solo-lectura falla en silencio | Lanza `TypeError` |
| `this` en una función normal apunta al objeto global | `this` es `undefined` |
| Permite ciertos errores de sintaxis "legacy" | Los prohíbe |

**En 2026 strict mode es prácticamente el default** porque:

- Los **módulos ESM** (que veremos en Fase 8) son strict automáticamente.
- Las **classes** son strict automáticamente.

Solo necesitas escribir `'use strict';` explícito en scripts viejos o archivos sueltos sin módulos.

## 4. Dónde se ejecuta JS

| Entorno | Qué es | Cuándo |
|---|---|---|
| **Navegador** | Motor V8 (Chrome/Edge/Brave), SpiderMonkey (Firefox), JavaScriptCore (Safari). Acceso al DOM y APIs web. | Frontend |
| **Node.js** | V8 + APIs propias para sistema (`fs`, `http`, `process`...). El más usado en backend JS. | Backend, CLIs, tooling |
| **Deno** | Alternativa moderna a Node del mismo creador (Ryan Dahl). Seguro por defecto (permisos explícitos), TypeScript nativo, ESM-first. | Aún minoritario, pero creciente |
| **Bun** | Runtime nuevo (escrito en Zig). Muy rápido, intenta ser drop-in replacement de Node + bundler + test runner. | Ganando tracción, especialmente en tooling |

En tu máquina ya tienes Node 25.9.0 (vía `mise`). Ejecutar un archivo:

```bash
node hello.js
```

También puedes probar JS rápido en la **consola del navegador** (DevTools → Console, o `F12` en Brave). Útil para experimentos pequeños.

---

## Ejercicio

Crea un archivo `hello.js` **en esta misma carpeta** que cumpla:

1. Empieza con `'use strict';` en la primera línea.
2. Incluye al menos un comentario de una línea y uno multilínea explicando qué hace tu programa.
3. Declara una variable de **cada tipo primitivo** (number, bigint, string, boolean, null, undefined; symbol opcional).
4. Imprime todas con `console.log`, una por línea.
5. Ejecútalo con `node hello.js` y comprueba la salida.

### Parte 2. Strict mode en acción

Después de que el script base funcione, **rompe algo a propósito** para ver qué hace strict mode:

- Añade al final una asignación a una variable que **no** hayas declarado, por ejemplo:
  ```js
  oops = "this is not declared";
  ```
- Ejecuta. Observa el error.
- Ahora **comenta** la primera línea (`'use strict';`) y vuelve a ejecutar. ¿Pasa lo mismo? ¿Por qué?

### Qué espero ver cuando lo enseñes

- El archivo `hello.js` en `languages/javascript/01-syntax-and-environment/`.
- Salida de ejecutarlo.
- Lo que observaste en la Parte 2 (con y sin strict mode).

Cuando lo tengas, me lo enseñas y revisamos.
