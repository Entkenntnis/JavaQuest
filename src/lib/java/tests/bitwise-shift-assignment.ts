import type { TestSuiteEntry } from '../../state/types'

// ==================== BITWISE / SHIFT / BOOLEAN COMPOUND ASSIGNMENT ====================
// `&= |= ^= <<= >>= >>>=`. Integral LHS gets the same implicit narrowing cast as the
// arithmetic compounds (`byte b; b <<= 1` wraps through int); shift distances are masked by
// the left operand's width. Boolean LHS uses the non-short-circuit `& | ^` forms. Wrapper
// LHS follows the same "promoted result must match the wrapper" rule as the arithmetic
// compounds (only Integer/Long here are legal). No operator here can throw at runtime.
export const bitwiseShiftAssignment: TestSuiteEntry[] = [
  // ------------------------- int: & | ^ -------------------------
  {
    code: `a &= 6`,
    output: { type: 'int', value: 4 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `a |= 6`,
    output: { type: 'int', value: 7 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `a ^= 6`,
    output: { type: 'int', value: 3 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `a &= 0x30`,
    output: { type: 'int', value: 0 },
    env: { local: { a: { type: 'int', value: 0x0f } }, heap: {} },
  },
  {
    code: `a |= 0x30`,
    output: { type: 'int', value: 63 },
    env: { local: { a: { type: 'int', value: 0x0f } }, heap: {} },
  },
  {
    code: `a ^= 0xff`,
    output: { type: 'int', value: 240 },
    env: { local: { a: { type: 'int', value: 0x0f } }, heap: {} },
  },
  {
    code: `a &= a`,
    output: { type: 'int', value: 5 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `a ^= a`,
    output: { type: 'int', value: 0 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  // ------------------------- int: shifts & distance masking -------------------------
  {
    code: `a <<= 2`,
    output: { type: 'int', value: 12 },
    env: { local: { a: { type: 'int', value: 3 } }, heap: {} },
  },
  {
    code: `a >>= 1`,
    output: { type: 'int', value: -4 },
    env: { local: { a: { type: 'int', value: -8 } }, heap: {} },
  },
  {
    code: `a >>>= 1`,
    output: { type: 'int', value: 2147483644 },
    env: { local: { a: { type: 'int', value: -8 } }, heap: {} },
  },
  {
    code: `a <<= 31`,
    output: { type: 'int', value: -2147483648 },
    env: { local: { a: { type: 'int', value: 1 } }, heap: {} },
  },
  {
    code: `a <<= 32`,
    output: { type: 'int', value: 1 },
    env: { local: { a: { type: 'int', value: 1 } }, heap: {} },
  },
  {
    code: `a <<= 33`,
    output: { type: 'int', value: 2 },
    env: { local: { a: { type: 'int', value: 1 } }, heap: {} },
  },
  {
    code: `a >>= 33`,
    output: { type: 'int', value: 4 },
    env: { local: { a: { type: 'int', value: 8 } }, heap: {} },
  },
  {
    code: `a >>>= 32`,
    output: { type: 'int', value: -1 },
    env: { local: { a: { type: 'int', value: -1 } }, heap: {} },
  },
  {
    code: `a >>= 33`,
    output: { type: 'int', value: -1 },
    env: { local: { a: { type: 'int', value: -1 } }, heap: {} },
  },
  {
    code: `a >>>= 31`,
    output: { type: 'int', value: 1 },
    env: { local: { a: { type: 'int', value: -1 } }, heap: {} },
  },
  // ------------------------- int: precedence & evaluation order -------------------------
  {
    code: `a <<= 1 + 2`,
    output: { type: 'int', value: 40 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `a &= 1 | 2`,
    output: { type: 'int', value: 1 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `a ^= 1 == 1 ? 2 : 3`,
    output: { type: 'int', value: 7 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `a <<= (a = 2)`,
    output: { type: 'int', value: 12 },
    env: { local: { a: { type: 'int', value: 3 } }, heap: {} },
  },
  {
    code: `a ^= (a ^= 1)`,
    output: { type: 'int', value: 1 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  // ------------------------- long -------------------------
  {
    code: `a &= 6L`,
    output: { type: 'long', value: '4' },
    env: { local: { a: { type: 'long', value: '5' } }, heap: {} },
  },
  {
    code: `a |= 6`,
    output: { type: 'long', value: '7' },
    env: { local: { a: { type: 'long', value: '5' } }, heap: {} },
  },
  {
    code: `a ^= 1`,
    output: { type: 'long', value: '6' },
    env: { local: { a: { type: 'long', value: '7' } }, heap: {} },
  },
  {
    code: `a <<= 2`,
    output: { type: 'long', value: '12' },
    env: { local: { a: { type: 'long', value: '3' } }, heap: {} },
  },
  {
    code: `a >>= 1`,
    output: { type: 'long', value: '-4' },
    env: { local: { a: { type: 'long', value: '-8' } }, heap: {} },
  },
  {
    code: `a >>>= 1`,
    output: { type: 'long', value: '9223372036854775804' },
    env: { local: { a: { type: 'long', value: '-8' } }, heap: {} },
  },
  {
    code: `a >>>= 63`,
    output: { type: 'long', value: '1' },
    env: { local: { a: { type: 'long', value: '-1' } }, heap: {} },
  },
  {
    code: `a <<= 40`,
    output: { type: 'long', value: '1099511627776' },
    env: { local: { a: { type: 'long', value: '1' } }, heap: {} },
  },
  {
    code: `a <<= 64`,
    output: { type: 'long', value: '1' },
    env: { local: { a: { type: 'long', value: '1' } }, heap: {} },
  },
  {
    code: `a <<= 65`,
    output: { type: 'long', value: '2' },
    env: { local: { a: { type: 'long', value: '1' } }, heap: {} },
  },
  {
    code: `a >>= 65`,
    output: { type: 'long', value: '2' },
    env: { local: { a: { type: 'long', value: '4' } }, heap: {} },
  },
  {
    code: `a >>= 1`,
    output: { type: 'long', value: '-1' },
    env: { local: { a: { type: 'long', value: '-1' } }, heap: {} },
  },
  {
    code: `a ^= a`,
    output: { type: 'long', value: '0' },
    env: { local: { a: { type: 'long', value: '5' } }, heap: {} },
  },
  // ------------------------- byte / short / char: implicit narrowing -------------------------
  {
    code: `a &= 6`,
    output: { type: 'byte', value: 4 },
    env: { local: { a: { type: 'byte', value: 5 } }, heap: {} },
  },
  {
    code: `a &= 0x0f`,
    output: { type: 'byte', value: 15 },
    env: { local: { a: { type: 'byte', value: -1 } }, heap: {} },
  },
  {
    code: `a |= 2`,
    output: { type: 'byte', value: 7 },
    env: { local: { a: { type: 'byte', value: 5 } }, heap: {} },
  },
  {
    code: `a ^= 1`,
    output: { type: 'byte', value: 4 },
    env: { local: { a: { type: 'byte', value: 5 } }, heap: {} },
  },
  {
    code: `a <<= 2`,
    output: { type: 'byte', value: 4 },
    env: { local: { a: { type: 'byte', value: 1 } }, heap: {} },
  },
  {
    code: `a <<= 1`,
    output: { type: 'byte', value: -128 },
    env: { local: { a: { type: 'byte', value: 64 } }, heap: {} },
  },
  {
    code: `a >>= 1`,
    output: { type: 'byte', value: -64 },
    env: { local: { a: { type: 'byte', value: -128 } }, heap: {} },
  },
  {
    code: `a >>>= 1`,
    output: { type: 'byte', value: -1 },
    env: { local: { a: { type: 'byte', value: -1 } }, heap: {} },
  },
  {
    code: `a |= 1`,
    output: { type: 'short', value: 1001 },
    env: { local: { a: { type: 'short', value: 1000 } }, heap: {} },
  },
  {
    code: `a <<= 1`,
    output: { type: 'short', value: -2 },
    env: { local: { a: { type: 'short', value: 32767 } }, heap: {} },
  },
  {
    code: `a >>>= 1`,
    output: { type: 'short', value: -1 },
    env: { local: { a: { type: 'short', value: -1 } }, heap: {} },
  },
  {
    code: `a <<= 8`,
    output: { type: 'char', value: 256 },
    env: { local: { a: { type: 'char', value: 1 } }, heap: {} },
  },
  {
    code: `a &= 0x0f`,
    output: { type: 'char', value: 1 },
    env: { local: { a: { type: 'char', value: 65 } }, heap: {} },
  },
  {
    code: `a >>>= 1`,
    output: { type: 'char', value: 32767 },
    env: { local: { a: { type: 'char', value: 65535 } }, heap: {} },
  },
  {
    code: `a >>= 1`,
    output: { type: 'char', value: 32767 },
    env: { local: { a: { type: 'char', value: 65535 } }, heap: {} },
  },
  {
    code: `a |= 65`,
    output: { type: 'char', value: 65 },
    env: { local: { a: { type: 'char', value: 0 } }, heap: {} },
  },
  {
    code: `a ^= 1`,
    output: { type: 'char', value: 64 },
    env: { local: { a: { type: 'char', value: 65 } }, heap: {} },
  },
  // ------------------------- boolean: non-short-circuit & | ^ -------------------------
  {
    code: `a &= false`,
    output: { type: 'boolean', value: false },
    env: { local: { a: { type: 'boolean', value: true } }, heap: {} },
  },
  {
    code: `a &= true`,
    output: { type: 'boolean', value: true },
    env: { local: { a: { type: 'boolean', value: true } }, heap: {} },
  },
  {
    code: `a |= true`,
    output: { type: 'boolean', value: true },
    env: { local: { a: { type: 'boolean', value: false } }, heap: {} },
  },
  {
    code: `a |= false`,
    output: { type: 'boolean', value: false },
    env: { local: { a: { type: 'boolean', value: false } }, heap: {} },
  },
  {
    code: `a ^= true`,
    output: { type: 'boolean', value: false },
    env: { local: { a: { type: 'boolean', value: true } }, heap: {} },
  },
  {
    code: `a ^= true`,
    output: { type: 'boolean', value: true },
    env: { local: { a: { type: 'boolean', value: false } }, heap: {} },
  },
  {
    code: `(a &= (b = false)) == b`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'boolean', value: true },
        b: { type: 'boolean', value: true },
      },
      heap: {},
    },
  },
  {
    code: `(a |= (b = true)) == b`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'boolean', value: false },
        b: { type: 'boolean', value: false },
      },
      heap: {},
    },
  },
  {
    code: `a ^= (b = true)`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'boolean', value: true },
        b: { type: 'boolean', value: false },
      },
      heap: {},
    },
  },
  // ------------------------- wrapper LHS -------------------------
  {
    code: `a &= 6`,
    output: { type: 'int', value: 4 },
    env: { local: { a: { type: 'int', value: 5, boxed: true } }, heap: {} },
  },
  {
    code: `a |= 6`,
    output: { type: 'int', value: 7 },
    env: { local: { a: { type: 'int', value: 5, boxed: true } }, heap: {} },
  },
  {
    code: `a ^= 6`,
    output: { type: 'int', value: 3 },
    env: { local: { a: { type: 'int', value: 5, boxed: true } }, heap: {} },
  },
  {
    code: `a <<= 1`,
    output: { type: 'long', value: '10' },
    env: { local: { a: { type: 'long', value: '5', boxed: true } }, heap: {} },
  },
  {
    code: `a |= 1`,
    error: 'compile',
    env: { local: { a: { type: 'byte', value: 100, boxed: true } }, heap: {} },
  },
  {
    code: `a &= false`,
    output: { type: 'boolean', value: false },
    env: { local: { a: { type: 'boolean', value: true, boxed: true } }, heap: {} },
  },
  {
    code: `a |= true`,
    output: { type: 'boolean', value: true },
    env: { local: { a: { type: 'boolean', value: false, boxed: true } }, heap: {} },
  },
  // ------------------------- mixed-width / boxed RHS -------------------------
  {
    code: `a &= b`,
    output: { type: 'int', value: 4 },
    env: {
      local: {
        a: { type: 'int', value: 5 },
        b: { type: 'long', value: '6' },
      },
      heap: {},
    },
  },
  {
    code: `a <<= b`,
    output: { type: 'int', value: 20 },
    env: {
      local: {
        a: { type: 'int', value: 5 },
        b: { type: 'long', value: '2' },
      },
      heap: {},
    },
  },
  {
    code: `a &= b`,
    output: { type: 'int', value: 5 },
    env: {
      local: {
        a: { type: 'int', value: 5 },
        b: { type: 'int', value: 7, boxed: true },
      },
      heap: {},
    },
  },
  // ------------------------- invalid operands -------------------------
  {
    code: `a &= true`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a |= true`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a ^= true`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a &= 1`,
    error: 'compile',
    env: { local: { a: { type: 'boolean', value: false } }, heap: {} },
  },
  {
    code: `a |= 1`,
    error: 'compile',
    env: { local: { a: { type: 'boolean', value: false } }, heap: {} },
  },
  {
    code: `a ^= 1`,
    error: 'compile',
    env: { local: { a: { type: 'boolean', value: false } }, heap: {} },
  },
  {
    code: `a <<= 1`,
    error: 'compile',
    env: { local: { a: { type: 'boolean', value: false } }, heap: {} },
  },
  {
    code: `a >>= 1`,
    error: 'compile',
    env: { local: { a: { type: 'boolean', value: false } }, heap: {} },
  },
  {
    code: `a >>>= 1`,
    error: 'compile',
    env: { local: { a: { type: 'boolean', value: false } }, heap: {} },
  },
  {
    code: `a <<= 1.5`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a >>= 1.5f`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a <<= true`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a &= "x"`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a |= "x"`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a ^= "x"`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a <<= "x"`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a &= 1`,
    error: 'compile',
    env: {
      local: { a: { type: 'reference', ref: 'h' } },
      heap: { h: { class: 'java.lang.String', value: 'x', isInterned: true } },
    },
  },
  {
    code: `5 <<= 1`,
    error: 'compile',
  },
  {
    code: `a <<= 1`,
    error: 'compile',
    env: { local: { a: { type: 'null', value: null } }, heap: {} },
  },
  {
    code: `a &= b`,
    error: 'compile',
    env: {
      local: {
        a: { type: 'int', value: 0 },
        b: { type: 'boolean', value: true },
      },
      heap: {},
    },
  },
]
