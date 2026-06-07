# Módulo 1 · Setup y el editor

## Objetivos

- Entender la **estructura de un proyecto** Godot y los archivos clave.
- Orientarte en el **editor**: las cuatro zonas principales y para qué sirve cada una.
- Comprender el concepto de **game loop** y cómo lo expone Godot.
- Crear y ejecutar tu **primera escena** que muestre algo en pantalla.

## Conceptos

### El proyecto Godot

Un proyecto es una carpeta con un archivo `project.godot` (la raíz). Lo más
importante que vas a ver:

- `project.godot` — config del proyecto (escena principal, settings, input map...).
- `*.tscn` — **escenas** (texto, versionable en git).
- `*.gd` — **scripts** GDScript.
- `.godot/` — caché generada, **no** se versiona (va al `.gitignore`).

### Las cuatro zonas del editor

1. **Scene dock** (arriba izda) — el árbol de nodos de la escena actual.
2. **FileSystem dock** (abajo izda) — los archivos del proyecto en disco.
3. **Viewport** (centro) — el lienzo 2D/3D donde montas la escena.
4. **Inspector** (dcha) — las propiedades del nodo seleccionado.

### Game loop

Todo motor de juego ejecuta un bucle: procesa input → actualiza estado → dibuja,
muchas veces por segundo. Godot te deja "engancharte" a ese bucle desde un script
con funciones especiales (las verás a fondo en el módulo 3):

- `_ready()` — se llama una vez, cuando el nodo entra en escena.
- `_process(delta)` — se llama cada frame. `delta` = segundos desde el frame anterior.

## Ejercicio

Vas a crear el **proyecto de prácticas del curso** (`practice/`) y una primera
escena que muestre algo en pantalla. Este proyecto lo reutilizarás en todos los
módulos teóricos: una subcarpeta por módulo dentro.

1. Nuevo proyecto Godot 4.6 en `gamedev/godot/practice/` (renderer **Compatibility**
   o **Forward+**, da igual).
2. Dentro del proyecto, crea la carpeta `01-setup-and-editor/` (botón derecho en el
   FileSystem dock → New Folder).
3. Crea una escena con un nodo raíz `Node2D`.
4. Añade un hijo `Label` y escribe un texto (tu nombre, "Hola Godot", lo que sea).
5. Guarda la escena como `01-setup-and-editor/main.tscn`.
6. Con la escena abierta, ejecútala con **F6 (Run Current Scene)**. Debe verse el
   texto.

> A partir de ahora, cada módulo añade su carpeta a `practice/` y sus escenas se
> corren con **F6**, no con F5. F5 ejecuta la *escena principal* del proyecto; F6
> ejecuta la que tengas abierta, que es lo que queremos con tantas mini-demos.

**Entregable**: `practice/01-setup-and-editor/main.tscn` corre con F6 y muestra el
texto en la ventana.

**Stretch (opcional)**: añade un script al `Node2D` y mueve el `Label` cada frame
con `_process(delta)`. No pasa nada si aún no sabes la sintaxis: inténtalo y lo
revisamos.
