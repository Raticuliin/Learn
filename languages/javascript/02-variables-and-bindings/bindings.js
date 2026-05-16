"use strict";

// Paste 1. Refactor del hello.js anterior
const varNumber = 0;
const varBigInt = 0n;
const varString = "string";
const varBool = true;
const varNull = null;
const varUndefined = undefined; // No se puede no definir
const varSymbol = Symbol("0");

// Imprimir variables
console.log(`number: ${varNumber}`);
console.log(`bigInt: ${varBigInt}`);
console.log(`string: ${varString}`);
console.log(`bool: ${varBool}`);
console.log(`null: ${varNull}`);
console.log(`undefined: ${varUndefined}`);
console.log(`symbol: ${varSymbol.toString()}`);

// Variable sin declarar (probando strict-mode)

/**
 * Con use strict: ReferenceError: varSinDeclarar is not defined
 * Sin use strict:
 */
// varSinDeclarar = "variable sin declarar";

// Parte 2 TDZ en vivo
{
  // console.log(unassigned);
  // unassigned = "unassigned";
  let unassigned = "assigned";
  console.log(unassigned);
}

// Parte 3. Var se escapa
function demoVarLeak() {
  if (true) {
    var varTest = "varTest";
    let letTest = "letTest";
  }

  console.log(varTest); // Se excapa del bloque
  // console.log(letTest); // Falla
}

demoVarLeak();

function varLoop() {
  for (var i = 0; i < 3; i++) {}
  console.log(i);
}

function letLoop() {
  for (let i = 0; i < 3; i++) {}
  //console.log(i); // Falla
}

varLoop();
letLoop();
