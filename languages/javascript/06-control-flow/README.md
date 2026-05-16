# Módulo 6. Control de flujo

## Objetivos

- Dominar las estructuras condicionales (`if`/`else`, `switch`) y sus gotchas en JS.
- Conocer los cinco tipos de bucle (`for`, `while`, `do...while`, `for...of`, `for...in`) y saber cuándo usar cada uno.
- Entender `break`, `continue` y las **labels** (raras pero existen).
- Saber por qué `for...in` sobre arrays es una trampa.

Asumimos truthy/falsy, `==` vs `===` y coerción (módulo 5).

---

## 1. `if` / `else if` / `else`

Nada raro respecto a Java, **excepto la condición**: JS evalúa con la regla de truthy/falsy, no exige boolean estricto.

```js
const name = "";
if (name) {
  console.log("hay nombre");
} else {
  console.log("vacío"); // entra aquí: "" es falsy
}
```

Patrón típico: usar el operador lógico como guardia rápida.

```js
if (user && user.isAdmin) { ... }
```

### Ternario como expresión

Ya lo viste. Recordatorio: **es una expresión, devuelve valor**. Útil para asignaciones y returns cortos.

```js
const label = count === 1 ? "item" : "items";
```

No anides ternarios profundamente: pierde legibilidad. Si tienes 3+ ramas, `if`/`switch`.

---

## 2. `switch`

Comparación con **`===`** (no `==`). No hay coerción.

```js
const value = "1";
switch (value) {
  case 1:
    console.log("number"); // NO entra: "1" !== 1
    break;
  case "1":
    console.log("string"); // entra
    break;
  default:
    console.log("otro");
}
```

### Gotcha: fall-through

Sin `break`, **cae al siguiente case**. A veces es útil (agrupar casos), a veces es un bug.

```js
switch (day) {
  case "sat":
  case "sun":
    console.log("weekend"); // agrupado a propósito
    break;
  case "mon":
    console.log("lunes");
    // sin break: cae a "tue"
  case "tue":
    console.log("martes");
    break;
}
```

### `default` no tiene que ir al final

Aunque por convención sí. Y si pones `default` sin `break`, también cae al siguiente.

### Alternativa moderna: objeto-mapa

Cuando es solo "según X devuelve Y", muchas veces es más limpio con un objeto:

```js
const labels = { sat: "weekend", sun: "weekend", mon: "lunes" };
const label = labels[day] ?? "desconocido";
```

`switch` brilla cuando hay **lógica** en cada rama, no solo mapeo.

---

## 3. Bucles imperativos

### `for` clásico

Tres partes opcionales: `init; condition; update`.

```js
for (let i = 0; i < 5; i++) {
  console.log(i);
}
```

Cualquier parte puede omitirse: `for (;;) { ... }` es bucle infinito.

**Detalle importante**: la `i` declarada con `let` es **una por iteración** (cada vuelta crea un nuevo binding). Esto importará en closures (módulo 18), pero por ahora basta saber que `let` aquí se comporta bien.

### `while`

```js
let n = 10;
while (n > 0) {
  console.log(n);
  n--;
}
```

### `do...while`

Ejecuta **al menos una vez** antes de comprobar la condición.

```js
let answer;
do {
  answer = prompt("¿Seguir?");
} while (answer !== "no");
```

Raro en código real. Útil cuando el primer pase es obligatorio.

---

## 4. Iteración de colecciones

### `for...of` — para **valores** de iterables

```js
const arr = ["a", "b", "c"];
for (const item of arr) {
  console.log(item); // "a", "b", "c"
}
```

Funciona con arrays, strings, `Map`, `Set`, generators, `NodeList`... cualquier cosa con `Symbol.iterator` (módulo 29).

Para obtener índice **y** valor:

```js
for (const [i, item] of arr.entries()) {
  console.log(i, item);
}
```

### `for...in` — para **claves** de objetos

```js
const user = { name: "Ana", age: 30 };
for (const key in user) {
  console.log(key, user[key]);
}
```

### Trampa: `for...in` sobre arrays

```js
const arr = ["a", "b", "c"];
for (const i in arr) {
  console.log(i); // "0", "1", "2" como STRINGS, no como números
}
```

Y peor: itera **propiedades enumerables del prototipo** si las hay. Para arrays, **siempre** `for...of` o métodos (`forEach`, `map`...).

Regla práctica:

| Quiero...                 | Uso                                         |
| ------------------------- | ------------------------------------------- |
| Valores de array/iterable | `for...of`                                  |
| Índice + valor            | `for...of` con `.entries()`                 |
| Claves de objeto          | `Object.keys(obj)` + `for...of`             |
| Pares clave-valor objeto  | `Object.entries(obj)` + destructuring       |
| Algo en `for...in`        | Casi nunca. Solo objetos planos con cuidado |

---

## 5. `break` y `continue`

- **`break`**: sale del bucle (o `switch`) actual.
- **`continue`**: salta a la siguiente iteración.

```js
for (let i = 0; i < 10; i++) {
  if (i === 3) continue; // salta 3
  if (i === 7) break;    // termina en 7
  console.log(i); // 0, 1, 2, 4, 5, 6
}
```

### Labels (rareza pero existe)

Permiten romper / continuar un bucle **externo** desde uno anidado.

```js
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (i === 1 && j === 1) break outer; // sale del externo
    console.log(i, j);
  }
}
```

En código real las verás poco — normalmente se refactoriza extrayendo el bucle a una función y usando `return`. Pero existen; sabe que están.

---

## Ejercicio: `flow.js`

Crea el archivo `flow.js` en esta carpeta. Cada parte como bloque separado y comenta lo que esperas que imprima.

### Parte 1. `if` / `else`

Escribe `classify(age)` que devuelva:

- `"menor"` si `age < 18`
- `"adulto"` si `18 <= age < 65`
- `"senior"` si `age >= 65`
- `null` si `age` no es un number finito (reutiliza tu instinto del módulo 5)

Pruébalo con: `17`, `18`, `30`, `65`, `100`, `"30"`, `null`, `NaN`.

### Parte 2. `switch`

Escribe `httpLabel(status)` con `switch` que devuelva:

- `200`, `201`, `204` -> `"ok"`
- `301`, `302` -> `"redirect"`
- `400`, `401`, `403`, `404` -> `"client error"`
- `500`, `502`, `503` -> `"server error"`
- cualquier otro -> `"unknown"`

Aprovecha el **fall-through a propósito** para agrupar casos.

### Parte 3. Bucles

a) `sumTo(n)`: suma de 1 a `n` con `for` clásico. `sumTo(5)` -> `15`.

b) `countdown(n)`: imprime desde `n` hasta `1` con `while`. Si `n <= 0`, no imprime nada.

c) `firstVowel(str)`: con `for...of`, devuelve la **primera vocal** que encuentre, o `null` si no hay. Pista: `"aeiouAEIOU".includes(ch)`.

### Parte 4. `for...in` vs `for...of`

Dado:

```js
const user = { name: "Ana", age: 30, role: "admin" };
```

Escribe dos versiones que impriman `"clave: valor"` para cada propiedad:

- Una con `for...in`.
- Otra con `for...of` sobre `Object.entries(user)` y destructuring.

Comenta cuál te parece más limpia y por qué.

### Parte 5. `break` / `continue` / label

Tienes una matriz:

```js
const grid = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
```

Escribe `findFirst(grid, target)`: recorre con dos `for` anidados y devuelve `[i, j]` cuando encuentre `target`. Sale **inmediatamente** del bucle externo al encontrarlo. Si no está, devuelve `null`.

Hazlo en dos versiones:

a) **Con label** (`break outer`).

b) **Refactorizando a función** (sin label, usando `return` desde dentro).

Comenta cuál prefieres y por qué.

---

Cuando termines, lo revisamos juntos.
