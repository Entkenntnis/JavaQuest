import type { TestSuiteEntry } from '../../state/types'

export const shiftOperators: TestSuiteEntry[] = [
  // ==================== SHIFT OPERATORS (<< / >> / >>>) ====================
  // JLS 15.19: each operand is unary-numeric-promoted individually (byte/short/
  // char -> int); the result type is the promoted type of the LEFT operand only
  // (long if the left operand is long, otherwise int). The right operand only
  // supplies a shift distance; its type does not affect the result type.
  // ------------------------- shifts: int basics -------------------------
  {
    code: `1 << 3`,
    output: { type: 'int', value: 8 },
  },
  {
    code: `4 << 2`,
    output: { type: 'int', value: 16 },
  },
  {
    code: `1 << 30`,
    output: { type: 'int', value: 1073741824 },
  },
  {
    code: `1 << 31`,
    output: { type: 'int', value: -2147483648 },
  },
  {
    code: `16 >> 2`,
    output: { type: 'int', value: 4 },
  },
  {
    code: `-16 >> 2`,
    output: { type: 'int', value: -4 },
  },
  {
    code: `7 >> 1`,
    output: { type: 'int', value: 3 },
  },
  {
    code: `-7 >> 1`,
    output: { type: 'int', value: -4 },
  },
  {
    code: `16 >>> 2`,
    output: { type: 'int', value: 4 },
  },
  {
    code: `-16 >>> 2`,
    output: { type: 'int', value: 1073741820 },
  },
  {
    code: `7 >>> 1`,
    output: { type: 'int', value: 3 },
  },
  // ------------------------- shifts: int overflow & sign bits -------------------------
  {
    code: `2147483647 << 1`,
    output: { type: 'int', value: -2 },
  },
  {
    code: `-2147483648 << 1`,
    output: { type: 'int', value: 0 },
  },
  {
    code: `-1 >> 1`,
    output: { type: 'int', value: -1 },
  },
  {
    code: `-1 >> 31`,
    output: { type: 'int', value: -1 },
  },
  {
    code: `-2147483648 >> 31`,
    output: { type: 'int', value: -1 },
  },
  {
    code: `-2147483648 >> 30`,
    output: { type: 'int', value: -2 },
  },
  {
    code: `-2147483648 >>> 1`,
    output: { type: 'int', value: 1073741824 },
  },
  {
    code: `-1 >>> 1`,
    output: { type: 'int', value: 2147483647 },
  },
  {
    code: `-1 >>> 31`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `-2147483648 >>> 31`,
    output: { type: 'int', value: 1 },
  },
  // ------------------------- shifts: int distance masking (low 5 bits) -------------------------
  // For int operands only the five lowest-order bits of the (promoted) right
  // operand are used: distance = right & 0x1f (JLS 15.19).
  {
    code: `1 << 32`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `1 << 33`,
    output: { type: 'int', value: 2 },
  },
  {
    code: `1 << 63`,
    output: { type: 'int', value: -2147483648 },
  },
  {
    code: `1 << -1`,
    output: { type: 'int', value: -2147483648 },
  },
  {
    code: `1 >> 32`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `-1 >> 32`,
    output: { type: 'int', value: -1 },
  },
  {
    code: `1 >>> 32`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `8 >>> 32`,
    output: { type: 'int', value: 8 },
  },
  // A masked-to-zero distance must not disturb the sign: -1 >>> 0 == -1, not 4294967295.
  {
    code: `-1 >>> 0`,
    output: { type: 'int', value: -1 },
  },
  {
    code: `-5 >>> 0`,
    output: { type: 'int', value: -5 },
  },
  {
    code: `-2147483648 >>> 0`,
    output: { type: 'int', value: -2147483648 },
  },
  {
    code: `-1 >>> 32`,
    output: { type: 'int', value: -1 },
  },
  {
    code: `5 << 0`,
    output: { type: 'int', value: 5 },
  },
  {
    code: `5 >> 0`,
    output: { type: 'int', value: 5 },
  },
  // ------------------------- shifts: byte/short/char left operand promotes to int -------------------------
  {
    code: `'a' << 2`,
    output: { type: 'int', value: 388 },
  },
  {
    code: `'a' >> 1`,
    output: { type: 'int', value: 48 },
  },
  {
    code: `(byte)8 << 1`,
    output: { type: 'int', value: 16 },
  },
  {
    code: `(short)100 >> 2`,
    output: { type: 'int', value: 25 },
  },
  {
    code: `(byte)-1 >> 1`,
    output: { type: 'int', value: -1 },
  },
  {
    code: `(byte)-1 >>> 1`,
    output: { type: 'int', value: 2147483647 },
  },
  {
    code: `(byte)-128 >> 1`,
    output: { type: 'int', value: -64 },
  },
  {
    code: `(char)65535 >> 8`,
    output: { type: 'int', value: 255 },
  },
  {
    code: `(char)65535 >>> 1`,
    output: { type: 'int', value: 32767 },
  },
  {
    code: `'ÿ' >> 2`,
    output: { type: 'int', value: 63 },
  },
  {
    code: `(byte)5 >>> 1`,
    output: { type: 'int', value: 2 },
  },
  // ------------------------- shifts: right operand is byte/short/char -------------------------
  {
    code: `1 << (byte)3`,
    output: { type: 'int', value: 8 },
  },
  {
    code: `1 << (char)4`,
    output: { type: 'int', value: 16 },
  },
  // ------------------------- shifts: mixed widths (result type driven by LEFT operand) -------------------------
  // A long right operand is only a distance; an int/char/byte/short left operand
  // still yields an int result.
  {
    code: `5 << 1L`,
    output: { type: 'int', value: 10 },
  },
  {
    code: `1 << -1L`,
    output: { type: 'int', value: -2147483648 },
  },
  {
    code: `1 << 64L`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `(char)3 << 1L`,
    output: { type: 'int', value: 6 },
  },
  {
    code: `(byte)100 << 1L`,
    output: { type: 'int', value: 200 },
  },
  {
    code: `1 << 1L + 1L`,
    output: { type: 'int', value: 4 },
  },
  // ------------------------- shifts: long basics -------------------------
  {
    code: `1L << 3`,
    output: { type: 'long', value: '8' },
  },
  {
    code: `5L << 1`,
    output: { type: 'long', value: '10' },
  },
  {
    code: `5L >> 1`,
    output: { type: 'long', value: '2' },
  },
  {
    code: `8L >>> 1`,
    output: { type: 'long', value: '4' },
  },
  {
    code: `-8L >> 1`,
    output: { type: 'long', value: '-4' },
  },
  // ------------------------- shifts: long overflow & sign bits -------------------------
  {
    code: `-1L >> 1`,
    output: { type: 'long', value: '-1' },
  },
  {
    code: `-1L >> 63`,
    output: { type: 'long', value: '-1' },
  },
  {
    code: `-9223372036854775808L >> 63`,
    output: { type: 'long', value: '-1' },
  },
  {
    code: `9223372036854775807L >> 1`,
    output: { type: 'long', value: '4611686018427387903' },
  },
  {
    code: `-9223372036854775808L >> 1`,
    output: { type: 'long', value: '-4611686018427387904' },
  },
  {
    code: `9223372036854775807L << 1`,
    output: { type: 'long', value: '-2' },
  },
  {
    code: `-9223372036854775808L << 1`,
    output: { type: 'long', value: '0' },
  },
  {
    code: `4611686018427387904L << 1`,
    output: { type: 'long', value: '-9223372036854775808' },
  },
  {
    code: `-1L << 1`,
    output: { type: 'long', value: '-2' },
  },
  {
    code: `-2L << 1`,
    output: { type: 'long', value: '-4' },
  },
  {
    code: `-1L << 62`,
    output: { type: 'long', value: '-4611686018427387904' },
  },
  // ------------------------- shifts: long distance masking (low 6 bits) -------------------------
  // For long operands only the six lowest-order bits of the right operand are
  // used: distance = right & 0x3f (JLS 15.19).
  {
    code: `1L << 63`,
    output: { type: 'long', value: '-9223372036854775808' },
  },
  {
    code: `1L << 64`,
    output: { type: 'long', value: '1' },
  },
  {
    code: `1L << 65`,
    output: { type: 'long', value: '2' },
  },
  {
    code: `1L << -1`,
    output: { type: 'long', value: '-9223372036854775808' },
  },
  {
    code: `1L >> 64`,
    output: { type: 'long', value: '1' },
  },
  {
    code: `1L >> 65`,
    output: { type: 'long', value: '0' },
  },
  // A masked-to-zero distance must not disturb the sign: -1L >>> 0 == -1L.
  {
    code: `-1L >>> 0`,
    output: { type: 'long', value: '-1' },
  },
  {
    code: `-1L >>> 64`,
    output: { type: 'long', value: '-1' },
  },
  {
    code: `-9223372036854775808L >>> 0`,
    output: { type: 'long', value: '-9223372036854775808' },
  },
  // ------------------------- shifts: long logical right shift (zero-extension) -------------------------
  {
    code: `-1L >>> 1`,
    output: { type: 'long', value: '9223372036854775807' },
  },
  {
    code: `-1L >>> 63`,
    output: { type: 'long', value: '1' },
  },
  {
    code: `-9223372036854775808L >>> 1`,
    output: { type: 'long', value: '4611686018427387904' },
  },
  {
    code: `-9223372036854775808L >>> 63`,
    output: { type: 'long', value: '1' },
  },
  {
    code: `-4611686018427387904L >> 1`,
    output: { type: 'long', value: '-2305843009213693952' },
  },
  {
    code: `-4611686018427387904L >>> 1`,
    output: { type: 'long', value: '6917529027641081856' },
  },
  // ------------------------- shifts: precedence & associativity -------------------------
  // Shift binds looser than additive but tighter than relational/equality, and is
  // left-associative (JLS 15.19 / 15.18 / 15.17).
  {
    code: `1 << 2 + 1`,
    output: { type: 'int', value: 8 },
  },
  {
    code: `1 + 1 << 2`,
    output: { type: 'int', value: 8 },
  },
  {
    code: `1 << 2 << 3`,
    output: { type: 'int', value: 32 },
  },
  {
    code: `32 >> 2 >> 1`,
    output: { type: 'int', value: 4 },
  },
  {
    code: `1 << 2 + 3 >> 1`,
    output: { type: 'int', value: 16 },
  },
  {
    code: `(1 << 2) + 3`,
    output: { type: 'int', value: 7 },
  },
  {
    code: `10 >> (1 + 1)`,
    output: { type: 'int', value: 2 },
  },
  {
    code: `(byte)64 << (2 - 1)`,
    output: { type: 'int', value: 128 },
  },
  {
    code: `(2 + 3) << 1`,
    output: { type: 'int', value: 10 },
  },
  {
    code: `(1 << 4) + (1 << 3)`,
    output: { type: 'int', value: 24 },
  },
  // ------------------------- shifts: comparisons embedding shifts -------------------------
  {
    code: `(1 << 31) == -2147483648`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(1 << 31) == -2147483647`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(3 + 1 << 2) == 16`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(1 << 2 + 3) == 32`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(-1 >>> 1) == 2147483647`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(1L << 63) == -9223372036854775808L`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(-1L >>> 1) == 9223372036854775807L`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- shifts: identifiers -------------------------
  {
    code: `a << 1`,
    output: { type: 'int', value: 10 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `a << xl`,
    output: { type: 'int', value: 5120 },
    env: {
      local: {
        a: { type: 'int', value: 5 },
        xl: { type: 'long', value: '10' },
      },
      heap: {},
    },
  },
  {
    code: `a << 1L`,
    output: { type: 'int', value: 10 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `xl << 1`,
    output: { type: 'long', value: '20' },
    env: { local: { xl: { type: 'long', value: '10' } }, heap: {} },
  },
  {
    code: `xl >> a`,
    output: { type: 'long', value: '312500000' },
    env: {
      local: {
        xl: { type: 'long', value: '10000000000' },
        a: { type: 'int', value: 5 },
      },
      heap: {},
    },
  },
  {
    code: `by >> 1`,
    output: { type: 'int', value: -50 },
    env: { local: { by: { type: 'byte', value: -100 } }, heap: {} },
  },
  {
    code: `ch << 1`,
    output: { type: 'int', value: 130 },
    env: { local: { ch: { type: 'char', value: 65 } }, heap: {} },
  },
  // ------------------------- shifts: constant folding string identities -------------------------
  {
    code: `("" + (1 << 4)) == "16"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("" + (1 << 31)) == "-2147483648"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("" + (-1 >>> 1)) == "2147483647"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("" + (1L << 62)) == "4611686018427387904"`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- shifts: compile-time type errors -------------------------
  {
    code: `1 << 1.5`,
    error: 'compile',
  },
  {
    code: `1.5 << 1`,
    error: 'compile',
  },
  {
    code: `1.0f >> 1L`,
    error: 'compile',
  },
  {
    code: `1L << 1.0f`,
    error: 'compile',
  },
  {
    code: `true << 1`,
    error: 'compile',
  },
  {
    code: `1 << true`,
    error: 'compile',
  },
  {
    code: `1 << "a"`,
    error: 'compile',
  },
  {
    code: `"a" << 1`,
    error: 'compile',
  },
  {
    code: `null << 1`,
    error: 'compile',
  },
  {
    code: `1 << (boolean)true`,
    error: 'compile',
  },

]
