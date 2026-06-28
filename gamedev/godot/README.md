# Godot 4.7 — Curso (GDScript)

Curso de desarrollo de videojuegos con **Godot 4.7** y **GDScript**, de 0 a nivel
senior/empleable. Pensado para alguien que **ya programa** (no se enseñan
fundamentos de programación) pero que **nunca ha tocado un motor de juegos**.

- **Lenguaje**: GDScript primero (dominar el motor sin fricción). Puente a **C#**
  en el último módulo.
- **Versión**: Godot 4.7 (estable; actualizado desde 4.6 el 2026-06-19). Lo
  cubierto en los módulos 1-5 no cambia. Novedades 4.7 anotadas con 🆕 en los
  módulos donde aplican.
- **Alcance**: 2D + arquitectura + producción, cubriendo las áreas del manual
  oficial que aplican a 2D (incluye navigation, assets pipeline, rendering 2D,
  i18n y editor plugins). Sin 3D ni multiplayer por ahora (bloques extra
  opcionales al final).

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
1. **Setup y el editor** (`01-setup-and-editor/`) — instalar Godot 4.7, tour del
   editor, estructura de proyecto, qué es el game loop, primera escena que corre.
2. **Nodos y escenas** (`02-nodes-and-scenes/`) — el árbol de nodos, composición
   de escenas, instanciar, escena como componente reutilizable.
3. **GDScript esencial** (`03-gdscript-essentials/`) — sintaxis, tipado estático,
   `_ready`/`_process`/`_physics_process`, `@export`, `@onready`.
4. **Señales** (`04-signals/`) — el patrón observer del motor, conectar por editor
   y por código, señales propias.

> 🎮 **Proyecto 1 — Pong** (`projects/pong/`): input, movimiento, colisión simple,
> marcador, señales. Integra los módulos 1-4.

### Bloque 2 · GDScript a fondo + Desarrollo 2D
5. **GDScript a fondo** (`05-gdscript-deep/`) — typed arrays/dictionaries, `match`,
   `class_name` y clases custom + herencia, enums, lambdas/`Callable`,
   `await`/coroutines, grupos de nodos (`add_to_group`, `call_group`).
6. **Math para juegos** (`06-game-math/`) — `Vector2` a fondo, `lerp`/`move_toward`/
   `lerp_angle`, transforms, distancias/ángulos, easing.
7. **Input** (`07-input/`) — Input Map, acciones, polling vs eventos.
   🆕 4.7: device IDs de teclado/ratón (`DEVICE_ID_KEYBOARD`, `DEVICE_ID_MOUSE`)
   y nodo `VirtualJoystick` integrado (modos Fixed/Dynamic/Following) para táctil.
8. **Física y movimiento 2D** (`08-physics-2d/`) — `CharacterBody2D`,
   `RigidBody2D`, `Area2D`, collision layers/masks. 🆕 4.7: propiedad
   `one_way_collision_direction` en `CollisionShape2D` (colisión direccional sin
   rehacer la geometría).
9. **Assets pipeline / importación** (`09-assets-import/`) — cómo importa Godot,
   settings de import, reimport, organización de assets.
10. **Sprites y animación** (`10-sprites-and-animation/`) — `AnimatedSprite2D`,
    `AnimationPlayer`, `SpriteFrames`.
11. **TileMaps y niveles** (`11-tilemaps/`) — `TileMapLayer`, tilesets, colisiones
    de tiles. 🆕 4.7: **Scene Paint mode** (tecla B) para "pintar" instancias de
    escenas (props, decoración, coleccionables) en el editor 2D.
12. **Cámara y parallax** (`12-camera-and-parallax/`) — `Camera2D`, límites,
    `Parallax2D`.
13. **Navigation / pathfinding** (`13-navigation/`) — `NavigationRegion2D`,
    `NavigationAgent2D`, `NavigationServer2D`, A*, enemigos que persiguen.
14. **UI / Control nodes** (`14-ui-control-nodes/`) — `Control`, contenedores,
    anchors, themes, HUD. 🆕 4.7: `offset_transform_*` (trasladar/rotar/escalar un
    `Control` sin pelear con el layout del contenedor).
15. **Audio** (`15-audio/`) — `AudioStreamPlayer`, buses, SFX y música.

> 🎮 **Proyecto 2 — Plataformas 2D** (`projects/platformer/`): player con física,
> tilemap, enemigos que navegan, HUD, audio. Integra los módulos 5-15.

### Bloque 3 · Arquitectura e intermedio
16. **Resources y datos** (`16-resources/`) — `Resource` personalizado, `.tres`,
    datos como assets.
17. **Autoloads / Singletons** (`17-autoloads/`) — estado global, game manager.
18. **Gestión de escenas** (`18-scene-management/`) — cambiar de escena,
    transiciones (con `await`), pausa.
19. **Save / load** (`19-save-load/`) — `FileAccess`, JSON, `user://`,
    persistencia.
20. **Patrones de arquitectura** (`20-architecture-patterns/`) — composición vs
    herencia, state machines, cómo estructurar escenas a escala.

> 🎮 **Proyecto 3 — Top-down con inventario y guardado** (`projects/dungeon/`):
> integra managers, resources y save system. Integra los módulos 16-20.

### Bloque 4 · Avanzado
21. **Shaders básicos** (`21-shaders/`) — lenguaje `.gdshader`, canvas_item
    shaders, uniforms. 🆕 4.7: `GradientTexture2D` con `FILL_CONIC` (gradientes
    cónicos estilo CSS).
22. **Partículas y VFX** (`22-particles-vfx/`) — `GPUParticles2D`, efectos.
23. **Tweens y animación procedural** (`23-tweens/`) — `create_tween`, easing.
    🆕 4.7: `Tween.tween_await()` (pausar el tween hasta que se emita una señal).
24. **Animación avanzada** (`24-animation-advanced/`) — `AnimationTree`, state
    machines de animación, blend de movimientos.
25. **Rendering 2D: luces y capas** (`25-rendering-2d/`) — `Light2D`,
    `CanvasModulate`, `CanvasLayer`, `SubViewport`. 🆕 4.7: filtrado
    nearest-neighbor por viewport (pixel-art nítido sin blur) y salida HDR.
26. **Performance y profiling** (`26-performance/`) — el profiler (Tracy/Perfetto/
    Instruments), object pooling, optimización.

### Bloque 5 · Producción
27. **Exportar y distribuir** (`27-export/`) — export templates, builds
    escritorio/web/móvil.
28. **Internacionalización (i18n)** (`28-i18n/`) — traducciones, archivos de
    localización, `tr()`, cambio de idioma en runtime.
29. **Editor plugins / `@tool`** (`29-editor-plugins/`) — scripts `@tool`,
    `EditorPlugin`, herramientas custom en el editor.
30. **Testing y debugging** (`30-testing-debugging/`) — framework GUT,
    herramientas de debug.
31. **Puente a C#** (`31-csharp-bridge/`) — setup .NET en Godot, portar conceptos
    clave, cuándo usar cada lenguaje.

> 🏆 **Proyecto final**: un juego completo que cruce varios bloques.
> Probablemente vaya a `projects/<nombre>/` en la raíz del repo (proyecto grande
> cross-área) en lugar de dentro del curso.

### Bloques extra (opcionales, fuera de alcance por ahora)
- **3D** — nodos 3D, cámaras, iluminación, importar modelos. Muchas ofertas de
  Godot son 3D; abrir como bloque extra si Iván quiere ir más allá del 2D.
- **Multiplayer / Networking** — `MultiplayerAPI`, RPCs, sincronización. Skill
  diferenciadora; bloque extra futuro.

---

## Recursos

Verificados como actuales (junio 2026):

- **Documentación oficial** — https://docs.godotengine.org/en/stable/ — la mejor
  referencia. Empieza por *Getting Started → Step by step*.
- **Step by step (oficial)** — https://docs.godotengine.org/en/stable/getting_started/step_by_step/index.html
- **GDQuest — learning paths** — https://www.gdquest.com/tutorial/godot/learning-paths/ —
  rutas curadas gratuitas, muy buenas para 2D.
- **GDScript reference** — https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/index.html
- **Navigation (módulo 13)** — https://docs.godotengine.org/en/stable/tutorials/navigation/index.html
- **Import / assets pipeline (módulo 9)** — https://docs.godotengine.org/en/stable/tutorials/assets_pipeline/index.html
- **Internationalization (módulo 28)** — https://docs.godotengine.org/en/stable/tutorials/i18n/index.html
- **Editor plugins (módulo 29)** — https://docs.godotengine.org/en/stable/tutorials/plugins/editor/index.html
- **C# en Godot (para el módulo 31)** — https://docs.godotengine.org/en/stable/tutorials/scripting/c_sharp/index.html
- **GUT (testing, módulo 30)** — https://github.com/bitwes/Gut
- **Godot Asset Library** — https://godotengine.org/asset-library/asset — assets y
  addons de la comunidad.
