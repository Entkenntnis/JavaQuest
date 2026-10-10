import type { TestSuiteEntry } from '../../state/types'
import {
  arrayEnv,
  arrayEnvWithLocals,
  arrayObject,
  booleans,
  ints,
  longs,
} from './array-fixtures.ts'

// ==================== ARRAY FIELD ACCESS: `.length` ====================
// `arr.length` is the first slice of FieldAccess: a public final `int` field that
// every array carries. The interpreter does not implement field access yet, so this
// file is currently red in the Suite UI while remaining the source of truth for Java
// semantics. It is validated by the real-JDK harness (`npm run cross-check`).
//
// `length` has static type `int`, so it composes like any other int: arithmetic
// promotes it, casts narrow/widen it, string concatenation converts it, and it can
// bound a later index. Unlike a String's `length()`, an array's `length` is a field
// without parentheses, and it is `final`, so assigning to it is a compile error.
// Reading `.length` off a null array reference compiles but throws a
// NullPointerException at runtime.
//
// Error entries follow the house convention: compile errors are guarded behind
// `true || (...)` so the failure still happens at typecheck of the inner expression.

const a = arrayObject('int', ints([1, 2, 3]))
const b = arrayObject('int', ints([10, 20, 30, 40]))
const one = arrayObject('int', ints([42]))
const empty = arrayObject('int', ints([]))
const c = arrayObject('long', longs(['100', '200', '300']))
const d = arrayObject('boolean', booleans([true, false, true]))

export const arrayLength: TestSuiteEntry[] = [
  // ------------------------- basics -------------------------
  { code: `a.length`, output: { type: 'int', value: 3 }, env: arrayEnv({ a }) },
  { code: `b.length`, output: { type: 'int', value: 4 }, env: arrayEnv({ b }) },
  {
    code: `one.length`,
    output: { type: 'int', value: 1 },
    env: arrayEnv({ one }),
  },
  {
    code: `empty.length`,
    output: { type: 'int', value: 0 },
    env: arrayEnv({ empty }),
  },
  // length does not depend on the component type
  { code: `c.length`, output: { type: 'int', value: 3 }, env: arrayEnv({ c }) },
  { code: `d.length`, output: { type: 'int', value: 3 }, env: arrayEnv({ d }) },
  {
    code: `a.length + a.length`,
    output: { type: 'int', value: 6 },
    env: arrayEnv({ a }),
  },
  {
    code: `a.length + b.length`,
    output: { type: 'int', value: 7 },
    env: arrayEnv({ a, b }),
  },
  // ------------------------- arithmetic on the int result -------------------------
  { code: `a.length + 1`, output: { type: 'int', value: 4 }, env: arrayEnv({ a }) },
  { code: `a.length - 1`, output: { type: 'int', value: 2 }, env: arrayEnv({ a }) },
  { code: `a.length * 2`, output: { type: 'int', value: 6 }, env: arrayEnv({ a }) },
  {
    code: `b.length / a.length`,
    output: { type: 'int', value: 1 },
    env: arrayEnv({ a, b }),
  },
  {
    code: `b.length % a.length`,
    output: { type: 'int', value: 1 },
    env: arrayEnv({ a, b }),
  },
  {
    code: `b.length - a.length`,
    output: { type: 'int', value: 1 },
    env: arrayEnv({ a, b }),
  },
  // ------------------------- unary / bitwise / shift -------------------------
  { code: `-a.length`, output: { type: 'int', value: -3 }, env: arrayEnv({ a }) },
  { code: `+a.length`, output: { type: 'int', value: 3 }, env: arrayEnv({ a }) },
  { code: `~a.length`, output: { type: 'int', value: -4 }, env: arrayEnv({ a }) },
  { code: `a.length << 1`, output: { type: 'int', value: 6 }, env: arrayEnv({ a }) },
  { code: `a.length >> 1`, output: { type: 'int', value: 1 }, env: arrayEnv({ a }) },
  {
    code: `a.length & b.length`,
    output: { type: 'int', value: 0 },
    env: arrayEnv({ a, b }),
  },
  {
    code: `a.length | b.length`,
    output: { type: 'int', value: 7 },
    env: arrayEnv({ a, b }),
  },
  {
    code: `a.length ^ b.length`,
    output: { type: 'int', value: 7 },
    env: arrayEnv({ a, b }),
  },
  // ------------------------- numeric promotion -------------------------
  {
    code: `a.length + 1L`,
    output: { type: 'long', value: '4' },
    env: arrayEnv({ a }),
  },
  {
    code: `1L + a.length`,
    output: { type: 'long', value: '4' },
    env: arrayEnv({ a }),
  },
  {
    code: `a.length + 1.0f`,
    output: { type: 'float', value: 4 },
    env: arrayEnv({ a }),
  },
  {
    code: `a.length + 1.5`,
    output: { type: 'double', value: 4.5 },
    env: arrayEnv({ a }),
  },
  {
    code: `a.length + 'a'`,
    output: { type: 'int', value: 100 },
    env: arrayEnv({ a }),
  },
  // ------------------------- relational / equality -------------------------
  {
    code: `a.length == 3`,
    output: { type: 'boolean', value: true },
    env: arrayEnv({ a }),
  },
  {
    code: `a.length != 3`,
    output: { type: 'boolean', value: false },
    env: arrayEnv({ a }),
  },
  {
    code: `a.length == 3L`,
    output: { type: 'boolean', value: true },
    env: arrayEnv({ a }),
  },
  {
    code: `a.length == 3.0`,
    output: { type: 'boolean', value: true },
    env: arrayEnv({ a }),
  },
  {
    code: `a.length < b.length`,
    output: { type: 'boolean', value: true },
    env: arrayEnv({ a, b }),
  },
  {
    code: `b.length > a.length`,
    output: { type: 'boolean', value: true },
    env: arrayEnv({ a, b }),
  },
  {
    code: `a.length <= 3`,
    output: { type: 'boolean', value: true },
    env: arrayEnv({ a }),
  },
  {
    code: `one.length >= 2`,
    output: { type: 'boolean', value: false },
    env: arrayEnv({ one }),
  },
  // ------------------------- logical / conditional -------------------------
  {
    code: `a.length > 0 && a[0] == 1`,
    output: { type: 'boolean', value: true },
    env: arrayEnv({ a }),
  },
  {
    code: `a.length == 4 || a.length == 3`,
    output: { type: 'boolean', value: true },
    env: arrayEnv({ a }),
  },
  {
    code: `a.length == 3 ? a[0] : a[2]`,
    output: { type: 'int', value: 1 },
    env: arrayEnv({ a }),
  },
  {
    code: `d[0] ? a.length : b.length`,
    output: { type: 'int', value: 3 },
    env: arrayEnv({ a, b, d }),
  },
  {
    code: `d[1] ? a.length : b.length`,
    output: { type: 'int', value: 4 },
    env: arrayEnv({ a, b, d }),
  },
  // ------------------------- string conversion -------------------------
  {
    code: `"" + a.length`,
    output: { type: '__str', value: '3' },
    env: arrayEnv({ a }),
  },
  {
    code: `a.length + ""`,
    output: { type: '__str', value: '3' },
    env: arrayEnv({ a }),
  },
  {
    code: `"n=" + a.length`,
    output: { type: '__str', value: 'n=3' },
    env: arrayEnv({ a }),
  },
  {
    code: `a.length + "!" + b.length`,
    output: { type: '__str', value: '3!4' },
    env: arrayEnv({ a, b }),
  },
  // ------------------------- casts -------------------------
  {
    code: `(long) a.length`,
    output: { type: 'long', value: '3' },
    env: arrayEnv({ a }),
  },
  {
    code: `(byte) a.length`,
    output: { type: 'byte', value: 3 },
    env: arrayEnv({ a }),
  },
  {
    code: `(short) a.length`,
    output: { type: 'short', value: 3 },
    env: arrayEnv({ a }),
  },
  {
    code: `(char) a.length`,
    output: { type: 'char', value: 3 },
    env: arrayEnv({ a }),
  },
  {
    code: `(double) a.length`,
    output: { type: 'double', value: 3 },
    env: arrayEnv({ a }),
  },
  {
    code: `(float) a.length`,
    output: { type: 'float', value: 3 },
    env: arrayEnv({ a }),
  },
  {
    code: `(int) b.length`,
    output: { type: 'int', value: 4 },
    env: arrayEnv({ b }),
  },
  // ------------------------- length bounds a later index -------------------------
  {
    code: `a[a.length - 1]`,
    output: { type: 'int', value: 3 },
    env: arrayEnv({ a }),
  },
  {
    code: `b[a.length]`,
    output: { type: 'int', value: 40 },
    env: arrayEnv({ a, b }),
  },
  {
    code: `c[a.length - 1]`,
    output: { type: 'long', value: '300' },
    env: arrayEnv({ a, c }),
  },
  {
    code: `a[a.length]`,
    error: 'runtime',
    env: arrayEnv({ a }),
  },
  // ------------------------- an assignment yields the array, then its length is read -------------------------
  {
    code: `(a = b).length`,
    output: { type: 'int', value: 4 },
    env: arrayEnv({ a, b }),
  },
  {
    code: `(a = b).length + a.length`,
    output: { type: 'int', value: 8 },
    env: arrayEnv({ a, b }),
  },
  {
    code: `(a = b).length + b.length`,
    output: { type: 'int', value: 8 },
    env: arrayEnv({ a, b }),
  },
  // ------------------------- runtime: null array reference (NPE) -------------------------
  // `(a = null)` still has static type int[], so `.length` compiles and throws at run time.
  { code: `(a = null).length`, error: 'runtime', env: arrayEnv({ a }) },
  { code: `(a = null).length == 0`, error: 'runtime', env: arrayEnv({ a }) },
  {
    code: `true ? (a = null).length : 0`,
    error: 'runtime',
    env: arrayEnv({ a }),
  },
  // ------------------------- compile: `.length` is not a method -------------------------
  { code: `true || (a.length() == 0)`, error: 'compile', env: arrayEnv({ a }) },
  // ------------------------- compile: `length` is final, cannot be assigned -------------------------
  { code: `true || (a.length = 5)`, error: 'compile', env: arrayEnv({ a }) },
  { code: `true || (a.length += 1)`, error: 'compile', env: arrayEnv({ a }) },
  { code: `true || (a.length++)`, error: 'compile', env: arrayEnv({ a }) },
  // ------------------------- compile: unknown field -------------------------
  { code: `true || (a.nope == 0)`, error: 'compile', env: arrayEnv({ a }) },
  // ------------------------- compile: base is not an array -------------------------
  {
    code: `true || (i.length == 0)`,
    error: 'compile',
    env: arrayEnvWithLocals({}, { i: { type: 'int', value: 0 } }),
  },
  {
    code: `true || (lo.length == 0)`,
    error: 'compile',
    env: arrayEnvWithLocals({}, { lo: { type: 'long', value: '0' } }),
  },
  {
    code: `true || (bo.length == 0)`,
    error: 'compile',
    env: arrayEnvWithLocals({}, { bo: { type: 'boolean', value: true } }),
  },
  {
    code: `true || (bi.length == 0)`,
    error: 'compile',
    env: arrayEnvWithLocals({}, { bi: { type: 'int', value: 0, boxed: true } }),
  },
  {
    code: `true || (n.length == 0)`,
    error: 'compile',
    env: arrayEnvWithLocals({}, { n: { type: 'null', value: null } }),
  },
  // an element is an int, not an array
  { code: `true || (a[0].length == 0)`, error: 'compile', env: arrayEnv({ a }) },
  // ------------------------- compile: a String exposes length() as a method, not a field -------------------------
  { code: `true || ("abc".length == 0)`, error: 'compile', env: arrayEnv({}) },
  {
    code: `true || (s.length == 0)`,
    error: 'compile',
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: { heap0: { class: 'java.lang.String', value: 'abc' } },
    },
  },
]
