# control-flow-js

Estructuras de control en JavaScript: condicionales (`if`/`else`, ternario, `switch`) y bucles (`for`, `while`, `do...while`, `for...of`, `for...in`). Comparten un par de particularidades con respecto a otros lenguajes que valen la pena anclar.

## Condicionales

- **La condición no exige boolean estricto**: se evalúa por la regla de [[truthy-falsy]]. `if (name)` entra solo si `name` es truthy.
- **El ternario es una expresión**, no una sentencia: devuelve valor. Útil para asignaciones cortas (`const label = n === 1 ? "item" : "items"`). Anidarlos profundamente es ilegible — pasa a `if`/`switch`.
- **No hay encadenamiento estilo matemáticas**. `18 <= x < 65` **no** significa "entre 18 y 65"; se evalúa como `(18 <= x) < 65` → `true/false < 65` → siempre `true`. Forma correcta: `x >= 18 && x < 65`.

## `switch`

- Comparación con **`===`** (estricta, sin coerción). `switch("1")` no entra en `case 1`.
- Fall-through entre cases. Es un patrón a parte: ver [[switch-fall-through]].
- Buena alternativa cuando es solo mapeo clave -> valor: objeto + `??` (`labels[key] ?? "default"`). `switch` brilla cuando hay **lógica** dentro de cada rama.

## Bucles

- **`for` clásico**: tres partes opcionales (`for (;;)` es infinito). Con `let i`, **cada iteración crea un binding nuevo** — importante para closures (módulo 18).
- **`while`** / **`do...while`**: la diferencia es si el cuerpo se ejecuta antes o después de comprobar la condición. `do...while` es raro en código real.
- **`for...of`** itera **valores** de cualquier iterable (array, string, `Map`, `Set`, `NodeList`, generators...). Para índice + valor, `arr.entries()` + destructuring.
- **`for...in`** itera **claves enumerables** de un objeto (incluidas las del prototipo). Sobre arrays es una trampa: ver [[for-in-vs-for-of]].

Tabla mental rápida:

| Quiero...                  | Uso                                            |
| -------------------------- | ---------------------------------------------- |
| Valores de array/iterable  | `for...of`                                     |
| Índice + valor de array    | `for...of` con `.entries()` + destructuring    |
| Claves de objeto plano     | `Object.keys(obj)` + `for...of`                |
| Pares clave-valor objeto   | `Object.entries(obj)` + `for...of` + destruct. |

## `break` / `continue` / labels

- `break` sale del bucle (o `switch`) actual; `continue` salta a la siguiente iteración.
- Las **labels** (`outer: for (...)`) permiten romper / continuar un bucle externo desde uno anidado. Existen, hay que saber leerlas. En código real casi siempre se prefiere extraer la lógica anidada a una función y usar `return` — más legible.

## Relación

- [[truthy-falsy]] (qué entra y qué no en `if`/`while`/ternario).
- [[switch-fall-through]] (la rareza del `switch`).
- [[for-in-vs-for-of]] (la trampa de `for...in` con arrays).
