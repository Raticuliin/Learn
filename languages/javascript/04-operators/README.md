# Módulo 4. Operadores

## Objetivos

Al terminar este módulo sabrás:

- Cómo se comportan los operadores **aritméticos** en JS, incluyendo las gotchas de `+` con strings y de la división.
- La diferencia real entre **`==` y `===`** (no es "uno mira el tipo y el otro no": es **coerción sí / no**).
- Cómo evalúan los **operadores lógicos** (`&&`, `||`, `!`) por **short-circuit**, y por qué devuelven uno de los operandos, no un boolean.
- El **operador ternario** como expresión, no sentencia.
- Cuándo usar **`??`** (nullish coalescing) y por qué **no es lo mismo que `||`**.
- Cuándo usar **`?.`** (optional chaining) y qué pasa si lo combinas con `??`.
- Una primera idea de **spread / rest** (los profundizaremos en arrays, objetos y funciones).

---

## 1. Aritméticos

```js
1 + 2;     // 3
10 - 3;    // 7
4 * 2.5;   // 10
9 / 2;     // 4.5    ← JS no hace división entera, da float
9 % 2;     // 1      ← módulo / resto
2 ** 10;   // 1024   ← exponenciación
```

### Gotchas del `+`

`+` es **suma o concatenación de strings** según los operandos. Si uno es string, gana la concatenación:

```js
1 + 2;        // 3
"1" + 2;      // "12"     ← coerce 2 a "2" y concatena
1 + 2 + "3";  // "33"     ← evalúa izq->der: (1+2) = 3, luego 3 + "3" = "33"
"1" + 2 + 3;  // "123"    ← (("1"+2)="12") + 3 = "123"
```

Resto de operadores aritméticos (`-`, `*`, `/`, `%`, `**`) **siempre coercionan a número**:

```js
"5" - 2;      // 3
"5" * "2";    // 10
"abc" - 1;    // NaN
```

### Unario `+` y `-`

```js
+"42";        // 42       ← coerce string a number
+"abc";       // NaN
-"3";         // -3
+true;        // 1
+null;        // 0
+undefined;   // NaN
```

`+` unario es la forma más corta de convertir a número (lo veremos también con `Number(...)` en el módulo 5).

### Incremento y decremento

```js
let x = 5;
x++;          // post-incremento: devuelve 5, x pasa a 6
++x;          // pre-incremento: x pasa a 7, devuelve 7
```

Regla práctica: si solo te interesa el efecto (`x++`), da igual. Si usas el valor en la misma expresión, importa.

---

## 2. Comparación: `==` vs `===`

Aquí está la trampa clásica. La explicación que oirás en cualquier sitio es:

> "`===` compara valor y tipo, `==` solo compara valor."

**Está mal redactada.** En realidad:

- **`===` (strict equality)**: si los tipos no coinciden, devuelve `false` directamente. Si coinciden, compara los valores.
- **`==` (loose equality)**: si los tipos no coinciden, **convierte uno (o los dos) para que sí coincidan**, y luego compara. Si ya coinciden, se comporta como `===`.

La diferencia real es: **`==` aplica coerción de tipo, `===` no**. Por eso `==` produce resultados raros.

```js
1 === 1;       // true
1 === "1";     // false   (tipos distintos, fin)

1 == "1";      // true    ("1" -> 1, luego 1 == 1)
0 == "";       // true    ("" -> 0)
0 == false;    // true    (false -> 0)
"0" == false;  // true    ("0" -> 0, false -> 0)
```

### El caso especial: `null == undefined`

```js
null == undefined;    // true
null === undefined;   // false
null == 0;            // false   ← OJO: aquí NO hay coerción a número
undefined == 0;       // false
```

**Esto NO es por "ambos son falsy"**. Es una **regla especial escrita a mano en la spec de ECMAScript**: en `==`, `null` y `undefined` se consideran iguales entre sí, y a nada más. No hay coerción a número aquí.

Es decir: la lógica de "ambos falsy → iguales" no existe en JS. Si fuera así, `0 == false` se explicaría por eso (ambos falsy), pero también `null == 0` debería ser `true` y no lo es. La regla es ad-hoc.

### `NaN`

```js
NaN === NaN;        // false  ← ya lo viste en módulo 3
Number.isNaN(NaN);  // true   ← la forma correcta de detectarlo
```

### Conclusión práctica

**Usa siempre `===`** (y `!==`). El único uso aceptable de `==` que vas a ver en código moderno es la comprobación `x == null`, que es un atajo idiomático para "x es null o undefined". Pero hasta eso muchos lints lo prohíben.

### Mayor / menor

```js
2 < 10;        // true
"2" < 10;      // true   (string -> number)
"2" < "10";    // false  ← ambos son strings, compara lexicográficamente: "2" > "1"
```

Con strings de un lado y números de otro, hay coerción a número. Con strings a ambos lados, comparación alfabética. Esto sí pilla.

---

## 3. Lógicos: `&&`, `||`, `!`

### El detalle que sorprende: NO devuelven booleans

`&&` y `||` evalúan en **short-circuit** y devuelven **uno de los dos operandos**, no necesariamente `true` o `false`.

```js
"hola" && 42;       // 42        ← "hola" es truthy, devuelve el segundo
0 && 42;            // 0         ← 0 es falsy, devuelve el primero (no evalúa el segundo)

"hola" || 42;       // "hola"    ← truthy, devuelve el primero
0 || 42;            // 42        ← falsy, evalúa y devuelve el segundo
"" || null || 7;    // 7         ← recorre hasta encontrar el primer truthy
```

Reglas:

- **`a && b`**: si `a` es falsy, devuelve `a` (y no toca `b`). Si es truthy, devuelve `b`.
- **`a || b`**: si `a` es truthy, devuelve `a` (y no toca `b`). Si es falsy, devuelve `b`.

Truthy / falsy lo vemos a fondo en el módulo 5. Por ahora: los **falsy** en JS son `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`. Todo lo demás es truthy.

### Patrón clásico: valor por defecto con `||`

```js
const name = inputName || "anonymous";
```

**Trampa**: si `inputName` puede ser legítimamente `0`, `""` o `false`, los pisas con `"anonymous"` aunque no querías. Por eso existe `??`.

### `!` (negación)

```js
!true;        // false
!0;           // true   (0 es falsy, negar lo convierte a true)
!"hola";      // false
!!"hola";     // true   ← doble negación: forma idiomática de convertir a boolean
```

---

## 4. Ternario `condición ? a : b`

```js
const tier = score >= 90 ? "gold" : score >= 70 ? "silver" : "bronze";
```

Es una **expresión** (devuelve valor), no una sentencia. Útil en una sola línea. Si lo anidas más de un nivel, suele ser hora de usar `if/else` o `switch`.

---

## 5. Nullish coalescing `??`

```js
const port = config.port ?? 3000;
```

- `a ?? b` devuelve `b` **solo si `a` es `null` o `undefined`**. En cualquier otro caso, devuelve `a`.
- Es la versión "segura" de `||` para valores por defecto: **`0`, `""` y `false` no disparan el default**.

```js
0 || 3000;     // 3000   ← || considera 0 como "no hay valor"
0 ?? 3000;     // 0      ← ?? solo dispara si es null o undefined

"" || "x";     // "x"
"" ?? "x";     // ""
```

Restricción: no se puede mezclar `??` con `||` o `&&` sin paréntesis explícitos. JS te obliga a desambiguar:

```js
a ?? b || c;     // SyntaxError
(a ?? b) || c;   // OK
a ?? (b || c);   // OK
```

---

## 6. Optional chaining `?.`

```js
const street = user?.address?.street;
```

- `a?.b` devuelve `a.b` si `a` no es `null` ni `undefined`. Si lo es, devuelve `undefined` sin lanzar.
- Equivale a un check defensivo "si existe, entra".

```js
const u = null;
u.name;       // TypeError: Cannot read properties of null
u?.name;      // undefined  ← sin lanzar
```

Tres variantes:

```js
obj?.prop;          // acceso a propiedad
obj?.[key];         // acceso por clave dinámica
fn?.(arg);          // llamada de función opcional (solo invoca si fn no es null/undefined)
```

### Combinar `?.` con `??`

Aparece todo el rato:

```js
const port = config?.server?.port ?? 3000;
```

Léelo: "intenta llegar a `config.server.port`; si en algún punto algo es `null`/`undefined`, da `undefined`; si el resultado final es `null`/`undefined`, usa `3000`".

---

## 7. Spread `...` y rest `...`

Mismo símbolo, **uso opuesto según contexto**. Es solo un primer contacto, los profundizaremos en arrays (módulo 10), objetos (módulo 11), destructuring (módulo 12) y funciones (módulo 7).

### Spread: **expande** un iterable / objeto

```js
const a = [1, 2, 3];
const b = [0, ...a, 4];           // [0, 1, 2, 3, 4]

const o1 = { x: 1, y: 2 };
const o2 = { ...o1, z: 3 };       // { x: 1, y: 2, z: 3 }

Math.max(...[5, 3, 9, 1]);        // 9   ← pasa los elementos como argumentos sueltos
```

### Rest: **agrupa** varios argumentos en uno

```js
function sum(...nums) {
  return nums.reduce((acc, n) => acc + n, 0);
}
sum(1, 2, 3, 4);   // 10
```

Regla mnemotécnica: **si está a la derecha de un `=` o dentro de una llamada, es spread (expande). Si está en la lista de parámetros de una función o en un destructuring, es rest (recoge)**.

---

## 8. Resumen

- `+` con string concatena; los demás aritméticos coercionan a número.
- `==` aplica **coerción**, `===` no. Usa `===` siempre. `null == undefined` es una **regla especial**, no derivada de truthy/falsy.
- `&&` y `||` devuelven **uno de los operandos**, no booleans. `!!x` convierte a boolean.
- `??` solo dispara default con `null`/`undefined`. `||` lo hace con cualquier falsy.
- `?.` corta la cadena si algo es nullish y devuelve `undefined` en vez de lanzar.
- `...` expande o agrupa según contexto.

---

## Ejercicio

Crea `operators.js` en esta carpeta. Cinco partes. Como siempre: naming en inglés, valores que ejerciten el operador (no rellenos), y **predicción antes de ejecutar** donde se indica.

### Parte 1. Aritméticos y el lío del `+`

Imprime el resultado y el `typeof` de cada uno:

```js
1 + 2
"1" + 2
1 + "2" + 3
"1" + 2 + 3
4 + 3 * 2
(4 + 3) * 2
"5" - 2
"abc" - 1
+ "42"
+ "abc"
```

Antes de ejecutar, escribe en un comentario al lado de cada línea **qué crees que devuelve y qué tipo es**. Después corrige los que te sorprendan dejando la predicción tachada con `// (creía X, salió Y)`.

### Parte 2. `==` vs `===`

Imprime el resultado de:

```js
1 == "1"
1 === "1"
0 == false
0 === false
"" == false
null == undefined
null === undefined
null == 0
undefined == 0
NaN == NaN
```

Después escribe un comentario corto explicando, **con tus palabras**, qué diferencia hay entre `==` y `===`. Si te sale algo del estilo "uno compara tipo y otro no", repásalo, no es lo que decimos en este módulo.

### Parte 3. Lógicos que no devuelven booleans

Imprime y predice:

```js
"hello" && 42
0 && 42
null && "x"
"hello" || 42
0 || "default"
"" || null || "found"
!"hello"
!0
!!""
!!"hola"
```

En un comentario al final de la parte, responde: **¿cuándo `||` no sirve como "valor por defecto"?** Da un caso concreto en código.

### Parte 4. `??` y `?.`

```js
const user = {
  name: "Ivan",
  prefs: {
    theme: "dark",
    notifications: 0,
  },
};

const ghost = null;
```

Imprime:

```js
user.prefs.notifications ?? "no preference"
user.prefs.notifications || "no preference"
user?.prefs?.theme
ghost?.prefs?.theme
ghost?.prefs?.theme ?? "guest theme"
user?.sayHi?.()        // sayHi no existe
```

Antes de ejecutar predice cada línea. Después responde en un comentario: **¿por qué línea 1 y línea 2 dan resultados distintos?** y **¿por qué línea 6 no lanza?**.

### Parte 5. Spread y rest

Implementa una función `max(...nums)` que use rest para aceptar N números y devuelva el mayor. No uses `Math.max(...)` por dentro; resuélvelo con un loop o con `reduce`.

Después demuestra spread haciendo dos cosas:

1. Crear `const allScores = [...prevScores, ...newScores]` a partir de dos arrays cualquiera y mostrar el resultado.
2. Crear `const merged = { ...defaults, ...overrides }` a partir de dos objetos donde `overrides` pise alguna clave de `defaults`. Muestra el objeto resultante y comenta **cuál pisa a cuál y por qué**.

### Qué espero ver cuando lo enseñes

- `operators.js` con las 5 partes claras (separadas con comentarios `// ----- Parte N -----`).
- Las predicciones escritas **antes** de ejecutar en las partes 1, 2, 3, 4.
- Las explicaciones con tus palabras en parte 2 (`==` vs `===`), parte 3 (cuándo `||` no sirve), y parte 4 (por qué `??` ≠ `||` y por qué `?.` no lanza).
- En la parte 5, tu `max` funcionando y el merge de objetos con explicación de la precedencia.

Si te atascas en algo concreto, dilo y vamos con pistas progresivas.
