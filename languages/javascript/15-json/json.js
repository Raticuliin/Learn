// =====================================================
// Parte 1. stringify básico y pretty-print
// =====================================================

const user = { name: "Ana", age: 28, active: true };

// a) Serializa `user` a JSON compacto.
const json = JSON.stringify(user);
console.log(json); // esperado: {"name":"Ana","age":28,"active":true}

// b) Serializa el mismo objeto con indentación de 2 espacios.
const pretty = JSON.stringify(user, null, 2);
console.log(pretty);
// esperado (3 líneas formateadas):
// {
//   "name": "Ana",
//   ...
// }

// =====================================================
// Parte 2. Qué desaparece, qué se transforma, qué lanza
// =====================================================

// a) `undefined`, función y Symbol se omiten silenciosamente en objetos.
const messy = {
  a: 1,
  b: undefined,
  c: () => "soy función",
  d: null,
  [Symbol("hidden")]: "no me veras",
};

console.log(JSON.stringify(messy));
// esperado: {"a":1,"d":null}

// b) En arrays se convierten a null (no se pueden "omitir" sin romper índices).
const arr = [1, undefined, () => {}, 4];
console.log(JSON.stringify(arr));
// esperado: [1,null,null,4]

// c) Date → string ISO al serializar. Al parsear NO vuelve a ser Date.
const event = { name: "kickoff", at: new Date("2026-05-17T10:00:00Z") };
const serialized = JSON.stringify(event);
console.log(serialized);
// esperado: {"name":"kickoff","at":"2026-05-17T10:00:00.000Z"}

const parsed = JSON.parse(serialized);
console.log(typeof parsed.at); // esperado: string   ← ya no es Date
console.log(parsed.at instanceof Date); // esperado: false

// d) Map y Set se serializan como objeto/array VACÍOS (sus contenidos no son
//    propiedades enumerables propias). Compruébalo:
const m = new Map([
  ["a", 1],
  ["b", 2],
]);
const s = new Set([1, 2, 3]);

console.log(JSON.stringify(m));
console.log(JSON.stringify(s));
// esperado: {} y {}    (sí, Set también imprime "{}", no "[]")

// e) BigInt: lanza. Captúralo con try/catch e imprime el mensaje.
const withBig = { id: 10n };
try {
  JSON.stringify(withBig);
} catch (e) {
  console.log(e.message);
}
// esperado: algo como "Do not know how to serialize a BigInt"

// f) Referencia cíclica: lanza. Captúralo igual.
const cyc = { name: "self-ref" };
cyc.self = cyc;
try {
  JSON.stringify(cyc);
} catch (e) {
  console.log(e.message);
}
// esperado: algo como "Converting circular structure to JSON"

// =====================================================
// Parte 3. toJSON en clases propias
// =====================================================

// a) Define una clase `Money` con propiedades `amount` y `currency`, y un
//    método `toJSON()` que devuelva el string "<amount> <currency>".
//    Al serializar un objeto que la contenga, el Money debe aparecer como string.
class Money {
  // Esto se supone que no lo hemos visto...
  constructor(amount, currency) {
    this.amount = amount;
    this.currency = currency;
  }
  toJSON() {
    return `${this.amount} ${this.currency}`;
  }
}

const invoice = { id: 1, total: new Money(100, "EUR") };
console.log(JSON.stringify(invoice));
// esperado: {"id":1,"total":"100 EUR"}

// =====================================================
// Parte 4. replacer
// =====================================================

const account = {
  id: 1,
  name: "Ana",
  email: "ana@x.com",
  password: "hunter2",
  internalNotes: "no compartir",
};

// a) Usando replacer como ARRAY (whitelist), serializa solo `id`, `name` y `email`.
const publicView = JSON.stringify(account, ["id", "name", "email"]);
console.log(publicView);
// esperado: {"id":1,"name":"Ana","email":"ana@x.com"}

// b) Usando replacer como FUNCIÓN, serializa `account` omitiendo cualquier
//    propiedad cuyo nombre contenga "password" o empiece por "internal".
const safeView = JSON.stringify(account, (key, value) => {
  if (key === "password" || key.startsWith("internal")) return undefined;
  return value;
});
console.log(safeView);
// esperado: {"id":1,"name":"Ana","email":"ana@x.com"}

// =====================================================
// Parte 5. reviver — rehidratar tipos
// =====================================================

const orderJson =
  '{"id":42,"createdAt":"2026-05-17","items":[{"name":"Book","price":15}]}';

// a) Parsea `orderJson` con un reviver que convierta el valor de la propiedad
//    `createdAt` a un Temporal.PlainDate.
//    Recuerda lanzar el archivo con node --harmony-temporal json.js
const order = JSON.parse(orderJson, (key, value) => {
  if (key === "createdAt") return Temporal.PlainDate.from(value);
  return value;
});

console.log(order.id); // esperado: 42
console.log(order.createdAt.toString()); // esperado: 2026-05-17
console.log(order.createdAt instanceof Temporal.PlainDate); // esperado: true

// =====================================================
// Parte 6. BigInt sin perder precisión
// =====================================================

// a) Tienes este objeto con un BigInt. Serialízalo usando un replacer con
//    JSON.rawJSON para que el número aparezca SIN comillas y completo.
const big = { id: 90071992547409925n, name: "huge" };
const bigJson = JSON.stringify(big, (key, value) => {
  if (typeof value === "bigint") return JSON.rawJSON(value.toString());
  return value;
});
console.log(bigJson);
// esperado: {"id":90071992547409925,"name":"huge"}

// b) Ahora el camino de vuelta: parsea `bigJson` rehidratando `id` como BigInt
//    usando context.source en el reviver (tercer argumento).
const restored = JSON.parse(bigJson, (key, value, context) => {
  if (key === "id") return BigInt(context.source);
  return value;
});
console.log(typeof restored.id); // esperado: bigint
console.log(restored.id); // esperado: 90071992547409925n
console.log(restored.name); // esperado: huge

// =====================================================
// Parte 7. Pequeña sorpresa
// =====================================================

// ¿Qué crees que devuelve cada uno? Piénsalo antes de mirar el esperado.
console.log(JSON.stringify(undefined)); // esperado: undefined  (no string!)
console.log(JSON.stringify(() => 1)); // esperado: undefined
console.log(JSON.stringify(null)); // esperado: "null"     (string)
console.log(JSON.stringify({ a: undefined })); // esperado: "{}"
console.log(JSON.stringify([undefined])); // esperado: "[null]"
// La asimetría entre objetos y arrays con undefined es el detalle a recordar.
