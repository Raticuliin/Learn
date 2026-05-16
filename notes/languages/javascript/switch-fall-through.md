# switch-fall-through

En `switch`, si un `case` no termina con `break` (o `return`/`throw`), la ejecución **cae al siguiente case** y ejecuta su cuerpo, ignorando su condición. Es un comportamiento, no un bug.

## Cómo cae

```js
switch (n) {
  case 1:
    console.log("uno");
    // sin break: cae a case 2
  case 2:
    console.log("dos");
    break;
  case 3:
    console.log("tres");
}
// n = 1 -> imprime "uno" y "dos"
// n = 2 -> imprime "dos"
// n = 3 -> imprime "tres"
```

## Uso intencional: agrupar cases

El patrón clásico — varios `case` con el mismo cuerpo, aprovechando que el primero sin código cae al siguiente:

```js
switch (day) {
  case "sat":
  case "sun":
    return "weekend";
  case "mon":
  case "tue":
  case "wed":
  case "thu":
  case "fri":
    return "weekday";
}
```

Aquí `case "sat":` no tiene cuerpo, así que cae a `case "sun":` y comparten el `return "weekend"`. **Esto es legítimo y legible**.

## Por qué es peligroso

Olvidar un `break` es uno de los bugs clásicos de C/Java/JS. ESLint tiene la regla `no-fallthrough` activa por defecto en la mayoría de configs precisamente por esto: pide un comentario explícito (`// falls through`) cuando es intencional, para distinguirlo de un olvido.

## Comparación con ===

El `switch` compara con **estricta** (`===`), no `==`. No hay coerción:

```js
switch ("1") {
  case 1:
    console.log("number"); // NO entra
    break;
  case "1":
    console.log("string"); // entra
    break;
}
```

Esto importa porque a veces uno escribe `case 0:` esperando que entre `false`, o `case "404"` esperando que entre `404`. No funciona.

## `return` dentro de `case`

Si estás dentro de una función y haces `return` en un `case`, el `break` que sigue es **inalcanzable** (dead code). No es error pero es ruido — quítalo:

```js
case 200:
  return "ok";
  // break; <- no hace nada, fuera
```

## Cuándo NO usar switch

Cuando es solo "mapea clave a valor", un objeto suele quedar más limpio:

```js
const labels = { sat: "weekend", sun: "weekend", mon: "weekday" /* ... */ };
const label = labels[day] ?? "unknown";
```

`switch` brilla cuando cada rama hace **lógica** distinta (cálculos, llamadas, ramas con varias líneas).

## Relación

- [[control-flow-js]] (visión general).
- [[js-operators]] (cómo funciona `===`, la comparación que usa `switch`).
