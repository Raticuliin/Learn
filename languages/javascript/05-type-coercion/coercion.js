// Parte 1. Explícita a number, string y boolean
console.log(
  `"42" -> string: ${String("42")}, number: ${Number("42")}, boolean ${Boolean("42")}`,
); // "42", 42, true
console.log(
  `"42abc" -> string: ${String("42abc")}, number: ${Number("42abc")}, boolean ${Boolean("42abc")}`,
); // "42abc", NaN, true
console.log(
  `"" -> string: ${String("")}, number: ${Number("")}, boolean ${Boolean("")}`,
); // "", 0, false
console.log(
  `"   42   " -> string: ${String("   42   ")}, number: ${Number("   42   ")}, boolean ${Boolean("   42   ")}`,
); // "   42   ", 42, true
console.log(
  `true -> string: ${String(true)}, number: ${Number(true)}, boolean ${Boolean(true)}`,
); // "true", 1, true
console.log(
  `false -> string: ${String(false)}, number: ${Number(false)}, boolean ${Boolean(false)}`,
); // "false", 0, false
console.log(
  `null -> string: ${String(null)}, number: ${Number(null)}, boolean ${Boolean(null)}`,
); // "null", 0, false
console.log(
  `undefined -> string: ${String(undefined)}, number: ${Number(undefined)}, boolean ${Boolean(undefined)}`,
); // "undefined", NaN, false
console.log(
  `[] -> string: ${String([])}, number: ${Number([])}, boolean ${Boolean([])}`,
); // "", 0, true
console.log(
  `[42] -> string: ${String([42])}, number: ${Number([42])}, boolean ${Boolean([42])}`,
); // "42", 42, true
console.log(
  `[1, 2] -> string: ${String([1, 2])}, number: ${Number([1, 2])}, boolean ${Boolean([1, 2])}`,
); // "1, 2", NaN, true
console.log(
  `{} -> string: ${String({})}, number: ${Number({})}, boolean ${Boolean({})}`,
); // [object Object], NaN, true
console.log(
  `{ a: 1 } -> string: ${String({ a: 1 })}, number: ${Number({ a: 1 })}, boolean ${Boolean({ a: 1 })}`,
); // [object Object], NaN, true

// Parte 2. Coerción implícita: el + y los demás
console.log('1 + "2": ', 1 + "2"); // 12
console.log('"3" + 4 + 5: ', "3" + 4 + 5); // 345
console.log('3 + 4 + "5": ', 3 + 4 + "5"); // "75", porque 3+4 se hace con number
console.log('"5" - 2: ', "5" - 2); // 3
console.log('"5" * "2": ', "5" * "2"); // 10
console.log('"abc" - 1: ', "abc" - 1); // NaN
console.log("true + true: ", true + true); // 2
console.log('true + "true": ', true + "true"); // 1true (truetrue, porque uno de los dos es string así que lo transforma a string)
console.log("null + 1: ", null + 1); // 1
console.log("undefined + 1: ", undefined + 1); // NaN
console.log("[] + []: ", [] + []); // ""
console.log("[] + {}: ", [] + {}); // [object Object]
console.log("[1] + [2]: ", [1] + [2]); // 12
// Regla del +: cuando uno de los dos valores es, un string lo transforma a string mediante el toPrimitive

// Parte 3. Truthy/Falsy
function isTruthy(x) {
  return x ? true : false;
}

const falsyValues = [0, -0, 0n, "", null, undefined, NaN, false];
const truthyValues = [1, "0", "false", " ", [], {}, [0], () => {}];

console.log("FALSY LIST");
for (let i = 0; i < falsyValues.length; i++) {
  console.log(isTruthy(falsyValues[i]));
}

console.log("TRUTHY LIST");
for (let i = 0; i < truthyValues.length; i++) {
  console.log(isTruthy(truthyValues[i]));
}

// Parte 4. NaN y compañía
console.log("NaN === NaN: ", NaN === NaN); // False
console.log("Number.isNaN(NaN): ", Number.isNaN(NaN)); // True
console.log('Number.isNaN("NaN"): ', Number.isNaN("NaN")); // False
console.log('Number.isNaN("hola"): ', Number.isNaN("hola")); // False
console.log('isNaN("NaN"): ', isNaN("NaN")); // True
console.log('isNaN("hola"): ', isNaN("hola")); // True
console.log("isNaN(undefined): ", isNaN(undefined)); // False, es true ya que hace Number(undefined) -> NaN
console.log("Number.isNaN(undefined): ", Number.isNaN(undefined)); // False

// isNaN("hola") vs Number.isNaN("hola"): sin el Number...., primero se hace Number("hola") -> que da NaN -> isNaN(NaN) -> true

// Parte 5. Validador de input numérico
function toNumberOrNull(input) {
  if (typeof input === "number") {
    return Number.isFinite(Number(input)) ? Number(input) : null;
  }
  if (typeof input === "string") {
    if (input.trim())
      return Number.isFinite(Number(input)) ? Number(input) : null;
    return null;
  }
  return null;
}

console.log(toNumberOrNull(42)); // 42
console.log(toNumberOrNull("42")); // 42
console.log(toNumberOrNull("  3.14  ")); // 3.14
console.log(toNumberOrNull("42abc")); // null   ← Number("42abc") es NaN
console.log(toNumberOrNull("")); // null   ← OJO: Number("") es 0, no queremos eso
console.log(toNumberOrNull(null)); // null   ← OJO: Number(null) es 0
console.log(toNumberOrNull(undefined)); // null
console.log(toNumberOrNull(true)); // null   ← booleans no cuentan como número aquí
console.log(toNumberOrNull(NaN)); // null
console.log(toNumberOrNull(Infinity)); // null   ← finito o nada
console.log(toNumberOrNull([42])); // null   ← arrays no cuentan
console.log(toNumberOrNull({})); // null
console.log(toNumberOrNull("   ")); // espacios solos
console.log(toNumberOrNull("\t\n")); // whitespace
