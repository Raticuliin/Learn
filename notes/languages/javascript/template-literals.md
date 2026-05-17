# template-literals

Strings con **backticks** (`` ` ``) que permiten interpolación y multilínea. ES6.

## Interpolación

`${expresión}` evalúa cualquier expresión y la inserta coercionada a string ([[type-coercion]]).

```js
const name = "Iván";
`Hola, ${name}!`;              // "Hola, Iván!"
`Suma: ${3 + 4}`;              // "Suma: 7"
`Es par: ${5 % 2 === 0}`;      // "Es par: false"
```

Solo expresiones. **Statements no caben** (un `for`, un `if` sin operador ternario). Si necesitas lógica imperativa, sácala fuera y mete el resultado.

## Multilínea

Los saltos de línea forman parte del string sin trucos.

```js
const html = `
  <div>
    <h1>${name}</h1>
  </div>
`;
```

⚠️ La indentación dentro del template **cuenta** como espacios en el output. Si quieres alineación visual sin espacios extra, pega las líneas al margen izquierdo o usa una utility tipo `dedent`.

## Patrón: lista formateada con `map + join`

Idiomático cuando interpolas una colección:

```js
const items = ["Manzanas", "Pan", "Leche"];

`Tu pedido:
${items.map(i => `- ${i}`).join("\n")}`;
```

Más limpio que un bucle imperativo que va concatenando.

## Tagged templates

Una función "etiqueta" un template literal y recibe las partes:

```js
function highlight(strings, ...values) {
  return strings.reduce(
    (acc, s, i) => acc + s + (values[i] !== undefined ? `**${values[i]}**` : ""),
    ""
  );
}

highlight`Hola ${name}, tienes ${3 + 4} mensajes`;
// "Hola **Iván**, tienes **7** mensajes"
```

Casos reales:

- Librerías SQL/HTML que escapan inputs automáticamente (`sql\`SELECT * WHERE id = ${id}\``).
- Internacionalización (`i18n\`Hello ${name}\``).
- CSS-in-JS (`styled.div\`color: ${props => props.color}\``).

Lo leerás más de lo que lo escribirás.

Relacionadas: [[js-strings]], [[type-coercion]].
