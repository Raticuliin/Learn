# Proyecto integrador 1 — CLI Guessing Game

Tu primer programa completo en JS: un juego de adivinar número que corre en la terminal con Node.

## Objetivos

- Construir un programa **end-to-end** integrando lo que sabes de los módulos 1-7.
- Conocer el flujo Node: `node game.js`, entrypoint, `process.exit` implícito al terminar.
- Primer contacto con `readline/promises` para leer del stdin.
- Practicar **descomposición**: dividir el código en funciones pequeñas con responsabilidad clara.

## Conceptos que integra

| Módulo                           | Lo que vas a usar                                       |
| -------------------------------- | ------------------------------------------------------- |
| 2. Variables                     | `const` por defecto, `let` para mutables (intentos)     |
| 3. Tipos primitivos              | `number`, `string`, `boolean`                           |
| 4. Operadores                    | Comparación, `??`, `&&`, `\|\|`                         |
| 5. Coerción                      | Validar input de usuario (string → number sin trampa)   |
| 6. Control de flujo              | `while` para el bucle del juego, `if/else`, `break`     |
| 7. Funciones I                   | Declaración / expresión, defaults, rest si aplica       |

## Lo nuevo (mínimo necesario)

### `Math.random()`

Devuelve un número decimal en `[0, 1)`. Para un entero entre `min` y `max` inclusive:

```js
Math.floor(Math.random() * (max - min + 1)) + min;
```

### `readline/promises`

Built-in de Node, no necesitas `npm install`. Patrón básico:

```js
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });

const answer = await rl.question("¿Tu nombre? ");
console.log(`Hola, ${answer}`);

rl.close();
```

Tres cosas a saber:

1. **Top-level `await`** funciona si el archivo es **ES Module**. Para que Node trate el archivo como ESM, la forma más simple: ponlo dentro de una carpeta con un `package.json` que tenga `{ "type": "module" }`. (Te lo doy hecho abajo.)
2. `rl.question(prompt)` devuelve una **Promise** que resuelve con el string que tecleó el usuario.
3. **Hay que llamar a `rl.close()`** al terminar; si no, el programa no sale.

### `async` / `await` — versión "úsalo como herramienta"

Por ahora, mentaliza `await` como "pausa esta función hasta que esto termine, luego sigue con el resultado". El mecanismo real (event loop, microtasks, etc.) lo vemos en la Fase 6. Te basta con saber:

- Una función que devuelve Promise se "pausa" con `await`.
- Solo puedes usar `await` dentro de una función `async` **o** a nivel top-level en un ES Module.

## Requisitos funcionales (criterios de "terminado")

El proyecto se considera completo cuando se cumplen estos 6 puntos:

1. El programa elige un número entero aleatorio entre **1 y 100** (ambos inclusive).
2. Pide al usuario que adivine, **repetidamente**.
3. Tras cada intento válido, responde una de tres opciones:
   - `"demasiado alto"`
   - `"demasiado bajo"`
   - `"¡acertaste!"`
4. El usuario tiene un máximo de **7 intentos**. Si los agota, pierde y se le revela el número.
5. **Valida el input**: si lo que escribe el usuario no es un entero entre 1 y 100, le avisa y **no le cuenta como intento**.
6. Al terminar (gana o pierde), muestra un resumen:
   - Si ganó: "¡acertaste en X intento(s)!".
   - Si perdió: "te quedaste sin intentos. El número era X".

## Stretch goals (opcionales)

Si terminas y quieres más:

1. **Rejugar**: al terminar la partida, pregunta `"¿otra partida? (s/n)"`. Si responde `"s"`, reinicia.
2. **Configuración por argumentos**: leer rango y número de intentos desde `process.argv`. Ej: `node game.js --max=200 --tries=10`.
3. **Historial**: lleva en memoria las partidas jugadas (intentos usados, número, resultado) y muéstralas al salir.

No hacen falta para considerar el proyecto terminado.

## Estructura sugerida

Un solo archivo `game.js`. Te propongo estas funciones — no es obligatorio seguirlas al pie de la letra, pero son una buena descomposición:

```js
// Pura, sin I/O
function generateTarget(min, max) { /* ... */ }

// Pura, sin I/O. Devuelve number válido o null.
function parseGuess(input, min, max) { /* ... */ }

// Pura, sin I/O. Devuelve "high" | "low" | "match".
function compareGuess(guess, target) { /* ... */ }

// Async, hace I/O. Bucle principal.
async function playGame() { /* ... */ }

// Top-level
await playGame();
```

**Mantén las funciones puras sin I/O** (`generateTarget`, `parseGuess`, `compareGuess`): facilita razonar y, cuando lleguemos a testing, son trivialmente testeables.

## Setup

Te dejo el `package.json` ya hecho en esta carpeta (con `"type": "module"` para que Node trate `game.js` como ES Module). Solo crea `game.js` al lado y ejecuta:

```bash
node game.js
```

## Cómo arrancar

1. Lee este README entero (sí, todo) para tener el cuadro general.
2. **Antes de tocar código**, piensa la estructura: ¿qué pasa en el primer `await`? ¿qué condición sale del bucle? ¿cómo distingues "input inválido" de "input válido pero erróneo"?
3. Empieza por las funciones puras (`generateTarget`, `compareGuess`, `parseGuess`) — son cortas y las puedes probar a mano con `console.log`.
4. Después monta `playGame` con el bucle.
5. Cuando lo tengas funcionando, lo revisamos.

Si te atascas, sigue la regla de los tres intentos: pregúntame, te doy pista; si sigues atascado, otra pista; al tercero, solución.
