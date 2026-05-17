# map-filter-reduce

Los tres métodos funcionales más usados sobre arrays. Cada uno devuelve un valor nuevo, **nunca mutan** el array original.

## `map` — transformar cada elemento

```js
[1, 2, 3].map(x => x * 2);                  // [2, 4, 6]
products.map(p => p.name);                  // extraer una propiedad de cada uno
items.map((x, i) => `${i}: ${x}`);          // con índice
```

Devuelve array **de la misma longitud** con cada elemento transformado.

## `filter` — quedarse con los que cumplen

```js
[1, 2, 3, 4].filter(x => x % 2 === 0);      // [2, 4]
products.filter(p => p.stock > 0);          // solo los disponibles
["", "a", "", "b"].filter(Boolean);         // ["a", "b"] — idiom para quitar falsy
```

## `reduce` — acumular en un valor único

```js
arr.reduce((acc, current) => nuevoAcc, valorInicial);
```

- Primer argumento: función `(acumulador, elemento) => nuevoAcumulador`.
- Segundo argumento: **valor inicial**. Pasa siempre — sin él, usa el primer elemento como acumulador y es fácil meter la pata.

### Patrones idiomáticos

**Suma / producto:**

```js
[1,2,3,4].reduce((acc, x) => acc + x, 0);   // 10
products.reduce((acc, p) => acc + p.price * p.stock, 0); // valor inventario
```

**Contar ocurrencias:**

```js
"abracadabra".split("").reduce((acc, ch) => {
  acc[ch] = (acc[ch] ?? 0) + 1;
  return acc;
}, {});
// { a: 5, b: 2, r: 2, c: 1, d: 1 }
```

El `??` ([[nullish-coalescing]]) sustituye `undefined` por `0` cuando la clave nueva no existe. Sin él, `undefined + 1 = NaN` y rompe el conteo.

**Agrupar por una clave:**

```js
users.reduce((acc, u) => {
  (acc[u.role] ??= []).push(u);
  return acc;
}, {});
// { admin: [...], user: [...] }
```

El `??=` crea el array vacío solo si la clave no existía. Como devuelve el array (el existente o el nuevo), se encadena directamente con `.push`.

## Encadenado

```js
products
  .filter(p => p.stock > 0)
  .filter(p => p.price < 3)
  .map(p => p.name);
```

Cada paso devuelve array nuevo. Elegante pero crea arrays intermedios — para datasets grandes (decenas de miles+) puede importar el coste. Para tamaños normales, no te preocupes.

## Cuándo cada uno

| Quiero...                                | Uso         |
| ---------------------------------------- | ----------- |
| Transformar cada elemento                | `map`       |
| Quedarme con un subconjunto              | `filter`    |
| Reducir a un valor (suma, objeto, etc.)  | `reduce`    |
| Hacer algo con cada uno (side effect)    | `for...of` (no `forEach` si necesitas `break`) |

`reduce` puede simular `map` y `filter`, pero al revés no. Por eso es el "padre" de los tres.

Relacionadas: [[js-arrays]], [[nullish-coalescing]], [[truthy-falsy]].
