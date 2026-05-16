# NaN

`NaN` ("Not a Number") es un valor del tipo `number` que representa "el resultado de una operación numérica inválida". Aparece principalmente como salida de coerciones fallidas (`Number("abc")`, `+undefined`) o de aritmética sin sentido (`0 / 0`, `Math.sqrt(-1)`).

## La rareza fundamental

```js
NaN === NaN;          // false
NaN == NaN;           // false
NaN !== NaN;          // true
```

`NaN` **no es igual a nada, ni a sí mismo**. Es un requisito de IEEE-754, el estándar de coma flotante: el resultado de operaciones inválidas debe ser "incomparable" para no propagarse silenciosamente como un valor válido.

Consecuencia práctica: **no puedes detectar `NaN` con `===`**. Hace falta una función dedicada.

## `Number.isNaN` vs `isNaN`

Hay dos formas en el lenguaje, y solo una es la correcta.

### `Number.isNaN(x)` (ES2015) — usa esta

Devuelve `true` **solo si `x` es exactamente el valor `NaN`**. No coerciona.

```js
Number.isNaN(NaN);        // true
Number.isNaN("NaN");      // false   ← "NaN" es un string, no es el valor NaN
Number.isNaN("hola");     // false
Number.isNaN(undefined);  // false
```

### `isNaN(x)` (global, legacy) — evítala

Primero hace `Number(x)`, después comprueba si el resultado es `NaN`. Da `true` para cualquier cosa que **no se pueda convertir** a number, no solo para el valor `NaN`.

```js
isNaN(NaN);          // true
isNaN("NaN");        // true   ← porque Number("NaN") === NaN
isNaN("hola");       // true   ← porque Number("hola") === NaN
isNaN(undefined);    // true   ← porque Number(undefined) === NaN
isNaN({});           // true   ← porque Number({}) === NaN
```

Es prácticamente inútil porque mezcla "es el valor NaN" con "no se convierte a number".

## Patrones útiles

- **¿Esto es el valor NaN?** `Number.isNaN(x)`.
- **¿Esto es un number finito (ni NaN ni ±Infinity)?** `Number.isFinite(x)`.
- **¿Esto se puede interpretar como número finito?** Convierte primero y comprueba: `Number.isFinite(Number(x))`. OJO: `Number("")`, `Number(null)`, `Number(true)`, `Number([42])` no son `NaN` y pasarían este check. Si quieres ser estricto, filtra por `typeof` antes. Ver `toNumberOrNull` en el ejercicio del módulo 5.

## Origen idiomático

- `Number("abc")` → `NaN`.
- `0 / 0` → `NaN` (pero `1 / 0` → `Infinity`, no `NaN`).
- `Math.sqrt(-1)`, `Math.log(-1)` → `NaN`.
- `parseInt("abc")` → `NaN`.
- `undefined + 1`, `undefined * 2` → `NaN`.

Cualquier operación aritmética con `NaN` da `NaN` (propagación).

```js
NaN + 1;      // NaN
NaN * 0;      // NaN   ← incluso por 0
```

## Relación

- [[type-coercion]] (`NaN` es salida típica de coerciones a number fallidas).
- [[js-primitive-types]] (donde se vio por primera vez junto a `typeof NaN === "number"`).
- [[js-numbers]] (módulo 9, donde profundizaremos IEEE-754).
