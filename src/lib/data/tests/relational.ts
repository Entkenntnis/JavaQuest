import type { TestSuiteEntry } from '../../state/types'

export const relational: TestSuiteEntry[] = [
  // ==================== RELATIONAL (< > <= >=) ====================
  // ------------------------- relational: int operator matrix -------------------------
  {
    code: `2 < 3`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `3 < 2`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `2 > 3`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `3 > 2`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `2 <= 3`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `3 <= 2`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `2 >= 3`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `3 >= 2`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `2 < 2`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `2 > 2`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `2 <= 2`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `2 >= 2`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `-1 < 1`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `-1 > -2`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `-1 <= -1`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `-1 >= 0`,
    output: { type: 'boolean', value: false },
  },
  // ------------------------- relational: arithmetic operands -------------------------
  {
    code: `1 + 2 < 4`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `1 + 2 < 2`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `10 - 3 > 6`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `2 * 3 >= 6`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `7 % 4 > 3`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `-7 % 3 < 0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(1 + 2) * 3 > 8`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `1 << 3 > 7`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `1 << 3 < 9`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `-2 * 3 >= -6`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- relational: char -------------------------
  {
    code: `'a' < 'b'`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `'b' > 'a'`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `'a' <= 'a'`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `'a' >= 'b'`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `'a' < 98`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `'a' > 97`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `'a' >= 97`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `'a' <= 96`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `'Z' < 'a'`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `'Ω' > 1000`,
    output: { type: 'boolean', value: false },
  },
  // ------------------------- relational: byte & short casts -------------------------
  {
    code: `(byte)200 < 0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(byte)200 > 0`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(byte)128 < 0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(byte)127 > 0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(byte)-1 <= -1`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(short)70000 > 0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(short)40000 < 0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(short)32767 >= 32767`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(short)-32768 < 0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `'a' > (byte)-1`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- relational: int boundary values -------------------------
  {
    code: `2147483647 > -2147483648`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `-2147483648 < -2147483647`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `-2147483648 > 0`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `2147483647 <= 2147483647`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `-2147483648 <= -2147483648`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `0x80000000 < 0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `0xffffffff < 0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `0x7fffffff > 0`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- relational: long widening -------------------------
  {
    code: `1L < 2`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `2L > 1`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `2L <= 2`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `2L >= 3`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `9223372036854775807L > 0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `9223372036854775807L >= 9223372036854775807L`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `9223372036854775806L < 9223372036854775807L`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `-9223372036854775808L < 0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `-9223372036854775808L <= -9223372036854775808L`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `0x8000000000000000L < 0L`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `0x7fffffffffffffffL > 0x8000000000000000L`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `'a' < 97L`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `'a' <= 97L`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `1L > 'a'`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `'a' < 100L`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `2147483647 < 2147483648L`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- relational: float/double cross-type -------------------------
  {
    code: `1.5 < 1.5f`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `1.5 <= 1.5f`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `1.5 > 1.5f`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `1.5 >= 1.5f`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `2.5 > 1.5f`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `1.5f < 2.5`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `1.5f < 2`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `-1.0f < 0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `0.1f < 0.1`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `0.1f > 0.1`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `0.1f >= 0.1`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `0.1f <= 0.1`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `1 < 1.5`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `2 <= 2.0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `3 >= 3.0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `4 > 3.99`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `'a' < 98.0`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- relational: int/float rounding & long/double precision traps -------------------------
  {
    code: `16777217 > 16777216f`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `16777217 >= 16777216f`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `9007199254740993L > 9007199254740992.0`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `9007199254740993L <= 9007199254740992.0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `9007199254740993L >= 9007199254740992.0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `-9007199254740993L < -9007199254740992.0`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `-9007199254740993L <= -9007199254740992.0`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- relational: Infinity -------------------------
  {
    code: `(1.0/0.0) > 1e308`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(1.0/0.0) < 1e308`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(-1.0/0.0) < -1e308`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(1.0/0.0) > (1.0/0.0)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(1.0/0.0) >= (1.0/0.0)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(1.0f/0.0f) >= (1.0/0.0)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(1.0f/0.0f) < (1.0/0.0)`,
    output: { type: 'boolean', value: false },
  },
  // ------------------------- relational: NaN & signed zero -------------------------
  {
    code: `(0.0/0.0) < 1`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(0.0/0.0) > 1`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(0.0/0.0) <= 1`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(0.0/0.0) >= 1`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `1 <= (0.0/0.0)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(0.0/0.0) < (0.0/0.0)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(0.0/0.0) >= (0.0/0.0)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `-0.0 < 0.0`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `-0.0 > 0.0`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `-0.0 <= 0.0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `-0.0 >= 0.0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `0.0 <= -0.0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `0.0 > -0.0`,
    output: { type: 'boolean', value: false },
  },
  // ------------------------- relational: long saturation casts -------------------------
  {
    code: `(long)1e20 <= 9223372036854775807L`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(long)1e20 < 9223372036854775807L`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(long)-1e20 >= -9223372036854775808L`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(long)-1e20 < -9223372036854775808L`,
    output: { type: 'boolean', value: false },
  },
  // ------------------------- relational: compile-time type errors -------------------------
  {
    code: `true < false`,
    error: 'compile',
  },
  {
    code: `false >= true`,
    error: 'compile',
  },
  {
    code: `true <= 1`,
    error: 'compile',
  },
  {
    code: `"a" < "b"`,
    error: 'compile',
  },
  {
    code: `1 < "x"`,
    error: 'compile',
  },
  {
    code: `null < 1`,
    error: 'compile',
  },
  {
    code: `'a' > true`,
    error: 'compile',
  },
  // ------------------------- relational: regression guards for composite relational expressions -------------------------
  // A relational expression has type boolean, and relational operators bind tighter than
  // ==/!=. These cases lock that in: relational results usable in boolean contexts
  // (!, &&, ||), compared with ==/!=, chained relational as compile errors, and the
  // precedence of equality-before-relational groupings. Expectations match real Java.
  // ------------------------- relational: relational in boolean contexts -------------------------
  {
    code: `!(1 < 2)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `!(2 < 1)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `!('a' > 'b')`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `!(2L >= 3L)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `!((0.0/0.0) < 1)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(1 < 2) && (2 < 3)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(1 < 2) && (3 < 2)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(1 > 2) || (2 < 3)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `('a' < 'b') && (1 <= 1)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(2 > 3) || (1 < 1)`,
    output: { type: 'boolean', value: false },
  },
  // ------------------------- relational: relational result vs. boolean / equality -------------------------
  {
    code: `(1 < 2) == true`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(2 < 1) == true`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(1 < 2) != false`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(1 + 1 < 3) == true`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `2 < 3 == false`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `2 > 3 == false`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `1 < 2 == 3 < 4`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `5 < 4 == 2 > 1`,
    output: { type: 'boolean', value: false },
  },
  // ------------------------- relational: chained relational (compile error in Java) -------------------------
  {
    code: `1 < 2 < 3`,
    error: 'compile',
  },
  {
    code: `1 < 2 <= 3`,
    error: 'compile',
  },
  {
    code: `3 > 2 >= 1`,
    error: 'compile',
  },
  // ------------------------- relational: equality before relational (precedence) -------------------------
  {
    code: `true == 1 < 2`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `false == 2 > 1`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `true != 1 < 1`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `false == 0 < 1`,
    output: { type: 'boolean', value: false },
  },
]
