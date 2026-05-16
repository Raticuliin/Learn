# optional-chaining

Operador `?.`. Permite recorrer una cadena de accesos sin que explote cuando alguno de los eslabones intermedios es `null` o `undefined`.

```js
user?.address?.street
// devuelve user.address.street si todos los eslabones existen
// devuelve undefined en cuanto el operando izquierdo de algún ?. sea null o undefined
```

## Mecanismo: short-circuit nullish

Lo importante no es "si no existe, da undefined". Es **cómo lo logra**:

- `?.` evalúa **el operando de su izquierda**.
- Si ese operando es `null` o `undefined`, **corta toda la cadena que viene después** y devuelve `undefined`, sin evaluar nada más.
- Si es cualquier otro valor (incluso `0` o `""`), sigue como un acceso normal.

Por eso `user?.sayHi?.()` no lanza aunque `sayHi` no exista: cuando llega al segundo `?.`, ve que `sayHi` es `undefined` y no intenta invocar nada. Sin `?.`, sería `user.sayHi()` -> `TypeError: user.sayHi is not a function`.

## Tres variantes

```js
obj?.prop;       // acceso a propiedad
obj?.[key];      // acceso por clave dinámica (computed)
fn?.(arg);       // llamada de función opcional
```

Las tres tienen el mismo comportamiento: si lo que está a la izquierda del `?.` es nullish, devuelve `undefined` y no evalúa lo de la derecha.

## Cuidado con el alcance del short-circuit

`?.` corta hasta el final de la cadena de accesos, no toda la expresión:

```js
const result = (user?.profile).name;
// si user es null, user?.profile -> undefined
// luego (undefined).name -> TypeError
```

Los paréntesis cierran la cadena. Para que el short-circuit alcance hasta `name`, escribe `user?.profile?.name` o `user?.profile.name` (este último propaga el corte del primer `?.`).

## Combinado con [[nullish-coalescing]]

Patrón estándar para defaults seguros sobre cadenas profundas:

```js
const port = config?.server?.port ?? 3000;
```

## Asignación NO es chainable

```js
user?.name = "Iván";   // SyntaxError
```

`?.` es solo para lecturas y llamadas. Para asignación condicional usa `if` o `??=`.

## Relación

- [[js-operators]] (operadores generales).
- [[nullish-coalescing]] (suelen ir de la mano).
