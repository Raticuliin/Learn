// =====================================================
// Parte 1. Map: API básica
// =====================================================

// a) Crea un Map vacío llamado `scores` y añade tres entradas en cadena:
//    "ana" -> 10, "luis" -> 8, "marta" -> 9.
//    Pista: `set` devuelve el propio Map.
const scores = new Map();
scores.set("ana", 10);
scores.set("luis", 8);
scores.set("marta", 9);

console.log(scores.size); // esperado: 3
console.log(scores.get("luis")); // esperado: 8
console.log(scores.has("pedro")); // esperado: false

// b) Borra a "luis" e imprime size.
scores.delete("luis");
console.log(scores.size); // esperado: 2

// c) Crea un Map `colors` inicializándolo directamente desde un array de pares:
//    "red" -> "#f00", "green" -> "#0f0", "blue" -> "#00f".
const colors = new Map([
  ["red", "#f00"],
  ["green", "#0f0"],
  ["blue", "#00f"],
]);
console.log(colors.get("green")); // esperado: #0f0

// d) Itera `colors` con for...of y destructuring, imprime "<name>: <hex>" por entrada.
for (const [key, value] of colors) {
  console.log(`${key}: ${value}`);
}
// esperado (orden de inserción):
// red: #f00
// green: #0f0
// blue: #00f

// =====================================================
// Parte 2. Map con claves objeto
// =====================================================

// Tienes dos objetos user. Quieres asociar a cada uno su última fecha de login.
const userA = { id: 1, name: "Ana" };
const userB = { id: 2, name: "Bob" };

// a) Crea `lastLogin` (Map) y registra:
//    userA -> "2026-05-17", userB -> "2026-05-16".
const lastLogin = new Map();
lastLogin.set(userA, "2026-05-17");
lastLogin.set(userB, "2026-05-16");

console.log(lastLogin.get(userA)); // esperado: 2026-05-17

// b) Comprueba qué pasa con un objeto distinto pero "igual" en contenido.
//    Identidad por referencia: NO es la misma clave.
const userACopy = { id: 1, name: "Ana" };
console.log(lastLogin.has(userACopy)); // esperado: false

// =====================================================
// Parte 3. Map.groupBy
// =====================================================

const orders = [
  { id: 1, status: "paid", amount: 50 },
  { id: 2, status: "pending", amount: 30 },
  { id: 3, status: "paid", amount: 80 },
  { id: 4, status: "cancelled", amount: 10 },
  { id: 5, status: "pending", amount: 20 },
];

// a) Agrupa `orders` por `status` usando Map.groupBy y guárdalo en `byStatus`.
const byStatus = Map.groupBy(orders, (order) => order.status);
console.log(byStatus.get("paid").length); // esperado: 2
console.log(byStatus.get("pending").length); // esperado: 2
console.log(byStatus.get("cancelled").length); // esperado: 1

// =====================================================
// Parte 4. Set: API básica
// =====================================================

// a) Crea un Set vacío `tags`. Añade "js", "web", "js", "node", "web".
//    Comprueba que los duplicados se ignoraron.
const tags = new Set();
tags.add("js");
tags.add("web");
tags.add("js");
tags.add("node");
tags.add("web");
console.log(tags.size); // esperado: 3
console.log(tags.has("js")); // esperado: true
console.log(tags.has("python")); // esperado: false

// b) Deduplica este array usando Set + spread, guardado en `unique`.
const withDups = [1, 1, 2, 3, 3, 3, 4, 5, 5];
const unique = [...new Set(withDups)];
console.log(unique); // esperado: [1, 2, 3, 4, 5]

// c) Itera `tags` con for...of e imprime cada uno (orden de inserción).
for (const tag of tags) {
  console.log(tag);
}
// esperado:
// js
// web
// node

// =====================================================
// Parte 5. Operaciones de conjunto
// =====================================================

const frontend = new Set(["html", "css", "js", "react"]);
const backend = new Set(["js", "node", "sql", "docker"]);

// a) Unión: tecnologías totales (sin duplicados).
const all = frontend.union(backend);
console.log([...all].sort());
// esperado: ["css", "docker", "html", "js", "node", "react", "sql"]

// b) Intersección: tecnologías que aparecen en ambos perfiles (fullstack core).
const both = frontend.intersection(backend);
console.log([...both]); // esperado: ["js"]

// c) Diferencia: tecnologías SOLO de frontend (en frontend pero no en backend).
const onlyFront = frontend.difference(backend);
console.log([...onlyFront].sort());
// esperado: ["css", "html", "react"]

// d) Diferencia simétrica: tecnologías exclusivas de uno u otro (no las compartidas).
const exclusive = frontend.symmetricDifference(backend);
console.log([...exclusive].sort());
// esperado: ["css", "docker", "html", "node", "react", "sql"]

// e) Comprueba si `mobile` es subconjunto de `frontend`.
const mobile = new Set(["html", "css"]);
const isSub = mobile.isSubsetOf(frontend);
console.log(isSub); // esperado: true

// =====================================================
// Parte 6. WeakMap
// =====================================================

// Caso: quieres asociar metadata (número de clicks) a "elementos" sin que el
// WeakMap impida que sean recolectados cuando ya nadie los use.

const clickCounts = new WeakMap();
const button = { kind: "button", label: "Save" };
const link = { kind: "link", label: "Home" };

// a) Inicializa ambos con count 0 en `clickCounts`.
clickCounts.set(button, { count: 0 });
clickCounts.set(link, { count: 0 });
console.log(clickCounts.get(button)); // esperado: { count: 0 }

// b) Define `registerClick(element)` que incrementa el `count` del elemento
//    en `clickCounts`. Si el elemento no estuviera registrado, lo añade con count 1.
//    Pista: lee primero con get, decide si existe, actualiza o crea.
function registerClick(element) {
  const meta = clickCounts.get(element);
  meta ? meta.count++ : clickCounts.set(element, { count: 1 });
}

registerClick(button);
registerClick(button);
registerClick(button);
registerClick(link);

console.log(clickCounts.get(button)); // esperado: { count: 3 }
console.log(clickCounts.get(link)); // esperado: { count: 1 }

// c) Intenta hacer `clickCounts.set("string-key", ...)`. ¿Qué pasa?
//    Envuelve en try/catch e imprime el mensaje del error.
try {
  clickCounts.set("string-key", 2);
} catch (e) {
  console.log(e.message);
}
// esperado: algo como "Invalid value used as weak map key"
