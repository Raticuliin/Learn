# Mapa de nodos de Godot

Parte de [[Godot]]. **Nota viva**: crece a medida que el curso introduce nodos. Una
línea por nodo, agrupados por familia, con el módulo donde se trabaja. No es para
memorizar: es referencia. ✅ = ya visto en el curso.

## Familias base

- `Node` — el más básico, sin posición. Lógica, managers, autoloads.
- `Node2D` ✅ — añade **transform 2D** (position, rotation, scale). Base de lo 2D.
- `Control` — base de la **UI** (anclas, offsets). Módulo 10.
- `Node3D` — base del 3D (fuera del curso por ahora).
- `CanvasItem` — clase padre de `Node2D` y `Control` (lo que se dibuja en 2D).

## 2D — visual

- `Sprite2D` — muestra una textura. Módulo 7 (visto de pasada en mód. 2-3).
- `AnimatedSprite2D` — sprite con animaciones por frames. Módulo 7.
- `Polygon2D` — forma poligonal rellena.
- `Label` ✅ — texto en pantalla (es un `Control`).
- `ColorRect` ✅ — rectángulo de color sólido (es un `Control`).

## 2D — física y colisiones (módulo 6)

- `CharacterBody2D` — cuerpo controlado por código (jugador). `move_and_slide()`.
- `RigidBody2D` — cuerpo simulado por el motor de física.
- `StaticBody2D` — cuerpo fijo (suelo, paredes).
- `Area2D` — detecta entradas/salidas, sin colisión física. Triggers.
- `CollisionShape2D` — la forma de colisión que acompaña a los cuerpos.

## Niveles y cámara

- `TileMapLayer` — mapas por tiles. Módulo 8.
- `Camera2D` — cámara 2D, límites, seguimiento. Módulo 9.
- `Parallax2D` — fondos con parallax. Módulo 9.

## UI (módulo 10)

- `Control` — base de toda la UI.
- Contenedores: `VBoxContainer`, `HBoxContainer`, `GridContainer`, `MarginContainer`...
- `Button`, `Panel`, `TextureRect`, `ProgressBar`...

## Audio (módulo 11)

- `AudioStreamPlayer` — reproduce sonido (sin posición).
- `AudioStreamPlayer2D` — sonido posicional 2D.

## Utilidad / lógica

- `Timer` — temporizador con señal `timeout`. (varios módulos)
- `GPUParticles2D` — partículas. Módulo 18.

> No-nodos relacionados que se ven en el curso: `Tween` (animación procedural,
> mód. 19), `Resource` (datos, mód. 12), `SceneTree` (el árbol en ejecución),
> autoloads/singletons (mód. 13).
