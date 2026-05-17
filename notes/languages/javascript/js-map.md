# js-map

Colección clave-valor con API uniforme: `set`/`get`/`has`/`delete`/`size`/iterable. Diferencias frente a un objeto literal:

- **Acepta claves de cualquier tipo** (objetos, funciones, números). Identidad por referencia.
- **Orden de inserción garantizado** al iterar.
- **Tamaño directo** con `.size`.
- **Iterable** sin pasar por `Object.entries`.
- Sin claves "fantasma" del prototipo.

```js
const m = new Map([["a", 1], ["b", 2]]);
m.set("c", 3);            // encadenable
for (const [k, v] of m) { ... }
```

## Map vs objeto

- **Map** → diccionario dinámico (añades/quitas en runtime, claves variables).
- **Objeto** → registro de forma fija (campos conocidos en compile time), serializable a JSON con `JSON.stringify`.

## Map.groupBy

Versión del [[Object-groupBy]] que devuelve Map. Útil cuando las claves de grupo NO son strings (objetos, etc.).

## Ver también

- [[js-set]] — primo sin valores.
- [[weakmap-weakset]] — variante que no retiene.
