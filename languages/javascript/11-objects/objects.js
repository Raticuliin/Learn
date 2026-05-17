"use strict";

// =====================================================
// Parte 1. Crear objetos
// =====================================================

// a) Crea un objeto `book` con propiedades: title ("1984"), author ("Orwell"), year (1949).
const book = {
  title: "1984",
  author: "Orwell",
  year: 1949,
};
console.log(book); // esperado: { title: "1984", author: "Orwell", year: 1949 }

// b) Tienes estas variables sueltas. Crea `person` usando shorthand de propiedad.
const name = "Ivan";
const age = 30;
const person = { name, age };
console.log(person); // esperado: { name: "Ivan", age: 30 }

// c) Crea un objeto `scores` cuya clave se calcula dinámicamente.
//    La clave debe ser "level-" concatenado con el número 5, y su valor 200.
const levelNumber = 5;
const scores = { [`level-${levelNumber}`]: 200 };
console.log(scores); // esperado: { "level-5": 200 }

// d) Crea `calculator` con dos métodos usando el atajo de método:
//    - sum(a, b) → a + b
//    - mul(a, b) → a * b
const calculator = {
  sum(a, b) {
    return a + b;
  },
  mul(a, b) {
    return a * b;
  },
};
console.log(calculator.sum(2, 3)); // esperado: 5
console.log(calculator.mul(4, 5)); // esperado: 20

// =====================================================
// Parte 2. Acceder, comprobar y borrar
// =====================================================

const user = {
  name: "Ana",
  age: 28,
  "favorite color": "green",
};

// a) Lee `name` con notación punto y `favorite color` con corchetes. Imprímelos.
console.log(user.name);
console.log(user["favorite color"]);

// b) Borra la propiedad `age` de `user`.
delete user.age;
console.log(user); // esperado: { name: "Ana", "favorite color": "green" }

// c) Comprueba si `user` tiene una propiedad propia `name` y otra llamada `email`.
//    Usa `Object.hasOwn` en los dos casos. Imprime ambos resultados.
console.log(Object.hasOwn(user, "name"));
console.log(Object.hasOwn(user, "email"));
// esperado: true   false

// d) Dado este objeto, accede de forma segura a `data.user.address.city`
//    usando optional chaining. Debe imprimir undefined sin lanzar error.
const data = { user: { name: "Bob" } };
const city = data?.user?.address?.city;
console.log(city); // esperado: undefined

// =====================================================
// Parte 3. Recorrer un objeto
// =====================================================

const stock = { apple: 50, bread: 0, milk: 30, coffee: 12 };

// a) Imprime un array con las claves de `stock`.
console.log(Object.keys(stock));
// esperado: ["apple", "bread", "milk", "coffee"]

// b) Imprime un array con los valores de `stock`.
console.log(Object.values(stock));
// esperado: [50, 0, 30, 12]

// c) Recorre `stock` con `Object.entries` y un `for...of`.
//    Para cada entrada, imprime: `<clave>: <valor>` (un console.log por entrada).
for (const [key, value] of Object.entries(stock)) {
  console.log(`${key}: ${value}`);
}
// esperado (una línea por par):
// apple: 50
// bread: 0
// milk: 30
// coffee: 12

// d) Reconstruye un objeto a partir de este array de pares.
const pairs = [
  ["a", 1],
  ["b", 2],
  ["c", 3],
];
const rebuilt = Object.fromEntries(pairs);
console.log(rebuilt); // esperado: { a: 1, b: 2, c: 3 }

// =====================================================
// Parte 4. Copiar y combinar (con su trampa)
// =====================================================

const defaults = { theme: "light", lang: "es", debug: false };
const overrides = { theme: "dark", debug: true };

// a) Crea `config` combinando ambos: overrides debe ganar sobre defaults.
//    Sin mutar ninguno de los dos.
const config = { ...defaults, ...overrides };
console.log(config); // esperado: { theme: "dark", lang: "es", debug: true }
console.log(defaults); // esperado: { theme: "light", lang: "es", debug: false }  ← intacto

// b) Trampa: copia superficial. Tienes este objeto con uno anidado:
const original = { name: "Ivan", address: { city: "Madrid" } };

// Haz una copia con spread y guárdala en `copy`.
const copy = { ...original };

// Ahora modifica `copy.address.city` a "Barcelona". Comprueba qué pasa con `original`.
copy.address.city = "Barcelona";
console.log(original.address.city); // resultado: Barcelona
// Escribe aquí en un comentario por qué pasa lo que pasa:
// Porque se ha copiado la referencia del objeto. Es decir, address sigue apuntando al mismo lado

// =====================================================
// Parte 5. Congelar
// =====================================================

const settings = { version: "1.0", env: "prod" };

// a) Congela `settings`. Luego intenta cambiar `settings.env = "dev"`.
//    El archivo tiene "use strict" arriba, así que la asignación lanzará
//    TypeError (sin "use strict", Node la ignoraría silenciosamente).
//    Envuelve el intento en try/catch y haz console.log del mensaje del error.
Object.freeze(settings);

try {
  settings.version = "2.0";
} catch (e) {
  console.log(e.message);
}

console.log(settings); // esperado: { version: "1.0", env: "prod" }  ← sin cambios
console.log(Object.isFrozen(settings)); // esperado: true

// =====================================================
// Parte 6. Paso por referencia
// =====================================================

// a) Dado este objeto, escribe una función `addOne` que reciba un objeto
//    con propiedad `count` y le sume 1 a esa propiedad (mutándola).
const counter = { count: 10 };
function addOne(object) {
  object.count++;
}
addOne(counter);
console.log(counter.count); // esperado: 11

// b) Ahora una versión NO mutadora: `addOnePure` recibe un objeto y devuelve
//    un nuevo objeto con `count` incrementado en 1, sin tocar el original.
//    Pista: spread.
const counter2 = { count: 10 };
function addOnePure(object) {
  const newObject = { ...object };
  newObject.count++;
  return newObject;
}
const counter2Plus = addOnePure(counter2);
console.log(counter2.count); // esperado: 10  ← intacto
console.log(counter2Plus.count); // esperado: 11

// =====================================================
// Parte 7. Object.groupBy
// =====================================================

const products = [
  { name: "Apple", category: "fruit", price: 1.2 },
  { name: "Bread", category: "bakery", price: 2.5 },
  { name: "Milk", category: "dairy", price: 1.8 },
  { name: "Banana", category: "fruit", price: 0.9 },
  { name: "Cheese", category: "dairy", price: 5.4 },
];

// a) Agrupa `products` por `category` usando `Object.groupBy`.
const byCategory = Object.groupBy(products, (product) => product.category);
console.log(byCategory);
// esperado:
// {
//   fruit:  [{name:"Apple",...}, {name:"Banana",...}],
//   bakery: [{name:"Bread",...}],
//   dairy:  [{name:"Milk",...}, {name:"Cheese",...}]
// }

// b) Agrupa los mismos productos por rango de precio:
//    "cheap" si price < 2, "expensive" si price >= 2.
const byPriceRange = Object.groupBy(products, (product) =>
  product.price < 2 ? "cheap" : "expensive",
);
console.log(byPriceRange);
// esperado:
// {
//   cheap:     [{name:"Apple",...}, {name:"Milk",...}, {name:"Banana",...}],
//   expensive: [{name:"Bread",...}, {name:"Cheese",...}]
// }
