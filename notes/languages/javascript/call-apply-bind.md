# call-apply-bind

Los tres métodos que viven en `Function.prototype` y permiten **controlar explícitamente el `this`** de una función. Toda función los tiene. La diferencia entre los tres es **cuándo se ejecuta** y **cómo se pasan los argumentos**.

## La firma rápida

```js
fn.call(thisArg, arg1, arg2, ...)   // invoca ya. Args sueltos.
fn.apply(thisArg, [arg1, arg2])     // invoca ya. Args en array.
fn.bind(thisArg, arg1, ...)         // NO invoca. Devuelve función nueva.
```

## `call` — invocar ahora prestando `this`

```js
function intro(greeting, punct) {
  return `${greeting}, soy ${this.name}${punct}`;
}

const ana = { name: "Ana" };
intro.call(ana, "Hola", "!");   // "Hola, soy Ana!"
```

`intro` no tiene relación con `ana`. `call` la invoca **ahora**, prestándole `ana` como `this` para esa única ejecución.

## `apply` — igual pero los argumentos van en un array

```js
intro.apply(ana, ["Hey", "?"]);  // "Hey, soy Ana?"
```

Mismo efecto que `call`. Útil cuando ya tienes los argumentos en un array y quieres también fijar `this`.

> **Si solo necesitas pasar un array como argumentos** (sin tocar `this`), el spread moderno reemplaza a `apply`:
>
> ```js
> Math.max.apply(null, [3, 7, 2]);   // legacy
> Math.max(...[3, 7, 2]);            // moderno
> ```
>
> `apply` sigue siendo útil **solo si** además necesitas cambiar `this`.

## `bind` — devolver una función nueva con `this` (y opcionalmente args) precargados

```js
const introIvan = intro.bind({ name: "Iván" });
introIvan("Hola", "!");   // "Hola, soy Iván!"
```

`bind` **no invoca**. Te entrega una función nueva con el `this` clavado. La función bound conserva ese `this` aunque luego la pases como callback — es el remedio clásico al problema de [[this-binding]] al perder el receptor:

```js
[1, 2, 3].forEach(user.greet.bind(user));  // ya no revienta
```

### Partial application: fijar argumentos también

Los argumentos extra que pases a `bind` se precargan posicionalmente:

```js
const shoutHi = intro.bind({ name: "Iván" }, "HOLA");
shoutHi("!");   // "HOLA, soy Iván!"
shoutHi("?");   // "HOLA, soy Iván?"
```

Cuando solo te interesa la parcialización y **no usas `this`**, la convención es pasar `null` como primer argumento:

```js
function log(level, message) {
  return `[${level}] ${message}`;
}

const logError = log.bind(null, "ERROR");
logError("falló X");   // "[ERROR] falló X"
```

`null` aquí significa "no me importa el `this`, no lo voy a usar". Si pones un objeto cualquiera ahí, también funciona — pero estás mintiendo al lector. La firma de `bind` obliga a poner *algo* en la posición de `thisArg` porque la siguiente posición ya es para argumentos.

## No funcionan sobre arrow functions

Las arrows no tienen `this` propio, así que ningún `thisArg` puede cambiarlo:

```js
const arrow = () => this;
arrow.call({ name: "X" });   // el this sigue siendo el léxico, no { name: "X" }
```

`call`/`apply`/`bind` sí pueden **pasarle argumentos** a una arrow, pero el `thisArg` se ignora. Ver [[arrow-functions]].

## Cuándo usar cada una

- `call` → invocar ahora con un `this` distinto, argumentos sueltos en código.
- `apply` → invocar ahora cuando los argumentos ya están en un array **y** quieres cambiar `this`.
- `bind` → guardar una función nueva atada (para callbacks, event handlers, parcialización).

Relacionadas: [[this-binding]], [[arrow-functions]], [[js-functions-basics]].
