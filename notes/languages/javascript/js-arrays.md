# js-arrays

Los arrays en JS son **objetos especiales** con propiedades indexadas y `length`. Conoce dos grupos de métodos: los que **modifican el array original** y los que **devuelven uno nuevo**.

## Crear arrays

```js
[1, 2, 3];                                     // literal — el 95% del tiempo
Array.of(7);                                   // [7] — explícito con un solo elemento
Array.from("hola");                             // ["h","o","l","a"]
Array.from({ length: 5 }, (_, i) => i + 1);   // [1, 2, 3, 4, 5]

new Array(3);    // [<3 empty items>] ← gotcha: un solo número crea array vacío de esa longitud
new Array(1, 2, 3); // [1, 2, 3]
```

**Evita `new Array(n)`** — usa `Array.of` o `Array.from({length: n}, ...)` para no caer en la ambigüedad.

## Acceso

```js
arr[0];           // primero
arr.at(-1);       // último (moderno, índices negativos)
arr.length;       // tamaño
arr.length = 2;   // ⚠️ trunca el array
```

## Mutadores (cambian el original)

| Método           | Qué hace                                  |
| ---------------- | ----------------------------------------- |
| `push`, `pop`    | Añade / quita al final                    |
| `unshift`, `shift` | Añade / quita al principio              |
| `splice(i, n, ...items)` | Modifica en posición arbitraria   |
| `sort(fn)`        | Ordena (sin `fn` ordena como strings — gotcha) |
| `reverse`         | Invierte                                  |
| `fill(value)`     | Rellena                                   |

### Trampa de `sort`

```js
[10, 2, 1, 100].sort();              // [1, 10, 100, 2]  ← ordena como string
[10, 2, 1, 100].sort((a, b) => a - b); // [1, 2, 10, 100] ← correcto para números
```

## No-mutadores (devuelven nuevo array) — preferidos

Versiones modernas que **no tocan el original**: ver [[array-immutable-methods]].

| Mutador          | No-mutador equivalente |
| ---------------- | ---------------------- |
| `sort`           | `toSorted`             |
| `reverse`        | `toReversed`           |
| `splice`         | `toSpliced`            |
| `arr[i] = x`     | `arr.with(i, x)`       |

Otros que ya no mutaban desde siempre: `concat`, `slice`, `flat`, `flatMap`.

## Iteración

```js
for (const item of arr) { ... }       // permite break/continue
arr.forEach((item, i) => { ... });    // sin break, sin valor de retorno
```

Para transformar / filtrar / acumular → ver [[map-filter-reduce]].

## Búsqueda

```js
arr.includes(x);                          // ¿está dentro?
arr.indexOf(x);                            // posición o -1
arr.find(item => item.id === 3);          // primer elemento que cumple
arr.findIndex(item => ...);               // su índice
arr.findLast(item => ...);                // último que cumple
arr.findLastIndex(item => ...);
arr.some(item => ...);                    // ¿hay alguno?
arr.every(item => ...);                   // ¿todos?
```

Pista de diseño: `.every(item => item.foo)` comprueba si **todos los `foo` son truthy** — incluye `""`, `0`, `null` como inválidos. Si quieres estricto, expresa la condición explícitamente.

## Aplanar

```js
[[1,2],[3,4],[5]].flat();          // [1,2,3,4,5]
[1,[2,[3,[4]]]].flat(Infinity);    // [1,2,3,4]
[[1,2],[3,4]].flatMap(x => x.map(n => n*2)); // [2,4,6,8] — map + flat en uno
```

## Filosofía: no mutes lo que recibes

```js
// ❌ muta el argumento
function sortByAge(users) { users.sort((a,b) => a.age - b.age); }

// ✅ devuelve nuevo
function sortByAge(users) { return users.toSorted((a,b) => a.age - b.age); }
```

Código más predecible para quien te llama. Reflejo por defecto: **no mutes**.

Relacionadas: [[array-immutable-methods]], [[map-filter-reduce]].
