# Módulo 9. Numbers

## Objetivos

- Entender la **representación interna** (`IEEE-754 double precision`) y por qué `0.1 + 0.2 !== 0.3`.
- Conocer los **límites** del tipo `number` y cuándo necesitas `BigInt`.
- Manejar los **métodos estáticos** clave de `Number` y los del objeto `Math`.
- Saber comparar floats sin meter la pata (`EPSILON`).

---

## 1. IEEE-754: cómo guarda JS los números

Todos los `number` en JS son **floats de 64 bits** según el estándar IEEE-754 "double precision". **No hay enteros separados de decimales**: `1` y `1.0` son exactamente el mismo valor.

Estructura interna del double (no la tienes que memorizar, solo entiende que existe):

```
[ 1 bit signo ][ 11 bits exponente ][ 52 bits mantisa ]
```

Consecuencias prácticas:

### 1.1 Aritmética decimal no es exacta

```js
0.1 + 0.2;             // 0.30000000000000004
0.1 + 0.2 === 0.3;     // false
```

No es un "bug de JS" — es **cómo funcionan los floats en cualquier lenguaje** (Java, C, Python — todos lo padecen). El problema es que `0.1` no se puede representar exactamente en binario, igual que `1/3` no se puede en decimal.

### 1.2 Comparación de floats: usa `EPSILON`

Para "casi igual" (con tolerancia razonable):

```js
function approxEq(a, b) {
  return Math.abs(a - b) < Number.EPSILON;
}

approxEq(0.1 + 0.2, 0.3); // true
```

`Number.EPSILON` (~`2.22e-16`) es la diferencia mínima representable entre `1` y el siguiente float. Para magnitudes mayores que ~1, sirve. Para floats grandes (`1e10` y arriba) hay que escalar la tolerancia, pero para uso normal vale.

### 1.3 Enteros seguros

JS puede representar enteros exactamente solo hasta `2^53 - 1`:

```js
Number.MAX_SAFE_INTEGER;     // 9007199254740991 (2^53 - 1)
Number.MIN_SAFE_INTEGER;     // -9007199254740991

9007199254740992 === 9007199254740993; // ¡true! — se pierde precisión
```

A partir de ahí, los enteros consecutivos dejan de ser distinguibles. Si trabajas con IDs grandes (snowflake IDs de Twitter, identificadores de DB de 64 bits), entras en territorio de **`BigInt`** (§3).

### 1.4 `Infinity` y `-Infinity`

División por cero **no lanza** — devuelve `Infinity`:

```js
1 / 0;           // Infinity
-1 / 0;          // -Infinity
1 / Infinity;    // 0
Infinity - Infinity; // NaN
```

Existe `Number.POSITIVE_INFINITY` y `Number.NEGATIVE_INFINITY` (alias).

---

## 2. Métodos estáticos de `Number`

Los `isXxx` son las versiones **fiables**, sin la coerción que tienen los globales:

```js
Number.isNaN(NaN);          // true
Number.isNaN("hello");      // false  ← global isNaN("hello") daría true (coerciona)

Number.isFinite(Infinity);  // false
Number.isFinite("42");      // false  ← global isFinite("42") daría true

Number.isInteger(3);        // true
Number.isInteger(3.0);      // true (3.0 === 3 en JS)
Number.isInteger(3.5);      // false

Number.isSafeInteger(2 ** 53);     // false (justo fuera del rango seguro)
Number.isSafeInteger(2 ** 53 - 1); // true
```

Regla: **usa siempre `Number.isXxx`**, no los globales `isNaN`/`isFinite`. Lo viste en módulo 5 con `NaN` — aquí cierra el círculo.

### Conversión a string con formato

```js
(1234.5678).toFixed(2);       // "1234.57"  — string, no number
(1234.5678).toPrecision(4);   // "1235"
(0.000001).toExponential(2);  // "1.00e-6"
(255).toString(16);            // "ff"  — base 2-36
```

Ojo: **devuelven string**, no number. Para volver a number, `Number(...)` o `+`.

---

## 3. `BigInt`

Tipo primitivo aparte para enteros de **precisión arbitraria**. Lo distingues con la `n` final.

```js
const big = 9007199254740993n;
typeof big;          // "bigint"
big + 1n;            // 9007199254740994n
```

### Reglas duras

- **No se mezcla con `number`**: `5n + 5` lanza `TypeError`. Convierte explícitamente: `5n + BigInt(5)` o `Number(5n) + 5`.
- **División trunca**: `7n / 2n === 3n`, no `3.5n`. BigInt es solo enteros.
- **No tiene decimales**. Punto.
- **No funciona con `Math`**: `Math.max(1n, 2n)` lanza error.

### Cuándo usarlo

- IDs muy grandes (Twitter Snowflake IDs, identificadores de DB de 64 bits, blockchain).
- Aritmética exacta con enteros gigantes (criptografía didáctica, contadores que rebasan `2^53`).

Cuando NO usarlo: dinero, decimales, cualquier cálculo que no sea entero. (Para dinero, lo habitual hoy es **representar en céntimos** como enteros `number`, o usar una librería tipo `decimal.js`.)

### Gotcha: `JSON.stringify` con BigInt

```js
JSON.stringify({ id: 123n }); // TypeError: Do not know how to serialize a BigInt
```

`JSON.stringify` **no soporta BigInt**. Las soluciones habituales:

```js
JSON.stringify({ id: 123n.toString() });  // serializa como string
// O usando replacer:
JSON.stringify({ id: 123n }, (k, v) => typeof v === "bigint" ? v.toString() : v);
```

Si trabajas con APIs que devuelven IDs de 64 bits, **se reciben como string** del backend casi siempre por esta razón.

---

## 4. `Math`

Objeto con métodos y constantes matemáticas. **No es un constructor** — todos sus miembros son `static`.

### Lo esencial

```js
Math.PI;                     // 3.141592653589793
Math.E;                       // 2.718281828459045

Math.abs(-5);                 // 5
Math.sign(-3);                // -1 (también 1, 0, -0, NaN)

Math.floor(3.7);              // 3
Math.ceil(3.2);               // 4
Math.round(3.5);              // 4 — half-away-from-zero PERO ojo con negativos
Math.trunc(3.7);              // 3
Math.trunc(-3.7);             // -3 (corta hacia 0, distinto de floor)

Math.max(1, 5, 3);            // 5
Math.min(1, 5, 3);            // 1
Math.max(...[1, 5, 3]);        // 5 (con spread sobre array)

Math.pow(2, 10);              // 1024 — equivalente a 2 ** 10
Math.sqrt(16);                // 4
Math.cbrt(27);                // 3

Math.log(Math.E);             // 1 — log natural (ln)
Math.log10(1000);             // 3
Math.log2(8);                 // 3

Math.random();                // [0, 1) — entre 0 inclusive y 1 exclusive
```

### Trampa de `Math.round` con negativos

```js
Math.round(0.5);    // 1
Math.round(-0.5);   // 0  ← redondea hacia +∞, no hacia el más alejado del cero
Math.round(-1.5);   // -1 ← idem
```

`Math.round` redondea **hacia +infinito** en empates, no "lejos de cero". Si necesitas "lejos de cero", combinas `Math.sign` y `Math.abs` o usas un helper.

### Entero aleatorio en rango

Idiom clásico (ya lo usaste en el proyecto integrador 1):

```js
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
```

`Math.random` da `[0, 1)`. Multiplicas por el rango, redondeas hacia abajo, sumas el mínimo.

---

## 5. Conversión de string a number

Recordatorio del módulo 5, con los matices:

```js
Number("42");        // 42
Number("42.5");      // 42.5
Number("");          // 0       ← gotcha
Number("  42  ");    // 42      (trim implícito)
Number("42abc");     // NaN
Number(null);        // 0       ← gotcha
Number(undefined);   // NaN
Number(true);        // 1
Number([]);          // 0       ← gotcha
Number([42]);        // 42      ← gotcha
```

Para parsing más permisivo (ignora basura al final):

```js
parseInt("42abc", 10);     // 42
parseFloat("3.14abc");     // 3.14
parseInt("0xff", 16);      // 255
```

**Siempre pasa el radix a `parseInt`** (el segundo argumento). Sin él, hay reglas históricas raras con strings que empiezan por `0` (legacy octal).

Tu **función pura `parseGuess`** del proyecto 1 es exactamente este patrón aplicado.

---

## Ejercicio: `numbers.js`

Crea `numbers.js` en esta carpeta. Cada parte como bloque separado, con `console.log` y comentarios de qué esperas que imprima antes de ejecutar.

### Parte 1. IEEE-754 en vivo

a) Imprime estos cuatro valores y comenta qué obtienes:

```js
0.1 + 0.2
0.1 + 0.2 === 0.3
0.1 + 0.2 - 0.3
Number.EPSILON
```

b) Escribe `approxEq(a, b, eps = Number.EPSILON)` que devuelva `true` si `|a - b| < eps`.

Pruébalo con (la diferencia entre `1` y `1.0000000001` es `1e-10`):

- `approxEq(0.1 + 0.2, 0.3)` → `true` (diferencia ~5.5e-17, menor que `EPSILON` ~2.22e-16).
- `approxEq(1, 1.0000000001)` → `false` (diferencia `1e-10`, mayor que `EPSILON`).
- `approxEq(1, 1.0000000001, 1e-11)` → `false` (tolerancia más estricta que la diferencia).
- `approxEq(1, 1.0000000001, 1e-9)` → `true` (tolerancia más laxa que la diferencia).

### Parte 2. Números estáticos

Escribe `classifyNumber(value)` que devuelva uno de estos strings (en orden de prioridad, primer match gana):

- `"not-a-number"` si no es un number o es NaN.
- `"infinity"` si es `Infinity` o `-Infinity`.
- `"unsafe-integer"` si es entero pero fuera del rango seguro.
- `"integer"` si es entero seguro.
- `"float"` si es number normal con decimales.

Pruébalo con: `NaN`, `Infinity`, `-Infinity`, `2 ** 53`, `2 ** 53 - 1`, `42`, `3.14`, `"42"`, `null`.

Pista: usa `Number.isXxx`, no los globales.

### Parte 3. BigInt

a) Crea `const big = 2n ** 64n - 1n;` (máximo entero sin signo de 64 bits).

Imprime:
- `big`
- `typeof big`
- `big + 1n`
- `Number(big)` (¿qué pasa con la precisión?)

b) Intenta `big + 1` (sin la `n`). Captura el error con `try/catch` y muestra el mensaje. (`try/catch` lo vemos a fondo en módulo 39, pero el patrón básico es: `try { ... } catch (e) { console.log(e.message); }`. Te lo regalo para este ejercicio.)

c) Serializa a JSON un objeto con BigInt usando el patrón del replacer:

```js
const data = { userId: 9876543210987654321n, name: "Iván" };
const json = JSON.stringify(data, (k, v) => typeof v === "bigint" ? v.toString() : v);
console.log(json);
```

Comenta lo que ves.

### Parte 4. Math en acción

a) `clamp(value, min, max)`: devuelve `value` recortado al rango `[min, max]`. Usa `Math.min` y `Math.max`.

- `clamp(5, 0, 10)` → `5`
- `clamp(-3, 0, 10)` → `0`
- `clamp(15, 0, 10)` → `10`

b) `roundTo(value, decimals)`: redondea a N decimales devolviendo un **number** (no string).

- `roundTo(3.14159, 2)` → `3.14`
- `roundTo(0.1 + 0.2, 4)` → `0.3`
- `roundTo(1234.5, 0)` → `1235` (o `1234` por el truco del half-to-even — observa)

Pista: el patrón clásico es `Math.round(value * 10**decimals) / 10**decimals`. Ojo, `toFixed` devuelve string.

c) `randInt(min, max)`: el del proyecto 1, copia o reescribe. Genera 10 con `randInt(1, 6)` y comenta si la distribución parece uniforme.

### Parte 5. Conversión robusta

Reescribe `toNumberOrNull(input)` (lo viste en módulo 5):

- Acepta un input cualquiera.
- Devuelve `number` si es convertible a un number finito que **no sea entero fuera del rango seguro**.
- Devuelve `null` en cualquier otro caso (incluido `null`, `undefined`, arrays, objetos, strings basura, `""`, `Infinity`, NaN…).

Pruébalo con: `"42"`, `"3.14"`, `""`, `"abc"`, `null`, `undefined`, `[]`, `[42]`, `Infinity`, `NaN`, `true`, `2 ** 53` (debería devolver null por unsafe).

---

Cuando termines, lo revisamos. Regla de las tres pistas como siempre.
