# js-strings

Los strings en JS son **primitivos inmutables** ([[js-primitive-types]]). Ningún método los modifica — todos devuelven uno nuevo.

```js
const s = "  hola  ";
s.trim();         // "hola"
console.log(s);   // "  hola  " ← sin cambios
const s2 = s.trim(); // ahora sí
```

Lección recurrente: si llamas a `s.trim()` y no asignas el resultado, **lo tiras a la basura**. Aplica a todos los métodos: `replace`, `toUpperCase`, `slice`, etc.

## Métodos clave (cheat sheet)

### Búsqueda

```js
"hello world".includes("world");    // true — preferido si solo quieres saber si está
"hello world".startsWith("hello");  // true
"hello world".endsWith("world");    // true
"hello world".indexOf("o");         // 4 — primera, -1 si no está
"hello world".lastIndexOf("o");     // 7
```

### Extracción

```js
const s = "Hello, World!";
s.slice(0, 5);    // "Hello"
s.slice(-6);      // "World!"
s.at(-1);         // "!" — moderno, índices negativos
```

`slice` admite negativos, `substring` no. **Usa `slice`** siempre. Cuidado: `slice(start, -1)` no significa "no encontrado", significa "hasta el penúltimo".

### Transformación

```js
"hola".toUpperCase();
"  hola  ".trim();             // también trimStart/trimEnd
"5".padStart(3, "0");          // "005"
"ab".repeat(3);                // "ababab"
```

### Reemplazo

```js
"hola hola".replace("hola", "x");    // "x hola" — SOLO LA PRIMERA con string
"hola hola".replaceAll("hola", "x"); // "x x" — todas, ES2021
```

### División

```js
"a,b,c".split(",");           // ["a", "b", "c"]
"a   b".split(/\s+/);          // ["a", "b"] — regex evita strings vacíos intermedios
```

## Comparación

`===` compara byte a byte. No entiende caso, acentos ni locales.

```js
"hola" === "HOLA";   // false
"Hola".toLowerCase() === "hola".toLowerCase(); // true
"á".localeCompare("b", "es"); // -1
```

Para comparar texto "que parece igual" con distinta forma Unicode → ver [[unicode-normalization]].

## Patrón: comparación robusta

```js
function eqLoose(a, b) {
  return a.normalize().toLowerCase() === b.normalize().toLowerCase();
}
```

Cubre caso (`"Café"` vs `"café"`) y normalización Unicode (`"café"` NFC vs NFD).

Relacionadas: [[template-literals]], [[unicode-in-js]], [[unicode-normalization]], [[type-coercion]].
