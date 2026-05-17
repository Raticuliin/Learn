# js-set

Colección sin duplicados, API uniforme con [[js-map]]: `add`/`has`/`delete`/`size`/iterable.

```js
const s = new Set([1, 2, 2, 3]); // Set { 1, 2, 3 }
s.add(4);
s.has(2);
```

## Caso clásico: deduplicar array

```js
const unique = [...new Set(arr)];
```

## Operaciones de conjunto

Ver [[set-operations]]: `union`, `intersection`, `difference`, `symmetricDifference`, `isSubsetOf`, `isSupersetOf`, `isDisjointFrom`.

## Identidad

Igual que en Map, los elementos se comparan por **referencia** (objetos distintos con mismo contenido son entradas distintas).

## Ver también

- [[js-map]] · [[weakmap-weakset]]
