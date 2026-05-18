# Módulo 16 — Funciones de primera clase

Arranca la **Fase 3** del curso. Hasta aquí hemos usado funciones para encapsular lógica. Ahora damos un paso conceptual: las funciones **son datos**. Como cualquier otro valor, se pueden asignar, guardar en estructuras, pasar como argumento y devolver. Esto te abre la puerta a `map`/`filter`/`reduce` formalmente (ya los usabas), patrones de configuración, y todo lo que viene después en la fase.

## Objetivos

- Entender que en JS una función es un valor más, sin nada especial respecto a un número o un string.
- Pasar funciones como argumento (**callbacks**) y devolverlas desde otras funciones.
- Reconocer y escribir **higher-order functions (HOF)**: funciones que reciben y/o devuelven funciones.
- Distinguir entre **pasar la función** (`fn`) e **invocarla** (`fn()`) — error clásico, ya te asomó en el módulo 9.
- Decidir cuándo escribir un callback inline corto y cuándo extraerlo a una función nombrada.

---

## 1. Funciones como valores

Cuando declaras una función con `function` o la asignas con `=>`, lo que JS guarda en memoria es un **objeto función**. Y ese objeto, como cualquier otro, puede vivir donde tú quieras:

```js
// asignada a variable: lo haces desde el módulo 7
const greet = name => `hola, ${name}`;

// guardada en un array
const transforms = [
  n => n * 2,
  n => n + 1,
  n => -n,
];

console.log(transforms[0](5)); // 10

// guardada como propiedad de un objeto
const ops = {
  double: n => n * 2,
  square: n => n * n,
};

console.log(ops.double(3)); // 6
```

No hay "tipo función especial" con reglas aparte. Es un valor que casualmente se puede **invocar** con `()`.

> Cuando un lenguaje permite tratar sus funciones así, se dice que tiene **funciones de primera clase**. Lo verás en docs y conversaciones, no es un tecnicismo gratuito.

---

## 2. Pasar una función como argumento: callbacks

Un **callback** es una función que pasas a otra **para que esa otra la invoque por ti**. Ya los has usado a montones:

```js
[1, 2, 3].map(n => n * 2);          // n => n * 2 es un callback
[1, 2, 3].filter(n => n > 1);       // predicado, también callback
[3, 1, 2].toSorted((a, b) => a - b); // comparador
```

Pero el patrón no es exclusivo de los métodos de array. Tú puedes escribir tu propia función que reciba otra:

```js
function repeat(times, action) {
  for (let i = 0; i < times; i++) {
    action(i);
  }
}

repeat(3, i => console.log(`vuelta ${i}`));
// vuelta 0
// vuelta 1
// vuelta 2
```

`repeat` no sabe qué quieres hacer en cada vuelta. **Tú le pasas el comportamiento**. Ese es el cambio mental: en vez de escribir un bucle cada vez, escribes un bucle parametrizado por la acción.

---

## 3. Devolver una función desde otra función

El otro sentido. Una función puede **construir y devolver** otra función:

```js
function makeMultiplier(factor) {
  return n => n * factor;
}

const double = makeMultiplier(2);
const triple = makeMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

`makeMultiplier` no multiplica. **Fabrica** funciones que multiplican. Cada llamada produce una nueva función con su propio `factor` guardado.

> El cómo "se acuerda" `double` del valor `2` cuando `makeMultiplier` ya terminó tiene nombre — se llama **closure** y es el módulo 18. Por ahora basta con observar que funciona.

---

## 4. Higher-order functions (HOF)

Una **higher-order function** es una función que cumple al menos una de estas dos cosas:

- recibe una función como argumento, o
- devuelve una función.

Por tanto: `map`, `filter`, `reduce`, `forEach`, `sort`, `find`, `every`, `some`, `repeat` del ejemplo 2, `makeMultiplier` del ejemplo 3... todas son HOF.

¿Para qué sirve nombrarlo? Para reconocer el patrón cuando lo veas y para escribirlo cuando convenga. **Una HOF te deja parametrizar el comportamiento, no solo los datos.** Es el mismo salto que dar `a + b` parametrizando los números — pero un nivel arriba: ahora parametrizas la **operación**.

Ejemplo de HOF a mano: tu propio `filter`.

```js
function myFilter(arr, keep) {
  const result = [];
  for (const item of arr) {
    if (keep(item)) result.push(item);
  }
  return result;
}

myFilter([1, 2, 3, 4], n => n % 2 === 0); // [2, 4]
```

Casi todo lo que hace `Array.prototype.filter` cabe en esas seis líneas. El truco está en el parámetro `keep`: una función que decide qué pasar.

---

## 5. Función como **dato** vs función **invocada**

Esto es el error más común con primera clase, y ya te tocó en el módulo 9 (`!Number.isFinite` sin paréntesis, pero también pasa al revés). Mira:

```js
const numbers = [1, 2, 3];

numbers.forEach(console.log);
// 1 0 (Array)
// 2 1 (Array)
// 3 2 (Array)

numbers.forEach(console.log());
// TypeError: undefined is not a function
```

- `console.log` (sin paréntesis) **es la función**. La pasas como callback. `forEach` la llama tres veces.
- `console.log()` **invoca** `console.log` ahora mismo (con cero argumentos → imprime una línea vacía y devuelve `undefined`). Lo que pasas a `forEach` es `undefined`, no una función. Petada.

Misma regla en `setTimeout(fn, 1000)` vs `setTimeout(fn(), 1000)`, en handlers de eventos, en `.then(...)` de Promesas... en todo. **Si lo que sigue tras el nombre son paréntesis, estás llamando. Si no, estás referenciando.**

---

## 6. Callback inline vs función nombrada

Las dos opciones son válidas:

```js
// inline (arrow): cómoda para callbacks de una línea, locales, sin reuso
[1, 2, 3].map(n => n * 2);

// nombrada extraída: mejor si se reutiliza, si es compleja o si quieres ver el nombre en errores
function double(n) {
  return n * 2;
}
[1, 2, 3].map(double);
```

Heurística rápida:

- **Inline** si cabe en una línea, solo se usa en ese sitio, y leerla no exige pensar.
- **Nombrada y extraída** si se repite, si es lo bastante larga para que su intención no sea obvia de un vistazo, o si te interesa que aparezca con su nombre en un stack trace al depurar.

No hay regla rígida. Pero "todo siempre inline" produce código difícil de leer cuando crece, y "todo siempre extraído" rompe el flujo cuando el callback es trivial.

---

## Ejercicio

Archivo: `first-class.js` (ya creado con esqueleto).

Cinco partes:

1. **Funciones como valores**: guardar funciones en un array y en un objeto, invocarlas a través de ambas estructuras.
2. **Recibir funciones**: implementar `repeat(n, action)` y `applyTwice(value, fn)`.
3. **Devolver funciones**: implementar `makeMultiplier(factor)` y `makeTagger(prefix)`.
4. **HOF a mano**: implementar tu propio `myFilter(arr, keep)` y `myMap(arr, transform)`. Comprobar que dan lo mismo que los nativos.
5. **Análisis escrito**: tres líneas de código con `console.log` como callback (una correcta, una rota, una con arrow). Tú explicas qué hace cada una y por qué.

Lo abres, lees los `// TODO`, y rellenas. Los `console.log` de prueba ya tienen al lado el resultado esperado.

---

## Recursos

- [javascript.info — Variable scope, closure (intro a funciones como valores)](https://javascript.info/closure)
- [javascript.info — Callbacks](https://javascript.info/callbacks)
- [MDN — First-class Function](https://developer.mozilla.org/en-US/docs/Glossary/First-class_Function)
- [MDN — Functions (sección "Functions are first-class objects")](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)
