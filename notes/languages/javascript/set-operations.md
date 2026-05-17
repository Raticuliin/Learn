# set-operations

Métodos para operaciones de conjunto sobre [[js-set]]. Disponibles en Node 22+ y todos los navegadores modernos. **Devuelven Set nuevo** (no mutan).

```js
const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);

a.union(b);               // { 1, 2, 3, 4 }
a.intersection(b);        // { 2, 3 }
a.difference(b);          // { 1 }
a.symmetricDifference(b); // { 1, 4 }
```

Tests de relación (devuelven boolean):

```js
a.isSubsetOf(b);     // ¿todos los de a están en b?
a.isSupersetOf(b);   // ¿todos los de b están en a?
a.isDisjointFrom(b); // ¿no comparten nada?
```

## Aceptan Set-like, no solo Set

El argumento solo necesita: `.size` numérico, método `.has(value)`, y método `.keys()` que devuelva iterador. Esto permite pasar estructuras tipo-Set sin convertirlas.

## Ver también

- [[js-set]]
