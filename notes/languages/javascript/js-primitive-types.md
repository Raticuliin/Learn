---
name: js-primitive-types
description: Los 7 tipos primitivos de JS (number, bigint, string, boolean, null, undefined, symbol), sus características comunes (inmutabilidad, comparación por valor) y diferencias con los objetos.
metadata:
  type: reference
---

# Tipos primitivos en JS

JS tiene **7 tipos primitivos**. Todo lo demás (arrays, funciones, fechas, `{}`...) es un objeto.

## Los 7

| Tipo | Literal | Para qué |
|---|---|---|
| `number` | `42`, `3.14`, `Infinity`, `NaN` | Números IEEE-754 |
| `bigint` | `42n` | Enteros arbitrariamente grandes |
| `string` | `"hi"`, `` `hi` `` | Texto UTF-16 inmutable |
| `boolean` | `true`, `false` | Verdad/falsedad |
| `null` | `null` | Ausencia intencionada |
| `undefined` | `undefined` | Ausencia no asignada |
| `symbol` | `Symbol("id")` | Identificadores únicos |

## Características comunes

- **Inmutables**: las operaciones no mutan, devuelven nuevos valores.
- **Comparación por valor**: `2 === 2`, `"a" === "a"` siempre. No hay referencias.
- **Sin propiedades modificables**: `s.foo = 1` no hace nada (en strict, lanza).

## null vs undefined

- `null` lo asignas **tú** explícitamente. Significa "no hay valor (a propósito)".
- `undefined` lo pone **JS** automáticamente: variable sin asignar, parámetro no pasado, propiedad inexistente, función sin `return`.

Regla mnemotécnica: **JS produce `undefined`, tú produces `null`**.

## Autoboxing

Los primitivos no tienen métodos, pero `"hola".toUpperCase()` funciona porque JS envuelve temporalmente el primitivo en un wrapper (`String`, `Number`, `Boolean`), llama al método y descarta el wrapper.

**No uses `new String/Number/Boolean`** — crean objetos, no primitivos, y rompen comparaciones.

## NaN, el primitivo raro

- Es un `number` (`typeof NaN === "number"`).
- No es igual a nada, ni a sí mismo: `NaN !== NaN`.
- Para detectarlo: `Number.isNaN(x)` (no el global `isNaN`, que coerciona).

Relacionado: [[typeof]], [[NaN]], [[truthy-falsy]], [[type-coercion]].
