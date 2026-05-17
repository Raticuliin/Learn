# Módulo 14 — Fechas: `Date` y la Temporal API

## Objetivos

- Saber qué hace el `Date` legacy, sus tres trampas clásicas, y cuándo aún tiene sentido.
- Manejar la **Temporal API**: tipos separados (fecha, fecha+hora, fecha+hora+zona, duración, instante), inmutabilidad, aritmética.
- Hacer las operaciones cotidianas: crear, parsear, formatear, sumar/restar, diferencia entre dos fechas, comparar.

## Por qué importa

El manejo de fechas es una de las áreas con más bugs en producción. La razón fue durante años el propio `Date` de JavaScript: heredado en 1995 de `java.util.Date`, con un diseño confuso y mutable. Eso llevó a librerías masivas como Moment.js (ya en desuso) y luego date-fns / Luxon. En 2026 por fin tenemos una solución nativa decente, **Temporal**, recién finalizada en ES2026.

## Cómo lo vamos a ejecutar

Temporal es nativo en Node 26+. En tu Node 24, está disponible tras un flag:

```bash
node --harmony-temporal dates.js
```

Si más adelante migras a Node 26 LTS (octubre 2026), bastará `node dates.js` sin más.

---

## Parte 1. `Date` legacy

Una clase única para representar un **instante** (milisegundos desde la época Unix, 1970-01-01 UTC).

### Crear

```js
new Date();                          // ahora
new Date("2026-05-17T10:30:00Z");    // desde ISO 8601 (UTC explícito)
new Date(2026, 4, 17);               // año, MES-1, día (ojo: mayo = 4)
Date.now();                          // ms desde la época como número
```

### Las tres trampas clásicas

1. **Meses 0-indexed**: `new Date(2026, 4, 17)` es **mayo**, no abril. Es la herencia de Java. Causa bugs sutiles cada año.
2. **Parsing inconsistente**: `new Date("2026-05-17")` se interpreta como UTC. `new Date("2026/05/17")` se interpreta como hora local. Distintos motores históricamente se comportaban distinto con formatos no-ISO. **Regla**: parsea solo ISO 8601 (`YYYY-MM-DDTHH:mm:ssZ`).
3. **Mutable**: los `set*` mutan la instancia, no devuelven una nueva.

```js
const d = new Date("2026-05-17T00:00:00Z");
d.setDate(d.getDate() + 1); // muta `d`
// d ahora es 2026-05-18
```

Por eso surgieron las librerías inmutables. Y por eso Temporal.

### Cuándo seguir usando `Date`

- Interop con APIs que solo aceptan `Date` (algunas viejas del DOM, librerías sin migrar).
- Trabajos triviales y aislados ("dame el timestamp actual" → `Date.now()`).

Para todo lo demás: **Temporal**.

---

## Parte 2. Temporal — la idea principal

Temporal separa lo que `Date` mezclaba en un solo tipo. Los más usados:

| Tipo                  | Qué representa                                          | Ejemplo                                    |
| --------------------- | ------------------------------------------------------- | ------------------------------------------ |
| `Temporal.PlainDate`  | Fecha de calendario, sin hora, sin zona                 | "2026-05-17"                               |
| `Temporal.PlainTime`  | Hora del día, sin fecha, sin zona                       | "14:30:00"                                 |
| `Temporal.PlainDateTime` | Fecha + hora, sin zona                               | "2026-05-17T14:30:00"                      |
| `Temporal.ZonedDateTime` | Fecha + hora + zona horaria                          | "2026-05-17T14:30:00+02:00[Europe/Madrid]" |
| `Temporal.Duration`   | Cantidad de tiempo (5 días, 3 horas...)                 | "P5DT3H"                                   |
| `Temporal.Instant`    | Punto exacto en el tiempo (UTC, equivalente a un Unix ts) | "2026-05-17T12:30:00Z"                     |

Tres principios:

1. **Inmutable**. Toda operación devuelve un objeto nuevo. Olvida `setX`.
2. **Tipos separados**. Una fecha de cumpleaños es `PlainDate` (no tiene hora ni zona). Un evento programado es `ZonedDateTime`. Una duración es `Duration`. No los mezclas accidentalmente.
3. **Calendarios y zonas explícitos**. Cuando importan, los pones; cuando no, los omites.

### Crear

```js
Temporal.Now.plainDateISO();              // hoy: 2026-05-17
Temporal.Now.zonedDateTimeISO();          // ahora con tu zona local

Temporal.PlainDate.from("2026-05-17");
Temporal.PlainTime.from("14:30:00");
Temporal.PlainDateTime.from("2026-05-17T14:30:00");
Temporal.ZonedDateTime.from("2026-05-17T14:30:00+02:00[Europe/Madrid]");

Temporal.Duration.from({ days: 5, hours: 3 });
Temporal.Duration.from("P5DT3H");          // ISO duration
```

### Aritmética: `add`, `subtract`

```js
const d = Temporal.PlainDate.from("2026-05-17");
d.add({ days: 7 });        // 2026-05-24
d.add({ months: 2 });      // 2026-07-17
d.subtract({ years: 1 });  // 2025-05-17

// d sigue siendo 2026-05-17. Nada muta.
```

### Diferencia: `until`, `since`

```js
const start = Temporal.PlainDate.from("2026-01-01");
const end = Temporal.PlainDate.from("2026-05-17");

start.until(end);                       // Duration { months:4, days:16 } (aprox.)
start.until(end, { largestUnit: "days" }); // Duration { days: 136 }
```

### Comparar

```js
const a = Temporal.PlainDate.from("2026-05-17");
const b = Temporal.PlainDate.from("2026-06-01");

Temporal.PlainDate.compare(a, b); // -1 si a < b, 0 si igual, 1 si a > b

a.equals(b); // false
```

> **¡OJO!** `a === b` y `a == b` NO funcionan como esperarías con objetos Temporal. Son objetos distintos aunque representen la misma fecha. Usa `compare` o `equals`.

### Formatear

Temporal se integra con `Intl.DateTimeFormat`:

```js
const d = Temporal.PlainDate.from("2026-05-17");
const fmt = new Intl.DateTimeFormat("es-ES", { dateStyle: "long" });
fmt.format(d); // "17 de mayo de 2026"
```

`toString()` siempre devuelve ISO 8601.

---

## Parte 3. Zonas horarias

Solo necesitas pensar en zonas cuando el dato **representa un momento concreto** (un evento, un timestamp). Para una fecha de cumpleaños o un día festivo, `PlainDate` es mejor.

```js
const event = Temporal.ZonedDateTime.from(
  "2026-12-31T23:59:00+01:00[Europe/Madrid]",
);

// Lo mismo en Tokio:
event.withTimeZone("Asia/Tokyo");
// → 2027-01-01T07:59:00+09:00[Asia/Tokyo]
```

Los nombres de zona vienen de la base **IANA** ("Europe/Madrid", "America/New_York"). Evita `"+02:00"` suelto como zona — es un offset, no captura DST.

---

## Parte 4. Calendarios (mención)

Temporal soporta calendarios distintos al gregoriano (`"iso8601"` es el por defecto). Hay `"hebrew"`, `"islamic"`, `"japanese"`, etc. No los vamos a tocar en este módulo — sepa que existen y que `Temporal.PlainDate.from({ year, month, day, calendar: "..." })` los acepta.

---

## Ejercicio

Abre `dates.js`. Se ejecuta con:

```bash
node --harmony-temporal dates.js
```

Esqueleto con `// TODO` y resultados esperados al lado. 5 partes: una de `Date` legacy (para que veas las trampas en primera persona) y cuatro de Temporal.

## Recursos

- [Temporal — javascript.info](https://javascript.info/temporal) (capítulo nuevo)
- [Temporal — MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal)
- [Temporal cookbook (TC39)](https://tc39.es/proposal-temporal/docs/cookbook.html) — recetas para casos comunes.
- [Moving from Moment.js to Temporal — Smashing Magazine](https://www.smashingmagazine.com/2026/03/moving-from-moment-to-temporal-api/)
