---
name: temporal-dead-zone
description: Zona entre el inicio del scope y la línea donde una variable declarada con let o const se inicializa. Acceder a la variable ahí dentro lanza ReferenceError.
metadata:
  type: reference
---

# Temporal Dead Zone (TDZ)

La **TDZ** es el intervalo entre el inicio del scope de una variable `let`/`const` (o `class`) y la línea donde se ejecuta su declaración. Dentro de ese intervalo, leer o escribir esa variable lanza `ReferenceError`.

## Ejemplo

```js
{
  // ↓ inicio del scope: empieza TDZ de `name`
  console.log(name); // ReferenceError
  name = "tarde";    // ReferenceError
  let name = "Ivan"; // ← fin de TDZ: ya inicializada
  console.log(name); // "Ivan"
}
```

## Por qué existe

Convierte un fallo silencioso (leer `undefined` por accidente, como con `var`) en un error explícito. Forza la disciplina de **declarar antes de usar**.

## No confundir con "scope no la conoce"

La variable existe en el scope **desde el principio** (por eso es "hoisting" — ver [[hoisting]]). Lo que no existe es su **inicialización**. Por eso el error es `cannot access 'x' before initialization`, no `x is not defined`.

```js
let x = "global";
{
  console.log(x); // ReferenceError (NO imprime "global")
  let x = "local";
}
```

El binding `x` del bloque interno **ya tapa** el del exterior desde la primera línea del bloque, aunque aún no esté inicializado. La TDZ no "deja pasar" al binding de fuera.

## Mensajes típicos en el motor

- V8 (Node, Chrome): `ReferenceError: Cannot access 'x' before initialization`
- SpiderMonkey (Firefox): `ReferenceError: can't access lexical declaration 'x' before initialization`

Si ves alguno de esos, casi siempre es TDZ.

Relacionado: [[var-let-const]], [[hoisting]].
