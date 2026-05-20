# this-binding

`this` en JavaScript se decide en cada **invocación**, no al declarar la función. La misma función puede tener un `this` distinto cada vez que se llama. Es el detalle que rompe la intuición que viene de Java/C#, donde `this` está fijado al método.

## La regla central

JS mira **cómo** llamas a la función, no de dónde salió:

```js
const user = {
  name: "Iván",
  greet() {
    return `hola, soy ${this.name}`;
  },
};

user.greet();           // this = user           → "hola, soy Iván"

const fn = user.greet;
fn();                   // this = undefined      → TypeError en strict mode

[1, 2, 3].forEach(user.greet);
// this = undefined en cada vuelta → TypeError
```

Misma función, tres llamadas, tres `this` distintos. La función **no recuerda** a qué objeto pertenece.

## Las cuatro formas de invocar

1. **Como método** — `obj.fn()` → `this` es lo que esté **a la izquierda del punto**.
2. **Como función suelta** — `fn()` → `undefined` en strict mode; `globalThis` en sloppy mode ([[strict-mode]]).
3. **Como constructor** — `new Fn()` → `this` es la instancia recién creada (se profundiza en el módulo de constructores).
4. **Llamada explícita** — `fn.call(obj, ...)` / `fn.apply(obj, [...])` / `fn.bind(obj)` → tú decides el `this`. Ver [[call-apply-bind]].

## La trampa: perder `this`

Pasar un método como callback lo **arranca** de su objeto y pierde el `this`:

```js
[1, 2, 3].forEach(user.greet);   // TypeError: dentro de forEach this es undefined
```

Dos arreglos idiomáticos:

```js
[1, 2, 3].forEach(user.greet.bind(user));     // (a) bind
[1, 2, 3].forEach(() => user.greet());        // (b) arrow wrapper que vuelve a llamar con punto
```

`bind` devuelve una función nueva con `this` fijado para siempre. El arrow wrapper aprovecha que dentro de la arrow se llama `user.greet()` con sintaxis del punto, así que el `this` se resuelve bien en cada invocación.

## La excepción: arrow functions

Las arrow functions **no tienen `this` propio**. Cuando aparece `this` dentro de una arrow, JS lo busca como cualquier otra variable: hacia afuera, por los scopes, hasta encontrar una function tradicional (o el scope global). Ver [[arrow-functions]].

Eso las hace inservibles como métodos de objeto:

```js
const user = {
  name: "Iván",
  greet: () => this.name,    // this aquí es el del módulo/global, NO user
};
user.greet();                 // undefined
```

Pero perfectas como callbacks dentro de un método:

```js
const team = {
  captain: "Iván",
  members: ["Ana", "Bea"],
  greetAll() {
    this.members.forEach(m => {
      console.log(`${this.captain} saluda a ${m}`);
      //           ↑ this aquí es el de greetAll, que es team
    });
  },
};
```

Si el callback fuera `function (m) { ... }` en lugar de arrow, dentro `this` sería `undefined` (`forEach` invoca cada vuelta como llamada suelta) y `this.captain` reventaría.

## `this` al top-level

Detalle que aparece según el entorno:

- **Módulo ESM** o Node con `"type": "module"` → `undefined`.
- **CommonJS** (Node con `.js` normal) → `module.exports`.
- **Script clásico** en navegador → `globalThis`.

Para acceder al objeto global sin depender del entorno, usar [[globalThis]] (disponible desde ES2020).

Relacionadas: [[arrow-functions]], [[call-apply-bind]], [[strict-mode]], [[js-functions-basics]].
