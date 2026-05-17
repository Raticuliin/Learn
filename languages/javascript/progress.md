# Bitácora — JavaScript

Una entrada por módulo cerrado, formato compacto (ver `CLAUDE.md` raíz → "Bitácora"). Las más recientes arriba.

---

## 2026-05-17. Módulo 13: Colecciones (Map, Set, WeakMap, WeakSet)

- **Cubierto**: Map (API uniforme `set`/`get`/`has`/`delete`/`size`, encadenable, init desde pares, claves de cualquier tipo con identidad por referencia, iterable en orden de inserción, `Map.groupBy`), Map vs Object (dinámico vs registro), Set (dedup, ops de conjunto `union`/`intersection`/`difference`/`symmetricDifference` + tests `isSubsetOf`/`isSupersetOf`/`isDisjointFrom`, Set-like como argumento), WeakMap/WeakSet (por qué débil, restricciones de no-iteración + claves objeto, caso "metadata por objeto" mutando in-place). Ejercicio `collections.js` cerrado limpio.
- **Notas vault**: [[js-map]], [[js-set]], [[set-operations]], [[weakmap-weakset]].
- **Pendiente**: nada bloqueante. Tres correcciones en Parte 6 (WeakMap): (a) inicializó con valor `0` (número) en vez de `{ count: 0 }` (objeto) — diseño igual de funcional pero no idiomático para "metadata"; en sloppy mode su `meta.count++` con `meta=0` fallaba silenciosamente vía autoboxing temporal (recordatorio de [[js-primitive-types]] módulo 3). Tras explicarle los dos diseños eligió el B. (b) Al cambiar a objeto, dejó la inicialización sin actualizar — solo cambió la función, no las dos líneas de `set`. Corrigió tras señalárselo. (c) Su versión de `registerClick` no manejaba el caso "elemento no registrado aún" que la consigna pedía explícitamente; tras señalarlo lo resolvió con ternario `meta ? meta.count++ : clickCounts.set(...)`. Le dejé el aviso de que el ternario sobre `meta` solo es seguro porque los valores guardados son siempre objetos truthy — patrón frágil si se permitieran valores primitivos (`0`, `""`, `null`).
- **Lección recurrente vigilada**: en Parte 1a no encadenó los `set` aunque la pista lo sugería; sigue prefiriendo escribir cada `set` en su línea (estilo válido, no le insisto). Sin recurrencias de `==`/`!=` esta sesión.
- **Siguiente**: Módulo 14, Fechas (`Date` legacy + **Temporal API**, ES2026). Verificar estado de Temporal en Node antes de crear README — la spec se quedó fuera de la edición ES2026 final pero la implementación está madura, hay que confirmar si Node lo trae sin flags o si hay que usar polyfill.

---

## 2026-05-17. Módulo 12: Destructuring

- **Cubierto**: arrays (básico, skip con coma, defaults, rest, swap sin temporal), objetos (básico, renombrado, defaults, renombrar+default, rest), anidado (objetos/arrays mezclados, default sobre pieza intermedia para tolerar piezas opcionales — el `?.` no aplica dentro de un patrón), destructuring en parámetros de función con `= {}` para tolerar llamadas sin args. Ejercicio `destructuring.js` cerrado limpio.
- **Notas vault**: [[destructuring]].
- **Pendiente**: nada bloqueante. Tres puntos a vigilar: (a) **Trampa didáctica mía**: reusé nombres `first`/`second` entre Parte 1a y Parte 3b sin pensar — chocaron en el mismo scope con `const`. Lo corrigió tras pista; ajusté el enunciado a `firstItem`/`secondItem`. Recordatorio para futuros ejercicios: en un único archivo con todo en top-level, los nombres de variables se acumulan, hay que evitar colisiones cuando se reutilizan nombres genéricos. (b) En Parte 3d resolvió con `{ user: { name2 = "anon" } = {} }` (intentando sacar una propiedad llamada `name2`, que no existe). Funcionaba **por casualidad** porque el `user` también faltaba y entraba el default. Tras test mental con `response2 = { user: { name: "Ana" } }` captó el bug y lo corrigió a `{ user: { name: name2 = "anon" } = {} }` — la forma correcta de "renombrar al destructurar". Patrón similar al de módulo 9 (`!Number.isFinite` sin invocar): código que pasa los tests por suerte. (c) En Parte 4a dejó la versión vieja de `greet` además de la nueva — dos `function` declaradas con el mismo nombre, la segunda gana por hoisting pero queda código muerto. Tras señalar, borrado.
- **Siguiente**: Módulo 13, Colecciones (`Map`, `Set`, `WeakMap`, `WeakSet`).

---

## 2026-05-17. Módulo 11: Objetos

- **Cubierto**: literal, claves calculadas, shorthand de propiedad y método, acceso (punto/corchetes), `delete`, comprobación con `in` vs `Object.hasOwn` (incluida diferencia con heredadas — anticipo mínimo de prototipos), recorrer con `Object.keys`/`values`/`entries` + `for...of` + `Object.fromEntries`, copia/combinación con spread y `Object.assign` y su trampa superficial demostrada en vivo, congelar/sellar/preventExtensions, paso por referencia y `const` que no protege contenido, cierre con `Object.groupBy` conectando con el patrón `reduce` del módulo 10. Ejercicio `objects.js` cerrado limpio.
- **Notas vault**: [[js-objects]], [[object-freeze]], [[pass-by-reference]], [[shallow-vs-deep-copy]].
- **Pendiente**: nada bloqueante. Segunda sesión seguida sin recurrencias `==`/`!=` (regresión de módulos 3-9 parece estabilizada). Tres detalles menores al revisar: (a) en Parte 2a solo imprimió una de las dos lecturas pedidas; lo corrigió. (b) En Parte 2c usó `in` cuando la consigna pedía explícitamente `Object.hasOwn`; corregido tras señalar la diferencia con propiedades heredadas. (c) En Parte 3c imprimió con `console.log(key, ", ", value)` en vez de formatear con template literal; corregido a `\`${key}: ${value}\``. Nada recurrente, todo cosmético o de lectura.
- **Trampa didáctica descubierta**: el README afirmaba "modo strict automático" en el archivo `.js`, que es falso al ejecutar con `node` sin `"type": "module"`. La asignación a un objeto congelado fallaba silenciosamente y el `try/catch` no atrapaba nada. Arreglado añadiendo `"use strict";` arriba del archivo y actualizando el README. Recordatorio para futuros módulos: hasta llegar a Fase 8 (ESM, módulo 43), los ejercicios del curso son scripts sueltos en modo sloppy — si un ejercicio depende de strict mode, hay que marcarlo explícitamente con la directiva.
- **Siguiente**: Módulo 12, Destructuring (arrays y objetos, defaults, renombrado, anidado).

---

## 2026-05-17. Módulo 10: Arrays

- **Cubierto**: creación (literal, `Array.of`, `Array.from` con función mapeadora, gotcha `new Array(n)`), acceso (`at` con negativos, asignación a `.length`), mutadores (`push`/`pop`/`splice`/`sort`/`reverse` + trampa de `sort` por defecto con strings), no-mutadores modernos (`toSorted`/`toReversed`/`toSpliced`/`with`), `flat`/`flatMap`, `map`/`filter`/`reduce` formalmente (los traía de prestado desde módulo 8), patrones con `??` y `??=` para contar/agrupar, `find`/`findLast`/`some`/`every`. Filosofía "no mutes lo que recibes". Ejercicio `arrays.js` cerrado limpio.
- **Notas vault**: [[js-arrays]], [[array-immutable-methods]], [[map-filter-reduce]].
- **Pendiente**: nada bloqueante. Mejora notable — sin recurrencias `==`/`!=` esta vez, primera sesión limpia en ese eje. Matiz: en `every(item => item.name)` usó truthy check (válido para este caso, pero rechazaría `""`/`0`/`null` — se le señaló y captó la distinción). Aprovechó la versión encadenada `(acc[u.role] ??= []).push(u)` que se le presentó como avanzada/opcional.
- **Estrenadas las dos reglas durables nuevas** ([Exercise templates](feedback_exercise-templates.md) y [No jargon in teaching](feedback_no-jargon-in-teaching.md)): el archivo `arrays.js` se generó con esqueleto (funciones `null`/`// TODO`, casos de prueba con resultado esperado al lado, hueco para escribir explicación en Parte 3d) y el README evitó nombres formales ("ES2023", "Change Array by Copy") describiendo los conceptos por lo que hacen. Iván rellenó los huecos directamente. Las dos reglas funcionan bien en la práctica.
- **Decisión de plan**: movido `Array.fromAsync` del módulo 10 al 30 (iteradores asíncronos), donde encaja con su prerrequisito. README del curso actualizado.
- **Siguiente**: Módulo 11, Objetos (literal, propiedades, shorthand, computed keys, spread, `Object.freeze`/`seal`, `Object.assign`).

---

## 2026-05-17. Módulo 9: Numbers

- **Cubierto**: IEEE-754 (double 64 bits, por qué `0.1 + 0.2 !== 0.3`, `Number.EPSILON` como tolerancia, `MAX_SAFE_INTEGER`, `Infinity`), métodos estáticos de `Number` (`isNaN`/`isFinite`/`isInteger`/`isSafeInteger` vs globales que coercionan), `Math` esencial con idioms (`clamp`, `roundTo`, `randInt`), `parseInt` con radix obligatorio, BigInt (sintaxis `n`, no mezcla con `number`, división trunca, gotcha `JSON.stringify`). Ejercicio `numbers.js` ok con `approxEq`, `classifyNumber`, BigInt + replacer, helpers Math, `toNumberOrNull` blindado contra unsafe integers. Tres reglas durables nuevas guardadas en memoria a raíz de este módulo.
- **Notas vault**: [[ieee-754-js]], [[js-numbers]], [[BigInt]].
- **Pendiente**: tres recurrencias todavía vivas — (a) sigue usando `!=`/`==` por inercia aunque la mayoría de las veces lo cambia tras señalárselo. (b) En Parte 2 metió una regresión al refactorizar a helpers (`!Number.isFinite` sin argumento) — patrón "función truthy sin invocar" que no había aparecido antes. Vigilar en futuro. (c) En Parte 5 confundió `&&` lógico ("ambas se cumplen") con su semántica real ("último truthy o primer falsy"); refuerzo de operadores de módulo 4. Caso de borde `""` → `0` se quedó sin blindar (decisión consciente).
- **Reglas durables nuevas guardadas en memoria** (aplican a TODOS los cursos): (1) Respetar orden curricular: si un ejercicio necesita algo no visto, regalarlo explícitamente. (2) Investigar antes de cada módulo con WebSearch/WebFetch. (3) Solo features oficiales y en uso real en el runtime objetivo; si Node no lo soporta o está en Stage temprano, FUERA sin excepciones. Aplicada retroactivamente quitando `Math.sumPrecise` del plan del curso (módulo 9) por falta de soporte V8/Node.
- **Siguiente**: Módulo 10, Arrays (creación, mutadores vs inmutadores, iteración, `map`/`filter`/`reduce` formalmente, `Array.from`/`Array.fromAsync` — verificar estado de `Array.fromAsync` en Node antes de crear el README).

---

## 2026-05-17. Módulo 8: Strings en profundidad

- **Cubierto**: template literals (interpolación, multilínea, mención tagged templates), inmutabilidad reforzada (lección recurrente del módulo 3/5), métodos clave agrupados (búsqueda, extracción con `slice` y `at(-1)`, transformación, `replace` vs `replaceAll`, `split`), comparación + `localeCompare` (mención, profundizamos en módulo 64), iteración por code units vs code points, Unicode mínimo (`length` engaña con emojis, `codePointAt`), normalización NFC vs NFD y `normalize()`. Ejercicio `strings.js` ok con `buildEmail`, parsing de URL con `indexOf("://")` + segundo arg, `slugify` con `NFD + replace /[̀-ͯ]/g`, `wordCount` con bucle imperativo (eligió esa vía tras pedir respetar el orden didáctico), demos de Unicode con `eqLoose`. Trip oro: sus dos `"café"` resultaron uno NFC y otro NFD (copy-paste fortuito), demostrando empíricamente el problema.
- **Notas vault**: [[js-strings]], [[template-literals]], [[unicode-in-js]], [[unicode-normalization]].
- **Pendiente**: tres recurrencias que vigilar — (a) `for...in` sobre array volvió a aparecer en Parte 1 antes de corregirse (ya tres veces total con módulo 6 y proyecto integrador 1); el patrón "para arrays nunca `for...in`" sigue sin estar interiorizado. (b) En `slugify` ignoró la pista del README (`normalize("NFD")`) y usó `normalize()` por defecto (NFC), entendió la diferencia tras pista directa. (c) Tendencia a usar `!=`/`==` en lugar de `!==`/`===` sin pensarlo — funciona por casualidad pero rompe el principio del módulo 4.
- **Nueva regla durable**: feedback memory guardada — si un ejercicio necesita algo no visto en el plan, debo avisarlo y darlo como regalo puntual, no asumir conocido. Se aplicó al instante: rediseñé `wordCount` con bucle imperativo en vez de `filter(Boolean)` (filter entra en módulo 10).
- **Siguiente**: Módulo 9, Numbers (IEEE-754, BigInt, Math, Math.sumPrecise ES2026).

---

## 2026-05-17. Proyecto integrador 1: CLI Guessing Game

- **Cubierto**: primer programa end-to-end en Node. Integra módulos 2-7 + intro mínima a `readline/promises` y `await` como herramienta de I/O (sin profundizar en async, que llega en módulo 36). `Math.random` + descomposición en funciones puras (`generateTarget`, `compareGuess`, `parseGuess`) separadas de la función `async` con I/O (`playGame`). Cumple los 6 requisitos del README.
- **Notas vault**: ninguna nueva (patrones de diseño se sedimentan con práctica; conceptos JS ya cubiertos).
- **Pendiente**: la lección recurrente del curso ya emerge fuerte aquí — **convertir/validar tipos en el borde, no dentro de funciones puras**. Cayó dos veces en el mismo error (con `min`/`max` y luego con `guess`); a la tercera ya lo aplicó solo. Patrón a vigilar cuando volvamos a tocar I/O. Detalles menores que NO aplicó al cerrar (opcionales, conscientes): conversión de `min`/`max` duplicada en vez de una sola vez, y `!Number.isNaN` redundante con `Number.isInteger`. No bloquean.
- **Siguiente**: Módulo 8, Strings en profundidad (template literals, métodos, Unicode, normalización).

---

## 2026-05-17. Módulo 7: Funciones I

- **Cubierto**: declaración vs expresión (hoisting), parámetros por defecto (solo `undefined` activa, `null` no), referencia a parámetros previos en defaults, rest params vs `arguments` legacy, gotcha del ASI con `return`, arrow functions (sintaxis, return implícito, paréntesis para objeto literal, diferencias con `function`: `this` léxico — postergado a módulo 17 — sin `arguments`, no constructores). Patrón "función que devuelve función" como primer roce con closures. Ejercicio `functions.js` ok.
- **Notas vault**: [[js-functions-basics]], [[default-parameters]], [[arrow-functions]].
- **Pendiente**: en Parte 2 mezcló dos mecanismos al explicar `priceWithTax(100, null) === 100` ("`taxRate = null = 0`"). Tras pregunta-guía separó bien: (a) el default no se activa porque `null !== undefined`, (b) `1 + null` coerciona a `1`. Conexión limpia con [[type-coercion]]. En Parte 4 su versión "rota" del ASI usó `;` dentro del bloque (válido como labels) en vez de comas estilo objeto literal, que es la trampa real; se le mostró el escenario auténtico. Captó el concepto.
- **Siguiente**: Proyecto integrador 1, `projects/cli-guessing-game/` (CLI Node: juego de adivinar número). Cubre fundamentos + control de flujo + funciones, sin clases ni async.

---

## 2026-05-16. Módulo 6: Control de flujo

- **Cubierto**: `if`/`else` con truthy/falsy, ternario, `switch` con `===` y fall-through (intencional vs olvido), bucles imperativos (`for`, `while`, `do...while`), `for...of` vs `for...in` y la trampa de `for...in` sobre arrays, `break`/`continue` y labels (con preferencia por refactor a función + `return`). Ejercicio `flow.js` ok.
- **Notas vault**: [[control-flow-js]], [[switch-fall-through]], [[for-in-vs-for-of]].
- **Pendiente**: cayó en el bug clásico `18 <= age < 65` en Parte 1 — JS no encadena comparaciones estilo matemáticas, evalúa `(18 <= age) < 65` que es casi siempre `true`. Reforzar cuando aparezca en código real o ejercicios futuros. También usaba `toNumberOrNull(age)` pero comparaba `age` sin reasignar el resultado convertido; funcionaba por coerción pero es frágil — reasignar el valor saneado a `n` o similar.
- **Siguiente**: Módulo 7, Funciones I (declaración, expresión, parámetros por defecto, rest, return, arrow vs `function`).

---

## 2026-05-16. Módulo 5: Coerción de tipos

- **Cubierto**: explícita vs implícita, las tres conversiones (string, number, boolean) con su tabla completa de casos raros (`Number(null)=0` pero `Number(undefined)=NaN`, `Boolean([])=true`, etc.), los 8 valores falsy, intro a `ToPrimitive` para los "wat" (`[] + {}`), y `Number.isNaN` vs `isNaN` global. Ejercicio `coercion.js` ok, incluida la Parte 5 (`toNumberOrNull` con filtro por `typeof` + trim + `Number.isFinite`).
- **Notas vault**: [[type-coercion]], [[truthy-falsy]], [[NaN]].
- **Pendiente**: en Parte 5 cayó en dos errores típicos antes de cerrar: (a) usar solo `Number()` + `isFinite` sin filtrar por `typeof` (acepta `null`, `true`, `[42]`); (b) hacer `input.trim()` sin asignar el resultado, olvidando que **los strings son inmutables** (ya visto en módulo 3 con [[js-primitive-types]]). El segundo es un buen recordatorio cuando lleguemos a strings a fondo en módulo 8.
- **Siguiente**: Módulo 6, Control de flujo (`if/else`, `switch`, `for`, `for...of`, `for...in`, `while`, `do...while`, `break`/`continue`, labels).

---

## 2026-05-16. Módulo 4: Operadores

- **Cubierto**: aritméticos (gotcha del `+` con strings, unario `+` para coercer), `==` vs `===` como **coerción sí/no**, regla ad-hoc de `null == undefined`, lógicos devolviendo operandos (no booleans), short-circuit, `??` vs `||` (trampa con `0`/`""`), `?.` (las tres variantes y short-circuit nullish), spread/rest (primer contacto). Ejercicio `operators.js` ok.
- **Notas vault**: [[js-operators]], [[nullish-coalescing]], [[optional-chaining]].
- **Pendiente**: las dos pendientes del módulo 3 quedan **resueltas** (Iván ya describe `==` como coerción y `null == undefined` como regla ad-hoc, no como "ambos falsy"). Nuevo pendiente menor: su explicación de `user?.sayHi?.()` se quedó en lo descriptivo ("no existe y devuelve undefined") en vez de articular el mecanismo del short-circuit; reforzarlo cuando aparezca en cadenas más complejas (módulos de objetos/prototipos).
- **Siguiente**: Módulo 5, Coerción de tipos (truthy/falsy a fondo, conversiones implícitas y explícitas, `NaN`, `Number.isNaN`).

---

## 2026-05-16. Módulo 3: Tipos primitivos

- **Cubierto**: los 7 primitivos, `null` vs `undefined` (intencional vs automático), rarezas de `typeof` (`null` → `"object"`, tolera no-declaradas), igualdad (`==` coerciona / `===` no, regla especial `null == undefined`, `NaN !== NaN`, `Object.is` para NaN y ±0), autoboxing y wrapper efímero. Ejercicio `primitives.js` ok.
- **Notas vault**: [[js-primitive-types]], [[typeof]].
- **Pendiente**: dos confusiones a vigilar en módulos 4-5: (a) Iván repitió la frase "== compara valor, === compara valor y tipo" — reforzar que la diferencia real es **coerción**, no qué comparan; (b) intentó justificar `null == undefined` por "ambos falsy" — recordarle que es una **regla especial** de la spec, no derivada de truthy/falsy.
- **Siguiente**: Módulo 4, Operadores (aritméticos, comparación, lógicos, ternario, `??`, `?.`, spread/rest).

---

## 2026-05-16. Módulo 2: Variables y bindings

- **Cubierto**: `var` / `let` / `const`, regla "`const` por defecto", `const` no es inmutable, hoisting con/sin TDZ, TDZ lectura == escritura (`ReferenceError`), block scope vs function scope (`var` se escapa del bloque pero no de la función). Ejercicio `bindings.js` ok.
- **Notas vault**: [[var-let-const]], [[hoisting]], [[temporal-dead-zone]].
- **Pendiente**: nada. Detalle menor: en `bindings.js` quedaron los nombres `varNumber`, `varBigInt`... heredados del módulo 1 — recordar en el módulo 3 cuidar naming al refactorizar.
- **Siguiente**: Módulo 3, Tipos primitivos (los 7 + `typeof`, ya usados de pasada pero ahora a fondo).

---

## 2026-05-16. Módulo 1: Sintaxis y entorno

- **Cubierto**: sintaxis mínima, los 7 primitivos, `'use strict'` y por qué casi no se escribe en 2026, runtimes JS (Node / navegador / Deno / Bun). Ejercicio `hello.js` ok.
- **Notas vault**: [[strict-mode]], [[js-runtimes]].
- **Pendiente**: nada del módulo. Recordatorio didáctico para el 2: Iván usó `let` para todo en `hello.js`; reforzar la regla moderna `const` por defecto.
- **Siguiente**: Módulo 2, Variables y bindings (`var` / `let` / `const`, hoisting, TDZ, scope).
