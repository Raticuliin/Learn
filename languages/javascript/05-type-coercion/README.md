# Módulo 5. Coerción de tipos

## Objetivos

Al terminar este módulo sabrás:

- Qué es la **coerción** y por qué JS la hace en sitios donde otros lenguajes no.
- Las **tres conversiones** que existen: a `string`, a `number`, a `boolean`. Cómo se hacen explícita e implícitamente.
- La lista completa de **valores falsy** y la regla "todo lo demás es truthy".
- Por qué **`NaN`** se comporta raro y por qué **`Number.isNaN`** existe junto a `isNaN`.
- Lo justo de **`ToPrimitive`** (cómo objetos se convierten a primitivos) para entender los "wat" clásicos como `[] + {}`.

---

## 1. Qué es la coerción

**Coerción** = conversión automática de un valor de un tipo a otro porque el operador o el contexto lo necesita.

Ya la viste en el módulo 4 sin nombrarla:

```js
"5" - 2;       // 3      ← "5" coercionado a number
"1" + 2;       // "12"   ← 2 coercionado a string
1 == "1";      // true   ← "1" coercionado a number
if ("hola") {} // ejecuta ← "hola" coercionado a boolean
```

JS solo tiene tres conversiones primitivas: a **string**, a **number**, a **boolean**. Cuando un objeto entra en juego, primero se reduce a primitivo (`ToPrimitive`, ver sección 5) y luego se aplica una de las tres.

### Explícita vs implícita

- **Explícita**: tú escribes la conversión. `Number("42")`, `String(true)`, `Boolean(0)`.
- **Implícita**: el lenguaje la hace solo, por el operador o el contexto.

Saber distinguirlas es el truco para que el código no te sorprenda: en cuanto identificas la coerción implícita en una expresión, la rareza desaparece.

---

## 2. Conversión a `string`

### Explícita

```js
String(42);          // "42"
String(true);        // "true"
String(null);        // "null"
String(undefined);   // "undefined"
String([1, 2, 3]);   // "1,2,3"
String({ a: 1 });    // "[object Object]"
```

`String(x)` siempre devuelve un string. Funciona con cualquier valor (también con `null` y `undefined`, donde `.toString()` lanzaría).

### Implícita

Ocurre principalmente con **`+` si uno de los operandos es string**, y con template literals:

```js
1 + "2";        // "12"
"" + 42;        // "42"    ← truco viejo para coercer a string
`${42}`;        // "42"
```

`alert(x)`, `console.log` (en algunos casos) y `JSON.stringify` también producen strings pero por mecanismos propios, no por coerción del operador.

---

## 3. Conversión a `number`

### Explícita

```js
Number("42");        // 42
Number("3.14");      // 3.14
Number("");          // 0          ← OJO
Number("  42  ");    // 42         ← trim implícito
Number("42abc");     // NaN
Number(true);        // 1
Number(false);       // 0
Number(null);        // 0          ← OJO
Number(undefined);   // NaN        ← OJO: null y undefined NO son iguales aquí
Number([]);          // 0          ← array vacío -> 0
Number([42]);        // 42         ← array con un solo número -> ese número
Number([1, 2]);      // NaN        ← varios elementos -> NaN
Number({});          // NaN
```

Atajo: el unario `+` hace lo mismo que `Number(...)`.

```js
+"42";         // 42
+"";           // 0
+true;         // 1
+null;         // 0
+undefined;    // NaN
```

`parseInt` y `parseFloat` **NO son coerción**, son parsers: leen mientras encuentran dígitos válidos y paran. `parseInt("42abc") === 42`, pero `Number("42abc") === NaN`. Cosas distintas.

### Implícita

Ocurre con **operadores aritméticos que no sean `+`**, con **comparaciones `< > <= >=`**, y con **`==` cuando un operando es number** (entre otras):

```js
"5" - 2;       // 3        ("5" -> 5)
"5" * "2";     // 10       (ambos -> number)
"10" > 9;      // true     ("10" -> 10)
true + 1;      // 2        (true -> 1)
[] + 1;        // "1"      OJO: aquí gana la concatenación, NO coerce a number (ver sección 5)
```

---

## 4. Conversión a `boolean`: truthy y falsy

### La lista corta: los **8 valores falsy**

```js
false
0
-0
0n          // bigint cero
""          // string vacío
null
undefined
NaN
```

**Todo lo demás es truthy.** Y "todo lo demás" incluye cosas que la gente espera que sean falsy y no lo son:

```js
Boolean([]);          // true   ← array vacío es truthy
Boolean({});          // true   ← objeto vacío es truthy
Boolean("0");         // true   ← string "0" es truthy (es un string no vacío)
Boolean("false");     // true   ← idem
Boolean(new Boolean(false)); // true ← objeto wrapper, no primitivo
```

Las dos primeras (`[]` y `{}` truthy) son las que más lían a quien viene de Python o PHP.

### Explícita

```js
Boolean(0);          // false
Boolean(1);          // true
Boolean("");         // false
Boolean("hi");       // true
```

Atajo idiomático: **`!!x`**. Doble negación: la primera convierte a boolean (negado), la segunda lo niega de vuelta.

```js
!!"hola";    // true
!!0;         // false
```

### Implícita

Ocurre en **cualquier contexto que pida una decisión booleana**:

- Condición de `if`, `while`, `for`, ternario.
- Operandos de `&&`, `||`, `!`.

```js
if ("hola") { /* entra: "hola" es truthy */ }
if (0)      { /* no entra: 0 es falsy */ }
0 || "x";   // "x"  (0 falsy)
```

Recuerda del módulo 4: `&&` y `||` evalúan la "veracidad" pero devuelven **uno de los operandos**, no `true`/`false`. La coerción a boolean ocurre solo para decidir, no para producir el resultado.

---

## 5. `ToPrimitive`: cómo se convierten los objetos

Cuando un objeto se encuentra en una operación que necesita un primitivo (sumar, comparar, coercer), JS lo convierte primero a primitivo siguiendo un protocolo llamado **ToPrimitive**. La idea simplificada:

- JS pide un primitivo con una **hint**: `"number"`, `"string"` o `"default"`.
- El objeto responde llamando, en orden, a dos métodos: `valueOf()` y `toString()`. Si la hint es `"string"`, prueba primero `toString()`; si es `"number"` o `"default"`, prueba primero `valueOf()`.
- El primero que devuelva un primitivo gana.

Detalles completos y `Symbol.toPrimitive` -> módulo 28.

Lo que importa ahora: esto explica los "wat" clásicos.

```js
[] + [];       // ""
[] + {};       // "[object Object]"
{} + [];       // 0      ← OJO: depende del parser, ver abajo
[1] + [2];     // "12"   ← cada uno -> "1" y "2", luego concatena
[1, 2] + [3];  // "1,23"
```

- `[]` con `toString()` da `""`. Por eso `[] + [] === ""`.
- `{}` con `toString()` da `"[object Object]"`.
- `[1, 2] + ""` da `"1,2"` (el `toString` de arrays une con coma).

El caso de `{} + []` es trampa de parser, no de coerción: en consola del navegador, el `{}` inicial se interpreta como un **bloque vacío** y la expresión que evalúa es `+[]`, que es `0`. Si lo envuelves en paréntesis (`({} + [])`), el parser ya sabe que `{}` es un objeto y obtienes `"[object Object]"`. Cosas como esta son **trivia**, no código que escribas: la moraleja es "no mezcles objetos con `+`".

---

## 6. `NaN` y por qué `Number.isNaN` existe

Ya lo viste en módulo 3. Recordatorio rápido y la novedad sobre `isNaN`:

```js
NaN === NaN;          // false        ← NaN no es igual a nada, ni a sí mismo
Number.isNaN(NaN);    // true         ← la forma correcta
Number.isNaN("NaN");  // false        ← "NaN" no es el valor NaN, es un string
isNaN("hola");        // true         ← OJO: el global isNaN coerciona antes de comprobar
isNaN("NaN");         // true         ← idem
Number.isNaN("hola"); // false        ← Number.isNaN no coerciona
```

Diferencia clave:

- **`isNaN(x)`** (global, legacy): primero hace `Number(x)`, después comprueba. Da `true` para cualquier cosa que no se pueda convertir a number, no solo para el valor `NaN`. Es prácticamente inútil.
- **`Number.isNaN(x)`** (ES2015): devuelve `true` solo si `x` es **exactamente el valor `NaN`**. Es lo que quieres siempre.

Regla práctica: **olvida `isNaN`**. Usa `Number.isNaN` o, si solo quieres comprobar si algo "no es un número válido", `Number.isFinite(Number(x))`.

---

## 7. Resumen de coerciones

| Valor | a string | a number | a boolean |
|---|---|---|---|
| `undefined` | `"undefined"` | `NaN` | `false` |
| `null` | `"null"` | `0` | `false` |
| `true` | `"true"` | `1` | `true` |
| `false` | `"false"` | `0` | `false` |
| `42` | `"42"` | `42` | `true` |
| `0` | `"0"` | `0` | `false` |
| `NaN` | `"NaN"` | `NaN` | `false` |
| `""` | `""` | `0` | `false` |
| `"42"` | `"42"` | `42` | `true` |
| `"abc"` | `"abc"` | `NaN` | `true` |
| `[]` | `""` | `0` | `true`  ← OJO |
| `[42]` | `"42"` | `42` | `true` |
| `[1,2]` | `"1,2"` | `NaN` | `true` |
| `{}` | `"[object Object]"` | `NaN` | `true`  ← OJO |

Las dos filas marcadas son la fuente de la mayoría de bugs por coerción: `Boolean([])` y `Boolean({})` son `true`. Si quieres saber si un array está vacío, comprueba `arr.length === 0`, no `if (!arr)`.

---

## 8. Reglas prácticas (para que no te muerda)

1. **Conversión a number siempre explícita**: `Number(x)` o `+x`. No confíes en `"5" - 0` ni cosas similares.
2. **Conversión a boolean explícita cuando importa**: `Boolean(x)` o `!!x`. En `if (x)` está bien implícita; en una asignación (`const ok = !!x`) prefiere la forma explícita.
3. **Nunca uses `==`** (excepción única: `x == null` para "null o undefined", y solo si tu lint lo permite).
4. **No mezcles objetos con `+`** ni con comparaciones. Trabaja con sus propiedades.
5. **`Number.isNaN`, no `isNaN`**.
6. **Para "está vacío"**: `arr.length === 0`, `Object.keys(obj).length === 0`, `str === ""`. No `if (!arr)` ni `if (!obj)`.

---

## Ejercicio

Crea `coercion.js` en esta carpeta. Cinco partes. Como siempre: **predicción antes de ejecutar** donde se indique.

### Parte 1. Explícita a number, string, boolean

Convierte estos valores a los tres tipos usando `String(...)`, `Number(...)`, `Boolean(...)`. Imprime cada conversión en formato `<valor original> -> string=<r>, number=<r>, boolean=<r>`.

```js
"42"
"42abc"
""
"   42   "
true
false
null
undefined
[]
[42]
[1, 2]
{}
{ a: 1 }
```

Antes de ejecutar, predice **las cuatro casillas que más raras te parezcan** (escribe al lado qué crees que va a salir). Después corrige las que falles.

### Parte 2. Coerción implícita: el `+` y los demás

Imprime y predice:

```js
1 + "2"
"3" + 4 + 5
3 + 4 + "5"
"5" - 2
"5" * "2"
"abc" - 1
true + true
true + "true"
null + 1
undefined + 1
[] + []
[] + {}
[1] + [2]
```

Después escribe **con tus palabras** la regla del `+`: cuándo concatena, cuándo suma, y qué hace cuando hay objetos por medio.

### Parte 3. Truthy / falsy

Escribe una función `isTruthy(x)` que devuelva `true` si `x` es truthy y `false` si es falsy. **Implementa sin usar `Boolean(...)` ni `!!`**: usa una sola expresión con `?` ternario o con `if`. (Sí, después puedes comparar con `Boolean(x)` para validar; pero el ejercicio es escribirlo a mano para forzarte a pensar en la decisión.)

Después llámala sobre estos valores y verifica que coinciden con `Boolean(x)`:

```js
0, -0, 0n, "", null, undefined, NaN, false,    // todos falsy
1, "0", "false", " ", [], {}, [0], () => {}    // todos truthy
```

Si alguno te sorprende que sea truthy, anótalo en un comentario.

### Parte 4. `NaN` y compañía

Predice e imprime:

```js
NaN === NaN
Number.isNaN(NaN)
Number.isNaN("NaN")
Number.isNaN("hola")
isNaN("NaN")
isNaN("hola")
isNaN(undefined)
Number.isNaN(undefined)
```

Después responde en un comentario: **¿por qué `isNaN("hola")` es `true` pero `Number.isNaN("hola")` es `false`?** Una sola frase.

### Parte 5. Validador de input numérico

Escribe `toNumberOrNull(input)` que reciba **un valor cualquiera** y devuelva:

- El número correspondiente si `input` se puede interpretar como número finito.
- `null` si no.

Casos a cubrir:

```js
toNumberOrNull(42)          // 42
toNumberOrNull("42")        // 42
toNumberOrNull("  3.14  ")  // 3.14
toNumberOrNull("42abc")     // null   ← Number("42abc") es NaN
toNumberOrNull("")          // null   ← OJO: Number("") es 0, no queremos eso
toNumberOrNull(null)        // null   ← OJO: Number(null) es 0
toNumberOrNull(undefined)   // null
toNumberOrNull(true)        // null   ← booleans no cuentan como número aquí
toNumberOrNull(NaN)         // null
toNumberOrNull(Infinity)    // null   ← finito o nada
toNumberOrNull([42])        // null   ← arrays no cuentan
toNumberOrNull({})          // null
```

Pista: el reto está en que **`Number(x)` por sí solo no basta** porque `Number("") === 0`, `Number(null) === 0`, `Number(true) === 1`, etc. Tienes que decidir primero **si el input es del tipo que quieres aceptar**, y luego convertirlo.

### Qué espero ver cuando lo enseñes

- `coercion.js` con las 5 partes claras (separadas con `// ----- Parte N -----`).
- Predicciones escritas antes de ejecutar en las partes 1, 2, 4.
- En parte 2, tu regla del `+` con tus palabras.
- En parte 3, tu `isTruthy` funcionando y los casos truthy que te sorprenden anotados.
- En parte 4, una frase explicando por qué `isNaN` y `Number.isNaN` divergen.
- En parte 5, `toNumberOrNull` pasando todos los casos. Tiene chicha: piénsalo bien antes de codear.

Si te atascas, dilo y vamos con pistas progresivas.
