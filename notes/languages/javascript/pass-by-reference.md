# pass-by-reference

En JS las variables guardan:

- **Primitivos** (`number`, `string`, `boolean`, `null`, `undefined`, `bigint`, `symbol`): el **valor**. Ver [[js-primitive-types]].
- **Objetos** (arrays, funciones, objetos literales, instancias de clase, ...): una **referencia** al objeto en memoria.

Asignar o pasar a una función mueve lo que la variable guarda. Para primitivos, una copia del valor. Para objetos, una copia de la referencia — el objeto en sí no se duplica.

## Consecuencias

### Asignación

```js
const a = { count: 0 };
const b = a;           // b apunta al mismo objeto
b.count = 5;
a.count;               // 5
```

### Paso a funciones

```js
function reset(obj) { obj.count = 0; }
const counter = { count: 10 };
reset(counter);
counter.count;         // 0  — la función mutó el original
```

### `const` no protege el contenido

`const` impide reasignar la variable (cambiar a qué objeto apunta), no modificar el objeto al que apunta.

```js
const user = { name: "Ana" };
user.name = "Bob";    // ✅ permitido: el objeto se muta
user = {};            // ❌ TypeError: no se puede reasignar `user`
```

Para inmutabilidad real necesitas [[object-freeze|Object.freeze]] o no mutar por convención.

### Comparación con `===`

`===` entre objetos compara referencias, no contenido. Dos objetos con las mismas propiedades son distintos:

```js
{ a: 1 } === { a: 1 }  // false
const x = { a: 1 };
const y = x;
x === y                // true (misma referencia)
```

## ¿Pass-by-reference o pass-by-value?

Estrictamente JS es **pass-by-value**: la función recibe una **copia de la referencia**. Eso explica por qué `obj.x = 5` dentro de la función sí afecta al original (muta el objeto compartido), pero `obj = otroObjeto` no afecta fuera (solo reasigna la copia local de la referencia).

Para el día a día, el modelo mental "primitivos por valor, objetos por referencia" funciona y es como lo describe casi toda la documentación.

## Relacionado

- [[js-primitive-types]] — qué valores son primitivos
- [[js-objects]] — operaciones sobre objetos
- [[shallow-vs-deep-copy]] — cómo evitar el alias cuando no lo quieres
- [[object-freeze]] — bloquear mutación
