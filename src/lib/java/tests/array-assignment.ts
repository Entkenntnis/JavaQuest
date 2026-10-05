import type { TestSuiteEntry } from '../../state/types'
import {
  arrayEnv,
  arrayObject,
  booleans,
  bytes,
  chars,
  doubles,
  ints,
  longs,
  shorts,
} from './array-fixtures.ts'

// ==================== ARRAY ELEMENT ASSIGNMENT ====================
// The value of an assignment expression is the stored value, so every case here (except
// the error entries) reduces to a primitive. Mutation is observed by reading the element
// back inside the same expression, which is valid because Java evaluates left to right.
// NPE is triggered by nulling the array local and then indexing it in the same expression
// (`(a = null)[1]`); note `(a = null) + a[1]` is *not* NPE, it is a `+` compile error.
// The interpreter does not implement `[...]` yet; cross-check is the baseline.

const a = arrayObject('int', ints([1, 2, 3]))
const b = arrayObject('int', ints([10, 20, 30, 40]))
const c = arrayObject('long', longs(['100', '200']))
const d = arrayObject('boolean', booleans([true, false, true]))
const f = arrayObject('double', doubles([1.5, 2.5]))
const g = arrayObject('char', chars([97, 98, 99]))
const h = arrayObject('byte', bytes([1, 2, 127]))
const s = arrayObject('short', shorts([1, -2]))

export const arrayAssignment: TestSuiteEntry[] = [
  // ------------------------- simple store & observable mutation -------------------------
  { code: `a[0] = 5`, output: { type: 'int', value: 5 }, env: arrayEnv({ a }) },
  {
    code: `(a[0] = 5) + a[0]`,
    output: { type: 'int', value: 10 },
    env: arrayEnv({ a }),
  },
  {
    code: `(b[0] = 9) == 9`,
    output: { type: 'boolean', value: true },
    env: arrayEnv({ b }),
  },
  {
    code: `a[1] = a[2]`,
    output: { type: 'int', value: 3 },
    env: arrayEnv({ a }),
  },
  // ------------------------- compound assignment -------------------------
  { code: `a[1] += 7`, output: { type: 'int', value: 9 }, env: arrayEnv({ a }) },
  { code: `a[2] *= 2`, output: { type: 'int', value: 6 }, env: arrayEnv({ a }) },
  { code: `a[0] -= 1`, output: { type: 'int', value: 0 }, env: arrayEnv({ a }) },
  {
    code: `c[0] += 5`,
    output: { type: 'long', value: '105' },
    env: arrayEnv({ c }),
  },
  {
    code: `f[0] /= 2`,
    output: { type: 'double', value: 0.75 },
    env: arrayEnv({ f }),
  },
  // ------------------------- increment / decrement on elements -------------------------
  {
    code: `(a[0]++) + a[0]`,
    output: { type: 'int', value: 3 },
    env: arrayEnv({ a }),
  },
  { code: `++a[2]`, output: { type: 'int', value: 4 }, env: arrayEnv({ a }) },
  { code: `--a[1]`, output: { type: 'int', value: 1 }, env: arrayEnv({ a }) },
  // ------------------------- index expression side effects -------------------------
  { code: `a[a[0] = 2]`, output: { type: 'int', value: 3 }, env: arrayEnv({ a }) },
  // ------------------------- component-type conversions on store -------------------------
  { code: `g[0] = 'z'`, output: { type: 'char', value: 122 }, env: arrayEnv({ g }) },
  {
    code: `d[0] = false`,
    output: { type: 'boolean', value: false },
    env: arrayEnv({ d }),
  },
  { code: `c[1] = 7`, output: { type: 'long', value: '7' }, env: arrayEnv({ c }) },
  { code: `h[0] = 100`, output: { type: 'byte', value: 100 }, env: arrayEnv({ h }) },
  { code: `s[1] = 5`, output: { type: 'short', value: 5 }, env: arrayEnv({ s }) },
  // ------------------------- runtime errors -------------------------
  { code: `a[3]`, error: 'runtime', env: arrayEnv({ a }) },
  { code: `a[3] = 1`, error: 'runtime', env: arrayEnv({ a }) },
  { code: `a[-1]`, error: 'runtime', env: arrayEnv({ a }) },
  // nulling the array and indexing it in the same expression throws NPE
  { code: `(a = null)[1]`, error: 'runtime', env: arrayEnv({ a }) },
  {
    code: `(a = null) == null && a[1] == 0`,
    error: 'runtime',
    env: arrayEnv({ a }),
  },
  // ------------------------- compile errors (guarded so the failure is at typecheck) -------------------------
  { code: `true || (a[0] = 1.5)`, error: 'compile', env: arrayEnv({ a }) },
  { code: `true || (a[0] = true)`, error: 'compile', env: arrayEnv({ a }) },
  { code: `true || (d[0] = 1)`, error: 'compile', env: arrayEnv({ d }) },
  { code: `true || (h[0] = 128)`, error: 'compile', env: arrayEnv({ h }) },
  { code: `true || a[0L]`, error: 'compile', env: arrayEnv({ a }) },
  // `+` does not accept an array operand: compile error, never reaches NPE
  { code: `(a = null) + a[1]`, error: 'compile', env: arrayEnv({ a }) },
]
