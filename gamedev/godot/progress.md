# Bitácora — Curso Godot 4.6 (GDScript)

Progreso didáctico del curso. Una entrada por módulo cerrado. Las más recientes arriba.

Plan completo: ver `README.md`. MOC del vault: `notes/gamedev/godot/Godot.md`.

---

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
