# Bitácora — Curso Godot 4.6 (GDScript)

Progreso didáctico del curso. Una entrada por módulo cerrado. Las más recientes arriba.

Plan completo: ver `README.md`. MOC del vault: `notes/gamedev/godot/Godot.md`.

---

## 2026-06-07. Proyecto 1: Pong

- **Cubierto**: integrador de módulos 1-4. Pong 2 jugadores: input por `@export var key: Key` configurado por instancia, pelota `velocity: Vector2` con rebote, colisión pala-pelota con `Rect2.intersects` (recalculado cada frame + check de dirección anti-sticky), marcador vía señal propia `score(player)` conectada por **editor**. Todos los criterios del brief ok.
- **Notas vault**: refuerza [[signals]], [[gdscript-essentials]].
- **Peleado**: `scale` no afecta a `.size` (usar `size` en colisiones); una `var` de clase se inicializa antes de que exista el árbol (mismo caso de `@onready`); `intersects` es de `Rect2`, no del nodo. Ajustes de geometría (size/scale) en los `.tscn` los hizo el tutor.
- **Pendiente (opcional)**: pulido (código muerto en `main.gd`, duplicación del reset, `;`/paréntesis sobrantes) y bug menor: el reset no invierte `velocity`, la pelota sale siempre hacia el mismo lado. Stretch no hechos.
- **Siguiente**: Módulo 5, Input.

## 2026-06-07. Módulo 4: Señales

- **Cubierto**: señales como observer del motor; las dos mitades (`connect` = cable, `emit` = disparo, y que emitir no llama a nada sin conexión previa); señales integradas (`Timer.timeout`) y propias (`signal milestone_reached`); conectar por código y por editor. Ejercicio `practice/04-signals/` ok (contador que para en 5 vía señal propia).
- **Notas vault**: [[signals]].
- **Aclarado**: `$Timer` vs `@onready` (el "no cargado" depende de *cuándo* usas `$`, no del `$`); README del módulo reescrito con más profundidad a petición de Iván.
- **Pendiente**: probó solo la conexión por código; la del editor queda pendiente de tocar en el Pong. Stretch (múltiplos de 5 + modulate) no hecho.
- **Siguiente**: Proyecto 1, Pong (integra módulos 1-4).

## 2026-06-07. Módulo 3: GDScript esencial

- **Cubierto**: `extends`, `_ready`/`_process(delta)`, `@export`, `@onready`, acceso con `$`, movimiento independiente de FPS con `delta`. Ejercicio `practice/03-gdscript-essentials/` ok (Label que se mueve, `print` en `_ready`, `speed` por Inspector).
- **Notas vault**: [[gdscript-essentials]]. Creada nota-mapa viva [[godot-nodes-overview]] (enlazada desde el MOC).
- **Bug aprendido**: tenía un 2º script *built-in* en el `Label` (guardado dentro del `.tscn`, no en `.gd`) que también lo movía -> borrar el `.gd` no lo quitaba; se resuelve con Detach Script. Moraleja: usar scripts externos.
- **Pendiente**: nada.
- **Siguiente**: Módulo 4, Señales.

## 2026-06-07. Módulo 2: Nodos y escenas

- **Cubierto**: nodo y su tipo, escena como árbol guardado, padre-hijo (transforms cascadean), instanciado como modelo de composición. Ejercicio `practice/02-nodes-and-scenes/main.tscn` ok: 3 instancias de `star.tscn`, una con `scale` sobrescrito (stretch de override de instancia hecho).
- **Notas vault**: [[nodes-and-scenes]].
- **Pendiente**: nada. (Usó `ColorRect` (Control) bajo `Node2D`; funciona, matiz Control vs Node2D se ve en módulo 10.)
- **Siguiente**: Módulo 3, GDScript esencial.

## 2026-06-07. Módulo 1: Setup y el editor

- **Cubierto**: anatomía del proyecto Godot, las 4 zonas del editor, intro al game loop, F5 vs F6. Montado el proyecto de prácticas `practice/`. Ejercicio `practice/01-setup-and-editor/main.tscn` ok (Node2D + Label corriendo con F6).
- **Notas vault**: [[godot-editor]].
- **Decisión de estructura**: teoría en `NN-concepto/README.md`; ejercicios en un único proyecto `practice/` (subcarpeta por módulo, se corre con F6); integradores como proyectos Godot propios en `projects/`. `.godot/` ignorado globalmente en el `.gitignore` raíz.
- **Pendiente**: nada (la pregunta padre-hijo se resuelve en el módulo 2).
- **Siguiente**: Módulo 2, Nodos y escenas.
