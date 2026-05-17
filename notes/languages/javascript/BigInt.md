# BigInt

Tipo primitivo (ES2020) para enteros de **precisión arbitraria**. Existe porque `number` solo puede representar enteros exactamente hasta `2^53 - 1` ([[ieee-754-js]]).

## Sintaxis

Sufijo `n`:

```js
const big = 123n;
const bigger = 2n ** 64n - 1n;   // 18446744073709551615n
typeof big;                       // "bigint"
```

O via constructor: `BigInt(123)`, `BigInt("123")`.

## Reglas duras

### No se mezcla con `number`

```js
5n + 5;   // TypeError: Cannot mix BigInt and other types
```

Para mezclar, conversión explícita:

```js
5n + BigInt(5);    // 10n
Number(5n) + 5;    // 10
```

### División trunca

```js
7n / 2n;    // 3n  ← entero, no 3.5n
```

BigInt es **solo enteros**. No tiene decimales.

### No funciona con `Math`

```js
Math.max(1n, 2n);   // TypeError
```

`Math.*` espera `number`. Si necesitas operar BigInts, hazlo a mano.

## Gotcha: `JSON.stringify`

```js
JSON.stringify({ id: 123n });
// TypeError: Do not know how to serialize a BigInt
```

`JSON` no soporta BigInt. Soluciones:

```js
// 1. Convertir manualmente antes
JSON.stringify({ id: 123n.toString() });

// 2. Con replacer (más limpio para objetos complejos)
JSON.stringify(data, (k, v) => typeof v === "bigint" ? v.toString() : v);
```

Por esta razón, las APIs que manejan IDs de 64 bits casi siempre los devuelven como **string**, no como número.

## Cuándo usar

- IDs muy grandes (Twitter Snowflake, identificadores de DB de 64 bits, blockchain).
- Contadores que rebasan `2^53`.
- Criptografía didáctica.

Cuando NO usar:

- Dinero o cualquier cálculo con decimales → enteros en céntimos o librería decimal.
- Cualquier código que dependa de `Math`.

Relacionadas: [[ieee-754-js]], [[js-numbers]].
