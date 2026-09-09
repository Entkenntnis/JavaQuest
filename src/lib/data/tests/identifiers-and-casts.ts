import type { TestSuiteEntry } from '../../state/types'

export const identifiersAndCasts: TestSuiteEntry[] = [
  // ==================== IDENTIFIERS - BASIC READS ====================
  // ------------------------- identifiers: different names -------------------------
  {
    code: `alpha`,
    output: { type: 'int', value: 7 },
    env: { local: { alpha: { type: 'int', value: 7 } }, heap: {} },
  },
  {
    code: `Abc`,
    output: { type: 'int', value: 13 },
    env: { local: { Abc: { type: 'int', value: 13 } }, heap: {} },
  },
  {
    code: `camelCase`,
    output: { type: 'int', value: 9 },
    env: { local: { camelCase: { type: 'int', value: 9 } }, heap: {} },
  },
  {
    code: `_under`,
    output: { type: 'int', value: 11 },
    env: { local: { _under: { type: 'int', value: 11 } }, heap: {} },
  },
  {
    code: `$cash`,
    output: { type: 'int', value: 12 },
    env: { local: { $cash: { type: 'int', value: 12 } }, heap: {} },
  },
  {
    code: `Ω`,
    output: { type: 'int', value: 14 },
    env: { local: { Ω: { type: 'int', value: 14 } }, heap: {} },
  },
  // ------------------------- identifiers: reading values of each type -------------------------
  {
    code: `a`,
    output: { type: 'int', value: 5 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `xl`,
    output: { type: 'long', value: '123' },
    env: { local: { xl: { type: 'long', value: '123' } }, heap: {} },
  },
  {
    code: `zz`,
    output: { type: 'long', value: '10000000000' },
    env: { local: { zz: { type: 'long', value: '10000000000' } }, heap: {} },
  },
  {
    code: `d`,
    output: { type: 'double', value: 3.5 },
    env: { local: { d: { type: 'double', value: 3.5 } }, heap: {} },
  },
  {
    code: `ch`,
    output: { type: 'char', value: 65 },
    env: { local: { ch: { type: 'char', value: 65 } }, heap: {} },
  },
  {
    code: `by`,
    output: { type: 'byte', value: 100 },
    env: { local: { by: { type: 'byte', value: 100 } }, heap: {} },
  },
  {
    code: `str`,
    output: { type: '__str', value: 'JavaQuest' },
    env: {
      local: { str: { type: 'reference', ref: 'heap0' } },
      heap: { heap0: { class: 'java.lang.String', value: 'JavaQuest' } },
    },
  },
  // ==================== UNARY OPERATORS & CASTS ====================
  // ------------------------- unary plus / minus -------------------------
  {
    code: `-1`,
    output: { type: 'int', value: -1 },
  },
  {
    code: `-42`,
    output: { type: 'int', value: -42 },
  },
  {
    code: `-0`,
    output: { type: 'int', value: 0 },
  },
  {
    code: `+42`,
    output: { type: 'int', value: 42 },
  },
  {
    code: `+0`,
    output: { type: 'int', value: 0 },
  },
  {
    code: `-2147483648`,
    output: { type: 'int', value: -2147483648 },
  },
  {
    code: `-2147483649`,
    isError: true,
  },
  {
    code: `+2147483648`,
    isError: true,
  },
  {
    code: `-9223372036854775808L`,
    output: { type: 'long', value: '-9223372036854775808' },
  },
  {
    code: `-9223372036854775809L`,
    isError: true,
  },
  {
    code: `+9223372036854775808L`,
    isError: true,
  },
  {
    code: `-1L`,
    output: { type: 'long', value: '-1' },
  },
  {
    code: `-0x80000000`,
    output: { type: 'int', value: -2147483648 },
  },
  {
    code: `-0x80000001`,
    output: { type: 'int', value: 2147483647 },
  },
  {
    code: `-0xffffffff`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `-0x8000000000000000L`,
    output: { type: 'long', value: '-9223372036854775808' },
  },
  {
    code: `-0x8000000000000001L`,
    output: { type: 'long', value: '9223372036854775807' },
  },
  {
    code: `-0xffffffffffffffffL`,
    output: { type: 'long', value: '1' },
  },
  {
    code: `-0b101`,
    output: { type: 'int', value: -5 },
  },
  {
    code: `-true`,
    isError: true,
  },
  {
    code: `-1.5`,
    output: { type: 'double', value: -1.5 },
  },
  {
    code: `-1e3`,
    output: { type: 'double', value: -1000 },
  },
  {
    code: `-0x1p2`,
    output: { type: 'double', value: -4 },
  },
  {
    code: `+3.14f`,
    output: { type: 'float', value: 3.140000104904175 },
  },
  {
    code: `-0.0`,
    output: { type: 'double', value: 0 },
  },
  {
    code: `-0f`,
    output: { type: 'float', value: 0 },
  },
  // ------------------------- unary minus: evaluate branches -------------------------
  {
    code: `-'a'`,
    output: { type: 'int', value: -97 },
  },
  {
    code: `-'\u00df'`,
    output: { type: 'int', value: -223 },
  },
  {
    code: `- -5`,
    output: { type: 'int', value: 5 },
  },
  {
    code: `- -2147483648`,
    output: { type: 'int', value: -2147483648 },
  },
  {
    code: `- -5L`,
    output: { type: 'long', value: '5' },
  },
  {
    code: `- -9223372036854775808L`,
    output: { type: 'long', value: '-9223372036854775808' },
  },
  {
    code: `-0.5f`,
    output: { type: 'float', value: -0.5 },
  },
  {
    code: `-3.14f`,
    output: { type: 'float', value: -3.140000104904175 },
  },
  {
    code: `-3.14`,
    output: { type: 'double', value: -3.14 },
  },
  {
    code: `-1e-3`,
    output: { type: 'double', value: -0.001 },
  },
  {
    code: `-0x1.8p1`,
    output: { type: 'double', value: -3 },
  },
  {
    code: `-0x1p-2`,
    output: { type: 'double', value: -0.25 },
  },
  {
    code: `-"x"`,
    isError: true,
  },
  {
    code: `-null`,
    isError: true,
  },
  // ------------------------- unary plus: evaluate branches -------------------------
  {
    code: `+'a'`,
    output: { type: 'int', value: 97 },
  },
  {
    code: `+(byte)5`,
    output: { type: 'int', value: 5 },
  },
  {
    code: `+1.5`,
    output: { type: 'double', value: 1.5 },
  },
  {
    code: `+(long)5`,
    output: { type: 'long', value: '5' },
  },
  {
    code: `+true`,
    isError: true,
  },
  {
    code: `+null`,
    isError: true,
  },
  // ------------------------- unary logical complement '!' -------------------------
  {
    code: `!true`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `!false`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `!!true`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `!((boolean)false)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `!0`,
    isError: true,
  },
  {
    code: `!"hi"`,
    isError: true,
  },
  {
    code: `!null`,
    isError: true,
  },
  // ------------------------- unary bitwise complement '~' -------------------------
  {
    code: `~0`,
    output: { type: 'int', value: -1 },
  },
  {
    code: `~5`,
    output: { type: 'int', value: -6 },
  },
  {
    code: `~~5`,
    output: { type: 'int', value: 5 },
  },
  {
    code: `~2147483647`,
    output: { type: 'int', value: -2147483648 },
  },
  {
    code: `~-2147483648`,
    output: { type: 'int', value: 2147483647 },
  },
  {
    code: `~'a'`,
    output: { type: 'int', value: -98 },
  },
  {
    code: `~(byte)200`,
    output: { type: 'int', value: 55 },
  },
  {
    code: `~-9223372036854775808L`,
    output: { type: 'long', value: '9223372036854775807' },
  },
  {
    code: `~true`,
    isError: true,
  },
  // ------------------------- casts: integer sources -------------------------
  {
    code: `(byte)200`,
    output: { type: 'byte', value: -56 },
  },
  {
    code: `(short)70000`,
    output: { type: 'short', value: 4464 },
  },
  {
    code: `(char)-1`,
    output: { type: 'char', value: 65535 },
  },
  {
    code: `(int)4294967296L`,
    output: { type: 'int', value: 0 },
  },
  {
    code: `(byte)'a'`,
    output: { type: 'byte', value: 97 },
  },
  {
    code: `(long)(byte)200`,
    output: { type: 'long', value: '-56' },
  },
  {
    code: `(float)5`,
    output: { type: 'float', value: 5 },
  },
  {
    code: `(double)5`,
    output: { type: 'double', value: 5 },
  },
  // ------------------------- casts: floating point sources -------------------------
  {
    code: `(boolean)true`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(float)0.1`,
    output: { type: 'float', value: 0.10000000149011612 },
  },
  {
    code: `(double)3.5f`,
    output: { type: 'double', value: 3.5 },
  },
  {
    code: `(long)3.7`,
    output: { type: 'long', value: '3' },
  },
  {
    code: `(long)-3.7`,
    output: { type: 'long', value: '-3' },
  },
  {
    code: `(long)1e20`,
    output: { type: 'long', value: '9223372036854775807' },
  },
  {
    code: `(byte)1.5e3`,
    output: { type: 'byte', value: -36 },
  },
  {
    code: `(int)3.99`,
    output: { type: 'int', value: 3 },
  },
  {
    code: `(int)1e10`,
    output: { type: 'int', value: 2147483647 },
  },
  {
    code: `(int)-1e10`,
    output: { type: 'int', value: -2147483648 },
  },
  {
    code: `(long)-1e20`,
    output: { type: 'long', value: '-9223372036854775808' },
  },
  // ------------------------- casts: errors -------------------------
  {
    code: `(boolean)1`,
    isError: true,
  },
  {
    code: `(int)true`,
    isError: true,
  },
  {
    code: `(int)null`,
    isError: true,
  },
  {
    code: `(int)"5"`,
    isError: true,
  },
]
