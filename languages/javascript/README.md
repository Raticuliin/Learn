# JavaScript, de 0 a senior

Curso completo de JavaScript moderno. Orden didáctico por dependencias: cada fase asume las anteriores. Los conceptos numerados son los **módulos del curso** y cada uno tendrá su propia carpeta `NN-<concepto>/` cuando lleguemos a él.

Iván decide qué módulos saltarse (tiene base de programación de Java/Spring). El plan está completo a propósito.

---

## Fase 1. Fundamentos del lenguaje

1. **Sintaxis y entorno**: literales, comentarios, `strict mode`, dónde se ejecuta JS (navegador, Node, Deno, Bun)
2. **Variables y bindings**: `var` / `let` / `const`, hoisting, Temporal Dead Zone, block vs function scope
3. **Tipos primitivos**: `string`, `number`, `bigint`, `boolean`, `null`, `undefined`, `symbol`; `typeof`
4. **Operadores**: aritméticos, comparación (`==` vs `===`), lógicos, ternario, nullish coalescing (`??`), optional chaining (`?.`), spread / rest
5. **Coerción de tipos**: truthy/falsy, conversiones implícitas y explícitas, `NaN`, `Number.isNaN`
6. **Control de flujo**: `if/else`, `switch`, `for`, `for...of`, `for...in`, `while`, `do...while`, `break`/`continue`, labels
7. **Funciones I**: declaración, expresión, parámetros por defecto, rest, return, arrow functions vs `function`

> **Proyecto integrador 1** → `projects/cli-guessing-game/`
> CLI en Node: juego de adivinar número. Cubre fundamentos + funciones + control de flujo. Sin clases ni asincronía todavía.

---

## Fase 2. Datos

8. **Strings en profundidad**: template literals, métodos, Unicode, normalización
9. **Numbers**: precisión IEEE-754, `BigInt`, `Math`, `Math.sumPrecise` (ES2026)
10. **Arrays**: creación, métodos mutadores vs inmutadores, iteración, `Array.from`, `Array.fromAsync`
11. **Objetos**: literal, propiedades, shorthand, computed keys, spread, `Object.freeze`/`seal`, `Object.assign`
12. **Destructuring**: arrays y objetos, defaults, renombrado, anidado
13. **Colecciones**: `Map`, `Set`, `WeakMap`, `WeakSet` (cuándo usar cada uno)
14. **Fechas**: `Date` (legacy) y **Temporal API** (ES2026, reemplazo moderno)
15. **JSON**: `JSON.parse`/`stringify`, reviver/replacer, gotchas

---

## Fase 3. Funciones avanzadas y closures

16. **Funciones de primera clase**: callbacks, higher-order functions, paso de funciones como datos
17. **`this`**: binding dinámico vs léxico (arrow), `call` / `apply` / `bind`
18. **Closures**: cómo funcionan, casos de uso, gotchas clásicos
19. **Recursión**: directa, mutua, tail calls (estado en motores)
20. **Composición funcional**: IIFE, currying, partial application, pipe / compose
21. **Iterator helpers** (ES2025): `.map`, `.filter`, `.take`, `.drop`, `.reduce` directos sobre iteradores

---

## Fase 4. OOP y herencia prototípica

22. **Prototipos**: cadena de prototipos, `__proto__` vs `Object.getPrototypeOf`, `Object.create`
23. **Constructor functions y `new`**: cómo era OOP antes de `class`
24. **Classes**: constructor, métodos, getters/setters, static, factory methods
25. **Herencia**: `extends`, `super`, override, polymorphism, `instanceof`
26. **Encapsulación**: campos privados `#`, métodos privados, static blocks
27. **Composición vs herencia**: mixins, delegation, por qué la composición suele ganar

---

## Fase 5. Mecánica del lenguaje

28. **Symbols**: propiedades simbólicas, well-known symbols (`Symbol.iterator`, `Symbol.asyncIterator`, `Symbol.toPrimitive`...)
29. **Iteradores y generators**: protocolo, `yield`, `yield*`, generators infinitos
30. **Async iterators**: `for await...of`, casos de uso (streams, paginación)
31. **Reflexión y metaprogramación**: `Reflect`, `Proxy` y sus traps
32. **Memoria y GC**: referencias fuertes/débiles, `WeakRef`, `FinalizationRegistry`, fugas comunes

---

## Fase 6. Asincronía

33. **Modelo de ejecución**: call stack, event loop, task queue vs microtask queue, `queueMicrotask`
34. **Callbacks**: historia, callback hell, error-first pattern (Node)
35. **Promises**: estados, `then`/`catch`/`finally`, chaining, `Promise.all` / `allSettled` / `race` / `any`
36. **async / await**: sintaxis, manejo de errores, paralelismo correcto (no `await` en serie sin necesidad)
37. **AbortController**: cancelación de operaciones asíncronas
38. **Workers**: Web Workers, Shared Workers, intro a Service Workers

> **Proyecto integrador 2** → `projects/api-explorer/`
> SPA vanilla (sin framework) que consume una API pública (p.ej. GitHub users, weather). Cubre fetch + async/await + DOM + estado en memoria + manejo de errores.

---

## Fase 7. Errores y resiliencia

39. **try / catch / finally**: flujo de excepciones, re-throw, errores como valores
40. **Built-in errors**: `TypeError`, `RangeError`, `SyntaxError`...; `Error.cause` para encadenado
41. **Custom errors**: clases que extienden `Error`
42. **Resource management** (ES2026): `using` / `await using`, `Symbol.dispose` / `Symbol.asyncDispose`

---

## Fase 8. Módulos y ecosistema

43. **Módulos ESM**: `import` / `export`, named vs default, re-exports
44. **Dynamic import**: `import()`, `import.meta`, code splitting
45. **CommonJS vs ESM**: interop en Node, `require` vs `import`
46. **npm y semver**: `package.json`, `dependencies` vs `devDependencies`, lockfiles
47. **Package managers**: npm, pnpm, workspaces (intro)
48. **Node.js esencial**: `fs`, `path`, `process`, streams (intro), CLI scripting

---

## Fase 9. Plataforma web (DOM y APIs del navegador)

49. **DOM I**: `querySelector`, traversal, creación/modificación de nodos
50. **DOM II, eventos**: bubbling, capturing, delegation, passive listeners, custom events
51. **Formularios**: validación nativa, `FormData`, eventos `input` / `change` / `submit`
52. **Storage en navegador**: `localStorage`, `sessionStorage`, cookies (intro), IndexedDB (intro)
53. **Fetch API**: `Headers`, `Request`, `Response`, errores HTTP, JSON vs FormData
54. **Streams API**: intro a `ReadableStream` / `WritableStream`
55. **Performance del DOM**: `requestAnimationFrame`, debounce, throttle, `ResizeObserver`, `IntersectionObserver`

---

## Fase 10. Tooling moderno

56. **Vite**: dev server, HMR, build, env vars (estándar de facto en 2026)
57. **Linting**: ESLint (o Biome), reglas, configuración plana
58. **Formatting**: Prettier (o Biome)
59. **Debugging**: DevTools (sources, network, performance, memory), source maps, breakpoints condicionales

---

## Fase 11. Testing y calidad

60. **Unit testing**: Vitest, tests, mocks, spies, fakes
61. **Integración con DOM**: jsdom / happy-dom, testing de UI sin navegador real
62. **Calidad**: coverage, AAA pattern, test doubles, qué NO testear

---

## Fase 12. Regex, i18n y APIs misceláneas

63. **Regex**: literales, flags, grupos, lookaround, named captures, `String.matchAll`
64. **Intl**: `NumberFormat`, `DateTimeFormat`, `Collator`, `PluralRules`
65. **Encoding**: `TextEncoder` / `TextDecoder`, base64 (`Uint8Array.toBase64`, ES2026)

---

## Fase 13. Patrones y prácticas senior

66. **Patrones de diseño en JS**: module, singleton, factory, observer / pub-sub, strategy
67. **Programación funcional**: pure functions, inmutabilidad, composición
68. **Inmutabilidad práctica**: `structuredClone`, técnicas sin librerías, cuándo conviene
69. **Seguridad web básica**: XSS, CSP, CORS, sanitización de inputs
70. **Anti-patrones y "the bad parts"**: coerciones peligrosas, `with`, mutaciones compartidas, callbacks anidados sin manejo de error

> **Proyecto integrador 3** (final del curso) → `projects/markdown-notes/`
> App vanilla con Vite + tests + ESLint. Algo no trivial: notas markdown con persistencia (IndexedDB), validación, módulos bien separados, tests unitarios y de DOM. Cierra el curso integrando casi todo lo anterior.

---

## Recursos

Todos verificados como actuales (mayo 2026):

- **[javascript.info](https://javascript.info/)**: la referencia gratuita más completa y actualizada. Será el material de cabecera del curso.
- **[MDN Web Docs](https://developer.mozilla.org/)**: referencia oficial para APIs del navegador y del lenguaje. Imprescindible para Fase 9 y consultas puntuales.
- **[You Don't Know JS Yet (2ª ed.)](https://github.com/getify/You-Dont-Know-JS)**: Kyle Simpson, gratuito en GitHub. Profundidad sobre `this`, closures, prototipos, asincronía. Recomendado para Fases 3-6.
- **[TC39 proposals](https://github.com/tc39/proposals)**: qué viene en próximas versiones de ECMAScript.
- **[Node.js docs](https://nodejs.org/docs/latest/api/)**: para Fase 8.
- **[V8 blog](https://v8.dev/blog)**: internals del motor (opcional, para Fase 5).
- **[Frontend Masters, What to Know in JavaScript (2026)](https://frontendmasters.com/blog/what-to-know-in-javascript-2026-edition/)**: resumen anual del estado del lenguaje.

---

## Bitácora

El progreso se trackea en `progress.md` en la raíz del repo. Cada sesión deja anotado qué se cubrió y qué quedó pendiente.
