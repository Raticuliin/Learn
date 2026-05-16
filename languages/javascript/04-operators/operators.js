"use strict";

// Parte 1. Aritméticos y el lío del +
console.log(`1 + 2: resultado=${1 + 2}, typeof:${typeof (1 + 2)}`); // 3, number
console.log(`"1" + 2: resultado=${"1" + 2}, typeof:${typeof ("1" + 2)}`); // 12, string
console.log(
  `1 + "2" + 3: resultado=${1 + "2" + 3}, typeof:${typeof (1 + "2" + 3)}`,
); // 123, string
console.log(
  `"1" + 2 + 3: resultado=${"1" + 2 + 3}, typeof:${typeof ("1" + 2 + 3)}`,
); // 123, string
console.log(`4 + 3 * 2: resultado=${4 + 3 * 2}, typeof:${typeof (4 + 3 * 2)}`); // 10, number
console.log(
  `(4 + 3) * 2: resultado=${(4 + 3) * 2}, typeof:${typeof ((4 + 3) * 2)}`,
); // 14, number
console.log(`"5" - 2: resultado=${"5" - 2}, typeof:${typeof ("5" - 2)}`); // 3, number
console.log(`"abc" - 1: resultado=${"abc" - 1}, typeof:${typeof ("abc" - 1)}`); // NaN, number
console.log(`+ "42": resultado=${+"42"}, typeof:${typeof +"42"}`); // 42, number
console.log(`+ "abc": resultado=${+"abc"}, typeof:${typeof +"abc"}`); // NaN, number

// Parte 2. == vs ===
console.log(`1 == "1": ${1 == "1"}`); // true
console.log(`1 === "1": ${1 === "1"}`); // false
console.log(`0 == false: ${0 == false}`); // true
console.log(`0 === false: ${0 === false}`); // false
console.log(`"" == false: ${"" == false}`); // true
console.log(`null == undefined: ${null == undefined}`); // true, en ==, null y undefined se consideran iguales entre sí y a nada más, sin coerción.
console.log(`null === undefined: ${null === undefined}`); // false
console.log(`null == 0: ${null == 0}`); // false
console.log(`undefined == 0: ${undefined == 0}`); // false
console.log(`NaN == NaN: ${NaN == NaN}`); // false

/* 
  La diferencia entre == y === es que con === primero dice, son del mismo tipo? si no -> false,
  en cambio == primero compara los tipos, y si son diferentes intenta alinearlos
*/

// Parte 3. Lógicos que no devuelven booleans
console.log(`"hello" && 42: ${"hello" && 42}`); // 42
console.log(`0 && 42: ${0 && 42}`); // 0
console.log(`null && "x": ${null && "x"}`); // null
console.log(`"hello" || 42: ${"hello" || 42}`); // hello
console.log(`0 || "default": ${0 || "default"}`); // default
console.log(`"" || null || "found": ${"" || null || "found"}`); // found
console.log(`!"hello": ${!"hello"}`); // false
console.log(`!0: ${!0}`); // true
console.log(`!!"": ${!!""}`); // false
console.log(`!!"hola": ${!!"hola"}`); // true

// No puedeusarse como valor por defecto cuando valores falsy pueden ser legítimamente valores. por ejemplo 0 o null

// Parte 4. ?? y ?
const user = {
  name: "Ivan",
  prefs: {
    theme: "dark",
    notifications: 0,
  },
};

const ghost = null;

console.log(
  `user.prefs.notifications ?? "no preference": ${user.prefs.notifications ?? "no preference"}`,
); // 0, es ?? por lo que al ser un valor != de null o undefined lo devuelve
console.log(
  `user.prefs.notifications || "no preference" : ${user.prefs.notifications || "no preference"}`,
); // no preference, es ||, por lo que al ser un valor falsy, no lo devuelve
console.log(`user?.prefs?.theme: ${user?.prefs?.theme}`); // dark
console.log(`ghost?.prefs?.theme: ${ghost?.prefs?.theme}`); // undefined
console.log(
  `ghost?.prefs?.theme ?? "guest theme": ${ghost?.prefs?.theme ?? "guest theme"}`,
); // guest theme
console.log(`user?.sayHi?.(): ${user?.sayHi?.()}`); // undefined, ya que no existe sayHi? y devuelve undefined

// Parte 5. Spread y rest
function max(...nums) {
  let maxValue = -Infinity;

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > maxValue) maxValue = nums[i];
  }

  return maxValue;
}

// Imprimo max
console.log(max(1, 2, 3, 4, 3, 1, 23, 0, -234, 1));

const prevScores = [1, 2, 3, 4, 5];
const newScores = [6, 7, 8, 9, 10];
const allScores = [...prevScores, ...newScores];

console.log("allScores: ", allScores);

const defaults = { key: "value", key1: "value1", key2: "value2" };
const overrides = { key: "valueNuevo", key3: "value3" };
const merged = { ...defaults, ...overrides }; // Cuando haces { ...A, ...B }, JS copia las propiedades en el orden en que aparecen. Si una key se repite, la última escritura gana. Por eso overrides pisa a defaults: lo pones después.

console.log("merged: ", merged);
