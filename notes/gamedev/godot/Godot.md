# Godot

MOC del curso de **Godot 4.6 (GDScript)**. Índice del plan; cada `[[wikilink]]`
apunta a una nota atómica que se irá creando al cerrar cada módulo.

Curso en disco: `gamedev/godot/`. Lenguaje: GDScript (puente a C# al final).
Alcance: 2D + arquitectura + producción (sin 3D ni multiplayer por ahora).

Referencia viva: [[godot-nodes-overview]] — mapa de nodos que crece con el curso.

## Bloque 1 · Fundamentos del motor
1. [[godot-editor]] — setup y el editor, game loop, primera escena
2. [[nodes-and-scenes]] — árbol de nodos, escenas, instanciar
3. [[gdscript-essentials]] — sintaxis, tipado, ciclos `_ready`/`_process`
4. [[signals]] — patrón observer del motor

## Bloque 2 · Desarrollo 2D
5. [[input-handling]] — Input Map, acciones, eventos
6. [[physics-2d]] — CharacterBody2D, RigidBody2D, Area2D, layers/masks
7. [[sprites-and-animation]] — AnimatedSprite2D, AnimationPlayer
8. [[tilemaps]] — TileMapLayer, tilesets, colisiones
9. [[camera-and-parallax]] — Camera2D, parallax
10. [[ui-control-nodes]] — Control, contenedores, themes, HUD
11. [[audio]] — AudioStreamPlayer, buses

## Bloque 3 · Arquitectura e intermedio
12. [[resources]] — Resource personalizado, datos como assets
13. [[autoloads]] — singletons, estado global
14. [[scene-management]] — cambiar escenas, pausa, transiciones
15. [[save-load]] — FileAccess, JSON, user://
16. [[architecture-patterns]] — composición vs herencia, state machines

## Bloque 4 · Avanzado
17. [[shaders]] — .gdshader, canvas_item, uniforms
18. [[particles-vfx]] — GPUParticles2D
19. [[tweens]] — create_tween, easing
20. [[performance]] — profiling, object pooling

## Bloque 5 · Producción
21. [[exporting]] — export templates, builds
22. [[testing-debugging]] — GUT, debug tools
23. [[csharp-in-godot]] — puente a C#

## Proyectos
- Pong (tras módulo 4) ✓
- Plataformas 2D (tras módulo 11)
- Top-down con inventario y guardado (tras módulo 16)
- Proyecto final (cross-área)
