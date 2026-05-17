# weakmap-weakset

Variantes de [[js-map]] y [[js-set]] cuya referencia a las **claves** (WeakMap) o **valores** (WeakSet) es **débil**: si el objeto se queda sin otras referencias, el GC puede liberarlo y la entrada desaparece sola.

## Por qué existen

Un Map normal retiene los objetos que usa como clave. A veces quieres **adjuntar datos a un objeto** sin impedir que se libere cuando ya nadie más lo use.

```js
const metadata = new WeakMap();
let el = { tag: "div" };
metadata.set(el, { clicks: 0 });

el = null; // metadata libera la entrada cuando el GC pase
```

## Restricciones

- **Claves deben ser objetos** (o symbols registrados). Strings/números → TypeError.
- **No iterable**: sin `.size`, sin `.keys`/`.values`/`.entries`.
- API mínima: `get`/`set`/`has`/`delete` (Map), `add`/`has`/`delete` (Set).

## Casos de uso

- **Metadata por objeto**: contadores, flags, cachés asociados a una instancia. Patrón: el valor suele ser un objeto `{ ... }` que se muta in-place (`meta.count++`), no se reasigna con `set`. Aprovecha el [[pass-by-reference]] — el WeakMap guarda la referencia, mutarla muta la entrada.
- **Marcar objetos visitados** (WeakSet): grafos, evitar ciclos en recorridos.
- **Asociar info a objetos que tú no controlas** (DOM elements, instancias ajenas) sin filtrar memoria.

## Cuándo NO usar

- Si necesitas iterar lo que hay dentro → usa Map/Set normales.
- Si las claves son strings o primitivos → no es posible, usa Map.

## Ver también

- [[js-map]] · [[js-set]] · [[pass-by-reference]]
