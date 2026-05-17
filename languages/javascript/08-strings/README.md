# Módulo 8. Strings en profundidad

## Objetivos

- Dominar **template literals** (interpolación, multilínea, tagged templates).
- Manejar con soltura los **métodos clave**: búsqueda, extracción, transformación, reemplazo, división.
- Interiorizar la **inmutabilidad** de strings (lo viste de pasada en módulo 3 — aquí se cierra).
- Entender Unicode lo justo para no llevarte sorpresas: **code points vs code units**, por qué `"👋".length === 2`.
- Saber qué es **normalización Unicode** y cuándo importa (comparar strings que "parecen iguales").

---

## 1. Template literals

Usan **backticks** `` ` ``, no comillas.

```js
const name = "Iván";
const greet = `Hola, ${name}!`;
```

### Interpolación

`${expresión}` evalúa cualquier expresión y la inserta como string (vía coerción — módulo 5):

```js
const a = 3, b = 4;
`Suma: ${a + b}`;                   // "Suma: 7"
`Mayúsculas: ${name.toUpperCase()}`; // "Mayúsculas: IVÁN"
`Es par: ${a % 2 === 0}`;            // "Es par: false"
```

### Multilínea

Los saltos de línea forman parte del string sin trucos:

```js
const html = `
  <div>
    <h1>${name}</h1>
  </div>
`;
```

### Tagged templates

Una función "etiqueta" un template literal y recibe sus partes:

```js
function highlight(strings, ...values) {
  return strings.reduce((acc, s, i) => acc + s + (values[i] !== undefined ? `**${values[i]}**` : ""), "");
}

highlight`Hola ${name}, tienes ${a + b} mensajes`;
// "Hola **Iván**, tienes **7** mensajes"
```

Casos reales:
- Librerías SQL/HTML que escapan input automáticamente (`sql\`SELECT * FROM users WHERE id = ${id}\``).
- Internacionalización (`i18n\`Hello ${name}\``).

Lo verás en código real, no es para escribirlo todos los días.

---

## 2. Inmutabilidad (refuerzo)

Los strings son **primitivos inmutables**. Ningún método los modifica — todos devuelven uno **nuevo**:

```js
const s = "  hola  ";
s.trim();         // "hola"
console.log(s);   // "  hola  " ← sin cambios

const s2 = s.trim(); // ahora sí lo tienes
```

Lección del módulo 5 (que cayó en Parte 5 del ejercicio de coerción): si llamas a `s.trim()` y no asignas el resultado, **lo tiras a la basura**.

Esto aplica a **todos** los métodos de string: `replace`, `toUpperCase`, `slice`, etc. Si quieres el cambio, reasigna.

---

## 3. Métodos clave

Los agrupo por propósito. La lista no es exhaustiva pero cubre el 95% del uso diario.

### Búsqueda

```js
"hello world".includes("world");        // true — ¿contiene?
"hello world".startsWith("hello");      // true
"hello world".endsWith("world");        // true
"hello world".indexOf("o");             // 4 — primera ocurrencia, -1 si no está
"hello world".lastIndexOf("o");         // 7
```

Regla: si solo quieres saber si está, **`includes`** (legible). `indexOf` solo si necesitas la posición.

### Extracción

```js
const s = "Hello, World!";

s.slice(0, 5);     // "Hello"
s.slice(7);        // "World!"
s.slice(-6);       // "World!" — desde el final
s.slice(-6, -1);   // "World"

s.at(0);           // "H"
s.at(-1);          // "!" — índice negativo, ES2022
```

`slice` admite negativos, `substring` no. **Usa `slice` siempre.** `substring` existe por legado.

`at(-1)` es la forma moderna de "último carácter". Antes: `s[s.length - 1]`.

### Transformación

```js
"hola".toUpperCase();       // "HOLA"
"HOLA".toLowerCase();       // "hola"
"  hola  ".trim();          // "hola"
"  hola  ".trimStart();     // "hola  "
"  hola  ".trimEnd();       // "  hola"
"5".padStart(3, "0");       // "005"
"5".padEnd(3, "*");         // "5**"
"ab".repeat(3);             // "ababab"
```

### Reemplazo

```js
"hola hola".replace("hola", "adiós");      // "adiós hola" — solo la PRIMERA
"hola hola".replaceAll("hola", "adiós");   // "adiós adiós" — ES2021
```

Con string como primer argumento, `replace` cambia solo la primera ocurrencia. Para todas: `replaceAll` (o regex global, módulo 63). Si vienes de Java, `replace` no se comporta como `String.replace` de Java.

### División y unión

```js
"a,b,c".split(",");        // ["a", "b", "c"]
"hola".split("");          // ["h", "o", "l", "a"]
["a", "b", "c"].join("-"); // "a-b-c"
```

Patrón habitual: `str.split(sep).map(fn).join(sep2)`.

---

## 4. Comparación

`===` compara byte a byte. **No** entiende mayúsculas/minúsculas, acentos ni locales:

```js
"hola" === "HOLA";   // false
"café" === "café";   // ⚠️ puede ser false aunque "se vean" iguales (ver §6)
```

Para comparación insensible a caso, normaliza antes:

```js
"Hola".toLowerCase() === "hola".toLowerCase(); // true
```

Para comparación con reglas de idioma (orden alfabético español, alemán, etc.):

```js
"á".localeCompare("b", "es"); // -1 — "á" va antes que "b"
```

`localeCompare` devuelve negativo / 0 / positivo (como `compareTo` de Java). Detallado en módulo 64 (Intl).

---

## 5. Iteración

Tres formas, **no son equivalentes**:

```js
const s = "ab";

for (let i = 0; i < s.length; i++) {
  console.log(s[i]);     // por índice — code units
}

for (const ch of s) {
  console.log(ch);       // for...of — code points (correcto con emojis)
}

[...s];                  // ["a", "b"] — spread también es code points
```

`for...of` y spread iteran por **code points**; el `for` por índice itera por **code units**. La diferencia importa con Unicode (siguiente sección).

---

## 6. Unicode (mínimo viable)

JavaScript usa **UTF-16** internamente. La mayoría de caracteres ocupan **1 code unit** (16 bits), pero los que están "altos" en Unicode (emojis, alfabetos raros) ocupan **2 code units** (surrogate pair).

### `length` cuenta code units, no caracteres "visuales"

```js
"a".length;     // 1
"á".length;     // 1 (precompuesto)
"👋".length;    // 2 ← emoji, surrogate pair
"👨‍💻".length;  // 5 ← emoji compuesto con ZWJ
```

Si te apoyas en `length` para "contar caracteres", **te equivocas con emojis**. Para contar code points:

```js
[..."👋"].length; // 1
```

### Acceso por índice

```js
"👋"[0]; // "\uD83D" — half emoji, basura
```

`charAt(i)` y `s[i]` te dan **code units**, no code points. Usa `for...of` o `codePointAt(i)`:

```js
"👋".codePointAt(0); // 128075 — el code point real
String.fromCodePoint(128075); // "👋"
```

### Reglas prácticas

- Para mostrar al usuario o iterar caracteres visuales → `for...of` o `[...s]`.
- Para validar longitud "cuenta exactamente X chars con emojis" → `[...s].length`.
- Para procesar bytes / serializar → no te preocupes, los métodos modernos manejan UTF-16 bien.
- Para validar UTF-16 bien formado (ES2024): `s.isWellFormed()`, `s.toWellFormed()`.

---

## 7. Normalización Unicode

Algunos caracteres tienen **varias representaciones** Unicode equivalentes:

```js
const a = "café";              // 4 code points: c-a-f-é (é precompuesto, U+00E9)
const b = "café";        // 5 code points: c-a-f-e + acento combinado (U+0301)

a === b;       // false — distintos bytes
a.length;      // 4
b.length;      // 5
```

Visualmente idénticos, lógicamente distintos. Para compararlos correctamente: `normalize()`.

```js
a.normalize() === b.normalize(); // true
```

Cuatro formas estándar: `"NFC"` (default — composición canónica), `"NFD"` (descomposición), `"NFKC"`, `"NFKD"`. Para 99% de los casos, **`normalize()` sin argumentos basta**.

¿Cuándo importa de verdad?

- Comparar texto de **distintas fuentes** (input de usuario vs base de datos, copia-pega de macOS).
- Hashes de texto, claves de Map.
- Búsqueda case-insensitive **con acentos**.

Patrón de comparación robusta:

```js
function eqLoose(a, b) {
  return a.normalize().toLowerCase() === b.normalize().toLowerCase();
}
```

---

## Ejercicio: `strings.js`

Crea `strings.js` en esta carpeta. Cada parte como bloque separado.

### Parte 1. Template literals

Escribe `buildEmail(user, items, total)` que devuelva un string multilínea así (sustituyendo los valores):

```
Hola Iván,

Tu pedido contiene:
- Manzanas
- Pan
- Leche

Total: 12.50€

Gracias por tu compra.
```

Llámalo con `buildEmail("Iván", ["Manzanas", "Pan", "Leche"], 12.5)` y comprueba la salida.

Pista: para la lista de items, te resultará útil un método de array combinado con `join`. (Si lo intentas con `for` se puede, pero hay manera más limpia con una sola expresión.)

### Parte 2. Búsqueda y extracción

Dado `const url = "https://github.com/user-name/cli-guessing-game"`:

a) `getDomain(url)`: devuelve `"github.com"`. Usa `slice` + `indexOf`.

b) `getRepoName(url)`: devuelve `"cli-guessing-game"`. Usa `slice` + `lastIndexOf` (o `split` + `at(-1)`).

c) `isHttps(url)`: devuelve `true` con `startsWith`.

### Parte 3. Transformación: `slugify`

Escribe `slugify(text)` que convierta un título a slug URL:

- A minúsculas.
- Trim de espacios al inicio y al final.
- Reemplaza espacios internos por `-`.
- Quita los acentos (normaliza y elimina los caracteres combinables).

Pruébalo con:
- `slugify("Hola Mundo")` → `"hola-mundo"`
- `slugify("  Café con Leche  ")` → `"cafe-con-leche"`
- `slugify("Año Nuevo 2026")` → `"ano-nuevo-2026"`

Pista para quitar acentos: normaliza a `"NFD"` (descompone `é` en `e` + acento), y luego usa `replace` con regex `/[̀-ͯ]/g` para borrar los caracteres combinables. (No te he dado regex aún, te paso esa línea entera: `.replace(/[̀-ͯ]/g, "")`.)

### Parte 4. División y conteo

Escribe `wordCount(text)`: devuelve el número de palabras separadas por espacios.

- `wordCount("hola mundo")` → `2`
- `wordCount("  hola   mundo  ")` → `2` (espacios extra no cuentan)
- `wordCount("")` → `0`
- `wordCount("   ")` → `0`

Pista: `trim` y luego `split`. Cuidado con el caso vacío: `"".split(" ")` da `[""]`, no `[]`.

### Parte 5. Unicode y normalización

a) Crea estas dos variables:

```js
const a = "café";
const b = "café";
```

Comprueba con `console.log`:
- `a === b`
- `a.length`, `b.length`
- `a.normalize() === b.normalize()`
- `[...a].length`, `[...b].length` (antes y después de normalizar)

Comenta lo que ves.

b) Escribe `eqLoose(a, b)`: devuelve `true` si dos strings son iguales **ignorando caso y forma de normalización**.

- `eqLoose("Café", "café")` → `true`
- `eqLoose("Hola", "HOLA")` → `true`
- `eqLoose("Hola", "Adiós")` → `false`

c) Cuenta caracteres "visuales" de `"a👋b"`:

- `"a👋b".length` → ? (compruébalo)
- `[..."a👋b"].length` → ? (compruébalo)

Comenta el porqué.

---

Cuando termines, lo revisamos juntos. Si te atascas, sigue la regla de las tres pistas.
