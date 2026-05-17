// =====================================================
// Parte 1. Crear arrays
// =====================================================

// a) Crea un array con los números del 1 al 5 usando Array.from y el segundo argumento.
const oneToFive = Array.from({ length: 5 }, (_, i) => i + 1);
console.log(oneToFive); // esperado: [1, 2, 3, 4, 5]

// b) Crea un array con 10 ceros usando Array.from o new Array + fill.
const tenZeros = Array.from({ length: 10 }, (n) => 0);
console.log(tenZeros); // esperado: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

// c) Convierte la string "hola" en un array de caracteres con Array.from.
const chars = Array.from("hola");
console.log(chars); // esperado: ["h", "o", "l", "a"]

// d) Observa el gotcha de `new Array(3)`. Imprime y comenta qué obtienes.
console.log(new Array(3)); // resultado: [<3 empty items>]
console.log(Array.of(3)); // resultado: [3]
console.log(new Array(1, 2, 3)); // resultado: [1, 2, 3]

// =====================================================
// Parte 2. Acceso a elementos
// =====================================================

const arr = ["a", "b", "c", "d", "e"];

// a) Imprime el primero y el último elemento usando .at()
console.log(arr.at(0)); // esperado: "a"
console.log(arr.at(-1)); // esperado: "e"

// b) Trunca el array a longitud 3 modificando .length.
arr.length = 3;
console.log(arr); // esperado: ["a", "b", "c"]

// =====================================================
// Parte 3. Mutadores vs inmutadores
// =====================================================

// a) Tienes este array:
const nums = [3, 1, 4, 1, 5, 9, 2, 6];

// Ordénalo ascendentemente SIN MUTAR `nums`. Guarda el resultado en `sorted`.
const sorted = nums.toSorted((a, b) => a - b);
console.log(sorted); // esperado: [1, 1, 2, 3, 4, 5, 6, 9]
console.log(nums); // esperado: [3, 1, 4, 1, 5, 9, 2, 6]  ← intacto

// b) Inviértelo SIN MUTAR `nums`. Guarda en `reversed`.
const reversed = nums.toReversed();
console.log(reversed); // esperado: [6, 2, 9, 5, 1, 4, 1, 3]
console.log(nums); // esperado: [3, 1, 4, 1, 5, 9, 2, 6]  ← intacto

// c) Devuelve un nuevo array con el elemento en índice 2 cambiado a 999. Sin mutar.
const replaced = nums.with(2, 999);
console.log(replaced); // esperado: [3, 1, 999, 1, 5, 9, 2, 6]
console.log(nums); // esperado: [3, 1, 4, 1, 5, 9, 2, 6]  ← intacto

// d) Gotcha de sort por defecto. Sin pasar comparador, mira qué pasa con números:
console.log([10, 2, 1, 100].toSorted()); // resultado:
// ¿Por qué? Escribe aquí tu explicación en un comentario:
// Porque se compara con strings, y se ordenan "alfabeticamente"

// =====================================================
// Parte 4. flat y flatMap
// =====================================================

// a) Aplana este array un solo nivel:
const nested = [[1, 2], [3, 4], [5]];
const flat1 = nested.flat();
console.log(flat1); // esperado: [1, 2, 3, 4, 5]

// b) Aplana este array completamente (cualquier profundidad):
const deeplyNested = [1, [2, [3, [4, [5]]]]];
const flatAll = deeplyNested.flat(Infinity);
console.log(flatAll); // esperado: [1, 2, 3, 4, 5]

// =====================================================
// Parte 5. map, filter, reduce
// =====================================================

// a) Dado este array de productos:
const products = [
  { name: "Manzana", price: 1.2, stock: 50 },
  { name: "Pan", price: 2.5, stock: 0 },
  { name: "Leche", price: 1.8, stock: 30 },
  { name: "Café", price: 5.4, stock: 12 },
];

// Devuelve un array con SOLO los nombres de los productos. Usa map.
const names = products.map((product) => product.name);
console.log(names); // esperado: ["Manzana", "Pan", "Leche", "Café"]

// b) Devuelve un array con SOLO los productos en stock (stock > 0). Usa filter.
const available = products.filter((product) => product.stock > 0);
console.log(available);
// esperado: [{name:"Manzana",...}, {name:"Leche",...}, {name:"Café",...}]

// c) Calcula el valor TOTAL del inventario (sumar price * stock para cada uno). Usa reduce.
const inventoryValue = products.reduce(
  (acc, producto) => acc + producto.price * producto.stock,
  0,
);
console.log(inventoryValue); // esperado: 178.8

// d) Encadenando: devuelve los NOMBRES de los productos disponibles cuyo precio < 3€.
//    Pista: filter dos veces (o filter + condición compuesta) y luego map.
const cheapAvailable = products
  .filter((producto) => producto.price < 3 && producto.stock > 0)
  .map((producto) => producto.name);

console.log(cheapAvailable); // esperado: ["Manzana", "Leche"]

// =====================================================
// Parte 6. reduce avanzado: agrupar y contar
// =====================================================

// a) Cuenta cuántas veces aparece cada letra en "abracadabra". Devuelve un objeto.
const letterCount = "abracadabra".split("").reduce((acc, ch) => {
  acc[ch] = (acc[ch] ?? 0) + 1;
  return acc;
}, {});
console.log(letterCount);
// esperado: { a: 5, b: 2, r: 2, c: 1, d: 1 }

// b) Agrupa estos usuarios por su rol. Devuelve un objeto: { admin: [...], user: [...] }
const users = [
  { name: "Ana", role: "admin" },
  { name: "Bob", role: "user" },
  { name: "Eva", role: "admin" },
  { name: "Iván", role: "user" },
];

const grouped = users.reduce((acc, u) => {
  (acc[u.role] ??= []).push(u);
  return acc;
}, {});
console.log(grouped);
// esperado:
// {
//   admin: [{name:"Ana",...}, {name:"Eva",...}],
//   user:  [{name:"Bob",...}, {name:"Iván",...}]
// }

// =====================================================
// Parte 7. Búsqueda
// =====================================================

const inventory = [
  { id: 1, name: "Manzana", stock: 50 },
  { id: 2, name: "Pan", stock: 0 },
  { id: 3, name: "Leche", stock: 30 },
  { id: 4, name: "Café", stock: 12 },
];

// a) Encuentra el producto con id === 3. Usa find.
const productById = inventory.find((item) => item.id === 3);
console.log(productById); // esperado: { id: 3, name: "Leche", stock: 30 }

// b) ¿Hay AL MENOS un producto sin stock (stock === 0)? Usa some.
const anyOutOfStock = inventory.some((item) => item.stock === 0);
console.log(anyOutOfStock); // esperado: true

// c) ¿TODOS los productos tienen nombre asignado? Usa every.
const allNamed = inventory.every((item) => item.name); // Pongo esto porque si fuera falsy no se ajustaría pero podría comprobar mas
console.log(allNamed); // esperado: true

// d) Encuentra el ÍNDICE del último producto cuyo nombre empieza con "C". Usa findLastIndex.
const lastCIndex = inventory.findLastIndex((item) => item.name.startsWith("C"));
console.log(lastCIndex); // esperado: 3
