# recursion

Una función **recursiva** se llama a sí misma para resolver un problema en términos de una versión más pequeña del mismo problema. Necesita dos piezas: un **caso base** que corta la recursión y un **caso recursivo** que se acerca a él.

```js
function factorial(n) {
  if (n <= 1) return 1;        // caso base
  return n * factorial(n - 1); // caso recursivo
}
```

Sin caso base (o con un recursivo que no se acerca a él) la función se llama hasta agotar la pila: `RangeError: Maximum call stack size exceeded`. No es un bucle infinito silencioso, es una muerte ruidosa.

## La pila de llamadas

Cada llamada pendiente ocupa un frame en el **call stack**. En `n * factorial(n - 1)`, la llamada externa no puede terminar hasta que la interna devuelva (todavía falta multiplicar). La pila crece hasta el caso base y luego colapsa de dentro hacia fuera.

El call stack es **finito** (en Node, del orden de ~10-15k frames). Por eso **la profundidad de la recursión está acotada por la pila**: si crece con el tamaño de la entrada, hay un desbordamiento latente.

## Acumulador y posición de cola

Arrastrar el cálculo en un parámetro extra (acumulador) deja la llamada recursiva como **última** operación de la función — eso es una **llamada en posición de cola** (tail call):

```js
function factorial(n, acc = 1) {
  if (n <= 1) return acc;
  return factorial(n - 1, n * acc); // nada pendiente después
}
```

La spec (ES2015) define que un motor *puede* reutilizar el frame en una tail call en vez de apilar uno nuevo (proper tail calls, PTC) — recursión tan barata como un bucle.

## Pero en 2026 casi nadie lo implementa

- **JavaScriptCore** (Safari, Bun): sí. ✅
- **V8** (Chrome, **Node**): no, rechazado. ❌
- **SpiderMonkey** (Firefox): no. ❌

Es decir: en Node, la versión con acumulador **desborda la pila igual** que la ingenua. No confíes en la optimización de tail calls en código portable. Si la profundidad puede ser grande → convertir a bucle.

## Recursión mutua

Dos funciones que se llaman entre sí. Mismo límite de pila:

```js
function isEven(n) { return n === 0 ? true  : isOdd(n - 1); }
function isOdd(n)  { return n === 0 ? false : isEven(n - 1); }
```

Didáctico, no práctico (par/impar es `n % 2`). Se gana su sitio en parsers y gramáticas.

## Dónde gana la recursión: estructuras anidadas

Su terreno natural son los **datos en forma de árbol**, donde no sabes cuántos niveles hay:

```js
function deepSum(arr) {
  let total = 0;
  for (const item of arr) {
    total += Array.isArray(item) ? deepSum(item) : item;
  }
  return total;
}
deepSum([1, [2, [3, [4]]]]); // 10
```

Aquí la profundidad de la pila es la del **anidamiento** (pequeña), no el número de elementos → segura. Mismo patrón para objetos anidados, árbol del DOM, sistema de ficheros, JSON arbitrario.

## De recursión a iteración

Cuando la profundidad puede dispararse, se lleva la pila a mano en un array (vive en el heap, grande, no en el call stack):

```js
function deepSumIterative(arr) {
  let total = 0;
  const stack = [...arr];
  while (stack.length) {
    const item = stack.pop();
    if (Array.isArray(item)) stack.push(...item);
    else total += item;
  }
  return total;
}
```

Menos legible, no desborda. Solo merece la pena cuando la profundidad realmente puede crecer.

Relacionadas: [[closures]], [[control-flow-js]], [[js-arrays]], [[call-apply-bind]].
