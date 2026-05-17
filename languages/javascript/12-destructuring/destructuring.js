// =====================================================
// Parte 1. Arrays
// =====================================================

// a) Desempaqueta el array en tres variables: first, second, third.
const numbers = [10, 20, 30];
const [first, second, third] = numbers;
console.log(first, second, third); // esperado: 10 20 30

// b) Salta los dos primeros elementos y queda con el tercero como `bronze`.
const podium = ["gold", "silver", "bronze"];
const [, , bronze] = podium;
console.log(bronze); // esperado: bronze

// c) Defaults: el array solo tiene un elemento. `x` debe tomar 10, `y` el default 0.
const partial = [10];
const [x = 0, y = 0] = partial;
console.log(x, y); // esperado: 10 0

// d) Rest: separa el primero del resto.
const queue = [1, 2, 3, 4, 5];
const [head, ...tail] = queue;
console.log(head); // esperado: 1
console.log(tail); // esperado: [2, 3, 4, 5]

// e) Swap: intercambia los valores de `left` y `right` en UNA línea con destructuring.
let left = "L";
let right = "R";
[left, right] = [right, left];
console.log(left, right); // esperado: R L

// =====================================================
// Parte 2. Objetos
// =====================================================

// a) Desempaqueta `title` y `year` del objeto.
const book = { title: "1984", author: "Orwell", year: 1949 };
const { title, author, year } = book;
console.log(title, year); // esperado: 1984 1949

// b) Renombrado: extrae `name` como `userName` y `age` como `userAge`.
const user = { name: "Ana", age: 28 };
const { name: userName, age: userAge } = user;
console.log(userName, userAge); // esperado: Ana 28

// c) Defaults: extrae `theme` (existe) y `lang` (no existe, default "es").
const prefs = { theme: "dark" };
const { theme, lang = "es" } = prefs;
console.log(theme, lang); // esperado: dark es

// d) Renombrar + default a la vez: de `settings` saca `env` renombrado a `environment`
//    con default "dev" si no estuviera.
const settings = { version: "1.0" };
const { env: environment = "dev" } = settings;
console.log(environment); // esperado: dev

// e) Rest en objeto: saca `password` aparte y deja el resto en `safeUser`.
const account = { id: 1, name: "Ana", email: "ana@x.com", password: "secret" };
const { password, ...safeUser } = account;
console.log(password); // esperado: secret
console.log(safeUser); // esperado: { id: 1, name: "Ana", email: "ana@x.com" }

// =====================================================
// Parte 3. Anidado
// =====================================================

// a) Saca `name` y `status` en variables, sin declarar `user` como variable.
const response = {
  user: { name: "Ana", age: 28 },
  status: "ok",
};
const {
  user: { name, age },
  status,
} = response;
console.log(name, status); // esperado: Ana ok

// b) Saca el primer y segundo elemento de `items` como `firstItem` y `secondItem`,
//    y `total` aparte.
const cart = { items: [10, 20, 30], total: 60 };
const {
  items: [firstItem, secondItem],
  total,
} = cart;
console.log(firstItem, secondItem, total); // esperado: 10 20 60

// c) Lista de objetos: saca el `id` del primer producto como `firstId`
//    y el `name` del segundo como `secondName`.
const products = [
  { id: 101, name: "Apple" },
  { id: 102, name: "Bread" },
];
const [{ id: firstId }, { name: secondName }] = products;
console.log(firstId, secondName); // esperado: 101 Bread

// d) Anidado con pieza opcional: `response2` no trae `user`. Usa default `{}`
//    sobre la pieza intermedia para que `name` quede en "anon" sin lanzar error.
const response2 = { status: "empty" };
const { user: { name: name2 = "anon" } = {} } = response2;
console.log(name2); // esperado: anon
//  ^^ usa `name2` aquí porque `name` ya está declarada arriba (Parte 3a).

// =====================================================
// Parte 4. En parámetros de función
// =====================================================

// a) Reescribe `greet` para que destructure `name` y `age` en la firma,
//    en vez de leer `options.name` y `options.age` dentro del cuerpo.
function greet({ name, age }) {
  return `Hi ${name}, you are ${age}`;
}
console.log(greet({ name: "Ana", age: 28 })); // esperado: Hi Ana, you are 28

// b) Define `createUser` que acepta un objeto con `name` y `role`, con defaults
//    "anon" y "guest". Debe poder llamarse SIN argumentos sin lanzar error.
function createUser({ name = "anon", role = "guest" } = {}) {
  return { name, role };
}
console.log(createUser()); // esperado: { name: "anon", role: "guest" }
console.log(createUser({ name: "Ana" })); // esperado: { name: "Ana",  role: "guest" }
console.log(createUser({ role: "admin" })); // esperado: { name: "anon", role: "admin" }

// =====================================================
// Parte 5. Caso práctico
// =====================================================

// Esta es una respuesta como las que devuelve una API.
const apiResponse = {
  data: {
    user: {
      id: 1,
      profile: { firstName: "Ana", lastName: "García" },
      settings: { theme: "dark", notifications: true },
    },
    meta: { requestId: "abc-123" },
  },
  status: 200,
};

// a) En UNA sola sentencia de destructuring, extrae:
//    - firstName y lastName
//    - theme (renombrado a uiTheme)
//    - requestId
//    - status
//    Pista: anidado profundo. Acepta paréntesis y saltos de línea para legibilidad.
const {
  data: {
    user: {
      id,
      profile: { firstName, lastName },
      settings: { theme: uiTheme, notifications },
    },
    meta: { requestId },
  },
  status: status2,
} = apiResponse;
console.log(firstName, lastName, uiTheme, requestId, status2);
// esperado: Ana García dark abc-123 200
