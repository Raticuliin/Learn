# nullish-coalescing

Operador `??`. Devuelve el operando de la derecha **solo si el de la izquierda es `null` o `undefined`** (los dos valores "nullish"). En cualquier otro caso, devuelve el de la izquierda.

```js
a ?? b
// b si a es null o undefined
// a en cualquier otro caso
```

## Por qué existe (la trampa de `||`)

El patrón clásico de default con `||` pisa cualquier valor falsy, no solo "ausencia de valor":

```js
const port = config.port || 3000;
// si config.port === 0, devuelve 3000  ← MAL, 0 era un valor legítimo
```

`??` arregla eso porque solo dispara con nullish:

```js
const port = config.port ?? 3000;
// si config.port === 0, devuelve 0   ← bien
// si config.port === undefined, devuelve 3000
```

Comparación directa:

| Valor de `a` | `a \|\| b` | `a ?? b` |
|---|---|---|
| `null` | `b` | `b` |
| `undefined` | `b` | `b` |
| `0` | `b` | `0` |
| `""` | `b` | `""` |
| `false` | `b` | `false` |
| `NaN` | `b` | `NaN` |

## Restricción de sintaxis

No se puede mezclar con `||` o `&&` sin paréntesis explícitos. JS obliga a desambiguar:

```js
a ?? b || c;       // SyntaxError
(a ?? b) || c;     // OK
a ?? (b || c);     // OK
```

## Combinado con [[optional-chaining]]

Patrón muy frecuente:

```js
const port = config?.server?.port ?? 3000;
```

Lee: "navega la cadena, si algo es nullish corta y devuelve `undefined`; el `??` final reemplaza ese `undefined` por el default".

## Relación

- [[js-operators]] (operadores generales).
- [[truthy-falsy]] (para entender la diferencia frente a `||`).
- [[optional-chaining]] (a menudo aparecen juntos).
