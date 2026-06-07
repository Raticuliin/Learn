# Señales (signals)

Parte de [[Godot]]. El patrón **observer** integrado en el motor: un nodo emite
un aviso cuando le pasa algo; otros se conectan para reaccionar. El emisor **no
sabe quién escucha** → desacople.

## Las dos mitades (clave)

Una señal necesita **las dos** para hacer algo:

- **Conectar** (cable) — `senal.connect(funcion)`. Una vez, normalmente en `_ready()`.
- **Emitir** (disparo) — `senal.emit(args)`. Godot llama a todos los conectados.

> Emitir **no** llama a nada por sí solo. Sin un `connect()` previo, `emit()` grita
> al vacío. Solo declarar el `signal` (sin connect ni emit) lo deja muerto.

```gdscript
func _ready() -> void:
    milestone_reached.connect(stop)   # cable
func increment() -> void:
    milestone_reached.emit()          # disparo → ejecuta stop()
```

## Integradas vs propias

- **Integradas**: las emite el motor; tú solo conectas.
  `Button.pressed`, `Area2D.body_entered`, `Timer.timeout`.
- **Propias**: se declaran arriba del script y las emites tú. Pueden llevar datos:
  ```gdscript
  signal health_changed(new_value: int)
  health_changed.emit(health)
  ```
  El receptor recibe el dato como argumento.

## Conectar por editor vs por código

- **Código**: `$Timer.timeout.connect(_on_timer_timeout)`.
- **Editor**: panel *Node → Signals*. Muestra las señales del **nodo seleccionado**
  (para `timeout` selecciona el Timer; para una señal propia, el nodo que la
  declara). La conexión se guarda en el `.tscn` como `[connection ...]`, **no** en
  el `.gd`. Es el mismo cable. No dupliques (editor + código) o se ejecuta dos veces.

## Por qué desacoplan

Sin señales, el emisor llamaría `get_node("../HUD").update(...)` → depende de la
ruta y la API del HUD, y añadir otro receptor obliga a tocar el emisor. Con señales,
el emisor solo emite; los receptores se suscriben solos. Ver [[godot-nodes-overview]].

Relacionado: [[gdscript-essentials]] (`$` y `@onready` deciden *cuándo* hay árbol
para conectar).
