# truthy-falsy

JS clasifica cualquier valor como **truthy** o **falsy** según cómo se coerciona a `boolean` en contextos que exigen una decisión booleana (`if`, `while`, ternario, operandos de `&&` `||` `!`).

## Los 8 valores falsy

```js
false
0
-0
0n          // bigint cero
""          // string vacío
null
undefined
NaN
```

**Todo lo demás es truthy.** Memorizar esta lista corta es más fácil que memorizar la lista infinita de truthy.

## Truthy que sorprenden

```js
Boolean([]);          // true   ← array vacío
Boolean({});          // true   ← objeto vacío
Boolean("0");         // true   ← string "0" (no está vacío)
Boolean("false");     // true
Boolean(" ");         // true   ← string con solo espacios (no está vacío)
Boolean(new Boolean(false)); // true ← objeto wrapper, no primitivo
```

Las dos primeras (`[]` y `{}` siendo truthy) son la causa de la mayoría de bugs por coerción. Quien viene de Python o PHP espera lo contrario.

## Implicaciones prácticas

- **No uses `if (arr)` para "tiene elementos"**. Usa `arr.length > 0`.
- **No uses `if (obj)` para "tiene propiedades"**. Usa `Object.keys(obj).length > 0`.
- **No uses `if (x)` para "es un número distinto de 0"**. Usa `typeof x === "number" && x !== 0`.
- **`if (s)`** rechaza `""` (string vacío), pero **acepta `" "` (solo espacios)**. Para detectar también whitespace puro: `if (s.trim())`.

## Conversión explícita

```js
Boolean(x);    // forma legible
!!x;           // forma idiomática corta (doble negación)
```

Las dos hacen lo mismo. Usa `Boolean(x)` cuando vaya a leerse, `!!x` en código denso (callbacks, expresiones de una línea).

## `&&` y `||` no devuelven boolean

Aunque `&&` y `||` **evalúan** truthy/falsy para decidir, lo que **devuelven** es uno de los operandos, no `true`/`false`. Detalle en [[js-operators]] y [[nullish-coalescing]].

## Relación

- [[type-coercion]] (truthy/falsy es la coerción a boolean).
- [[js-operators]] (cómo `&&` `||` `!` usan estos conceptos).
- [[nullish-coalescing]] (`??` evita la trampa de `||` con valores falsy legítimos).
