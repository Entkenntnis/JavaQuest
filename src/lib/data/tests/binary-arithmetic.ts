import type { TestSuiteEntry } from '../../state/types'

export const binaryArithmetic: TestSuiteEntry[] = [
  // ==================== BINARY ARITHMETIC ====================
  // ------------------------- binary arithmetic: int -------------------------
  {
    code: `1 + 2`,
    output: { type: 'int', value: 3 },
  },
  {
    code: `2 - 9`,
    output: { type: 'int', value: -7 },
  },
  {
    code: `5 * 7`,
    output: { type: 'int', value: 35 },
  },
  {
    code: `7 / 2`,
    output: { type: 'int', value: 3 },
  },
  {
    code: `7 % 4`,
    output: { type: 'int', value: 3 },
  },
  {
    code: `-7 / 2`,
    output: { type: 'int', value: -3 },
  },
  {
    code: `7 / -2`,
    output: { type: 'int', value: -3 },
  },
  {
    code: `-7 % 3`,
    output: { type: 'int', value: -1 },
  },
  {
    code: `7 % -3`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `-7 % -3`,
    output: { type: 'int', value: -1 },
  },

  // ------------------------- binary arithmetic: int: overflow wrap & MIN edge cases -------------------------
  {
    code: `2147483647 + 1`,
    output: { type: 'int', value: -2147483648 },
  },
  {
    code: `2000000000 + 2000000000`,
    output: { type: 'int', value: -294967296 },
  },
  {
    code: `-2147483648 - 1`,
    output: { type: 'int', value: 2147483647 },
  },
  {
    code: `2147483647 * 2`,
    output: { type: 'int', value: -2 },
  },
  {
    code: `-2147483648 / -1`,
    output: { type: 'int', value: -2147483648 },
  },
  {
    code: `-2147483648 * -1`,
    output: { type: 'int', value: -2147483648 },
  },
  {
    code: `-2147483648 % -1`,
    output: { type: 'int', value: 0 },
  },

  // ------------------------- binary arithmetic: long -------------------------
  {
    code: `-10L / 4L`,
    output: { type: 'long', value: '-2' },
  },
  {
    code: `10L / -3L`,
    output: { type: 'long', value: '-3' },
  },
  {
    code: `9223372036854775807L % 2L`,
    output: { type: 'long', value: '1' },
  },
  {
    code: `1L + 1`,
    output: { type: 'long', value: '2' },
  },
  {
    code: `5L * 5`,
    output: { type: 'long', value: '25' },
  },
  {
    code: `-7L / 2`,
    output: { type: 'long', value: '-3' },
  },
  {
    code: `7L % 3`,
    output: { type: 'long', value: '1' },
  },
  {
    code: `-5L % 2L`,
    output: { type: 'long', value: '-1' },
  },
  {
    code: `9223372036854775807L / -1L`,
    output: { type: 'long', value: '-9223372036854775807' },
  },

  // ------------------------- binary arithmetic: long: overflow wrap -------------------------
  {
    code: `9223372036854775807L + 1L`,
    output: { type: 'long', value: '-9223372036854775808' },
  },
  {
    code: `-9223372036854775808L - 1L`,
    output: { type: 'long', value: '9223372036854775807' },
  },
  {
    code: `9223372036854775807L * 2L`,
    output: { type: 'long', value: '-2' },
  },
  {
    code: `-9223372036854775808L / -1L`,
    output: { type: 'long', value: '-9223372036854775808' },
  },

  // ------------------------- binary arithmetic: float -------------------------
  {
    code: `1.5f + 2.25f`,
    output: { type: 'float', value: 3.75 },
  },
  {
    code: `3f / 4f`,
    output: { type: 'float', value: 0.75 },
  },
  {
    code: `0.1f + 0.2f`,
    output: { type: 'float', value: 0.30000001192092896 },
  },
  {
    code: `1f / 3f`,
    output: { type: 'float', value: 0.3333333432674408 },
  },
  {
    code: `5.5f % 2f`,
    output: { type: 'float', value: 1.5 },
  },
  {
    code: `-5.5f % 2.5f`,
    output: { type: 'float', value: -0.5 },
  },

  // ------------------------- binary arithmetic: double -------------------------
  {
    code: `0.1 + 0.2`,
    output: { type: 'double', value: 0.30000000000000004 },
  },
  {
    code: `1.0 / 3.0`,
    output: { type: 'double', value: 0.3333333333333333 },
  },
  {
    code: `10 / 3.0`,
    output: { type: 'double', value: 3.3333333333333335 },
  },
  {
    code: `-7.5 % 2.0`,
    output: { type: 'double', value: -1.5 },
  },
  {
    code: `7.5 % -2.0`,
    output: { type: 'double', value: 1.5 },
  },
  {
    code: `-1.0 / 4.0`,
    output: { type: 'double', value: -0.25 },
  },
  {
    code: `(long)(0.0 / 0.0)`,
    output: { type: 'long', value: '0' },
  },
  {
    code: `(int)(0.0 / 0.0)`,
    output: { type: 'int', value: 0 },
  },

  // ------------------------- binary arithmetic: char / byte / short (promote to int) -------------------------
  {
    code: `'a' + 1`,
    output: { type: 'int', value: 98 },
  },
  {
    code: `'z' - 'a'`,
    output: { type: 'int', value: 25 },
  },
  {
    code: `(byte)100 + (byte)100`,
    output: { type: 'int', value: 200 },
  },
  {
    code: `'a' / 2`,
    output: { type: 'int', value: 48 },
  },
  {
    code: `'Z' - 'A' + 'a' - 'z' + '0' % 10`,
    output: { type: 'int', value: 8 },
  },
  {
    code: `(byte)(300 * 2) + 50`,
    output: { type: 'int', value: 138 },
  },
  {
    code: `(short)70000 / 100 % 10 + '5' - '0'`,
    output: { type: 'int', value: 9 },
  },
  {
    code: `('z' - 'a') * 4 + ('A' % 'B') - ('0' + 5) / 2`,
    output: { type: 'int', value: 139 },
  },

  // ------------------------- binary arithmetic: casts & widening -------------------------
  {
    code: `2.5f + 1`,
    output: { type: 'float', value: 3.5 },
  },
  {
    code: `2.5 + 1`,
    output: { type: 'double', value: 3.5 },
  },
  {
    code: `1L + 1.5`,
    output: { type: 'double', value: 2.5 },
  },
  {
    code: `(int)7.7 / 2`,
    output: { type: 'int', value: 3 },
  },
  {
    code: `(long)2147483647 + 1`,
    output: { type: 'long', value: '2147483648' },
  },

  // ------------------------- binary arithmetic: precedence, parens, associativity -------------------------
  {
    code: `1 + 2 * 3`,
    output: { type: 'int', value: 7 },
  },
  {
    code: `(1 + 2) * 3`,
    output: { type: 'int', value: 9 },
  },
  {
    code: `10 - 2 - 3`,
    output: { type: 'int', value: 5 },
  },
  {
    code: `20 / 5 / 2`,
    output: { type: 'int', value: 2 },
  },
  {
    code: `6 + 4 / 2 * 3`,
    output: { type: 'int', value: 12 },
  },
  {
    code: `2 * 3 + 4 * 5`,
    output: { type: 'int', value: 26 },
  },
  {
    code: `2 + 3 * 4 - 5`,
    output: { type: 'int', value: 9 },
  },
  {
    code: `-2 * 3 + 4`,
    output: { type: 'int', value: -2 },
  },
  {
    code: `(1 + 2) * (3 - 4)`,
    output: { type: 'int', value: -3 },
  },
  {
    code: `10 % 4 % 3`,
    output: { type: 'int', value: 2 },
  },

  // ------------------------- binary arithmetic: '%' associativity & mixing -------------------------
  {
    code: `10 % 4 + 1`,
    output: { type: 'int', value: 3 },
  },
  {
    code: `3 + 4 % 3`,
    output: { type: 'int', value: 4 },
  },
  {
    code: `2 % 3 * 4`,
    output: { type: 'int', value: 8 },
  },
  {
    code: `(1 + 2) % 3`,
    output: { type: 'int', value: 0 },
  },

  // ------------------------- binary arithmetic: modulo sign semantics -------------------------
  {
    code: `7L % -3L`,
    output: { type: 'long', value: '1' },
  },
  {
    code: `-7L % 3L`,
    output: { type: 'long', value: '-1' },
  },
  {
    code: `7.5 % 2.0`,
    output: { type: 'double', value: 1.5 },
  },
  {
    code: `1.5 % 1.0`,
    output: { type: 'double', value: 0.5 },
  },
  {
    code: `-1.5 % 1.0`,
    output: { type: 'double', value: -0.5 },
  },
  // ------------------------- binary arithmetic: longer expressions (int) -------------------------
  {
    code: `((3 + 7) * 5 - 100 / 4) % 11 + (8 - 2) * (9 - 6) / 3 - 1`,
    output: { type: 'int', value: 8 },
  },
  {
    code: `2 + 3 * 4 - 6 / 3 % 5 + 1 * (2 + 8) / (5 - 3) - 7 % 2`,
    output: { type: 'int', value: 16 },
  },
  {
    code: `-2147483648 / 3 + 7 % 3 * (1 - 2) + 46341 * 46341`,
    output: { type: 'int', value: 1431660398 },
  },
  {
    code: `2 * (3 + 4) - 6 / (2 - 1) + (8 % 3) * 5 - (10 - 2) / 4 + 3 * (1 + 2) % 7`,
    output: { type: 'int', value: 18 },
  },
  {
    code: `((1 + 2) * (3 - 4) % (5 + 6) / (7 - 8) + 9 * 10) - (11 - 12) * (13 % 4) / 3 + 2`,
    output: { type: 'int', value: 95 },
  },
  {
    code: `-(-3 + 5) * (2 + -4) / (1 - 5) + -7 % 3 * 6 - 2`,
    output: { type: 'int', value: -9 },
  },

  // ------------------------- binary arithmetic: longer expressions (long) -------------------------
  {
    code: `(9223372036854775807L - 1L) / 2L + (3L * 5L - 7L % 3L) * (8L / 4L + 2L) - 1L * 3L % 5L`,
    output: { type: 'long', value: '4611686018427387956' },
  },
  {
    code: `2L + 3L * (4L - 1L) - (9223372036854775807L / 3L + 1L) % 1000000L + 7L * (2L + 3L) / 5L`,
    output: { type: 'long', value: '-258585' },
  },
  {
    code: `-9223372036854775808L / -1L / 2L + 1L * (3L - 5L)`,
    output: { type: 'long', value: '-4611686018427387906' },
  },
  {
    code: `(1 + 2L) * 3 - (4 / 2L) + 5L % 3 * (6 - 1)`,
    output: { type: 'long', value: '17' },
  },

  // ------------------------- binary arithmetic: longer expressions (double) -------------------------
  {
    code: `(1.5 + 2.25) * (10.0 - 3.0) / 4.0 - (0.75 * 8.0) % 2.5 + (1.0 / 3.0) * 6.0 - 0.5`,
    output: { type: 'double', value: 7.0625 },
  },
  {
    code: `10.0 - 2.0 * (3.0 + 1.0) / (2.0 - 0.5) + 7.0 % 2.5 * (1.0 + 2.0) - 0.1 - 0.2`,
    output: { type: 'double', value: 10.366666666666669 },
  },
  {
    code: `((10.0 - 4.5) * 2.0 + 3.0 / 2.0) / (0.5 + 0.25) - 7.5 % 2.0 * 1.0`,
    output: { type: 'double', value: 15.166666666666668 },
  },
  {
    code: `1L + 2 * 3 - 4.0 + 5f * 2 / 2.5 - (6 + 7L) % 4 * 1.5 + 0.5`,
    output: { type: 'double', value: 6 },
  },

  // ------------------------- binary arithmetic: longer expressions (float) -------------------------
  {
    code: `2.5f * (3.0f + 1.0f) - 10.0f / 4.0f + (0.5f + 0.5f) % 1.5f * (4.0f - 1.0f) - 0.25f`,
    output: { type: 'float', value: 10.25 },
  },
  {
    code: `(1.5f - 0.5f) * (10.0f + 2.0f) / 3.0f + (0.1f + 0.2f) % 0.5f - (2.0f * 1.5f - 1.0f) * 2.0f`,
    output: { type: 'float', value: 0.3000001907348633 },
  },
  // ------------------------- binary arithmetic: division / modulo by zero (ArithmeticException) -------------------------
  {
    code: `1 / 0`,
    isError: true,
  },
  {
    code: `1 % 0`,
    isError: true,
  },
  {
    code: `0 / 0`,
    isError: true,
  },
  {
    code: `1L / 0L`,
    isError: true,
  },
  {
    code: `1L % 0L`,
    isError: true,
  },

  // ------------------------- binary arithmetic: non-numeric operands (errors) -------------------------
  {
    code: `true + 1`,
    isError: true,
  },
  {
    code: `false * 2`,
    isError: true,
  },
  {
    code: `null - 1`,
    isError: true,
  },
  {
    code: `true / false`,
    isError: true,
  },

]
