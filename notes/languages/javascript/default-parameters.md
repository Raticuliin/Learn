# default-parameters

```js
function priceWithTax(price, taxRate = 0.21) {
  return price * (1 + taxRate);
}
```

## Regla clave: solo `undefined` activa el default

```js
priceWithTax(100);            // 121 (no se pasa nada → undefined → default 0.21)
priceWithTax(100, undefined); // 121 (explícito, igual)
priceWithTax(100, null);      // 100 (null NO activa el default)
```

Con `null`, `taxRate` se queda en `null`. La cuenta `1 + null` coerciona a `1 + 0 = 1` (ver [[type-coercion]]), y `100 * 1 = 100`. Conclusión: el default no se aplica, pero la coerción "tapa" el efecto.

## Pueden referirse a parámetros previos

```js
function formatUser(name, role = "guest", isAdmin = role === "admin") {
  return { name, role, isAdmin };
}
```

El orden importa: `role` debe estar antes que `isAdmin` para usarse en su default.

## Se evalúan en cada llamada

No es un valor fijado una vez. Pueden ser llamadas a funciones, expresiones, etc.

```js
function logTime(ts = Date.now()) {
  console.log(ts);
}
```

## Pista de diseño

Si tu función debe **rechazar** ciertos valores (incluido `null`), valida explícitamente:

```js
function priceWithTax(price, taxRate = 0.21) {
  if (typeof taxRate !== "number") taxRate = 0.21;
  return price * (1 + taxRate);
}
```

El default param no es un filtro: solo cubre el caso "no me pasaron nada".

Relacionadas: [[js-functions-basics]], [[type-coercion]], [[nullish-coalescing]].
