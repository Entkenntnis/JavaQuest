import type { TestSuiteEntry } from '../../state/types'
import {
  arrayEnv,
  arrayEnvWithLocals,
  arrayObject,
  ints,
} from './array-fixtures.ts'

// ==================== ARRAY IDENTITY / ALIASING ====================
// Exercises the cross-check env renderer's aliasing support: locals that share one heap
// entry are built once and aliased, so object identity and mutation-through-an-alias are
// represented faithfully. Array references, index reads and the write forms are all
// implemented in the interpreter. Arrays are never outputs, so identity is always
// observed via `==`/`!=`/reads. Each entry only carries the arrays it uses.

const shared = arrayObject('int', ints([1, 2, 3]))
const arrA = arrayObject('int', ints([1, 2, 3]))
const arrB = arrayObject('int', ints([1, 2, 3]))

export const arrayIdentity: TestSuiteEntry[] = [
  // ------------------------- shared heap entry is one object -------------------------
  {
    code: `p == q`,
    output: { type: 'boolean', value: true },
    env: arrayEnv({ p: shared, q: { aliasOf: 'p' } }),
  },
  {
    code: `p != q`,
    output: { type: 'boolean', value: false },
    env: arrayEnv({ p: shared, q: { aliasOf: 'p' } }),
  },
  {
    code: `p[0] + q[2]`,
    output: { type: 'int', value: 4 },
    env: arrayEnv({ p: shared, q: { aliasOf: 'p' } }),
  },
  {
    code: `(p[1] = 9) + q[1]`,
    output: { type: 'int', value: 18 },
    env: arrayEnv({ p: shared, q: { aliasOf: 'p' } }),
  },
  // ------------------------- distinct arrays with equal contents are not identical -------------------------
  {
    code: `a == b`,
    output: { type: 'boolean', value: false },
    env: arrayEnv({ a: arrA, b: arrB }),
  },
  {
    code: `a[0] == b[0]`,
    output: { type: 'boolean', value: true },
    env: arrayEnv({ a: arrA, b: arrB }),
  },
  {
    code: `a == a`,
    output: { type: 'boolean', value: true },
    env: arrayEnv({ a: arrA }),
  },
  {
    code: `p == a`,
    output: { type: 'boolean', value: false },
    env: arrayEnv({ p: shared, a: arrA }),
  },
  // ------------------------- reference re-assignment affects only that local -------------------------
  {
    code: `(p = a) == a`,
    output: { type: 'boolean', value: true },
    env: arrayEnv({ p: shared, a: arrA }),
  },
  {
    code: `(p = a) == q`,
    output: { type: 'boolean', value: false },
    env: arrayEnv({ p: shared, q: { aliasOf: 'p' }, a: arrA }),
  },
  // ------------------------- array references vs null -------------------------
  {
    code: `a == null`,
    output: { type: 'boolean', value: false },
    env: arrayEnv({ a: arrA }),
  },
  {
    code: `a != null`,
    output: { type: 'boolean', value: true },
    env: arrayEnv({ a: arrA }),
  },
  {
    code: `n == null`,
    output: { type: 'boolean', value: true },
    env: arrayEnvWithLocals({}, { n: { type: 'null', value: null } }),
  },
  {
    code: `n != null`,
    output: { type: 'boolean', value: false },
    env: arrayEnvWithLocals({}, { n: { type: 'null', value: null } }),
  },
  {
    code: `n == a`,
    output: { type: 'boolean', value: false },
    env: arrayEnvWithLocals({ a: arrA }, { n: { type: 'null', value: null } }),
  },
  {
    code: `n != a`,
    output: { type: 'boolean', value: true },
    env: arrayEnvWithLocals({ a: arrA }, { n: { type: 'null', value: null } }),
  },
]
