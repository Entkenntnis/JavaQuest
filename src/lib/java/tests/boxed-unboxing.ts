import type { TestSuiteEntry } from '../../state/types'

export const boxedUnboxing: TestSuiteEntry[] = [
  // ==================== UNBOXING CONTEXTS OF BOXED (WRAPPER) RESULTS ====================
  // Boxed locals cannot be fed through env.boxed (the cross-check renderDecl rejects them), so
  // wrappers are minted inside the expression with a reference-typed ternary: `(cond ? <prim> :
  // null)` boxes to the wrapper (Integer/Short/...), while `(cond ? <prim> : false)` / `: "x"`
  // boxes into an Object-typed lub. The Suite/harness auto-unbox whatever wrapper reaches the
  // top. A boxed value is unboxed whenever the surrounding operator demands a primitive:
  // numeric arithmetic, unary +/-/~, casts, equality/relational against a primitive, and
  // boolean contexts (==, &&/||/!, the condition of a ?:). Unboxing null throws an NPE.
  // ------------------------- numeric arithmetic unboxes boxed operands -------------------------
  // Arithmetic between two Integer-typed conditionals unboxes both and yields the promoted
  // primitive -- this works for cached and non-cached values alike (caching is irrelevant to
  // value arithmetic; these cases pin that the boxed results do not poison the +).
  {
    code: `(true ? 100 : null) + (true ? 100 : null)`,
    output: { type: 'int', value: 200 },
  },
  {
    code: `(true ? 1000 : null) + (true ? 1000 : null)`,
    output: { type: 'int', value: 2000 },
  },
  // Widths differ per wrapper: long stays long, char/short promote to int.
  {
    code: `(true ? 300L : null) + (true ? 2 : null)`,
    output: { type: 'long', value: '302' },
  },
  {
    code: `(true ? (char)300 : null) + 0`,
    output: { type: 'int', value: 300 },
  },
  {
    code: `(true ? (short)300 : null) * 2`,
    output: { type: 'int', value: 600 },
  },
  {
    code: `~(true ? 5L : null)`,
    output: { type: 'long', value: '-6' },
  },
  // ------------------------- casts of boxed results -------------------------
  // JLS 5.5: casting a *reference* to a primitive is an unboxing conversion optionally
  // followed by a widening primitive conversion -- never a narrowing one. So a wrapper casts
  // only to its own primitive or to wider types; narrowing targets are javac errors (unlike
  // primitive->primitive narrowing, which an explicit unbox permits):
  //   `(byte)(Integer)` error, `(byte)(int)(Integer)` = -24.
  // byte<->char is not a widening path either: `(short)(Byte)` works, `(char)(Byte)` errors.
  {
    code: `(int)(true ? 1000 : null)`,
    output: { type: 'int', value: 1000 },
  },
  {
    code: `(long)(true ? 1000 : null)`,
    output: { type: 'long', value: '1000' },
  },
  {
    code: `(double)(true ? 1000 : null)`,
    output: { type: 'double', value: 1000 },
  },
  {
    code: `(byte)(int)(true ? 1000 : null)`,
    output: { type: 'byte', value: -24 },
  },
  {
    code: `(char)(int)(true ? 65535 : null)`,
    output: { type: 'char', value: 65535 },
  },
  {
    code: `(byte)(true ? 1000 : null)`,
    error: 'compile',
  },
  // Every wrapper casts to its *own* primitive (identity unbox) and, from there, only to
  // wider primitives.
  {
    code: `(byte)(true ? (byte)100 : null)`,
    output: { type: 'byte', value: 100 },
  },
  {
    code: `(short)(true ? (short)300 : null)`,
    output: { type: 'short', value: 300 },
  },
  {
    code: `(char)(true ? (char)300 : null)`,
    output: { type: 'char', value: 300 },
  },
  {
    code: `(boolean)(true ? true : null)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(short)(true ? (byte)100 : null)`,
    output: { type: 'short', value: 100 },
  },
  {
    code: `(int)(true ? (byte)100 : null)`,
    output: { type: 'int', value: 100 },
  },
  {
    code: `(long)(true ? (byte)100 : null)`,
    output: { type: 'long', value: '100' },
  },
  {
    code: `(int)(true ? (short)300 : null)`,
    output: { type: 'int', value: 300 },
  },
  {
    code: `(float)(true ? 1000L : null)`,
    output: { type: 'float', value: 1000 },
  },
  {
    code: `(double)(true ? 1000L : null)`,
    output: { type: 'double', value: 1000 },
  },
  // Every target that would *narrow* after the unbox is a compile error -- including
  // long/float/double widening the other way, which the reverse cast allows.
  {
    code: `(byte)(true ? (short)300 : null)`,
    error: 'compile',
  },
  {
    code: `(char)(true ? (short)300 : null)`,
    error: 'compile',
  },
  {
    code: `(char)(true ? (byte)100 : null)`,
    error: 'compile',
  },
  {
    code: `(short)(true ? (char)300 : null)`,
    error: 'compile',
  },
  {
    code: `(byte)(true ? (char)300 : null)`,
    error: 'compile',
  },
  {
    code: `(int)(true ? 1000L : null)`,
    error: 'compile',
  },
  {
    code: `(int)(true ? 1.5 : null)`,
    error: 'compile',
  },
  {
    code: `(long)(true ? 1.5 : null)`,
    error: 'compile',
  },
  {
    code: `(float)(true ? 1.5 : null)`,
    error: 'compile',
  },
  {
    code: `(int)(true ? 1.5f : null)`,
    error: 'compile',
  },
  {
    code: `(long)(true ? 1.5f : null)`,
    error: 'compile',
  },
  // ------------------------- NPE: unboxing a null-selected arm -------------------------
  // When the constant condition picks the null arm of an Integer/Boolean-typed conditional,
  // the *result is null*, and any numeric/boolean context unboxes it -> NullPointerException.
  // These extend the `(false ? 1 : null) + 1` case to ==, relational, binary -, and !.
  {
    code: `(false ? 1 : null) == 1`,
    error: 'runtime',
  },
  {
    code: `(false ? 1 : null) < 2`,
    error: 'runtime',
  },
  {
    code: `(false ? 1000 : null) - 1`,
    error: 'runtime',
  },
  {
    code: `!(false ? false : null)`,
    error: 'runtime',
  },
  // The unary +/-/~ operators also demand a primitive, so a null-selected wrapper arm must
  // NPE too. (Their non-null arms are pinned in the numeric-arithmetic section above.)
  {
    code: `+(false ? 1 : null)`,
    error: 'runtime',
  },
  {
    code: `-(false ? 1 : null)`,
    error: 'runtime',
  },
  {
    code: `~(false ? 1 : null)`,
    error: 'runtime',
  },
  {
    code: `!(true ? null : false)`,
    error: 'runtime',
  },
  // ------------------------- boxed Boolean in boolean contexts -------------------------
  // JLS 15.25 allows a Boolean *wrapper* as a ternary condition (and 15.23/15.24 as an
  // &&/|| operand): the wrapper is unboxed, so a non-null boxed Boolean drives the branch,
  // while a boxed null throws NPE. This means a Boolean-typed conditional is usable where
  // only a primitive boolean would naively appear legal.
  {
    code: `(true ? true : null) ? 1 : 2`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `(true ? false : null) ? 1 : 2`,
    output: { type: 'int', value: 2 },
  },
  {
    code: `(true ? true : null) && (true ? false : null)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? false : null) == (true ? false : 1)`,
    output: { type: 'boolean', value: true },
  },
  // The wrapper is unboxed in these boolean contexts before any branching/short-circuit, so a
  // null-selected arm throws NPE: as a ?: condition, and as a &&/|| left operand.
  {
    code: `(false ? true : null) ? 1 : 2`,
    error: 'runtime',
  },
  {
    code: `(false ? true : null) && true`,
    error: 'runtime',
  },
  {
    code: `(false ? true : null) || true`,
    error: 'runtime',
  },
  // ------------------------- lub-typed boxed values ("the Serializable thingy") -------------------------
  // `cond ? int : boolean` boxes both arms and types the conditional as the lub of Integer and
  // Boolean (Object/Serializable/Comparable-ish), unlike `cond ? int : null`, which stays
  // Integer. So Integer == String is a compile-time error, while the Object-typed lub may be
  // compared with a String (distinct objects -> false) or a same-valued Short wrapper
  // (different classes -> false, despite the cache).
  {
    code: `(true ? 100 : null) == (true ? "a" : null)`,
    error: 'compile',
  },
  {
    code: `(true ? 100 : false) == (true ? "a" : null)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? 100 : false) == (true ? (short)100 : null)`,
    output: { type: 'boolean', value: false },
  },
  // ------------------------- target-typed casts of a reference conditional -------------------------
  // A reference-typed conditional in a primitive cast is *target-typed*: the selected arm is
  // boxed, cast to the target wrapper and unboxed, so a mismatching arm is a runtime
  // ClassCastException, not a compile error. Contrast the single-wrapper conditional above,
  // where `(byte)(Integer)` is a javac error (Integer cannot statically downcast to Byte);
  // the Object-ish lub is permissive enough to compile and only fail at run time.
  {
    code: `(int)(true ? 1000 : false)`,
    output: { type: 'int', value: 1000 },
  },
  {
    code: `(byte)(true ? 1000 : false)`,
    error: 'runtime',
  },
  {
    code: `(short)(true ? 1000 : false)`,
    error: 'runtime',
  },
  {
    code: `(long)(true ? 1000 : false)`,
    error: 'runtime',
  },
  {
    code: `(boolean)(true ? true : 1)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(boolean)(false ? true : 1)`,
    error: 'runtime',
  },
  {
    code: `(double)(true ? 1.5 : false)`,
    output: { type: 'double', value: 1.5 },
  },
  // The lub may include a String arm: the cast compiles, and only a non-matching selected arm
  // throws. A String-typed (single-wrapper) conditional cannot be cast to a primitive at all.
  {
    code: `(int)(true ? 1000 : "x")`,
    output: { type: 'int', value: 1000 },
  },
  {
    code: `(int)(false ? 1000 : "x")`,
    error: 'runtime',
  },
  {
    code: `(int)(true ? "a" : null)`,
    error: 'compile',
  },
  {
    code: `(int)(b ? 100 : false)`,
    output: { type: 'int', value: 100 },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  {
    code: `(int)(b ? 100 : false)`,
    error: 'runtime',
    env: {
      local: { b: { type: 'boolean', value: false } },
      heap: {},
    },
  },
  // Direct (auto-unboxed) outputs and string conversion of a wrapper result.
  {
    code: `b ? 1000 : false`,
    output: { type: 'int', value: 1000 },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  {
    code: `b ? (short)300 : false`,
    output: { type: 'short', value: 300 },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  {
    code: `"" + (true ? 1000 : false)`,
    output: { type: '__str', value: '1000' },
  },
  {
    code: `"" + (false ? 1000 : true)`,
    output: { type: '__str', value: 'true' },
  },
  // NaN-like identity oddity: -0.0 and 0.0 box into distinct Doubles, yet compare equal
  // numerically after unboxing.
  {
    code: `(true ? -0.0 : null) == (true ? 0.0 : null)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? -0.0 : null) == 0.0`,
    output: { type: 'boolean', value: true },
  },
  // A boxed result passed through a *second* ternary is not re-boxed: the inner conditional
  // returns its wrapper object, so == identity follows the wrapper cache of the inner arm.
  {
    code: `(true ? (true ? 100 : null) : false) == (true ? 100 : null)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? (true ? 1000 : null) : false) == (true ? 1000 : null)`,
    output: { type: 'boolean', value: false },
  },
]
