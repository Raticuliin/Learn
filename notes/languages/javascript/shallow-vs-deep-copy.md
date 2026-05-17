# shallow-vs-deep-copy

## Copia superficial (shallow)

Copia solo el primer nivel. Los objetos anidados siguen compartiendo referencia con el original. Mutar lo interno afecta a los dos.

Mecanismos shallow en JS:

```js
const copy = { ...original };         // spread
const copy = Object.assign({}, original);
const copy = [...arr];                // spread de array
const copy = arr.slice();
const copy = Array.from(arr);
```

Trampa típica:

```js
const original = { name: "Ivan", address: { city: "Madrid" } };
const copy = { ...original };
copy.address.city = "Barcelona";
original.address.city;  // "Barcelona" ← el original también cambió
```

## Copia profunda (deep)

Copia todos los niveles. Independencia total entre original y copia.

```js
const deep = structuredClone(original);
```

`structuredClone` es la forma moderna y oficial (Node 17+, todos los navegadores). Soporta tipos complejos (Map, Set, Date, RegExp, TypedArrays, ArrayBuffer) y referencias cíclicas.

Limitaciones: **no clona funciones, símbolos, propiedades getter/setter ni prototipos**. Para esos casos hay que recurrir a librerías o clonado manual.

### Alternativa antigua: JSON

```js
const deep = JSON.parse(JSON.stringify(original));
```

Funciona para datos simples, pero rompe con `undefined`, `Date` (se convierte a string), `Map`/`Set`, `BigInt`, funciones, ciclos. Hoy `structuredClone` la sustituye en casi todos los casos.

## Cuándo cada una

- **Shallow** basta si el objeto es plano o si los anidados son inmutables / no los vas a mutar.
- **Deep** cuando necesitas independencia real: snapshots, undo/redo, paso a funciones que mutan, serialización…
- Para cambios pequeños sobre objetos anidados, los métodos no mutadores y spread parcial son más eficientes que un deep copy completo:

```js
const updated = { ...user, address: { ...user.address, city: "Bilbao" } };
```

## Relacionado

- [[js-objects]] — operaciones sobre objetos
- [[pass-by-reference]] — la raíz del problema
- [[array-immutable-methods]] — `toSorted`, `toReversed`, `with` — patrón "no mutes, copia"
- [[object-freeze]] — bloquear mutación en lugar de copiar
