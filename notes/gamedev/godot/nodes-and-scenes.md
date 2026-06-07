# Nodos y escenas

Parte de [[Godot]]. El modelo mental central de cómo se construye un juego en Godot.

## Nodo

La pieza mínima. Cada nodo tiene un **tipo** que le da capacidades y propiedades:

- `Node` — básico, sin posición. Lógica, managers.
- `Node2D` — añade **transform 2D** (position, rotation, scale). Base de todo lo 2D.
- `Control` — base de la **UI** (anclas, offsets). Ver módulo de UI.
- `Node3D` — base del 3D.

El tipo determina qué ves en el Inspector y qué puede hacer el nodo.

## Escena

Un árbol de nodos guardado en un `.tscn`. Misma cosa para dos usos:

- Un **nivel/pantalla** completo.
- Una **pieza reutilizable** (jugador, moneda, enemigo, botón).

El **nodo raíz** define qué "es" la escena.

## Padre-hijo: las transformaciones cascadean

Los hijos se posicionan **relativos al padre**. Mover/rotar/escalar el padre arrastra
a todos los hijos. El padre define el sistema de coordenadas de sus hijos.

## Instanciar (concepto clave)

Una escena guardada se mete dentro de otra como **instancia**:

- Cada instancia es una **copia independiente** de la escena original.
- Editar la escena **original** propaga el cambio a **todas** las instancias.
- Puedes **sobrescribir** propiedades de una instancia concreta sin afectar al resto
  ni a la original (p. ej. cambiar `position`, `scale` o `modulate` de solo una).

En el `.tscn`, una instancia se ve como un nodo con `instance=ExtResource(...)`.

Construir un juego en Godot = **escenas pequeñas reutilizables que se componen** en
escenas mayores. No hay sistema de "prefabs" aparte: una escena ya cumple ese papel.
