// Módulo 19 - Recursión
// Ejecutar: node recursion.js

// =====================================================
// Parte 1. factorial(n) - recursión clásica
// =====================================================

function factorial(n) {
  // Caso base:
  if (n <= 1) return 1;
  // Caso recursivo
  return factorial(n-1) * n;
}

console.log(factorial(0));   // 1
console.log(factorial(1));   // 1
console.log(factorial(4));   // 24
console.log(factorial(6));   // 720

// =====================================================
// Parte 2. sumArray(nums) - suma recursiva de un array plano
// =====================================================

function sumArray(nums) {
  // Sin for, sin reduce. Caso base: array vacío.
  // Caso recursivo: primer elemento + suma del resto.
  // (slice(1) te da "el resto")

  // Caso base:
  if (nums.length === 0) return 0;
  // Caso recursivo
  return sumArray(nums.slice(1)) + nums[0];
}

console.log(sumArray([]));          // 0
console.log(sumArray([42]));        // 42
console.log(sumArray([1, 2, 3, 4])); // 10

// =====================================================
// Parte 3. factorialAcc(n) - posición de cola + acumulador
// =====================================================

function factorialAcc(n, acc = 1) {
  // Llamada recursiva en posición de cola, arrastrando el resultado en acc.

  if (n <= 1) return acc;
  return factorialAcc(n - 1, n * acc);
}

console.log(factorialAcc(4));   // 24
console.log(factorialAcc(6));   // 720

// Ahora ejecútala con una entrada grande y MIRA qué hace Node:
try {
  console.log(factorialAcc(100000));
} catch (e) {
  console.log("threw:", e.constructor.name); // ?
}
// Escribe abajo qué esperabas frente a qué pasó de verdad.
// Tu respuesta: Lanza una excepción indicando que hay un RangeError
//

// =====================================================
// Parte 4. Recursión mutua: isEven / isOdd
// =====================================================

function isEven(n) {
  if (n === 0) return true;
  return isOdd(n - 1);
}

function isOdd(n) {
  if (n === 0) return false;
  return isEven(n-1);
}

console.log(isEven(0));   // true
console.log(isEven(10));  // true
console.log(isOdd(7));    // true
console.log(isOdd(4));    // false

// =====================================================
// Parte 5. deepSum(arr) - suma un array anidado, a cualquier profundidad
// =====================================================

function deepSum(arr) {
  let total = 0;

  for (let subArr of arr) {
    if (Array.isArray(subArr)) {
      total += deepSum(subArr);
    } else {
      total += subArr;
    }
  }

  return total;
}

console.log(deepSum([1, 2, 3]));               // 6
console.log(deepSum([1, [2, 3], 4]));          // 10
console.log(deepSum([1, [2, [3, [4, [5]]]]])); // 15

// =====================================================
// Parte 6. flatten(arr) - aplana un array anidado, en orden
// =====================================================

function flatten(arr) {
  // Devuelve un array NUEVO y plano con todos los elementos, en orden.
  // Hazlo a mano (sin arr.flat(Infinity)).

  let flattenArr = [];

  for (let subArr of arr) {
    if (Array.isArray(subArr)) {
      flattenArr.push(...flatten(subArr));
    } else {
      flattenArr.push(subArr);
    }
  }

  return flattenArr;
}

console.log(flatten([1, 2, 3]));            // [1, 2, 3]
console.log(flatten([1, [2, [3, 4]], 5]));  // [1, 2, 3, 4, 5]
console.log(flatten([[1], [[2]], [[[3]]]])); // [1, 2, 3]

// =====================================================
// Parte 7. Pregunta de comprensión
// =====================================================

// ¿Por qué la Parte 3 (acumulador, posición de cola) sigue lanzando
// RangeError en Node, aunque la llamada recursiva sea lo último que hace?
// Apunta al motor. 1-2 frases.
//
// Tu respuesta: Porque Node corre sobre el motor V8, y V8 no implementa la
// optimización de tail calls (aunque está en la spec de JS desde ES2015).
// Cada llamada apila un frame nuevo igual, esté o no en posición de cola, así
// que con n grande la pila se desborda y salta el RangeError. Solo
// JavaScriptCore (Safari/Bun) la optimizaría.
//
