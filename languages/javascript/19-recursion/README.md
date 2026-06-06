# Módulo 19 — Recursión

Una función recursiva es una función que se llama a sí misma. Ya la rozaste sin querer en el módulo 18 (las closures que devuelven funciones no son recursión, pero el "una función que se referencia a sí misma" prepara la cabeza). Aquí lo formalizamos: cómo se estructura, qué pasa en la pila de llamadas, por qué en Node la recursión profunda **revienta** (y por qué el truco famoso para evitarlo no funciona aquí), y cuándo la recursión gana de verdad a un bucle.

## Objetivos

- Estructurar una función recursiva: **caso base** + **caso recursivo**, y por qué olvidar el base es fatal.
- Entender la **pila de llamadas**: cada llamada pendiente ocupa un frame, y el espacio es finito (`RangeError: Maximum call stack size exceeded`).
- Reconocer el patrón del **acumulador como parámetro** y qué es una **llamada en posición de cola** (tail call).
- Saber el estado real de la optimización de tail calls en los motores de 2026 (y por qué en Node **no** te salva).
- Escribir **recursión mutua** (dos funciones que se llaman entre sí).
- Identificar dónde la recursión brilla: **estructuras anidadas** (árboles, objetos/arrays anidados), donde la profundidad la pone el dato, no el tamaño.
- Convertir una recursión en un bucle con pila explícita cuando la profundidad puede ser grande.

---

## 1. Anatomía: caso base + caso recursivo

Toda función recursiva necesita dos cosas:

- **Caso base**: la condición que corta la recursión y devuelve un resultado directo, sin volver a llamarse.
- **Caso recursivo**: se llama a sí misma con un problema **más pequeño**, acercándose al caso base.

```js
function factorial(n) {
  if (n <= 1) return 1;        // caso base
  return n * factorial(n - 1); // caso recursivo, n más pequeño
}

factorial(4); // 4 * 3 * 2 * 1 = 24
```

Si olvidas el caso base (o el caso recursivo no se acerca a él), la función se llama para siempre... hasta que se acaba el espacio de la pila y JavaScript lanza un error. No es un bucle infinito silencioso: es una muerte ruidosa.

```js
function broken(n) {
  return n * broken(n - 1); // nunca para
}
broken(4); // RangeError: Maximum call stack size exceeded
```

---

## 2. La pila de llamadas

Cuando `factorial(4)` llama a `factorial(3)`, la primera llamada **no ha terminado**: está esperando el resultado de la segunda para multiplicar por `n`. Cada llamada pendiente ocupa un *frame* en la **pila de llamadas** (call stack). Para `factorial(4)`:

```
factorial(4)  → 4 * factorial(3)
  factorial(3)  → 3 * factorial(2)
    factorial(2)  → 2 * factorial(1)
      factorial(1)  → 1              ← caso base, empieza a "deshacerse"
```

Solo cuando se alcanza el caso base la pila empieza a colapsar de dentro hacia fuera, resolviendo cada multiplicación. La pila tiene un tamaño finito (en Node, del orden de ~10.000-15.000 frames según config). Una recursión con demasiada profundidad la desborda:

```js
function count(n) {
  if (n === 0) return "done";
  return count(n - 1);
}
count(100000); // RangeError: Maximum call stack size exceeded
```

Esto es clave: **la profundidad de la recursión está acotada por la pila**. Si tu recursión crece con el tamaño de la entrada (un número grande, un array largo), tienes un problema latente.

---

## 3. El acumulador y la posición de cola

Mira la diferencia entre estas dos versiones de factorial:

```js
// Versión 1: la llamada NO es lo último que pasa.
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1); // tras volver, todavía hay que multiplicar
}

// Versión 2: la llamada recursiva ES lo último que pasa.
function factorial(n, acc = 1) {
  if (n <= 1) return acc;
  return factorial(n - 1, n * acc); // nada pendiente después
}
```

En la **versión 2**, el resultado de la llamada recursiva se devuelve tal cual, sin operaciones pendientes encima. El cálculo se va arrastrando en el **acumulador** (`acc`), un parámetro extra. Cuando la llamada recursiva es la **última** operación de la función, se dice que está en **posición de cola** (tail call).

¿Por qué importa? Porque si no queda nada pendiente en el frame actual, en teoría el motor podría **reutilizar el frame** en vez de apilar uno nuevo — convirtiendo la recursión en algo tan barato como un bucle, sin riesgo de desbordar la pila. Eso se llama **optimización de tail calls** (TCO / proper tail calls, PTC).

---

## 4. Tail calls en la realidad (2026)

Aquí viene la trampa. La optimización de tail calls **está en la especificación** de JavaScript desde ES2015. Pero diez años después:

- **JavaScriptCore** (Safari, y el runtime **Bun**): la implementa. ✅
- **V8** (Chrome, **Node.js**): **NO** la implementa. La rechazaron explícitamente. ❌
- **SpiderMonkey** (Firefox): **NO**. ❌

O sea: **en Node (nuestro runtime del curso) escribir la versión con acumulador NO te salva del stack overflow.** La versión 2 de la parte 3 es más "limpia" en teoría, pero en Node desborda la pila exactamente igual que la versión 1 con entradas grandes.

Conclusión práctica para 2026:

> No confíes en la optimización de tail calls en código que tiene que correr en cualquier sitio. Si la profundidad puede ser grande, **convierte la recursión en un bucle** (parte 7). La recursión profunda es segura solo cuando la profundidad está acotada por el dato (un árbol de pocos niveles), no por el tamaño de la entrada.

---

## 5. Recursión mutua

Dos (o más) funciones que se llaman entre sí. El ejemplo de manual es par/impar definidos uno en términos del otro:

```js
function isEven(n) {
  if (n === 0) return true;
  return isOdd(n - 1);
}

function isOdd(n) {
  if (n === 0) return false;
  return isEven(n - 1);
}

isEven(10); // true
isOdd(7);   // true
```

Es elegante para ilustrar el concepto, pero comparte el mismo límite: `isEven(100000)` desborda la pila igual que cualquier otra recursión profunda. En producción, par/impar se hace con `n % 2`. La recursión mutua se gana su sitio en cosas como parsers (gramáticas donde una regla se define en términos de otra).

---

## 6. Donde la recursión gana: estructuras anidadas

Hasta aquí la recursión ha sido un sustituto incómodo de un bucle. Su terreno natural es otro: **datos con forma de árbol**, donde no sabes cuántos niveles de anidamiento hay.

```js
// Suma todos los números de un array que puede contener
// otros arrays, anidados a cualquier profundidad.
function deepSum(arr) {
  let total = 0;
  for (const item of arr) {
    if (Array.isArray(item)) {
      total += deepSum(item); // baja un nivel
    } else {
      total += item;
    }
  }
  return total;
}

deepSum([1, [2, 3, [4, [5]]], 6]); // 21
```

Hacer esto con un bucle plano es engorroso (necesitas gestionar tu propia pila a mano). La recursión expresa exactamente la idea: "para sumar el array, suma cada elemento; si un elemento es a su vez un array, aplícate a ti mismo". Y aquí la profundidad de la pila es la **profundidad del anidamiento** (típicamente pequeña), no el número de elementos — así que es segura.

Mismo patrón para recorrer un objeto anidado, un árbol del DOM (módulo 49), un sistema de ficheros, un JSON arbitrario.

---

## 7. De recursión a iteración (pila explícita)

Cuando la profundidad puede ser grande y no puedes confiar en la pila del motor, el patrón es **llevar tú la pila** en un array:

```js
function deepSumIterative(arr) {
  let total = 0;
  const stack = [...arr]; // tu propia pila, en el heap (no en el call stack)
  while (stack.length > 0) {
    const item = stack.pop();
    if (Array.isArray(item)) {
      stack.push(...item); // en vez de llamarte, apilas los hijos
    } else {
      total += item;
    }
  }
  return total;
}
```

Misma lógica, pero la pila vive en el **heap** (memoria de objetos, grande) en vez de en el **call stack** (pequeño y finito). No desborda. Es menos legible que la versión recursiva — por eso solo merece la pena cuando la profundidad realmente puede dispararse.

---

## Ejercicio: `recursion.js`

Archivo con esqueleto en esta misma carpeta. Rellena lo marcado con `TODO` y ejecuta con `node recursion.js`.

### Parte 1. `factorial(n)`

Versión recursiva clásica con caso base. No uses bucle ni acumulador todavía.

### Parte 2. `sumArray(nums)`

Suma de un array de números **plano**, de forma recursiva (sin `for`, sin `reduce`). Pista: el caso base es el array vacío; el recursivo es "primer elemento + suma del resto".

### Parte 3. `factorialAcc(n)` con acumulador

Reescribe factorial con un parámetro acumulador y la llamada recursiva en posición de cola. Luego ejecuta la línea de prueba que la llama con un número grande y **observa qué pasa en Node**. Escribe en un comentario qué esperabas y qué pasó.

### Parte 4. Recursión mutua `isEven` / `isOdd`

Impleméntalas llamándose la una a la otra. Solo para enteros `>= 0`.

### Parte 5. `deepSum(arr)`

Suma un array anidado a cualquier profundidad (números y subarrays). Recursión sobre la estructura.

### Parte 6. `flatten(arr)`

Devuelve un array nuevo, plano, con todos los elementos (no números necesariamente) de un array anidado, **en orden**. P.ej. `flatten([1, [2, [3, 4]], 5])` → `[1, 2, 3, 4, 5]`. (Sí, `Array.prototype.flat(Infinity)` existe — pero aquí lo haces a mano para practicar.)

### Parte 7. Pregunta de comprensión

Sin escribir código, en un comentario (1-2 frases): ¿por qué la versión de la parte 3 con acumulador **no** evita el `RangeError` en Node, si está en posición de cola? Apunta al motor.

---

Cuando lo tengas, lo revisamos juntos.
