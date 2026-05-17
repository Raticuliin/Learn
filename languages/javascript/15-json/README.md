# Módulo 15 — JSON

## Objetivos

- Convertir entre valores JS y texto JSON con `JSON.stringify` y `JSON.parse`.
- Usar `replacer` y `reviver` para transformar al serializar/deserializar.
- Conocer los tipos JS que JSON **no** sabe expresar y qué pasa con cada uno.
- Manejar BigInt sin perder precisión.

## Por qué importa

JSON (JavaScript Object Notation) es el formato de intercambio dominante en la web. Cada llamada a una API REST, cada `localStorage`, cada config en disco lo usa. Saber serializar y parsear bien es una de esas habilidades de las que **un fallo en silencio cuesta horas** (un BigInt que pierde dígitos, un Date que se queda como string, un Map que se serializa como `{}` vacío).

## Qué es JSON realmente

JSON soporta **seis** tipos:

- `string`
- `number` (sin distinguir int/float, y SIN soportar `Infinity` / `NaN`)
- `boolean`
- `null`
- array
- object con claves string

Y nada más. **No** existe en JSON: `undefined`, `BigInt`, `Symbol`, función, `Date`, `Map`, `Set`, regex, referencias cíclicas. Esto importa porque tus objetos JS sí tienen esos tipos y cuando los pasas por `stringify`, pasa algo con cada uno (y rara vez te avisa).

---

## Parte 1. `JSON.stringify`

### Básico

```js
JSON.stringify({ name: "Ana", age: 28 });
// '{"name":"Ana","age":28}'
```

### Pretty-print

Tercer argumento: indentación (número de espacios) o string a usar como sangría.

```js
JSON.stringify(obj, null, 2);
// '{
//   "name": "Ana",
//   "age": 28
// }'
```

### Qué hace JS con tipos que JSON no soporta

Hay tres categorías de comportamiento. Memorízalas — es la fuente del 80% de los bugs de serialización.

**a) Se omiten silenciosamente** (en propiedades de objeto):

- `undefined`
- funciones
- `Symbol`

```js
JSON.stringify({ a: 1, b: undefined, c: () => {}, [Symbol("x")]: 9 });
// '{"a":1}'   ← b, c y el symbol han desaparecido sin error
```

En arrays, `undefined` y funciones se convierten a `null` (porque "omitir" rompería los índices):

```js
JSON.stringify([1, undefined, 3]); // '[1,null,3]'
```

**b) Pierden información pero se serializan**:

- `Date` → string ISO (al deserializar te queda un string, ya no es Date).
- `Infinity` / `NaN` / `-Infinity` → `null` (sin avisar).
- `Map` / `Set` → `{}` o `[]` vacíos (sus contenidos se ignoran porque no son propiedades enumerables propias del objeto).

```js
JSON.stringify(new Date()); // '"2026-05-17T10:30:00.000Z"'
JSON.stringify(NaN);        // 'null'
JSON.stringify(new Map([["a", 1]])); // '{}'   ← ¡vacío!
```

**c) Lanzan**:

- `BigInt` → `TypeError: Do not know how to serialize a BigInt`.
- Referencias cíclicas → `TypeError: Converting circular structure to JSON`.

```js
JSON.stringify(10n); // TypeError
const a = {}; a.self = a; JSON.stringify(a); // TypeError
```

### `toJSON` — la salida de emergencia

Si un objeto tiene un método `toJSON()`, `stringify` lo llama y serializa el valor devuelto. Es lo que hace `Date` (devuelve su ISO). Puedes usarlo en tus propias clases:

```js
class Money {
  constructor(amount, currency) { this.amount = amount; this.currency = currency; }
  toJSON() { return `${this.amount} ${this.currency}`; }
}
JSON.stringify({ price: new Money(10, "EUR") });
// '{"price":"10 EUR"}'
```

### `replacer` — transformar al serializar

Segundo argumento de `stringify`. Dos formas:

**Como array** (whitelist de propiedades):

```js
JSON.stringify({ name: "Ana", password: "secret", age: 28 }, ["name", "age"]);
// '{"name":"Ana","age":28}'
```

**Como función** (transforma cada par clave-valor):

```js
JSON.stringify(user, (key, value) => {
  if (key === "password") return undefined; // omite
  if (typeof value === "bigint") return value.toString(); // serializa BigInt como string
  return value;
});
```

`undefined` en el replacer hace que la propiedad se omita.

---

## Parte 2. `JSON.parse`

### Básico

```js
JSON.parse('{"name":"Ana","age":28}'); // { name: "Ana", age: 28 }
```

Lanza `SyntaxError` si el texto no es JSON válido. Captúralo si el origen no es de confianza.

### `reviver` — transformar al deserializar

Segundo argumento. Función `(key, value)` que se llama por cada par. Devuelve lo que quieras que termine en el objeto final; `undefined` para omitir.

```js
const data = JSON.parse(text, (key, value) => {
  if (key === "createdAt") return Temporal.PlainDateTime.from(value);
  return value;
});
```

Patrón clásico: **rehidratar tipos perdidos en la serialización**. Si tu API devuelve `"2026-05-17T10:00"`, el reviver puede convertirlo de vuelta a `Temporal`.

---

## Parte 3. BigInt sin perder precisión

`JSON.stringify(123n)` lanza. Y al revés, números fuera de `Number.MAX_SAFE_INTEGER` (2^53 - 1) **pierden dígitos** al parsearse:

```js
JSON.parse('{"id": 90071992547409925}').id;
// 90071992547409924   ← perdió el último dígito
```

Para resolverlo limpiamente JS tiene dos herramientas modernas:

### `JSON.rawJSON(string)` — al serializar

Crea un valor "JSON ya formateado" que se inyecta tal cual:

```js
const replacer = (key, value) =>
  typeof value === "bigint" ? JSON.rawJSON(value.toString()) : value;

JSON.stringify({ id: 90071992547409925n }, replacer);
// '{"id":90071992547409925}'   ← número sin comillas, exacto
```

Sin `rawJSON` lo más que podrías hacer es `value.toString()` que metería comillas y lo convertiría en string.

### `context.source` — al parsear

El reviver recibe un tercer argumento `context` con `context.source` (el texto ORIGINAL del valor, sin parsear):

```js
JSON.parse('{"id": 90071992547409925}', (key, value, context) => {
  if (key === "id") return BigInt(context.source);
  return value;
});
// { id: 90071992547409925n }   ← preservado como BigInt
```

Combinados, `rawJSON` y `context.source` cubren el roundtrip BigInt → JSON → BigInt sin perder precisión y sin librerías externas.

---

## Parte 4. Cosas que NO hay que olvidar

- **`stringify` puede devolver `undefined`** si pasas algo como una función directamente: `JSON.stringify(() => {})` → `undefined` (no string).
- **Las claves siempre son strings en JSON**. Un Map con clave objeto no se puede expresar.
- **El orden de propiedades** sí se preserva en la práctica (insertion order), pero la spec de JSON no lo garantiza.
- **`JSON.parse` no acepta comentarios ni trailing commas**. Si tu input los tiene, no es JSON, es JSON5/JSONC.

---

## Ejercicio

Abre `json.js`. Se ejecuta normal:

```bash
node json.js
```

Esqueleto con `// TODO` y resultados esperados al lado.

## Recursos

- [JSON — javascript.info](https://javascript.info/json)
- [JSON.stringify — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
- [JSON.parse — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)
- [JSON.rawJSON — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/rawJSON)
