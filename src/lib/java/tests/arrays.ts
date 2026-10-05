import type { TestSuiteEntry } from '../../state/types'
import {
  arrayEnv,
  arrayObject,
  booleans,
  bytes,
  chars,
  doubles,
  floats,
  ints,
  longs,
  shorts,
} from './array-fixtures.ts'

// ==================== ARRAY ACCESS ====================
// The interpreter understands `[...]` reads and writes; these entries are evaluated both
// by the interpreter and by the cross-check harness, which builds the arrays from
// `env.heap` and evaluates the expression as real Java. Every result is a primitive
// (arrays themselves are not valid outputs). Each entry only carries the arrays it uses.

const a = arrayObject('int', ints([1, 2, 3]))
const b = arrayObject('int', ints([10, 20, 30, 40]))
const c = arrayObject('long', longs(['100', '200', '300']))
const d = arrayObject('boolean', booleans([true, false, true]))
const f = arrayObject('double', doubles([1.5, 2.5, 3.5]))
const g = arrayObject('char', chars([97, 98, 99]))
const h = arrayObject('byte', bytes([1, 2, 127]))
const s = arrayObject('short', shorts([1, -2, 300]))
const fl = arrayObject('float', floats([1.5, 2.5]))

export const arrays: TestSuiteEntry[] = [
  // ------------------------- int -------------------------
  { code: `a[0]`, output: { type: 'int', value: 1 }, env: arrayEnv({ a }) },
  { code: `a[2]`, output: { type: 'int', value: 3 }, env: arrayEnv({ a }) },
  {
    code: `b[1] + b[3]`,
    output: { type: 'int', value: 60 },
    env: arrayEnv({ b }),
  },
  {
    code: `a[0] + a[1] + a[2]`,
    output: { type: 'int', value: 6 },
    env: arrayEnv({ a }),
  },
  {
    code: `a[2] == 3`,
    output: { type: 'boolean', value: true },
    env: arrayEnv({ a }),
  },
  {
    code: `a[0] < a[1]`,
    output: { type: 'boolean', value: true },
    env: arrayEnv({ a }),
  },
  // ------------------------- index is itself an expression -------------------------
  { code: `a[a[1]]`, output: { type: 'int', value: 3 }, env: arrayEnv({ a }) },
  {
    code: `b[a[0] + a[1]]`,
    output: { type: 'int', value: 40 },
    env: arrayEnv({ a, b }),
  },
  // ------------------------- long -------------------------
  { code: `c[1]`, output: { type: 'long', value: '200' }, env: arrayEnv({ c }) },
  {
    code: `c[2] * 2`,
    output: { type: 'long', value: '600' },
    env: arrayEnv({ c }),
  },
  // ------------------------- boolean -------------------------
  {
    code: `d[1]`,
    output: { type: 'boolean', value: false },
    env: arrayEnv({ d }),
  },
  {
    code: `d[0] == d[2]`,
    output: { type: 'boolean', value: true },
    env: arrayEnv({ d }),
  },
  // ------------------------- double -------------------------
  {
    code: `f[0]`,
    output: { type: 'double', value: 1.5 },
    env: arrayEnv({ f }),
  },
  {
    code: `f[1] * 2`,
    output: { type: 'double', value: 5 },
    env: arrayEnv({ f }),
  },
  // ------------------------- char -------------------------
  { code: `g[1]`, output: { type: 'char', value: 98 }, env: arrayEnv({ g }) },
  {
    code: `g[0] < g[2]`,
    output: { type: 'boolean', value: true },
    env: arrayEnv({ g }),
  },
  // ------------------------- byte (widened to int by access arithmetic) -------------------------
  { code: `h[2]`, output: { type: 'byte', value: 127 }, env: arrayEnv({ h }) },
  {
    code: `h[0] + h[1]`,
    output: { type: 'int', value: 3 },
    env: arrayEnv({ h }),
  },
  // ------------------------- short (widened to int by access arithmetic) -------------------------
  { code: `s[1]`, output: { type: 'short', value: -2 }, env: arrayEnv({ s }) },
  {
    code: `s[0] + s[1]`,
    output: { type: 'int', value: -1 },
    env: arrayEnv({ s }),
  },
  // ------------------------- float -------------------------
  {
    code: `fl[0]`,
    output: { type: 'float', value: 1.5 },
    env: arrayEnv({ fl }),
  },
  {
    code: `fl[0] + fl[1]`,
    output: { type: 'float', value: 4 },
    env: arrayEnv({ fl }),
  },
]
