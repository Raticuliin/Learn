# callbacks

Una **callback** es una función que se pasa como argumento a otra función para que **esa otra** la invoque cuando le toque. No es magia ni un tipo de función especial: es solo una función usada como dato, gracias a que JS tiene funciones de primera clase (ver [[higher-order-functions]]).

## Ejemplos cotidianos

```js
[1, 2, 3].map(n => n * 2);                // n => n * 2 es callback
[1, 2, 3].filter(n => n > 1);             // predicado, callback
[3, 1, 2].toSorted((a, b) => a - b);      // comparador, callback
arr.forEach(item => console.log(item));   // efecto colateral
```

También fuera de Array: `setTimeout(fn, 1000)`, `element.addEventListener("click", fn)`, `promise.then(value => ...)`.

## Función como dato vs función invocada

El error clásico:

```js
arr.forEach(console.log);    // pasa la función → forEach la llama
arr.forEach(console.log());  // INVOCA console.log() ahora (devuelve undefined)
                             // → forEach recibe undefined → TypeError
```

Sin paréntesis = **valor función**. Con paréntesis = **resultado de llamarla**. Misma regla en cualquier sitio donde pasas una función.

## Inline vs nombrada extraída

```js
// inline: cómoda para una línea, local, sin reuso
[1, 2, 3].map(n => n * 2);

// nombrada y extraída: si se reutiliza, si es larga, o si quieres verla en stack traces
function double(n) { return n * 2; }
[1, 2, 3].map(double);
```

Heurística: inline si cabe en una línea y solo se usa ahí. Nombrada si se reutiliza o si la intención no es obvia de un vistazo.

## Lo que viene después

Esta nota cubre callbacks **síncronos** (la otra función las invoca antes de devolver). Los callbacks **asíncronos** (promises, eventos, I/O) llegan en la fase de asincronía: [[Promises]], [[async-await]], [[callback-hell]].
