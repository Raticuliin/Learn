# Bitácora — JavaScript

Una entrada por módulo cerrado, formato compacto (ver `CLAUDE.md` raíz → "Bitácora"). Las más recientes arriba.

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
