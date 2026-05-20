// Module 18 - Closures
// Run: node closures.js

// =====================================================
// Part 1. Prefixer factory
// =====================================================

function makePrefixer(prefix) {
  
  return (str) => prefix + str;
}

const info = makePrefixer("[INFO] ");
const err = makePrefixer("[ERR] ");

console.log(info("server up"));   // "[INFO] server up"
console.log(err("disk full"));    // "[ERR] disk full"
console.log(info("port 3000"));   // "[INFO] port 3000"

// =====================================================
// Part 2. Counter with private state
// =====================================================

function makeCounter(start = 0, step = 1) {
  // return an object with inc, dec, reset, get.
  //       The internal state must NOT be reachable from outside
  //       the returned object (no `count` property, no `value`...).
  let counter = start;
  return {
    inc: () => counter+=step,
    dec: () => counter-=step,
    reset: () => counter=start,
    get: () => counter
  };
}

const c = makeCounter(10, 2);
c.inc(); c.inc(); c.inc();
console.log(c.get());     // 16
c.dec();
console.log(c.get());     // 14
c.reset();
console.log(c.get());     // 10

// Two counters must be independent:
const c2 = makeCounter();
c2.inc();
console.log(c2.get());    // 1
console.log(c.get());     // 10  (still untouched)

// And the state must not be reachable:
console.log(c.count);     // undefined
console.log(c.value);     // undefined

// =====================================================
// Part 3. Memoize
// =====================================================

let slowCalls = 0;
function slowSquare(n) {
  slowCalls++;
  return n * n;
}

function memoize(fn) {
  //  cache results in a Map keyed by the single argument.
  //       Each call to memoize must create its own cache.
  const cache = new Map();

  return function (arg) {
    if (cache.has(arg)) return cache.get(arg);
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}

const fastSquare = memoize(slowSquare);

console.log(fastSquare(5));   // 25
console.log(fastSquare(5));   // 25  (cached)
console.log(fastSquare(7));   // 49
console.log(fastSquare(5));   // 25  (cached)
console.log(slowCalls);       // 2   (only 5 and 7 actually computed)

// =====================================================
// Part 4. The var-in-loop bug
// =====================================================

// 4a. Fix using `let`.
const fnsLet = [];
//  build a `for` loop using `let` so each closure
//       captures its own i. Push 3 functions that return 0, 1, 2.
for (let i = 0; i < 3; i++)
  fnsLet.push(() => i);

console.log(fnsLet[0]?.());   // 0
console.log(fnsLet[1]?.());   // 1
console.log(fnsLet[2]?.());   // 2

// 4b. Fix using `var` plus a self-invoked wrapper.
const fnsVar = [];
//  keep `var` for the loop variable, but wrap the loop body
//       in a function that is called immediately with the current i.

for (var i = 0; i < 3; i++)
  ((j) => fnsVar.push(() => j))(i)

console.log(fnsVar[0]?.());   // 0
console.log(fnsVar[1]?.());   // 1
console.log(fnsVar[2]?.());   // 2

// =====================================================
// Part 5. Why does this hold `huge` in memory?
// =====================================================

function setUp() {
  const huge = new Array(1_000_000).fill("dato");
  const small = "I only need this";
  return function () {
    return small;
  };
}

const leakyFn = setUp();
console.log(leakyFn());   // "I only need this"

// (Part 5): write 1 or 2 sentences below explaining
// why `huge` may stay in memory even though the returned function
// never reads it. Point at the mechanism, not the symptom.

// Your answer:
// Memory leaks. La closure mantiene viva toda la cadena de scopes. 'huge' puede seguir en memoria mientras leakyFn exista.
