# Bitácora meta del repo

Solo decisiones meta del proyecto (convenciones, reorganizaciones cross-curso). **El progreso didáctico de cada curso vive en `<bucket>/<x>/progress.md`**.

Cursos activos con bitácora propia:

- [JavaScript](languages/javascript/progress.md)
- [Godot](gamedev/godot/progress.md)

Las más recientes arriba.

---

## 2026-06-07. Nuevo bucket canónico: `gamedev/`

- **Decisión**: se añade `gamedev/` a la lista de buckets canónicos (no estaba en
  la lista original del `CLAUDE.md`). Acordado con Iván al arrancar el curso de Godot.
- **Convención de segundo nivel**: motor con su lenguaje propio → solo el motor
  (`gamedev/godot/` para GDScript). Variante multi-lenguaje → `<motor>-<lang>`
  (`gamedev/godot-csharp/` si algún día se separa C#).
- **Curso Godot**: GDScript primero, puente a C# al final. 23 módulos, 2D +
  arquitectura + producción. Sin 3D ni multiplayer por ahora (quitados por Iván).

## 2026-05-16. Arranque del repo

- **Plan JavaScript** diseñado: 70 módulos, 13 fases, 3 proyectos integradores. Salto previsto a React tras módulo 55.
- **Convenciones fijadas en `CLAUDE.md`**: vault reorganizado (subcarpeta por tema, MOC junto a notas atómicas); planes siempre completos; sin em-dash; Claude redacta notas del vault al cerrar módulo.
- **Modelo de bitácora**: una entrada compacta por módulo cerrado en el `progress.md` del curso; este archivo raíz solo para meta.
