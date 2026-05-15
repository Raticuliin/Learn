//'use strict';

// Declaración de variables
let varNumber = 0;
let varBigInt = 0n;
let varString = "string";
let varBool = true;
let varNull = null;
let varUndefined;
let varSymbol = Symbol("0");

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
varSinDeclarar = "variable sin declarar";
