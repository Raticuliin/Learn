# El editor de Godot

Parte de [[Godot]]. Lo básico para orientarse en el editor y el proyecto.

## Anatomía del proyecto

Un proyecto Godot es una **carpeta** con un archivo `project.godot` en la raíz. No
es un archivo suelto. Lo relevante:

- `project.godot` — config del proyecto (escena principal, settings, input map...).
- `*.tscn` — escenas, en texto (versionables en git).
- `*.gd` — scripts GDScript.
- `.godot/` — caché generada por el motor. **No** va a git (`.gitignore`).

## Las 4 zonas del editor

1. **Scene** (arriba izda) — el árbol de nodos de la escena actual.
2. **FileSystem** (abajo izda) — los archivos del proyecto en disco.
3. **Viewport** (centro) — el lienzo donde montas la escena.
4. **Inspector** (dcha) — las propiedades del nodo seleccionado.

## Ejecutar: F5 vs F6

- **F5 — Run Main Scene**: lanza la escena marcada como *principal* del proyecto
  (la que arranca el juego de verdad).
- **F6 — Run Current Scene**: lanza la escena **abierta** en el editor.

En un proyecto con muchas mini-demos (como `practice/`, una por módulo) usamos
**F6** para probar la escena en la que trabajamos. Un juego real define una Main
Scene y se lanza con F5.

## Game loop (intro)

El motor repite "input -> actualizar -> dibujar" muchas veces por segundo. Desde un
script te enganchas con `_ready()` (una vez al entrar en escena) y `_process(delta)`
(cada frame). A fondo en [[gdscript-essentials]].
