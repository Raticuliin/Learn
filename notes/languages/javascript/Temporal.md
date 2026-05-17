# Temporal

API moderna de fechas en JavaScript. Stage 4 desde marzo 2026, incluida en ES2026. Sustituye a [[js-date-legacy]] para la mayoría de casos.

## Soporte

- Node 26+: nativo, sin flag.
- Node 24 LTS: tras flag `--harmony-temporal`.
- Node 22 y anteriores: polyfill `temporal-polyfill` (npm).
- Firefox 139+, Chrome 144+: nativo. Safari en preview.

## Principios

1. **Inmutable**. Toda operación devuelve objeto nuevo.
2. **Tipos separados** para conceptos separados — fecha sola, hora sola, fecha+hora, fecha+hora+zona, duración, instante UTC.
3. **Zonas y calendarios explícitos**. Cuando importan, los pones; cuando no, los omites.

## Los tipos principales

| Tipo                     | Para                                       |
| ------------------------ | ------------------------------------------ |
| `Temporal.PlainDate`     | Cumpleaños, festivos, "el día 17"          |
| `Temporal.PlainTime`     | "14:30", sin fecha                         |
| `Temporal.PlainDateTime` | Fecha + hora, sin zona                     |
| `Temporal.ZonedDateTime` | Eventos en una zona concreta (con DST)     |
| `Temporal.Instant`       | Punto exacto en el tiempo (UTC, timestamps)|
| `Temporal.Duration`      | "5 días, 3 horas"                          |

## Operaciones comunes

```js
// Crear
Temporal.Now.plainDateISO();
Temporal.PlainDate.from("2026-05-17");
Temporal.ZonedDateTime.from("2026-12-31T23:59:00[Europe/Madrid]");

// Aritmética (inmutable, encadenable)
d.add({ days: 7 });
d.subtract({ years: 1 });
d.add({ months: 2 }).subtract({ days: 3 });

// Diferencia
start.until(end);                          // Duration
start.until(end, { largestUnit: "days" }); // total en días

// Comparar (¡ojo!)
a === b;                          // siempre false con objetos Temporal
a.equals(b);                      // comparación por valor
Temporal.PlainDate.compare(a, b); // -1 | 0 | 1, sirve como comparator de toSorted

// Formatear con Intl
new Intl.DateTimeFormat("es-ES", { dateStyle: "long" }).format(d);
```

## Gotcha: `===` no funciona

Dos PlainDate con la misma fecha son objetos distintos. Compara con `.equals()` o `.compare()`.

## Zona y offset: cuándo separar

Cuando creas un ZonedDateTime puedes dar offset + zona juntos (`2026-12-31T23:59:00+01:00[Europe/Madrid]`) o solo zona. Si das ambos, Temporal valida que el offset coincida con lo que la zona usa en ese instante; si no coinciden, lanza error. Para código del día a día, da solo zona (`[Europe/Madrid]`) y deja que Temporal calcule el offset.

## Ver también

- [[js-date-legacy]] · [[pass-by-reference]]
