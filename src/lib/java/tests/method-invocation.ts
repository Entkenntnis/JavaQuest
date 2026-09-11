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
  // Equal by content even when the receiver is not the interned literal.
  {
    code: `s.equals("abc")`,
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: { heap0: { class: 'java.lang.String', value: 'abc' } },
    },
    output: { type: 'boolean', value: true },
  },
  // ------------------------- equals(Object): non-String arguments -------------------------
  // null is a valid Object argument and never equals a non-null String.
  {
    code: `"abc".equals(null)`,
    output: { type: 'boolean', value: false },
  },
  // The int argument boxes to Integer; it is not a String, so false.
  {
    code: `"abc".equals(123)`,
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
  // ------------------------- error phases -------------------------
  // Wrong arity -> javac rejects it.
  {
    code: `"abc".equals()`,
    error: 'compile',
  },
  // Unknown method -> javac rejects it.
  {
    code: `"abc".foo()`,
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
  // Invoking on a null receiver compiles but throws NullPointerException at runtime.
  {
    code: `s.equals("abc")`,
    env: {
      local: { s: { type: 'null', value: null } },
      heap: {},
    },
    error: 'runtime',
  },
]
