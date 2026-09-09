import type { TestSuiteEntry } from '../../state/types'

export const bitwiseOperators: TestSuiteEntry[] = [
  // ==================== BITWISE OPERATORS (& / | / ^) ====================
  // JLS 15.22: on integral operands binary numeric promotion applies and the
  // result type is int (or long when either operand is long); on boolean
  // operands & | ^ are non-short-circuiting logical operators.
  // ------------------------- bitwise &: int basics -------------------------
  {
    code: `6 & 3`,
    output: { type: 'int', value: 2 },
  },
  {
    code: `255 & 256`,
    output: { type: 'int', value: 0 },
  },
  {
    code: `0xFF & 0x0F`,
    output: { type: 'int', value: 15 },
  },
  {
    code: `-1 & 0xFF`,
    output: { type: 'int', value: 255 },
  },
  {
    code: `-1 & 0`,
    output: { type: 'int', value: 0 },
  },
  {
    code: `-1 & -2`,
    output: { type: 'int', value: -2 },
  },
  {
    code: `-2147483648 & -1`,
    output: { type: 'int', value: -2147483648 },
  },
  {
    code: `0x7FFFFFFF & 0x80000000`,
    output: { type: 'int', value: 0 },
  },
  {
    code: `0xCAFEBABE & 0xFFFF`,
    output: { type: 'int', value: 47806 },
  },
  {
    code: `0x12345678 & 0xFF00FF00`,
    output: { type: 'int', value: 302011904 },
  },
  {
    code: `1 & 2 & 3`,
    output: { type: 'int', value: 0 },
  },
  // ------------------------- bitwise &: byte/short/char promoted to int -------------------------
  {
    code: `(byte)0xFF & 0xFF`,
    output: { type: 'int', value: 255 },
  },
  {
    code: `(short)-1 & 0xFF`,
    output: { type: 'int', value: 255 },
  },
  {
    code: `(byte)127 & 128`,
    output: { type: 'int', value: 0 },
  },
  {
    code: `'a' & 'b'`,
    output: { type: 'int', value: 96 },
  },
  {
    code: `'A' & 0xFF`,
    output: { type: 'int', value: 65 },
  },
  {
    code: `(char)0x7FFF & 0xFFFF`,
    output: { type: 'int', value: 32767 },
  },
  {
    code: `(byte)0x80 & 0x7F`,
    output: { type: 'int', value: 0 },
  },
  // ------------------------- bitwise |: int basics -------------------------
  {
    code: `0xF0 | 0x0F`,
    output: { type: 'int', value: 255 },
  },
  {
    code: `1 | 2 | 4`,
    output: { type: 'int', value: 7 },
  },
  {
    code: `0 | -2147483648`,
    output: { type: 'int', value: -2147483648 },
  },
  {
    code: `1 | 0x80000000`,
    output: { type: 'int', value: -2147483647 },
  },
  {
    code: `-1 | 0`,
    output: { type: 'int', value: -1 },
  },
  {
    code: `-1 | 1`,
    output: { type: 'int', value: -1 },
  },
  {
    code: `0x80000000 | 0x7FFFFFFF`,
    output: { type: 'int', value: -1 },
  },
  {
    code: `0x12345678 | 0x0000000F`,
    output: { type: 'int', value: 305419903 },
  },
  // ------------------------- bitwise |: byte/short/char promoted to int -------------------------
  {
    code: `'A' | 32`,
    output: { type: 'int', value: 97 },
  },
  {
    code: `'Z' | 32`,
    output: { type: 'int', value: 122 },
  },
  {
    code: `(byte)0x80 | 0x0F`,
    output: { type: 'int', value: -113 },
  },
  {
    code: `(byte)1 | (byte)2`,
    output: { type: 'int', value: 3 },
  },
  {
    code: `(char)0x40 | 0x20`,
    output: { type: 'int', value: 96 },
  },
  // ------------------------- bitwise ^: int basics -------------------------
  {
    code: `5 ^ 3`,
    output: { type: 'int', value: 6 },
  },
  {
    code: `0xFF ^ 0x0F`,
    output: { type: 'int', value: 240 },
  },
  {
    code: `-1 ^ -1`,
    output: { type: 'int', value: 0 },
  },
  {
    code: `-1 ^ 1`,
    output: { type: 'int', value: -2 },
  },
  {
    code: `-1 ^ 0`,
    output: { type: 'int', value: -1 },
  },
  {
    code: `-2147483648 ^ -1`,
    output: { type: 'int', value: 2147483647 },
  },
  {
    code: `0 ^ 5`,
    output: { type: 'int', value: 5 },
  },
  {
    code: `1 ^ 2 ^ 3`,
    output: { type: 'int', value: 0 },
  },
  // ------------------------- bitwise ^: byte/short/char promoted to int -------------------------
  {
    code: `'a' ^ 'a'`,
    output: { type: 'int', value: 0 },
  },
  {
    code: `'a' ^ 'b'`,
    output: { type: 'int', value: 3 },
  },
  {
    code: `(byte)-1 ^ 0xFF`,
    output: { type: 'int', value: -256 },
  },
  {
    code: `(char)65 ^ 65`,
    output: { type: 'int', value: 0 },
  },
  // ------------------------- bitwise: identity & symmetry laws -------------------------
  {
    code: `(5 | 0) == 5`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(5 & 5) == 5`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(5 ^ 0) == 5`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(5 ^ 5) == 0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(0x1234 ^ 0x1234) == 0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(-1 & -1) == -1`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(-1 & 255) == 255`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(255 ^ 255) == 0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(1 ^ 2 ^ 1) == 2`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- bitwise: long operands (binary promotion -> long) -------------------------
  {
    code: `5L & 3L`,
    output: { type: 'long', value: '1' },
  },
  {
    code: `5L & 3`,
    output: { type: 'long', value: '1' },
  },
  {
    code: `5 & 3L`,
    output: { type: 'long', value: '1' },
  },
  {
    code: `1L | 2L`,
    output: { type: 'long', value: '3' },
  },
  {
    code: `5L ^ 3L`,
    output: { type: 'long', value: '6' },
  },
  {
    code: `-1L & 1L`,
    output: { type: 'long', value: '1' },
  },
  {
    code: `-1L ^ -1L`,
    output: { type: 'long', value: '0' },
  },
  {
    code: `-1L | 0L`,
    output: { type: 'long', value: '-1' },
  },
  {
    code: `0xFFFFFFFFL & 0xFFFF0000L`,
    output: { type: 'long', value: '4294901760' },
  },
  {
    code: `0xFFFFFFFFFFFFFFFFL & 0x8000000000000000L`,
    output: { type: 'long', value: '-9223372036854775808' },
  },
  {
    code: `-1L ^ 0xFFFFFFFFL`,
    output: { type: 'long', value: '-4294967296' },
  },
  {
    code: `1L << 63 | 1L`,
    output: { type: 'long', value: '-9223372036854775807' },
  },
  {
    code: `0x100000000L | 0xFFFFFFFFL`,
    output: { type: 'long', value: '8589934591' },
  },
  {
    code: `9223372036854775807L & 0xFFFFFFFF00000000L`,
    output: { type: 'long', value: '9223372032559808512' },
  },
  {
    code: `-9223372036854775808L ^ 0x7FFFFFFFFFFFFFFFL`,
    output: { type: 'long', value: '-1' },
  },
  {
    code: `(byte)5 | 1L`,
    output: { type: 'long', value: '5' },
  },
  {
    code: `(char)255 & 255L`,
    output: { type: 'long', value: '255' },
  },
  // ------------------------- bitwise: precedence among & | ^ -------------------------
  // Java precedence: & > ^ > |. Distinctive expressions: 1 | 2 ^ 3 == 1 and
  // 1 ^ 2 | 3 == 3.
  {
    code: `1 | 2 ^ 3`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `1 ^ 2 | 3`,
    output: { type: 'int', value: 3 },
  },
  {
    code: `1 | 2 & 3`,
    output: { type: 'int', value: 3 },
  },
  {
    code: `1 & 2 | 4`,
    output: { type: 'int', value: 4 },
  },
  {
    code: `2 ^ 3 & 1`,
    output: { type: 'int', value: 3 },
  },
  {
    code: `7 & 5 ^ 3`,
    output: { type: 'int', value: 6 },
  },
  {
    code: `7 ^ 5 & 3`,
    output: { type: 'int', value: 6 },
  },
  {
    code: `(1 | 2) ^ 3`,
    output: { type: 'int', value: 0 },
  },
  {
    code: `1 | (2 ^ 3)`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `(1 ^ 2) | 3`,
    output: { type: 'int', value: 3 },
  },
  // ------------------------- bitwise: precedence vs shifts & arithmetic -------------------------
  // Java precedence: * / % > + - > << >> >>> > & > ^ > |.
  {
    code: `1 << 2 | 3`,
    output: { type: 'int', value: 7 },
  },
  {
    code: `1 | 2 << 1`,
    output: { type: 'int', value: 5 },
  },
  {
    code: `1 & 2 + 1`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `3 + 1 & 6`,
    output: { type: 'int', value: 4 },
  },
  {
    code: `2 * 3 | 1`,
    output: { type: 'int', value: 7 },
  },
  {
    code: `8 >> 1 & 3`,
    output: { type: 'int', value: 0 },
  },
  {
    code: `1 | 2 * 3 & 4`,
    output: { type: 'int', value: 5 },
  },
  // ------------------------- bitwise: unary ~ and unary - interplay -------------------------
  {
    code: `4 & ~0`,
    output: { type: 'int', value: 4 },
  },
  {
    code: `~0 | 1`,
    output: { type: 'int', value: -1 },
  },
  {
    code: `~0xFF & 0xFF`,
    output: { type: 'int', value: 0 },
  },
  {
    code: `-1 ^ ~0`,
    output: { type: 'int', value: 0 },
  },
  {
    code: `~-1 & 0`,
    output: { type: 'int', value: 0 },
  },
  // ------------------------- boolean logical ops & | ^ (non-short-circuit) -------------------------
  {
    code: `true & true`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `true & false`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `false & true`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `false & false`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `true | true`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `true | false`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `false | true`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `false | false`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `true ^ true`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `true ^ false`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `false ^ true`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `false ^ false`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `!true & false`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `true ^ !false`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `!false | !true`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true & false) || (true | false)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true && false) & true`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `true | true & false`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- boolean ops & == precedence -------------------------
  // Equality binds tighter than the bitwise/logical operators.
  {
    code: `(1 == 1) ^ true`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(1 == 2) & (2 == 2)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(1 == 2) | (2 == 2)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(1 == 1) & (2 == 2)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `true & (1 == 1)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `false | (1 == 1)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `true ^ (1 == 1)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `true ^ true == false`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `false & true == true`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `true | false == true`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- bitwise ops never short-circuit (runtime errors still thrown) -------------------------
  // A variable right operand that divides by zero forces evaluation to blow up
  // for & | ^, whereas && / || would short-circuit around it.
  {
    code: `false & (1 / b == 1)`,
    error: 'runtime',
    env: { local: { b: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `false && (1 / b == 1)`,
    output: { type: 'boolean', value: false },
    env: { local: { b: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `true | (1 / b == 1)`,
    error: 'runtime',
    env: { local: { b: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `true || (1 / b == 1)`,
    output: { type: 'boolean', value: true },
    env: { local: { b: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `false | (1 / b == 1)`,
    error: 'runtime',
    env: { local: { b: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `true & (1 / b == 1)`,
    error: 'runtime',
    env: { local: { b: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `true ^ (1 / b == 1)`,
    error: 'runtime',
    env: { local: { b: { type: 'int', value: 0 } }, heap: {} },
  },
  // ------------------------- bitwise: identifiers -------------------------
  {
    code: `x & y`,
    output: { type: 'int', value: 12 },
    env: {
      local: { x: { type: 'int', value: 60 }, y: { type: 'int', value: 13 } },
      heap: {},
    },
  },
  {
    code: `x | y`,
    output: { type: 'int', value: 61 },
    env: {
      local: { x: { type: 'int', value: 60 }, y: { type: 'int', value: 13 } },
      heap: {},
    },
  },
  {
    code: `x ^ y`,
    output: { type: 'int', value: 49 },
    env: {
      local: { x: { type: 'int', value: 60 }, y: { type: 'int', value: 13 } },
      heap: {},
    },
  },
  {
    code: `xl & 0xFFFF`,
    output: { type: 'long', value: '65535' },
    env: { local: { xl: { type: 'long', value: '-1' } }, heap: {} },
  },
  {
    code: `xl ^ xl`,
    output: { type: 'long', value: '0' },
    env: {
      local: { xl: { type: 'long', value: '1311768467463790320' } },
      heap: {},
    },
  },
  {
    code: `by | 15`,
    output: { type: 'int', value: -97 },
    env: { local: { by: { type: 'byte', value: -100 } }, heap: {} },
  },
  // ------------------------- bitwise: compile-time type errors -------------------------
  {
    code: `1 & true`,
    error: 'compile',
  },
  {
    code: `true | 1`,
    error: 'compile',
  },
  {
    code: `1.5 & 3`,
    error: 'compile',
  },
  {
    code: `5L ^ 1.5`,
    error: 'compile',
  },
  {
    code: `1.0f | 1.0f`,
    error: 'compile',
  },
  {
    code: `"x" | 1`,
    error: 'compile',
  },
  {
    code: `null & 1`,
    error: 'compile',
  },
  {
    code: `'a' & "b"`,
    error: 'compile',
  },
  // Equality binds tighter than &, so this is int & boolean -> compile error.
  {
    code: `1 & 1 == 1`,
    error: 'compile',
  },

]
