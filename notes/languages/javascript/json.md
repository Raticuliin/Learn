# json

Formato de intercambio dominante. Solo seis tipos: `string`, `number` (sin Infinity/NaN), `boolean`, `null`, array, object. **No existe** en JSON: `undefined`, `BigInt`, `Symbol`, función, `Date`, `Map`, `Set`, regex, ciclos.

## Las tres categorías al serializar tipos no-JSON

1. **Se omiten silenciosamente** (en propiedades de objeto): `undefined`, funciones, `Symbol`.
2. **Pierden información**: `Date` → string ISO, `Infinity`/`NaN` → `null`, `Map`/`Set` → `{}` vacío.
3. **Lanzan**: `BigInt`, referencias cíclicas.

Asimetría en arrays: `undefined` y funciones se convierten a `null` (porque "omitir" rompería los índices).

## toJSON

Si un objeto tiene método `toJSON()`, `stringify` lo llama y serializa lo devuelto. Es lo que hace `Date`. Sirve en clases propias o en objetos planos:

```js
const m = { amount: 10, currency: "EUR", toJSON() { return `${this.amount} ${this.currency}`; } };
JSON.stringify({ total: m }); // '{"total":"10 EUR"}'
```

## replacer (2º arg de stringify)

- **Array**: whitelist de propiedades.
- **Función `(key, value) => ...`**: transforma cada par. `undefined` omite.

## reviver (2º arg de parse)

Función `(key, value, context)` que se llama por cada par. Devuelve lo que quieras que aparezca en el resultado; `undefined` para omitir. Patrón clave: **rehidratar tipos perdidos** (`createdAt` string → `Temporal.PlainDate`).

## BigInt sin perder precisión

Números fuera de `2^53 - 1` pierden dígitos al parsearse a `number`. Solución moderna (ES2025, Node 22+):

- **Serializar**: `JSON.rawJSON(value.toString())` desde un replacer → inyecta el número sin comillas.
- **Parsear**: `context.source` en el reviver = texto JSON crudo del valor, antes de convertirse a `number`. `BigInt(context.source)` lo preserva exacto.

## Gotchas memorables

- `JSON.stringify(undefined)` → `undefined` (no string).
- `JSON.stringify({a: undefined})` → `"{}"`. `JSON.stringify([undefined])` → `"[null]"`.
- `JSON.parse` no acepta comentarios ni trailing commas (eso sería JSONC/JSON5).

## Ver también

- [[BigInt]] · [[Temporal]] · [[js-date-legacy]]
