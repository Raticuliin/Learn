# js-operators

Resumen de los operadores de JavaScript y sus gotchas más importantes. Detalles más profundos en notas atómicas dedicadas: [[nullish-coalescing]], [[optional-chaining]].

## Aritméticos

- `+`, `-`, `*`, `/`, `%`, `**`.
- JS no tiene división entera: `9 / 2 === 4.5`. Para entera: `Math.trunc(9 / 2)`.
- `+` es el único raro: si **alguno de los dos operandos es string**, concatena. El resto coerciona a number.
- `"5" - 2 === 3`, `"abc" - 1 === NaN`, `+ "42" === 42`, `+ "abc" === NaN`. El unario `+` es el atajo más corto para coercer a número.

## Comparación

- `===` (strict): si los tipos no coinciden, `false` directo. Si coinciden, compara valor.
- `==` (loose): si los tipos no coinciden, **aplica coerción** y compara. Si coinciden, se comporta como `===`.
- **Diferencia real**: coerción sí (`==`) / coerción no (`===`). No es "uno mira el tipo y el otro no": ambos miran el tipo, lo que cambia es qué hacen si no coincide.
- Regla práctica: usa siempre `===` / `!==`.

### El caso especial `null == undefined`

```js
null == undefined;    // true
null == 0;            // false
undefined == 0;       // false
```

No es por "ambos falsy". Es una **regla ad-hoc** escrita en la spec de ECMAScript: en `==`, `null` y `undefined` se consideran iguales **entre sí y a nada más**, sin coerción a número. Por eso `null == 0` es `false` aunque `null` coercionado a número sea `0`.

## Lógicos

- `&&`, `||`, `!`.
- `&&` y `||` evalúan en **short-circuit** y devuelven **uno de los operandos**, no necesariamente boolean:
  - `a && b`: si `a` es falsy, devuelve `a` sin evaluar `b`. Si truthy, devuelve `b`.
  - `a || b`: si `a` es truthy, devuelve `a` sin evaluar `b`. Si falsy, devuelve `b`.
- `!!x` es el truco idiomático para convertir cualquier valor a su boolean.
- **Trampa de `||` como default**: si el valor legítimo puede ser `0`, `""` o `false`, `||` los pisa. Para eso existe [[nullish-coalescing]].

Truthy/falsy a fondo en [[truthy-falsy]] (módulo 5). Falsy values: `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`. Todo lo demás es truthy.

## Ternario

`condición ? a : b`. Es una **expresión**, devuelve valor. Útil en una línea; si lo anidas más de un nivel, suele ser señal de pasar a `if/else`.

## Nullish coalescing y optional chaining

Ver [[nullish-coalescing]] y [[optional-chaining]] (notas atómicas dedicadas).

## Spread / rest

Mismo símbolo `...`, uso opuesto según contexto:

- **Spread**: expande un iterable u objeto. Aparece en la **derecha de `=`** o **dentro de una llamada**.
  - `[0, ...arr, 4]`, `{ ...a, ...b }`, `Math.max(...nums)`.
  - En objetos rige **source order, last write wins**: en `{ ...A, ...B }`, las claves repetidas de `B` pisan a las de `A`.
- **Rest**: agrupa varios elementos en uno. Aparece en **parámetros de función** o **destructuring**.
  - `function fn(...args)`, `const [first, ...rest] = arr`.

A fondo en arrays (módulo 10), objetos (módulo 11), destructuring (módulo 12) y funciones (módulo 7).
