# closures

Una **closure** es una función que sigue viendo las variables del sitio donde se definió, incluso después de que ese sitio ya no esté activo. Es la consecuencia natural de que en JS las funciones se traten como valores: si una función puede sobrevivir a su scope padre (devuelta, guardada, pasada como callback), las variables que usa también deben sobrevivir.

## El mecanismo

```js
function makeMultiplier(factor) {
  return function (n) {
    return n * factor;
  };
}

const double = makeMultiplier(2);
double(5);   // 10
```

Cuando `makeMultiplier(2)` termina su `return`, su scope local (con `factor = 2`) "debería" desaparecer. No desaparece: la función interior mantiene una referencia a `factor`, así que el scope sigue vivo mientras esa función exista.

Tres ideas que fijan el mecanismo:

1. **Cada llamada al "creador" crea un scope nuevo.** Dos closures producidas por dos llamadas distintas viven en universos separados.
2. **Captura por referencia a la variable**, no por copia del valor. Si la variable cambia después, el closure ve el cambio.
3. **Sobrevive toda la cadena de scopes**, incluyendo variables del padre que el closure no usa. Origen de los memory leaks.

## Casos de uso

### Estado privado

Hasta llegar a campos privados `#` en clases, las closures son la única forma de tener datos verdaderamente inaccesibles:

```js
function makeCounter() {
  let count = 0;
  return {
    inc() { count++; },
    get() { return count; },
  };
}
```

`count` no es propiedad del objeto devuelto. Solo existe en el scope de `makeCounter`. Desde fuera no hay forma de leerlo ni mutarlo salvo a través de los métodos.

### Memoización

Cachear resultados en una estructura capturada por el closure:

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
```

El `cache` no es accesible desde fuera y cada `memoize(fn)` tiene el suyo propio. Funciona limpio para argumentos que sirven como clave de Map con identidad fiable (strings, números). Para objetos, dos llamadas con objetos "iguales en contenido" pero referencias distintas no comparten cache (regla de [[js-map]]).

### Partial application

Pre-cargar argumentos devolviendo una función con esos argumentos ya en el scope:

```js
const greet = (salutation, name) => `${salutation}, ${name}!`;
const hola = (name) => greet("Hola", name);
```

Más adelante, [[call-apply-bind]] con `bind` y `null` como `thisArg` hace lo mismo de forma menos artesanal.

## El bug del `for` con `var`

El gotcha clásico:

```js
const fns = [];
for (var i = 0; i < 3; i++) {
  fns.push(function () { return i; });
}
fns[0]();   // 3   (no 0)
fns[1]();   // 3
fns[2]();   // 3
```

`var` declara **una sola variable `i`** compartida por todo el bucle. Los tres closures capturan **la misma `i`**, no su valor en cada iteración. Al llamarlos después del bucle, todos miran la misma `i`, que ya vale `3`.

Con `let` el problema desaparece porque la spec define que `for (let ...; ...; ...)` crea un binding nuevo por iteración:

```js
for (let i = 0; i < 3; i++) {
  fns.push(function () { return i; });
}
fns[0]();   // 0
```

Antes de `let`, el truco era envolver el cuerpo del bucle en una función que se llamaba a sí misma para forzar un scope nuevo por vuelta:

```js
for (var i = 0; i < 3; i++) {
  ((j) => fns.push(() => j))(i);
}
```

El parámetro `j` es un binding nuevo en cada invocación, y cada closure captura el suyo. El nombre `j` es solo convención: podría ser `i` (sombreando al exterior) y funcionaría igual. Lo que importa es que sea un **parámetro**, no la misma variable del bucle.

Hoy ya no se escribe así pero hay mucho código antiguo con este patrón. Cuando aparezca, ya se sabe qué resuelve.

## Memory leaks

El closure mantiene viva **toda la cadena de scopes**, no solo lo que usa:

```js
function setUp() {
  const huge = new Array(1_000_000).fill("dato");
  const small = "solo esto";
  return function () { return small; };
}
const fn = setUp();
// `huge` puede seguir en memoria mientras `fn` exista,
// aunque la closure no lo lea nunca.
```

Algunos motores optimizan y liberan variables del scope padre que ninguna closure referencia. Otros no. No es garantía. Si un closure se va a guardar mucho tiempo (event listener, entrada en un Map, timer largo), conviene revisar qué arrastra del scope padre.

Si se necesita asociar datos a objetos sin retenerlos, la herramienta es [[weakmap-weakset]]. El closure por sí solo no es débil.

Relacionadas: [[higher-order-functions]], [[var-let-const]], [[weakmap-weakset]], [[arrow-functions]].
