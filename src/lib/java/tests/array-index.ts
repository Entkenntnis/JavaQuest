import type { TestSuiteEntry } from '../../state/types'
import {
  arrayEnv,
  arrayEnvWithLocals,
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

// ==================== ARRAY ELEMENT ACCESS ====================
// Indexing (`a[i]`) is implemented in the interpreter (typecheck returns the component
// type, evaluate does the load), so every case in this file must pass on the Suite page
// as well as against real Java. Only primitive component arrays exist; the load reduces
// to a primitive/boolean, so results are always assertable.
//
// Environment convention: an entry carries only the arrays it reads. The component
// arrays below are shared fixtures and referenced per entry, so each `env` stays slim.
// Compile errors are guarded behind `true || (...)` so typecheck still runs on the
// right-hand side (Java rejects it at compile time, the interpreter must too).
// Runtime entries pin which JVM exception fires -- phase only, the message is free.

const a = arrayObject('int', ints([1, 2, 3]))
const b = arrayObject('int', ints([10, 20, 30, 40]))
const one = arrayObject('int', ints([42]))
const empty = arrayObject('int', ints([]))
const c = arrayObject('long', longs(['100', '200', '300']))
const d = arrayObject('boolean', booleans([true, false, true]))
const f = arrayObject('double', doubles([1.5, 2.5, 3.5]))
const g = arrayObject('char', chars([97, 98, 99]))
const h = arrayObject('byte', bytes([1, 2, 127]))
const s = arrayObject('short', shorts([1, -2, 300]))
const fl = arrayObject('float', floats([1.5, 2.5]))
const ext = arrayObject('int', ints([-2147483648, 2147483647, 0]))
const lext = arrayObject(
  'long',
  longs(['-9223372036854775808', '9223372036854775807', '0']),
)
const gext = arrayObject('char', chars([0, 65535]))
const hext = arrayObject('byte', bytes([-128, 127]))
const sext = arrayObject('short', shorts([-32768, 32767]))

export const arraysIndex: TestSuiteEntry[] = [
  // ------------------------- one read per component type -------------------------
  { code: `a[0]`, output: { type: 'int', value: 1 }, env: arrayEnv({ a }) },
  { code: `a[2]`, output: { type: 'int', value: 3 }, env: arrayEnv({ a }) },
  { code: `c[1]`, output: { type: 'long', value: '200' }, env: arrayEnv({ c }) },
  { code: `d[1]`, output: { type: 'boolean', value: false }, env: arrayEnv({ d }) },
  { code: `f[0]`, output: { type: 'double', value: 1.5 }, env: arrayEnv({ f }) },
  { code: `g[1]`, output: { type: 'char', value: 98 }, env: arrayEnv({ g }) },
  { code: `h[2]`, output: { type: 'byte', value: 127 }, env: arrayEnv({ h }) },
  { code: `s[1]`, output: { type: 'short', value: -2 }, env: arrayEnv({ s }) },
  { code: `fl[1]`, output: { type: 'float', value: 2.5 }, env: arrayEnv({ fl }) },
  // ------------------------- boundary values -------------------------
  {
    code: `ext[0]`,
    output: { type: 'int', value: -2147483648 },
    env: arrayEnv({ ext }),
  },
  {
    code: `ext[1]`,
    output: { type: 'int', value: 2147483647 },
    env: arrayEnv({ ext }),
  },
  { code: `ext[2]`, output: { type: 'int', value: 0 }, env: arrayEnv({ ext }) },
  {
    code: `lext[0]`,
    output: { type: 'long', value: '-9223372036854775808' },
    env: arrayEnv({ lext }),
  },
  {
    code: `lext[1]`,
    output: { type: 'long', value: '9223372036854775807' },
    env: arrayEnv({ lext }),
  },
  {
    code: `gext[1]`,
    output: { type: 'char', value: 65535 },
    env: arrayEnv({ gext }),
  },
  { code: `hext[0]`, output: { type: 'byte', value: -128 }, env: arrayEnv({ hext }) },
  {
    code: `sext[0]`,
    output: { type: 'short', value: -32768 },
    env: arrayEnv({ sext }),
  },
  { code: `one[0]`, output: { type: 'int', value: 42 }, env: arrayEnv({ one }) },
  // ------------------------- index expression shapes -------------------------
  { code: `a[1 + 1]`, output: { type: 'int', value: 3 }, env: arrayEnv({ a }) },
  { code: `a[2 - 1]`, output: { type: 'int', value: 2 }, env: arrayEnv({ a }) },
  { code: `a[1 * 2]`, output: { type: 'int', value: 3 }, env: arrayEnv({ a }) },
  { code: `a[6 / 3]`, output: { type: 'int', value: 3 }, env: arrayEnv({ a }) },
  { code: `a[4 % 3]`, output: { type: 'int', value: 2 }, env: arrayEnv({ a }) },
  { code: `a[1 << 1]`, output: { type: 'int', value: 3 }, env: arrayEnv({ a }) },
  { code: `a[8 >> 2]`, output: { type: 'int', value: 3 }, env: arrayEnv({ a }) },
  { code: `a[8 >>> 2]`, output: { type: 'int', value: 3 }, env: arrayEnv({ a }) },
  { code: `a[3 & 1]`, output: { type: 'int', value: 2 }, env: arrayEnv({ a }) },
  { code: `a[1 | 0]`, output: { type: 'int', value: 2 }, env: arrayEnv({ a }) },
  { code: `a[2 ^ 0]`, output: { type: 'int', value: 3 }, env: arrayEnv({ a }) },
  { code: `a[+1]`, output: { type: 'int', value: 2 }, env: arrayEnv({ a }) },
  { code: `a[-0]`, output: { type: 'int', value: 1 }, env: arrayEnv({ a }) },
  { code: `a[~-2]`, output: { type: 'int', value: 2 }, env: arrayEnv({ a }) },
  { code: `a['b' - 'a']`, output: { type: 'int', value: 2 }, env: arrayEnv({ a }) },
  // ------------------------- valid index operand types -------------------------
  { code: `a[(byte) 1]`, output: { type: 'int', value: 2 }, env: arrayEnv({ a }) },
  { code: `a[(short) 2]`, output: { type: 'int', value: 3 }, env: arrayEnv({ a }) },
  { code: `a[(char) 2]`, output: { type: 'int', value: 3 }, env: arrayEnv({ a }) },
  { code: `a[(int) 1]`, output: { type: 'int', value: 2 }, env: arrayEnv({ a }) },
  {
    code: `a[(byte) 1 + (byte) 1]`,
    output: { type: 'int', value: 3 },
    env: arrayEnv({ a }),
  },
  // index locals: primitive and boxed (unboxed then widened to int)
  {
    code: `a[i]`,
    output: { type: 'int', value: 2 },
    env: arrayEnvWithLocals({ a }, { i: { type: 'int', value: 1 } }),
  },
  {
    code: `a[by]`,
    output: { type: 'int', value: 3 },
    env: arrayEnvWithLocals({ a }, { by: { type: 'byte', value: 2 } }),
  },
  {
    code: `a[sh]`,
    output: { type: 'int', value: 3 },
    env: arrayEnvWithLocals({ a }, { sh: { type: 'short', value: 2 } }),
  },
  {
    code: `a[ch]`,
    output: { type: 'int', value: 2 },
    env: arrayEnvWithLocals({ a }, { ch: { type: 'char', value: 1 } }),
  },
  {
    code: `a[bi]`,
    output: { type: 'int', value: 2 },
    env: arrayEnvWithLocals(
      { a },
      { bi: { type: 'int', value: 1, boxed: true } },
    ),
  },
  {
    code: `a[bs]`,
    output: { type: 'int', value: 3 },
    env: arrayEnvWithLocals(
      { a },
      { bs: { type: 'short', value: 2, boxed: true } },
    ),
  },
  {
    code: `a[bb]`,
    output: { type: 'int', value: 2 },
    env: arrayEnvWithLocals(
      { a },
      { bb: { type: 'byte', value: 1, boxed: true } },
    ),
  },
  {
    code: `a[bc]`,
    output: { type: 'int', value: 2 },
    env: arrayEnvWithLocals(
      { a },
      { bc: { type: 'char', value: 1, boxed: true } },
    ),
  },
  // ------------------------- nested / index-is-itself-an-expression -------------------------
  { code: `a[a[0]]`, output: { type: 'int', value: 2 }, env: arrayEnv({ a }) },
  { code: `a[a[a[0]]]`, output: { type: 'int', value: 3 }, env: arrayEnv({ a }) },
  {
    code: `b[a[1]]`,
    output: { type: 'int', value: 30 },
    env: arrayEnv({ a, b }),
  },
  {
    code: `a[b[0] / 10]`,
    output: { type: 'int', value: 2 },
    env: arrayEnv({ a, b }),
  },
  {
    code: `a[a[0] < a[1] ? 1 : 2]`,
    output: { type: 'int', value: 2 },
    env: arrayEnv({ a }),
  },
  // ------------------------- numeric promotion of the loaded element -------------------------
  {
    code: `h[0] + h[1]`,
    output: { type: 'int', value: 3 },
    env: arrayEnv({ h }),
  },
  {
    code: `s[0] + s[1]`,
    output: { type: 'int', value: -1 },
    env: arrayEnv({ s }),
  },
  {
    code: `g[0] + g[1]`,
    output: { type: 'int', value: 195 },
    env: arrayEnv({ g }),
  },
  {
    code: `h[2] + 1`,
    output: { type: 'int', value: 128 },
    env: arrayEnv({ h }),
  },
  {
    code: `a[0] + c[1]`,
    output: { type: 'long', value: '201' },
    env: arrayEnv({ a, c }),
  },
  {
    code: `c[1] - a[0]`,
    output: { type: 'long', value: '199' },
    env: arrayEnv({ a, c }),
  },
  {
    code: `a[0] + fl[0]`,
    output: { type: 'float', value: 2.5 },
    env: arrayEnv({ a, fl }),
  },
  {
    code: `a[0] + f[0]`,
    output: { type: 'double', value: 2.5 },
    env: arrayEnv({ a, f }),
  },
  {
    code: `f[1] * 2`,
    output: { type: 'double', value: 5 },
    env: arrayEnv({ f }),
  },
  {
    code: `g[0] * 2`,
    output: { type: 'int', value: 194 },
    env: arrayEnv({ g }),
  },
  {
    code: `c[1] >> 1`,
    output: { type: 'long', value: '100' },
    env: arrayEnv({ c }),
  },
  // ------------------------- unary operators on the loaded element -------------------------
  { code: `-a[0]`, output: { type: 'int', value: -1 }, env: arrayEnv({ a }) },
  { code: `+h[0]`, output: { type: 'int', value: 1 }, env: arrayEnv({ h }) },
  { code: `~a[0]`, output: { type: 'int', value: -2 }, env: arrayEnv({ a }) },
  { code: `~c[0]`, output: { type: 'long', value: '-101' }, env: arrayEnv({ c }) },
  { code: `!d[0]`, output: { type: 'boolean', value: false }, env: arrayEnv({ d }) },
  // ------------------------- relational -------------------------
  {
    code: `a[0] < a[1]`,
    output: { type: 'boolean', value: true },
    env: arrayEnv({ a }),
  },
  {
    code: `c[1] > a[2]`,
    output: { type: 'boolean', value: true },
    env: arrayEnv({ a, c }),
  },
  {
    code: `g[0] < g[1]`,
    output: { type: 'boolean', value: true },
    env: arrayEnv({ g }),
  },
  {
    code: `h[1] >= h[0]`,
    output: { type: 'boolean', value: true },
    env: arrayEnv({ h }),
  },
  {
    code: `f[0] < f[1]`,
    output: { type: 'boolean', value: true },
    env: arrayEnv({ f }),
  },
  {
    code: `fl[0] <= fl[1]`,
    output: { type: 'boolean', value: true },
    env: arrayEnv({ fl }),
  },
  // ------------------------- equality -------------------------
  {
    code: `a[0] == 1`,
    output: { type: 'boolean', value: true },
    env: arrayEnv({ a }),
  },
  {
    code: `a[1] != a[2]`,
    output: { type: 'boolean', value: true },
    env: arrayEnv({ a }),
  },
  {
    code: `c[1] == 200`,
    output: { type: 'boolean', value: true },
    env: arrayEnv({ c }),
  },
  {
    code: `d[1] == false`,
    output: { type: 'boolean', value: true },
    env: arrayEnv({ d }),
  },
  {
    code: `g[0] == 'a'`,
    output: { type: 'boolean', value: true },
    env: arrayEnv({ g }),
  },
  {
    code: `fl[0] == 1.5f`,
    output: { type: 'boolean', value: true },
    env: arrayEnv({ fl }),
  },
  {
    code: `f[0] == 1.5`,
    output: { type: 'boolean', value: true },
    env: arrayEnv({ f }),
  },
  // ------------------------- boolean logic -------------------------
  {
    code: `d[0] && d[1]`,
    output: { type: 'boolean', value: false },
    env: arrayEnv({ d }),
  },
  {
    code: `d[0] || d[1]`,
    output: { type: 'boolean', value: true },
    env: arrayEnv({ d }),
  },
  {
    code: `d[0] & d[2]`,
    output: { type: 'boolean', value: true },
    env: arrayEnv({ d }),
  },
  {
    code: `d[1] | d[2]`,
    output: { type: 'boolean', value: true },
    env: arrayEnv({ d }),
  },
  {
    code: `d[0] ^ d[2]`,
    output: { type: 'boolean', value: false },
    env: arrayEnv({ d }),
  },
  // ------------------------- conditional -------------------------
  {
    code: `d[0] ? a[0] : a[1]`,
    output: { type: 'int', value: 1 },
    env: arrayEnv({ a, d }),
  },
  {
    code: `d[1] ? a[0] : a[1]`,
    output: { type: 'int', value: 2 },
    env: arrayEnv({ a, d }),
  },
  {
    code: `a[0] < a[1] ? h[0] : h[1]`,
    output: { type: 'byte', value: 1 },
    env: arrayEnv({ a, h }),
  },
  {
    code: `true ? c[0] : a[0]`,
    output: { type: 'long', value: '100' },
    env: arrayEnv({ a, c }),
  },
  {
    code: `false ? c[0] : a[0]`,
    output: { type: 'long', value: '1' },
    env: arrayEnv({ a, c }),
  },
  {
    code: `true ? a[0] : null`,
    output: { type: 'int', value: 1 },
    env: arrayEnv({ a }),
  },
  {
    code: `d[0] ? g[0] : g[1]`,
    output: { type: 'char', value: 97 },
    env: arrayEnv({ d, g }),
  },
  // ------------------------- string conversion -------------------------
  { code: `"" + a[0]`, output: { type: '__str', value: '1' }, env: arrayEnv({ a }) },
  {
    code: `"v" + a[1] + a[2]`,
    output: { type: '__str', value: 'v23' },
    env: arrayEnv({ a }),
  },
  {
    code: `a[0] + "" + c[1]`,
    output: { type: '__str', value: '1200' },
    env: arrayEnv({ a, c }),
  },
  { code: `"" + h[0]`, output: { type: '__str', value: '1' }, env: arrayEnv({ h }) },
  {
    code: `"" + c[0]`,
    output: { type: '__str', value: '100' },
    env: arrayEnv({ c }),
  },
  { code: `"" + g[0]`, output: { type: '__str', value: 'a' }, env: arrayEnv({ g }) },
  {
    code: `"" + d[1]`,
    output: { type: '__str', value: 'false' },
    env: arrayEnv({ d }),
  },
  {
    code: `"" + f[0]`,
    output: { type: '__str', value: '1.5' },
    env: arrayEnv({ f }),
  },
  {
    code: `"" + fl[0]`,
    output: { type: '__str', value: '1.5' },
    env: arrayEnv({ fl }),
  },
  { code: `"" + s[1]`, output: { type: '__str', value: '-2' }, env: arrayEnv({ s }) },
  // ------------------------- casts of the loaded element -------------------------
  {
    code: `(long) a[0]`,
    output: { type: 'long', value: '1' },
    env: arrayEnv({ a }),
  },
  { code: `(byte) a[1]`, output: { type: 'byte', value: 2 }, env: arrayEnv({ a }) },
  {
    code: `(short) a[2]`,
    output: { type: 'short', value: 3 },
    env: arrayEnv({ a }),
  },
  { code: `(char) a[0]`, output: { type: 'char', value: 1 }, env: arrayEnv({ a }) },
  {
    code: `(double) a[0]`,
    output: { type: 'double', value: 1 },
    env: arrayEnv({ a }),
  },
  {
    code: `(float) c[0]`,
    output: { type: 'float', value: 100 },
    env: arrayEnv({ c }),
  },
  {
    code: `(int) c[1]`,
    output: { type: 'int', value: 200 },
    env: arrayEnv({ c }),
  },
  { code: `(int) f[2]`, output: { type: 'int', value: 3 }, env: arrayEnv({ f }) },
  { code: `(int) g[1]`, output: { type: 'int', value: 98 }, env: arrayEnv({ g }) },
  {
    code: `(short) ext[1]`,
    output: { type: 'short', value: -1 },
    env: arrayEnv({ ext }),
  },
  // ------------------------- an assignment yields the array, then it is indexed -------------------------
  // Exercises the array-aware `toType` path: `(a = b)` has static type int[], not a class.
  { code: `(a = a)[0]`, output: { type: 'int', value: 1 }, env: arrayEnv({ a }) },
  {
    code: `(a = b)[0]`,
    output: { type: 'int', value: 10 },
    env: arrayEnv({ a, b }),
  },
  {
    code: `(a = b)[3]`,
    output: { type: 'int', value: 40 },
    env: arrayEnv({ a, b }),
  },
  {
    code: `(a = b) == b`,
    output: { type: 'boolean', value: true },
    env: arrayEnv({ a, b }),
  },
  {
    code: `(a = b) == a`,
    output: { type: 'boolean', value: true },
    env: arrayEnv({ a, b }),
  },
  {
    code: `(a = null) == null`,
    output: { type: 'boolean', value: true },
    env: arrayEnv({ a }),
  },
  {
    code: `(a = null) == b`,
    output: { type: 'boolean', value: false },
    env: arrayEnv({ a, b }),
  },
  {
    code: `(a = null) != b`,
    output: { type: 'boolean', value: true },
    env: arrayEnv({ a, b }),
  },
  // ------------------------- runtime: out of bounds -------------------------
  { code: `a[3]`, error: 'runtime', env: arrayEnv({ a }) },
  { code: `b[4]`, error: 'runtime', env: arrayEnv({ b }) },
  { code: `one[1]`, error: 'runtime', env: arrayEnv({ one }) },
  { code: `ext[3]`, error: 'runtime', env: arrayEnv({ ext }) },
  { code: `a[2147483647]`, error: 'runtime', env: arrayEnv({ a }) },
  { code: `a[-2147483648]`, error: 'runtime', env: arrayEnv({ a }) },
  { code: `a[-1]`, error: 'runtime', env: arrayEnv({ a }) },
  { code: `a[0 - 1]`, error: 'runtime', env: arrayEnv({ a }) },
  { code: `a[~0]`, error: 'runtime', env: arrayEnv({ a }) },
  { code: `a[1 | 2]`, error: 'runtime', env: arrayEnv({ a }) },
  { code: `a[1 + 2]`, error: 'runtime', env: arrayEnv({ a }) },
  // ------------------------- runtime: empty array -------------------------
  { code: `empty[0]`, error: 'runtime', env: arrayEnv({ empty }) },
  { code: `empty[-1]`, error: 'runtime', env: arrayEnv({ empty }) },
  // ------------------------- runtime: null array (NPE) -------------------------
  { code: `(a = null)[0]`, error: 'runtime', env: arrayEnv({ a }) },
  { code: `(a = null)[a[0]]`, error: 'runtime', env: arrayEnv({ a }) },
  { code: `(a = null)[b[0]]`, error: 'runtime', env: arrayEnv({ a, b }) },
  // ------------------------- runtime: index expression evaluated before the load -------------------------
  { code: `a[1 / 0]`, error: 'runtime', env: arrayEnv({ a }) },
  { code: `a[1 % 0]`, error: 'runtime', env: arrayEnv({ a }) },
  { code: `a[a[1 / 0]]`, error: 'runtime', env: arrayEnv({ a }) },
  // ------------------------- compile: invalid index operand types -------------------------
  // Wrapped in `== 0` so the entry fails iff a non-int index is wrongly accepted.
  { code: `true || (a[1L] == 0)`, error: 'compile', env: arrayEnv({ a }) },
  { code: `true || (a[1.0] == 0)`, error: 'compile', env: arrayEnv({ a }) },
  { code: `true || (a[1.0f] == 0)`, error: 'compile', env: arrayEnv({ a }) },
  { code: `true || (a[true] == 0)`, error: 'compile', env: arrayEnv({ a }) },
  { code: `true || (a[null] == 0)`, error: 'compile', env: arrayEnv({ a }) },
  { code: `true || (a[a] == 0)`, error: 'compile', env: arrayEnv({ a }) },
  { code: `true || (a[fl] == 0)`, error: 'compile', env: arrayEnv({ a, fl }) },
  { code: `true || (a["x"] == 0)`, error: 'compile', env: arrayEnv({ a }) },
  {
    code: `true || (a[bl] == 0)`,
    error: 'compile',
    env: arrayEnvWithLocals(
      { a },
      { bl: { type: 'long', value: '1', boxed: true } },
    ),
  },
  // ------------------------- compile: base is not an array -------------------------
  {
    code: `true || (i[0] == 0)`,
    error: 'compile',
    env: arrayEnvWithLocals({}, { i: { type: 'int', value: 0 } }),
  },
  {
    code: `true || (bi[0] == 0)`,
    error: 'compile',
    env: arrayEnvWithLocals({}, { bi: { type: 'int', value: 0, boxed: true } }),
  },
  {
    code: `true || (bo[0] == 0)`,
    error: 'compile',
    env: arrayEnvWithLocals({}, { bo: { type: 'boolean', value: true } }),
  },
  {
    code: `true || (n[0] == 0)`,
    error: 'compile',
    env: arrayEnvWithLocals({}, { n: { type: 'null', value: null } }),
  },
  { code: `true || ("abc"[0] == 0)`, error: 'compile', env: arrayEnv({}) },
  { code: `true || (null[0] == 0)`, error: 'compile', env: arrayEnv({}) },
  // indexing the loaded primitive (a[0] is an int, not an array)
  { code: `true || (a[0][0] == 0)`, error: 'compile', env: arrayEnv({ a }) },
]
