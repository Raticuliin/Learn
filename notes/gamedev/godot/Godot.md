# Godot

MOC del curso de **Godot 4.7 (GDScript)**. Índice del plan; cada `[[wikilink]]`
apunta a una nota atómica que se irá creando al cerrar cada módulo.

Curso en disco: `gamedev/godot/`. Lenguaje: GDScript (puente a C# al final).
Alcance: 2D + arquitectura + producción (sin 3D ni multiplayer por ahora).

Referencia viva: [[godot-nodes-overview]] — mapa de nodos que crece con el curso.

## Bloque 1 · Fundamentos del motor
1. [[godot-editor]] — setup y el editor, game loop, primera escena
2. [[nodes-and-scenes]] — árbol de nodos, escenas, instanciar
3. [[gdscript-essentials]] — sintaxis, tipado, ciclos `_ready`/`_process`
4. [[signals]] — patrón observer del motor

## Bloque 2 · GDScript a fondo + Desarrollo 2D
5. [[gdscript-deep]] — typed collections, match, class_name, lambdas, await, grupos
6. [[game-math]] — Vector2, lerp, move_toward, transforms, easing
7. [[input-handling]] — Input Map, acciones, eventos
8. [[physics-2d]] — CharacterBody2D, RigidBody2D, Area2D, layers/masks
9. [[assets-import]] — pipeline de importación, settings, reimport
10. [[sprites-and-animation]] — AnimatedSprite2D, AnimationPlayer
11. [[tilemaps]] — TileMapLayer, tilesets, colisiones
12. [[camera-and-parallax]] — Camera2D, parallax
13. [[navigation]] — NavigationAgent2D, NavigationServer2D, A*
14. [[ui-control-nodes]] — Control, contenedores, themes, HUD
15. [[audio]] — AudioStreamPlayer, buses

## Bloque 3 · Arquitectura e intermedio
16. [[resources]] — Resource personalizado, datos como assets
17. [[autoloads]] — singletons, estado global
18. [[scene-management]] — cambiar escenas, transiciones (await), pausa
19. [[save-load]] — FileAccess, JSON, user://
20. [[architecture-patterns]] — composición vs herencia, state machines

## Bloque 4 · Avanzado
21. [[shaders]] — .gdshader, canvas_item, uniforms
22. [[particles-vfx]] — GPUParticles2D
23. [[tweens]] — create_tween, easing
24. [[animation-advanced]] — AnimationTree, state machines de animación, blend
25. [[rendering-2d]] — Light2D, CanvasModulate, CanvasLayer, SubViewport
26. [[performance]] — profiling, object pooling

## Bloque 5 · Producción
27. [[exporting]] — export templates, builds
28. [[i18n]] — traducciones, localización, tr()
29. [[editor-plugins]] — scripts @tool, EditorPlugin, herramientas custom
30. [[testing-debugging]] — GUT, debug tools
31. [[csharp-in-godot]] — puente a C#

## Bloques extra (opcionales)
- 3D — nodos 3D, cámaras, iluminación, importar modelos
- Multiplayer — MultiplayerAPI, RPCs, sincronización

## Proyectos
- Pong (tras módulo 4) ✓
- Plataformas 2D (tras módulo 15)
- Top-down con inventario y guardado (tras módulo 20)
- Proyecto final (cross-área)
