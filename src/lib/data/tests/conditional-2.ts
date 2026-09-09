import type { TestSuiteEntry } from '../../state/types'

export const conditional2: TestSuiteEntry[] = [
  // ------------------------- conditional: narrowing only applies to constant int expressions -------------------------
  // A variable of type int in the same position does not narrow: general numeric
  // promotion applies instead, so a char arm is widened to int (JLS 15.25.2).
  {
    code: `b ? 'a' : x`,
    output: { type: 'int', value: 97 },
    env: {
      local: {
        b: { type: 'boolean', value: true },
        x: { type: 'int', value: 90 },
      },
      heap: {},
    },
  },
  {
    code: `b ? 'a' : x`,
    output: { type: 'int', value: 90 },
    env: {
      local: {
        b: { type: 'boolean', value: false },
        x: { type: 'int', value: 90 },
      },
      heap: {},
    },
  },
  // ------------------------- conditional: runtime variable binary numeric promotion (JLS 15.25.2) -------------------------
  // Mixed-type variable arms promote via binary numeric promotion; the selected arm's
  // value must be converted to the promoted result type.
  {
    code: `b ? x : l`,
    output: { type: 'long', value: '5' },
    env: {
      local: {
        b: { type: 'boolean', value: true },
        x: { type: 'int', value: 5 },
        l: { type: 'long', value: '10' },
      },
      heap: {},
    },
  },
  {
    code: `b ? x : l`,
    output: { type: 'long', value: '10' },
    env: {
      local: {
        b: { type: 'boolean', value: false },
        x: { type: 'int', value: 5 },
        l: { type: 'long', value: '10' },
      },
      heap: {},
    },
  },
  {
    code: `b ? by : x`,
    output: { type: 'int', value: 7 },
    env: {
      local: {
        b: { type: 'boolean', value: true },
        by: { type: 'byte', value: 7 },
        x: { type: 'int', value: 1000 },
      },
      heap: {},
    },
  },
  {
    code: `b ? by : x`,
    output: { type: 'int', value: 1000 },
    env: {
      local: {
        b: { type: 'boolean', value: false },
        by: { type: 'byte', value: 7 },
        x: { type: 'int', value: 1000 },
      },
      heap: {},
    },
  },
  {
    code: `b ? by : l`,
    output: { type: 'long', value: '7' },
    env: {
      local: {
        b: { type: 'boolean', value: true },
        by: { type: 'byte', value: 7 },
        l: { type: 'long', value: '10' },
      },
      heap: {},
    },
  },
  {
    code: `b ? by : l`,
    output: { type: 'long', value: '10' },
    env: {
      local: {
        b: { type: 'boolean', value: false },
        by: { type: 'byte', value: 7 },
        l: { type: 'long', value: '10' },
      },
      heap: {},
    },
  },
  {
    code: `b ? sh : c`,
    output: { type: 'int', value: 7 },
    env: {
      local: {
        b: { type: 'boolean', value: true },
        sh: { type: 'short', value: 7 },
        c: { type: 'char', value: 300 },
      },
      heap: {},
    },
  },
  {
    code: `b ? sh : c`,
    output: { type: 'int', value: 300 },
    env: {
      local: {
        b: { type: 'boolean', value: false },
        sh: { type: 'short', value: 7 },
        c: { type: 'char', value: 300 },
      },
      heap: {},
    },
  },
  {
    code: `b ? by : d`,
    output: { type: 'double', value: 7 },
    env: {
      local: {
        b: { type: 'boolean', value: true },
        by: { type: 'byte', value: 7 },
        d: { type: 'double', value: 2.5 },
      },
      heap: {},
    },
  },
  {
    code: `b ? by : d`,
    output: { type: 'double', value: 2.5 },
    env: {
      local: {
        b: { type: 'boolean', value: false },
        by: { type: 'byte', value: 7 },
        d: { type: 'double', value: 2.5 },
      },
      heap: {},
    },
  },
  {
    code: `b ? x : d`,
    output: { type: 'double', value: 3 },
    env: {
      local: {
        b: { type: 'boolean', value: true },
        x: { type: 'int', value: 3 },
        d: { type: 'double', value: 2.5 },
      },
      heap: {},
    },
  },
  {
    code: `b ? x : d`,
    output: { type: 'double', value: 2.5 },
    env: {
      local: {
        b: { type: 'boolean', value: false },
        x: { type: 'int', value: 3 },
        d: { type: 'double', value: 2.5 },
      },
      heap: {},
    },
  },
  {
    code: `b ? l : d`,
    output: { type: 'double', value: 10 },
    env: {
      local: {
        b: { type: 'boolean', value: true },
        l: { type: 'long', value: '10' },
        d: { type: 'double', value: 2.5 },
      },
      heap: {},
    },
  },
  {
    code: `b ? l : d`,
    output: { type: 'double', value: 2.5 },
    env: {
      local: {
        b: { type: 'boolean', value: false },
        l: { type: 'long', value: '10' },
        d: { type: 'double', value: 2.5 },
      },
      heap: {},
    },
  },
  {
    code: `b ? f : d`,
    output: { type: 'double', value: 2.5 },
    env: {
      local: {
        b: { type: 'boolean', value: true },
        f: { type: 'float', value: 2.5 },
        d: { type: 'double', value: 1.5 },
      },
      heap: {},
    },
  },
  {
    code: `b ? f : d`,
    output: { type: 'double', value: 1.5 },
    env: {
      local: {
        b: { type: 'boolean', value: false },
        f: { type: 'float', value: 2.5 },
        d: { type: 'double', value: 1.5 },
      },
      heap: {},
    },
  },
  // ------------------------- conditional: boolean arms from comparisons (JLS 15.25.1) -------------------------
  {
    code: `b ? 1 == 1 : 2 > 3`,
    output: { type: 'boolean', value: true },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  {
    code: `b ? 1 == 1 : 2 > 3`,
    output: { type: 'boolean', value: false },
    env: {
      local: { b: { type: 'boolean', value: false } },
      heap: {},
    },
  },
  // ------------------------- conditional: nested ternary & associative promotion -------------------------
  // Nested ternaries propagate their promoted type outward; a constant outer condition
  // folds through the nested expression and converts the selected value to the result type.
  {
    code: `false ? 1 : true ? 2 : 3L`,
    output: { type: 'long', value: '2' },
  },
  {
    code: `b ? 'a' : b2 ? 1 : 2L`,
    output: { type: 'long', value: '97' },
    env: {
      local: {
        b: { type: 'boolean', value: true },
        b2: { type: 'boolean', value: false },
      },
      heap: {},
    },
  },
  {
    code: `b ? 'a' : b2 ? 1 : 2L`,
    output: { type: 'long', value: '2' },
    env: {
      local: {
        b: { type: 'boolean', value: false },
        b2: { type: 'boolean', value: false },
      },
      heap: {},
    },
  },
  {
    code: `true ? 'a' : 1000000`,
    output: { type: 'int', value: 97 },
  },
  // ------------------------- conditional: string interning & constant folding of the result -------------------------
  // A ternary whose arms are compile-time constants is itself constant and folds to an
  // interned String, so == against the same literal is true; an arm that needs a runtime
  // concatenation yields a fresh, non-interned object, so == is false. (Companion to the
  // interning tests further down.)
  {
    code: `(true ? "a" : "b") == "a"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? "a" : "b") == "b"`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(false ? "a" : "b") == "b"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? "a" + "b" : "c") == "ab"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(false ? "c" : "a" + "b") == "ab"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(1 < 2 ? "a" + "b" : "c" + "d") == "ab"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("" + (true ? "a" : "b")) == "a"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `((true ? "a" : "b") + "") == "a"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? (false ? "a" : "b") : "c") == "b"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(b ? "a" + "b" : "c") == "ab"`,
    output: { type: 'boolean', value: true },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  {
    code: `(true ? s + "b" : "c") == "ab"`,
    output: { type: 'boolean', value: false },
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: {
        heap0: { class: 'java.lang.String', value: 'a', isInterned: true },
      },
    },
  },
  {
    code: `(true ? s + "b" : "c") == (s + "b")`,
    output: { type: 'boolean', value: false },
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: {
        heap0: { class: 'java.lang.String', value: 'a', isInterned: true },
      },
    },
  },
  // ------------------------- conditional: boxed (reference) results & wrapper caches -------------------------
  // A ternary whose arms are a numeric/boolean mix is a *reference* conditional: the chosen
  // arm is boxed and == then compares object identity, not value. Two syntactic copies of
  // the same expression therefore only compare equal when boxing reuses a cached wrapper
  // (Integer/Short/Long -128..127, Character <= 127, whole Byte range, Boolean singletons),
  // while Float/Double and out-of-range values box to distinct objects. This probes whether
  // the conditional result is boxed at all. Contrast with an int == unboxing comparison.
  {
    code: `(true ? 100 : false) == (true ? 100 : false)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? 1000 : false) == (true ? 1000 : false)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? 127 : false) == (true ? 127 : false)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? 128 : false) == (true ? 128 : false)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? -128 : false) == (true ? -128 : false)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? -129 : false) == (true ? -129 : false)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(false ? false : 100) == (false ? false : 100)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(false ? false : 1000) == (false ? false : 1000)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? true : 100) == (true ? true : 100)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(false ? 100 : true) == (false ? 100 : true)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? 100L : false) == (true ? 100L : false)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? 1000L : false) == (true ? 1000L : false)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? (byte)127 : false) == (true ? (byte)127 : false)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? (short)100 : false) == (true ? (short)100 : false)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? (short)1000 : false) == (true ? (short)1000 : false)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? 'a' : false) == (true ? 'a' : false)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? 'ÿ' : false) == (true ? 'ÿ' : false)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? 1.5f : false) == (true ? 1.5f : false)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? 1.5 : false) == (true ? 1.5 : false)`,
    output: { type: 'boolean', value: false },
  },
  // The conditional's static type is lub(Integer, Boolean) -- a common supertype, not the
  // Integer wrapper -- so it cannot be unboxed: comparing it with an int literal is a
  // compile-time error (== is only reference equality here).
  {
    code: `(true ? 100 : false) == 100`,
    isError: true,
  },
  {
    code: `(true ? 1000 : false) == 1000`,
    isError: true,
  },
  // Boxed locals: reading the same wrapper variable twice yields one object (== true),
  // whereas a freshly boxed non-cached constant is a distinct object (== false). These
  // need boxed values in the locals, which the harness supports via the `boxed` flag.
  // {
    // code: `(true ? n : false) == (true ? n : false)`,
    // output: { type: 'boolean', value: true },
    // env: {
      // local: { n: { type: 'int', value: 1000, boxed: true } },
      // heap: {},
    // },
  // },
  {
    code: `(true ? 1000 : false) == (true ? 1000 : null)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? 100 : false) == (true ? 100 : null)`,
    output: { type: 'boolean', value: true },
  },
  // {
    // code: `(true ? ch : false) == ch`,
    // output: { type: 'boolean', value: true },
    // env: {
      // local: { ch: { type: 'char', value: 1000, boxed: true } },
      // heap: {},
    // },
  // },
  // ------------------------- conditional: cross-shape cache hits & unboxing paths -------------------------
  // Boxed results reached through different arm shapes (null / boolean / String on the other
  // side) still route through the same wrapper cache. When both operands are already boxed
  // (Integer locals) the conditional is an Integer-typed reference conditional: == against an
  // int literal and arithmetic unbox the result numerically. Boxing only for the *chosen* arm.
  {
    code: `(true ? 100 : null) == (true ? 100 : false)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? 1000 : null) == (true ? 1000 : false)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? 100 : "x") == (true ? 100 : "x")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? 1000 : "x") == (true ? 1000 : "x")`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? 1 : null) - 1`,
    output: { type: 'int', value: 0 },
  },
  // Unboxing a null arm raises NullPointerException at run time ...
  {
    code: `(false ? 1 : null) + 1`,
    isError: true,
  },
  // ... while the lub of two different wrappers is not an unboxable type, so using it as a
  // numeric operand is a compile-time error even though the numeric arm is selected.
  {
    code: `(true ? 1000 : false) + 1`,
    isError: true,
  },
  // Integer-typed conditional over boxed locals: == and + unbox numerically.
  {
    code: `(b ? (true ? 1000 : null) : (true ? 5 : null)) == 1000`,
    output: { type: 'boolean', value: true },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  // Long boxed at run time (runtime condition, so no constant-condition folding): the two
  // copies of the expression box the selected literal separately and only compare equal when
  // Long.valueOf() reuses the -128..127 cache. (Mixing a Long variable with a long literal
  // instead yields a *numeric* long conditional -- Table 15.25-B -- so no boxing happens.)
  {
    code: `(b ? 100L : false) == (b ? 100L : false)`,
    output: { type: 'boolean', value: true },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  {
    code: `(b ? 1000L : false) == (b ? 1000L : false)`,
    output: { type: 'boolean', value: false },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  // ------------------------- conditional: compile-time type errors -------------------------
  {
    code: `1 ? 2 : 3`,
    isError: true,
  },
  {
    code: `1.5 ? 2 : 3`,
    isError: true,
  },
  {
    code: `null ? 1 : 2`,
    isError: true,
  },
  {
    code: `"x" ? 1 : 2`,
    isError: true,
  },
  // Non-boolean runtime (variable) conditions and non-literal boolean candidates.
  {
    code: `x ? 1 : 2`,
    isError: true,
    env: {
      local: { x: { type: 'int', value: 1 } },
      heap: {},
    },
  },
  {
    code: `ch ? 1 : 2`,
    isError: true,
    env: {
      local: { ch: { type: 'char', value: 65 } },
      heap: {},
    },
  },
  {
    code: `d ? 1 : 2`,
    isError: true,
    env: {
      local: { d: { type: 'double', value: 1.5 } },
      heap: {},
    },
  },
  {
    code: `s ? 1 : 2`,
    isError: true,
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: {
        heap0: { class: 'java.lang.String', value: 'a', isInterned: true },
      },
    },
  },
  {
    code: `(1 + 1) ? 2 : 3`,
    isError: true,
  },
]
