# Módulo 12 — Destructuring

## Objetivos

- Desempaquetar arrays y objetos a variables con una sola línea.
- Dar valores por defecto cuando una pieza falta.
- Renombrar al desempaquetar un objeto.
- Combinar lo anterior con anidación (objetos dentro de objetos, arrays dentro de objetos).
- Usar destructuring en parámetros de función para APIs claras.

## Por qué importa

Hasta ahora has sacado piezas de un objeto o array así:

```js
const first = users[0];
const second = users[1];
const name = user.name;
const age = user.age;
```

Funciona, pero se vuelve ruido cuando hay muchas piezas. Destructuring permite escribirlo así:

```js
const [first, second] = users;
const { name, age } = user;
```

Mismo resultado, una línea por estructura. Es la forma idiomática moderna y la vas a ver en todos lados (imports de módulos, parámetros de React, respuestas de APIs).

---

## Parte 1. Arrays

### Básico

El lado izquierdo es un patrón con la forma de un array; cada hueco recibe el elemento en esa posición.

```js
const numbers = [10, 20, 30];
const [a, b, c] = numbers;
// a = 10, b = 20, c = 30
```

Sirve también con strings (son iterables):

```js
const [x, y] = "hi";
// x = "h", y = "i"
```

### Saltar elementos

Deja un hueco con coma para saltar una posición:

```js
const [, , third] = [10, 20, 30];
// third = 30
```

### Defaults

Si el array no tiene elemento en esa posición, la variable es `undefined`. Puedes dar un valor por defecto con `=`:

```js
const [a = 1, b = 2, c = 3] = [10, 20];
// a = 10, b = 20, c = 3
```

El default **solo se activa con `undefined`**, igual que en parámetros de función (módulo 7). `null` no lo activa.

### Rest

Recoge "todo lo demás" en un array con `...`:

```js
const [head, ...tail] = [1, 2, 3, 4];
// head = 1
// tail = [2, 3, 4]
```

Debe ir al final. `[...rest, last]` no es válido.

### Swap sin variable temporal

Truco clásico de destructuring de arrays:

```js
let a = 1;
let b = 2;
[a, b] = [b, a];
// a = 2, b = 1
```

---

## Parte 2. Objetos

### Básico

El lado izquierdo es un patrón con la forma de un objeto. Cada variable toma el valor de la propiedad con su mismo nombre.

```js
const user = { name: "Ana", age: 28 };
const { name, age } = user;
// name = "Ana", age = 28
```

**El orden no importa** (en arrays sí, en objetos no): se empareja por nombre de propiedad.

### Renombrar

Si quieres usar otro nombre de variable, escribe `propiedad: nuevoNombre`:

```js
const user = { name: "Ana", age: 28 };
const { name: userName, age: userAge } = user;
// userName = "Ana", userAge = 28
```

Los dos puntos aquí **no** son "asignar valor"; son "leer esta propiedad y guárdala como esta variable". Cuidado con confundirlos con la sintaxis del literal `{ name: "Ana" }`.

### Defaults

Mismo mecanismo que en arrays. Si la propiedad falta (es `undefined`), entra el default:

```js
const { theme = "light", lang = "es" } = { theme: "dark" };
// theme = "dark", lang = "es"
```

### Renombrar **y** dar default a la vez

Se combinan, el default va al final:

```js
const { name: userName = "anon", age: userAge = 0 } = { name: "Ana" };
// userName = "Ana", userAge = 0
```

### Rest

Recoge "todas las propiedades que no he mencionado" en un objeto:

```js
const { name, ...other } = { name: "Ana", age: 28, city: "Madrid" };
// name = "Ana"
// other = { age: 28, city: "Madrid" }
```

Útil para "quitarme una propiedad y quedarme con el resto".

---

## Parte 3. Anidado

Los patrones se combinan. Si una propiedad es un objeto, el lado izquierdo también puede ser un patrón:

```js
const response = {
  user: { name: "Ana", age: 28 },
  status: "ok",
};

const { user: { name, age }, status } = response;
// name = "Ana", age = 28, status = "ok"
// OJO: aquí "user" NO se ha declarado como variable.
```

Lo mismo con arrays dentro de objetos:

```js
const data = { items: [10, 20, 30] };
const { items: [first, second] } = data;
// first = 10, second = 20
```

Y al revés, objetos dentro de arrays:

```js
const list = [{ id: 1 }, { id: 2 }];
const [{ id: firstId }, { id: secondId }] = list;
// firstId = 1, secondId = 2
```

**Aviso útil**: el anidado falla si una pieza intermedia es `null` o `undefined` (igual que con acceso normal — `null.user` lanza). El optional chaining `?.` que viste en el módulo 4 **no** se puede usar dentro de un patrón de destructuring. Si la fuente puede ser parcial, usa defaults sobre la pieza intermedia: `const { user: { name } = {} } = response;`.

---

## Parte 4. En parámetros de función

Una función que recibe un objeto suele leer solo algunas propiedades. En vez de:

```js
function greet(options) {
  console.log(`Hi ${options.name}, you are ${options.age}`);
}
```

Destructuras en la firma directamente:

```js
function greet({ name, age }) {
  console.log(`Hi ${name}, you are ${age}`);
}
greet({ name: "Ana", age: 28 });
```

Esto es el patrón de "named arguments" en JS. La llamada `greet({ name: "Ana", age: 28 })` es autoexplicativa, no tienes que recordar el orden de parámetros.

Con defaults sobre cada propiedad:

```js
function createUser({ name = "anon", role = "guest" } = {}) {
  return { name, role };
}
createUser();                 // { name: "anon", role: "guest" }
createUser({ name: "Ana" });  // { name: "Ana", role: "guest" }
```

El `= {}` final es importante. Sin él, llamar `createUser()` sin argumentos intentaría destructurar `undefined` y lanzaría. Con `= {}`, si no pasas nada, destructura el objeto vacío y los defaults internos hacen el resto.

---

## Ejercicio

Abre `destructuring.js` y completa cada parte. El archivo tiene esqueleto con `// TODO` y el resultado esperado al lado de cada `console.log`. Reemplaza los huecos por destructuring, **no** por acceso punto/corchetes.

Pista global: si te ves escribiendo `obj.foo` o `arr[0]` para sacar piezas, considera si destructuring queda más limpio. Si no, déjalo como está; no se trata de forzar.

## Recursos

- [Destructuring assignment — javascript.info](https://javascript.info/destructuring-assignment)
- [Destructuring — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring)
