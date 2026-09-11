import type { TestSuiteEntry } from '../../state/types'

export const methodInvocation: TestSuiteEntry[] = [
  // ==================== METHOD INVOCATION: equals ====================
  // `equals` is `boolean equals(Object)` on java.lang.Object, overridden by String (content)
  // and the wrappers (same wrapper type + value). The Object parameter makes every argument
  // assignable, so a non-String argument is simply not equal. These entries pin content-vs-
  // identity, argument boxing, and the compile/runtime error phases.
  // ------------------------- String.equals: content equality -------------------------
  {
    code: `"abc".equals("abc")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"abc".equals("abd")`,
    output: { type: 'boolean', value: false },
  },
  // equals is case-sensitive and length-sensitive.
  {
    code: `"abc".equals("ABC")`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `"abc".equals("abcd")`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `"abc".equals("")`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `"".equals("")`,
    output: { type: 'boolean', value: true },
  },
  // Equal by content even when the receiver is not the interned literal.
  {
    code: `s.equals("abc")`,
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: { heap0: { class: 'java.lang.String', value: 'abc' } },
    },
    output: { type: 'boolean', value: true },
  },
  // Two distinct (non-interned) objects with the same content are equal ...
  {
    code: `s.equals(t)`,
    env: {
      local: {
        s: { type: 'reference', ref: 'heap0' },
        t: { type: 'reference', ref: 'heap1' },
      },
      heap: {
        heap0: { class: 'java.lang.String', value: 'abc' },
        heap1: { class: 'java.lang.String', value: 'abc' },
      },
    },
    output: { type: 'boolean', value: true },
  },
  // ... but `==` compares identity, not content.
  {
    code: `s == "abc"`,
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: { heap0: { class: 'java.lang.String', value: 'abc' } },
    },
    output: { type: 'boolean', value: false },
  },
  {
    code: `s.equals(t)`,
    env: {
      local: {
        s: { type: 'reference', ref: 'heap0' },
        t: { type: 'reference', ref: 'heap1' },
      },
      heap: {
        heap0: { class: 'java.lang.String', value: 'abc' },
        heap1: { class: 'java.lang.String', value: 'abd' },
      },
    },
    output: { type: 'boolean', value: false },
  },
  // The argument may be the non-interned object as well.
  {
    code: `"abc".equals(s)`,
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: { heap0: { class: 'java.lang.String', value: 'abc' } },
    },
    output: { type: 'boolean', value: true },
  },
  // Interned receiver, same content.
  {
    code: `s.equals("abc")`,
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: {
        heap0: { class: 'java.lang.String', value: 'abc', isInterned: true },
      },
    },
    output: { type: 'boolean', value: true },
  },
  // ------------------------- equals(Object): non-String arguments -------------------------
  // null is a valid Object argument and never equals a non-null String.
  {
    code: `"abc".equals(null)`,
    output: { type: 'boolean', value: false },
  },
  // A null-valued variable is a reference; it is a legal argument and yields false.
  {
    code: `"abc".equals(s)`,
    env: {
      local: { s: { type: 'null', value: null } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  // The int argument boxes to Integer; it is not a String, so false.
  {
    code: `"abc".equals(123)`,
    output: { type: 'boolean', value: false },
  },
  // A boxed argument is a wrapper, not a String, so false.
  {
    code: `"abc".equals(a)`,
    env: {
      local: { a: { type: 'int', value: 123, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  // ------------------------- wrapper equals: value equality -------------------------
  // Integer.equals compares values, unlike == which compares identity (1000 is outside the
  // -128..127 cache, so `a == b` is false while `a.equals(b)` is true).
  {
    code: `a.equals(b)`,
    env: {
      local: {
        a: { type: 'int', value: 1000, boxed: true },
        b: { type: 'int', value: 1000, boxed: true },
      },
      heap: {},
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `a.equals(b)`,
    env: {
      local: {
        a: { type: 'int', value: 1000, boxed: true },
        b: { type: 'int', value: 2000, boxed: true },
      },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  // equals is reflexive.
  {
    code: `a.equals(a)`,
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: true },
  },
  // A wrapper only equals the same wrapper type: Integer(1000) vs Long(1000) is false.
  {
    code: `a.equals(b)`,
    env: {
      local: {
        a: { type: 'int', value: 1000, boxed: true },
        b: { type: 'long', value: '1000', boxed: true },
      },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  {
    code: `b.equals(a)`,
    env: {
      local: {
        a: { type: 'int', value: 1000, boxed: true },
        b: { type: 'long', value: '1000', boxed: true },
      },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  // ------------------------- wrapper equals: primitive argument autoboxing -------------------------
  // The Object parameter autoboxes a primitive argument to its wrapper, so a matching
  // primitive is equal even though it is a fresh (uncached) wrapper at runtime.
  {
    code: `a.equals(1000)`,
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `a.equals(1000)`,
    env: {
      local: { a: { type: 'int', value: 2000, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  // A cached value boxes to the cached wrapper; still value-equal.
  {
    code: `a.equals(1)`,
    env: {
      local: { a: { type: 'int', value: 1, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: true },
  },
  // A primitive of a different wrapper type boxes to that other wrapper -> false.
  {
    code: `a.equals(1000L)`,
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  {
    code: `a.equals((short) 1000)`,
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  {
    code: `a.equals('a')`,
    env: {
      local: { a: { type: 'int', value: 97, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  // A null argument is never equal.
  {
    code: `a.equals(null)`,
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  // ------------------------- wrapper equals: per wrapper type -------------------------
  // Byte: the whole range is cached, but equals is value equality anyway.
  {
    code: `a.equals((byte) 1)`,
    env: {
      local: { a: { type: 'byte', value: 1, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `a.equals((byte) 2)`,
    env: {
      local: { a: { type: 'byte', value: 1, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  {
    code: `a.equals(1)`,
    env: {
      local: { a: { type: 'byte', value: 1, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  // Short.
  {
    code: `a.equals((short) 1)`,
    env: {
      local: { a: { type: 'short', value: 1, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `a.equals((byte) 1)`,
    env: {
      local: { a: { type: 'short', value: 1, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  {
    code: `a.equals(1)`,
    env: {
      local: { a: { type: 'short', value: 1, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  // Character.
  {
    code: `c.equals('a')`,
    env: {
      local: { c: { type: 'char', value: 97, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `c.equals('b')`,
    env: {
      local: { c: { type: 'char', value: 97, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  {
    code: `c.equals(97)`,
    env: {
      local: { c: { type: 'char', value: 97, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  {
    code: `c.equals((char) 97)`,
    env: {
      local: { c: { type: 'char', value: 97, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: true },
  },
  // Long.
  {
    code: `l.equals(1000L)`,
    env: {
      local: { l: { type: 'long', value: '1000', boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `l.equals(1000)`,
    env: {
      local: { l: { type: 'long', value: '1000', boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  {
    code: `l.equals(2000L)`,
    env: {
      local: { l: { type: 'long', value: '1000', boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  // Float: the argument must be a float, a double boxes to Double -> false.
  {
    code: `f.equals(1.5f)`,
    env: {
      local: { f: { type: 'float', value: 1.5, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `f.equals(1.5)`,
    env: {
      local: { f: { type: 'float', value: 1.5, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  {
    code: `f.equals(2.5f)`,
    env: {
      local: { f: { type: 'float', value: 1.5, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  // Double: a float argument boxes to Float -> false.
  {
    code: `d.equals(1.5)`,
    env: {
      local: { d: { type: 'double', value: 1.5, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `d.equals(1.5f)`,
    env: {
      local: { d: { type: 'double', value: 1.5, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  {
    code: `d.equals(2.5)`,
    env: {
      local: { d: { type: 'double', value: 1.5, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  // Boolean: the wrapper singletons are value-equal.
  {
    code: `b.equals(true)`,
    env: {
      local: { b: { type: 'boolean', value: true, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `b.equals(false)`,
    env: {
      local: { b: { type: 'boolean', value: true, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  {
    code: `b.equals(1)`,
    env: {
      local: { b: { type: 'boolean', value: true, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  {
    code: `b.equals(b)`,
    env: {
      local: { b: { type: 'boolean', value: true, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: true },
  },
  // ------------------------- Float/Double: bit-pattern equality -------------------------
  // Double.equals uses doubleToLongBits: NaN equals NaN, +0.0 does not equal -0.0.
  // The receiver is produced by a ternary (with a null branch) so it boxes to a wrapper.
  {
    code: `(true ? 0.0 / 0.0 : null).equals(0.0 / 0.0)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? 0.0f / 0.0f : null).equals(0.0f / 0.0f)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? 1.0 / 0.0 : null).equals(1.0 / 0.0)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? -0.0 : null).equals(0.0)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? 0.0 : null).equals(-0.0)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? -0.0f : null).equals(0.0f)`,
    output: { type: 'boolean', value: false },
  },
  // The plain == of those same values behaves the opposite way (0.0 == -0.0, NaN != NaN).
  {
    code: `0.0 == -0.0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(0.0 / 0.0) == (0.0 / 0.0)`,
    output: { type: 'boolean', value: false },
  },
  // ------------------------- boxed-expression receivers and arguments -------------------------
  // A ternary with a null branch is a boxed wrapper expression and can be a receiver ...
  {
    code: `(true ? 1000 : null).equals(1000)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? 1000 : null).equals(2000)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(false ? null : 1000).equals(1000)`,
    output: { type: 'boolean', value: true },
  },
  // ... or an argument.
  {
    code: `a.equals(true ? 1000 : null)`,
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: true },
  },
  {
    code: `a.equals(false ? 1000 : null)`,
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: false },
  },
  // ------------------------- error phases -------------------------
  // Wrong arity -> javac rejects it.
  {
    code: `"abc".equals()`,
    error: 'compile',
  },
  {
    code: `a.equals()`,
    env: {
      local: { a: { type: 'int', value: 1, boxed: true } },
      heap: {},
    },
    error: 'compile',
  },
  {
    code: `a.equals(1, 2)`,
    env: {
      local: { a: { type: 'int', value: 1, boxed: true } },
      heap: {},
    },
    error: 'compile',
  },
  // Unknown method -> javac rejects it.
  {
    code: `"abc".foo()`,
    error: 'compile',
  },
  {
    code: `a.foo()`,
    env: {
      local: { a: { type: 'int', value: 1, boxed: true } },
      heap: {},
    },
    error: 'compile',
  },
  // A primitive cannot be dereferenced -> javac rejects it.
  {
    code: `n.equals(5)`,
    env: {
      local: { n: { type: 'int', value: 5 } },
      heap: {},
    },
    error: 'compile',
  },
  // The null type cannot be dereferenced -> javac rejects the bare literal ...
  {
    code: `null.equals(1)`,
    error: 'compile',
  },
  // ... while a null-valued variable has a reference type and compiles; the NPE is runtime.
  {
    code: `s.equals("abc")`,
    env: {
      local: { s: { type: 'null', value: null } },
      heap: {},
    },
    error: 'runtime',
  },
  // A same-type numeric ternary stays a *primitive* (no boxed branch), so it cannot be
  // dereferenced -- in contrast to `(true ? 1 : null)` above.
  {
    code: `(true ? 1 : 2).equals(1)`,
    error: 'compile',
  },
  // Numeric promotion of a mixed ternary makes it long/double, likewise not dereferenceable.
  {
    code: `(true ? 1000 : 1000L).equals(1000)`,
    error: 'compile',
  },
  {
    code: `(true ? 1000 : 1.5).equals(1000)`,
    error: 'compile',
  },
  // The null type cannot be dereferenced, even against null.
  {
    code: `null.equals(null)`,
    error: 'compile',
  },
  // A null-valued variable compiles; the NPE is runtime.
  {
    code: `s.equals(null)`,
    env: {
      local: { s: { type: 'null', value: null } },
      heap: {},
    },
    error: 'runtime',
  },
  // equals takes exactly one argument.
  {
    code: `"abc".equals(1, 2)`,
    error: 'compile',
  },
]
