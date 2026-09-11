import type { TestSuiteEntry } from '../../state/types'

export const toStringCases: TestSuiteEntry[] = [
  // ==================== METHOD INVOCATION: toString ====================
  // `toString` is `String toString()` on java.lang.Object, overridden by String (returns
  // `this`) and by the wrappers (the value's text). The Object receiver is boxed by the
  // evaluator before dispatch, so a primitive/boxed receiver reaches the same method. These
  // entries pin the identity contract of String.toString, the text of every wrapper type
  // (including MIN/MAX and the float/double specials) and the compile/runtime error phases.
  // ------------------------- String.toString returns the receiver itself -------------------------
  {
    code: `"abc".toString()`,
    output: { type: '__str', value: 'abc' },
  },
  {
    code: `"".toString()`,
    output: { type: '__str', value: '' },
  },
  {
    code: `s.toString()`,
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: { heap0: { class: 'java.lang.String', value: 'abc' } },
    },
    output: { type: '__str', value: 'abc' },
  },
  // String.toString is the identity: == holds for the same object, and a non-interned
  // receiver stays non-interned (unlike concatenation, which builds a fresh String).
  {
    code: `"abc".toString() == "abc"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `s.toString() == s`,
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: { heap0: { class: 'java.lang.String', value: 'abc' } },
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `"abc".toString() == s`,
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: { heap0: { class: 'java.lang.String', value: 'abc' } },
    },
    output: { type: 'boolean', value: false },
  },
  // The result is a normal String, so content equality applies.
  {
    code: `"abc".toString().equals("abc")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `s.toString().equals(s)`,
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: { heap0: { class: 'java.lang.String', value: 'abc' } },
    },
    output: { type: 'boolean', value: true },
  },
  // Chained calls stay stable.
  {
    code: `"abc".toString().toString()`,
    output: { type: '__str', value: 'abc' },
  },
  // ------------------------- wrapper toString: the value's text -------------------------
  {
    code: `a.toString()`,
    env: { local: { a: { type: 'int', value: 1000, boxed: true } }, heap: {} },
    output: { type: '__str', value: '1000' },
  },
  {
    code: `a.toString()`,
    env: { local: { a: { type: 'int', value: 0, boxed: true } }, heap: {} },
    output: { type: '__str', value: '0' },
  },
  {
    code: `a.toString()`,
    env: { local: { a: { type: 'int', value: -5, boxed: true } }, heap: {} },
    output: { type: '__str', value: '-5' },
  },
  {
    code: `a.toString()`,
    env: {
      local: { a: { type: 'int', value: 2147483647, boxed: true } },
      heap: {},
    },
    output: { type: '__str', value: '2147483647' },
  },
  {
    code: `a.toString()`,
    env: {
      local: { a: { type: 'int', value: -2147483648, boxed: true } },
      heap: {},
    },
    output: { type: '__str', value: '-2147483648' },
  },
  {
    code: `b.toString()`,
    env: {
      local: { b: { type: 'boolean', value: true, boxed: true } },
      heap: {},
    },
    output: { type: '__str', value: 'true' },
  },
  {
    code: `b.toString()`,
    env: {
      local: { b: { type: 'boolean', value: false, boxed: true } },
      heap: {},
    },
    output: { type: '__str', value: 'false' },
  },
  {
    code: `c.toString()`,
    env: { local: { c: { type: 'char', value: 65, boxed: true } }, heap: {} },
    output: { type: '__str', value: 'A' },
  },
  {
    code: `c.toString()`,
    env: { local: { c: { type: 'char', value: 200, boxed: true } }, heap: {} },
    output: { type: '__str', value: 'È' },
  },
  // Control characters survive the text conversion (the harness escapes them).
  {
    code: `c.toString()`,
    env: { local: { c: { type: 'char', value: 0, boxed: true } }, heap: {} },
    output: { type: '__str', value: '\u0000' },
  },
  {
    code: `c.toString()`,
    env: { local: { c: { type: 'char', value: 9, boxed: true } }, heap: {} },
    output: { type: '__str', value: '\t' },
  },
  {
    code: `l.toString()`,
    env: {
      local: { l: { type: 'long', value: '1000', boxed: true } },
      heap: {},
    },
    output: { type: '__str', value: '1000' },
  },
  {
    code: `l.toString()`,
    env: {
      local: {
        l: { type: 'long', value: '-9223372036854775808', boxed: true },
      },
      heap: {},
    },
    output: { type: '__str', value: '-9223372036854775808' },
  },
  {
    code: `l.toString()`,
    env: {
      local: {
        l: { type: 'long', value: '9223372036854775807', boxed: true },
      },
      heap: {},
    },
    output: { type: '__str', value: '9223372036854775807' },
  },
  {
    code: `f.toString()`,
    env: { local: { f: { type: 'float', value: 1.5, boxed: true } }, heap: {} },
    output: { type: '__str', value: '1.5' },
  },
  {
    code: `f.toString()`,
    env: { local: { f: { type: 'float', value: 0.0, boxed: true } }, heap: {} },
    output: { type: '__str', value: '0.0' },
  },
  {
    code: `d.toString()`,
    env: {
      local: { d: { type: 'double', value: 1.5, boxed: true } },
      heap: {},
    },
    output: { type: '__str', value: '1.5' },
  },
  {
    code: `d.toString()`,
    env: { local: { d: { type: 'double', value: 0.0, boxed: true } }, heap: {} },
    output: { type: '__str', value: '0.0' },
  },
  {
    code: `d.toString()`,
    env: {
      local: { d: { type: 'double', value: 1.0e10, boxed: true } },
      heap: {},
    },
    output: { type: '__str', value: '1.0E10' },
  },
  // Extreme finite magnitudes use the scientific notation of Double/Float.toString.
  {
    code: `d.toString()`,
    env: {
      local: { d: { type: 'double', value: 1.7976931348623157e308, boxed: true } },
      heap: {},
    },
    output: { type: '__str', value: '1.7976931348623157E308' },
  },
  {
    code: `d.toString()`,
    env: {
      local: { d: { type: 'double', value: 5e-324, boxed: true } },
      heap: {},
    },
    output: { type: '__str', value: '4.9E-324' },
  },
  {
    code: `f.toString()`,
    env: {
      local: { f: { type: 'float', value: 3.4028235e38, boxed: true } },
      heap: {},
    },
    output: { type: '__str', value: '3.4028235E38' },
  },
  {
    code: `by.toString()`,
    env: { local: { by: { type: 'byte', value: 100, boxed: true } }, heap: {} },
    output: { type: '__str', value: '100' },
  },
  {
    code: `by.toString()`,
    env: {
      local: { by: { type: 'byte', value: -128, boxed: true } },
      heap: {},
    },
    output: { type: '__str', value: '-128' },
  },
  {
    code: `sh.toString()`,
    env: {
      local: { sh: { type: 'short', value: 100, boxed: true } },
      heap: {},
    },
    output: { type: '__str', value: '100' },
  },
  {
    code: `sh.toString()`,
    env: {
      local: { sh: { type: 'short', value: -32768, boxed: true } },
      heap: {},
    },
    output: { type: '__str', value: '-32768' },
  },
  // ------------------------- boxed-expression receivers -------------------------
  {
    code: `(true ? 1000 : null).toString()`,
    output: { type: '__str', value: '1000' },
  },
  {
    code: `(true ? 'A' : null).toString()`,
    output: { type: '__str', value: 'A' },
  },
  {
    code: `(true ? 1.5 : null).toString()`,
    output: { type: '__str', value: '1.5' },
  },
  {
    code: `(true ? true : null).toString()`,
    output: { type: '__str', value: 'true' },
  },
  // A ternary with a String branch has lub type Object; the runtime wrapper still decides
  // the text (virtual dispatch).
  {
    code: `(true ? 1000 : "x").toString()`,
    output: { type: '__str', value: '1000' },
  },
  {
    code: `(true ? "a" : 1000).toString()`,
    output: { type: '__str', value: 'a' },
  },
  // ------------------------- float/double specials -------------------------
  {
    code: `(true ? 0.0 / 0.0 : null).toString()`,
    output: { type: '__str', value: 'NaN' },
  },
  {
    code: `(true ? 1.0 / 0.0 : null).toString()`,
    output: { type: '__str', value: 'Infinity' },
  },
  {
    code: `(true ? -1.0 / 0.0 : null).toString()`,
    output: { type: '__str', value: '-Infinity' },
  },
  {
    code: `(true ? -0.0 : null).toString()`,
    output: { type: '__str', value: '-0.0' },
  },
  {
    code: `(true ? 0.0f / 0.0f : null).toString()`,
    output: { type: '__str', value: 'NaN' },
  },
  {
    code: `(true ? 1.0f / 0.0f : null).toString()`,
    output: { type: '__str', value: 'Infinity' },
  },
  // ------------------------- consistency with string concatenation -------------------------
  // `"" + a` uses String.valueOf semantics; it must agree with a.toString().
  {
    code: `("" + a).equals(a.toString())`,
    env: { local: { a: { type: 'int', value: 1000, boxed: true } }, heap: {} },
    output: { type: 'boolean', value: true },
  },
  {
    code: `a.toString() == ("" + a)`,
    env: { local: { a: { type: 'int', value: 1000, boxed: true } }, heap: {} },
    output: { type: 'boolean', value: false },
  },
  // Each call builds a fresh String, so identity does not hold ...
  {
    code: `a.toString() == a.toString()`,
    env: { local: { a: { type: 'int', value: 1000, boxed: true } }, heap: {} },
    output: { type: 'boolean', value: false },
  },
  // ... but content does.
  {
    code: `a.toString().equals(a.toString())`,
    env: { local: { a: { type: 'int', value: 1000, boxed: true } }, heap: {} },
    output: { type: 'boolean', value: true },
  },
  // ------------------------- nested / chained calls -------------------------
  {
    code: `a.toString().toString()`,
    env: { local: { a: { type: 'int', value: 1000, boxed: true } }, heap: {} },
    output: { type: '__str', value: '1000' },
  },
  {
    code: `a.toString().equals("1000")`,
    env: { local: { a: { type: 'int', value: 1000, boxed: true } }, heap: {} },
    output: { type: 'boolean', value: true },
  },
  // A String is not an Integer, even when the text matches.
  {
    code: `a.toString().equals(a)`,
    env: { local: { a: { type: 'int', value: 1000, boxed: true } }, heap: {} },
    output: { type: 'boolean', value: false },
  },
  {
    code: `"abc".equals(s.toString())`,
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: { heap0: { class: 'java.lang.String', value: 'abc' } },
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `a.equals(a.toString())`,
    env: { local: { a: { type: 'int', value: 1000, boxed: true } }, heap: {} },
    output: { type: 'boolean', value: false },
  },
  // ------------------------- error phases -------------------------
  // toString takes no arguments. (`a.toString(1)` is *not* an error in Java: it resolves
  // the static Integer.toString(int) through the instance. Static methods are out of scope
  // here, so we pin a type error that has no static overload to fall back on.)
  {
    code: `a.toString("x")`,
    env: { local: { a: { type: 'int', value: 1000, boxed: true } }, heap: {} },
    error: 'compile',
  },
  {
    code: `"abc".toString(1)`,
    error: 'compile',
  },
  {
    code: `a.toString(null)`,
    env: { local: { a: { type: 'int', value: 1000, boxed: true } }, heap: {} },
    error: 'compile',
  },
  // A primitive cannot be dereferenced.
  {
    code: `n.toString()`,
    env: { local: { n: { type: 'int', value: 5 } }, heap: {} },
    error: 'compile',
  },
  // The null type cannot be dereferenced ...
  {
    code: `null.toString()`,
    error: 'compile',
  },
  // ... while a null-valued variable compiles and NPEs at runtime.
  {
    code: `s.toString()`,
    env: { local: { s: { type: 'null', value: null } }, heap: {} },
    error: 'runtime',
  },
]
