# Bitácora — JavaScript

Una entrada por módulo cerrado, formato compacto (ver `CLAUDE.md` raíz → "Bitácora"). Las más recientes arriba.

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
