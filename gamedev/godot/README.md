# Godot 4.6 — Curso (GDScript)

Curso de desarrollo de videojuegos con **Godot 4.6** y **GDScript**, de 0 a nivel
senior/empleable. Pensado para alguien que **ya programa** (no se enseñan
fundamentos de programación) pero que **nunca ha tocado un motor de juegos**.

- **Lenguaje**: GDScript primero (dominar el motor sin fricción). Puente a **C#**
  en el último módulo.
- **Versión**: Godot 4.6 (estable desde enero 2026).
- **Alcance**: 2D + arquitectura + producción. Sin 3D ni multiplayer por ahora
  (se pueden añadir más adelante como bloque extra).

Cada módulo vive en su carpeta `NN-concepto/` con su propio `README.md`
(objetivos, explicación, código de ejemplo, enunciado del ejercicio).

---

## Cómo está organizado (importante)

Godot es **project-centric**: un proyecto es una carpeta con `project.godot`, no un
archivo suelto. Por eso **no** hay un proyecto Godot por módulo. Separamos teoría y
práctica:

```
gamedev/godot/
├── README.md                       # este plan
├── 01-setup-and-editor/README.md   # teoría + enunciado (solo markdown)
├── 02-nodes-and-scenes/README.md
├── ...
├── practice/                       # UN proyecto Godot para todos los módulos teóricos
│   ├── project.godot
│   ├── 01-setup-and-editor/        # escenas y scripts del módulo
│   ├── 02-nodes-and-scenes/
│   └── ...
└── projects/                       # cada integrador = su propio proyecto Godot
    ├── pong/
    ├── platformer/
    └── dungeon/
```

- Las carpetas `NN-concepto/` son **material didáctico** (markdown). No son proyectos.
- Los **ejercicios** de los módulos van a `practice/NN-concepto/`. Cada mini-demo se
  ejecuta con **F6 (Run Current Scene)**, no F5. El proyecto `practice/` se monta una
  sola vez (es el ejercicio del módulo 1).
- Los **proyectos integradores** son proyectos Godot independientes en `projects/`.

---

## Plan del curso

### Bloque 1 · Fundamentos del motor
1. **Setup y el editor** (`01-setup-and-editor/`) — instalar Godot 4.6, tour del
   editor, estructura de proyecto, qué es el game loop, primera escena que corre.
2. **Nodos y escenas** (`02-nodes-and-scenes/`) — el árbol de nodos, composición
   de escenas, instanciar, escena como componente reutilizable.
3. **GDScript esencial** (`03-gdscript-essentials/`) — sintaxis, tipado estático,
   `_ready`/`_process`/`_physics_process`, `@export`, `@onready`.
4. **Señales** (`04-signals/`) — el patrón observer del motor, conectar por editor
   y por código, señales propias.

> 🎮 **Proyecto 1 — Pong** (`projects/pong/`): input, movimiento, colisión simple,
> marcador, señales. Integra los módulos 1-4.

### Bloque 2 · Desarrollo 2D
5. **Input** (`05-input/`) — Input Map, acciones, polling vs eventos.
6. **Física y movimiento 2D** (`06-physics-2d/`) — `CharacterBody2D`,
   `RigidBody2D`, `Area2D`, collision layers/masks.
7. **Sprites y animación** (`07-sprites-and-animation/`) — `AnimatedSprite2D`,
   `AnimationPlayer`, `SpriteFrames`.
8. **TileMaps y niveles** (`08-tilemaps/`) — `TileMapLayer`, tilesets, colisiones
   de tiles.
9. **Cámara y parallax** (`09-camera-and-parallax/`) — `Camera2D`, límites,
   `Parallax2D`.
10. **UI / Control nodes** (`10-ui-control-nodes/`) — `Control`, contenedores,
    anchors, themes, HUD.
11. **Audio** (`11-audio/`) — `AudioStreamPlayer`, buses, SFX y música.

> 🎮 **Proyecto 2 — Plataformas 2D** (`projects/platformer/`): player con física,
> tilemap, enemigos, HUD, audio. Integra los módulos 5-11.

### Bloque 3 · Arquitectura e intermedio
12. **Resources y datos** (`12-resources/`) — `Resource` personalizado, `.tres`,
    datos como assets.
13. **Autoloads / Singletons** (`13-autoloads/`) — estado global, game manager.
14. **Gestión de escenas** (`14-scene-management/`) — cambiar de escena,
    transiciones, pausa.
15. **Save / load** (`15-save-load/`) — `FileAccess`, JSON, `user://`,
    persistencia.
16. **Patrones de arquitectura** (`16-architecture-patterns/`) — composición vs
    herencia, state machines, cómo estructurar escenas a escala.

> 🎮 **Proyecto 3 — Top-down con inventario y guardado** (`projects/dungeon/`):
> integra managers, resources y save system. Integra los módulos 12-16.

### Bloque 4 · Avanzado
17. **Shaders básicos** (`17-shaders/`) — lenguaje `.gdshader`, canvas_item
    shaders, uniforms.
18. **Partículas y VFX** (`18-particles-vfx/`) — `GPUParticles2D`, efectos.
19. **Tweens y animación procedural** (`19-tweens/`) — `create_tween`, easing.
20. **Performance y profiling** (`20-performance/`) — el profiler (Tracy/Perfetto/
    Instruments), object pooling, optimización.

### Bloque 5 · Producción
21. **Exportar y distribuir** (`21-export/`) — export templates, builds
    escritorio/web/móvil.
22. **Testing y debugging** (`22-testing-debugging/`) — framework GUT,
    herramientas de debug.
23. **Puente a C#** (`23-csharp-bridge/`) — setup .NET en Godot, portar conceptos
    clave, cuándo usar cada lenguaje.

> 🏆 **Proyecto final**: un juego completo que cruce varios bloques.
> Probablemente vaya a `projects/<nombre>/` en la raíz del repo (proyecto grande
> cross-área) en lugar de dentro del curso.

---

## Recursos

Verificados como actuales (junio 2026):

- **Documentación oficial** — https://docs.godotengine.org/en/stable/ — la mejor
  referencia. Empieza por *Getting Started → Step by step*.
- **Step by step (oficial)** — https://docs.godotengine.org/en/stable/getting_started/step_by_step/index.html
- **GDQuest — learning paths** — https://www.gdquest.com/tutorial/godot/learning-paths/ —
  rutas curadas gratuitas, muy buenas para 2D.
- **GDScript reference** — https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/index.html
- **C# en Godot (para el módulo 23)** — https://docs.godotengine.org/en/stable/tutorials/scripting/c_sharp/index.html
- **GUT (testing, módulo 22)** — https://github.com/bitwes/Gut
- **Godot Asset Library** — https://godotengine.org/asset-library/asset — assets y
  addons de la comunidad.
