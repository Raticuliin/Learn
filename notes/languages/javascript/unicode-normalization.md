# unicode-normalization

Algunos caracteres tienen **varias representaciones** Unicode equivalentes. Mismo significado visual, distintos bytes. Si las comparas con `===`, salen distintas.

## El problema

```js
const a = "café";  // 4 code points: c-a-f-é (é precompuesto, U+00E9)
const b = "café";  // 5 code points: c-a-f-e + ́ (e + acento combinable U+0301)

a === b;       // false ← visualmente iguales, lógicamente distintos
a.length;      // 4
b.length;      // 5
```

Pasa con todo lo que lleva diacrítico, emojis modificados, ligaduras… Y más a menudo de lo que parece: macOS guarda nombres de archivo en NFD, Windows en NFC; copia-pega entre apps puede mezclar formas.

## Las 4 formas (NFC, NFD, NFKC, NFKD)

- **NFC** (Normalization Form **C**anonical Composition) — **junta** todo lo que se puede precomponer. `e + ́` → `é`. **Forma estándar, la que quieres por defecto.**
- **NFD** (Normalization Form **C**anonical **D**ecomposition) — separa todo. `é` → `e + ́`.
- **NFKC / NFKD** — versiones "compatibilidad". Más agresivas, juntan también caracteres "casi equivalentes" (ej. `ﬁ` ligadura → `f + i`). Casos de búsqueda flexible.

Para 99% de los casos: `s.normalize()` (sin argumento = NFC).

## Comparación robusta

```js
a.normalize() === b.normalize(); // true ✓
```

Para texto de fuentes mezcladas, **normaliza antes de comparar / hashear / usar como clave**:

```js
function eqLoose(a, b) {
  return a.normalize().toLowerCase() === b.normalize().toLowerCase();
}
```

## Truco: quitar acentos con NFD

`NFD` separa cada acento como code point combinable (rango U+0300–U+036F). Si después los borras, queda el carácter base limpio:

```js
"café".normalize("NFD").replace(/[̀-ͯ]/g, ""); // "cafe"
"Año".normalize("NFD").replace(/[̀-ͯ]/g, ""); // "Ano"
```

Patrón clásico de generación de slugs ([[js-strings]]).

## Cuándo importa de verdad

- Comparar inputs de **distintas fuentes** (formulario vs DB, copia-pega de macOS).
- **Hashes** o **claves de `Map`** sobre texto: si no normalizas, dos keys "iguales" terminan en buckets distintos.
- **Búsqueda case + accent insensitive**.

Cuando no importa:

- Strings construidos en el mismo programa, sin input externo.
- Cuando solo te interesa display, no comparación.

Relacionadas: [[js-strings]], [[unicode-in-js]].
