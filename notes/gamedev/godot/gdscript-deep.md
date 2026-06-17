# GDScript a fondo

Complementa [[gdscript-essentials]]. Cubre las piezas del lenguaje que se usan en todos los módulos siguientes: colecciones tipadas, `enum`, `match`, clases propias, lambdas, `await` y grupos.

---

## Colecciones tipadas

```gdscript
var scores: Array[int] = [10, 20, 30]
var ages: Dictionary[String, int] = {"Ana": 30, "Iván": 28}
```

- `Array[T]` rechaza elementos del tipo incorrecto en tiempo de carga, no en runtime tardío.
- El tipo se propaga al iterar: `for n in scores` → Godot sabe que `n` es `int`.
- `map`/`filter` devuelven `Array` sin tipar — asigna a variable tipada si lo necesitas.

---

## `enum`

```gdscript
enum State { IDLE, RUN, JUMP }   # IDLE=0, RUN=1, JUMP=2

var state: State = State.IDLE
```

- Son enteros por dentro; se pueden exportar con `@export` y aparecen como desplegable en el Inspector.
- Pareja natural con `match` y con state machines ([[architecture-patterns]]).

---

## `match`

```gdscript
match state:
    State.IDLE:
        return "quieto"
    State.RUN, State.JUMP:   # varios patrones en una rama
        return "en movimiento"
    _:                        # comodín, equivale a else
        return "desconocido"
```

- No hay fall-through (al contrario que `switch` en otros lenguajes).
- Puede desestructurar arrays y capturar partes con `var`:
  ```gdscript
  match point:
      [0, 0]: return "origen"
      [var x, 0]: return "eje X en %d" % x
  ```
- Sin rama `_`, si nada encaja no pasa nada (no es error). Añade un `_` con `push_error` para detectar casos olvidados.

---

## `class_name`, herencia y `super`

```gdscript
# enemy.gd
class_name Enemy
extends RefCounted   # dato ligero, sin árbol de escena

var hp: int
var speed: float

func _init(hp: int, speed: float) -> void:
    self.hp = hp
    self.speed = speed

func is_alive() -> bool:
    return hp > 0
```

```gdscript
# boss.gd
class_name Boss
extends Enemy

var phase: int

func _init(hp: int, speed: float, phase: int) -> void:
    super(hp, speed)
    self.phase = phase
```

- `class_name` registra el tipo globalmente; disponible en `@export` y como `Array[Enemy]`.
- `extends Node2D` si el objeto vive en el árbol; `extends RefCounted` si es un dato (sin `free()` manual — se libera solo).
- El archivo debe estar **guardado** para que el tipo se registre en el editor.

---

## Lambdas y `Callable`

```gdscript
var double := func(x: int) -> int: return x * 2
double.call(5)   # 10

var nums: Array[int] = [1, 2, 3, 4, 5]
nums.map(func(n): return n * 2)          # [2, 4, 6, 8, 10]
nums.filter(func(n): return n % 2 == 0) # [2, 4]
nums.reduce(func(acc, n): return acc + n, 0)  # 15
enemies.sort_custom(func(a, b): return a.hp < b.hp)
```

- `map`/`filter`/`reduce` no mutan el array original.
- `sort_custom` sí ordena en sitio; la lambda responde "¿va `a` antes que `b`?".
- **Captura por valor** (diferencia clave con [[closures]] de JS): la lambda copia la variable en el momento de crearse; cambios posteriores no la afectan.

---

## `await` y corrutinas

```gdscript
func countdown() -> void:
    print("3")
    await get_tree().create_timer(1.0).timeout
    print("2")
    await get_tree().create_timer(1.0).timeout
    print("1")
    await get_tree().create_timer(1.0).timeout
    print("¡ya!")
```

- `await` pausa **esta función** sin congelar el juego; el `_process` de los demás nodos sigue.
- Funciona con cualquier señal: `await $Button.pressed`, `await $AnimationPlayer.animation_finished`.
- Una función con `await` se convierte en corrutina. Llamarla sin `await` delante solo la ejecuta hasta el primer `await`.

---

## Grupos

```gdscript
# en _ready() de cada enemigo-nodo:
add_to_group("enemies")

# desde fuera, sin guardar referencias:
get_tree().call_group("enemies", "pause")
for e in get_tree().get_nodes_in_group("enemies"):
    e.modulate = Color.RED
```

- Grupo = etiqueta de texto. Un nodo puede estar en varios grupos.
- `call_group` difunde un método a todo el grupo de golpe.
- Solo los `Node` en el árbol de escena pueden estar en grupos. Un `RefCounted` (como `Enemy` como dato) **no** tiene `add_to_group`.

**Grupos vs señales:**
- **Señal**: algo ocurrió en mí, quien quiera se entera (push desde el emisor).
- **Grupo**: quiero actuar sobre un conjunto sin conocer sus miembros (pull por nombre de grupo).
