# Módulo 3. Tipos primitivos

## Objetivos

Al terminar este módulo sabrás:

- Qué son los **7 tipos primitivos** de JS y en qué se diferencian de los objetos.
- Las particularidades de cada uno: rango, casos especiales, valores raros.
- Cómo usar el operador **`typeof`** y por qué algunos resultados sorprenden (especialmente `typeof null`).
- Qué son los **wrapper objects** y cómo hacen que `"hola".toUpperCase()` funcione si los strings son "primitivos".
- Una primera intuición de **igualdad estricta vs floja** (a fondo en el módulo 4-5).

---

## 1. Qué es un "primitivo"

Un valor primitivo:

- **No es un objeto.** No tiene métodos propios ni propiedades modificables.
- Es **inmutable**: ninguna operación lo cambia, devuelven valores nuevos.
- Se compara **por valor**, no por referencia (`2 === 2` siempre, sin más).

Los 7 tipos primitivos son:

| Tipo | Ejemplo literal | Para qué |
|---|---|---|
| `number` | `42`, `3.14`, `Infinity`, `NaN` | Números (en coma flotante IEEE-754) |
| `bigint` | `42n` | Enteros arbitrariamente grandes |
| `string` | `"hi"`, `'hi'`, `` `hi` `` | Texto |
| `boolean` | `true`, `false` | Verdad/falsedad |
| `null` | `null` | Ausencia **intencionada** de valor |
| `undefined` | `undefined` (o variable sin asignar) | Ausencia **no asignada** |
| `symbol` | `Symbol("id")` | Identificadores únicos (fase 5) |

Todo lo demás en JS es un **objeto** (arrays, funciones, fechas, `{}`, etc.). Lo veremos en la fase 4.

---

## 2. Recorrido rápido por cada uno

### `number`

JS tiene un único tipo numérico: **double precision float (IEEE-754)**. Eso significa:

- Mezcla enteros y decimales en el mismo tipo: `42` y `3.14` son ambos `number`.
- Rango seguro para enteros: `Number.MIN_SAFE_INTEGER` (`-2^53 + 1`) a `Number.MAX_SAFE_INTEGER` (`2^53 - 1`). Más allá, pierdes precisión.
- Valores especiales:
  - `Infinity`, `-Infinity` (`1 / 0`, `-1 / 0`).
  - `NaN` ("Not a Number"): resultado de operaciones inválidas como `0 / 0`, `Number("hola")`. Curiosidad importante: **`NaN !== NaN`**. Para detectarlo: `Number.isNaN(x)`.
- Detalles de precisión flotante (`0.1 + 0.2 !== 0.3`) los vemos a fondo en el módulo 9.

### `bigint`

Enteros sin límite de tamaño. Se escriben con sufijo `n`:

```js
const big = 9007199254740993n;
const huge = 2n ** 100n;
```

- No puedes mezclarlos con `number` en aritmética: `1n + 1` lanza `TypeError`. Hay que convertir explícitamente: `1n + BigInt(1)` o `Number(1n) + 1`.
- Útil cuando trabajas con IDs muy grandes (timestamps en nanosegundos, IDs de bases de datos enormes).

### `string`

Secuencia **inmutable** de unidades UTF-16. Tres formas de literal:

```js
const a = "double";
const b = 'single';
const c = `template ${a}`; // permite interpolación y multilínea
```

- Inmutable: `s[0] = "X"` no hace nada (en strict, lanza `TypeError`).
- Detalles de Unicode, métodos avanzados y normalización → módulo 8.

### `boolean`

Solo dos valores: `true` y `false`. Coerción de otros valores a boolean (truthy/falsy) → módulo 5.

### `null`

Significado: "aquí **debería** haber algo, pero he decidido que no lo hay (todavía)". Es un valor que **tú asignas** explícitamente.

```js
let selectedUser = null; // todavía no hay usuario seleccionado
```

### `undefined`

Significado: "esto **no se ha asignado**". Lo pone JavaScript automáticamente en:

- Variables declaradas sin asignar (`let x;`).
- Parámetros que no se pasan a una función.
- Propiedades inexistentes de un objeto (`obj.noExiste`).
- Funciones sin `return` explícito (su valor es `undefined`).

Regla práctica: **JS produce `undefined`, tú produces `null`**.

### `symbol`

Identificador único. Cada llamada a `Symbol(...)` crea uno distinto:

```js
const a = Symbol("id");
const b = Symbol("id");
a === b; // false, aunque tengan la misma descripción
```

Casos de uso (claves "no-colisionables", protocolos como `Symbol.iterator`) → módulo 28.

---

## 3. El operador `typeof`

`typeof x` devuelve un **string** describiendo el tipo de `x`. Estos son los posibles:

| Resultado | Cuándo |
|---|---|
| `"undefined"` | valor `undefined`, o variable no declarada (¡no lanza!) |
| `"boolean"` | `true` / `false` |
| `"number"` | cualquier `number`, incluyendo `NaN` e `Infinity` |
| `"bigint"` | `42n` |
| `"string"` | strings |
| `"symbol"` | `Symbol(...)` |
| `"function"` | funciones (aunque técnicamente son objetos) |
| `"object"` | cualquier otra cosa: objetos, arrays, `null` |

### Las rarezas que tienes que saber

```js
typeof null;            // "object"  ← bug histórico, nunca arreglado por compatibilidad
typeof NaN;             // "number"  ← NaN es un número... raro pero cierto
typeof undefinedVar;    // "undefined"  ← ¡incluso si nunca declaraste undefinedVar! No lanza
typeof function(){};    // "function"  ← caso especial
typeof [];              // "object"  ← arrays son objetos
```

- **`typeof null === "object"`** es el ejemplo clásico. Para detectar `null` específicamente: `x === null`.
- **`typeof` no lanza con variables no declaradas** — es el ÚNICO operador en todo JS que lo tolera. Eso lo hace útil para checks defensivos.

---

## 4. Igualdad primaria (intro mínima)

JS tiene dos operadores de igualdad:

```js
1 === 1;      // true
1 === "1";    // false (tipos distintos)

1 == "1";     // true (== coerciona el string a number)
null == undefined; // true (caso especial con ==)
null === undefined; // false
```

- **`===` (strict)**: mismo tipo y mismo valor. **Es lo que debes usar siempre.**
- **`==` (loose)**: aplica coerción de tipo. Solo introduce sorpresas. Lo vemos a fondo en módulos 4 y 5.

Casos raros que vale la pena memorizar ya:

```js
NaN === NaN;            // false (NaN no es igual a nada, ni a sí mismo)
Number.isNaN(NaN);      // true (esta es la forma correcta de detectar NaN)
0 === -0;               // true
Object.is(0, -0);       // false (Object.is distingue +0 de -0 y NaN sí lo trata igual a sí mismo)
```

---

## 5. Wrapper objects (autoboxing)

Si los primitivos no tienen métodos... ¿cómo es que esto funciona?

```js
"hola".toUpperCase(); // "HOLA"
(42).toString();      // "42"
true.valueOf();       // true
```

Truco interno: cuando llamas a un método sobre un primitivo, JS lo **envuelve temporalmente** en un objeto wrapper (`String`, `Number`, `Boolean`), llama al método, y descarta el wrapper. Es transparente.

**Nunca uses `new String("hi")`, `new Number(42)` o `new Boolean(true)` para crear valores.** Crean objetos, no primitivos, y eso rompe comparaciones:

```js
const a = "hi";
const b = new String("hi");

typeof a;   // "string"
typeof b;   // "object"
a === b;    // false
```

Las funciones `String(...)`, `Number(...)`, `Boolean(...)` **sin `new`** sí son útiles: convierten a primitivo.

```js
String(42);    // "42"  ← primitivo
Number("42");  // 42    ← primitivo
Boolean(1);    // true  ← primitivo
```

---

## 6. Resumen

- 7 primitivos. Inmutables. Comparados por valor.
- `null` es intencional, `undefined` es "JS no asignó nada".
- `typeof` devuelve string. Cuidado con `typeof null === "object"` y `typeof NaN === "number"`.
- Usa **siempre `===`**. `NaN` requiere `Number.isNaN`.
- Llamar métodos sobre primitivos funciona por **autoboxing**, no necesitas (ni debes) usar `new String/Number/Boolean`.

---

## Ejercicio

Crea `primitives.js` en esta carpeta. Cuatro partes. Naming limpio, en inglés, **sin prefijo `var`** esta vez (los nombres tipo `varNumber` que arrastrabas del módulo 1 ya no encajan).

### Parte 1. Declara los 7 primitivos

Un `const` por tipo, con un valor representativo. Imprime el **valor** y el **`typeof`** de cada uno usando template literals. Ejemplo del formato esperado por línea:

```
number: 42 (typeof: number)
```

### Parte 2. Caza las rarezas de `typeof`

Imprime el `typeof` de estos 5 valores y comenta junto a cada `console.log` qué esperabas y qué salió:

```js
null
NaN
[]
function () {}
undeclaredVariable   // OJO: NO la declares, simplemente usa typeof sobre un identificador que no existe
```

### Parte 3. Igualdad

Imprime el resultado de estas comparaciones y, **antes de ejecutar**, escribe en un comentario qué crees que va a dar cada una:

```js
1 == "1"
1 === "1"
null == undefined
null === undefined
NaN === NaN
Number.isNaN(NaN)
0 === -0
Object.is(0, -0)
```

Luego ejecuta y compara. Si alguna te sorprende, déjala anotada.

### Parte 4. Wrapper objects

Crea dos variables:

```js
const primString = "hello";
const objString = new String("hello"); // ojo: con new
```

Imprime el `typeof` de cada una y el resultado de `primString === objString`. Después intenta `primString.toUpperCase()` y comprueba que funciona aunque `primString` sea primitivo. Explica en un comentario **por qué** funciona.

### Qué espero ver cuando lo enseñes

- El archivo `primitives.js` con las 4 partes.
- Salida del programa.
- En la parte 2, comentarios indicando qué te sorprendió.
- En la parte 3, los comentarios "qué creía" antes de ejecutar (aunque te equivoques — sobre todo si te equivocas).
- En la parte 4, tu explicación del autoboxing en una o dos frases tuyas.

Cuando lo tengas, lo revisamos con preguntas.
