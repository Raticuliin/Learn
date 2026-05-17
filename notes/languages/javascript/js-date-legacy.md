# js-date-legacy

`Date` heredado en 1995 de `java.util.Date`. Sigue siendo lo que muchas APIs (DOM, librerías sin migrar) aceptan, pero para código nuevo se prefiere [[Temporal]].

## Las cuatro trampas que importan

1. **Meses 0-indexed**. `new Date(2026, 4, 17)` es **mayo**, no abril. Herencia directa de Java.
2. **Parsing inconsistente UTC vs local**:
   - `new Date("2026-05-17")` → interpretado como **UTC**.
   - `new Date("2026/05/17")` → interpretado como **hora local**.
   El mismo string con barras vs guiones cambia la zona. Regla: parsea solo ISO 8601 con offset explícito.
3. **`toISOString()` siempre convierte a UTC**. Si tu Date está en local, perderás un día al imprimir si tu zona está al este de UTC en hora avanzada (Madrid CEST → `00:00 local` = `22:00 UTC` del día anterior).
4. **Mutable**. `setDate`/`setMonth`/... mutan la instancia. Combinado con paso por referencia, da bugs sutiles.

## Cuándo seguir usándolo

- Interop con APIs que solo aceptan `Date`.
- Trabajos triviales: `Date.now()` para timestamp en ms.

## Ver también

- [[Temporal]] — sustituto moderno, resuelve estas cuatro trampas en origen separando tipos.
