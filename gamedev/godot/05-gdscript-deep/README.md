# Módulo 5 · GDScript a fondo

En el módulo 3 viste lo justo de GDScript para mover un nodo: `extends`,
`_ready`/`_process`, `@export`, `@onready` y `$`. Suficiente para el Pong, pero
te quedaste sin la mitad del lenguaje. Este módulo cierra ese hueco con las
piezas que vas a usar en **todos** los módulos siguientes: colecciones tipadas,
`enum`, `match`, clases propias, lambdas, `await` y grupos de nodos. No es
relleno: cuando lleguemos a física, enemigos y state machines, esto será el
vocabulario por defecto.

## Objetivos

- Tipar colecciones (`Array[T]`, `Dictionary[K, V]`) y entender qué ganas.
- Modelar estados y opciones con `enum`.
- Sustituir cadenas de `if/elif` por `match` y su pattern matching.
- Crear tipos propios con `class_name`, heredar y llamar a `super`.
- Escribir lambdas y usarlas con `map`/`filter`/`reduce`/`sort_custom`.
- Esperar a un tiempo o a una señal con `await` sin congelar el juego.
- Avisar a un conjunto de nodos por nombre con **grupos**, sin guardar referencias.

---

## 1. Tipado a fondo: arrays y diccionarios tipados

En el módulo 3 quedó la regla "típalo siempre". Eso vale también para las
colecciones, que es donde más se nota.

```gdscript
var scores: Array[int] = [10, 20, 30]          # array SOLO de enteros
var names: Array[String] = ["Ana", "Iván"]
var ages: Dictionary[String, int] = {"Ana": 30, "Iván": 28}
```

Un `Array` sin tipo (`var stuff = []`) acepta cualquier cosa mezclada. Un
`Array[int]` se niega a guardar un `String`: el error salta **en el editor o al
cargar**, no tres horas después cuando un dato basura revienta un cálculo.

**Ideas que conviene fijar:**

1. **El tipo se propaga.** Si recorres un `Array[int]` con `for n in scores:`,
   Godot ya sabe que `n` es `int` y te autocompleta sus métodos.
2. **El tipo es del array, no de la variable.** `Array[int]` y `Array[String]`
   son tipos distintos; no puedes asignar uno donde se espera el otro.
3. **Diccionario = pares clave→valor.** `Dictionary[String, int]` fija el tipo de
   las claves y el de los valores por separado.

> ⚠️ **Gotcha:** los métodos que devuelven una colección nueva (`map`, `filter`,
> que verás en la parte 5) devuelven un `Array` **sin tipar**. Si necesitas el
> resultado tipado, asígnalo a una variable tipada y Godot lo convierte, o
> constrúyelo a mano.

---

## 2. Enums: constantes con nombre

Un `enum` es un grupo de constantes enteras con nombre. En vez de andar con
"0 = quieto, 1 = corriendo, 2 = saltando" y números mágicos por el código,
les pones nombre:

```gdscript
enum State { IDLE, RUN, JUMP }   # IDLE=0, RUN=1, JUMP=2 (autonumerado)

var state: State = State.IDLE

func _ready() -> void:
    state = State.RUN
    print(state)   # imprime 1 (por dentro siguen siendo enteros)
```

Puedes fijar los valores tú si te importa el número (útil para flags o IDs):

```gdscript
enum Difficulty { EASY = 1, NORMAL = 5, HARD = 10 }
```

**Ideas que conviene fijar:**

1. **Legibilidad.** `state == State.JUMP` se lee solo; `state == 2` no dice nada.
2. **Son enteros por dentro.** Puedes guardarlos, compararlos y exportarlos
   (`@export var start_state: State`) y aparecen como desplegable en el Inspector.
3. **Pareja natural con `match`** (justo abajo) y con las state machines del
   módulo 20 ([[architecture-patterns]]).

---

## 3. `match`: pattern matching

`match` compara un valor contra varios patrones y ejecuta el primero que encaje.
Es el sustituto idiomático de las cadenas largas de `if/elif`:

```gdscript
func describe(state: State) -> String:
    match state:
        State.IDLE:
            return "quieto"
        State.RUN, State.JUMP:        # varios patrones en una rama (coma)
            return "en movimiento"
        _:                             # comodín: "cualquier otra cosa"
            return "desconocido"
```

A diferencia de un `switch` de otros lenguajes, `match` **no tiene
fall-through**: encaja una rama, la ejecuta y sale. No hay que poner `break`.

Y va más allá de comparar valores sueltos: puede **desestructurar** y **capturar**
partes con `var`:

```gdscript
func classify(point: Array) -> String:
    match point:
        [0, 0]:
            return "origen"
        [var x, 0]:
            return "sobre el eje X en %d" % x   # x queda capturada
        [var x, var y]:
            return "punto (%d, %d)" % [x, y]
        _:
            return "no es un punto 2D"
```

**Ideas que conviene fijar:**

1. **El primer patrón que encaja gana.** El orden importa: pon los específicos
   antes que los generales.
2. **`_` es el comodín.** Equivale al `else`/`default`. Ponlo al final.
3. **`var nombre` dentro de un patrón captura** ese trozo en una variable para
   usarla en la rama.

> ⚠️ **Gotcha:** sin una rama `_`, si nada encaja `match` simplemente no hace nada
> (no es error). Para estados, suele convenir un `_` que avise (`push_error(...)`)
> de un caso que olvidaste manejar.

---

## 4. Clases propias: `class_name`, herencia y `super`

Hasta ahora cada script "era" un nodo. Pero también puedes definir **tus propios
tipos** y reutilizarlos. `class_name` registra el script como un tipo global, con
nombre, disponible en todo el proyecto:

```gdscript
# enemy.gd
class_name Enemy
extends RefCounted          # RefCounted: objeto ligero, sin estar en el árbol

var hp: int
var speed: float

func _init(hp: int, speed: float) -> void:   # constructor
    self.hp = hp
    self.speed = speed

func is_alive() -> bool:
    return hp > 0
```

Desde cualquier otro script ya puedes hacer `var e := Enemy.new(100, 200.0)` y
Godot conoce el tipo `Enemy`, te autocompleta `e.hp`, `e.is_alive()`, etc.

`RefCounted` es la clase base de los objetos que **no viven en el árbol de
nodos**: ideal para datos (un enemigo como dato, un item de inventario). Se libera
de memoria solo cuando nadie lo referencia — no necesitas `free()`.

La herencia funciona como esperas, y `super` llama a la versión del padre:

```gdscript
# boss.gd
class_name Boss
extends Enemy

var phase: int = 1

func _init(hp: int, speed: float, phase: int) -> void:
    super(hp, speed)        # ejecuta el _init de Enemy
    self.phase = phase
```

**Ideas que conviene fijar:**

1. **`class_name` = tipo global.** El script aparece en los diálogos de "crear
   nodo/recurso" y puedes usarlo como tipo en `@export` e `Array[Enemy]`.
2. **`extends` elige la base.** `Node2D` si va al árbol; `RefCounted` o `Resource`
   si es un dato. Resources los verás a fondo en el módulo 16 ([[resources]]).
3. **`super(...)` reusa el constructor del padre** en vez de repetir su lógica.

> ⚠️ **Gotcha:** el archivo debe estar **guardado** para que `class_name` se
> registre. Si acabas de crear el script y otro no "ve" el tipo, guárdalo.

---

## 5. Lambdas y `Callable`: funciones de orden superior

Una **lambda** es una función sin nombre que guardas en una variable o pasas como
argumento. En GDScript son valores de tipo `Callable`:

```gdscript
var double := func(x: int) -> int:
    return x * 2

double.call(5)   # 10  →  las lambdas se invocan con .call(...)
```

Su utilidad real es alimentar los métodos de `Array` que reciben una función:

```gdscript
var nums: Array[int] = [1, 2, 3, 4, 5]

var doubled := nums.map(func(n): return n * 2)         # [2, 4, 6, 8, 10]
var evens   := nums.filter(func(n): return n % 2 == 0) # [2, 4]
var total   := nums.reduce(func(acc, n): return acc + n, 0)  # 15

# ordenar por un criterio propio:
var enemies := [Enemy.new(50, 1.0), Enemy.new(10, 1.0), Enemy.new(30, 1.0)]
enemies.sort_custom(func(a, b): return a.hp < b.hp)    # de menos a más hp
```

> ⚠️ **Gotcha importante (y trampa de entrevista cruzada con JS):** en GDScript
> las lambdas **capturan por valor**, sacando una **copia** de las variables
> locales en el momento de crear la lambda. Esto es **lo contrario** de las
> closures de JavaScript que viste en [[closures]], que capturan por referencia y
> ven los cambios posteriores. En GDScript:
>
> ```gdscript
> var factor := 2
> var f := func(n): return n * factor   # captura factor = 2 (copia)
> factor = 100
> f.call(5)   # 10, NO 500: la lambda se quedó con el 2
> ```

**Ideas que conviene fijar:**

1. **Lambda = `Callable`**, se llama con `.call(...)`.
2. **`map`/`filter`/`reduce` no mutan** el array original: devuelven uno nuevo.
3. **`sort_custom` sí ordena en sitio** y recibe una lambda `(a, b) -> bool` que
   responde "¿va `a` antes que `b`?".

---

## 6. `await` y corrutinas: esperar sin bloquear

A veces quieres "espera 1 segundo y entonces sigue" sin **congelar** el juego (un
`while` que cuenta tiempo bloquearía todo). Para eso está `await`: pausa **esta
función** y deja que el resto del juego siga corriendo; cuando llega lo esperado,
retoma justo donde estaba.

```gdscript
func spawn_wave() -> void:
    print("oleada en 3...")
    await get_tree().create_timer(1.0).timeout   # espera 1s sin bloquear
    print("2...")
    await get_tree().create_timer(1.0).timeout
    print("1...")
    await get_tree().create_timer(1.0).timeout
    print("¡ya!")
```

`await` funciona con cualquier **señal** (módulo 4, [[signals]]), no solo con
timers. Puedes esperar a que un botón se pulse o a que una animación termine:

```gdscript
await $Button.pressed       # sigue cuando el jugador pulse el botón
await $AnimationPlayer.animation_finished
```

Una función que usa `await` se convierte en una **corrutina**: por dentro Godot
la trocea en "antes" y "después" de cada espera.

**Ideas que conviene fijar:**

1. **`await` pausa solo esa función**, no el juego. El `_process` de los demás
   nodos sigue ejecutándose.
2. **Espera tiempos o señales.** `create_timer(s).timeout` para tiempo;
   `nodo.alguna_senal` para eventos.
3. **Reemplaza máquinas de `Timer` + callbacks** cuando quieres una secuencia
   lineal y legible (intro, diálogo, cuenta atrás).

> ⚠️ **Gotcha:** si llamas a una función con `await` **sin** poner `await` delante
> de la llamada, se ejecuta hasta el primer `await` y devuelve el control
> enseguida (no espera a que termine). Si quieres el resultado completo, pon
> `await spawn_wave()`.

---

## 7. Grupos de nodos: avisar a muchos sin referencias

Las señales del módulo 4 conectaban **un emisor con sus receptores**. Pero a veces
quieres hablarle a **un conjunto** de nodos que ni conoces de antemano: "todos los
enemigos, pausaos". Para eso están los **grupos**: etiquetas de texto que pones a
los nodos.

```gdscript
# cada enemigo, al entrar, se apunta al grupo:
func _ready() -> void:
    add_to_group("enemies")
```

Y desde fuera te diriges al grupo entero por su nombre, sin guardar ni una
referencia:

```gdscript
# llamar un método en todos los del grupo:
get_tree().call_group("enemies", "pause")

# o recorrerlos:
for e in get_tree().get_nodes_in_group("enemies"):
    e.modulate = Color.RED
```

**Ideas que conviene fijar:**

1. **Grupo = etiqueta.** Un nodo puede estar en varios grupos
   (`"enemies"`, `"flying"`).
2. **`call_group` difunde** una llamada a método a todo el grupo de golpe.
3. **`get_nodes_in_group` te da la lista** para recorrerla tú.

**Grupos vs señales (cuándo cada uno):**

- **Señal**: algo pasó *en mí* y quien quiera se entera (player → HUD). El receptor
  se suscribe a UN emisor concreto.
- **Grupo**: quiero actuar *sobre un conjunto* sin conocer a sus miembros (pausar
  todos los enemigos). Tú hablas al grupo por nombre.

> ⚠️ **Gotcha:** los grupos son una función de `Node`. Un objeto `RefCounted`
> (como el `Enemy`-dato de la parte 4) **no** puede estar en un grupo; solo los
> nodos del árbol. Por eso en el ejercicio los enemigos-nodo y los enemigos-dato
> son cosas distintas a propósito.

---

## Ejercicio: `gdscript_deep`

Tienes un esqueleto en `practice/05-gdscript-deep/main.gd` con todas las partes
marcadas con `TODO`. Móntalo así:

1. En `practice/`, crea la carpeta `05-gdscript-deep/`.
2. Escena: una raíz `Node2D` llamada `Main`. Adjúntale el script (o copia el
   esqueleto que te he dejado).
3. Todo el ejercicio corre en `_ready()` e imprime en la consola **Output**. No
   hace falta montar nada visual: ejecuta con **F6** y lee la salida.

### Parte 1. Colecciones tipadas

Declara un `Array[int]` con cinco números y un `Dictionary[String, int]` con tres
pares nombre→puntuación. Imprime el array y un valor del diccionario por su clave.

### Parte 2. `enum` + `match`

Define `enum State { IDLE, RUN, JUMP, DEAD }`. Escribe una función
`describe(state: State) -> String` con `match` que devuelva un texto distinto para
`IDLE`, agrupe `RUN` y `JUMP` en "en movimiento", y use `_` para el resto.
Llámala con dos estados y imprime el resultado.

### Parte 3. Clase propia con herencia

Crea una clase `Enemy` (`class_name Enemy extends RefCounted`) con `hp: int`,
`speed: float`, un `_init` y un método `is_alive() -> bool`. Crea una subclase
`Boss extends Enemy` con un campo `phase` y un `_init` que llame a `super(...)`.
Instancia uno de cada e imprime si están vivos.

> Nota: una clase `class_name` suele ir en **su propio archivo** (`enemy.gd`,
> `boss.gd`). Para este ejercicio puedes ponerlas en archivos aparte dentro de la
> carpeta del módulo.

### Parte 4. Lambdas

Con un `Array[int]` de varios números: usa `map` para duplicarlos, `filter` para
quedarte con los pares y `reduce` para sumarlos todos. Imprime los tres
resultados. Luego crea un `Array` de varios `Enemy` y ordénalo por `hp` con
`sort_custom`.

### Parte 5. `await`

Escribe una corrutina `countdown()` que imprima "3", "2", "1", "¡ya!" con **un
segundo de espera real entre cada uno** usando `await`. Llámala desde `_ready` con
`await countdown()`.

### Parte 6. Grupos

En `_ready`, crea **tres** nodos `Node2D` por código, mételos como hijos de `Main`
(`add_child`) y añádelos al grupo `"spawned"`. Después, recórrelos con
`get_nodes_in_group("spawned")` e imprime cuántos hay.

### Parte 7. Pregunta de comprensión (sin código)

En un comentario al final del archivo, responde en 1-2 frases: **¿por qué los
`Enemy` de la parte 4 no pueden estar en el grupo de la parte 6?** Apunta al
mecanismo, no al síntoma.

---

Cuando lo tengas (o si te atascas), lo revisamos juntos.
