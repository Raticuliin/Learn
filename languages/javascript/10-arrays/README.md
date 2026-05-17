# Módulo 10. Arrays

## Objetivos

- Saber crear arrays de varias formas y elegir la adecuada.
- Distinguir los métodos que **modifican el array original** de los que **devuelven uno nuevo**.
- Dominar `map`, `filter` y `reduce` — los que ya usabas de prestado, ahora formalmente.
- Conocer los métodos de búsqueda (`find`, `some`, `every`, `includes`...) y aplanado (`flat`, `flatMap`).
- Tomar el reflejo de **preferir métodos que no mutan** en código moderno.

---

## 1. Crear arrays

### Literal

```js
const arr = [1, 2, 3];
const empty = [];
```

Es lo que usas el 95% del tiempo.

### `Array.of`

```js
Array.of(7);          // [7]
Array.of(1, 2, 3);    // [1, 2, 3]
```

Útil porque tiene un comportamiento **consistente** con cualquier número de argumentos. (Comparar con `new Array(7)` abajo.)

### `Array.from`

Convierte cualquier cosa "iterable" o "tipo array" en un array real:

```js
Array.from("hola");           // ["h", "o", "l", "a"]
Array.from({ length: 3 });    // [undefined, undefined, undefined]
Array.from({ length: 3 }, (_, i) => i * 2);  // [0, 2, 4]
```

El segundo argumento es una función que se aplica a cada elemento mientras se construye — equivale a `Array.from(x).map(fn)` pero en un solo paso.

### Gotcha: `new Array(n)`

```js
new Array(3);       // [ <3 empty items> ] — array de longitud 3 con huecos
new Array(1, 2, 3); // [1, 2, 3]
```

Si pasas **un solo número**, no crea un array con ese elemento — crea uno **vacío de esa longitud**. Por eso `Array.of(7)` existe: para evitar esta ambigüedad. **No uses `new Array(n)` casi nunca.**

---

## 2. Acceso a elementos

```js
const arr = ["a", "b", "c", "d"];

arr[0];          // "a"
arr[arr.length - 1]; // "d" — el clásico
arr.at(-1);      // "d" — moderno, índices negativos
arr.at(-2);      // "c"

arr.length;      // 4
arr.length = 2;  // ⚠️ ¡SÍ se puede! Trunca el array a ["a", "b"]
```

Asignar a `length` permite truncar el array. Es feo y se usa poco. Mencionarlo para no asustarse si lo ves.

---

## 3. Mutadores: cambian el array original

Estos métodos **modifican el array sobre el que actúan** y suelen devolver otra cosa (longitud nueva, elemento eliminado, etc.).

```js
const arr = [1, 2, 3];

arr.push(4);          // devuelve nuevo length (4); arr ahora es [1,2,3,4]
arr.pop();             // devuelve el último (4); arr [1,2,3]
arr.unshift(0);        // añade al principio; arr [0,1,2,3]
arr.shift();           // quita el primero (0); arr [1,2,3]

arr.splice(1, 1);              // quita 1 elemento desde índice 1; arr [1,3]
arr.splice(1, 0, "a", "b");    // inserta sin quitar nada; arr [1,"a","b",3]

[3, 1, 2].sort();              // muta y devuelve [1, 2, 3]
[1, 2, 3].reverse();           // muta y devuelve [3, 2, 1]

new Array(3).fill(0);          // [0, 0, 0]
```

### Trampa de `sort` por defecto

```js
[10, 2, 1, 100].sort();        // [1, 10, 100, 2]  ← ¡ordena como STRINGS!
```

Por defecto, `sort` convierte todo a string y compara lexicográficamente. Para números, pasa siempre una función:

```js
[10, 2, 1, 100].sort((a, b) => a - b);   // [1, 2, 10, 100] — ascendente
[10, 2, 1, 100].sort((a, b) => b - a);   // [100, 10, 2, 1] — descendente
```

La función debe devolver **negativo** si `a` va antes, **positivo** si después, **cero** si da igual.

---

## 4. Inmutadores: devuelven array nuevo

Estos métodos **no tocan el original** y devuelven uno nuevo. Hoy son los preferidos: código más predecible, menos efectos secundarios.

```js
const arr = [1, 2, 3];

arr.concat([4, 5]);            // [1,2,3,4,5] — arr intacto
arr.slice(0, 2);                // [1,2] — sub-array
[arr, [4, 5]].flat();           // [1, 2, 3, 4, 5] — aplana un nivel
[1, [2, [3]]].flat(Infinity);   // [1, 2, 3] — aplana todo

[1, 2, 3].toReversed();         // [3,2,1] — arr intacto
[3, 1, 2].toSorted((a,b) => a-b); // [1,2,3] — arr intacto
[1, 2, 3].toSpliced(1, 1);       // [1, 3] — arr intacto
[1, 2, 3].with(1, "X");         // [1, "X", 3] — cambia índice 1 sin mutar
```

Los cuatro últimos (`toReversed`, `toSorted`, `toSpliced`, `with`) son **las versiones modernas no-mutadoras** de `reverse`, `sort`, `splice` y "modificar por índice". Llegaron a JS hace pocos años y se usan ya en Node estable. **Prefiéralos** sobre los mutadores siempre que puedas.

### Tabla rápida

| Mutador (cambia el original) | Inmutador (devuelve nuevo) |
| ---------------------------- | -------------------------- |
| `sort`                       | `toSorted`                 |
| `reverse`                    | `toReversed`               |
| `splice`                     | `toSpliced`                |
| `arr[i] = x`                 | `arr.with(i, x)`           |
| `push`, `pop`, etc.          | (usar spread `[...arr, x]`) |

---

## 5. Iteración

### `for...of` y `for` clásico

Lo viste en el módulo de control de flujo:

```js
for (const item of arr) console.log(item);
```

### `forEach`

Equivalente "estilo función":

```js
arr.forEach((item, index) => {
  console.log(index, item);
});
```

`forEach` **no devuelve nada útil** (siempre `undefined`). No se puede salir con `break` ni con `return` (un `return` solo sale del callback, no del bucle). Si necesitas eso → `for...of`.

---

## 6. Los grandes: `map`, `filter`, `reduce`

Los llevas usando de prestado desde el módulo 8. Aquí van formalmente.

### `map` — transformar cada elemento

```js
[1, 2, 3].map(x => x * 2);          // [2, 4, 6]
["a", "b"].map((x, i) => `${i}-${x}`); // ["0-a", "1-b"]
```

Devuelve **un array nuevo de la misma longitud** con cada elemento transformado.

### `filter` — quedarse con los que cumplen

```js
[1, 2, 3, 4].filter(x => x % 2 === 0);   // [2, 4]
["", "hola", "", "x"].filter(Boolean);   // ["hola", "x"] — quita falsy
```

Devuelve un array con los elementos para los que la función devuelve un valor "verdadero".

### `reduce` — acumular en un único valor

El más potente y el más temido. Va acumulando un valor recorriendo el array:

```js
[1, 2, 3, 4].reduce((acc, x) => acc + x, 0);    // 10 — suma
[1, 2, 3, 4].reduce((acc, x) => acc * x, 1);    // 24 — producto
```

- Primer argumento: función `(acumulador, elemento) => nuevoAcumulador`.
- Segundo argumento: **valor inicial** del acumulador.

Si omites el valor inicial, `reduce` usa el primer elemento como acumulador y empieza en el segundo. Es fácil meter la pata: **pasa siempre el valor inicial**.

Ejemplos típicos:

```js
// Agrupar por una clave
const users = [{name: "Ana", role: "admin"}, {name: "Bob", role: "user"}];
users.reduce((acc, u) => {
  (acc[u.role] ??= []).push(u);
  return acc;
}, {});
// { admin: [{name:"Ana",...}], user: [{name:"Bob",...}] }

// Contar ocurrencias
"hola".split("").reduce((acc, ch) => {
  acc[ch] = (acc[ch] ?? 0) + 1;
  return acc;
}, {});
// { h: 1, o: 1, l: 1, a: 1 }
```

`reduce` puede simular `map` y `filter`, pero al revés no — por eso es "el padre" de los métodos funcionales.

### Encadenado

Estos tres se encadenan limpiamente:

```js
[1, 2, 3, 4, 5]
  .filter(x => x % 2 === 0)   // [2, 4]
  .map(x => x * 10)           // [20, 40]
  .reduce((acc, x) => acc + x, 0); // 60
```

Cada paso devuelve un array nuevo. Es elegante pero **crea arrays intermedios**: para datasets grandes puede ser caro. Para problemas normales (cientos o miles), no te preocupes.

---

## 7. Búsqueda

```js
const users = [{id: 1, name: "Ana"}, {id: 2, name: "Bob"}];

users.find(u => u.id === 2);        // {id: 2, name: "Bob"}
users.findIndex(u => u.id === 2);   // 1
users.findLast(u => u.name.startsWith("A"));  // último que cumple
users.findLastIndex(u => u.name.startsWith("A"));

[1, 2, 3].some(x => x > 2);         // true — ¿algún elemento cumple?
[1, 2, 3].every(x => x > 0);        // true — ¿todos cumplen?

[1, 2, 3].includes(2);              // true — para valores primitivos
[1, 2, 3].indexOf(2);               // 1
```

Regla práctica:

- ¿"Está dentro"? → `includes` (más legible).
- ¿"Cuál es el primero que cumple X"? → `find`.
- ¿"Hay alguno que cumple X"? → `some`.
- ¿"Todos cumplen X"? → `every`.

---

## 8. Filosofía: prefiere no mutar

En código moderno, la preferencia es: **no mutes lo que recibes**.

```js
// ❌ muta el array que el llamador te pasó
function sortByAge(users) {
  users.sort((a, b) => a.age - b.age);
  return users;
}

// ✅ devuelve uno nuevo
function sortByAge(users) {
  return users.toSorted((a, b) => a.age - b.age);
}
```

Razones:

- El llamador no se lleva sorpresas — sus datos siguen como estaban.
- Más fácil razonar sobre el código.
- Encaja con muchos frameworks modernos (React por ejemplo, comparado con mutación).

No es ley absoluta — a veces mutar es lo correcto (rendimiento, código local). Pero el reflejo por defecto: **no mutes**.

---

## Ejercicio

Te he creado el archivo `arrays.js` con la plantilla — ábrelo y rellena los `// TODO`. Cada parte tiene los casos de prueba con el resultado esperado al lado. Si te atascas, sigue la regla de las tres pistas.

Cuando termines, lo revisamos juntos.
