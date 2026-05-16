# Bitácora meta del repo

Solo decisiones meta del proyecto (convenciones, reorganizaciones cross-curso). **El progreso didáctico de cada curso vive en `<bucket>/<x>/progress.md`**.

Cursos activos con bitácora propia:

- [JavaScript](languages/javascript/progress.md)

Las más recientes arriba.

---

## 2026-05-16. Hoja de ruta de cursos hacia un proyecto fullstack

- **Objetivo final**: app personal con stack **Next.js + Supabase + Drizzle + Vercel** (proyecto cross-area, irá a `projects/<nombre>/` cuando se materialice).
- **Orden acordado**: JS (hasta Fase 6 + Fase 8) -> TS completo -> React **directo en TS** -> Next.js (incluye Vercel como módulos finales) -> PostgreSQL (decidir si curso completo o mini-módulo) -> Supabase (incluye Drizzle como módulos internos) -> la app.
- **Razón de React en TS desde día uno**: base de Java/Spring de Iván hace TS muy accesible; evita migración mental posterior.

## 2026-05-16. Arranque del repo

- **Plan JavaScript** diseñado: 70 módulos, 13 fases, 3 proyectos integradores. Salto previsto a React tras módulo 55.
- **Convenciones fijadas en `CLAUDE.md`**: vault reorganizado (subcarpeta por tema, MOC junto a notas atómicas); planes siempre completos; sin em-dash; Claude redacta notas del vault al cerrar módulo.
- **Modelo de bitácora**: una entrada compacta por módulo cerrado en el `progress.md` del curso; este archivo raíz solo para meta.
