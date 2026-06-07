# Módulo 3 · GDScript esencial

## Objetivos

- Escribir y adjuntar scripts a nodos.
- Entender `extends` y la relación script-nodo.
- Usar los callbacks del game loop: `_ready()` y `_process(delta)`.
- Usar `@export`, `@onready` y el acceso a nodos con `$`.
- Entender por qué se multiplica por `delta`.

## Conceptos

GDScript es de tipado opcional, pero **típalo siempre**: mejor autocompletado y
errores en el editor. Indentación con tabs (como Python).

```gdscript
extends Node2D                # este script "es un" Node2D: hereda sus capacidades

var speed: int = 200          # variable tipada
@export var title: String = "Hola"   # @export -> editable en el Inspector
@onready var label: Label = $Label   # @onready -> se resuelve cuando el nodo está listo

func _ready() -> void:
    print("Arranco: ", title)

func _process(delta: float) -> void:
    position.x += speed * delta   # delta = segundos desde el frame anterior
```

### Las cuatro piezas

1. **`extends`** — un script siempre extiende un tipo de nodo; *se convierte en* el
   comportamiento de ese nodo. `self` es el nodo.
2. **`_ready()`** — una vez, cuando el nodo y sus hijos ya están en el árbol. Init.
3. **`_process(delta)`** — cada frame. Multiplicar por `delta` hace el movimiento
   **independiente de los FPS** (igual a 30 que a 144 fps).
4. **`$NodePath`** — acceso a hijos. `$Label` es el hijo llamado "Label".

### `@export` y `@onready`

- `@export` saca la variable al **Inspector**: configuras sin tocar código.
- `@onready` retrasa la asignación hasta que el nodo está listo. Sin esto, `$Label`
  en una `var` normal fallaría (el árbol aún no existe al construir el objeto).

## Ejercicio

Un nodo que se mueve y reacciona, para tocar las cuatro piezas.

1. En `practice/`, crea la carpeta `03-gdscript-essentials/`.
2. Escena: raíz `Node2D` (`Main`) + hijo `Label` con un texto.
3. **Adjunta un script al `Node2D`** (botón derecho → *Attach Script*, guárdalo en
   `03-gdscript-essentials/`).
4. En el script:
   - `@export var speed: float = 200.0`.
   - En `_ready()`, un `print(...)` (se ve en la consola Output al ejecutar).
   - En `_process(delta)`, mueve el `Label` en horizontal usando `speed * delta`.
     Pista: `@onready var label: Label = $Label` y modifica `label.position.x`.
5. **F6** → el label se desliza por la pantalla.

**Entregable**: `practice/03-gdscript-essentials/main.tscn` con un `Label` que se
mueve, y un `print` visible en la consola Output.

**Stretch**: que el label **rebote** en los bordes. Cuando `label.position.x` pase
de cierto valor, invierte la dirección. Pista: una variable de dirección (1 o -1)
que multiplica a `speed`.
