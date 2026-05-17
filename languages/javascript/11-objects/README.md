# Módulo 11. Objetos

Después de arrays, la otra estructura de datos fundamental. En JS los objetos son **diccionarios**: pares clave → valor. Casi todo lo demás en el lenguaje (incluidas las propias funciones y arrays) se apoya en este modelo.

## Objetivos

- Crear y manipular objetos literal a literal: propiedades, atajos, claves calculadas.
- Acceder, comprobar y borrar propiedades con seguridad.
- Recorrer un objeto y entender por qué `for...in` casi nunca es la opción correcta.
- Copiar y combinar objetos con spread y `Object.assign`, sabiendo que es **copia superficial**.
- Distinguir congelar, sellar y prevenir extensiones.
- Interiorizar que los objetos se **pasan por referencia** y que las variables `const` no protegen su contenido.
- Reutilizar el patrón "objeto como diccionario" con `Object.groupBy` (visto desde la otra orilla en arrays).

---

## 1. Crear objetos

La forma idiomática es el **literal**:

```js
const user = {
  name: "Ivan",
  age: 30,
  "favorite color": "blue", // claves con espacios o caracteres raros van entre comillas
};
```

Las claves siempre son strings (o symbols, lo veremos mucho más adelante). Si escribes un número como clave, JS lo convierte a string por debajo.

### Claves calculadas

Si la clave la decides en tiempo de ejecución, usas corchetes en la definición:

```js
const key = "score";
const player = {
  name: "Ana",
  [key]: 100,            // equivale a score: 100
  [`level-${1 + 1}`]: true, // equivale a "level-2": true
};
```

### Atajo de propiedad (property shorthand)

Si la propiedad y la variable se llaman igual, no repitas:

```js
const name = "Bob";
const age = 25;

const user = { name, age };          // en vez de { name: name, age: age }
```

### Atajo de método

Para meter funciones como propiedades hay un atajo:

```js
const calc = {
  add(a, b) { return a + b },        // en vez de add: function (a, b) {...}
  sub(a, b) { return a - b },
};
```

---

## 2. Acceder, comprobar y borrar

```js
const user = { name: "Ivan", age: 30 };

user.name             // "Ivan"     — notación punto
user["name"]          // "Ivan"     — notación corchetes, equivale al punto
user["favorite color"] // necesaria si la clave tiene espacios o se calcula
user.email            // undefined  — leer una clave que no existe NO da error

delete user.age       // elimina la propiedad
```

### ¿Existe la propiedad?

Hay dos formas y cada una responde a una pregunta distinta:

```js
"name" in user        // true si la propiedad existe (aunque su valor sea undefined)
user.name !== undefined // true si tiene un valor distinto de undefined
```

Para comprobar propiedades **propias** (no heredadas de su cadena de prototipos — esto lo veremos mucho más adelante) la forma moderna es:

```js
Object.hasOwn(user, "name") // true
```

Reemplaza al viejo `user.hasOwnProperty("name")`, que tenía una trampa: si alguien metía una propiedad llamada `hasOwnProperty` en el objeto, se rompía. `Object.hasOwn` no tiene ese problema.

### Optional chaining (recordatorio del módulo 4)

```js
user?.address?.city   // undefined si user o address son null/undefined, sin lanzar
```

---

## 3. Recorrer un objeto

Tres métodos que devuelven arrays:

```js
const user = { name: "Ivan", age: 30, role: "admin" };

Object.keys(user)     // ["name", "age", "role"]
Object.values(user)   // ["Ivan", 30, "admin"]
Object.entries(user)  // [["name", "Ivan"], ["age", 30], ["role", "admin"]]
```

Con `entries` puedes recorrer destructurando (destructuring formal llega en el módulo 12; aquí vale con saber que `[k, v]` recoge las dos posiciones del par):

```js
for (const [key, value] of Object.entries(user)) {
  console.log(key, "->", value);
}
```

Hay también `for...in`, que recorre las claves de un objeto:

```js
for (const key in user) {
  console.log(key, user[key]);
}
```

> Recuerda lo visto en el módulo 6: **`for...in` nunca sobre arrays**. Sobre objetos sí es válido, aunque en código moderno se prefiere `Object.keys/entries` porque solo da las propiedades propias y no recorre las heredadas.

Vuelta atrás: si tienes un array de pares y quieres reconstruir el objeto, `Object.fromEntries`:

```js
Object.fromEntries([["a", 1], ["b", 2]]) // { a: 1, b: 2 }
```

---

## 4. Copiar y combinar: spread y `Object.assign`

Para copiar un objeto:

```js
const original = { a: 1, b: 2 };
const copy = { ...original };          // copia con spread (forma moderna)
const copy2 = Object.assign({}, original); // misma idea, sintaxis antigua
```

Para combinar varios, lo de la derecha gana:

```js
const defaults = { theme: "light", lang: "es" };
const overrides = { theme: "dark" };
const config = { ...defaults, ...overrides }; // { theme: "dark", lang: "es" }
```

### Trampa: la copia es **superficial**

Spread y `Object.assign` copian solo el primer nivel. Las propiedades que a su vez son objetos siguen siendo la misma referencia:

```js
const original = { name: "Ivan", address: { city: "Madrid" } };
const copy = { ...original };

copy.address.city = "Barcelona";
console.log(original.address.city); // "Barcelona" ← el objeto interno se compartía
```

Para copia profunda existe `structuredClone(original)` — lo veremos a fondo en la fase de patrones; aquí basta con saber que existe.

---

## 5. Congelar, sellar, prevenir extensiones

Tres niveles, de más restrictivo a menos:

```js
Object.freeze(obj)             // no se puede añadir, borrar ni modificar nada
Object.seal(obj)               // no se puede añadir ni borrar; sí modificar lo existente
Object.preventExtensions(obj)  // no se puede añadir; sí borrar y modificar lo existente
```

Las tres son **superficiales**: si el objeto contiene otros objetos dentro, esos siguen siendo modificables.

Detalle importante: en **modo strict** los intentos de violar la regla lanzan `TypeError`; en **modo no-strict** fallan silenciosamente (la asignación no hace nada y el programa sigue). Por eso en el ejercicio el archivo lleva `"use strict";` arriba: si no, el `try/catch` no atraparía nada.

Comprobaciones simétricas: `Object.isFrozen(obj)`, `Object.isSealed(obj)`, `Object.isExtensible(obj)`.

---

## 6. Paso por referencia

Los objetos no se copian al asignarse ni al pasarse a funciones. Lo que se mueve es la **referencia**, el "puntero" al mismo objeto en memoria:

```js
const a = { count: 0 };
const b = a;            // b apunta al mismo objeto
b.count = 5;
console.log(a.count);   // 5

function reset(obj) {
  obj.count = 0;        // muta el original
}
reset(a);
console.log(a.count);   // 0
```

Esto explica por qué `const` con un objeto **no** lo hace inmutable: `const` solo impide reasignar la variable, no modificar el contenido. Para inmutabilidad real necesitas `Object.freeze` (superficial) o `structuredClone` + no mutar.

Comparar dos objetos con `===` compara **referencias**, no contenido:

```js
{ a: 1 } === { a: 1 } // false, son dos objetos distintos
const x = { a: 1 };
x === x               // true
```

---

## 7. Patrón: objeto como diccionario, con `Object.groupBy`

En el módulo 10 agrupamos un array con `reduce` construyendo un objeto a mano. Hay un método nuevo y oficial que hace exactamente eso:

```js
const users = [
  { name: "Ana", role: "admin" },
  { name: "Bob", role: "user" },
  { name: "Eva", role: "admin" },
];

const byRole = Object.groupBy(users, (u) => u.role);
// { admin: [{name:"Ana",...}, {name:"Eva",...}], user: [{name:"Bob",...}] }
```

El objeto que devuelve es especial: no tiene heredados los métodos típicos (`hasOwnProperty`, `toString`...), justo para que ninguna clave de tus datos colisione con ellos. Por eso para comprobar claves en su resultado, **usa `Object.hasOwn`**, no `obj.hasOwnProperty`.

---

## Ejercicio

Abre `objects.js`. Tiene huecos `// TODO` con el resultado esperado al lado. Rellena cada parte.

Cuando termines, ejecuta:

```sh
node 11-objects/objects.js
```

y compara salidas. Si algo no cuadra, mira primero qué imprime y luego revisa.

---

## Recursos

- [javascript.info — Objects](https://javascript.info/object)
- [MDN — Working with objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects)
- [MDN — `Object.hasOwn`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn)
- [MDN — `Object.groupBy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy)
