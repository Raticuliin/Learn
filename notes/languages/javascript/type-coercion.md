# type-coercion

Conversión automática de un valor de un tipo a otro porque el operador o el contexto lo exigen. JS coerciona a **`string`**, **`number`** o **`boolean`** — son las tres únicas conversiones primitivas. Si el valor es un objeto, primero pasa por [[ToPrimitive]] (intro mínima abajo, a fondo en módulo 28).

## Explícita vs implícita

- **Explícita**: la escribes tú. `String(x)`, `Number(x)`, `Boolean(x)`, `+x`, `!!x`.
- **Implícita**: la hace el lenguaje. La activan ciertos operadores (`+` con string, `-` `*` `/`, `==`, `< > <= >=`) y los contextos booleanos (`if`, `while`, `&&`, `||`).

Saber distinguirlas es la clave para que el código no sorprenda: identificar la coerción implícita en una expresión hace desaparecer la "magia".

## A `string`

```js
String(42);            // "42"
String(null);          // "null"
String(undefined);     // "undefined"
String([1, 2]);        // "1,2"
String({});            // "[object Object]"
```

Implícita: con `+` cuando **uno de los operandos es string** (gana la concatenación), y con template literals.

## A `number`

Casos que muerden:

```js
Number("");          // 0           ← string vacío
Number("   ");       // 0           ← solo whitespace
Number("42abc");     // NaN
Number(null);        // 0           ← null SÍ se coerciona a 0
Number(undefined);   // NaN         ← undefined NO (¡asimetría!)
Number(true);        // 1
Number([]);          // 0
Number([42]);        // 42
Number([1, 2]);      // NaN
Number({});          // NaN
```

Implícita: con operadores aritméticos que **no sean `+`**, con comparaciones `< > <= >=`, y con `==` cuando un operando es number. El atajo `+x` (unario) equivale a `Number(x)`.

`parseInt` y `parseFloat` **no son coerción**, son parsers: leen mientras hay dígitos válidos y paran. `parseInt("42abc") === 42`, pero `Number("42abc") === NaN`.

## A `boolean`

Ver [[truthy-falsy]] (nota dedicada con la lista completa de los 8 valores falsy).

Implícita: en `if`, `while`, ternario, operandos de `&&` `||` `!`. Explícita: `Boolean(x)` o `!!x`.

## ToPrimitive (intro)

Cuando un objeto aparece en una operación que necesita primitivo (sumar, comparar, coercer), JS pide un primitivo con una **hint**: `"string"`, `"number"` o `"default"`. El objeto responde llamando a `valueOf()` y `toString()` en cierto orden; el primero que devuelva un primitivo gana.

Esto explica los "wat" clásicos:

```js
[] + [];        // ""
[] + {};        // "[object Object]"
[1] + [2];      // "12"
```

Detalles, hints, y `Symbol.toPrimitive` -> módulo 28.

## Reglas prácticas

1. **Conversión a number siempre explícita**: `Number(x)` o `+x`. No confíes en trucos como `"5" - 0`.
2. **Validación de input numérico**: filtra primero por `typeof` (acepta solo `"number"` y `"string"`); para strings, `trim()` antes de convertir y rechaza el string vacío; comprueba `Number.isFinite(...)` para descartar `NaN` e `Infinity`. Ver patrón `toNumberOrNull` en `languages/javascript/05-type-coercion/coercion.js`.
3. **Nunca uses `==`**. La única excepción tolerada es `x == null` como atajo de "null o undefined".
4. **No mezcles objetos con `+`** ni con comparaciones. Trabaja con sus propiedades.
5. **Para "está vacío"**: `arr.length === 0`, `Object.keys(obj).length === 0`, `str === ""`. No `if (!arr)` ni `if (!obj)` — ver [[truthy-falsy]].

## Relación

- [[js-operators]] (qué operadores disparan qué coerción).
- [[truthy-falsy]] (coerción a boolean a fondo).
- [[NaN]] (caso especial de la coerción a number).
- [[js-primitive-types]] (los tipos de partida y destino).
