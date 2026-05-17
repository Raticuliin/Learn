"use strict";

// Parte 1. Declaración vs expresión

console.log(greet("Iván")); // Funciona bien

function greet(name) {
  return `Hola, ${name}!`;
}

// console.log(farewell("Iván")); // No funciona, ya que todavía no está declarada (ReferenceError)

const farewell = function (name) {
  return `Adiós, ${name}!`;
};

// Parte 2. Parámetros por defecto

function priceWithTax(price, taxRate = 0.21) {
  return price * (1 + taxRate);
}

console.log(priceWithTax(100));
console.log(priceWithTax(100, 0.1));
console.log(priceWithTax(100, undefined));
console.log(priceWithTax(100, null)); // Es 100, ya que -> taxRate = null = 0

function formatUser(name, role = "guest", isAdmin = role === "admin") {
  return {
    name: name,
    role: role,
    isAdmin: isAdmin,
  };
}

console.log(formatUser("Iván"));
console.log(formatUser("Iván", "admin"));
console.log(formatUser("Iván", "admin", false));

// Parte 3. Rest
function sum(...nums) {
  let total = 0;
  for (const n of nums) total += n;
  return total;
}

console.log(sum());
console.log(sum(1, 2, 3, 4));

function maxOf(first, ...rest) {
  let max = first;
  for (const n of rest) {
    if (max < n) max = n;
  }
  return max;
}

console.log(maxOf());
console.log(maxOf(5));
console.log(maxOf(3, 7, 2, 9, 4));

// Parte 4. Return y ASI
function makeUser(name, age) {
  return {
    name: name,
    age: age,
    adult: age >= 18,
  };
}

console.log(makeUser("Ivan", 27));

/* Devuelve undefined -> ya que solo se ejecuta hasta return
function makeUserRoto(name, age) {
  return
  {
    name: name,
    age: age,
    adult: age >= 18,
  }
}
*/

console.log(makeUserRoto("Ivan", 27));

// Parte 5. Arrow functions

const priceWithTaxArrow = (price, taxRate = 0.21) => price * (1 + taxRate);

console.log(priceWithTaxArrow(100));
console.log(priceWithTaxArrow(100, 0.1));
console.log(priceWithTaxArrow(100, undefined));
console.log(priceWithTaxArrow(100, null)); // Es 100, ya que -> taxRate = null = 0

const sumArrow = (...nums) => {
  let total = 0;
  for (const n of nums) total += n;
  return total;
};

console.log(sumArrow());
console.log(sumArrow(1, 2, 3, 4));

const userOfArrow = (name, age) => ({ name, age });

console.log(userOfArrow("Iván", 27));

//const makeGreeter = (salute) => {
//  return (name) => `${salute}, ${name}`;
//};

const makeGreeter = (salute) => (name) => `${salute}, ${name}`;

const hello = makeGreeter("Hello");
const hola = makeGreeter("Hola");

console.log(hello("Ivan"));
console.log(hola("Iván"));
