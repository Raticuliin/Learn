# Módulo 6 · Math para juegos

Casi todo lo que un juego 2D hace "se mueve" es aritmética de **vectores**: un
enemigo que persigue, una bala que sale en una dirección, una cámara que sigue
suave al player, un sprite que gira para mirar al ratón. En el Pong ya tocaste
`Vector2` de refilón (`velocity`, rebote). Este módulo lo abre del todo: qué es un
vector, qué operaciones tienen sentido, cómo sacar distancias y ángulos, y las
tres funciones que vas a teclear miles de veces — `move_toward`, `lerp` y
`lerp_angle`. No son fórmulas para memorizar: son el vocabulario con el que se
describe el movimiento.

## Objetivos

- Entender qué representa un `Vector2` (los **tres** significados: punto,
  dirección, desplazamiento).
- Operar con vectores: suma, resta, escala, `length`, `normalized`.
- Sacar **distancias** (`distance_to`) y **direcciones** (`direction_to`) entre
  dos puntos.
- Manejar **ángulos**: `angle()`, `from_angle()`, `rotated()`, grados↔radianes, y
  el sistema de coordenadas de Godot (Y hacia abajo).
- Acercar valores a paso constante con `move_toward`.
- Interpolar con `lerp` y, para ángulos, con `lerp_angle` (que cruza el 360°
  bien).
- Saber qué es el **easing** y por qué un `lerp` con factor fijo depende de los
  FPS.

---

## 1. `Vector2`: qué es y qué representa

Un `Vector2` son **dos floats**, `x` e `y`. Lo importante no es la estructura,
sino que el **mismo tipo** representa tres cosas distintas según el contexto:

```gdscript
var position := Vector2(100, 50)    # un PUNTO: dónde está algo
var velocity := Vector2(0, -200)    # un DESPLAZAMIENTO: cuánto se mueve por segundo
var direction := Vector2(1, 0)      # una DIRECCIÓN: hacia dónde apunta (suele ir normalizada)
```

Godot trae constantes para los vectores más comunes, y conviene usarlas en vez de
escribir los números a mano:

```gdscript
Vector2.ZERO     # (0, 0)
Vector2.ONE      # (1, 1)
Vector2.RIGHT    # (1, 0)
Vector2.LEFT     # (-1, 0)
Vector2.UP       # (0, -1)   ← ojo: Y NEGATIVA es "arriba"
Vector2.DOWN     # (0, 1)
```

> ⚠️ **El sistema de coordenadas de Godot 2D: Y crece hacia ABAJO.** El origen
> `(0,0)` está arriba-izquierda de la pantalla. Subir es **restar** a `y`; bajar es
> **sumar**. Por eso `Vector2.UP` es `(0, -1)`. Esto choca con las mates del
> instituto (donde Y sube) y es la fuente nº1 de signos invertidos. Tenlo presente
> todo el módulo.

**Ideas que conviene fijar:**

1. **Un tipo, tres roles.** Punto, dirección y desplazamiento son todos `Vector2`;
   lo que cambia es cómo lo interpretas y qué operaciones le aplicas.
2. **Y hacia abajo.** Internalízalo ya: ahorra horas de "se mueve al revés".
3. **Usa las constantes** (`Vector2.UP`, etc.) en vez de `Vector2(0, -1)`: se lee
   mejor y no te equivocas de signo.

---

## 2. Operaciones: el álgebra que de verdad usas

Las cuatro operaciones básicas tienen un **significado físico**, no son números
por números:

```gdscript
var a := Vector2(10, 10)
var b := Vector2(40, 30)

a + b            # (50, 40)  → encadenar desplazamientos
b - a            # (30, 20)  → el vector que va DE a HACIA b (clave, recuérdalo)
a * 3            # (30, 30)  → escalar: más largo, misma dirección
a / 2            # (5, 5)
```

La resta es la operación estrella: **`destino - origen` = el vector que te lleva de
uno a otro**. De ahí sale casi todo (direcciones, distancias, perseguir).

El patrón de movimiento más común de todo el curso:

```gdscript
func _process(delta: float) -> void:
    position += velocity * delta    # nueva pos = pos + (velocidad · tiempo)
```

Multiplicar la velocidad por `delta` hace el movimiento **independiente de los
FPS** (lo viste en el módulo 3): a 60 o a 144 fps recorre lo mismo por segundo.

### Longitud y normalización

```gdscript
var v := Vector2(3, 4)

v.length()             # 5.0   → módulo del vector (teorema de Pitágoras)
v.length_squared()     # 25.0  → sin la raíz cuadrada (más barato)
v.normalized()         # (0.6, 0.8) → mismo sentido, longitud 1
```

- **`length()`** mide "cómo de largo" es: la velocidad de una bala, lo lejos que
  está algo.
- **`normalized()`** te da la **dirección pura** (longitud 1), para luego escalarla
  tú: `direction.normalized() * speed`. Si no normalizas, un vector diagonal se
  mueve más rápido que uno recto (porque `(1,1)` mide ~1.41, no 1).

> ⚡ **Optimización idiomática:** para comparar distancias ("¿el enemigo más
> cercano?") usa `length_squared()` / `distance_squared_to()`. La raíz cuadrada de
> `length()` es cara y, si solo comparas cuál es mayor, **el cuadrado conserva el
> orden**. Solo saca la raíz cuando necesites la distancia real en píxeles.

**Ideas que conviene fijar:**

1. **`b - a` apunta de `a` a `b`.** La resta es el corazón del módulo.
2. **`* delta` para todo lo que se mueve por tiempo**, no por frame.
3. **Normaliza antes de escalar** una dirección por una velocidad, o las
   diagonales irán más rápido.

---

## 3. Distancias y direcciones entre dos puntos

Lo del apartado 2 a mano (`(b - a).length()`, `(b - a).normalized()`) es tan común
que `Vector2` trae atajos:

```gdscript
var player := Vector2(100, 100)
var enemy  := Vector2(400, 300)

enemy.distance_to(player)          # píxeles entre ambos
enemy.distance_squared_to(player)  # idem sin raíz (para comparar)
enemy.direction_to(player)         # vector UNITARIO de enemy hacia player
```

`direction_to` es exactamente `(player - enemy).normalized()`, pero se lee mejor.
Con eso, un enemigo que persigue al player es una línea:

```gdscript
func _process(delta: float) -> void:
    var to_player := global_position.direction_to(player.global_position)
    global_position += to_player * speed * delta
```

**Ideas que conviene fijar:**

1. **`a.distance_to(b)`** = longitud del segmento. **`a.direction_to(b)`** =
   hacia dónde, normalizado.
2. **Perseguir = dirección · velocidad · delta**, sumado a la posición cada frame.
3. **Para "el más cercano"** recorre y compara con `distance_squared_to`.

---

## 4. Ángulos: girar y apuntar

A veces no quieres un vector, quieres un **ángulo** (en radianes): para rotar un
sprite, disparar en abanico, orientar una torreta.

```gdscript
var dir := Vector2(1, 1)

dir.angle()                    # ángulo del vector en radianes (0 = derecha)
Vector2.from_angle(PI / 2)     # vector unitario desde un ángulo → (0, 1)
dir.rotated(PI / 2)            # gira el vector 90° y devuelve uno nuevo
dir.angle_to_point(otro)       # ángulo de la línea que une dos puntos
```

Conversión grados↔radianes (Godot trabaja en **radianes** por dentro; los grados
son para humanos):

```gdscript
deg_to_rad(90)    # 1.5707...  (PI/2)
rad_to_deg(PI)    # 180.0
```

> ⚠️ **Convención de ángulos en Godot 2D:** `0` radianes apunta a la **derecha**
> (`Vector2.RIGHT`), y como **Y crece hacia abajo**, los ángulos **positivos giran
> en el sentido de las agujas del reloj** (visualmente). Por eso `Vector2.DOWN`
> tiene ángulo `+PI/2`, no `-PI/2`. Otra consecuencia del Y invertido.

La propiedad `rotation` de cualquier `Node2D` es un ángulo en radianes. Para que un
nodo "mire" a un punto tienes dos vías:

```gdscript
# 1) a pelo, con el ángulo de la dirección:
rotation = global_position.angle_to_point(target)

# 2) con el atajo de Node2D (orienta el eje X local hacia el punto):
look_at(target)
```

**Ideas que conviene fijar:**

1. **Radianes por dentro.** Usa `deg_to_rad()` cuando pienses en grados.
2. **`angle()` vector→ángulo; `from_angle()` ángulo→vector.** Son inversas.
3. **`0 rad = derecha`, positivos = horario** (por la Y hacia abajo).
4. **`rotation` de un `Node2D` es un ángulo**; `look_at(punto)` lo apunta solo.

---

## 5. `move_toward`: acercarse a paso constante

`move_toward(objetivo, paso)` mueve un valor hacia otro **una cantidad fija**, sin
pasarse. Existe para `float` y, en su versión vectorial, para `Vector2`:

```gdscript
var speed := 0.0
speed = move_toward(speed, 300.0, 10.0)   # sube de 10 en 10 hacia 300, sin rebasar

# versión Vector2: avanza en línea recta hacia un punto
global_position = global_position.move_toward(target, speed * delta)
```

La gracia: **llega y se queda**. Cuando la distancia restante es menor que el
paso, lo clava en el objetivo (no oscila ni se pasa). Ideal para aceleración/
frenado lineal y para "ve hacia aquí a velocidad constante y para al llegar".

Diferencia con el patrón `direction_to * speed * delta` del apartado 3: aquel
**nunca para solo** (sigue empujando aunque ya esté encima, y puede vibrar al
sobrepasar). `move_toward` **se detiene exacto** en el destino.

**Ideas que conviene fijar:**

1. **Paso constante y tope.** Avanza `paso` cada vez y no rebasa el objetivo.
2. **Para velocidades** (`float`) y **para posiciones** (`Vector2`).
3. **Escala el paso por `delta`** cuando lo uses por frame.

---

## 6. `lerp` y `lerp_angle`: interpolación

**Interpolar** (lerp = *linear interpolation*) es "dame el punto que está a una
fracción `t` del camino entre A y B":

```gdscript
lerp(0.0, 100.0, 0.5)        # 50.0  → mitad de camino
lerp(0.0, 100.0, 0.0)        # 0.0   → A
lerp(0.0, 100.0, 1.0)        # 100.0 → B

var a := Vector2(0, 0)
var b := Vector2(100, 0)
a.lerp(b, 0.25)              # (25, 0) → un cuarto del camino
```

El factor `t` va de **0 (en A) a 1 (en B)**. Usado por frame con un `t` pequeño y
constante, da el clásico "seguimiento suave" (la cámara que persigue al player con
inercia):

```gdscript
func _process(delta: float) -> void:
    # cada frame recorre un 10% de lo que falta → se acerca rápido y frena suave
    global_position = global_position.lerp(target, 0.1)
```

Para **ángulos** hay una versión especial, `lerp_angle`, y la necesitas de verdad:

```gdscript
rotation = lerp_angle(rotation, target_angle, 0.1)
```

> ⚠️ **Por qué `lerp_angle` y no `lerp` con ángulos:** un `lerp` normal entre 350°
> y 10° pasaría por 180° (recorre 340° "por el lado largo"). `lerp_angle` sabe que
> los ángulos son circulares y va por el camino corto (20°, cruzando el 0). Para
> rotar usa **siempre** `lerp_angle`.

> ⚠️ **Gotcha de FPS (importante):** `lerp(a, b, 0.1)` por frame **depende de los
> FPS**: a 144 fps interpola más veces por segundo que a 30, así que va más rápido.
> Para el curso lo dejamos en su forma simple, pero la versión correcta multiplica
> el factor por algo dependiente de `delta` (p.ej.
> `1.0 - exp(-decay * delta)`). Apúntalo: lo retomamos en tweens (módulo 23).

**Ideas que conviene fijar:**

1. **`lerp(a, b, t)`**: `t=0`→a, `t=1`→b, en medio mezcla lineal.
2. **`lerp` por frame con `t` pequeño** = seguimiento suave (frena solo al acercarse).
3. **Ángulos → `lerp_angle`**, que cruza el 0/360 por el lado corto.

---

## 7. Easing y transforms (vistazo)

**Easing** es interpolar **no lineal**: en vez de avanzar a ritmo constante,
arrancar despacio y acelerar, o entrar rápido y frenar. Da vida a los movimientos
(un menú que "asienta", un golpe que "rebota"). La función `ease()` y, sobre todo,
los **Tweens** del módulo 23 son la herramienta; aquí solo nombramos la idea:

```gdscript
ease(t, 2.0)   # t en [0,1], curva > 1 = arranca lento; < 1 = arranca rápido
```

Sobre **transforms**, dos cosas que ya te sirven (lo demás, en UI y cámara):

- **`position` vs `global_position`**: `position` es relativa al **padre**;
  `global_position` es en coordenadas de **mundo**. Para perseguir entre nodos de
  ramas distintas, usa `global_position`.
- **`to_local(p)` / `to_global(p)`**: convierten un punto entre el espacio del nodo
  y el del mundo. Útiles cuando lo local y lo global no coinciden (nodo rotado o
  movido).

**Ideas que conviene fijar:**

1. **Easing = interpolación con curva**; el detalle, en tweens (módulo 23).
2. **`global_position` para hablar entre nodos** de ramas distintas.

---

## Ejercicio: `game_math` (¡visual!)

Este módulo se ve mejor en movimiento. Vas a hacer un **"chaser"**: un nodo que
persigue al ratón y gira para mirarlo. Lo montas en dos archivos: una primera parte
de consola (para fijar las operaciones) y una segunda visual (para verlas).

Móntalo así:

1. En `practice/`, crea la carpeta `06-game-math/`.
2. Escena: raíz `Node2D` llamada `Main`. Añádele un hijo (un `Sprite2D` con el icono
   `icon.svg`, o un `Polygon2D` triangular si quieres ver bien la rotación) llamado
   `Chaser`. Adjunta el script del ejercicio a `Main` (o a `Chaser`, tú eliges).
3. Ejecuta con **F6**.

### Parte 1. Vectores a mano (consola, en `_ready`)

Declara `var a := Vector2(10, 10)` y `var b := Vector2(40, 50)`. Imprime:
- el vector que va **de `a` a `b`**,
- su **longitud** (la distancia entre ambos),
- su **dirección normalizada**,
- comprueba que `a.distance_to(b)` y `a.direction_to(b)` dan lo mismo que lo que
  calculaste a mano con la resta.

### Parte 2. Ángulos (consola)

Con el vector dirección de la parte 1: imprime su **ángulo en grados** (usa
`rad_to_deg`). Luego reconstruye un vector unitario desde ese ángulo con
`Vector2.from_angle` y comprueba que coincide con la dirección normalizada.

### Parte 3. El chaser persigue (visual, en `_process`)

Haz que `Chaser` se mueva hacia la posición del ratón cada frame. La posición del
ratón la tienes con `get_global_mouse_position()`. Usa una velocidad en píxeles/s
(p.ej. `var speed := 300.0`) y muévelo con **`move_toward`** (versión `Vector2`),
escalando el paso por `delta`. Mueve el ratón por la ventana y mira cómo lo sigue y
**se para** al llegar.

### Parte 4. El chaser mira (visual)

Haz que `Chaser` **gire para mirar al ratón**. Primero a pelo, con un ángulo
(`angle_to_point` o `look_at`). Si usaste el triángulo, verás la punta apuntar al
cursor.

### Parte 5. Suavizado

Cambia la rotación instantánea de la parte 4 por una **suave** con `lerp_angle`
(factor pequeño, ~0.1). Observa cómo el chaser gira con inercia en vez de saltar.
Stretch: suaviza también la **posición** con `lerp` en vez de `move_toward` y nota
la diferencia (lerp frena al acercarse pero nunca clava el destino del todo).

### Parte 6. Pregunta de comprensión (sin código)

En un comentario al final, responde en 1-2 frases: **¿por qué para rotar usamos
`lerp_angle` y no `lerp`?** Y: **si en la parte 3 hubieras usado
`direction_to(raton) * speed * delta` en vez de `move_toward`, ¿qué pasaría cuando
el chaser llega justo encima del ratón?**

---

Cuando lo tengas (o si te atascas), lo revisamos juntos. Si prefieres que te deje
un esqueleto con los `TODO` marcados como en el módulo 5, dímelo.
