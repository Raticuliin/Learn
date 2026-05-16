// Parte 1. if / else

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

function classify(age) {
  const n = toNumberOrNull(age);
  if (n == null) return null;
  if (n < 18) return "menor";
  else if (n < 65) return "adulto";
  else return "senior";
}

for (const item of [17, 18, 30, 65, 100, "30", null, NaN])
  console.log(classify(item));

// Parte 2. switch
function httpLabel(status) {
  switch (status) {
    case 200:
    case 201:
    case 204:
      return "ok";
    case 301:
    case 302:
      return "redirect";
    case 400:
    case 401:
    case 403:
    case 404:
      return "client error";
    case 500:
    case 502:
    case 503:
      return "server error";
    default:
      return "unknown";
  }
}

for (const item of [
  200,
  201,
  204,
  301,
  302,
  400,
  401,
  403,
  404,
  500,
  502,
  503,
  100,
  "ff",
  false,
])
  console.log(httpLabel(item));

// Parte 3. Bucles
// a
function sumTo(n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

console.log(sumTo(5));

// b
function countdown(n) {
  while (n > 0) {
    console.log(n);
    n--;
  }
}

countdown(5);

// c
function firstVowel(str) {
  let firstVowel = null;
  for (const letter of str) {
    if ("aeiouAEIOU".includes(letter)) {
      firstVowel = letter;
      break;
    }
  }
  return firstVowel;
}

console.log(firstVowel("hola, me llamo iván"));
console.log(firstVowel("hlñlkjfksjdfñlkjkj"));

// Parte 4.
const user = { name: "Ana", age: 30, role: "admin" };

function printDataForIn(object) {
  for (const key in object) {
    console.log(key, object[key]);
  }
}

function printDataForOf(object) {
  for (const [key, value] of Object.entries(object)) {
    console.log(key, value);
  }
}

printDataForIn(user);
printDataForOf(user);

// Parte 5
const grid = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

function findFirstBreak(grid, target) {
  let found = null;
  outerloop: for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === target) {
        found = [i, j];
        break outerloop;
      }
    }
  }
  return found;
}

// Prefiero esta versión, es menos código y estoy familiarizado con ella
function findFirstReturn(grid, target) {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === target) {
        return [i, j];
      }
    }
  }
  return null;
}

console.log(findFirstBreak(grid, 5));
console.log(findFirstBreak(grid, 20));

console.log(findFirstReturn(grid, 5));
console.log(findFirstReturn(grid, 20));
