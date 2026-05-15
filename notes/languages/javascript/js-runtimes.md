# JavaScript runtimes

Entornos donde se ejecuta JavaScript. Cada uno aporta su propio motor + APIs propias además del lenguaje estándar.

## Navegadores

JS se ejecuta dentro del navegador con motores específicos:

- **V8**: Chrome, Edge, Brave, Opera. También el motor de Node.js.
- **SpiderMonkey**: Firefox.
- **JavaScriptCore (Nitro)**: Safari.

APIs propias del navegador: DOM, fetch, eventos, storage, web workers, WebGL, etc. (ver [[DOM]]).

## Node.js

Runtime server-side basado en V8. Estándar de facto para backend en JS / herramientas CLI / tooling de frontend.

APIs propias: `fs`, `http`, `path`, `process`, `streams`, módulos nativos. Soporta tanto **CommonJS** como **ESM** (ver [[CJS-vs-ESM]]).

Comando básico:

```bash
node script.js
```

## Deno

Runtime alternativo del creador original de Node (Ryan Dahl). Diseñado para corregir decisiones de Node:

- **Seguro por defecto**: necesitas pasar permisos explícitos (`--allow-net`, `--allow-read`, etc.).
- **TypeScript nativo**: sin compilación previa.
- **ESM-first**: sin CommonJS.
- **Standard library oficial**.

Adopción minoritaria pero creciente en 2026.

## Bun

Runtime nuevo escrito en Zig. Drop-in replacement de Node + bundler + test runner + package manager, todo en un binario.

- Muy rápido en startup y throughput.
- Compatible con la mayoría de APIs de Node.
- Gana tracción especialmente en **tooling** (scripts, builds, tests).

## Cuándo usar cada uno

- **Frontend** → navegador (obviamente).
- **Backend / CLI / tooling estándar** → Node.
- **Proyectos nuevos donde quieres TS sin config y seguridad por defecto** → Deno.
- **Velocidad de tooling / scripts** → Bun.

Para este curso usamos Node (ya instalado vía mise) salvo que un módulo diga lo contrario.

## Fuentes

- [Node.js](https://nodejs.org/)
- [Deno](https://deno.com/)
- [Bun](https://bun.sh/)
