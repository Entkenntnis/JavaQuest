import type { TestSuiteEntry } from '../../state/types'

export const boxedStrings: TestSuiteEntry[] = [
  // ==================== STRING CONVERSION OF BOXED VALUES ====================
  // `+` with a String operand is *not* an unboxing context: JLS 15.18.1 converts the other
  // operand with String.valueOf semantics, so a wrapper is stringified through its
  // toString() and a null *reference* becomes the text "null" -- it does NOT throw. These
  // entries contrast that with the numeric contexts (where the same null arm NPEs) and pin
  // the toString text for every wrapper type, both operand orders, and wrapper locals.
  // ------------------------- boxed arm selected: toString of the value -------------------------
  {
    code: `"" + (true ? 100 : null)`,
    output: { type: '__str', value: '100' },
  },
  {
    code: `(true ? 100 : null) + ""`,
    output: { type: '__str', value: '100' },
  },
  {
    code: `"" + (true ? 1000 : null)`,
    output: { type: '__str', value: '1000' },
  },
  {
    code: `"" + (true ? (short)100 : null)`,
    output: { type: '__str', value: '100' },
  },
  {
    code: `"" + (true ? (byte)100 : null)`,
    output: { type: '__str', value: '100' },
  },
  {
    code: `"" + (true ? (char)65 : null)`,
    output: { type: '__str', value: 'A' },
  },
  {
    code: `"" + (true ? (char)200 : null)`,
    output: { type: '__str', value: 'È' },
  },
  {
    code: `"" + (true ? 100L : null)`,
    output: { type: '__str', value: '100' },
  },
  {
    code: `"" + (true ? 1.5 : null)`,
    output: { type: '__str', value: '1.5' },
  },
  {
    code: `"" + (true ? 1.5f : null)`,
    output: { type: '__str', value: '1.5' },
  },
  {
    code: `"" + (true ? true : null)`,
    output: { type: '__str', value: 'true' },
  },
  {
    code: `"" + (true ? false : null)`,
    output: { type: '__str', value: 'false' },
  },
  {
    code: `"" + (true ? 0.0 : null)`,
    output: { type: '__str', value: '0.0' },
  },
  {
    code: `"" + (true ? -0.0 : null)`,
    output: { type: '__str', value: '-0.0' },
  },
  {
    code: `"" + (true ? 1.0E10 : null)`,
    output: { type: '__str', value: '1.0E10' },
  },
  // ------------------------- null arm selected: the text "null", no NPE -------------------------
  {
    code: `"" + (false ? 100 : null)`,
    output: { type: '__str', value: 'null' },
  },
  {
    code: `(false ? 100 : null) + ""`,
    output: { type: '__str', value: 'null' },
  },
  {
    code: `"" + (false ? true : null)`,
    output: { type: '__str', value: 'null' },
  },
  {
    code: `"" + (false ? 1000 : null)`,
    output: { type: '__str', value: 'null' },
  },
  // ------------------------- lub-typed (Object) boxed results -------------------------
  {
    code: `"" + (true ? 100 : "x")`,
    output: { type: '__str', value: '100' },
  },
  {
    code: `(true ? 100 : "x") + ""`,
    output: { type: '__str', value: '100' },
  },
  {
    code: `(true ? 100 : false) + ""`,
    output: { type: '__str', value: '100' },
  },
  // ------------------------- string + boxed, both orders -------------------------
  {
    code: `(true ? "a" : null) + (true ? 100 : null)`,
    output: { type: '__str', value: 'a100' },
  },
  {
    code: `(true ? 100 : null) + (true ? "a" : null)`,
    output: { type: '__str', value: '100a' },
  },
  {
    code: `(true ? "a" : null) + (true ? "b" : null)`,
    output: { type: '__str', value: 'ab' },
  },
  // Contrast: two numeric wrappers make a *numeric* +, not a concat.
  {
    code: `(true ? 100 : null) + (true ? 200 : null)`,
    output: { type: 'int', value: 300 },
  },
  // ------------------------- wrapper locals in concatenation -------------------------
  {
    code: `"" + a`,
    output: { type: '__str', value: '1000' },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `a + ""`,
    output: { type: '__str', value: '1000' },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `a + s`,
    output: { type: '__str', value: '1000x' },
    env: {
      local: {
        a: { type: 'int', value: 1000, boxed: true },
        s: { type: 'reference', ref: 'heap0' },
      },
      heap: {
        heap0: { class: 'java.lang.String', value: 'x', isInterned: true },
      },
    },
  },
  {
    code: `s + a`,
    output: { type: '__str', value: 'x1000' },
    env: {
      local: {
        a: { type: 'int', value: 1000, boxed: true },
        s: { type: 'reference', ref: 'heap0' },
      },
      heap: {
        heap0: { class: 'java.lang.String', value: 'x', isInterned: true },
      },
    },
  },
  {
    code: `"" + b`,
    output: { type: '__str', value: 'true' },
    env: {
      local: { b: { type: 'boolean', value: true, boxed: true } },
      heap: {},
    },
  },
  {
    code: `"" + c`,
    output: { type: '__str', value: 'A' },
    env: {
      local: { c: { type: 'char', value: 65, boxed: true } },
      heap: {},
    },
  },
  {
    code: `"" + l`,
    output: { type: '__str', value: '1000' },
    env: {
      local: { l: { type: 'long', value: '1000', boxed: true } },
      heap: {},
    },
  },
  {
    code: `"" + d`,
    output: { type: '__str', value: '1.5' },
    env: {
      local: { d: { type: 'double', value: 1.5, boxed: true } },
      heap: {},
    },
  },
  {
    code: `"" + f`,
    output: { type: '__str', value: '1.5' },
    env: {
      local: { f: { type: 'float', value: 1.5, boxed: true } },
      heap: {},
    },
  },
  {
    code: `"" + sh`,
    output: { type: '__str', value: '100' },
    env: {
      local: { sh: { type: 'short', value: 100, boxed: true } },
      heap: {},
    },
  },
  {
    code: `"" + by`,
    output: { type: '__str', value: '100' },
    env: {
      local: { by: { type: 'byte', value: 100, boxed: true } },
      heap: {},
    },
  },
  {
    code: `"" + n`,
    output: { type: '__str', value: 'null' },
    env: {
      local: { n: { type: 'null', value: null } },
      heap: {},
    },
  },
  // ------------------------- concatenation builds a fresh, non-interned String -------------------------
  {
    code: `("" + a) == ("" + a)`,
    output: { type: 'boolean', value: false },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `("" + a) == "1000"`,
    output: { type: 'boolean', value: false },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(a + "") == "1000"`,
    output: { type: 'boolean', value: false },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `("" + a) == (a + "")`,
    output: { type: 'boolean', value: false },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
]
