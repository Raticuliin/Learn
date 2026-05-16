---
name: var-let-const
description: Las tres formas de declarar variables en JS, sus diferencias de scope, mutabilidad y hoisting, y cuándo usar cada una en 2026.
metadata:
  type: reference
---

# var / let / const

Tres formas de declarar variables en JS. Solo dos vivas hoy.

## Diferencias clave

| | `var` | `let` | `const` |
|---|---|---|---|
| Scope | función | bloque | bloque |
| Hoisting | sí, inicializada a `undefined` | sí, en [[temporal-dead-zone]] | sí, en TDZ |
| Reasignable | sí | sí | **no** |
| Redeclarable en mismo scope | sí | no | no |

## Regla moderna (2026)

- **`const` por defecto.**
- **`let` solo cuando vas a reasignar** (contadores, acumuladores, bindings que cambian en bucles).
- **`var` no se usa** en código nuevo. Solo conviene reconocerlo en código legacy.

## `const` no es inmutable

`const` impide **reasignar el binding**, no mutar el contenido de un objeto/array.

```js
const u = { n: 1 };
u.n = 2;          // OK
u = { n: 3 };     // TypeError
```

Para inmutabilidad real → `Object.freeze`, `structuredClone`, técnicas funcionales.

## Por qué `var` es problemática

Function-scoped: fuga fuera de bloques `if`, `for`, etc. Esto causa bugs sutiles, sobre todo en bucles con callbacks asíncronos (caso clásico que se vio antes de ES6).

Relacionado: [[hoisting]], [[temporal-dead-zone]].
