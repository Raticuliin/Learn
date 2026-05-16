---
name: typeof
description: Operador typeof en JS, sus posibles valores de retorno y las rarezas históricas (typeof null === "object", tolera variables no declaradas).
metadata:
  type: reference
---

# typeof

Operador unario que devuelve un **string** describiendo el tipo de un valor.

## Posibles valores de retorno

| Resultado | Cuándo |
|---|---|
| `"undefined"` | valor `undefined`, o variable no declarada |
| `"boolean"` | `true` / `false` |
| `"number"` | cualquier número, incluyendo `NaN` e `Infinity` |
| `"bigint"` | `42n` |
| `"string"` | strings |
| `"symbol"` | `Symbol(...)` |
| `"function"` | funciones (aunque técnicamente son objetos) |
| `"object"` | cualquier otra cosa: objetos, arrays, **`null`** |

## Rarezas que hay que saber

```js
typeof null;           // "object"  ← bug histórico de JS1, no arreglado por compat
typeof NaN;            // "number"
typeof [];             // "object"
typeof function(){};   // "function"
typeof undeclaredVar;  // "undefined"  ← NO lanza ReferenceError
```

### `typeof null === "object"`

Es un bug original de JavaScript (1995). Internamente los valores se representaban con un tag binario; el tag de objetos era `000` y `null` se representaba como puntero nulo (`0x00...`), que coincidía con ese tag. Brendan Eich lo dejó como estaba. Para detectar `null`:

```js
if (x === null) { ... }
```

### `typeof` tolera variables no declaradas

Único operador de JS que no lanza `ReferenceError` ante un identificador no declarado:

```js
typeof noExiste; // "undefined"  (no lanza)
noExiste;        // ReferenceError
```

Esto lo hace útil para checks defensivos sobre globals opcionales:

```js
if (typeof window !== "undefined") { /* estamos en navegador */ }
```

## Limitaciones

- No distingue arrays de otros objetos (ambos `"object"`). Usa `Array.isArray(x)`.
- No distingue `null` de otros objetos. Usa `x === null`.
- No distingue tipos de objetos (Date, Map, Set, etc.). Usa `instanceof` o `Object.prototype.toString.call(x)`.

Relacionado: [[js-primitive-types]], [[NaN]].
