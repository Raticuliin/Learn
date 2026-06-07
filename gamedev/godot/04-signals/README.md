# Módulo 4 · Señales (signals)

Último módulo antes del Proyecto 1 (Pong).

## Objetivos

- Entender las señales como el patrón **observer** del motor.
- Conectar señales **integradas** desde el editor y desde código.
- Declarar y emitir **señales propias**.
- Entender por qué las señales **desacoplan** el código.

## Conceptos

Una **señal** la **emite** un nodo cuando le pasa algo; otros nodos se **conectan**
para reaccionar. El emisor **no sabe quién escucha** -> desacople. El jugador no
necesita conocer al HUD: emite `health_changed` y quien quiera, escucha.

### Señales integradas

Muchos nodos ya las traen:

- `Button` -> `pressed`
- `Area2D` -> `body_entered` / `body_exited`
- `Timer` -> `timeout`

### Conectar: dos formas

**A) Editor** — pestaña *Node -> Signals* (dcha). Doble clic en la señal, eliges el
método; Godot genera la función `_on_...`.

**B) Código**:

```gdscript
func _ready() -> void:
    $Timer.timeout.connect(_on_timer_timeout)

func _on_timer_timeout() -> void:
    print("¡tick!")
```

### Señales propias

```gdscript
signal health_changed(new_value: int)   # arriba del script

func take_damage(amount: int) -> void:
    health -= amount
    health_changed.emit(health)          # emitir
```

Cualquiera se conecta a `health_changed` igual que a una integrada.

## Ejercicio

Un contador por tiempo que dispara una señal propia al llegar a un hito.

1. En `practice/`, crea la carpeta `04-signals/`.
2. Escena: raíz `Node2D` (`Main`) + hijo `Label` (texto "0") + hijo `Timer`
   (Inspector: `Wait Time` = 1.0, **Autostart** activado).
3. Script en `Main`:
   - `var count: int = 0`
   - Declara `signal milestone_reached(value: int)`.
   - Conecta `Timer.timeout` a una función (elige una forma; prueba la del **editor**
     al menos una vez).
   - En esa función: incrementa `count`, actualiza `label.text` (con `str(count)`,
     porque `text` es String), y cuando `count` llegue a 5, emite
     `milestone_reached`.
   - Conecta `milestone_reached` a otra función que haga `print(...)` y pare el timer
     (`$Timer.stop()`).
4. **F6** -> el número sube cada segundo y se detiene en 5 con mensaje en consola.

**Entregable**: `practice/04-signals/main.tscn` con el contador y la señal propia
disparándose en el 5.

**Stretch**: en vez de parar, al llegar a 5 cambia el `modulate` del label y sigue
contando, emitiendo la señal en cada múltiplo de 5.
