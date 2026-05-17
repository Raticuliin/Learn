# unicode-in-js

JavaScript usa **UTF-16** internamente. Casi todo el código que escribes lo trata bien, pero hay un detalle que rompe asunciones cuando aparecen emojis o alfabetos "altos" de Unicode.

## Code unit vs code point

- **Code unit**: la unidad básica de UTF-16, 16 bits.
- **Code point**: el carácter Unicode lógico.

La mayoría de caracteres (ASCII, latín, griego, cirílico…) caben en **1 code unit = 1 code point**. Pero los caracteres altos (emojis, símbolos, alfabetos asiáticos) ocupan **2 code units** (un *surrogate pair*).

```js
"a".length;     // 1
"á".length;     // 1 (NFC precompuesto)
"中".length;    // 1
"👋".length;    // 2 ← surrogate pair, no es "un caracter"
"👨‍💻".length;  // 5 ← emoji compuesto (ZWJ: persona + zero-width joiner + portátil)
```

## `length` cuenta code units, no caracteres visuales

Si te apoyas en `length` para "contar caracteres" de cara al usuario, **te equivocas con emojis**.

Para contar code points:

```js
[..."👋"].length;     // 1
[..."a👋b"].length;   // 3 (no 4 como diría .length)
```

## Acceso por índice

`s[i]` y `charAt(i)` devuelven **code units**, no code points:

```js
"👋"[0];           // "\uD83D" — half-emoji, basura
"👋".codePointAt(0); // 128075 — el code point real
String.fromCodePoint(128075); // "👋"
```

## Iteración

Tres formas, **no son equivalentes**:

```js
for (let i = 0; i < s.length; i++) console.log(s[i]); // code units
for (const ch of s) console.log(ch);                  // code points ✓
[...s];                                                // code points ✓
```

`for...of` y spread iteran por code points: correcto con emojis. El `for` por índice itera por code units: rompe.

## Reglas prácticas

| Quiero...                                         | Uso                                   |
| ------------------------------------------------- | ------------------------------------- |
| Iterar caracteres visuales / contar con emojis    | `for...of` o `[...s]`                 |
| Procesar bytes / hashes / serializar              | Los métodos modernos manejan UTF-16   |
| Validar UTF-16 bien formado (ES2024)              | `s.isWellFormed()`, `s.toWellFormed()` |
| Comparar strings que "parecen iguales"            | [[unicode-normalization]]             |

Relacionadas: [[js-strings]], [[unicode-normalization]].
