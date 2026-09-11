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
  // ------------------------- toString vs equals: the String boundary erases the wrapper class -------------------------
  // toString() always produces a java.lang.String, so two *different* wrapper types whose
  // values print identically yield equal Strings, even though their own equals() is
  // class-sensitive and false. Integer 1000 vs Long 1000:
  {
    code: `a.toString().equals(l.toString())`,
    env: {
      local: {
        a: { type: 'int', value: 1000, boxed: true },
        l: { type: 'long', value: '1000', boxed: true },
      },
      heap: {},
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `a.equals(l)`,
    env: {
      local: {
        a: { type: 'int', value: 1000, boxed: true },
        l: { type: 'long', value: '1000', boxed: true },
      },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  {
    code: `l.equals(a)`,
    env: {
      local: {
        a: { type: 'int', value: 1000, boxed: true },
        l: { type: 'long', value: '1000', boxed: true },
      },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  // Float 1.5 vs Double 1.5: same text, different wrapper.
  {
    code: `f.toString().equals(d.toString())`,
    env: {
      local: {
        f: { type: 'float', value: 1.5, boxed: true },
        d: { type: 'double', value: 1.5, boxed: true },
      },
      heap: {},
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `f.equals(d)`,
    env: {
      local: {
        f: { type: 'float', value: 1.5, boxed: true },
        d: { type: 'double', value: 1.5, boxed: true },
      },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  // Byte 100 vs Short 100.
  {
    code: `by.toString().equals(sh.toString())`,
    env: {
      local: {
        by: { type: 'byte', value: 100, boxed: true },
        sh: { type: 'short', value: 100, boxed: true },
      },
      heap: {},
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `by.equals(sh)`,
    env: {
      local: {
        by: { type: 'byte', value: 100, boxed: true },
        sh: { type: 'short', value: 100, boxed: true },
      },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  // Same bridge for a ternary that boxes to Integer vs Long.
  {
    code: `(true ? 1000 : null).toString().equals((true ? 1000L : null).toString())`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? 1000 : null).equals(true ? 1000L : null)`,
    output: { type: 'boolean', value: false },
  },
  // Character and Boolean only bridge through their textual form: the wrapper equals a
  // String never holds, the toString() of the wrapper equals the same String always does.
  {
    code: `c.toString().equals("a")`,
    env: { local: { c: { type: 'char', value: 97, boxed: true } }, heap: {} },
    output: { type: 'boolean', value: true },
  },
  {
    code: `"a".equals(c.toString())`,
    env: { local: { c: { type: 'char', value: 97, boxed: true } }, heap: {} },
    output: { type: 'boolean', value: true },
  },
  {
    code: `b.toString().equals("true")`,
    env: {
      local: { b: { type: 'boolean', value: true, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `b.equals("true")`,
    env: {
      local: { b: { type: 'boolean', value: true, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  // A String and a wrapper with matching text: the toString bridge is symmetric, the
  // wrapper equals is not. `s.toString()` is the identity, so it behaves like `s`.
  {
    code: `a.toString().equals(s)`,
    env: {
      local: {
        a: { type: 'int', value: 1000, boxed: true },
        s: { type: 'reference', ref: 'heap0' },
      },
      heap: { heap0: { class: 'java.lang.String', value: '1000' } },
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `s.equals(a.toString())`,
    env: {
      local: {
        a: { type: 'int', value: 1000, boxed: true },
        s: { type: 'reference', ref: 'heap0' },
      },
      heap: { heap0: { class: 'java.lang.String', value: '1000' } },
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `s.toString().equals(a)`,
    env: {
      local: {
        a: { type: 'int', value: 1000, boxed: true },
        s: { type: 'reference', ref: 'heap0' },
      },
      heap: { heap0: { class: 'java.lang.String', value: '1000' } },
    },
    output: { type: 'boolean', value: false },
  },
  {
    code: `a.equals(s)`,
    env: {
      local: {
        a: { type: 'int', value: 1000, boxed: true },
        s: { type: 'reference', ref: 'heap0' },
      },
      heap: { heap0: { class: 'java.lang.String', value: '1000' } },
    },
    output: { type: 'boolean', value: false },
  },
  // Signed zero and NaN: toString/equals preserve the sign / the bit pattern, unlike
  // numeric ==. -0.0 prints "-0.0" and is not equal to "0.0"; NaN prints "NaN".
  {
    code: `(true ? -0.0 : null).toString().equals("-0.0")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? -0.0 : null).toString().equals("0.0")`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? 0.0 / 0.0 : null).toString().equals("NaN")`,
    output: { type: 'boolean', value: true },
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
