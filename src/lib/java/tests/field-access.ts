import type { TestSuiteEntry } from '../../state/types'
import {
  arrayEnv,
  arrayEnvWithLocals,
  arrayObject,
  ints,
  longs,
} from './array-fixtures.ts'

// ==================== FIELD ACCESS: GENERIC NEGATIVE RULES ====================
// Field access is a broad feature; the first slice is `arr.length` (see
// array-length.ts). This file pins the receiver/field rules that stay compile
// errors no matter how far FieldAccess is implemented. They are the guard rails:
// a future implementation that suddenly accepts `int.length`, `"x".length` or
// `a.length = 5` would be wrong against javac.
//
// The interpreter does not implement field access yet, so these entries are
// currently red in the Suite UI while remaining the source of truth for Java
// semantics. They are validated by the real-JDK harness (`npm run cross-check`).
//
// All error entries use the house guard `true || (...)` so a wrong "accepts"
// decision still fails at typecheck of the inner expression.

const a = arrayObject('int', ints([1, 2, 3]))
const b = arrayObject('int', ints([10, 20, 30, 40]))
const c = arrayObject('long', longs(['100', '200', '300']))

export const fieldAccess: TestSuiteEntry[] = [
  // ------------------------- parenthesized receivers are still fields (valid) -------------------------
  { code: `(a).length`, output: { type: 'int', value: 3 }, env: arrayEnv({ a }) },
  {
    code: `((a)).length`,
    output: { type: 'int', value: 3 },
    env: arrayEnv({ a }),
  },
  {
    code: `(a = b).length`,
    output: { type: 'int', value: 4 },
    env: arrayEnv({ a, b }),
  },
  // ------------------------- `length` is a field, not a method -------------------------
  { code: `true || (a.length() == 0)`, error: 'compile', env: arrayEnv({ a }) },
  // ------------------------- unknown / misspelled / case-sensitive fields -------------------------
  { code: `true || (a.nope == 0)`, error: 'compile', env: arrayEnv({ a }) },
  { code: `true || (a.LENGTH == 0)`, error: 'compile', env: arrayEnv({ a }) },
  { code: `true || (a.Length == 0)`, error: 'compile', env: arrayEnv({ a }) },
  { code: `true || (a.size == 0)`, error: 'compile', env: arrayEnv({ a }) },
  // chained access on the int result: int carries no fields
  {
    code: `true || (a.length.length == 0)`,
    error: 'compile',
    env: arrayEnv({ a }),
  },
  {
    code: `true || (a.length.nope == 0)`,
    error: 'compile',
    env: arrayEnv({ a }),
  },
  // ------------------------- `length` is final, cannot be assigned -------------------------
  { code: `true || (a.length = 5)`, error: 'compile', env: arrayEnv({ a }) },
  { code: `true || (a.length = b.length)`, error: 'compile', env: arrayEnv({ a, b }) },
  { code: `true || (a.length += 1)`, error: 'compile', env: arrayEnv({ a }) },
  { code: `true || (a.length -= 1)`, error: 'compile', env: arrayEnv({ a }) },
  { code: `true || (a.length++)`, error: 'compile', env: arrayEnv({ a }) },
  { code: `true || (a.length--)`, error: 'compile', env: arrayEnv({ a }) },
  { code: `true || (++a.length)`, error: 'compile', env: arrayEnv({ a }) },
  { code: `true || (--a.length)`, error: 'compile', env: arrayEnv({ a }) },
  // ------------------------- `length` is an int, not a boolean or a reference -------------------------
  { code: `true || (!a.length)`, error: 'compile', env: arrayEnv({ a }) },
  {
    code: `true || (a.length && true)`,
    error: 'compile',
    env: arrayEnv({ a }),
  },
  {
    code: `true || (a.length ? 1 : 2)`,
    error: 'compile',
    env: arrayEnv({ a }),
  },
  // int and int[] are incomparable / not assignable in either direction
  { code: `true || (a.length == a)`, error: 'compile', env: arrayEnv({ a }) },
  { code: `true || (a == a.length)`, error: 'compile', env: arrayEnv({ a }) },
  { code: `true || (a = a.length)`, error: 'compile', env: arrayEnv({ a }) },
  { code: `true || (a.length + a)`, error: 'compile', env: arrayEnv({ a }) },
  { code: `true || (a.length > b)`, error: 'compile', env: arrayEnv({ a, b }) },
  // ------------------------- `.length` on primitive locals -------------------------
  {
    code: `true || (i.length == 0)`,
    error: 'compile',
    env: arrayEnvWithLocals({}, { i: { type: 'int', value: 3 } }),
  },
  {
    code: `true || (lo.length == 0)`,
    error: 'compile',
    env: arrayEnvWithLocals({}, { lo: { type: 'long', value: '3' } }),
  },
  {
    code: `true || (sh.length == 0)`,
    error: 'compile',
    env: arrayEnvWithLocals({}, { sh: { type: 'short', value: 3 } }),
  },
  {
    code: `true || (by.length == 0)`,
    error: 'compile',
    env: arrayEnvWithLocals({}, { by: { type: 'byte', value: 3 } }),
  },
  {
    code: `true || (ch.length == 0)`,
    error: 'compile',
    env: arrayEnvWithLocals({}, { ch: { type: 'char', value: 97 } }),
  },
  {
    code: `true || (fl.length == 0)`,
    error: 'compile',
    env: arrayEnvWithLocals({}, { fl: { type: 'float', value: 3 } }),
  },
  {
    code: `true || (db.length == 0)`,
    error: 'compile',
    env: arrayEnvWithLocals({}, { db: { type: 'double', value: 3 } }),
  },
  {
    code: `true || (bo.length == 0)`,
    error: 'compile',
    env: arrayEnvWithLocals({}, { bo: { type: 'boolean', value: true } }),
  },
  // ------------------------- `.length` on boxed / String / null references -------------------------
  {
    code: `true || (bi.length == 0)`,
    error: 'compile',
    env: arrayEnvWithLocals({}, { bi: { type: 'int', value: 3, boxed: true } }),
  },
  {
    code: `true || (bbo.length == 0)`,
    error: 'compile',
    env: arrayEnvWithLocals(
      {},
      { bbo: { type: 'boolean', value: true, boxed: true } },
    ),
  },
  {
    code: `true || (n.length == 0)`,
    error: 'compile',
    env: arrayEnvWithLocals({}, { n: { type: 'null', value: null } }),
  },
  { code: `true || ("abc".length == 0)`, error: 'compile', env: arrayEnv({}) },
  {
    code: `true || (s.length == 0)`,
    error: 'compile',
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: { heap0: { class: 'java.lang.String', value: 'abc' } },
    },
  },
  // ------------------------- `.length` on non-array expression results -------------------------
  { code: `true || ((1).length == 0)`, error: 'compile', env: arrayEnv({}) },
  { code: `true || ((1L).length == 0)`, error: 'compile', env: arrayEnv({}) },
  { code: `true || ((1.5).length == 0)`, error: 'compile', env: arrayEnv({}) },
  { code: `true || ((1.5f).length == 0)`, error: 'compile', env: arrayEnv({}) },
  { code: `true || (('a').length == 0)`, error: 'compile', env: arrayEnv({}) },
  { code: `true || ((true).length == 0)`, error: 'compile', env: arrayEnv({}) },
  {
    code: `true || ((a[0] + 1).length == 0)`,
    error: 'compile',
    env: arrayEnv({ a }),
  },
  {
    code: `true || ((a[0]).length == 0)`,
    error: 'compile',
    env: arrayEnv({ a }),
  },
  // ------------------------- the int result cannot be used as a receiver / index -------------------------
  {
    code: `true || (a.length.toString() == "3")`,
    error: 'compile',
    env: arrayEnv({ a }),
  },
  {
    code: `true || (a.length.equals(3))`,
    error: 'compile',
    env: arrayEnv({ a }),
  },
  { code: `true || (a.length[0] == 0)`, error: 'compile', env: arrayEnv({ a }) },
  // ------------------------- the int result is incompatible with boolean / String / null -------------------------
  {
    code: `true || (a.length == true)`,
    error: 'compile',
    env: arrayEnv({ a }),
  },
  {
    code: `true || (a.length == "x")`,
    error: 'compile',
    env: arrayEnv({ a }),
  },
  {
    code: `true || (a.length + true)`,
    error: 'compile',
    env: arrayEnv({ a }),
  },
  {
    code: `true || (a.length == null)`,
    error: 'compile',
    env: arrayEnv({ a }),
  },
  {
    code: `true || (null == a.length)`,
    error: 'compile',
    env: arrayEnv({ a }),
  },
  // ------------------------- a parenthesized lvalue is still the final field -------------------------
  {
    code: `true || ((a.length) = 5)`,
    error: 'compile',
    env: arrayEnv({ a }),
  },
  {
    code: `true || ((a.length) += 1)`,
    error: 'compile',
    env: arrayEnv({ a }),
  },
  // ------------------------- the int result is not assignable to an array -------------------------
  {
    code: `true || (b = a.length)`,
    error: 'compile',
    env: arrayEnv({ a, b }),
  },
  {
    code: `true || (b = a.length + 0)`,
    error: 'compile',
    env: arrayEnv({ a, b }),
  },
  // ------------------------- bare null literal is not a receiver -------------------------
  { code: `true || (null.length == 0)`, error: 'compile', env: arrayEnv({}) },
  // ------------------------- mixed-component conditional degrades to Object, so `.length` is gone -------------------------
  {
    code: `true || ((true ? a : c).length == 0)`,
    error: 'compile',
    env: arrayEnv({ a, c }),
  },
  // ------------------------- the int result cannot be stored in a boolean -------------------------
  {
    code: `true || (bo = a.length)`,
    error: 'compile',
    env: arrayEnvWithLocals({ a }, { bo: { type: 'boolean', value: true } }),
  },
]
