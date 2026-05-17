# array-immutable-methods

Cuatro métodos modernos que hacen lo mismo que sus contrapartes clásicas **sin mutar el array original**. Disponibles en Node 20+ y navegadores modernos.

```js
const arr = [3, 1, 4, 1, 5];

arr.toSorted((a, b) => a - b);   // [1, 1, 3, 4, 5] — arr intacto
arr.toReversed();                // [5, 1, 4, 1, 3] — arr intacto
arr.toSpliced(1, 2);             // [3, 5]          — arr intacto
arr.with(0, 999);                // [999, 1, 4, 1, 5] — arr intacto

console.log(arr); // [3, 1, 4, 1, 5] — siempre igual
```

## Equivalencias

| Mutador (cambia original) | No-mutador (nuevo array)        |
| ------------------------- | ------------------------------- |
| `arr.sort(fn)`            | `arr.toSorted(fn)`              |
| `arr.reverse()`           | `arr.toReversed()`              |
| `arr.splice(i, n, ...)`   | `arr.toSpliced(i, n, ...)`      |
| `arr[i] = x`              | `arr.with(i, x)`                |

## Cuándo preferirlos

**Siempre que puedas.** Razones:

- El array original sigue como estaba — quien te lo pasó no se lleva sorpresas.
- Más fácil razonar sobre el código (sin efectos secundarios).
- Encaja con frameworks que comparan referencias (React por ejemplo) — un array mutado tiene la misma referencia que antes y no detecta cambio; un array nuevo sí.

## Cuándo seguir usando los mutadores

- Código local muy hot donde el coste de crear arrays nuevos importa.
- Casos donde la mutación es el comportamiento deseado explícito (ej. ordenar un buffer interno).

Como regla por defecto: **prefiere `toX`**, justifica el mutador cuando lo uses.

## `with` en detalle

Cambia un elemento en un índice concreto:

```js
const arr = [1, 2, 3];
arr.with(1, 99);    // [1, 99, 3]
arr.with(-1, 99);   // [1, 2, 99] — admite índices negativos
```

Equivalente "viejo" sin mutar:

```js
const copy = [...arr];
copy[1] = 99;
// O en una línea con spread (menos legible):
[...arr.slice(0, 1), 99, ...arr.slice(2)];
```

`with` te da la versión limpia.

Relacionadas: [[js-arrays]], [[map-filter-reduce]].
