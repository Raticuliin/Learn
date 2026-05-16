"use strict";

// Parte 1. Declarar los 7 primitivos
const numberValue = 99;
const bigintValue = 99n;
const stringValue = "string";
const booleanValue = true;
const nullValue = null;
const undefinedValue = undefined;
const symbolValue = Symbol(0);

console.log(`numberValue: ${numberValue} (typeof: ${typeof numberValue})`);
console.log(`bigintValue: ${bigintValue} (typeof: ${typeof bigintValue})`);
console.log(`stringValue: ${stringValue} (typeof: ${typeof stringValue})`);
console.log(`booleanValue: ${booleanValue} (typeof: ${typeof booleanValue})`);
console.log(`nullValue: ${nullValue} (typeof: ${typeof nullValue})`);
console.log(
  `undefinedValue: ${undefinedValue} (typeof: ${typeof undefinedValue})`,
);
console.log(
  `symbolValue: ${symbolValue.toString()} (typeof: ${typeof symbolValue})`,
);

// Parte 2. Caza las rarezas de typeof
console.log(typeof null); // Imprime object
console.log(typeof NaN); // Imprime number
console.log(typeof []); // Imprime object
console.log(typeof function () {}); // Imprime function
console.log(typeof undeclaredVariable); // Imprime undefined

// Parte 3. Igualdad
console.log('1 == "1":', 1 == "1"); // True
console.log('1 === "1":', 1 === "1"); // False
console.log("null == undefined:", null == undefined); // True
console.log("null === undefined: ", null === undefined); // False
console.log("NaN === NaN: ", NaN === NaN); // False
console.log("Number.isNaN(NaN): ", Number.isNaN(NaN)); // True
console.log("0 === -0: ", 0 === -0); // True
console.log("Object.is(0, -0): ", Object.is(0, -0)); // False

// Parte 4. Wrapper objects
const primString = "hello";
const objString = new String("hello");

console.log("typeof prismString: ", typeof primString);
console.log("typeof objString: ", typeof objString);

console.log("primString === objString: ", primString === objString);
console.log(primString.toUpperCase()); // Funciona porque lo envuelve temporalmente en un objeto wrapper
