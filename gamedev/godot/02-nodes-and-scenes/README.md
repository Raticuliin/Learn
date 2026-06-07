# Módulo 2 · Nodos y escenas

## Objetivos

- Entender qué es un **nodo** y por qué su **tipo** importa.
- Entender una **escena** como un árbol de nodos guardado.
- Interiorizar la relación **padre-hijo** y cómo cascadean las transformaciones.
- Dominar el **instanciado**: una escena reutilizada dentro de otra (el modelo de
  composición de Godot, su equivalente a "prefabs").

## Conceptos

### Nodo

La pieza mínima de Godot. Cada nodo tiene un **tipo** que le da capacidades:

- `Node` — el más básico, sin posición. Bueno para lógica/managers.
- `Node2D` — añade **transform 2D** (position, rotation, scale). Base de todo lo 2D.
- `Control` — base de la **UI** (anclas, tamaños). Lo verás en el módulo 10.
- `Node3D` — base del 3D (fuera de este curso por ahora).

El tipo de un nodo determina qué propiedades ves en el Inspector y qué puede hacer.

### Escena

Una **escena** es un árbol de nodos guardado en un `.tscn`. Dos usos, misma cosa:

- La **pantalla/nivel** completo de tu juego.
- Una **pieza reutilizable** (un jugador, una moneda, un enemigo, un botón).

El **nodo raíz** define qué "es" la escena. Si la raíz es `Node2D`, la escena es un
objeto 2D.

### Padre-hijo: las transformaciones cascadean

Los hijos se posicionan **relativos al padre**. Si mueves, rotas o escalas el padre,
todos sus hijos le siguen. El padre define el sistema de coordenadas de sus hijos.

> Esto responde a la pregunta del módulo 1: si la raíz fuera un `Label` y le colgaras
> otro `Label`, al mover el padre el hijo se movería con él, porque su posición es
> relativa a la del padre.

### Instanciar (el concepto clave)

Una escena guardada puede **instanciarse** dentro de otra. Cada instancia es una
copia independiente que parte de la escena original. Si editas la escena original,
**todas** las instancias heredan el cambio. Pero puedes sobrescribir propiedades de
una instancia concreta sin afectar a las demás.

Esto es la base de cómo se construye un juego en Godot: **escenas pequeñas y
reutilizables que compones** en escenas mayores. No hay "prefabs" aparte: una escena
ya es eso.

## Código de ejemplo

En este módulo trabajamos **desde el editor** (sin script todavía; GDScript es el
módulo 3). El "código" aquí es la estructura del árbol:

```
main.tscn
└── Main (Node2D)
    ├── Star (instancia de star.tscn)   position = (200, 150)
    ├── Star (instancia de star.tscn)   position = (400, 150)
    └── Star (instancia de star.tscn)   position = (600, 150)

star.tscn        <- escena reutilizable
└── Star (Node2D)
    └── Sprite2D (con icon.svg como textura)
```

## Ejercicio

Construye una escena reutilizable y úsala varias veces.

1. En `practice/`, crea la carpeta `02-nodes-and-scenes/`.
2. **Escena reutilizable** `star.tscn`:
   - Raíz `Node2D` (renómbrala `Star`).
   - Hijo `Sprite2D`. Asígnale una textura: arrastra `icon.svg` (el que viene con el
     proyecto) al campo *Texture* del Inspector. Si no lo tienes, vale un `Label` o
     un `ColorRect`.
   - Guarda como `02-nodes-and-scenes/star.tscn`.
3. **Escena principal del módulo** `main.tscn`:
   - Raíz `Node2D` (renómbrala `Main`).
   - **Instancia** `star.tscn` dentro **3 veces**. Para instanciar: botón derecho en
     el nodo raíz → *Instantiate Child Scene*, o arrastra `star.tscn` desde el
     FileSystem al árbol.
   - Coloca las 3 estrellas en posiciones distintas (cámbiales el `position` en el
     Inspector o muévelas en el viewport).
   - Guarda como `02-nodes-and-scenes/main.tscn`.
4. Ejecuta `main.tscn` con **F6**. Deben verse las 3 estrellas.

**Entregable**: `practice/02-nodes-and-scenes/main.tscn` muestra 3 instancias de
`star.tscn` en posiciones distintas.

**Stretch (opcional)**:
- Cambia el `scale` o el `modulate` (color) de **una** instancia. Comprueba que las
  otras no cambian (instancias independientes).
- Ahora abre `star.tscn` y cámbiale algo a la estrella original (p. ej. añade otro
  hijo, o cambia la textura). Vuelve a `main.tscn`: **todas** las instancias
  heredaron el cambio. Esa es la potencia del instanciado.
