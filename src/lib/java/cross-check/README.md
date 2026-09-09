# Java cross-check harness

Validates `src/lib/data/test-suite.ts` against **real Java**: every entry is compiled
and run with a real JDK (via `Harness.java`), and the result is compared to the suite's
expected `output` or expected error phase (`error: 'compile' | 'runtime'`). The test
suite is the single source of truth for both
this harness (Java semantics) and the interpreter page (Suite UI).

## Usage

```sh
npm run cross-check                 # run all entries
npm run cross-check -v              # verbose, one line per entry incl. env + expected/actual
node src/lib/java/cross-check/java-cross-check.mjs "x == y"   # only code containing substring
```

Requires `javac`/`java` on PATH. Workers compile entries in parallel (default = cpus, cap 8).

## How an entry is evaluated

For each entry the harness renders the env as local declarations, then compiles

```java
class T<n> {
  public static void main(String[] a) {
    <env decls>
    var __jqHarnessValue = <code>;   // code is a single expression
    Harness.out(__jqHarnessValue);   // prints one JSON line
  }
}
```

and compares that JSON to the entry's `output`. In the error case the failing phase must
match `error` exactly: javac failures report `'compile'`, JVM failures `'runtime'`.

## Test-suite entry contract

- `code` — **one expression**. Statement lists are not supported; multi-statement code
  degrades into a javac error, which an `error: 'compile'` entry would pass for the wrong
  reason.
- `env.local` — per-variable values rendered as Java declarations:
  - numeric/boolean with `boxed: true` → wrapper decls (`Integer x = 100;`,
    `Short y = (short) 100;`, `Long l = ...L;` …); MIN int/long go through
    `parseInt`/`parseLong` because no literal exists for them.
  - unboxed → primitive decls; `null` → `Object n = null;`.
  - `reference` → `java.lang.String` only (heap object), rendered as a literal
    (`isInterned`) or `new String(...)` (not interned).
- `output` — only `boolean`, numeric primitives, or `__str` (dereferenced String result).
  Reference results of other classes, and `null` results, are not assertable.
- `error` — `'compile'` (javac rejects the code) or `'runtime'` (it compiles but the JVM
  throws). Both phases are exact: an entry only passes when Java fails in precisely that
  phase, and the interpreter (Suite page) must fail in the same phase to match.

## Bounds / semantics the suite relies on

1. **`error` records the failing phase, but not the reason within it.** The harness only
   tells *which* phase Java rejects in (compile = kind 99, runtime = kind 114), not the
   precise diagnostic. If an entry is meant to pin a *compile-time* rejection (so the
   interpreter must reject it in typecheck, not in the evaluator), guard it behind a
   short-circuit that never runs but still type-checks, e.g. `true || (x == y)`.
2. **Boxed identity is the real JVM's**, i.e. `==`/`!=` on wrappers is reference equality
   subject to autoboxing caches: Integer/Short/Long share −128..127, Character 0..127,
   Byte the full range, Boolean two singletons, Float/Double none. So two env boxed
   locals of equal cached values compare `==` true; equal out-of-cache (or float/double)
   values compare false; re-reading one variable compares true. Cross-wrapper-type
   `==`/`!=` (e.g. `Integer == Short`) are javac compile errors, while the relational
   operators (`< <= > >=`) between mixed numeric wrappers unbox and are valid. The Suite
   page interpreter must implement this cache/identity model to match.
3. **Env locals must not alias one non-interned heap String.** Rendering emits one
   `new String(...)` per local, so two locals pointing at the same heap object become
   distinct objects in Java — a wrong baseline for an identity test. (No current entry
   does this.)
4. **Unrepresentable results:** raw `null`, `NaN`, `Infinity`, `-0.0` as a direct result,
   and env boxed float/double `NaN`/`Infinity`, cannot be asserted. Wrap them in
   comparisons or string concatenation instead.
5. **Caching/formatting baseline is whatever the JDK does** (wrapper caches, shortest
   float/double printing via `Double.toString`), *not* the interpreter's model. A green
   run certifies expectations == real Java only; it says nothing about interpreter parity
   (that is the separate Suite page — verify visually; it tags interpreter exceptions as
   `compile` when raised in parse/typecheck and `runtime` when raised in the evaluator, and
   only counts an entry as passing when that phase equals the entry's `error`).
