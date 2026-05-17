# js-functions-basics

Tres formas de definir una función en JS y sus implicaciones.

## Function declaration

```js
function greet(name) {
  return `Hola, ${name}!`;
}
```

- Nombre obligatorio.
- **Hoisted completa**: el cuerpo está disponible antes de la línea en el scope. `greet("x")` funciona incluso si está escrito arriba del `function greet`.

## Function expression

```js
const greet = function (name) {
  return `Hola, ${name}!`;
};
```

- Nombre opcional (anónima por defecto; DevTools usa el nombre de la variable).
- **No hoisted como función**: con `const`/`let` está en [[temporal-dead-zone]] hasta la línea de asignación → llamarla antes da `ReferenceError`. Con `var`, daría `TypeError: undefined is not a function`.

## Named function expression

```js
const factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1);
};
```

- El nombre interno (`fact`) **solo es visible dentro** de la propia función. Útil para recursión y stack traces más legibles. Raro en código moderno.

## Cuándo cada una

- **Expresión** es el default moderno: encaja con `const` por defecto ([[var-let-const]]) y avisa si la usas antes de tiempo.
- **Declaración** sigue siendo válida para utilidades top-level cuando el hoisting aporta legibilidad.

## Rest parameters

Reemplazan al legacy `arguments`. Agrupan en un **array real**:

```js
function sum(...nums) {
  let total = 0;
  for (const n of nums) total += n;
  return total;
}
```

- Debe ser el último parámetro.
- Solo uno por función.
- `arguments` no existe en [[arrow-functions]]; rest sí.

## Return y la trampa del ASI

JS inserta `;` automáticamente en ciertos saltos de línea. Con `return`:

```js
function makeUser(name) {
  return
  {
    name: name,
  };
}
// Equivale a:
// return;
// { name: name };
// → devuelve undefined
```

Regla: **abre la llave en la misma línea del `return`**.

```js
return {
  name: name,
};
```

Relacionadas: [[default-parameters]], [[arrow-functions]], [[hoisting]].
