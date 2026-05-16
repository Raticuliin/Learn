# Módulo 2. Variables y bindings

## Objetivos

Al terminar este módulo sabrás:

- Cuándo usar `const`, `let` y `var` (y por qué `var` casi nunca).
- Qué es **hoisting** y cómo se comporta con cada tipo de declaración.
- Qué es la **Temporal Dead Zone (TDZ)** y por qué existe.
- La diferencia entre **block scope** y **function scope**, y cómo afecta al código real.

---

## 1. Tres formas de declarar (y por qué no son intercambiables)

```js
const PI = 3.14159;      // binding inmutable: no se puede reasignar
let counter = 0;          // binding mutable: se puede reasignar
var legacy = "hola";      // forma vieja, function-scoped (evitar)
```

Reglas modernas (2026):

- **`const` por defecto**. Si no vas a reasignar, usa `const`.
- **`let` solo cuando necesites reasignar** (contadores, acumuladores, bindings que cambian en un bucle, etc.).
- **`var`**: en código nuevo, **no**. Solo conviene reconocerlo cuando lo veas en código heredado.

### "Const no es inmutable"

Cuidado con el matiz: `const` impide reasignar el binding, **no** mutar el contenido si es un objeto o array.

```js
const user = { name: "Ivan" };
user.name = "Iván";       // OK: muta una propiedad del objeto
user = { name: "Otro" };  // TypeError: assignment to constant
```

Para inmutabilidad real, ya hablaremos de `Object.freeze` y `structuredClone` (módulo 11 y fase 13).

---

## 2. Block scope vs function scope

```js
function demo() {
  if (true) {
    var a = 1;
    let b = 2;
    const c = 3;
  }
  console.log(a); // 1   ← var "se escapa" del bloque
  console.log(b); // ReferenceError
  console.log(c); // ReferenceError
}
```

- `var`: **function-scoped**. El bloque `if` no la contiene; solo la función la contiene.
- `let` / `const`: **block-scoped**. Cualquier `{ ... }` (if, for, while, bloque suelto) las contiene.

Por eso `var` causa bugs sutiles en bucles, switches y bloques anidados — el binding fuga.

---

## 3. Hoisting

JavaScript procesa las **declaraciones** antes de ejecutar el cuerpo del scope. Conceptualmente "sube" las declaraciones arriba. Pero el comportamiento varía:

```js
console.log(x); // undefined  (no error, pero tampoco el valor)
var x = 5;

console.log(y); // ReferenceError: cannot access 'y' before initialization
let y = 5;
```

- `var`: se hoistea **y** se inicializa a `undefined`. Puedes leerla antes de la línea de declaración (devuelve `undefined`).
- `let` y `const`: también se hoistean, pero **NO** se inicializan. Quedan en la **TDZ**.

> El término correcto es: el **binding** existe desde el inicio del scope, pero está **uninitialized** hasta que el motor ejecuta la línea de la declaración.

---

## 4. Temporal Dead Zone (TDZ)

Es la **zona entre el inicio del scope y la línea donde se declara** la variable. Dentro de la TDZ, leer o asignar la variable lanza `ReferenceError`.

```js
{
  // ↓ aquí empieza la TDZ de `name`
  console.log(name); // ReferenceError
  name = "tarde";    // ReferenceError también
  let name = "Ivan"; // ← aquí termina la TDZ
  console.log(name); // "Ivan"
}
```

Por qué existe: convierte un bug silencioso (leer `undefined` sin querer, como pasa con `var`) en un error explícito. Te obliga a declarar antes de usar.

---

## 5. Resumen comparativo

| Aspecto | `var` | `let` | `const` |
|---|---|---|---|
| Scope | función | bloque | bloque |
| Hoisting | sí, inicializada a `undefined` | sí, en TDZ | sí, en TDZ |
| Reasignable | sí | sí | no |
| Redeclarable en el mismo scope | sí | no | no |
| Uso en 2026 | evitar | cuando reasignas | **default** |

---

## Ejercicio

Crea `bindings.js` **en esta misma carpeta**. Tres partes:

### Parte 1. Refactor del `hello.js` anterior

Copia (o re-escribe) el `hello.js` del módulo 1 dentro de `bindings.js`, pero esta vez usa la regla moderna: **`const` por defecto, `let` solo donde lo necesites reasignar**. Las primitivas del módulo 1 no se reasignan en ningún momento; piensa qué declaración corresponde.

### Parte 2. TDZ en vivo

Añade un bloque que **provoque** un `ReferenceError` por TDZ:

```js
{
  // intenta usar una variable con `let` o `const` ANTES de declararla
  // ejecuta y observa el error
}
```

Después, comenta esa línea y deja el bloque "correcto". El objetivo es que veas el error con tus propios ojos.

### Parte 3. Var se escapa

Escribe una función `demoVarLeak()` que:

1. Dentro de un `if (true) { ... }` declare una variable con `var` y otra con `let`.
2. **Después** del `if`, intente imprimir ambas con `console.log`.
3. Ejecuta y observa qué pasa con cada una.

Bonus si te apetece: el mismo experimento con un `for` clásico (`for (var i = 0; i < 3; i++)` vs `for (let i = ...)`) e imprime `i` después del bucle.

### Qué espero ver cuando lo enseñes

- El archivo `bindings.js` con las tres partes.
- Lo que observaste en cada parte (qué imprimió, qué falló, por qué crees que pasa).
- En particular en la parte 3, una frase tuya explicando **por qué** `var` se escapa y `let` no.

Cuando lo tengas, me lo enseñas y revisamos con preguntas.
