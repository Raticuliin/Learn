# object-freeze

Tres niveles de restricción para un objeto, de más a menos estricto. Las tres son **superficiales**: los objetos anidados no quedan protegidos.

| Operación | añadir | borrar | modificar valores |
|---|---|---|---|
| `Object.freeze(obj)` | ❌ | ❌ | ❌ |
| `Object.seal(obj)` | ❌ | ❌ | ✅ |
| `Object.preventExtensions(obj)` | ❌ | ✅ | ✅ |

Comprobaciones simétricas: `Object.isFrozen`, `Object.isSealed`, `Object.isExtensible`.

## Modo strict vs no-strict

Las violaciones se comportan distinto según el modo:

- **Strict** (`"use strict"` o módulos ESM): lanzan `TypeError`.
- **No-strict** (archivo `.js` ejecutado por Node sin `"type": "module"`): **fallan silenciosamente**. La asignación no hace nada, no salta error, el programa sigue. Trampa clásica al ejecutar scripts sueltos con `node`.

Por eso si quieres probar `Object.freeze` con `try/catch` en un `.js` suelto, pon `"use strict";` arriba. Ver [[strict-mode]].

## Superficial: el problema

```js
const config = Object.freeze({ db: { host: "localhost" } });
config.db.host = "remote"; // ✅ funciona, no está congelado el interior
config.db = {};            // ❌ TypeError en strict (modificar el primer nivel)
```

Para congelar en profundidad hay que recorrer recursivamente y aplicar `freeze` a cada objeto interno (o usar [[shallow-vs-deep-copy|structuredClone]] + freeze al resultado).

## Relacionado

- [[js-objects]] — operaciones sobre objetos en general
- [[strict-mode]] — por qué importa el modo
- [[shallow-vs-deep-copy]] — el problema de la superficialidad
