import type { TestSuiteEntry } from '../../state/types'

export const mathAbsContext: TestSuiteEntry[] = [
  // ==================== MATH.ABS: EXPRESSION CONTEXTS & SIDE EFFECTS ====================
  // Companion to math-abs.ts/math-abs-values.ts. These entries place `Math.abs(...)` in the
  // operators, string concatenation, autoboxing, environment and assignment contexts the
  // interpreter supports. Expectations are real Java behaviour.
  // ------------------------- bitwise / shift around the result -------------------------
  {
    code: `Math.abs(-5) & 3`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `Math.abs(-5) | 0`,
    output: { type: 'int', value: 5 },
  },
  {
    code: `Math.abs(-5) ^ 0`,
    output: { type: 'int', value: 5 },
  },
  {
    code: `Math.abs(-5) << 1`,
    output: { type: 'int', value: 10 },
  },
  {
    code: `Math.abs(-5) >> 1`,
    output: { type: 'int', value: 2 },
  },
  {
    code: `Math.abs(-5) >>> 1`,
    output: { type: 'int', value: 2 },
  },
  // abs(MIN) == MIN, and the arithmetic/logical shifts differ on its sign bit.
  {
    code: `Math.abs(-2147483648) >> 1`,
    output: { type: 'int', value: -1073741824 },
  },
  {
    code: `Math.abs(-2147483648) >>> 1`,
    output: { type: 'int', value: 1073741824 },
  },
  {
    code: `Math.abs(-5) << Math.abs(-1)`,
    output: { type: 'int', value: 10 },
  },
  // ------------------------- relational / equality / logical -------------------------
  {
    code: `Math.abs(-5) >= 5`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `Math.abs(-5) <= 5`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `Math.abs(-5) < 0`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `Math.abs(-5) > 0 && Math.abs(-3) > 0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `Math.abs(-5) < 0 || Math.abs(-5) == 5`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `!(Math.abs(-5) < 0)`,
    output: { type: 'boolean', value: true },
  },
  // Comparison against wider types widens the int result.
  {
    code: `Math.abs(-5) == 5L`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `Math.abs(-5) == 5.0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `Math.abs(-5) == 5.0f`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `Math.abs(-5L) == 5`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `Math.abs(-5.0) == 5L`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `Math.abs(-5.0f) == 5.0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `Math.abs(-5L) > 4`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `Math.abs(-5.5) < 6.0`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- binary numeric promotion around abs -------------------------
  {
    code: `Math.abs(-5L) + Math.abs(-5)`,
    output: { type: 'long', value: '10' },
  },
  {
    code: `Math.abs(-5L) + Math.abs(-5.5)`,
    output: { type: 'double', value: 10.5 },
  },
  {
    code: `Math.abs(-1.5f) + 1.0f`,
    output: { type: 'float', value: 2.5 },
  },
  {
    code: `Math.abs(-1.5f) + 0.0`,
    output: { type: 'double', value: 1.5 },
  },
  {
    code: `Math.abs(-5.5) / 2`,
    output: { type: 'double', value: 2.75 },
  },
  {
    code: `Math.abs(-5.5) % 2`,
    output: { type: 'double', value: 1.5 },
  },
  {
    code: `Math.abs(-2.5f) * 2f`,
    output: { type: 'float', value: 5 },
  },
  {
    code: `Math.abs((3 - 8) * (2 + 2))`,
    output: { type: 'int', value: 20 },
  },
  {
    code: `Math.abs(-7 % 3)`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `Math.abs(7 % -3)`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `Math.abs(-7 / 2)`,
    output: { type: 'int', value: 3 },
  },
  {
    code: `Math.abs(7 / -2)`,
    output: { type: 'int', value: 3 },
  },
  // ------------------------- string concatenation -------------------------
  {
    code: `"" + Math.abs(-5)`,
    output: { type: '__str', value: '5' },
  },
  {
    code: `Math.abs(-5) + ""`,
    output: { type: '__str', value: '5' },
  },
  {
    code: `"x" + Math.abs(-5L)`,
    output: { type: '__str', value: 'x5' },
  },
  {
    code: `"" + Math.abs(-1.25)`,
    output: { type: '__str', value: '1.25' },
  },
  {
    code: `"" + Math.abs(-1.25f)`,
    output: { type: '__str', value: '1.25' },
  },
  {
    code: `"v=" + Math.abs(-5) + "!"`,
    output: { type: '__str', value: 'v=5!' },
  },
  {
    code: `Math.abs(-5) + Math.abs(-5) + "x"`,
    output: { type: '__str', value: '10x' },
  },
  {
    code: `Math.abs(-5L) + "-" + Math.abs(-5)`,
    output: { type: '__str', value: '5-5' },
  },
  // abs(-0.0) is +0.0, printed as "0.0".
  {
    code: `"" + Math.abs(-0.0)`,
    output: { type: '__str', value: '0.0' },
  },
  {
    code: `"" + Math.abs(-0.0f)`,
    output: { type: '__str', value: '0.0' },
  },
  {
    code: `"" + Math.abs(-2147483648)`,
    output: { type: '__str', value: '-2147483648' },
  },
  // ------------------------- autoboxing / ternary interplay -------------------------
  // A ternary with a null branch boxes the int/long/float/double result to a wrapper.
  {
    code: `(true ? Math.abs(-5) : null).equals(5)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? Math.abs(-5L) : null).equals(5L)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? Math.abs(-5.5) : null).equals(5.5)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? Math.abs(-5.5f) : null).equals(5.5f)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? Math.abs(-5) : null) == 5`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(false ? null : Math.abs(-5)).equals(5)`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- whitespace, parentheses & nesting -------------------------
  {
    code: `Math . abs ( -5 )`,
    output: { type: 'int', value: 5 },
  },
  {
    code: `Math.abs((-(5)))`,
    output: { type: 'int', value: 5 },
  },
  {
    code: `Math.abs(Math.abs(Math.abs(-5)))`,
    output: { type: 'int', value: 5 },
  },
  {
    code: `Math.abs((-5))`,
    output: { type: 'int', value: 5 },
  },
  {
    code: `Math.abs(-(Math.abs(-5)))`,
    output: { type: 'int', value: 5 },
  },
  {
    code: `Math.abs(-(Math.abs(5)))`,
    output: { type: 'int', value: 5 },
  },
  {
    code: `Math.abs(Math.abs(-5) - Math.abs(-8))`,
    output: { type: 'int', value: 3 },
  },
  {
    code: `Math.abs(Math.abs(-5L) - Math.abs(8L))`,
    output: { type: 'long', value: '3' },
  },
  // ------------------------- env: boxed small types & float/double wrappers -------------------------
  {
    code: `Math.abs(x)`,
    env: {
      local: { x: { type: 'byte', value: -5, boxed: true } },
      heap: {},
    },
    output: { type: 'int', value: 5 },
  },
  {
    code: `Math.abs(x)`,
    env: {
      local: { x: { type: 'short', value: -5, boxed: true } },
      heap: {},
    },
    output: { type: 'int', value: 5 },
  },
  {
    code: `Math.abs(x)`,
    env: {
      local: { x: { type: 'char', value: 65, boxed: true } },
      heap: {},
    },
    output: { type: 'int', value: 65 },
  },
  {
    code: `Math.abs(x)`,
    env: {
      local: { x: { type: 'float', value: -5.5, boxed: true } },
      heap: {},
    },
    output: { type: 'float', value: 5.5 },
  },
  {
    code: `Math.abs(x)`,
    env: {
      local: { x: { type: 'double', value: -5.5, boxed: true } },
      heap: {},
    },
    output: { type: 'double', value: 5.5 },
  },
  // MIN values cannot be written as literals; the harness renders parseLong/parseInt.
  {
    code: `Math.abs(x)`,
    env: {
      local: { x: { type: 'int', value: -2147483648, boxed: true } },
      heap: {},
    },
    output: { type: 'int', value: -2147483648 },
  },
  {
    code: `Math.abs(x)`,
    env: {
      local: { x: { type: 'long', value: '-9223372036854775808' } },
      heap: {},
    },
    output: { type: 'long', value: '-9223372036854775808' },
  },
  {
    code: `Math.abs(x)`,
    env: {
      local: { x: { type: 'long', value: '-9223372036854775808', boxed: true } },
      heap: {},
    },
    output: { type: 'long', value: '-9223372036854775808' },
  },
  {
    code: `Math.abs(x + y)`,
    env: {
      local: {
        x: { type: 'long', value: '-3' },
        y: { type: 'long', value: '8' },
      },
      heap: {},
    },
    output: { type: 'long', value: '5' },
  },
  // abs must not mutate its argument.
  {
    code: `Math.abs(x) + x`,
    env: {
      local: { x: { type: 'int', value: -5 } },
      heap: {},
    },
    output: { type: 'int', value: 0 },
  },
  {
    code: `Math.abs(x) + x`,
    env: {
      local: { x: { type: 'long', value: '-5' } },
      heap: {},
    },
    output: { type: 'long', value: '0' },
  },
  {
    code: `Math.abs(x) + x`,
    env: {
      local: { x: { type: 'double', value: -5.5 } },
      heap: {},
    },
    output: { type: 'double', value: 0 },
  },
  {
    code: `Math.abs(x) + x`,
    env: {
      local: { x: { type: 'float', value: -5.5 } },
      heap: {},
    },
    output: { type: 'float', value: 0 },
  },
  // ------------------------- assignment / side-effect contexts -------------------------
  // The value of an assignment expression is the assigned value.
  {
    code: `x = Math.abs(-5)`,
    env: { local: { x: { type: 'int', value: 0 } }, heap: {} },
    output: { type: 'int', value: 5 },
  },
  // Post-increment returns the old value, so abs sees the updated local.
  {
    code: `x++ + Math.abs(x)`,
    env: { local: { x: { type: 'int', value: -5 } }, heap: {} },
    output: { type: 'int', value: -1 },
  },
  {
    code: `Math.abs(x++)`,
    env: { local: { x: { type: 'int', value: -5 } }, heap: {} },
    output: { type: 'int', value: 5 },
  },
  {
    code: `Math.abs(x--)`,
    env: { local: { x: { type: 'long', value: '-5' } }, heap: {} },
    output: { type: 'long', value: '5' },
  },
  // ------------------------- argument evaluated at runtime -------------------------
  {
    code: `Math.abs(1 / 0)`,
    error: 'runtime',
  },
  {
    code: `Math.abs(1L / 0L)`,
    error: 'runtime',
  },
  {
    code: `Math.abs(1 % 0)`,
    error: 'runtime',
  },
  // ------------------------- wrong arity / non-numeric arguments -------------------------
  {
    code: `Math.abs(5L, 3L)`,
    error: 'compile',
  },
  {
    code: `Math.abs(true, false)`,
    error: 'compile',
  },
  {
    code: `Math.abs(1.0f, 2.0f)`,
    error: 'compile',
  },
  {
    code: `Math.abs(null, null)`,
    error: 'compile',
  },
]
