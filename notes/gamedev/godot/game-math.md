# game-math

Mates de movimiento en Godot 2D. Casi todo lo que se mueve es aritmética de
`Vector2`. Módulo 6 del curso ([[Godot]]).

## Vector2: tres roles, un tipo

Dos floats `x, y`. El mismo tipo es **punto** (posición), **dirección** (suele ir
normalizada) o **desplazamiento** (velocidad). Lo que cambia es la interpretación.

Constantes: `Vector2.ZERO/ONE/RIGHT/LEFT/UP/DOWN`. Úsalas en vez de escribir los
números.

> ⚠️ **Y crece hacia ABAJO.** Origen arriba-izquierda. `Vector2.UP == (0, -1)`.
> Subir = restar a `y`. Fuente nº1 de signos invertidos.

## Operaciones con significado

- `b - a` = vector que va **DE a HACIA b**. El corazón de todo.
- `a + b` encadena desplazamientos; `v * k` escala (misma dirección, otra longitud).
- `position += velocity * delta` → movimiento independiente de FPS.
- `length()` módulo; `length_squared()` sin raíz (barato, conserva el orden para
  comparar distancias → usa `distance_squared_to` para "el más cercano").
- `normalized()` = dirección pura (longitud 1). **Normaliza antes de escalar** por
  velocidad, o las diagonales corren más (`(1,1)` mide ~1.41).

Atajos: `a.distance_to(b)`, `a.direction_to(b)` (= `(b-a).normalized()`).
Perseguir = `pos += direction_to(objetivo) * speed * delta`.

## Ángulos (radianes por dentro)

- `v.angle()` vector→ángulo; `Vector2.from_angle(rad)` ángulo→vector (inversas).
- `v.rotated(rad)` devuelve uno girado; `a.angle_to_point(b)` ángulo de la línea
  a→b (en Godot 4 = `(b-a).angle()`).
- `deg_to_rad()` / `rad_to_deg()` para pensar en grados.
- Convención: **`0 rad = derecha`**, positivos giran **en horario** (por la Y
  invertida). `Vector2.DOWN` tiene ángulo `+PI/2`.
- `Node2D.rotation` es un ángulo; `look_at(punto)` orienta el **eje X local** hacia
  el punto (por eso los sprites/triángulos se dibujan mirando a +X).

## move_toward vs lerp (la distinción clave)

- **`move_toward(objetivo, paso)`** — avanza un paso FIJO y **clampa**: al quedar
  menos que el paso, clava el destino y para. Existe para `float` y `Vector2`.
  Ideal para "ve aquí y para" y para acelerar/frenar lineal.
- **`lerp(a, b, t)`** — interpolación lineal, `t∈[0,1]`. Por frame con `t` pequeño
  = seguimiento suave (frena al acercarse pero **nunca clava** el destino).
- **`lerp_angle(from, to, t)`** — como lerp pero para ángulos: cruza el 0/360 por
  el **lado corto**. Para rotar usa SIEMPRE esto, no `lerp` (un lerp de 350°→10°
  daría la vuelta larga por 180°).

Paso fijo (`direction_to * speed * delta`) **oscila** alrededor del objetivo (se
pasa, vuelve, se pasa); `move_toward` no, porque recorta el último paso.

> ⚠️ **Gotcha FPS:** `lerp(a, b, 0.1)` por frame **depende de los FPS** (a más fps,
> más rápido). Forma correcta: factor dependiente de delta (`1 - exp(-decay*delta)`).
> Se retoma en [[tweens]].

## Métodos que devuelven vs mutan

`move_toward`, `normalized`, `lerp`, `rotated`, `map`, `filter`... **devuelven uno
nuevo, no mutan**. Hay que **reasignar**: `pos = pos.move_toward(...)`. Mismo patrón
que `map`/`filter` vs `sort_custom` en [[gdscript-deep]].

## Easing y transforms (vistazo)

- **Easing** = interpolación no lineal (arranca lento / frena). `ease(t, curva)`;
  el detalle, en [[tweens]] (módulo 23).
- `position` (relativa al padre) vs `global_position` (mundo). Para hablar entre
  nodos de ramas distintas → `global_position`.
- `to_local(p)` / `to_global(p)` convierten puntos entre espacios.

## Relacionado

[[gdscript-essentials]] (delta, _process) · [[gdscript-deep]] (devuelve vs muta) ·
[[tweens]] · [[physics-2d]] (siguiente uso de vectores: velocidad) · [[Godot]]
