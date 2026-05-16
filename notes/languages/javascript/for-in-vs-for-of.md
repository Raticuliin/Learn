# for-in-vs-for-of

Dos bucles de aspecto parecido en JS que hacen cosas distintas. Confundirlos es uno de los errores más típicos al pasar de otro lenguaje.

## `for...of` — itera **valores** de iterables

Funciona con cualquier cosa que implemente `Symbol.iterator`: arrays, strings, `Map`, `Set`, generators, `NodeList`, argumentos de función...

```js
for (const v of ["a", "b", "c"]) console.log(v); // "a", "b", "c"
for (const ch of "abc")           console.log(ch); // "a", "b", "c"
```

Para índice + valor en un array:

```js
for (const [i, v] of arr.entries()) { ... }
```

## `for...in` — itera **claves enumerables** de un objeto

Diseñado para objetos planos. Devuelve los nombres de propiedad como **strings**, incluyendo las heredadas por el prototipo si son enumerables.

```js
const user = { name: "Ana", age: 30 };
for (const key in user) console.log(key, user[key]); // "name" Ana, "age" 30
```

## Por qué `for...in` sobre arrays es una trampa

1. **Devuelve índices como strings**, no como números:

   ```js
   for (const i in [10, 20, 30]) console.log(typeof i); // "string" x3
   ```

2. **Itera propiedades enumerables añadidas al array** (incluso del prototipo si alguien lo modificó):

   ```js
   const arr = [10, 20, 30];
   arr.extra = "foo";
   for (const i in arr) console.log(i); // "0", "1", "2", "extra"
   ```

3. **No garantiza orden** en general (con índices enteros sí, pero la regla general del lenguaje es "no te fíes del orden"). Para arrays es semánticamente raro de todas formas.

Regla práctica: **para arrays, nunca `for...in`**. Usa `for...of`, `for` clásico, o métodos (`forEach`, `map`, `filter`...).

## Para objetos: prefiere `Object.entries`/`keys`/`values`

`for...in` funciona pero te obliga a usar `obj[key]` para ir a por el valor, y arrastra propiedades del prototipo. La forma moderna:

```js
for (const [key, value] of Object.entries(user)) {
  console.log(key, value);
}
```

- Coge solo propiedades propias (no del prototipo).
- Te da clave y valor en la misma línea con destructuring.
- Es un iterable -> compatible con todo lo que funciona con `for...of`.

Variantes: `Object.keys(obj)` (solo claves), `Object.values(obj)` (solo valores).

## Resumen

| Caso                        | Mejor opción                                |
| --------------------------- | ------------------------------------------- |
| Valores de un array         | `for...of`                                  |
| Índice + valor de un array  | `for...of` con `.entries()` + destructuring |
| Iterar string char a char   | `for...of`                                  |
| Recorrer un objeto plano    | `Object.entries(obj)` + `for...of`          |
| `Map` o `Set`               | `for...of` directo                          |
| `for...in`                  | Casi nunca. Solo objetos planos sin clase   |

## Relación

- [[control-flow-js]] (visión general).
- [[js-arrays]] (cuando se profundiza en arrays y métodos de iteración).
