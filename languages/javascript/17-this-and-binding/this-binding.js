"use strict";

// Módulo 17 — `this` y binding
// Rellena los TODOs. Cada console.log tiene al lado el resultado esperado.
// Importante: este archivo usa "use strict" para que `this` sea undefined en llamadas
// sueltas (en vez de globalThis). Es lo que queremos para ver bien las reglas.

// ─────────────────────────────────────────────────────────
// Parte 1. Las 4 formas de invocar (lo que importa: A, B, D)
// ─────────────────────────────────────────────────────────

const user = {
  name: "Iván",
  whoAmI() {
    return this;
  },
};

console.log("--- 1a: invocación como método ---");
// 1a. Invoca como método y comprueba que devuelve el objeto user.
console.log(user.whoAmI()); // esperado: { name: 'Iván', whoAmI: [Function: whoAmI] }

console.log("--- 1b: invocación como función suelta ---");
// 1b. Arranca el método del objeto: guárdalo en una variable suelta y llámalo.
//     En strict mode, this será undefined.
const fnSuelta = user.whoAmI;
console.log(fnSuelta()); // esperado: undefined

console.log("--- 1d: invocación explícita con call ---");
// 1d. Llama whoAmI con call sobre un objeto distinto.
const fakeUser = { name: "Falso" };
console.log(user.whoAmI.call(fakeUser)); // esperado: { name: 'Falso' }

// ─────────────────────────────────────────────────────────
// Parte 2. Perder y recuperar `this`
// ─────────────────────────────────────────────────────────

const greeter = {
  name: "Iván",
  greet() {
    return `hola, soy ${this.name}`;
  },
};

console.log("--- 2a: caso roto ---");
// 2a. Pasa greeter.greet como callback de forEach. Debería petar con TypeError
//     porque el this es undefined dentro del callback (strict mode).
//     Para verlo: descomenta la línea siguiente, observa el error, vuelve a comentarla.
// [1, 2, 3].forEach(greeter.greet);

console.log("--- 2b: arreglo con bind ---");
// 2b. Pasa el mismo método pero "atado" a greeter con bind.
//     El callback debería imprimir "hola, soy Iván" tres veces.
const greetBound = greeter.greet.bind(greeter);
[1, 2, 3].forEach(() => console.log(greetBound()));
// esperado:
// hola, soy Iván
// hola, soy Iván
// hola, soy Iván

console.log("--- 2c: arreglo con arrow wrapper ---");
// 2c. Mismo efecto, ahora pasa una arrow que invoca greeter.greet() con sintaxis del punto.
[1, 2, 3].forEach((i) => console.log(greeter.greet()));
// esperado:
// hola, soy Iván
// hola, soy Iván
// hola, soy Iván

// ─────────────────────────────────────────────────────────
// Parte 3. `call` y `apply`
// ─────────────────────────────────────────────────────────

// Función "huérfana": no pertenece a ningún objeto, pero usa this.name.
function intro(greeting, punct) {
  return `${greeting}, soy ${this.name}${punct}`;
}

const ana = { name: "Ana" };
const bea = { name: "Bea" };

console.log("--- 3a: call sobre dos objetos ---");
console.log(intro.call(ana, "Hola", "!")); // esperado: Hola, soy Ana!
console.log(intro.call(bea, "Buenas", ".")); // esperado: Buenas, soy Bea.

console.log("--- 3b: apply (mismo efecto, args en array) ---");
console.log(intro.apply(ana, ["Hey", "?"])); // esperado: Hey, soy Ana?

// ─────────────────────────────────────────────────────────
// Parte 4. `bind` para partial application
// ─────────────────────────────────────────────────────────

function log(level, message) {
  return `[${level}] ${message}`;
}

console.log("--- 4 ---");
// 4. Usa bind para crear dos funciones nuevas: logError y logInfo.
//    Como `log` no usa `this`, pasa `null` como thisArg.
//    Fija el primer argumento ("ERROR" / "INFO") y deja `message` para después.

const logError = log.bind(null, "ERROR");
const logInfo = log.bind(null, "INFO");

console.log(logError("falló la conexión")); // esperado: [ERROR] falló la conexión
console.log(logInfo("guardado")); // esperado: [INFO] guardado

// ─────────────────────────────────────────────────────────
// Parte 5. Arrow vs function como callback dentro de un método
// ─────────────────────────────────────────────────────────

const team = {
  captain: "Iván",
  members: ["Ana", "Bea", "Carlos"],

  // 5a. Implementa greetAll usando una **arrow** como callback de forEach,
  //     de modo que dentro del callback `this` siga siendo el objeto team.
  //     Imprime una línea por cada miembro: "<captain> saluda a <member>"
  greetAll() {
    this.members.forEach((member) => {
      console.log(`${this.captain} saluda a ${member}`);
    });
  },

  // 5b. Implementa greetAllBroken con una **function tradicional** como callback.
  //     En strict mode `this.captain` será undefined dentro del callback.
  //     Imprime cada línea (probablemente saldrá "undefined saluda a Ana"...).
  greetAllBroken() {
    this.members.forEach(function (member) {
      console.log(`${this.captain} saluda a ${member}`);
    });
  },
};

console.log("--- 5a: arrow callback (correcto) ---");
team.greetAll();
// esperado:
// Iván saluda a Ana
// Iván saluda a Bea
// Iván saluda a Carlos

console.log("--- 5b: function callback (rota a propósito) ---");
team.greetAllBroken();
// esperado (con use strict, `this` es undefined dentro del callback function):
// TypeError, o "undefined saluda a Ana" si lo blindas con ?.

// ESCRIBE AQUÍ tu explicación (una línea):
// Por qué la arrow funciona y la function no:
// Porque las arrow no tienen this interno, por lo que heredan el de justo encima, sin embargo las funciones tradicionales SI generan un this nuevo al entrar por lo que no es el que queremos
