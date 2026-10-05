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
// Index reads are implemented; the *write* forms below (`a[i] = ...`, compound assignment
// and `a[i]++`) are not yet reachable in the interpreter (both `cst2ast` assignment and
// update require an `Identifier` target), so value entries here still fail on the Suite
// page and rely on cross-check for their expected semantics. Entries whose store is
// rejected at compile time already agree in phase and pass.

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
  // ------------------------- nested / self-referential targets -------------------------
  { code: `a[a[0]] = 7`, output: { type: 'int', value: 7 }, env: arrayEnv({ a }) },
  { code: `a[a[1]] = 9`, output: { type: 'int', value: 9 }, env: arrayEnv({ a }) },
  {
    code: `a[0] = a[0] + 1`,
    output: { type: 'int', value: 2 },
    env: arrayEnv({ a }),
  },
  { code: `a[0] = b[0]`, output: { type: 'int', value: 10 }, env: arrayEnv({ a, b }) },
  {
    code: `(a[0] = b[0]) + a[0]`,
    output: { type: 'int', value: 20 },
    env: arrayEnv({ a, b }),
  },
  {
    code: `a[0] *= b[0]`,
    output: { type: 'int', value: 10 },
    env: arrayEnv({ a, b }),
  },
  { code: `a[a[0] = 1] = 8`, output: { type: 'int', value: 8 }, env: arrayEnv({ a }) },
  { code: `a[0] = (a[0] = 5)`, output: { type: 'int', value: 5 }, env: arrayEnv({ a }) },
  // ------------------------- compound assignment applies an implicit narrowing cast -------------------------
  { code: `h[0] += 1`, output: { type: 'byte', value: 2 }, env: arrayEnv({ h }) },
  { code: `h[1] += 127`, output: { type: 'byte', value: -127 }, env: arrayEnv({ h }) },
  { code: `h[1] >>= 1`, output: { type: 'byte', value: 1 }, env: arrayEnv({ h }) },
  { code: `s[0] += 1`, output: { type: 'short', value: 2 }, env: arrayEnv({ s }) },
  { code: `g[0] += 1`, output: { type: 'char', value: 98 }, env: arrayEnv({ g }) },
  { code: `a[0] += 1.5`, output: { type: 'int', value: 2 }, env: arrayEnv({ a }) },
  { code: `c[0] += 1`, output: { type: 'long', value: '101' }, env: arrayEnv({ c }) },
  { code: `c[0] -= 1`, output: { type: 'long', value: '99' }, env: arrayEnv({ c }) },
  {
    code: `f[0] += 0.25`,
    output: { type: 'double', value: 1.75 },
    env: arrayEnv({ f }),
  },
  { code: `a[0] <<= 2`, output: { type: 'int', value: 4 }, env: arrayEnv({ a }) },
  { code: `a[0] |= 2`, output: { type: 'int', value: 3 }, env: arrayEnv({ a }) },
  // ------------------------- boolean compound assignment (no numeric path) -------------------------
  {
    code: `d[0] &= false`,
    output: { type: 'boolean', value: false },
    env: arrayEnv({ d }),
  },
  {
    code: `d[1] |= true`,
    output: { type: 'boolean', value: true },
    env: arrayEnv({ d }),
  },
  {
    code: `d[0] ^= true`,
    output: { type: 'boolean', value: false },
    env: arrayEnv({ d }),
  },
  // ------------------------- increment / decrement per component type -------------------------
  { code: `c[0]++`, output: { type: 'long', value: '100' }, env: arrayEnv({ c }) },
  { code: `++c[0]`, output: { type: 'long', value: '101' }, env: arrayEnv({ c }) },
  { code: `g[0]++`, output: { type: 'char', value: 97 }, env: arrayEnv({ g }) },
  { code: `f[0]++`, output: { type: 'double', value: 1.5 }, env: arrayEnv({ f }) },
  { code: `h[0]--`, output: { type: 'byte', value: 1 }, env: arrayEnv({ h }) },
  // ------------------------- storing through one alias is visible through another -------------------------
  {
    code: `(p[0] = 9) + q[0]`,
    output: { type: 'int', value: 18 },
    env: arrayEnv({ p: a, q: { aliasOf: 'p' } }),
  },
  // ------------------------- runtime errors on store -------------------------
  { code: `(a = null)[0] = 1`, error: 'runtime', env: arrayEnv({ a }) },
  { code: `a[1 / 0] = 1`, error: 'runtime', env: arrayEnv({ a }) },
  { code: `a[-1] = 1`, error: 'runtime', env: arrayEnv({ a }) },
  { code: `a[5] += 1`, error: 'runtime', env: arrayEnv({ a }) },
  { code: `a[3]++`, error: 'runtime', env: arrayEnv({ a }) },
  // ------------------------- compile errors on store -------------------------
  { code: `true || (a[0] = "x")`, error: 'compile', env: arrayEnv({ a }) },
  { code: `true || (a[0] += "x")`, error: 'compile', env: arrayEnv({ a }) },
  { code: `true || (d[0] += 1)`, error: 'compile', env: arrayEnv({ d }) },
  { code: `true || (h[0] = 200)`, error: 'compile', env: arrayEnv({ h }) },
  { code: `true || (g[0] = 70000)`, error: 'compile', env: arrayEnv({ g }) },
  { code: `true || (c[0] = 1.5)`, error: 'compile', env: arrayEnv({ c }) },
]
