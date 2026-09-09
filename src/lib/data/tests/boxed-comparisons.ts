import type { TestSuiteEntry } from '../../state/types'

export const boxedComparisons: TestSuiteEntry[] = [
  // ==================== BOXED WRAPPER COMPARISONS (== / != / < etc.) ====================
  // Boxed values are wrapper objects (Integer, Short, ...). == / != between two reference
  // operands compares *identity* (JLS 15.21.3) subject to the autoboxing caches of
  // valueOf(): Integer/Short/Long share the -128..127 instances, Character the 0..127
  // ones, Byte the whole range, Boolean two singletons, Float/Double none. So two boxed
  // env locals compare equal only when they denote the *same* cached instance (or one
  // variable is read twice); equal values outside the cache box to distinct objects.
  // Feeding wrappers in through env.boxed makes the harness render one wrapper
  // declaration per local; every expectation below is whatever real Java produces.
  // ------------------------- boxed == boxed: identity & wrapper caches -------------------------
  // Reading the same wrapper variable twice yields one object -- also for a non-cached value.
  // {
    // code: `a == a`,
    // output: { type: 'boolean', value: true },
    // env: {
      // local: { a: { type: 'int', value: 1000, boxed: true } },
      // heap: {},
    // },
  // },
  // {
    // code: `a == a`,
    // output: { type: 'boolean', value: true },
    // env: {
      // local: { a: { type: 'double', value: 1.5, boxed: true } },
      // heap: {},
    // },
  // },
  // Integer cache -128..127: equal cached values share one object ...
  {
    code: `(true ? 100 : null) == (true ? 100 : null)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? 127 : null) == (true ? 127 : null)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? -128 : null) == (true ? -128 : null)`,
    output: { type: 'boolean', value: true },
  },
  // ... while equal values outside the cache box into distinct objects.
  {
    code: `(true ? 1000 : null) == (true ? 1000 : null)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? 128 : null) == (true ? 128 : null)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? -129 : null) == (true ? -129 : null)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? -2147483648 : null) == (true ? -2147483648 : null)`,
    output: { type: 'boolean', value: false },
  },
  // Short reuses the Integer cache (-128..127): 100 is cached, 1000 is not.
  {
    code: `(true ? (short)100 : null) == (true ? (short)100 : null)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? (short)1000 : null) == (true ? (short)1000 : null)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? (short)-32768 : null) == (true ? (short)-32768 : null)`,
    output: { type: 'boolean', value: false },
  },
  // The whole Byte range is cached, so equal Byte variables always share an object.
  {
    code: `(true ? (byte)100 : null) == (true ? (byte)100 : null)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? (byte)100 : null) == (true ? (byte)-100 : null)`,
    output: { type: 'boolean', value: false },
  },
  // Long cache -128..127: 100 cached, 1000 not. Long.MIN needs parseLong in the harness.
  {
    code: `(true ? 100L : null) == (true ? 100L : null)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? 1000L : null) == (true ? 1000L : null)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? -9223372036854775808L : null) == (true ? -9223372036854775808L : null)`,
    output: { type: 'boolean', value: false },
  },
  // Character cache 0..127: 100 ('d') is cached, 200 is not.
  {
    code: `(true ? (char)100 : null) == (true ? (char)100 : null)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? (char)200 : null) == (true ? (char)200 : null)`,
    output: { type: 'boolean', value: false },
  },
  // Boolean has two singletons.
  {
    code: `(true ? true : null) == (true ? true : null)`,
    output: { type: 'boolean', value: true },
  },
  // Floating point wrappers are never cached: equal values box into distinct objects.
  {
    code: `(true ? 1.5 : null) == (true ? 1.5 : null)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? 1.5f : null) == (true ? 1.5f : null)`,
    output: { type: 'boolean', value: false },
  },
  // != is the negation of the same identity comparison.
  {
    code: `(true ? 100 : null) != (true ? 100 : null)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? 1000 : null) != (true ? 1000 : null)`,
    output: { type: 'boolean', value: true },
  },
  // {
    // code: `a != a`,
    // output: { type: 'boolean', value: false },
    // env: {
      // local: { a: { type: 'int', value: 1000, boxed: true } },
      // heap: {},
    // },
  // },
  // ------------------------- boxed vs primitive & literals: unboxing -------------------------
  // One boxed and one primitive operand make == a *numeric* equality (JLS 15.21.1): the
  // wrapper is unboxed, then binary numeric promotion applies across any width.
  {
    code: `(true ? 100 : null) == 100`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? 1000 : null) == 1000L`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? 1000 : null) == 1000.0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? (short)100 : null) == 100`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? (char)97 : null) == 'a'`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? 100L : null) == 100`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? true : null) == true`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? true : null) == false`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? 1.5 : null) == 1.5`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? 1000 : null) != 1000`,
    output: { type: 'boolean', value: false },
  },
  // Boxed variable vs an unboxed env local of a *different* primitive width.
  {
    code: `(true ? 1000 : null) == p`,
    output: { type: 'boolean', value: true },
    env: {
      local: { p: { type: 'long', value: '1000' } },
      heap: {},
    },
  },
  // ------------------------- boxed vs null -------------------------
  // A wrapper variable compared against null is a reference comparison (never unboxed).
  {
    code: `(true ? 100 : null) == n`,
    output: { type: 'boolean', value: false },
    env: {
      local: { n: { type: 'null', value: null } },
      heap: {},
    },
  },
  {
    code: `(true ? 100 : null) != n`,
    output: { type: 'boolean', value: true },
    env: {
      local: { n: { type: 'null', value: null } },
      heap: {},
    },
  },
  {
    code: `n == n`,
    output: { type: 'boolean', value: true },
    env: {
      local: { n: { type: 'null', value: null } },
      heap: {},
    },
  },
  // ------------------------- == / != across different wrapper types: compile-time errors -------------------------
  // Two boxed operands of *different* wrapper classes are reference-typed but not mutually
  // convertible by casting, so javac rejects them ("incomparable types"). Integer x = 100;
  // Short y = 100; x == y is a compile-time error -- also when the comparison is hidden
  // behind a short-circuiting operator, because typing still happens: a runtime check or an
  // evaluator-only exception could not detect these.
  {
    code: `(true ? 100 : null) == (true ? (short)100 : null)`,
    isError: true,
  },
  {
    code: `(true ? 100 : null) != (true ? (short)100 : null)`,
    isError: true,
  },
  {
    code: `true || ((true ? 100 : null) == (true ? (short)100 : null))`,
    isError: true,
  },
  {
    code: `false && ((true ? 100 : null) == (true ? (short)100 : null))`,
    isError: true,
  },
  {
    code: `(true ? 100 : null) == (true ? 100L : null)`,
    isError: true,
  },
  {
    code: `(true ? 1000 : null) == (true ? 1000.0 : null)`,
    isError: true,
  },
  {
    code: `(true ? 100 : null) == (true ? 100f : null)`,
    isError: true,
  },
  {
    code: `(true ? 100 : null) == (true ? (char)100 : null)`,
    isError: true,
  },
  {
    code: `(true ? (short)100 : null) == (true ? (byte)100 : null)`,
    isError: true,
  },
  {
    code: `(true ? (char)65 : null) == (true ? (byte)65 : null)`,
    isError: true,
  },
  // Boolean wrappers only unbox against a primitive boolean; against numbers they stay
  // reference-typed and are incomparable.
  {
    code: `(true ? true : null) == (true ? 100 : null)`,
    isError: true,
  },
  {
    code: `(true ? true : null) == 1`,
    isError: true,
  },
  {
    code: `true || ((true ? true : null) == 1)`,
    isError: true,
  },
  // ------------------------- relational between mixed numeric wrappers: numeric -------------------------
  // Unlike ==, the relational operators unbox both operands and compare numerically, so any
  // wrapper/primitive numeric mix compiles (JLS 15.20.1) -- Integer vs Short is fine here.
  {
    code: `(true ? 100 : null) < (true ? (short)200 : null)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? 100 : null) <= (true ? (short)200 : null)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? 100 : null) > (true ? (short)200 : null)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? 1000L : null) <= (true ? 1000 : null)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? (char)65 : null) < (true ? (short)100 : null)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? 1.5 : null) < (true ? 2.5f : null)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? 100 : null) < 200`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- wrapper cache boundary values for byte / char / short -------------------------
  // The other integer wrappers share the Integer -128..127 instances (Short/Long) or the
  // whole range (Byte) or 0..127 (Character). Here the *cache edges themselves* are pinned:
  // the inclusive upper/lower cache limits still yield one shared instance, while one past
  // the limit boxes into distinct objects. Byte caches its entire range, so even -128/127
  // (which for Integer/Short/Long would be *inside* the shared -128..127 cache) are reached
  // through the Byte cache.
  {
    code: `(true ? (byte)-128 : null) == (true ? (byte)-128 : null)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? (byte)127 : null) == (true ? (byte)127 : null)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? (char)127 : null) == (true ? (char)127 : null)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? (char)128 : null) == (true ? (char)128 : null)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? (short)128 : null) == (true ? (short)128 : null)`,
    output: { type: 'boolean', value: false },
  },
  // ------------------------- boxed conditional vs the literal null -------------------------
  // Comparing a boxed result against the *null literal* is a plain reference comparison and
  // never unboxes (mirroring the env-locals null tests above). Choosing the numeric arm
  // yields a non-null wrapper (== null is false); forcing the null arm with a false constant
  // condition must select null and therefore compare equal.
  {
    code: `(true ? 100 : null) == null`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(false ? 100 : null) == null`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- unsigned char promotion in mixed-width relational -------------------------
  // Relational unboxes both operands, then binary numeric promotion widens char to a *signed*
  // int while preserving its 0..65535 value and short is sign-extended. So the largest char
  // beats even -1 or 0 in short -- a signed interpretation of char (as e.g. the interpreter
  // might compute it from bits) would give the opposite answer.
  {
    code: `(true ? (char)65535 : null) > (true ? (short)-1 : null)`,
    output: { type: 'boolean', value: true },
  },
]
