# arrow-functions

Sintaxis alternativa a `function` introducida en ES6. **No es solo azúcar sintáctica**: hay diferencias semánticas importantes.

## Sintaxis

```js
const add  = (a, b) => { return a + b; };  // cuerpo bloque
const add2 = (a, b) => a + b;              // return implícito
const sq   = x => x * x;                   // un parámetro → paréntesis opcionales
const noop = () => {};                     // sin parámetros → paréntesis obligatorios
```

## Cuerpo: bloque vs expresión

- **Sin llaves** → cuerpo es una expresión. **Return implícito** del valor.
- **Con llaves `{...}`** → cuerpo es un bloque. Necesita `return` explícito; si falta, devuelve `undefined`.

```js
const f = (x) => { x * 2; };  // ✗ devuelve undefined
const g = (x) => x * 2;       // ✓ devuelve x*2
const h = (x) => { return x * 2; }; // ✓
```

## Trampa: devolver un objeto literal

`{` se interpreta como inicio de bloque. Para devolver un objeto en return implícito, envuelve en paréntesis:

```js
const makeUser = (name) => { name };       // ✗ bloque con label → undefined
const makeUser2 = (name) => ({ name });    // ✓ objeto literal
```

## Diferencias reales con `function`

1. **`this` léxico**: heredan el `this` del scope donde se definieron. No se rebindea por la llamada. (A fondo en módulo 17 → [[this-binding]].)
2. **No tienen `arguments`**: usa rest params si los necesitas.
3. **No se pueden usar con `new`**: no son constructores.
4. **No tienen `prototype`**.
5. **No hoisted** (son expresiones — [[js-functions-basics]]).

## Cuándo cada una

- **Arrow** para callbacks cortos, helpers locales, funciones puras.
- **`function`** para métodos que necesitan su propio `this`, constructores (si no usas `class`), top-level con hoisting útil.

## Patrón: función que devuelve función

Idiomático en arrow encadenado, sin llaves ni `return`:

```js
const makeGreeter = (salute) => (name) => `${salute}, ${name}!`;
const hola = makeGreeter("Hola");
hola("Iván"); // "Hola, Iván!"
```

Primer roce con [[closures]] — la función interna "recuerda" `salute`.

Relacionadas: [[js-functions-basics]], [[default-parameters]], [[this-binding]], [[closures]].
