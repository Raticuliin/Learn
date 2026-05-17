# Módulo 7. Funciones I

## Objetivos

- Distinguir **declaración** y **expresión** de función, y entender qué implica cada una (hoisting, naming).
- Dominar los **parámetros**: por defecto, **rest**, y cómo se comportan con `undefined` / `null`.
- Conocer las trampas de `return` (la del **ASI** sobre todo).
- Diferenciar **arrow functions** de `function` más allá de la sintaxis: qué pierden y qué ganan.

Lo que NO entra aquí (módulos futuros):

- `this`, `call`/`apply`/`bind` → módulo 17.
- Closures, funciones como datos → módulos 16-18.
- Recursión, currying, composición → módulos 19-20.

---

## 1. Declaración vs expresión

### Function declaration

Forma "clásica":

```js
function greet(name) {
  return `Hola, ${name}!`;
}
```

Características:

- Tiene **nombre obligatorio** (`greet`).
- Es **hoisted completa**: puedes llamarla antes de su definición en el mismo scope.

```js
sayHi("Iván"); // ✓ funciona
function sayHi(name) {
  console.log(`Hola, ${name}`);
}
```

### Function expression

La función es un **valor**, lo asignas a una variable (normalmente `const`):

```js
const greet = function (name) {
  return `Hola, ${name}!`;
};
```

Características:

- El nombre es **opcional** (anónima por defecto). DevTools usa el nombre de la variable para los stack traces, así que no pasa nada por dejarla anónima.
- **No hoisted como función**: solo se hoistea el binding (la variable), no el valor. Si la llamas antes de la línea, da `ReferenceError` (TDZ con `const`/`let`) o `undefined is not a function` (con `var`).

```js
sayBye("Iván"); // ✗ ReferenceError
const sayBye = function (name) {
  console.log(`Adiós, ${name}`);
};
```

### Named function expression

Variante: expresión con nombre interno.

```js
const factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1); // puede referirse a sí misma por `fact`
};
```

El nombre `fact` solo es visible **dentro** de la propia función. Útil para recursión y stack traces más claros. Poco frecuente en código moderno.

### ¿Cuándo cada una?

- **Expresión** (`const fn = ...`) es lo habitual hoy: encaja con el estilo `const` por defecto, te avisa si la usas antes de tiempo.
- **Declaración** se sigue viendo en código antiguo, librerías, y en utilidades top-level cuando quieres explícitamente que estén disponibles arriba del archivo.

---

## 2. Parámetros

### Parámetros por defecto

```js
function priceWithTax(price, taxRate = 0.21) {
  return price * (1 + taxRate);
}

priceWithTax(100);       // 121
priceWithTax(100, 0.10); // 110
```

Detalles importantes:

- El default se aplica **solo si el argumento es `undefined`** (incluido el caso de no pasarlo).
- `null` **no** activa el default: cuenta como valor explícito.

```js
priceWithTax(100, undefined); // 121 (usa default)
priceWithTax(100, null);      // 100 (null * (1+null) = 100*1 = 100, raro pero válido)
```

- Se evalúan **en cada llamada**, no una sola vez. Puedes poner expresiones e incluso llamadas a otras funciones.
- Pueden referirse a **parámetros previos**:

```js
function formatUser(name, role = "guest", isAdmin = role === "admin") {
  return { name, role, isAdmin };
}
```

### Rest parameters

Agrupan "el resto" de argumentos en un **array real**:

```js
function sum(...nums) {
  let total = 0;
  for (const n of nums) total += n;
  return total;
}

sum();           // 0
sum(1, 2, 3);    // 6
```

Reglas:

- Debe ser **el último** parámetro.
- Solo uno por función.
- Puedes tener fijos antes: `function logEvent(level, ...args)`.

### Rest vs `arguments`

`arguments` es un objeto antiguo que existe **dentro de funciones declaradas con `function`** y contiene todos los argumentos:

```js
function old() {
  console.log(arguments); // Arguments(3) [1, 2, 3]
}
old(1, 2, 3);
```

Problemas de `arguments`:

- **No es un array** (es array-like): no tiene `map`, `filter`, etc. directamente.
- **No existe en arrow functions**.
- Se vuelve raro al mezclarlo con default params.

Hoy se usa **rest** siempre. `arguments` es legacy; reconócelo si lo ves en código viejo y refactorízalo.

---

## 3. `return`

Termina la función y devuelve el valor.

```js
function double(x) {
  return x * 2;
}
```

Sin valor (o sin `return`), devuelve `undefined`:

```js
function noop() {
  return;
}
noop(); // undefined
```

### Gotcha: ASI (Automatic Semicolon Insertion)

JS inserta `;` automáticamente en ciertos saltos de línea. Con `return`, esto es una **trampa clásica**:

```js
function makeUser(name) {
  return
  {
    name: name,
  };
}

makeUser("Iván"); // undefined !!
```

El motor interpreta:

```js
return;       // ← punto y coma insertado aquí
{ name: name }; // ← bloque suelto inalcanzable
```

Regla práctica: **abre la llave en la misma línea** del `return`.

```js
return {
  name: name,
};
```

Aplica también a `return (` y a cualquier expresión multilínea tras `return`.

---

## 4. Arrow functions vs `function`

### Sintaxis

```js
// Equivalentes en sintaxis básica:
const add1 = function (a, b) { return a + b; };
const add2 = (a, b) => { return a + b; };
const add3 = (a, b) => a + b;          // return implícito
const square = x => x * x;              // un solo param, sin paréntesis
```

Reglas de sintaxis arrow:

- **0 o 2+ parámetros** → paréntesis obligatorios: `() => 1`, `(a, b) => a + b`.
- **1 parámetro** → paréntesis opcionales. La mayoría de linters (ESLint, Biome) los pide igualmente.
- **Cuerpo de una expresión sin llaves** → return implícito.
- **Con llaves** → necesitas `return` explícito.

### Trampa: devolver un objeto literal

Esto **no compila como esperarías**:

```js
const makeUser = (name) => { name: name }; // ✗ ¡bloque con label, devuelve undefined!
```

JS lee `{` como inicio de bloque. Para devolver un objeto en return implícito, **envuélvelo en paréntesis**:

```js
const makeUser = (name) => ({ name: name }); // ✓
```

### Diferencias reales con `function`

Más allá de la sintaxis, las arrow functions:

1. **`this` léxico**: heredan el `this` del scope donde se definieron, no lo reciben en la llamada. Esto es la diferencia *grande*, pero la veremos en el módulo 17. Por ahora: úsalas con tranquilidad para callbacks, no las uses como métodos de objeto/clase.

2. **No tienen `arguments`** (usa rest si lo necesitas).

3. **No se pueden usar con `new`**: no son constructores.

   ```js
   const Foo = () => {};
   new Foo(); // ✗ TypeError: Foo is not a constructor
   ```

4. **No hoisted** (son expresiones, ya lo vimos arriba).

5. **No tienen `prototype`**: irrelevante hasta el módulo 22.

### ¿Cuál usar?

Convención moderna razonable (no es ley):

- **Arrow** para todo lo que sea **callback corto**, **helper local**, **función pura**.
- **`function`** para **métodos** (que necesitan su propio `this`), **constructores** (si no usas `class`), y top-level cuando el hoisting te aporta legibilidad.

Dentro de `class`, los métodos se declaran sin la palabra `function`; eso es otro tema (módulo 24).

---

## Ejercicio: `functions.js`

Crea el archivo `functions.js` en esta carpeta. Cada parte como bloque separado. Comenta qué esperas que imprima cada `console.log` antes de ejecutarlo, y luego ejecuta con `node functions.js` para confirmar.

### Parte 1. Declaración vs expresión

a) Define `greet(name)` como **function declaration**: devuelve `"Hola, <name>!"`.

b) Define `farewell` como **function expression** asignada a `const`: devuelve `"Adiós, <name>!"`.

c) Intenta llamar a `greet("Iván")` **antes** de su definición. Funciona o falla?

d) Intenta llamar a `farewell("Iván")` **antes** de su definición. Funciona o falla? ¿Qué error sale?

Comenta los resultados.

### Parte 2. Parámetros por defecto

a) `priceWithTax(price, taxRate = 0.21)`: devuelve `price * (1 + taxRate)`.

Pruébalo con:
- `priceWithTax(100)`
- `priceWithTax(100, 0.10)`
- `priceWithTax(100, undefined)`
- `priceWithTax(100, null)` (explica el resultado en un comentario)

b) `formatUser(name, role = "guest", isAdmin = role === "admin")`: devuelve un objeto `{ name, role, isAdmin }`.

Pruébalo con:
- `formatUser("Iván")`
- `formatUser("Iván", "admin")`
- `formatUser("Iván", "admin", false)`

### Parte 3. Rest

a) `sum(...nums)`: suma todos los números recibidos.
- `sum()` → `0`
- `sum(1, 2, 3, 4)` → `10`

b) `maxOf(first, ...rest)`: devuelve el mayor de todos los argumentos.
- `maxOf()` → `undefined`
- `maxOf(5)` → `5`
- `maxOf(3, 7, 2, 9, 4)` → `9`

(Nota: existe `Math.max(...arr)` pero queremos que lo hagas a mano con un bucle, para fijar rest.)

### Parte 4. Return y ASI

a) Escribe `makeUser(name, age)` que devuelva `{ name, age, adult: age >= 18 }` con el `{` **en la misma línea** del `return`.

b) Justo debajo, escribe una versión "rota" (comentada con `//`) que ponga el `{` en la línea siguiente, y explica qué devolvería y por qué.

### Parte 5. Arrow functions

a) Reescribe `priceWithTax` y `sum` como **arrow functions**. Usa return implícito donde puedas.

b) Escribe un arrow `userOf(name, age)` que devuelva el objeto `{ name, age }` con **return implícito**. Acuérdate de los paréntesis alrededor del objeto.

c) Escribe `makeGreeter(salute)` (arrow) que devuelva **otra función** (también arrow) `(name) => "<salute>, <name>!"`.

Pruébalo:

```js
const hello = makeGreeter("Hello");
const hola = makeGreeter("Hola");
console.log(hello("Ivan")); // "Hello, Ivan!"
console.log(hola("Iván"));  // "Hola, Iván!"
```

(Esto es un primer contacto con funciones que devuelven funciones; lo veremos a fondo en closures.)

---

Cuando termines, lo revisamos juntos.
