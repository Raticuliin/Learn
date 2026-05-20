# Módulo 18 — Closures

Las closures ya aparecieron sin nombre propio en el módulo 16 (`makeMultiplier`, `makeTagger`). El mecanismo es central en JavaScript y conviene desempaquetarlo bien: explica desde patrones cotidianos como un contador con datos privados hasta bugs históricos del lenguaje (el `for` con `var`) y memory leaks sutiles.

## Objetivos

- Definir qué es una closure: función + variables del lugar donde se definió, capturadas y vivas mientras la función exista.
- Reconocer las cuatro situaciones típicas en las que una closure "escapa" de su scope: se devuelve, se asigna, se pasa como callback, se guarda en una estructura de datos.
- Entender que la captura es **por referencia a la variable**, no por copia de su valor.
- Usar closures para estado privado, contadores, memoización y partial application.
- Explicar el bug histórico del `for` con `var` y cómo `let` lo arregla solo.
- Saber por qué una closure puede mantener vivos objetos grandes sin querer.

---

## 1. Mecanismo

Una **closure** es una función que recuerda el sitio donde se definió. Cuando esa función escapa de ahí (la devuelves, la guardas en un objeto, la pasas como callback), sigue viendo las variables de ese sitio, no del lugar desde donde se la llame después.

```js
function makeMultiplier(factor) {
  return function (n) {
    return n * factor;
  };
}

const double = makeMultiplier(2);
const triple = makeMultiplier(3);

double(5); // 10
triple(5); // 15
```

Cuando `makeMultiplier(2)` termina su `return`, su scope local (con `factor = 2`) "debería" desaparecer. No desaparece: la función interna mantiene una referencia a esas variables, así que el scope sigue vivo mientras la closure exista.

Tres ideas que conviene fijar antes de seguir:

1. **Cada llamada al "creador" produce un scope nuevo.** `double` y `triple` viven en universos separados: cada uno tiene su propio `factor`.
2. **La captura es por referencia a la variable, no por copia de su valor.** Si la variable cambia después, la closure ve el cambio (lo veremos en la parte 4).
3. **La closure mantiene viva toda la cadena de scopes**, incluso variables que no usa. Es la causa de los memory leaks de la parte 5.

---

## 2. Estado privado: el contador

Hasta llegar a clases con `#privados` (módulo 25), las closures son **la** forma idiomática de tener datos verdaderamente inaccesibles desde fuera:

```js
function makeCounter() {
  let count = 0;
  return {
    inc() { count++; },
    dec() { count--; },
    get() { return count; },
  };
}

const c = makeCounter();
c.inc(); c.inc(); c.inc();
c.dec();
c.get(); // 2

c.count; // undefined  → no hay acceso directo
```

`count` no es propiedad del objeto devuelto. Solo existe dentro del scope de `makeCounter`. Los tres métodos comparten ese scope porque se definieron ahí, pero desde fuera no hay forma de leerla ni mutarla salvo a través de los métodos. Eso es encapsulación real.

Como cada llamada a `makeCounter()` crea un scope nuevo, dos contadores son independientes:

```js
const a = makeCounter();
const b = makeCounter();
a.inc(); a.inc();
a.get(); // 2
b.get(); // 0
```

---

## 3. Memoización

Cachear el resultado de una función pura en un `Map` capturado por la closure:

```js
function memoize(fn) {
  const cache = new Map();
  return function (arg) {
    if (cache.has(arg)) return cache.get(arg);
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}

const slowSquare = (n) => n * n;
const fastSquare = memoize(slowSquare);

fastSquare(5); // calcula y guarda
fastSquare(5); // devuelve cacheado
```

El `cache` no es accesible desde fuera. Cada llamada a `memoize(fn)` crea su propio `cache`, así que dos funciones memoizadas no se mezclan.

**Gotcha** (no parte del ejercicio, pero a tener presente): este `memoize` solo funciona limpio si el argumento sirve como clave de `Map` con identidad fiable. Para strings y números va bien. Para objetos, dos llamadas con objetos distintos pero "iguales en contenido" no compartirán cache (recuerdo del módulo 13: `Map` indexa objetos por referencia).

---

## 4. Captura por referencia: el bug del `for` con `var`

Lo más importante del módulo, y el bug clásico que entra en entrevistas. El siguiente código sorprende:

```js
const fns = [];
for (var i = 0; i < 3; i++) {
  fns.push(function () { return i; });
}

fns[0](); // 3
fns[1](); // 3
fns[2](); // 3
```

¿Por qué los tres devuelven `3`? Porque `var` declara **una sola variable `i`** compartida por todo el bucle (función-scope, módulo 2). Las tres closures capturan **la misma `i`**, no su valor en cada iteración. Cuando se las llama, todas miran esa única `i`, que después del bucle vale `3`.

Con `let` el problema desaparece, porque `let` crea **un binding nuevo por cada iteración** del `for`:

```js
const fns = [];
for (let i = 0; i < 3; i++) {
  fns.push(function () { return i; });
}

fns[0](); // 0
fns[1](); // 1
fns[2](); // 2
```

No es magia: es una regla específica de la spec para `for (let ...; ...; ...)`. Cada iteración tiene su propia `i`, y cada closure captura la suya.

Antes de que `let` existiera (pre-ES6), el truco era envolver el cuerpo del bucle en una función que se llamaba a sí misma para crear un scope nuevo por iteración:

```js
const fns = [];
for (var i = 0; i < 3; i++) {
  (function (j) {
    fns.push(function () { return j; });
  })(i);
}

fns[0](); // 0
```

`j` es un parámetro de esa función envolvente, así que cada vuelta tiene su propio `j` que vale lo que valía `i` en ese momento. Hoy no se escribe así, pero hay mucho código antiguo con este patrón y conviene saber qué resuelve.

---

## 5. Memory leaks: la closure retiene todo el scope

La closure mantiene viva **toda la cadena de scopes**, no solo las variables que usa. Esto puede retener objetos grandes sin querer:

```js
function setUp() {
  const huge = new Array(1_000_000).fill("dato");
  const small = "solo necesito esto";
  return function () {
    return small;
  };
}

const fn = setUp();
// `huge` puede seguir en memoria mientras `fn` exista,
// aunque la función devuelta nunca lo lea.
```

Algunos motores optimizan y liberan `huge` cuando detectan que ninguna closure de ese scope lo referencia. Otros no. **No es garantía.** Si vas a guardar una closure mucho tiempo (un event listener que vive toda la sesión, una entrada en un `Map`, un timer largo), revisa qué variables del scope padre arrastra.

Conexión con el módulo 13: si necesitas asociar datos a objetos sin retenerlos, [[weakmap-weakset]] es la herramienta. La closure por sí sola no es débil: lo que captura, lo mantiene vivo.

---

## Ejercicio: `closures.js`

Archivo con esqueleto en esta misma carpeta. Cinco partes. Rellena las funciones marcadas con `TODO` y ejecuta con `node closures.js` para comprobar.

### Parte 1. Factory `makePrefixer(prefix)`

Devuelve una función que toma un string y le antepone el prefijo. Tres prefixers distintos no deben mezclarse.

### Parte 2. Contador con estado privado

Implementa `makeCounter(start = 0, step = 1)` que devuelve un objeto con `inc`, `dec`, `reset`, `get`. El estado interno **no** debe ser accesible desde fuera del objeto devuelto. Dos contadores creados con `makeCounter` deben ser independientes.

### Parte 3. `memoize(fn)`

Memoiza una función pura de un solo argumento. Usa `Map` como cache. Cuenta cuántas veces se llama realmente a la función original.

### Parte 4. Arregla el bug del `for`

Dos versiones a corregir:

- **4a**: usando `let`.
- **4b**: usando `var` y la técnica de la función envolvente que se llama a sí misma.

### Parte 5. Pregunta de comprensión

Tienes en el archivo la función `setUp` de la parte 5 de este README. **Sin escribir código**, escribe en un comentario (1 o 2 frases) por qué el array `huge` puede seguir en memoria aunque la función devuelta nunca lo lea. Apunta al mecanismo, no al síntoma.

---

Cuando lo tengas, lo revisamos juntos.
