// Parte 1. IEE-754 en vivo

console.log(0.1 + 0.2); // No imprime 0.3 -> ya que 0.1 no se puede representar en bin
console.log(0.1 + 0.2 === 0.3); // Da false por lo de arriba
console.log(0.1 + 0.2 - 0.3); // Da un número muy pequeño (lo que sobra)
console.log(Number.EPSILON); // Diferencia mínima representable entre 1 y el siguiente float

function approxEq(a, b, eps = Number.EPSILON) {
  return Math.abs(a - b) < eps;
}

console.log(approxEq(0.1 + 0.2, 0.3));
console.log(approxEq(1, 1.0000000001));
console.log(approxEq(1, 1.0000000001, 1e-9));
console.log(approxEq(1, 1.0000000001, 1e-8));

// Parte 2. Número estáticos
function classifyNumber(value) {
  if (typeof value !== "number" || Number.isNaN(value)) return "not-a-number";
  if (!Number.isFinite(value)) return "infinity";
  if (Number.isInteger(value)) {
    if (!Number.isSafeInteger(value)) return "unsafe-integer";
    return "integer";
  }
  return "float";
}

for (const value of [
  NaN,
  Infinity,
  -Infinity,
  2 ** 53,
  2 ** 53 - 1,
  42,
  3.14,
  "42",
  null,
]) {
  console.log(classifyNumber(value));
}

// Parte 3. BigInt
const big = 2n ** 64n - 1n;

console.log(big);
console.log(typeof big);
console.log(big + 1n);
console.log(Number(big)); // Se desajusta la precisión

try {
  console.log(big + 1); // Se romple... (annot mix BigInt and other types, use explicit conversions)
} catch (e) {
  console.log(e.message);
}

const data = { userId: 9876543210987654321n, name: "Iván" };
const json = JSON.stringify(data, (k, v) =>
  typeof v === "bigint" ? v.toString() : v,
);
console.log(json); // Me genera un objeto, lo importante es que el bigint se ve bien

// Parte 4. Math en acción
function clamp(value, min, max) {
  if (Math.min(value, min) == value) return min;
  if (Math.max(value, max) == value) return max;
  return value;
}

console.log(clamp(5, 0, 10));
console.log(clamp(-3, 0, 10));
console.log(clamp(15, 0, 10));

function roundTo(value, decimals) {
  return +Math.round(value * 10 ** decimals) / 10 ** decimals;
}

console.log(roundTo(3.14159, 2));
console.log(roundTo(0.1 + 0.2, 4));
console.log(roundTo(1234.5, 0));

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// La distribución, parece uniforme
for (let i = 0; i < 10; i++) {
  console.log(randInt(1, 6));
}

// Parte 5. Conversión robusta
function toNumberOrNull(input) {
  if (typeof input !== "number" && typeof input !== "string") return null;

  const n = Number(input);

  if (!Number.isFinite(n)) return null;
  if (Number.isInteger(n) && !Number.isSafeInteger(n)) return null;

  return n;
}

for (const num of [
  "42",
  "3.14",
  "",
  "abc",
  null,
  undefined,
  [],
  [42],
  Infinity,
  NaN,
  true,
  2 ** 53,
])
  console.log(toNumberOrNull(num));
