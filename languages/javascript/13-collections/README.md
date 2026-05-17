# Módulo 13 — Colecciones: Map, Set, WeakMap, WeakSet

## Objetivos

- Saber cuándo elegir `Map` frente a un objeto literal.
- Usar `Set` para deduplicar y para operaciones de conjunto (unión, intersección, etc.).
- Entender por qué existen `WeakMap`/`WeakSet` y para qué se usan.

## Por qué importan

Ya tienes dos estructuras para guardar colecciones: arrays (ordenados por índice) y objetos (acceso por clave). Pero los objetos tienen limitaciones cuando los usas como "diccionario clave-valor":

- Solo aceptan strings y symbols como clave (números se coercionan, otros tipos no valen).
- No tienen `.size`, hay que contar con `Object.keys(...).length`.
- Iterar requiere `Object.entries`/`Object.keys`.
- Heredan propiedades del prototipo, así que hay claves "fantasma" si no te cuidas.

`Map` y `Set` son colecciones diseñadas como colecciones: comparten una API uniforme (`size`, `has`, `delete`, `clear`, iteración directa) y permiten claves de **cualquier tipo**.

`WeakMap`/`WeakSet` son sus variantes "que no retienen". Tienen un caso de uso específico que veremos al final.

---

## Parte 1. Map

### Crear y operar

```js
const scores = new Map();
scores.set("ana", 10);
scores.set("luis", 8);

scores.get("ana");      // 10
scores.has("luis");     // true
scores.delete("ana");
scores.size;            // 1
```

También se puede inicializar pasando un array de pares al constructor:

```js
const scores = new Map([
  ["ana", 10],
  ["luis", 8],
]);
```

`set` devuelve el propio Map, así que se puede encadenar: `map.set("a", 1).set("b", 2)`.

### Clave de cualquier tipo

Esta es la diferencia central frente a un objeto. Puedes usar un objeto, una función, un número, lo que sea, como clave:

```js
const user1 = { id: 1 };
const user2 = { id: 2 };

const lastLogin = new Map();
lastLogin.set(user1, "2026-05-17");
lastLogin.set(user2, "2026-05-16");

lastLogin.get(user1); // "2026-05-17"
```

La identidad es por **referencia**, igual que en igualdad estricta (`===`). Un objeto distinto con los mismos campos NO es la misma clave.

### Iterar

Map es iterable directamente: devuelve pares `[clave, valor]` **en orden de inserción**.

```js
for (const [key, value] of scores) {
  console.log(key, value);
}
```

También hay `map.keys()`, `map.values()`, `map.entries()` (equivalente a iterar el map directamente).

### Map vs Object — cuándo elegir cada uno

| Necesitas...                        | Usa     |
| ----------------------------------- | ------- |
| Claves no-string (objeto, función)  | Map     |
| Inserciones/borrados frecuentes     | Map     |
| Tamaño con `.size`                  | Map     |
| Iterar manteniendo orden            | Map     |
| Estructura tipo "registro" fija     | Object  |
| Serializar a JSON                   | Object  |
| Acceso con `obj.foo` sintáctico     | Object  |

Regla práctica: si lo usas como **diccionario** (claves dinámicas, añades/quitas en runtime), prefiere `Map`. Si lo usas como **registro** (forma fija conocida en compile time, p.ej. un user con `name`, `age`...), prefiere objeto.

### Map.groupBy

Igual que `Object.groupBy` (módulo 11) pero devuelve un `Map`. Útil cuando quieres usar claves no-string para los grupos:

```js
const products = [
  { name: "Apple", price: 1.2 },
  { name: "Bread", price: 2.5 },
];
const byBucket = Map.groupBy(products, (p) =>
  p.price < 2 ? "cheap" : "expensive",
);
// Map { "cheap" => [{Apple}], "expensive" => [{Bread}] }
```

---

## Parte 2. Set

Colección sin duplicados. Misma API uniforme que Map.

### Crear y operar

```js
const tags = new Set();
tags.add("js");
tags.add("web");
tags.add("js");  // duplicado, ignorado
tags.size;       // 2

tags.has("js");  // true
tags.delete("web");
```

Inicializable desde cualquier iterable:

```js
const unique = new Set([1, 2, 2, 3, 3, 3]); // Set { 1, 2, 3 }
```

El uso más típico: **deduplicar un array**.

```js
const dedup = [...new Set(arr)];
```

### Iterar

```js
for (const item of tags) {
  console.log(item);
}
```

Itera en orden de inserción, igual que Map.

### Operaciones de conjunto

Set tiene métodos para las operaciones clásicas. Todos **devuelven un Set nuevo** (no mutan):

```js
const a = new Set([1, 2, 3]);
const b = new Set([2, 3, 4]);

a.union(b);              // Set { 1, 2, 3, 4 }
a.intersection(b);       // Set { 2, 3 }
a.difference(b);         // Set { 1 }          ← en a pero NO en b
a.symmetricDifference(b); // Set { 1, 4 }      ← en uno u otro, no en ambos

a.isSubsetOf(b);     // false
a.isSupersetOf(b);   // false
a.isDisjointFrom(b); // false (comparten 2 y 3)
```

Estos métodos aceptan cualquier objeto "Set-like" (con `.size`, `.has`, y un iterador de `.keys()`), no solo `Set` puros. En la práctica casi siempre pasarás otro Set.

---

## Parte 3. WeakMap y WeakSet

### El problema que resuelven

Cuando un `Map` guarda un objeto como clave, **mantiene viva** una referencia a ese objeto. Mientras el Map exista, el objeto no puede ser recolectado por el garbage collector.

```js
const cache = new Map();
let user = { id: 1, name: "Ana" };
cache.set(user, "datos pesados");

user = null; // pero `cache` aún tiene la referencia → el objeto NO se libera
```

A veces tú quieres **adjuntar datos** a un objeto sin impedir que se libere cuando ya nadie más lo usa. Para eso existen `WeakMap` y `WeakSet`.

### WeakMap

- Solo acepta **objetos** (y symbols registrados) como clave.
- La referencia a la clave es **débil**: si el objeto se queda sin otras referencias, el GC puede liberarlo, y la entrada del WeakMap desaparece sola.
- **No es iterable**, no tiene `.size`, no tiene `.keys()`/`.values()`/`.entries()`. Solo `get`, `set`, `has`, `delete`.

```js
const metadata = new WeakMap();
let element = { tag: "div" };
metadata.set(element, { clicks: 0 });

metadata.get(element); // { clicks: 0 }
element = null;        // el GC eventualmente libera la entrada
```

### Caso de uso típico

Adjuntar datos a objetos que tú no controlas (elementos del DOM, instancias de clases ajenas) sin filtrar memoria. Conceptualmente: "información asociada a este objeto, mientras este objeto siga vivo".

### WeakSet

Similar pero versión Set: guarda objetos sin retenerlos. Útil para "marcar" objetos.

```js
const visited = new WeakSet();
function visit(node) {
  if (visited.has(node)) return;
  visited.add(node);
  // procesar...
}
```

Si `node` deja de existir en otro lado, el WeakSet lo deja ir solo.

### Restricciones de Weak\*

- Sin iteración, sin `size`, sin `clear` (en algunos motores `clear` existe; oficialmente no forma parte).
- Las claves **deben ser objetos** (o symbols únicos). No vale `weakMap.set("clave", ...)`.
- No vas a saber qué hay dentro recorriéndolo. Si necesitas iterar, NO uses Weak\*.

---

## Tabla decisión

| Caso                                                       | Estructura |
| ---------------------------------------------------------- | ---------- |
| Diccionario clave-valor con claves dinámicas               | `Map`      |
| Lista sin duplicados, operaciones de conjunto              | `Set`      |
| Registro con forma fija, vas a serializar a JSON           | objeto     |
| Lista ordenada con índice numérico                         | array      |
| Datos por objeto que no quieres que retengan al objeto     | `WeakMap`  |
| Marca/flag por objeto que no quieres que retenga al objeto | `WeakSet`  |

---

## Ejercicio

Abre `collections.js` y resuélvelo. Tiene esqueleto con `// TODO` y resultados esperados al lado.

## Recursos

- [Map and Set — javascript.info](https://javascript.info/map-set)
- [WeakMap and WeakSet — javascript.info](https://javascript.info/weakmap-weakset)
- [Set — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
- [Map — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
