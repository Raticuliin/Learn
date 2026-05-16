---
name: hoisting
description: Mecanismo por el que JS "sube" las declaraciones al inicio del scope antes de ejecutar el código. Se comporta distinto según var, let, const y function.
metadata:
  type: reference
---

# Hoisting

JavaScript procesa las **declaraciones** del scope antes de ejecutar las sentencias. Conceptualmente "sube" las declaraciones arriba del scope. El comportamiento depende del tipo de declaración.

## Por tipo de declaración

| Declaración | ¿Se hoistea? | ¿Inicializada? |
|---|---|---|
| `var` | sí | sí, a `undefined` |
| `let` / `const` | sí | **no** (queda en [[temporal-dead-zone]]) |
| `function` (declaración) | sí | sí, con la función completa |
| `class` | sí | no (TDZ, igual que let/const) |
| `function` (expresión: `const f = function(){}`) | el binding sí, la función no | depende del binding (TDZ si es let/const) |

## Ejemplo

```js
console.log(a); // undefined  (var hoistea con valor undefined)
var a = 1;

console.log(b); // ReferenceError: cannot access 'b' before initialization
let b = 2;

greet();        // "hi"  (function declarations se hoistean completas)
function greet() { console.log("hi"); }

greet2();       // TypeError: greet2 is not a function
var greet2 = function () { console.log("hi"); };
```

## Modelo mental correcto

No es que el motor "mueva" texto. El motor recorre el scope, **registra los bindings** que va a haber, y luego ejecuta línea a línea. La diferencia entre `var` y `let`/`const` es **en qué estado nacen** esos bindings: inicializados a `undefined` o no inicializados (TDZ).

## Por qué importa

- Explica errores tipo `ReferenceError: cannot access 'x' before initialization` → casi siempre es TDZ.
- Explica por qué `var` puede dar valores `undefined` inesperados sin lanzar nada.
- Las `function` declarations hoisteadas permiten llamar funciones antes de su definición en el archivo (estilo común en JS, distinto del orden estricto de Python).

Relacionado: [[var-let-const]], [[temporal-dead-zone]].
