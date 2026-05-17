// Ejecuta este archivo con la flag de Node 24:
//   node --harmony-temporal dates.js
// (en Node 26+ no hace falta la flag)

// =====================================================
// Parte 1. Date legacy: vive las trampas
// =====================================================

// a) Crea una Date para el 17 de MAYO de 2026 usando el constructor numérico
//    (año, mes, día). Imprímela. ¿Qué mes sale?
const d1 = new Date(2026, 4, 17);
console.log(d1.toLocaleDateString("sv-SE")); // esperado: 2026-05-17
// Trampa 1: los meses se indexan desde 0 → mayo = 4.
// Trampa 2: si usaras d1.toISOString().slice(0,10), saldría "2026-05-16" en Madrid,
//   porque toISOString convierte a UTC y CEST está en UTC+2 → el instante 00:00 local
//    En Madrid + CEST, "2026-05-17 00:00 local" es "2026-05-16 22:00 UTC". Por eso al imprimir el ISO de dSlash te sale el día 16. Misma trampa de UTC vs local que la 1a, pero esta vez disparada por el parser, no por el formato de salida.

// b) Parsea estos dos strings y compara cómo se interpretan.
//    Imprime el ISO de cada uno. Vas a ver una diferencia interesante.
const isoStr = "2026-05-17";
const slashStr = "2026/05/17";
const dIso = new Date(isoStr);
const dSlash = new Date(slashStr);
console.log(dIso.toISOString());
console.log(dSlash.toISOString());
// Comenta aquí la diferencia que observas:
// El dSlash me da un día anterior //

// c) MUTACIÓN: crea una Date para 2026-05-17. Súmale un día con setDate
//    y observa que la variable original cambia.
const dMut = new Date("2026-05-17T00:00:00Z");
const before = dMut.toISOString();
dMut.setDate(dMut.getDate() + 1);
const after = dMut.toISOString();
console.log(before, "->", after); // esperado: 2026-05-17... -> 2026-05-18...
// Esto es lo que Temporal viene a arreglar: nada de mutación.

// =====================================================
// Parte 2. Temporal: creación y ahora
// =====================================================

// a) Imprime la fecha de hoy (PlainDate) con Temporal.Now.
const today = Temporal.Now.plainDateISO();
console.log(today.toString()); // esperado: la fecha de hoy en formato YYYY-MM-DD

// b) Crea una PlainDate concreta: 17 de mayo de 2026.
//    Usa Temporal.PlainDate.from con un string ISO.
const birthday = Temporal.PlainDate.from("2026-05-17");
console.log(birthday.toString()); // esperado: 2026-05-17

// c) Crea una PlainTime: 14:30.
const meeting = Temporal.PlainTime.from("14:30");
console.log(meeting.toString()); // esperado: 14:30:00

// d) Crea una ZonedDateTime concreta: 2026-12-31 23:59 en Europe/Madrid.
//    Usa el formato con [Europe/Madrid] al final.
const newYearEve = Temporal.ZonedDateTime.from(
  "2026-12-31T23:59:00[Europe/Madrid]",
);
console.log(newYearEve.toString());
// esperado: 2026-12-31T23:59:00+01:00[Europe/Madrid]

// =====================================================
// Parte 3. Aritmética inmutable
// =====================================================

const baseDate = Temporal.PlainDate.from("2026-05-17");

// a) Crea `inOneWeek` sumándole 7 días a `baseDate`.
//    Comprueba que baseDate NO cambia.
const inOneWeek = baseDate.add({ days: 7 });
console.log(inOneWeek.toString()); // esperado: 2026-05-24
console.log(baseDate.toString()); // esperado: 2026-05-17 (intacta)

// b) Crea `lastYear` restándole 1 año a `baseDate`.
const lastYear = baseDate.subtract({ years: 1 });
console.log(lastYear.toString()); // esperado: 2025-05-17

// c) Encadenado: a partir de `baseDate`, suma 2 meses Y luego resta 3 días.
//    Una sola expresión.
const tweaked = baseDate.add({ months: 2 }).subtract({ days: 3 });
console.log(tweaked.toString()); // esperado: 2026-07-14

// =====================================================
// Parte 4. Diferencia entre fechas
// =====================================================

const start = Temporal.PlainDate.from("2026-01-01");
const end = Temporal.PlainDate.from("2026-05-17");

// a) Cuántos días separan `start` y `end`. Usa `until` con largestUnit: "days".
//    Imprime SOLO el número total de días (propiedad .days del Duration).
const diff = start.until(end);
console.log(diff.days); // esperado: 136

// b) Misma diferencia pero descompuesta en meses + días
//    (largestUnit: "months"). Imprime `<months>m <days>d`.
const diff2 = start.until(end, { largestUnit: "months" });
console.log(`${diff2.months}m ${diff2.days}d`); // esperado: 4m 16d

// =====================================================
// Parte 5. Comparar y formatear
// =====================================================

const a1 = Temporal.PlainDate.from("2026-05-17");
const a2 = Temporal.PlainDate.from("2026-05-17");
const b1 = Temporal.PlainDate.from("2026-06-01");

// a) ¿Qué imprime `a1 === a2`? Piénsalo antes de ejecutar.
console.log(a1 === a2); // esperado: false  ← son objetos distintos
// Para comparar valor:
// imprime el equals de a1 y a2.
console.log(a1.equals(a2));
// esperado: true

// b) Compara `a1` vs `b1` con Temporal.PlainDate.compare.
//    Devuelve -1 si a1 < b1, 0 si igual, 1 si a1 > b1.
console.log(Temporal.PlainDate.compare(a1, b1));
// esperado: -1

// c) Ordena este array de PlainDate (de menor a mayor) usando Temporal.PlainDate.compare
//    como comparator de Array.prototype.toSorted.
const dates = [
  Temporal.PlainDate.from("2026-12-01"),
  Temporal.PlainDate.from("2026-01-15"),
  Temporal.PlainDate.from("2026-06-30"),
];
const sorted = dates.toSorted(Temporal.PlainDate.compare);
console.log(sorted.map((d) => d.toString()));
// esperado: ["2026-01-15", "2026-06-30", "2026-12-01"]

// d) Formatea `a1` en español como fecha larga. Usa Intl.DateTimeFormat.
const fmt = new Intl.DateTimeFormat("es-ES", { dateStyle: "long" });
console.log(fmt.format(a1));
// esperado: "17 de mayo de 2026"
