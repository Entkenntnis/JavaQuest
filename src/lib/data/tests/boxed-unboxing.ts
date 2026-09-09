import type { TestSuiteEntry } from '../../state/types'

export const boxedUnboxing: TestSuiteEntry[] = [
  // ==================== UNBOXING CONTEXTS OF BOXED (WRAPPER) RESULTS ====================
  // The harness can no longer feed boxed locals in through env.boxed (the cross-check
  // renderDecl rejects them), so wrappers are minted *inside the expression* with the
  // reference-typed ternary trick:  `(cond ? <primitive> : null)` boxes the primitive arm
  // (Integer/Short/...), while `(cond ? <primitive> : false)` or `... : "x"` boxes it into
  // an Object-typed lub (the "Serializable thingy"). Harness.out()/the Suite page auto-unbox
  // whatever wrapper actually reaches the top, so primitive JSON is the assertable result.
  // A boxed value is unboxed whenever the surrounding operator demands a primitive: numeric
  // arithmetic, unary +/-/~, casts, equality/relational against a primitive, and boolean
  // contexts (==, &&/||/!, and even the condition of a ?:). Unboxing null throws an NPE.
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
  // A cast to the boxed value's own width (or wider) unboxes and succeeds. But a *single*
  // narrowing cast (Integer -> byte/short/char) is rejected by javac: casting a wrapper
  // straight to a narrower primitive is not a valid casting conversion; the wrapper must
  // first be unboxed to int. So `(byte)(int)(Integer)` is legal, `(byte)(Integer)` is not.
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
    isError: true,
  },
  // ------------------------- NPE: unboxing a null-selected arm -------------------------
  // When the constant condition picks the null arm of an Integer/Boolean-typed conditional,
  // the *result is null*, and any numeric/boolean context unboxes it -> NullPointerException.
  // These extend the `(false ? 1 : null) + 1` case to ==, relational, binary -, and !.
  {
    code: `(false ? 1 : null) == 1`,
    isError: true,
  },
  {
    code: `(false ? 1 : null) < 2`,
    isError: true,
  },
  {
    code: `(false ? 1000 : null) - 1`,
    isError: true,
  },
  {
    code: `!(false ? false : null)`,
    isError: true,
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
  // ------------------------- lub-typed boxed values ("the Serializable thingy") -------------------------
  // `cond ? int : boolean` has neither an Integer nor a Boolean type: javac boxes both arms
  // and types the conditional as the lub of Integer and Boolean (an Object/Serializable/
  // Comparable-ish intersection). Two consequences tested here:
  //  * The single-wrapper conditional `int : null` stays *Integer*, and Integer == String is
  //    a compile-time error ("incomparable types") -- also when hidden behind short-circuit.
  //  * The lub conditional can legally be compared with a String (String implements the
  //    interfaces in the intersection), but the two results are distinct objects, so == false
  //    -- likewise Integer lub vs a same-valued cached Short wrapper: different classes, so
  //    not even the -128..127 cache makes them equal.
  {
    code: `(true ? 100 : null) == (true ? "a" : null)`,
    isError: true,
  },
  {
    code: `(true ? 100 : false) == (true ? "a" : null)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? 100 : false) == (true ? (short)100 : null)`,
    output: { type: 'boolean', value: false },
  },
  // ------------------------- extras: real Java, larger model changes required -------------------------
  // These are all verified Java behaviour but depend on semantics the interpreter does not
  // model yet (target-typing of ?: inside a primitive cast, toString of a lub-boxed value,
  // wrapper reuse through nested ternaries). They are pinned here so the cross-check certifies
  // them; expect the Suite page to stay red until that work lands.
  // A reference-typed conditional in a primitive cast context is *target-typed*: the selected
  // arm is boxed, cast to the target wrapper and unboxed, so a mismatching arm is a runtime
  // ClassCastException, not a compile error.
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
    isError: true,
    env: {
      local: { b: { type: 'boolean', value: false } },
      heap: {},
    },
  },
  // Direct (auto-unboxed) outputs and string conversion of lub results need the evaluator to
  // turn an objectified wrapper back into a primitive/String.
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
