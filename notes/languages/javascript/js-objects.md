# js-objects

Diccionarios clave → valor. La estructura central del lenguaje: casi todo lo demás (incluidos arrays y funciones) se apoya en este modelo.

## Crear

```js
const user = { name: "Ana", age: 30 };          // literal
const key = "score";
const player = { [key]: 100 };                  // clave calculada
const obj = { name, age };                      // shorthand de propiedad
const calc = { sum(a, b) { return a + b } };    // shorthand de método
```

Las claves siempre son strings (o symbols, ver [[Symbols]]). Los números como clave se convierten a string.

## Acceder, comprobar, borrar

```js
user.name              // notación punto
user["name"]           // notación corchetes (necesaria con espacios o claves dinámicas)
user.email             // undefined si no existe (no lanza)
delete user.age
"name" in user         // true si existe (también heredadas — ver cadena de prototipos)
Object.hasOwn(user, "name") // solo propiedades propias, no heredadas
user?.address?.city    // [[optional-chaining]]
```

`Object.hasOwn` reemplaza al viejo `obj.hasOwnProperty(k)`, que se rompía si el objeto tenía una propiedad llamada `hasOwnProperty`.

## Recorrer

```js
Object.keys(obj)           // ["a", "b"]
Object.values(obj)         // [1, 2]
Object.entries(obj)        // [["a", 1], ["b", 2]]
Object.fromEntries(pairs)  // inverso de entries

for (const [k, v] of Object.entries(obj)) { ... }
```

`for...in` también funciona sobre objetos pero recorre además propiedades heredadas (ver [[for-in-vs-for-of]]). Idiomático moderno: `Object.entries` + `for...of`.

## Copiar y combinar

```js
const copy = { ...original };
const merged = { ...defaults, ...overrides };   // lo de la derecha gana
const copy2 = Object.assign({}, original);      // sintaxis antigua, mismo efecto
```

Spread y `Object.assign` son **copia superficial**: los objetos anidados siguen compartidos. Ver [[shallow-vs-deep-copy]].

## Paso por referencia

Asignar un objeto o pasarlo a una función mueve la **referencia**, no copia el contenido. `const` no protege el contenido. Ver [[pass-by-reference]].

`===` entre objetos compara referencias, no contenido:
```js
{ a: 1 } === { a: 1 } // false
```

## Patrón: agrupar arrays en objeto

`Object.groupBy(array, fn)` (ES2024, Node 21+) devuelve un objeto `{ clave: [items] }` con clave derivada del callback. El objeto resultante es null-prototype (sin métodos heredados), así que para comprobar claves usa `Object.hasOwn`.

```js
Object.groupBy(users, u => u.role) // { admin: [...], user: [...] }
```

Ver [[map-filter-reduce]] para la versión manual con `reduce`.

## Relacionado

- [[object-freeze]] — congelar / sellar / prevent extensions
- [[pass-by-reference]] — semántica de asignación
- [[shallow-vs-deep-copy]] — copia superficial vs profunda
- [[destructuring]] — extraer propiedades a variables (módulo 12)
