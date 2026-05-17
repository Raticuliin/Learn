# ieee-754-js

JavaScript representa todos los `number` como **floats de 64 bits IEEE-754** ("double precision"). No hay tipo entero separado: `1` y `1.0` son exactamente lo mismo.

Estructura interna (no hace falta memorizar):

```
[ 1 bit signo ][ 11 bits exponente ][ 52 bits mantisa ]
```

## Consecuencias prácticas

### Aritmética decimal no es exacta

```js
0.1 + 0.2 === 0.3;     // false
0.1 + 0.2;             // 0.30000000000000004
```

`0.1` no se puede representar exactamente en binario, igual que `1/3` no se puede en decimal. **No es un bug de JS** — pasa en Java, C, Python, todos los lenguajes que usan IEEE-754.

### Comparar floats: tolerancia con `EPSILON`

```js
function approxEq(a, b, eps = Number.EPSILON) {
  return Math.abs(a - b) < eps;
}
```

`Number.EPSILON` (~2.22e-16) = diferencia mínima representable entre `1` y el siguiente float. Sirve como tolerancia para magnitudes cercanas a 1. Para floats grandes (1e10+) hay que escalar la tolerancia.

### Enteros seguros: hasta 2^53 - 1

```js
Number.MAX_SAFE_INTEGER;     // 9007199254740991
9007199254740992 === 9007199254740993; // ¡true! ← precisión perdida
```

A partir de `2^53` los enteros consecutivos dejan de ser distinguibles. Para enteros mayores → [[BigInt]].

Detectar enteros fuera del rango:

```js
Number.isSafeInteger(2 ** 53);      // false
Number.isSafeInteger(2 ** 53 - 1);  // true
```

### `Infinity` no lanza

División por cero **no lanza** — devuelve `Infinity`:

```js
1 / 0;               // Infinity
-1 / 0;              // -Infinity
Infinity - Infinity; // NaN
```

Detectar valores no finitos:

```js
Number.isFinite(Infinity);   // false
Number.isFinite(NaN);        // false
Number.isFinite(42);         // true
```

Las versiones globales (`isFinite`, `isNaN`) coercionan y dan falsos positivos. **Siempre `Number.isXxx`** ([[NaN]]).

## Para dinero / cálculos exactos

IEEE-754 no sirve para representar dinero (`0.10 + 0.20 !== 0.30` rompe contabilidad). Patrones habituales:

- **Almacenar en céntimos** como enteros (`number` o [[BigInt]] si rebasan 2^53).
- Librerías tipo `decimal.js` para aritmética decimal exacta.

Relacionadas: [[js-numbers]], [[BigInt]], [[NaN]], [[type-coercion]].
