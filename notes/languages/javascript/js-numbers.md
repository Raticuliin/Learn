# js-numbers

El tipo `number` en JS es **float de 64 bits** ([[ieee-754-js]]). Para enteros más allá de 2^53 → [[BigInt]].

## Métodos estáticos de `Number` (los fiables)

```js
Number.isNaN(NaN);          // true
Number.isNaN("hello");      // false ← global isNaN("hello") daría true (coerciona)

Number.isFinite(Infinity);  // false
Number.isFinite("42");      // false ← global isFinite("42") daría true

Number.isInteger(3);        // true
Number.isInteger(3.0);      // true (3.0 === 3)
Number.isInteger(3.5);      // false

Number.isSafeInteger(2 ** 53 - 1);  // true
Number.isSafeInteger(2 ** 53);      // false
```

**Regla**: usa siempre `Number.isXxx`, no los globales `isNaN` / `isFinite` (que coercionan).

## Conversión a string con formato

```js
(1234.5678).toFixed(2);       // "1234.57"  ← string, no number
(1234.5678).toPrecision(4);   // "1235"
(0.000001).toExponential(2);  // "1.00e-6"
(255).toString(16);            // "ff"  ← base arbitraria 2-36
```

Todos devuelven **string**. Para volver a number: `Number(...)` o `+`.

## `Math` esencial

```js
Math.PI; Math.E;

Math.abs(-5);         // 5
Math.sign(-3);        // -1 (también 1, 0, -0, NaN)

Math.floor(3.7);      // 3
Math.ceil(3.2);       // 4
Math.round(3.5);      // 4 — redondea hacia +∞ en empates
Math.round(-0.5);     // 0 ← no es "lejos de cero"
Math.trunc(3.7);      // 3 (corta hacia 0)
Math.trunc(-3.7);     // -3 (distinto de floor)

Math.max(...arr);     // con spread
Math.min(...arr);

Math.pow(2, 10);      // 1024 — equivalente a 2 ** 10
Math.sqrt(16);        // 4

Math.log(Math.E);     // 1 (log natural)
Math.log10(1000);     // 3
Math.log2(8);         // 3

Math.random();        // [0, 1)
```

### Idioms útiles

```js
// Entero aleatorio en [min, max] inclusive
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Clamp
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Round a N decimales (devuelve number, no string)
function roundTo(value, decimals) {
  return Math.round(value * 10 ** decimals) / 10 ** decimals;
}
```

## Conversión de string a number

```js
Number("42");        // 42
Number("");          // 0       ← gotcha
Number("  42  ");    // 42      (trim implícito)
Number("42abc");     // NaN
Number(null);        // 0       ← gotcha
Number([42]);        // 42      ← gotcha

parseInt("42abc", 10);  // 42  — siempre pasa radix
parseFloat("3.14abc");  // 3.14
```

**Siempre radix explícito** en `parseInt` (segundo argumento). Sin él hay reglas históricas raras con strings que empiezan por `0`.

## Patrón `toNumberOrNull` (parseo robusto)

```js
function toNumberOrNull(input) {
  if (typeof input !== "number" && typeof input !== "string") return null;
  const n = Number(input);
  if (!Number.isFinite(n)) return null;
  if (Number.isInteger(n) && !Number.isSafeInteger(n)) return null;
  return n;
}
```

Filtra primero por tipo (rechaza `null`, `undefined`, arrays, objetos, booleans), después convierte y valida. Patrón clave en bordes de I/O ([[type-coercion]]).

Relacionadas: [[ieee-754-js]], [[BigInt]], [[NaN]], [[type-coercion]].
