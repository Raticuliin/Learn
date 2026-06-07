# Proyecto 1 · Pong

Primer integrador del curso. Un Pong para dos jugadores en el mismo teclado.
**Integra los módulos 1-4**: escenas y nodos, GDScript, el game loop con `delta`,
y señales para el marcador.

> Es un **proyecto Godot independiente**: esta carpeta tendrá su propio
> `project.godot`. No se ejecuta con F6 desde `practice/`, sino abriendo este
> proyecto.

## Objetivos de aprendizaje

- Estructurar una escena de juego real (campo, palas, pelota, marcador).
- Mover nodos leyendo **input** en cada frame, con movimiento ligado a `delta`.
- Resolver **colisión simple a mano** (rebotes), sin motor de física todavía.
- Usar una **señal propia** para desacoplar el marcador del juego.

## Restricciones (a propósito)

Aún **no** has visto física (módulo 6) ni el Input Map (módulo 5). Así que:

- **Input**: usa las acciones integradas `ui_up`/`ui_down` para un jugador y teclas
  directas (`Input.is_key_pressed(KEY_W)` / `KEY_S`) para el otro. No configures
  Input Map todavía.
- **Colisión**: nada de `CharacterBody2D` ni `Area2D`. Detecta rebotes comparando
  posiciones/rectángulos tú mismo en `_process`.
- **Gráficos**: `ColorRect` o `Sprite2D` con texturas planas. No hace falta arte.

## Plan por fases

Cada fase es ejecutable: al terminarla, **corre el juego y compruébala** antes de
seguir. No pases a la siguiente con la anterior a medias.

### Fase 0 — Crear el proyecto
Crea un proyecto Godot nuevo en `projects/pong/` (carpeta de este README). Escena
principal `Main` (`Node2D`). Define una resolución de ventana fija en
*Project Settings → Display → Window* (p.ej. 640×480).

### Fase 1 — El campo (estático)
Coloca los nodos: dos palas (izquierda y derecha) y la pelota, centrados. Dos
`Label` para el marcador (uno por lado). Corre: debe verse el campo quieto.

### Fase 2 — Mover las palas
Script en cada pala. En `_process(delta)`, lee el input y mueve `position.y` con
`velocidad * delta`. **Clampa** para que no se salga por arriba/abajo. Pala
izquierda: `W`/`S`. Pala derecha: `ui_up`/`ui_down` (flechas). Corre: las dos palas
se mueven y no escapan de la pantalla.

### Fase 3 — Mover la pelota
La pelota tiene una `velocity: Vector2`. En `_process(delta)` muévela
(`position += velocity * delta`). Haz que **rebote** en los bordes superior e
inferior (invierte `velocity.y`). Corre: la pelota cruza y rebota arriba/abajo,
saliendo por los lados de momento.

### Fase 4 — Colisión con las palas
Detecta cuándo la pelota solapa una pala y invierte `velocity.x`. Pista: cada nodo
visual tiene un rectángulo; puedes comparar posiciones y tamaños, o usar
`Rect2(...).intersects(...)`. Corre: la pelota rebota en las palas.

### Fase 5 — Gol y marcador (con señal)
Cuando la pelota sale por un lado, es gol del jugador contrario. Aquí entran las
**señales**: la pelota (o el `Main`) emite `goal_scored(side)`; un trozo de código
suscrito actualiza el `Label` del marcador y **resetea** la pelota al centro con una
dirección nueva. La pelota **no** debe conocer al marcador directamente: emite y ya.
Corre: marcar gol suma en el lado correcto y la pelota vuelve al centro.

## Criterios de "terminado"

- [ ] Dos palas controlables que no se salen de la pantalla.
- [ ] Pelota que rebota en bordes y en las dos palas.
- [ ] Gol al pasar la pelota por un lado, con marcador que sube en el lado correcto.
- [ ] El marcador se actualiza vía **señal**, no llamando al Label desde la pelota.
- [ ] Movimiento ligado a `delta` (consistente a distintos FPS).

## Stretch goals (opcionales)

- La pelota **acelera** un poco con cada rebote en pala.
- El **ángulo** de rebote depende de en qué punto de la pala golpea.
- Sonido en rebote y gol (adelanta un poco el módulo 11).
- Pantalla de "gana quien llegue a N" con reinicio.

## Conceptos que integra

Módulos [[godot-editor]] (1), [[nodes-and-scenes]] (2), [[gdscript-essentials]] (3),
[[signals]] (4). Plan del curso: `../../README.md`.
