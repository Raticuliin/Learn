# higher-order-functions

Una **higher-order function (HOF)** es una función que cumple al menos una de estas dos cosas:

- recibe una función como argumento (ver [[callbacks]]), o
- devuelve una función.

Si solo opera sobre valores planos (números, strings, objetos), no es HOF.

## Ejemplos nativos

Todos estos son HOF porque reciben callback:

- `Array.prototype.map` / `filter` / `reduce` / `forEach` / `find` / `findLast` / `some` / `every` / `sort` / `toSorted`
- `Object.fromEntries` (acepta iterable, pero los métodos `keys`/`values`/`entries` se combinan con HOF de array)
- `setTimeout` / `setInterval` (callback diferido)
- `Promise.prototype.then` / `catch` / `finally`

## Ejemplos que **devuelven** función

```js
function makeMultiplier(factor) {
  return n => n * factor;
}

const double = makeMultiplier(2);
double(5); // 10
```

`makeMultiplier` no multiplica. **Fabrica** funciones que multiplican. Cada llamada produce una función con su `factor` guardado. El mecanismo de "se acuerda de `factor`" tiene nombre: [[closures]].

## Por qué importan

Una HOF te deja **parametrizar comportamiento**, no solo datos. Es el mismo salto que ir de "sumar 2 + 3" a "sumar dos números cualesquiera"... pero un nivel arriba: ahora parametrizas la **operación**.

`filter` no sabe qué consideras "interesante" en un array. Tú le pasas el predicado. Una misma función nativa cubre un infinito de casos de uso porque su comportamiento se inyecta desde fuera.

## HOF a mano

Útil hacerlas para ver que no hay magia:

```js
function myFilter(arr, keep) {
  const result = [];
  for (const item of arr) {
    if (keep(item)) result.push(item);
  }
  return result;
}
```

Seis líneas. `Array.prototype.filter` añade detalles (índice, array original, soporte de sparse arrays) pero la idea central está aquí.

## Relacionado

- [[callbacks]]
- [[map-filter-reduce]]
- [[closures]]
- [[currying-composition]] (extensión natural de "devolver funciones")
