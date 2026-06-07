# Módulo 4 · Señales (signals)

Último módulo antes del Proyecto 1 (Pong).

## Objetivos

- Entender las señales como el patrón **observer** del motor.
- Distinguir las dos mitades del mecanismo: **emitir** y **conectar**.
- Conectar señales **integradas** desde el editor y desde código.
- Declarar y emitir **señales propias**.
- Entender por qué las señales **desacoplan** el código.

## El problema que resuelven

Imagina que el `Player` pierde vida y el `HUD` tiene que actualizar la barra.
La forma ingenua: que el player **busque** al HUD y lo llame.

```gdscript
# en el Player — acoplamiento fuerte (evítalo)
func take_damage(amount: int) -> void:
    health -= amount
    get_node("../HUD").update_health(health)   # el player DEPENDE del HUD
```

Esto tiene tres problemas: el player necesita saber **dónde** está el HUD (la
ruta `../HUD`), **cómo** se llama su método (`update_health`), y si mañana quieres
que el daño también dispare un sonido tienes que **volver a tocar el player**.

Las señales le dan la vuelta: el player solo **anuncia** que pasó algo, sin saber
quién escucha.

```gdscript
# en el Player — desacoplado
signal health_changed(new_value: int)

func take_damage(amount: int) -> void:
    health -= amount
    health_changed.emit(health)   # "grito" al aire: no sé quién escucha
```

El HUD (y el sistema de sonido, y lo que sea) se **suscriben** por su cuenta. El
player no cambia nunca. Eso es el **desacople**: el emisor no conoce al receptor.

## Las dos mitades: emitir y conectar

Esta es la parte que más cuesta. Una señal son **dos cosas separadas** y necesitas
**las dos** para que pase algo:

1. **Conectar** (el "cable") — `senal.connect(funcion)`. Le dices: "cuando esta
   señal suene, llama a esta función". Esto se hace **una vez**, normalmente en
   `_ready()`.
2. **Emitir** (el "disparo") — `senal.emit()`. Hace sonar la señal. Godot recorre
   todos los cables conectados y llama a esas funciones.

```gdscript
func _ready() -> void:
    milestone_reached.connect(stop)   # 1. cable: señal ──► stop()

func increment() -> void:
    ...
    milestone_reached.emit()          # 2. disparo: ejecuta stop()
```

> ⚠️ **Emitir NO llama a nada por sí solo.** `milestone_reached.emit()` no sabe nada
> de `stop()`. Solo "grita". Lo que provoca que `stop()` se ejecute es el
> `connect()` que pusiste **antes**. Si emites sin haber conectado, no pasa nada
> (gritas al vacío). Si solo declaras `signal` y no conectas ni emites, la señal
> existe pero está muerta.

Mentalmente:

```
        connect()                         emit()
señal ───────────► función          señal ──────► (Godot llama a todos
   (montas el cable, 1 vez)               los conectados, cada vez que disparas)
```

## Señales integradas

Muchos nodos ya traen señales que emite el propio motor:

- `Button` → `pressed`
- `Area2D` → `body_entered` / `body_exited`
- `Timer` → `timeout`

De estas tú **no haces `emit`** (las dispara el motor); solo te **conectas**.

## Conectar: dos formas

### A) Por código

```gdscript
func _ready() -> void:
    $Timer.timeout.connect(_on_timer_timeout)

func _on_timer_timeout() -> void:
    print("¡tick!")
```

### B) Por el editor

Panel **Node → Signals** (arriba a la derecha, junto al Inspector).

El paso que más confunde: **ese panel muestra las señales del nodo que tengas
seleccionado en el árbol.** Por eso:

- Para conectar `timeout`, selecciona el **`Timer`** (es quien la emite). Si tienes
  seleccionado `Main`, no la verás.
- Para conectar tu señal propia `milestone_reached`, selecciona el **`Main`** (es
  quien la declara). Aparece arriba del todo, bajo una sección con el nombre de tu
  script.

Luego: doble clic en la señal → eliges el nodo receptor y el método (o dejas que
Godot genere `_on_...`) → **Connect**.

Detalle clave: una conexión hecha por el editor **no se escribe en el `.gd`**, se
guarda en el `.tscn` como una línea `[connection signal="..." from="..."
to="..." method="..."]`. Es el mismo cable que `connect()`, solo que guardado en la
escena en vez de en código. Las dos formas son válidas; elige una para cada cable
(no las dupliques o se ejecutará dos veces).

## Señales propias

Se declaran arriba del script y pueden llevar **parámetros** (datos que viajan con
el aviso):

```gdscript
signal health_changed(new_value: int)   # con dato

func take_damage(amount: int) -> void:
    health -= amount
    health_changed.emit(health)          # el dato llega al receptor
```

El receptor lo recibe como argumento:

```gdscript
func _on_health_changed(new_value: int) -> void:
    bar.value = new_value
```

Si la señal no necesita transportar datos, va sin paréntesis con argumentos:
`signal milestone_reached()`.

## `$Timer` vs `@onready` (duda recurrente)

`$Timer` es un atajo de `get_node("Timer")`: busca el hijo en el árbol **en el
momento en que se ejecuta esa línea**. El "no está cargado" no depende del `$`,
depende de **cuándo** lo usas:

| Dónde usas `$Timer` | ¿Funciona? | Por qué |
|---|---|---|
| `var x = $Timer` (variable de clase) | ❌ | se ejecuta al crear el objeto, antes de que los hijos existan |
| `@onready var x = $Timer` | ✅ | `@onready` espera a que el nodo esté listo |
| dentro de `_ready()` o más tarde | ✅ | el árbol ya está montado |

Por eso `$Timer.timeout.connect(...)` **dentro de `_ready()`** funciona sin
problema: ahí el árbol ya existe. Y guardarlo en `@onready var timer` es lo mejor
si vas a usarlo varias veces.

## Ejercicio

Un contador por tiempo que dispara una señal propia al llegar a un hito.

1. En `practice/`, crea la carpeta `04-signals/`.
2. Escena: raíz `Node2D` (`Main`) + hijo `Label` (texto "0") + hijo `Timer`
   (Inspector: `Wait Time` = 1.0, **Autostart** activado).
3. Script en `Main`:
   - `var count: int = 0`
   - Declara `signal milestone_reached(value: int)`.
   - Conecta `Timer.timeout` a una función (elige una forma; prueba la del **editor**
     al menos una vez seleccionando el nodo `Timer`).
   - En esa función: incrementa `count`, actualiza `label.text` (con `str(count)`,
     porque `text` es String), y cuando `count` llegue a 5, emite
     `milestone_reached`.
   - Conecta `milestone_reached` a otra función que haga `print(...)` y pare el timer
     (`$Timer.stop()`).
4. **F6** → el número sube cada segundo y se detiene en 5 con mensaje en consola.

**Entregable**: `practice/04-signals/main.tscn` con el contador y la señal propia
disparándose en el 5.

**Stretch**: en vez de parar, al llegar a 5 cambia el `modulate` del label y sigue
contando, emitiendo la señal en cada múltiplo de 5.
