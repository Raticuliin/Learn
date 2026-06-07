# GDScript esencial

Parte de [[Godot]]. Lo mínimo de GDScript para dar comportamiento a los nodos.

## Script = comportamiento de un nodo

Un script siempre **`extends`** un tipo de nodo y *se convierte en* su comportamiento.
`self` es el nodo. Tipa siempre (mejor autocompletado y errores en editor).
Indentación con tabs. **No** se usan `;` al final de línea.

```gdscript
extends Node2D

@export var speed: float = 200.0     # editable en el Inspector
@onready var label: Label = $Label   # se resuelve cuando el nodo está listo

func _ready() -> void:
    print("init")

func _process(delta: float) -> void:
    label.position.x += speed * delta
```

## Callbacks del game loop

- `_ready()` — una vez, cuando el nodo y sus hijos están en el árbol. Init.
- `_process(delta)` — cada frame. `delta` = segundos desde el frame anterior.

## delta: movimiento independiente de FPS

Multiplicar por `delta` hace que el movimiento sea igual a 30 fps que a 144 fps.
Sin `delta`, a más FPS más rápido se movería todo.

## @export y @onready

- `@export` saca la variable al **Inspector**. El valor que pongas ahí se guarda en
  el nodo y **sobrescribe** el default del código. Los cambios del Inspector aplican
  en la **siguiente** ejecución (F6), no en caliente.
- `@onready` retrasa la asignación hasta que el nodo está listo. Necesario para `$`,
  porque al construir el objeto el árbol aún no existe.

## Acceso a nodos: `$`

`$Label` es el hijo llamado "Label". `$Padre/Hijo` para rutas. El patrón estándar es
cachear la referencia con `@onready var x: Tipo = $Ruta`.

## Scripts externos vs built-in

- **Externo** (`.gd`): archivo aparte, `ExtResource` en el `.tscn`. **Recomendado**:
  versionable, reutilizable.
- **Built-in**: el código se guarda **dentro** del `.tscn` (bloque `sub_resource`
  GDScript). No hay archivo en disco. Para quitarlo no sirve borrar un `.gd`: hay que
  hacer **Detach Script** en el nodo. Evítalo salvo casos muy puntuales.
