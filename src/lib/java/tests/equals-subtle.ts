import type { TestSuiteEntry } from '../../state/types'

export const equalsSubtle: TestSuiteEntry[] = [
  // ------------------------- dynamic dispatch: static Object, runtime class decides -------------------------
  // A ternary mixing a wrapper with a String has static type Object. `equals` must be
  // selected from the *runtime* heap class (Integer/String/Long/...), not from the static
  // Object. The interpreter resolves statically and lands on Object.equals, so these pin the
  // missing runtime dispatch.
  {
    code: `(true ? 1000 : "x").equals(1000)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? 1000 : "x").equals(2000)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? 1000 : "x").equals("1000")`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(false ? 1000 : "x").equals("x")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(false ? 1000 : "x").equals(1000)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(false ? 1000 : "x").equals("y")`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? 1000L : "x").equals(1000L)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? 1000L : "x").equals(1000)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? 'a' : "x").equals('a')`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? 'a' : "x").equals(97)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? true : "x").equals(true)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? true : "x").equals(1)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? 1.5 : "x").equals(1.5)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? 1.5f : "x").equals(1.5f)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? (byte) 1 : "x").equals((byte) 1)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? (short) 1 : "x").equals((short) 1)`,
    output: { type: 'boolean', value: true },
  },
  // Both sides are Object-typed; the runtime classes still decide.
  {
    code: `(true ? 1000 : "x").equals(true ? 1000 : "x")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? 1000 : "x").equals(true ? 2000 : "x")`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? 1000 : "x").equals(true ? "1000" : "y")`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(false ? 1000 : "x").equals(true ? 1000 : "x")`,
    output: { type: 'boolean', value: false },
  },
  // Receiver is Object-typed, argument is a boxed local.
  {
    code: `(true ? 1000 : "x").equals(a)`,
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? 1000 : "x").equals(a)`,
    env: {
      local: { a: { type: 'int', value: 2000, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  {
    code: `(false ? 1000 : "x").equals(a)`,
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  // ------------------------- argument side: Object-typed (lub) expression -------------------------
  // The argument autoboxes to its own wrapper; the receiver's static type is a concrete wrapper.
  {
    code: `a.equals(true ? 1000 : "x")`,
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `a.equals(true ? 2000 : "x")`,
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  {
    code: `a.equals(false ? 1000 : "x")`,
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  {
    code: `"x".equals(false ? 1000 : "x")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"x".equals(true ? 1000 : "x")`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `"x".equals(true ? 2000 : "x")`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `c.equals(true ? 'a' : "x")`,
    env: {
      local: { c: { type: 'char', value: 97, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `b.equals(true ? true : "x")`,
    env: {
      local: { b: { type: 'boolean', value: true, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `d.equals(true ? 1.5 : "x")`,
    env: {
      local: { d: { type: 'double', value: 1.5, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `l.equals(true ? 1000L : "x")`,
    env: {
      local: { l: { type: 'long', value: '1000', boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `l.equals(true ? 1000 : "x")`,
    env: {
      local: { l: { type: 'long', value: '1000', boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  // ------------------------- value equality vs reference identity (autobox cache) -------------------------
  // 128 is outside the -128..127 Integer cache: equals is true, == is false.
  {
    code: `a.equals(b)`,
    env: {
      local: {
        a: { type: 'int', value: 128, boxed: true },
        b: { type: 'int', value: 128, boxed: true },
      },
      heap: {},
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `a == b`,
    env: {
      local: {
        a: { type: 'int', value: 128, boxed: true },
        b: { type: 'int', value: 128, boxed: true },
      },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  // 127 and -128 are inside the cache: both equals and == are true.
  {
    code: `a.equals(b)`,
    env: {
      local: {
        a: { type: 'int', value: 127, boxed: true },
        b: { type: 'int', value: 127, boxed: true },
      },
      heap: {},
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `a == b`,
    env: {
      local: {
        a: { type: 'int', value: 127, boxed: true },
        b: { type: 'int', value: 127, boxed: true },
      },
      heap: {},
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `a.equals(b)`,
    env: {
      local: {
        a: { type: 'int', value: -128, boxed: true },
        b: { type: 'int', value: -128, boxed: true },
      },
      heap: {},
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `a == b`,
    env: {
      local: {
        a: { type: 'int', value: -128, boxed: true },
        b: { type: 'int', value: -128, boxed: true },
      },
      heap: {},
    },
    output: { type: 'boolean', value: true },
  },
  // ------------------------- String content equality vs identity after concatenation -------------------------
  {
    code: `(s + "d").equals("abcd")`,
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: { heap0: { class: 'java.lang.String', value: 'abc' } },
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `"abcd".equals(s + "d")`,
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: { heap0: { class: 'java.lang.String', value: 'abc' } },
    },
    output: { type: 'boolean', value: true },
  },
  // The concatenation result is a fresh, non-interned String, so == is false.
  {
    code: `(s + "d") == "abcd"`,
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: { heap0: { class: 'java.lang.String', value: 'abc' } },
    },
    output: { type: 'boolean', value: false },
  },
  // ------------------------- further argument subtleties -------------------------
  // A null-valued variable is a legal Object argument and never equal.
  {
    code: `a.equals(n)`,
    env: {
      local: {
        a: { type: 'int', value: 1000, boxed: true },
        n: { type: 'null', value: null },
      },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  {
    code: `"abc".equals(n)`,
    env: {
      local: { n: { type: 'null', value: null } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  // Character and Integer with the same numeric value are different wrappers.
  {
    code: `a.equals(c)`,
    env: {
      local: {
        a: { type: 'int', value: 97, boxed: true },
        c: { type: 'char', value: 97, boxed: true },
      },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  {
    code: `"a".equals(c)`,
    env: {
      local: { c: { type: 'char', value: 97, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  {
    code: `c.equals("a")`,
    env: {
      local: { c: { type: 'char', value: 97, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  {
    code: `b.equals(0)`,
    env: {
      local: { b: { type: 'boolean', value: true, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  {
    code: `a.equals(0.0)`,
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  {
    code: `l.equals((long) 1000)`,
    env: {
      local: { l: { type: 'long', value: '1000', boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: true },
  },
  // An integral double does not equal the Integer with the same value.
  {
    code: `d.equals(1)`,
    env: {
      local: { d: { type: 'double', value: 1.0, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  {
    code: `d.equals(1.0)`,
    env: {
      local: { d: { type: 'double', value: 1.0, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `f.equals(1)`,
    env: {
      local: { f: { type: 'float', value: 1.0, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  {
    code: `f.equals(1.0f)`,
    env: {
      local: { f: { type: 'float', value: 1.0, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: true },
  },
  // Bit semantics for zero and NaN as *arguments* (receiver supplied via env).
  {
    code: `d.equals(0.0)`,
    env: {
      local: { d: { type: 'double', value: 0.0, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `d.equals(-0.0)`,
    env: {
      local: { d: { type: 'double', value: 0.0, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  {
    code: `d.equals(0.0 / 0.0)`,
    env: {
      local: { d: { type: 'double', value: 0.0, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  {
    code: `f.equals(0.0f)`,
    env: {
      local: { f: { type: 'float', value: 0.0, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `f.equals(-0.0f)`,
    env: {
      local: { f: { type: 'float', value: 0.0, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  // Long values survive the string round-trip at the extremes.
  {
    code: `l.equals(9223372036854775807L)`,
    env: {
      local: { l: { type: 'long', value: '9223372036854775807', boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `l.equals(9223372036854775806L)`,
    env: {
      local: { l: { type: 'long', value: '9223372036854775807', boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  {
    code: `by.equals((byte) -128)`,
    env: {
      local: { by: { type: 'byte', value: -128, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: true },
  },
  // Character covers the full 16-bit range; the int 65535 is a different wrapper.
  {
    code: `c.equals((char) 65535)`,
    env: {
      local: { c: { type: 'char', value: 65535, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `c.equals(65535)`,
    env: {
      local: { c: { type: 'char', value: 65535, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  // A boxed ternary (null branch) is an Integer, unlike a same-type int ternary below.
  {
    code: `(true ? 1 : null).equals(1)`,
    output: { type: 'boolean', value: true },
  },
]
