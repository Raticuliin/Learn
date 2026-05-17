"use strict";

// Parte 1. Template literals
function buildEmail(user, items, total) {
  return `
Hola ${user},

Tu pedido contiene:\n${items.map((x) => `- ${x}`).join("\n")}

Total: ${total}€

Gracias por tu compra
  `;
}

console.log(buildEmail("Iván", ["Manzanas", "Pan", "Leche"], 12.5));

// Parte 2. Búsqueda y extracción
const url = "https://github.com/user-name/cli-guessing-game";

function getDomain(url) {
  const firstIndex = url.indexOf("://") + 3;
  const lastIndex = url.indexOf("/", firstIndex);

  return url.slice(firstIndex, lastIndex);
}

function getRepoName(url) {
  return url.split("/").at(-1);
}

function isHttps(url) {
  return url.startsWith("https");
}

console.log(getDomain(url));
console.log(getRepoName(url));
console.log(isHttps(url));

// Parte 3. slugify

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replaceAll(" ", "-")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

console.log(slugify("Hola Mundo"));
console.log(slugify(" Café con Leche "));
console.log(slugify("Año Nuevo 2026"));

// Parte 4. División y conteo

function wordCount(text) {
  const arrayText = text.trim().split(" ");
  const newArray = [];

  for (const item of arrayText) if (item != "") newArray.push(item);

  return newArray.length;
}

console.log(wordCount("hola mundo"));
console.log(wordCount(" hola mundo "));
console.log(wordCount(""));
console.log(wordCount(" "));

// Parte 5. Unicode y normalización
const a = "café";
const b = "café";

console.log(a === b);
// Es diferente
console.log(a.length);
console.log(b.length);
// Esto si funciona (normalizado)
console.log(a.normalize() === b.normalize());
// Estas no funcionan, = que arriba
console.log([...a].length);
console.log([...b].length);
// Estas funcionan
console.log([...a.normalize()].length);
console.log([...b.normalize()].length);

function eqLoose(a, b) {
  const aNormalized = a.toLowerCase().normalize();
  const bNormalized = b.toLowerCase().normalize();

  return aNormalized == bNormalized;
}

console.log(eqLoose("Café", "café"));
console.log(eqLoose("Hola", "HOLA"));
console.log(eqLoose("Hola", "Adiós"));

console.log("a👋b".length); // -> 1+2+1 = 4
console.log([..."a👋b"].length); // 1+1+1 = 3 -> Porque así se cuenta codepoints
