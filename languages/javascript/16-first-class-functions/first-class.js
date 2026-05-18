// Módulo 16 — Funciones de primera clase
// Rellena los TODOs. Cada console.log tiene al lado el resultado esperado.

// ─────────────────────────────────────────────────────────
// Parte 1. Funciones como valores
// ─────────────────────────────────────────────────────────

// 1a. Guarda tres transformaciones en el array `transforms`:
//     - duplicar (n => n * 2)
//     - elevar al cuadrado
//     - negar (cambiar de signo)
// Luego, con un for...of, aplica cada una al número 5 e imprime el resultado.

const transforms = [(n) => n * 2, (n) => n ** 2, (n) => n * -1];

console.log("--- 1a ---");
// for...of que invoca cada transformación con 5
for (const item of transforms) {
  console.log(item(5));
}
// esperado:
// 10
// 25
// -5

// 1b. Guarda las mismas tres operaciones como propiedades de un objeto `ops`,
//     con keys: double, square, negate. Invócalas por el nombre de la propiedad.

const ops = {
  double: (n) => n * 2,
  square: (n) => n ** 2,
  negate: (n) => n * -1,
};

console.log("--- 1b ---");
console.log(ops.double(7)); // esperado: 14
console.log(ops.square(7)); // esperado: 49
console.log(ops.negate(7)); // esperado: -7

// ─────────────────────────────────────────────────────────
// Parte 2. Recibir funciones (callbacks)
// ─────────────────────────────────────────────────────────

// 2a. Implementa `repeat(times, action)`:
//     llama a `action(i)` con i de 0 a times-1.
function repeat(times, action) {
  for (let i = 0; i < times; i++) action(i);
}

console.log("--- 2a ---");
repeat(3, (i) => console.log(`vuelta ${i}`));
// esperado:
// vuelta 0
// vuelta 1
// vuelta 2

// 2b. Implementa `applyTwice(value, fn)`:
//     devuelve el resultado de aplicar `fn` dos veces a `value`.
//     Ejemplo: applyTwice(3, n => n + 1) === 5
function applyTwice(value, fn) {
  return fn(fn(value));
}

console.log("--- 2b ---");
console.log(applyTwice(3, (n) => n + 1)); // esperado: 5
console.log(applyTwice(2, (n) => n * n)); // esperado: 16
console.log(applyTwice("ab", (s) => s + s)); // esperado: abababab

// ─────────────────────────────────────────────────────────
// Parte 3. Devolver funciones
// ─────────────────────────────────────────────────────────

// 3a. `makeMultiplier(factor)` devuelve una función que multiplica su argumento por `factor`.
function makeMultiplier(factor) {
  return (n) => n * factor;
}

console.log("--- 3a ---");
const double = makeMultiplier(2);
const triple = makeMultiplier(3);
console.log(double(5)); // esperado: 10
console.log(triple(5)); // esperado: 15
console.log(double(triple(2))); // esperado: 12

// 3b. `makeTagger(prefix)` devuelve una función que recibe un texto y devuelve
//     `${prefix}: ${texto}`.
function makeTagger(prefix) {
  return (texto) => `${prefix}: ${texto}`;
}

console.log("--- 3b ---");
const errorTag = makeTagger("ERROR");
const infoTag = makeTagger("INFO");
console.log(errorTag("falló la conexión")); // esperado: ERROR: falló la conexión
console.log(infoTag("guardado")); // esperado: INFO: guardado

// ─────────────────────────────────────────────────────────
// Parte 4. HOF a mano
// ─────────────────────────────────────────────────────────

// 4a. Implementa `myFilter(arr, keep)` sin usar Array.prototype.filter.
//     Devuelve un nuevo array con los elementos para los que keep(item) sea truthy.
function myFilter(arr, keep) {
  const newArr = [];

  for (let item of arr) {
    if (keep(item)) newArr.push(item);
  }

  return newArr;
}

console.log("--- 4a ---");
console.log(myFilter([1, 2, 3, 4, 5], (n) => n % 2 === 0)); // esperado: [ 2, 4 ]
console.log(myFilter(["", "hola", "", "ey"], (s) => s.length > 0)); // esperado: [ 'hola', 'ey' ]

// 4b. Implementa `myMap(arr, transform)` sin usar Array.prototype.map.
//     Devuelve un nuevo array aplicando transform a cada elemento.
function myMap(arr, transform) {
  const newArr = [];

  for (const item of arr) newArr.push(transform(item));

  return newArr;
}

console.log("--- 4b ---");
console.log(myMap([1, 2, 3], (n) => n * 10)); // esperado: [ 10, 20, 30 ]
console.log(myMap(["ana", "bea"], (s) => s.toUpperCase())); // esperado: [ 'ANA', 'BEA' ]

// ─────────────────────────────────────────────────────────
// Parte 5. Función como dato vs función invocada
// ─────────────────────────────────────────────────────────

// Mira estas tres líneas. UNA está rota (lanzará TypeError),
// las otras dos funcionan pero hacen cosas distintas.
// Comenta o descomenta una a una para verlo en consola, y luego rellena las explicaciones abajo.

const nums = [10, 20, 30];

console.log("--- 5 ---");

// Línea A:
nums.forEach(console.log);

// Línea B (descomenta para ver el error y vuelve a comentar):
// nums.forEach(console.log());

// Línea C:
nums.forEach((n) => console.log(n));

// ESCRIBE AQUÍ tu explicación de cada línea (qué hace, y por qué):
//
// Línea A: llama a la función 3 veces (e imprime item, posición, array)
//
// Línea B: intenta hacer console.log() -> undefined, y te dice que undefined is not a function
//
// Línea C: para cada numero > funcion(numero)
