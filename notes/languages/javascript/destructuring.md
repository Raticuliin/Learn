# destructuring

Sintaxis para "desempaquetar" arrays u objetos a variables con una sola sentencia. El lado izquierdo describe la **forma** de lo que se está desempaquetando.

## Arrays vs objetos: la diferencia clave

- **Arrays** destructuran por **posición**. No hay nombres que renombrar; el nombre lo eliges al declarar.
- **Objetos** destructuran por **nombre de propiedad**. Si quieres otro nombre de variable, usas `prop: nuevoNombre`.

```js
const [a, b] = [10, 20];                 // a=10, b=20 (por posición)
const { name: userName } = { name: "Ana" }; // userName="Ana" (renombrado por nombre)
```

## Defaults

Se activan **solo con `undefined`**, no con `null`. Mismo mecanismo que [[default-parameters]].

```js
const { theme = "light" } = { theme: undefined }; // "light"
const { theme = "light" } = { theme: null };      // null
```

## Rest

- En array: `[head, ...tail]` — debe ir al final.
- En objeto: `{ a, ...others }` — recoge "todo lo no mencionado".

## Anidado

Los patrones se combinan recursivamente. Permite extraer piezas profundas en una sola sentencia. **Limitación**: el optional chaining [[optional-chaining]] no se puede usar dentro del patrón. Si una pieza intermedia puede faltar, se da default sobre ella:

```js
const { user: { name = "anon" } = {} } = response;
```

## En parámetros de función

Patrón de "named arguments" en JS. La firma documenta lo que recibe. Con `= {}` final, la función tolera llamadas sin argumentos:

```js
function createUser({ name = "anon", role = "guest" } = {}) { ... }
```

## Swap sin temporal

Idiom clásico, aprovecha destructuring de array:

```js
[a, b] = [b, a];
```

## Gotchas

- **No reasignar a `const` ya declarada**: si destructuras `const [first] = ...` en un sitio, no puedes volver a declarar `const [first] = ...` en el mismo scope. Choca igual que cualquier `const` duplicado.
- **Renombrar parece "asignar"** pero no lo es: `{ name: userName }` significa "lee la propiedad `name` y guárdala como `userName`". Confuso al principio porque la sintaxis del literal `{ name: "Ana" }` se lee al revés.

## Ver también

- [[pass-by-reference]] — el destructuring lee referencias, no copia profunda.
- [[shallow-vs-deep-copy]] — sacar piezas con destructuring + spread no clona objetos anidados.
- [[default-parameters]] — mismo mecanismo de `undefined → default`.
