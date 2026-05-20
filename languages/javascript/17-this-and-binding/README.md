# Módulo 17 — `this` y binding

> **Aviso de contexto, viniendo de Java**: en Java `this` dentro de un método **siempre** es la instancia. Es estable, predecible, decidido al declarar el método. **En JS no**. En JS `this` se decide en cada **invocación** según *cómo* llames a la función. El mismo método puede tener un `this` distinto cada vez que se le llama. Esta diferencia es la causa de la mayoría de bugs sutiles del lenguaje. El módulo va de aprender las reglas exactas para que deje de ser magia.

## Objetivos

- Entender que `this` no se decide al declarar la función sino al **invocarla**.
- Saber las **cuatro formas de invocar** y qué `this` produce cada una.
- Reconocer la trampa clásica de **"perder `this`"** al pasar un método como callback, y los dos remedios (`bind` o arrow).
- Usar `call`, `apply` y `bind` con criterio: cuándo invocas ya y cuándo guardas una función nueva.
- Saber por qué las arrow functions tienen un `this` distinto al de las funciones tradicionales, y cuándo eso te conviene.
- Conocer `globalThis` como la referencia portable al objeto global.

---

## 1. `this` se decide al **invocar**, no al declarar

Lo primero, romper la intuición de Java:

```js
const user = {
  name: "Iván",
  greet() {
    return `hola, soy ${this.name}`;
  },
};

user.greet();           // "hola, soy Iván"   → this = user

const fn = user.greet;
fn();                   // TypeError: Cannot read properties of undefined
                        // → this = undefined (en strict)
```

Misma función, dos invocaciones, dos `this` distintos. **JS no guarda "a qué objeto pertenece" una función**: lo descubre en el momento de llamarla, mirando la sintaxis de la llamada.

### `this` en el código de top-level

Pequeño detalle que ayuda más adelante:

- En un **script** clásico (HTML `<script>` sin `type="module"`): `this` = `globalThis` (`window` en navegador).
- En un **módulo ESM** o en Node con `"type": "module"`: `this` al top-level es `undefined`.
- En un archivo CommonJS de Node (`.js` sin `"type": "module"`): `this` = `module.exports`.

No te peguemos con esto. Solo recuerda: si al imprimir `this` arriba del archivo te sale algo raro, depende del entorno.

---

## 2. Las cuatro formas de invocar y qué `this` producen

### A. Como método: `obj.fn()`

```js
user.greet();
// this = user
```

La regla: el `this` es **lo que esté a la izquierda del punto** en el momento de la llamada.

```js
const otro = { name: "Ana", greet: user.greet };
otro.greet();   // "hola, soy Ana"  →  this = otro (no user)
```

Misma función. El `this` lo decide el receptor de la llamada, no de dónde vino la función.

### B. Como función normal: `fn()`

```js
function show() {
  return this;
}
show();
// strict mode  → undefined
// sloppy mode  → globalThis
```

Sin "receptor", no hay `this` natural. **strict mode** elige `undefined` (más seguro: te avisa con TypeError si haces `this.algo`). **sloppy mode** rellena con el global (peligroso: lecturas/escrituras silenciosas al objeto global).

### C. Como constructor: `new Fn()`

```js
function Person(name) {
  this.name = name;
}
const p = new Person("Iván");  // this = la instancia nueva
```

Mención breve. La sintaxis `new` crea un objeto nuevo, lo asigna como `this`, ejecuta la función, y lo devuelve. Profundizamos en el módulo 23 (constructor functions).

### D. Llamada explícita: `fn.call(...)` / `fn.apply(...)` / `fn.bind(...)`

Tú decides el `this`. Sección 4 lo desarrolla.

---

## 3. La trampa: perder `this`

El error más común con `this`:

```js
const user = {
  name: "Iván",
  greet() {
    return `hola, soy ${this.name}`;
  },
};

// Caso 1: asignar a variable
const fn = user.greet;
fn();   // TypeError: this es undefined

// Caso 2: pasar como callback
[1, 2, 3].forEach(user.greet);   // mismo problema dentro de forEach

// Caso 3: setTimeout / event handlers (los veremos en su fase)
```

Lo importante: **arrancar el método de su objeto** lo deja sin `this` cuando se invoque después. El método no lleva consigo "a qué objeto pertenece".

### Dos arreglos

**(a) `bind(obj)`**

```js
const greet = user.greet.bind(user);
greet();                  // "hola, soy Iván"
[1, 2, 3].forEach(greet); // funciona en cada vuelta
```

`bind` devuelve una **función nueva** con `this` fijado para siempre.

**(b) arrow wrapper**

```js
const greet = () => user.greet();
greet();
```

La arrow llama a `user.greet()` con la sintaxis del punto → `this` = `user`. Coste: una función intermedia, pero queda muy idiomático.

> Patrón legacy que verás en código viejo: `const self = this;` dentro de un método para guardar el `this` en una variable cerrada antes de pasar un callback. Hoy se evita con arrows.

---

## 4. `call`, `apply`, `bind`

Las tres viven en `Function.prototype`, así que **toda función las tiene**.

### `call(thisArg, ...args)`: invocar ahora con `this` específico

```js
function intro(greeting, punct) {
  return `${greeting}, soy ${this.name}${punct}`;
}

const user = { name: "Iván" };

intro.call(user, "Hola", "!");   // "Hola, soy Iván!"
```

`intro` no tiene relación con `user`. `call` la **invoca ahora** prestándole `user` como `this`.

### `apply(thisArg, [args])`: igual pero con array de argumentos

```js
intro.apply(user, ["Buenas", "."]);  // "Buenas, soy Iván."
```

Mismo efecto que `call`, los args van en un array.

> **Alternativa moderna a `apply`**: el spread. Si solo te interesa pasar argumentos desde un array (sin querer cambiar `this`), `fn(...args)` lo reemplaza:
>
> ```js
> Math.max.apply(null, [3, 7, 2]);   // estilo legacy
> Math.max(...[3, 7, 2]);            // estilo moderno
> ```
>
> `apply` sigue siendo útil cuando **necesitas cambiar `this` Y pasar array**.

### `bind(thisArg, ...partialArgs)`: devolver función nueva con `this` (y opcionalmente argumentos) fijados

```js
const introIvan = intro.bind(user);
introIvan("Hola", "!");   // "Hola, soy Iván!"
```

A diferencia de `call`/`apply`, **no invoca**. Te da una función nueva. La función bound conserva su `this` aunque la pases por callback.

#### Partial application

`bind` también te deja **fijar argumentos** además del `this`:

```js
const shoutHi = intro.bind(user, "HOLA");
shoutHi("!");     // "HOLA, soy Iván!"
shoutHi("?");     // "HOLA, soy Iván?"
```

Útil cuando una función tiene varios argumentos y siempre vas a usar el primero (o los primeros) con el mismo valor. Si no te interesa cambiar `this`, le pasas `null` como primer argumento:

```js
function log(level, message) {
  console.log(`[${level}] ${message}`);
}

const logError = log.bind(null, "ERROR");
logError("falló X");   // [ERROR] falló X
```

---

## 5. Arrow functions y `this` léxico

Aquí la cosa cambia radicalmente:

> **Las arrow functions NO tienen su propio `this`**. Heredan el `this` del scope donde se **declararon** (no donde se llamen).

```js
const user = {
  name: "Iván",

  greetClassic: function () {
    return this.name;          // depende de CÓMO se llame
  },

  greetArrow: () => {
    return this.name;          // this aquí es el de FUERA del objeto (módulo o global)
                               // NO es user, aunque parezca que sí
  },
};

user.greetClassic();   // "Iván"
user.greetArrow();     // undefined (o error, según entorno)
```

**No definas métodos de objeto con arrow al top-level.** Las arrow ignoran el receptor del punto.

### Donde sí brillan: callbacks dentro de un método

```js
const user = {
  name: "Iván",
  friends: ["Ana", "Bea"],

  greetAll() {
    this.friends.forEach(friend => {
      console.log(`${this.name} saluda a ${friend}`);
      //           ↑ this aquí es el de greetAll, que es user. Bien.
    });
  },
};

user.greetAll();
// Iván saluda a Ana
// Iván saluda a Bea
```

Si hubieras escrito el callback con `function (friend) { ... }`, dentro `this` sería `undefined` (cada vuelta de `forEach` invoca la función con `this` = undefined). La arrow hereda el `this` del método que la rodea — exactamente lo que querías.

### `bind`/`call`/`apply` no le cambian el `this` a una arrow

```js
const arrow = () => this;
arrow.call({ name: "X" });   // sigue siendo el this léxico, no { name: "X" }
```

`bind`/`call`/`apply` sí pueden pasarle **argumentos** a una arrow, pero el `thisArg` se ignora.

---

## 6. `globalThis`

La forma portable de referirte al objeto global:

```js
globalThis           // en navegador: window
                     // en Node: global
                     // en Web Worker: self
```

Disponible desde ES2020. Antes había que ramificar (`typeof window !== "undefined" ? window : global`). Hoy `globalThis` lo cubre todo.

---

## Ejercicio

Archivo: `this-binding.js` (con esqueleto ya hecho).

Cinco partes:

1. **Las 4 formas de invocar**: observar qué `this` sale en cada caso, sobre un mismo método.
2. **Perder y recuperar `this`**: ver el TypeError de `fn()` arrancado, arreglar con `bind` y con arrow wrapper.
3. **`call` y `apply`**: aplicar una misma función a dos objetos distintos como si fuera método de ellos.
4. **`bind` para partial application**: fijar argumentos sin tocar `this` (con `null`).
5. **Arrow vs function como callback dentro de un método**: ver por qué el `this` léxico de la arrow es el que quieres.

Abre el archivo, lee los `// TODO`, rellena.

---

## Recursos

- [MDN — `this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
- [MDN — Arrow function expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [MDN — `Function.prototype.call`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call)
- [MDN — `Function.prototype.bind`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
- [javascript.info — Object methods, "this"](https://javascript.info/object-methods)
- [javascript.info — Decorators and forwarding, call/apply](https://javascript.info/call-apply-decorators)
- [javascript.info — Function binding](https://javascript.info/bind)
