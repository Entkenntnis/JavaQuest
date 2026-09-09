import type { TestSuiteEntry } from '../state/types'

export const testSuite: TestSuiteEntry[] = [
  // ==================== LITERALS ====================
  // ------------------------- int: decimal -------------------------
  {
    code: `0`,
    output: { type: 'int', value: 0 },
  },
  {
    code: `1`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `42`,
    output: { type: 'int', value: 42 },
  },
  {
    code: `2147483647`,
    output: { type: 'int', value: 2147483647 },
  },
  {
    code: `2147483648`,
    isError: true,
  },
  {
    code: `9223372036854775807L`,
    output: { type: 'long', value: '9223372036854775807' },
  },
  {
    code: `9223372036854775808L`,
    isError: true,
  },
  {
    code: `42L`,
    output: { type: 'long', value: '42' },
  },
  {
    code: `42l`,
    output: { type: 'long', value: '42' },
  },
  {
    code: `2147483648L`,
    output: { type: 'long', value: '2147483648' },
  },
  // ------------------------- int: hexadecimal -------------------------
  {
    code: `0x0`,
    output: { type: 'int', value: 0 },
  },
  {
    code: `0x10`,
    output: { type: 'int', value: 16 },
  },
  {
    code: `0xFF`,
    output: { type: 'int', value: 255 },
  },
  {
    code: `0xff`,
    output: { type: 'int', value: 255 },
  },
  {
    code: `0xcafebabe`,
    output: { type: 'int', value: -889275714 },
  },
  {
    code: `0xCAFEBABE`,
    output: { type: 'int', value: -889275714 },
  },
  {
    code: `0XFF`,
    output: { type: 'int', value: 255 },
  },
  {
    code: `0XCAFEBABE`,
    output: { type: 'int', value: -889275714 },
  },
  {
    code: `0x7fffffff`,
    output: { type: 'int', value: 2147483647 },
  },
  {
    code: `0x80000000`,
    output: { type: 'int', value: -2147483648 },
  },
  {
    code: `0xffffffff`,
    output: { type: 'int', value: -1 },
  },
  {
    code: `0x100000000`,
    isError: true,
  },
  {
    code: `0x1_0000_0000`,
    isError: true,
  },
  {
    code: `0xFFFFFFFFL`,
    output: { type: 'long', value: '4294967295' },
  },
  {
    code: `0x7fffffffffffffffL`,
    output: { type: 'long', value: '9223372036854775807' },
  },
  {
    code: `0x8000000000000000L`,
    output: { type: 'long', value: '-9223372036854775808' },
  },
  {
    code: `0xffffffffffffffffL`,
    output: { type: 'long', value: '-1' },
  },
  {
    code: `0xFFFFFFFFFFFFFFFF`,
    isError: true,
  },
  {
    code: `0x`,
    isError: true,
  },
  {
    code: `0x1G`,
    isError: true,
  },
  // ------------------------- int: octal -------------------------
  {
    code: `00`,
    output: { type: 'int', value: 0 },
  },
  {
    code: `0777`,
    output: { type: 'int', value: 511 },
  },
  {
    code: `0_17`,
    output: { type: 'int', value: 15 },
  },
  {
    code: `0_0`,
    output: { type: 'int', value: 0 },
  },
  {
    code: `017777777777`,
    output: { type: 'int', value: 2147483647 },
  },
  {
    code: `020000000000`,
    output: { type: 'int', value: -2147483648 },
  },
  {
    code: `037777777777`,
    output: { type: 'int', value: -1 },
  },
  {
    code: `0777L`,
    output: { type: 'long', value: '511' },
  },
  {
    code: `01000000000000000000000L`,
    output: { type: 'long', value: '-9223372036854775808' },
  },
  {
    code: `01777777777777777777777L`,
    output: { type: 'long', value: '-1' },
  },
  {
    code: `08`,
    isError: true,
  },
  {
    code: `09`,
    isError: true,
  },
  {
    code: `0o`,
    isError: true,
  },
  {
    code: `0o8`,
    isError: true,
  },
  {
    code: `0o777`,
    isError: true,
  },
  {
    code: `0O17`,
    isError: true,
  },
  // ------------------------- int: binary -------------------------
  {
    code: `0b0`,
    output: { type: 'int', value: 0 },
  },
  {
    code: `0b1`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `0b101`,
    output: { type: 'int', value: 5 },
  },
  {
    code: `0b1010_1010`,
    output: { type: 'int', value: 170 },
  },
  {
    code: `0b10000000000000000000000000000000`,
    output: { type: 'int', value: -2147483648 },
  },
  {
    code: `0b11111111111111111111111111111111`,
    output: { type: 'int', value: -1 },
  },
  {
    code: `0B1L`,
    output: { type: 'long', value: '1' },
  },
  {
    code: `0b1000000000000000000000000000000000000000000000000000000000000000L`,
    output: { type: 'long', value: '-9223372036854775808' },
  },
  {
    code: `0b11111111111111111111111111111111111111111111111111111111111111111L`,
    isError: true,
  },
  {
    code: `0b`,
    isError: true,
  },
  {
    code: `0b102`,
    isError: true,
  },
  {
    code: `0b_1`,
    isError: true,
  },
  {
    code: `0b100000000000000000000000000000000`,
    isError: true,
  },
  // ------------------------- int: underscores -------------------------
  {
    code: `1_000`,
    output: { type: 'int', value: 1000 },
  },
  {
    code: `0xFF_EC_DE_5E`,
    output: { type: 'int', value: -1253794 },
  },
  {
    code: `9_223_372_036_854_775_807L`,
    output: { type: 'long', value: '9223372036854775807' },
  },
  {
    code: `1_2_3_4_5`,
    output: { type: 'int', value: 12345 },
  },
  {
    code: `1__2`,
    output: { type: 'int', value: 12 },
  },
  {
    code: `1_`,
    isError: true,
  },
  {
    code: `0x_FF`,
    isError: true,
  },
  // ------------------------- float: decimal -------------------------
  {
    code: `1.23`,
    output: { type: 'double', value: 1.23 },
  },
  {
    code: `.5`,
    output: { type: 'double', value: 0.5 },
  },
  {
    code: `1.`,
    output: { type: 'double', value: 1 },
  },
  {
    code: `1.e2`,
    output: { type: 'double', value: 100 },
  },
  {
    code: `1e3`,
    output: { type: 'double', value: 1000 },
  },
  {
    code: `1e+3`,
    output: { type: 'double', value: 1000 },
  },
  {
    code: `1E-2`,
    output: { type: 'double', value: 0.01 },
  },
  {
    code: `0.0`,
    output: { type: 'double', value: 0 },
  },
  {
    code: `1.0e1`,
    output: { type: 'double', value: 10 },
  },
  {
    code: `1_0.0_1e2`,
    output: { type: 'double', value: 1001 },
  },
  {
    code: `1e1_0`,
    output: { type: 'double', value: 10000000000 },
  },
  {
    code: `0.1`,
    output: { type: 'double', value: 0.1 },
  },
  {
    code: `1.7976931348623157e308`,
    output: { type: 'double', value: 1.7976931348623157e308 },
  },
  {
    code: `1f`,
    output: { type: 'float', value: 1 },
  },
  {
    code: `2F`,
    output: { type: 'float', value: 2 },
  },
  {
    code: `0f`,
    output: { type: 'float', value: 0 },
  },
  {
    code: `2d`,
    output: { type: 'double', value: 2 },
  },
  {
    code: `0D`,
    output: { type: 'double', value: 0 },
  },
  {
    code: `0.5f`,
    output: { type: 'float', value: 0.5 },
  },
  {
    code: `.5f`,
    output: { type: 'float', value: 0.5 },
  },
  {
    code: `1.5f`,
    output: { type: 'float', value: 1.5 },
  },
  {
    code: `1.5e2f`,
    output: { type: 'float', value: 150 },
  },
  {
    code: `1.5e2d`,
    output: { type: 'double', value: 150 },
  },
  {
    code: `0.1f`,
    output: { type: 'float', value: 0.10000000149011612 },
  },
  {
    code: `3.14f`,
    output: { type: 'float', value: 3.140000104904175 },
  },
  {
    code: `1e-45f`,
    output: { type: 'float', value: 1.401298464324817e-45 },
  },
  {
    code: `3.4028235e38f`,
    output: { type: 'float', value: 3.4028234663852886e38 },
  },
  {
    code: `1e`,
    isError: true,
  },
  {
    code: `1.2e`,
    isError: true,
  },
  {
    code: `1.2.3`,
    isError: true,
  },
  {
    code: `1e309`,
    isError: true,
  },
  {
    code: `1.7976931348623159e308`,
    isError: true,
  },
  {
    code: `3.4028236e38f`,
    isError: true,
  },
  {
    code: `1e39f`,
    isError: true,
  },
  {
    code: `1e39`,
    output: { type: 'double', value: 1e39 },
  },
  {
    code: `1e400`,
    isError: true,
  },
  {
    code: `1e-400`,
    isError: true,
  },
  {
    code: `1e-323`,
    output: { type: 'double', value: 1e-323 },
  },
  {
    code: `1e-324`,
    isError: true,
  },
  {
    code: `1e-46f`,
    isError: true,
  },
  // ------------------------- float: hexadecimal -------------------------
  {
    code: `0x1p0`,
    output: { type: 'double', value: 1 },
  },
  {
    code: `0x1p1`,
    output: { type: 'double', value: 2 },
  },
  {
    code: `0x.8p1`,
    output: { type: 'double', value: 1 },
  },
  {
    code: `0x1.p1`,
    output: { type: 'double', value: 2 },
  },
  {
    code: `0x1.8p1`,
    output: { type: 'double', value: 3 },
  },
  {
    code: `0X1.8p1`,
    output: { type: 'double', value: 3 },
  },
  {
    code: `0xAp2`,
    output: { type: 'double', value: 40 },
  },
  {
    code: `0x0p0`,
    output: { type: 'double', value: 0 },
  },
  {
    code: `0x0.0p0`,
    output: { type: 'double', value: 0 },
  },
  {
    code: `0x1p-1_0`,
    output: { type: 'double', value: 0.0009765625 },
  },
  {
    code: `0x1.fffffffffffffp1023`,
    output: { type: 'double', value: 1.7976931348623157e308 },
  },
  {
    code: `0x1p-1074`,
    output: { type: 'double', value: 5e-324 },
  },
  {
    code: `0x1.fffffep127f`,
    output: { type: 'float', value: 3.4028234663852886e38 },
  },
  {
    code: `0x1p-149f`,
    output: { type: 'float', value: 1.401298464324817e-45 },
  },
  {
    code: `0x1p1024`,
    isError: true,
  },
  {
    code: `0x1.fffffffffffff8p1023`,
    isError: true,
  },
  {
    code: `0x1p`,
    isError: true,
  },
  {
    code: `0x1.8p`,
    isError: true,
  },
  {
    code: `0x1.8`,
    isError: true,
  },
  {
    code: `0x1p-1075`,
    isError: true,
  },
  {
    code: `0x1.8p-1074f`,
    isError: true,
  },
  {
    code: `0x1p-150f`,
    isError: true,
  },
  {
    code: `0x1.8p-1074`,
    output: { type: 'double', value: 1e-323 },
  },
  {
    code: `0x0.0000000000001p-1022`,
    output: { type: 'double', value: 5e-324 },
  },
  {
    code: `0x1p-1023`,
    output: { type: 'double', value: 1.1125369292536007e-308 },
  },
  {
    code: `0x1.fffffffffffff8p-1023`,
    output: { type: 'double', value: 2.2250738585072014e-308 },
  },
  {
    code: `0x1.fffffffffffffep0`,
    output: { type: 'double', value: 2 },
  },
  {
    code: `0x1.00000000000008p0`,
    output: { type: 'double', value: 1 },
  },
  // ------------------------- boolean & null -------------------------
  {
    code: `true`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `false`,
    output: { type: 'boolean', value: false },
  },
  // ------------------------- char -------------------------
  {
    code: `'a'`,
    output: { type: 'char', value: 97 },
  },
  {
    code: `'A'`,
    output: { type: 'char', value: 65 },
  },
  {
    code: `'0'`,
    output: { type: 'char', value: 48 },
  },
  {
    code: `' '`,
    output: { type: 'char', value: 32 },
  },
  {
    code: `'ÿ'`,
    output: { type: 'char', value: 255 },
  },
  {
    code: `'\\n'`,
    output: { type: 'char', value: 10 },
  },
  {
    code: `'\\t'`,
    output: { type: 'char', value: 9 },
  },
  {
    code: `'\\b'`,
    output: { type: 'char', value: 8 },
  },
  {
    code: `'\\f'`,
    output: { type: 'char', value: 12 },
  },
  {
    code: `'\\r'`,
    output: { type: 'char', value: 13 },
  },
  {
    code: `'\\\\'`,
    output: { type: 'char', value: 92 },
  },
  {
    code: `'\\''`,
    output: { type: 'char', value: 39 },
  },
  {
    code: `'\\"'`,
    output: { type: 'char', value: 34 },
  },
  {
    code: `'\\101'`,
    output: { type: 'char', value: 65 },
  },
  {
    code: `'\\377'`,
    output: { type: 'char', value: 255 },
  },
  {
    code: `'\\0'`,
    output: { type: 'char', value: 0 },
  },
  {
    code: `'\\41'`,
    output: { type: 'char', value: 33 },
  },
  {
    code: `'\\u0041'`,
    output: { type: 'char', value: 65 },
  },
  {
    code: `'\u00df'`,
    output: { type: 'char', value: 223 },
  },
  {
    code: `'Ω'`,
    output: { type: 'char', value: 937 },
  },
  {
    // This test fails (= compiler passes) incorrectly in Java 21
    // The behaviour is fixed in Java 25
    code: `'😀'`,
    isError: true,
  },
  {
    code: `''`,
    isError: true,
  },
  {
    code: `'ab'`,
    isError: true,
  },
  {
    code: `'\\400'`,
    isError: true,
  },
  {
    code: `'\\777'`,
    isError: true,
  },
  {
    code: `'\\8'`,
    isError: true,
  },
  {
    code: `'\\q'`,
    isError: true,
  },
  // ------------------------- string -------------------------
  {
    code: `""`,
    output: { type: '__str', value: '' },
  },
  {
    code: `"a"`,
    output: { type: '__str', value: 'a' },
  },
  {
    code: `"hello world"`,
    output: { type: '__str', value: 'hello world' },
  },
  {
    code: `"line1\\nline2"`,
    output: { type: '__str', value: 'line1\nline2' },
  },
  {
    code: `"tab\\there"`,
    output: { type: '__str', value: 'tab\there' },
  },
  {
    code: `"back\\bspace"`,
    output: { type: '__str', value: 'back\bspace' },
  },
  {
    code: `"form\\ffeed"`,
    output: { type: '__str', value: 'form\ffeed' },
  },
  {
    code: `"carriage\\rreturn"`,
    output: { type: '__str', value: 'carriage\rreturn' },
  },
  {
    code: `"\\\\"`,
    output: { type: '__str', value: '\\' },
  },
  {
    code: `"a\\"b"`,
    output: { type: '__str', value: 'a"b' },
  },
  {
    code: `"\\u0041\\u00df"`,
    output: { type: '__str', value: 'Aß' },
  },
  {
    code: `"\\uu0041"`,
    output: { type: '__str', value: 'A' },
  },
  {
    code: `"\\\\uu0041"`,
    output: { type: '__str', value: '\\uu0041' },
  },
  {
    code: `"\\\\60"`,
    output: { type: '__str', value: '\\60' },
  },
  {
    code: `"\\101"`,
    output: { type: '__str', value: 'A' },
  },
  {
    code: `"\\377"`,
    output: { type: '__str', value: '\u00ff' },
  },
  {
    code: `"\\45"`,
    output: { type: '__str', value: '%' },
  },
  {
    code: `"\\458"`,
    output: { type: '__str', value: '%8' },
  },
  {
    code: `"\\400"`,
    output: { type: '__str', value: ' 0' },
  },
  {
    code: `"\\777"`,
    output: { type: '__str', value: '?7' },
  },
  {
    code: `"a\\q"`,
    isError: true,
  },
  {
    code: `"\\u004"`,
    isError: true,
  },
  {
    code: `"a`,
    isError: true,
  },
  {
    code: `"a\\`,
    isError: true,
  },
  {
    code: '"a\\\nb"',
    isError: true,
  },
  // ------------------------- layout & parse robustness -------------------------
  {
    code: ` 42 `,
    output: { type: 'int', value: 42 },
  },
  {
    code: `\n\t 1.5 `,
    output: { type: 'double', value: 1.5 },
  },
  {
    code: ``,
    isError: true,
  },
  {
    code: `42 43`,
    isError: true,
  },
  {
    code: `42abc`,
    isError: true,
  },
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
    isError: true,
  },
  {
    code: `1.5 << 1`,
    isError: true,
  },
  {
    code: `1.0f >> 1L`,
    isError: true,
  },
  {
    code: `1L << 1.0f`,
    isError: true,
  },
  {
    code: `true << 1`,
    isError: true,
  },
  {
    code: `1 << true`,
    isError: true,
  },
  {
    code: `1 << "a"`,
    isError: true,
  },
  {
    code: `"a" << 1`,
    isError: true,
  },
  {
    code: `null << 1`,
    isError: true,
  },
  {
    code: `1 << (boolean)true`,
    isError: true,
  },

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
    isError: true,
    env: { local: { b: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `false && (1 / b == 1)`,
    output: { type: 'boolean', value: false },
    env: { local: { b: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `true | (1 / b == 1)`,
    isError: true,
    env: { local: { b: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `true || (1 / b == 1)`,
    output: { type: 'boolean', value: true },
    env: { local: { b: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `false | (1 / b == 1)`,
    isError: true,
    env: { local: { b: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `true & (1 / b == 1)`,
    isError: true,
    env: { local: { b: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `true ^ (1 / b == 1)`,
    isError: true,
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
    isError: true,
  },
  {
    code: `true | 1`,
    isError: true,
  },
  {
    code: `1.5 & 3`,
    isError: true,
  },
  {
    code: `5L ^ 1.5`,
    isError: true,
  },
  {
    code: `1.0f | 1.0f`,
    isError: true,
  },
  {
    code: `"x" | 1`,
    isError: true,
  },
  {
    code: `null & 1`,
    isError: true,
  },
  {
    code: `'a' & "b"`,
    isError: true,
  },
  // Equality binds tighter than &, so this is int & boolean -> compile error.
  {
    code: `1 & 1 == 1`,
    isError: true,
  },

  // ==================== LOGICAL OPERATORS (&& / ||) ====================
  // ------------------------- logical operators: && and || (short circuit) -------------------------
  {
    code: `true && true`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `true && false`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `false && true`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `false || true`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `false || false`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `true || false`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `true || true && false`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true || true) && false`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `1 && true`,
    isError: true,
  },
  {
    code: `true && (1/0 == 1)`,
    isError: true,
  },
  {
    code: `false && (1/0 == 1)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `true || (1/0 == 1)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `false || (1/0 == 1)`,
    isError: true,
  },
  {
    code: `true || 1`,
    isError: true,
  },
  {
    code: `false && 1`,
    isError: true,
  },
  {
    code: `false && null`,
    isError: true,
  },
  {
    code: `true || "x"`,
    isError: true,
  },
  {
    code: `false && 'a'`,
    isError: true,
  },
  {
    code: `true || 9223372036854775807L`,
    isError: true,
  },
  {
    code: `true || (boolean)5`,
    isError: true,
  },
  // ------------------------- logical operators: short-circuit guards around / and % by zero -------------------------
  {
    code: `false && ((1 % 0) == 1)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `true || ((1 % 0) == 1)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `false && ((1L / 0L) == 1L)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `true || ((7 % 0) == 1)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `false && (("" + (1 % 0)) == "x")`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `true || (("" + (1 / 0)) == "x")`,
    output: { type: 'boolean', value: true },
  },
  // ==================== EQUALITY (==) ====================
  // ------------------------- equality ==: booleans, strings & null -------------------------
  {
    code: `true == true`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `true == false`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `null == null`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"a" == "a"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"a" == "b"`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `"a" == null`,
    output: { type: 'boolean', value: false },
  },
  // ------------------------- equality ==: int & radix literals -------------------------
  {
    code: `0xffffffff == -1`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `010 == 8`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `'a' == 97`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `'a' == 'b'`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `'Ω' == 937`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(char)-1 == 65535`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(byte)200 == -56`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(byte)128 == -128`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- equality ==: long widening -------------------------
  {
    code: `1L == 1`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `9223372036854775807L == 9223372036854775807L`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `0xFFFFFFFFL == 4294967295L`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- equality ==: float/double & precision traps -------------------------
  {
    code: `1.5 == 1.5f`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `0.1f == 0.1`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `16777217 == 16777216f`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `9007199254740993L == 9007199254740992.0`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- equality ==: arithmetic expressions -------------------------
  {
    code: `1 + 2 == 3`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(1 + 2) * 3 == 9`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `7 % 4 == 3`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `-7 % 3 == -1`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `'z' - 'a' == 25`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(byte)100 + (byte)100 == 200`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- equality ==: conversion & casting oddities -------------------------
  {
    code: `(long)1e20 == 9223372036854775807L`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(int)(0.0/0.0) == 0`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- equality ==: Infinity, NaN and -0.0 -------------------------
  {
    code: `(1.0/0.0) == (1.0/0.0)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(0.0/0.0) == (0.0/0.0)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `-0.0 == 0.0`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- equality ==: wild boolean algebra & short circuit -------------------------
  {
    code: `(1 == 1) == (2 == 2)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `!(1 == 2) == (2 == 2)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `false == true && (1/0 == 1)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `1 == 2 || 2 == 2`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- equality ==: errors -------------------------
  {
    code: `1/0 == 1`,
    isError: true,
  },
  {
    code: `true == 1`,
    isError: true,
  },
  {
    code: `1 == "x"`,
    isError: true,
  },
  {
    code: `null == 1`,
    isError: true,
  },
  // ==================== NON-EQUALITY (!=) ====================
  // ------------------------- non-equality !=: booleans -------------------------
  {
    code: `true != true`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `true != false`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `false != false`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(1 == 1) != (2 == 2)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(1 == 2) != (2 == 2)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(1 != 1) == (2 != 2)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(1 != 2) != (2 != 2)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `!(1 != 1)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `!(1 != 2)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `!(true != false)`,
    output: { type: 'boolean', value: false },
  },
  // ------------------------- non-equality !=: int, radix, char & byte literals -------------------------
  {
    code: `1 != 2`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `1 != 1`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `2 != 1`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `0xffffffff != -1`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `010 != 8`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `010 != 9`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `'a' != 97`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `'a' != 'b'`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `'Ω' != 937`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(char)-1 != 65535`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(byte)200 != -56`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(byte)200 != -55`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(byte)128 != -128`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `1 + 2 != 3`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(1 + 2) * 3 != 9`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `7 % 4 != 3`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `-7 % 3 != -1`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `'z' - 'a' != 25`,
    output: { type: 'boolean', value: false },
  },
  // ------------------------- non-equality !=: long widening -------------------------
  {
    code: `1L != 1`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `1L != 2`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `9223372036854775807L != 9223372036854775807L`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `0xFFFFFFFFL != 4294967295L`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `'a' != 97L`,
    output: { type: 'boolean', value: false },
  },
  // ------------------------- non-equality !=: float/double & precision traps -------------------------
  {
    code: `1.5 != 1.5f`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `0.1f != 0.1`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `16777217 != 16777216f`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `9007199254740993L != 9007199254740992.0`,
    output: { type: 'boolean', value: false },
  },
  // ------------------------- non-equality !=: Infinity, NaN and -0.0 -------------------------
  {
    code: `(1.0/0.0) != (1.0/0.0)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(0.0/0.0) != (0.0/0.0)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `-0.0 != 0.0`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(0.0/0.0) != 0.0`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- non-equality !=: conversion & casting oddities -------------------------
  {
    code: `(long)1e20 != 9223372036854775807L`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(int)(0.0/0.0) != 0`,
    output: { type: 'boolean', value: false },
  },
  // ------------------------- non-equality !=: strings & null -------------------------
  {
    code: `null != null`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `"a" != "a"`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `"a" != "b"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"a" != null`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `null != "a"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"" != ""`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `"" != "x"`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- non-equality !=: constant-folded string concatenations -------------------------
  // Constant string concatenations fold at compile time and are interned, so the
  // two sides can denote one String object (mirrors the == cases above).
  {
    code: `("a" + "b") != "ab"`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `("a" + "b") != ("a" + "b")`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `("a" + "b") != "abc"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("foo" + "bar") != "foobar"`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `("" + (1 << 4)) != "16"`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `("" + (1 << 4)) != "17"`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- non-equality !=: interned vs. non-interned heap objects -------------------------
  {
    code: `s != "a"`,
    output: { type: 'boolean', value: true },
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: { heap0: { class: 'java.lang.String', value: 'a' } },
    },
  },
  {
    code: `s != "a"`,
    output: { type: 'boolean', value: false },
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: {
        heap0: { class: 'java.lang.String', value: 'a', isInterned: true },
      },
    },
  },
  {
    code: `s != t`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        s: { type: 'reference', ref: 'heap0' },
        t: { type: 'reference', ref: 'heap1' },
      },
      heap: {
        heap0: { class: 'java.lang.String', value: 'a' },
        heap1: { class: 'java.lang.String', value: 'a' },
      },
    },
  },
  {
    code: `s != t`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        s: { type: 'reference', ref: 'heap0' },
        t: { type: 'reference', ref: 'heap1' },
      },
      heap: {
        heap0: { class: 'java.lang.String', value: 'a', isInterned: true },
        heap1: { class: 'java.lang.String', value: 'b', isInterned: true },
      },
    },
  },
  {
    code: `s != s`,
    output: { type: 'boolean', value: false },
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: { heap0: { class: 'java.lang.String', value: 'a' } },
    },
  },
  {
    code: `(s + "b") != "ab"`,
    output: { type: 'boolean', value: true },
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: {
        heap0: { class: 'java.lang.String', value: 'a', isInterned: true },
      },
    },
  },
  {
    code: `s != null`,
    output: { type: 'boolean', value: true },
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: {
        heap0: { class: 'java.lang.String', value: 'a', isInterned: true },
      },
    },
  },
  // ------------------------- non-equality !=: short circuit & precedence -------------------------
  {
    code: `1 != 1 && (1/0 == 1)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `1 != 2 || (1/0 == 1)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `1 != 2 && (1/0 == 1)`,
    isError: true,
  },
  // ------------------------- non-equality !=: errors -------------------------
  {
    code: `true != 1`,
    isError: true,
  },
  {
    code: `1 != "x"`,
    isError: true,
  },
  {
    code: `null != 1`,
    isError: true,
  },
  {
    code: `1 != null`,
    isError: true,
  },
  {
    code: `1/0 != 1`,
    isError: true,
  },
  {
    code: `1 != 1/0`,
    isError: true,
  },
  {
    code: `1 != 2 == 1`,
    isError: true,
  },
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
    isError: true,
  },
  {
    code: `false >= true`,
    isError: true,
  },
  {
    code: `true <= 1`,
    isError: true,
  },
  {
    code: `"a" < "b"`,
    isError: true,
  },
  {
    code: `1 < "x"`,
    isError: true,
  },
  {
    code: `null < 1`,
    isError: true,
  },
  {
    code: `'a' > true`,
    isError: true,
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
    isError: true,
  },
  {
    code: `1 < 2 <= 3`,
    isError: true,
  },
  {
    code: `3 > 2 >= 1`,
    isError: true,
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
  // ==================== UNARY PRECEDENCE & AMBIGUITY ====================
  // Prefix unary operators (-, +, !, ~) must bind tighter than every binary operator
  // and, when chained, nest left-to-right: `-~1` is -(~1), `~-1` is ~(-1). The grammar
  // models + / - and ! / ~ as two separate unary precedence tiers, so these cases probe
  // whether chained mixed unary operators and unary-vs-binary groupings match Java.
  // Expectations below are the real-Java (cross-check) results; entries that fail in the
  // in-app evaluator document a precedence ambiguity in the current grammar.
  // ------------------------- unary precedence: chained +/- -------------------------
  {
    code: `- - -1`,
    output: { type: 'int', value: -1 },
  },
  {
    code: `- +1`,
    output: { type: 'int', value: -1 },
  },
  {
    code: `+ -1`,
    output: { type: 'int', value: -1 },
  },
  {
    code: `+ +1`,
    output: { type: 'int', value: 1 },
  },
  // ------------------------- unary precedence: chained ~ with +/- -------------------------
  {
    code: `-~1`,
    output: { type: 'int', value: 2 },
  },
  {
    code: `~-1`,
    output: { type: 'int', value: 0 },
  },
  {
    code: `+~1`,
    output: { type: 'int', value: -2 },
  },
  {
    code: `~+1`,
    output: { type: 'int', value: -2 },
  },
  {
    code: `~~-1`,
    output: { type: 'int', value: -1 },
  },
  {
    code: `-~-1`,
    output: { type: 'int', value: 0 },
  },
  {
    code: `- -~1`,
    output: { type: 'int', value: -2 },
  },
  // ------------------------- unary precedence: vs binary operators -------------------------
  {
    code: `-~1+2`,
    output: { type: 'int', value: 4 },
  },
  {
    code: `~-1+2`,
    output: { type: 'int', value: 2 },
  },
  {
    code: `-~1*2`,
    output: { type: 'int', value: 4 },
  },
  {
    code: `~+1*2`,
    output: { type: 'int', value: -4 },
  },
  {
    code: `2*-1`,
    output: { type: 'int', value: -2 },
  },
  {
    code: `2*-1+3`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `-1 << 2`,
    output: { type: 'int', value: -4 },
  },
  {
    code: `~0 << 1`,
    output: { type: 'int', value: -2 },
  },
  // ------------------------- unary precedence: vs bitwise operators -------------------------
  {
    code: `~1 & 3`,
    output: { type: 'int', value: 2 },
  },
  {
    code: `~1 | 3`,
    output: { type: 'int', value: -1 },
  },
  {
    code: `~1 ^ 3`,
    output: { type: 'int', value: -3 },
  },
  {
    code: `-1 & 1`,
    output: { type: 'int', value: 1 },
  },
  // ------------------------- unary precedence: vs equality & logical operators -------------------------
  {
    code: `-1 == -1`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `~0 == -1`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `-1 == 0`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `!true == false`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `!false != true`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `!true && false`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `!false || true`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- unary precedence: type errors (unary must bind before binary) -------------------------
  {
    code: `!1 == 0`,
    isError: true,
  },
  {
    code: `-true == false`,
    isError: true,
  },
  {
    code: `!~1`,
    isError: true,
  },
  {
    code: `~!true`,
    isError: true,
  },
  // ------------------------- unary precedence: vs casts -------------------------
  {
    code: `-(byte)200`,
    output: { type: 'int', value: 56 },
  },
  {
    code: `(byte)-200`,
    output: { type: 'byte', value: 56 },
  },
  {
    code: `~(byte)200`,
    output: { type: 'int', value: 55 },
  },
  {
    code: `-(short)200`,
    output: { type: 'int', value: -200 },
  },
  {
    code: `-(byte)200 > 0`,
    output: { type: 'boolean', value: true },
  },
  // ==================== CONDITIONAL (ternary ? :) ====================
  // JLS 15.25: cond ? thenExpr : elseExpr. The condition must be boolean; the result type
  // is the least upper type of the two arms (binary numeric promotion for numeric arms,
  // reference/null rules for String arms) and the operator is right-associative with the
  // lowest precedence of any expression operator. Only the selected arm is evaluated.
  // Expectations match real Java via the cross-check; the interpreter is implemented
  // incrementally against this suite (several cases below are still work in progress).
  // ------------------------- conditional: basics -------------------------
  {
    code: `true ? 1 : 2`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `false ? 1 : 2`,
    output: { type: 'int', value: 2 },
  },
  {
    code: `true ? 10 : 20`,
    output: { type: 'int', value: 10 },
  },
  {
    code: `false ? 10 : 20`,
    output: { type: 'int', value: 20 },
  },
  {
    code: `true ? true : false`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `false ? true : false`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `true ? "a" : "b"`,
    output: { type: '__str', value: 'a' },
  },
  {
    code: `false ? "a" : "b"`,
    output: { type: '__str', value: 'b' },
  },
  {
    code: `1 < 2 ? "yes" : "no"`,
    output: { type: '__str', value: 'yes' },
  },
  {
    code: `1 > 2 ? "yes" : "no"`,
    output: { type: '__str', value: 'no' },
  },
  {
    code: `!true ? 1 : 2`,
    output: { type: 'int', value: 2 },
  },
  {
    code: `'a' < 'b' ? 100 : 200`,
    output: { type: 'int', value: 100 },
  },
  {
    code: `2 == 2 ? 5L : 6L`,
    output: { type: 'long', value: '5' },
  },
  // ------------------------- conditional: only the selected arm is evaluated -------------------------
  {
    code: `true ? 1 : 1/0`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `false ? 1/0 : 2`,
    output: { type: 'int', value: 2 },
  },
  {
    code: `true ? 1/0 : 2`,
    isError: true,
  },
  {
    code: `false ? 1 : 1/0`,
    isError: true,
  },
  {
    code: `true ? true : (1/0 == 1)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `false ? (1/0 == 1) : true`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `true ? 1L : 1L/0L`,
    output: { type: 'long', value: '1' },
  },
  {
    code: `false ? 7 % 0 : 3`,
    output: { type: 'int', value: 3 },
  },
  // ------------------------- conditional: numeric result type & promotion -------------------------
  {
    code: `true ? 1 : 2L`,
    output: { type: 'long', value: '1' },
  },
  {
    code: `false ? 1 : 2L`,
    output: { type: 'long', value: '2' },
  },
  {
    code: `true ? 1L : 2`,
    output: { type: 'long', value: '1' },
  },
  {
    code: `true ? 'a' : 'b'`,
    output: { type: 'char', value: 97 },
  },
  {
    code: `false ? 'a' : 'b'`,
    output: { type: 'char', value: 98 },
  },
  {
    code: `true ? 'a' : 1`,
    output: { type: 'char', value: 97 },
  },
  {
    code: `false ? 'a' : 1`,
    output: { type: 'char', value: 1 },
  },
  {
    code: `false ? 1L : 'a'`,
    output: { type: 'long', value: '97' },
  },
  {
    code: `true ? (byte)1 : (byte)2`,
    output: { type: 'byte', value: 1 },
  },
  {
    code: `true ? (short)1 : (short)2`,
    output: { type: 'short', value: 1 },
  },
  {
    code: `false ? (short)1 : (short)2`,
    output: { type: 'short', value: 2 },
  },
  {
    code: `true ? (byte)1 : 2`,
    output: { type: 'byte', value: 1 },
  },
  {
    code: `true ? (short)1 : (byte)2`,
    output: { type: 'short', value: 1 },
  },
  {
    code: `false ? (short)1 : (byte)2`,
    output: { type: 'short', value: 2 },
  },
  {
    code: `true ? (byte)200 : (byte)1`,
    output: { type: 'byte', value: -56 },
  },
  {
    code: `true ? 1.5f : 1.5`,
    output: { type: 'double', value: 1.5 },
  },
  {
    code: `false ? 1.5f : 1.5`,
    output: { type: 'double', value: 1.5 },
  },
  {
    code: `true ? 1.5f : 1`,
    output: { type: 'float', value: 1.5 },
  },
  {
    code: `true ? 1L : 1.5f`,
    output: { type: 'float', value: 1 },
  },
  {
    code: `false ? 1L : 1.5f`,
    output: { type: 'float', value: 1.5 },
  },
  {
    code: `true ? 1 : 2.5`,
    output: { type: 'double', value: 1 },
  },
  {
    code: `false ? 1 : 2.5`,
    output: { type: 'double', value: 2.5 },
  },
  {
    code: `true ? 0xffffffff : 1`,
    output: { type: 'int', value: -1 },
  },
  {
    code: `false ? 'x' : 'y'`,
    output: { type: 'char', value: 121 },
  },
  {
    code: `true ? (char)65535 : 0`,
    output: { type: 'char', value: 65535 },
  },
  // ------------------------- conditional: reference & null arms -------------------------
  {
    code: `true ? "a" : null`,
    output: { type: '__str', value: 'a' },
  },
  {
    code: `(true ? "a" : null) == "a"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(false ? "a" : null) == null`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? null : "b") == null`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? null : "b") == "b"`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? "a" : null) != null`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `1 < 2 ? "a" + "b" : "c"`,
    output: { type: '__str', value: 'ab' },
  },
  {
    code: `(1 < 2 ? "a" : "b") == "a"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"" + (true ? 1 : 2)`,
    output: { type: '__str', value: '1' },
  },
  {
    code: `"n=" + (false ? 1 : 2)`,
    output: { type: '__str', value: 'n=2' },
  },
  // ------------------------- conditional: associativity (right) -------------------------
  {
    code: `false ? 1 : true ? 2 : 3`,
    output: { type: 'int', value: 2 },
  },
  {
    code: `true ? 1 : true ? 2 : 3`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `true ? true ? 1 : 2 : 3`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `false ? true ? 1 : 2 : 3`,
    output: { type: 'int', value: 3 },
  },
  {
    code: `1 < 2 ? 1 : 2 < 3 ? 2 : 3`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `1 > 2 ? 1 : 2 > 3 ? 2 : 3`,
    output: { type: 'int', value: 3 },
  },
  {
    code: `true ? 1 : false ? 2 : 3`,
    output: { type: 'int', value: 1 },
  },
  // ------------------------- conditional: precedence with other operators -------------------------
  {
    code: `true && false ? 1 : 2`,
    output: { type: 'int', value: 2 },
  },
  {
    code: `true || false ? 1 : 2`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `false || true ? 1 : 2`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `1 + (true ? 2 : 3)`,
    output: { type: 'int', value: 3 },
  },
  {
    code: `2 * (false ? 3 : 4)`,
    output: { type: 'int', value: 8 },
  },
  {
    code: `(true ? 2 : 3) + 1`,
    output: { type: 'int', value: 3 },
  },
  {
    code: `true ? 1 << 3 : 0`,
    output: { type: 'int', value: 8 },
  },
  // ------------------------- conditional: nested & complex conditions -------------------------
  {
    code: `true ? (false ? 1 : 2) : 3`,
    output: { type: 'int', value: 2 },
  },
  {
    code: `false ? 1 : (true ? 2 : 3)`,
    output: { type: 'int', value: 2 },
  },
  {
    code: `(1 < 2) == true ? 'x' : 'y'`,
    output: { type: 'char', value: 120 },
  },
  {
    code: `!(false) ? 10 : 20`,
    output: { type: 'int', value: 10 },
  },
  {
    code: `true ? true ? false ? 1 : 2 : 3 : 4`,
    output: { type: 'int', value: 2 },
  },
  {
    code: `false ? 1 : true ? false ? 2 : 3 : 4`,
    output: { type: 'int', value: 3 },
  },
  {
    code: `('a' < 'b') && (1 <= 1) ? 7 : 8`,
    output: { type: 'int', value: 7 },
  },
  {
    code: `false ? 1L : 2.5`,
    output: { type: 'double', value: 2.5 },
  },
  // ------------------------- conditional: constant condition skips typing of the unselected arm -------------------------
  // When the condition is a compile-time constant, javac only considers the selected arm,
  // so the other arm may be of an incompatible type (or even null) without an error.
  {
    code: `true ? 1 : "x"`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `false ? "x" : 1`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `true ? 1 : null`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `true ? true : 1`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `false ? 1 : true`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `true ? 1 : false`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `true ? true : null`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- conditional: runtime condition without a common arm type -------------------------
  // Even in a `var` (inferred assignment) context javac boxes the primitive arm and picks
  // a common reference type, so mixed primitive/reference arms still compile and yield the
  // selected arm's value. Real rejection only happens in a typed context (e.g. an int or
  // boolean target), which this print-only harness cannot produce. Each case is asserted
  // on the branch that does not evaluate to null.
  {
    code: `b ? 1 : "x"`,
    output: { type: 'int', value: 1 },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  {
    code: `b ? "x" : 1`,
    output: { type: '__str', value: 'x' },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  {
    code: `b ? 1 : null`,
    output: { type: 'int', value: 1 },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  {
    code: `b ? null : 1`,
    output: { type: 'int', value: 1 },
    env: {
      local: { b: { type: 'boolean', value: false } },
      heap: {},
    },
  },
  {
    code: `b ? true : 1`,
    output: { type: 'boolean', value: true },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  {
    code: `b ? 1 : true`,
    output: { type: 'int', value: 1 },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  {
    code: `b ? true : null`,
    output: { type: 'boolean', value: true },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  // ------------------------- conditional: runtime condition, numeric result type & promotion -------------------------
  // With both arms being runtime variables the usual binary numeric promotion applies
  // (no compile-time narrowing of constant arms).
  {
    code: `b ? c : x`,
    output: { type: 'int', value: 97 },
    env: {
      local: {
        b: { type: 'boolean', value: true },
        c: { type: 'char', value: 97 },
        x: { type: 'int', value: 200 },
      },
      heap: {},
    },
  },
  {
    code: `b ? c : x`,
    output: { type: 'int', value: 200 },
    env: {
      local: {
        b: { type: 'boolean', value: false },
        c: { type: 'char', value: 97 },
        x: { type: 'int', value: 200 },
      },
      heap: {},
    },
  },
  {
    code: `b ? by : x`,
    output: { type: 'int', value: 200 },
    env: {
      local: {
        b: { type: 'boolean', value: false },
        by: { type: 'byte', value: 5 },
        x: { type: 'int', value: 200 },
      },
      heap: {},
    },
  },
  {
    code: `b ? sh : by`,
    output: { type: 'short', value: 7 },
    env: {
      local: {
        b: { type: 'boolean', value: true },
        sh: { type: 'short', value: 7 },
        by: { type: 'byte', value: 5 },
      },
      heap: {},
    },
  },
  {
    code: `b ? sh : by`,
    output: { type: 'short', value: 5 },
    env: {
      local: {
        b: { type: 'boolean', value: false },
        sh: { type: 'short', value: 7 },
        by: { type: 'byte', value: 5 },
      },
      heap: {},
    },
  },
  {
    code: `b ? c : l`,
    output: { type: 'long', value: '97' },
    env: {
      local: {
        b: { type: 'boolean', value: true },
        c: { type: 'char', value: 97 },
        l: { type: 'long', value: '1000' },
      },
      heap: {},
    },
  },
  {
    code: `b ? c : l`,
    output: { type: 'long', value: '1000' },
    env: {
      local: {
        b: { type: 'boolean', value: false },
        c: { type: 'char', value: 97 },
        l: { type: 'long', value: '1000' },
      },
      heap: {},
    },
  },
  {
    code: `b ? x : f`,
    output: { type: 'float', value: 3 },
    env: {
      local: {
        b: { type: 'boolean', value: true },
        x: { type: 'int', value: 3 },
        f: { type: 'float', value: 2.5 },
      },
      heap: {},
    },
  },
  {
    code: `b ? x : f`,
    output: { type: 'float', value: 2.5 },
    env: {
      local: {
        b: { type: 'boolean', value: false },
        x: { type: 'int', value: 3 },
        f: { type: 'float', value: 2.5 },
      },
      heap: {},
    },
  },
  {
    code: `b ? sh : l`,
    output: { type: 'long', value: '7' },
    env: {
      local: {
        b: { type: 'boolean', value: true },
        sh: { type: 'short', value: 7 },
        l: { type: 'long', value: '1000' },
      },
      heap: {},
    },
  },
  {
    code: `b ? 1L : 'a'`,
    output: { type: 'long', value: '97' },
    env: {
      local: { b: { type: 'boolean', value: false } },
      heap: {},
    },
  },
  {
    code: `b ? 1 : 2L`,
    output: { type: 'long', value: '1' },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  {
    code: `b ? 1 : 2L`,
    output: { type: 'long', value: '2' },
    env: {
      local: { b: { type: 'boolean', value: false } },
      heap: {},
    },
  },
  {
    code: `b ? 1.5f : 1.5`,
    output: { type: 'double', value: 1.5 },
    env: {
      local: { b: { type: 'boolean', value: false } },
      heap: {},
    },
  },
  {
    code: `b ? "a" : null`,
    output: { type: '__str', value: 'a' },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  // ------------------------- conditional: runtime condition only evaluates the selected arm -------------------------
  // With a runtime (variable) condition nothing is constant-folded away, so laziness has
  // to come from the evaluator itself: a division by zero in the unselected arm must not
  // fire, while one in the selected arm still raises an ArithmeticException.
  {
    code: `b ? 1 : 1/0`,
    output: { type: 'int', value: 1 },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  {
    code: `b ? 1 : 1/0`,
    isError: true,
    env: {
      local: { b: { type: 'boolean', value: false } },
      heap: {},
    },
  },
  {
    code: `b ? 1/0 : 2`,
    isError: true,
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  {
    code: `b ? 1/0 : 2`,
    output: { type: 'int', value: 2 },
    env: {
      local: { b: { type: 'boolean', value: false } },
      heap: {},
    },
  },
  {
    code: `b ? 1L : 1L/0L`,
    isError: true,
    env: {
      local: { b: { type: 'boolean', value: false } },
      heap: {},
    },
  },
  {
    code: `b ? "a" : "x" + (1/0)`,
    output: { type: '__str', value: 'a' },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  {
    code: `b ? "x" + (1/0) : "a"`,
    isError: true,
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  {
    code: `b ? "x" + (1/0) : "a"`,
    output: { type: '__str', value: 'a' },
    env: {
      local: { b: { type: 'boolean', value: false } },
      heap: {},
    },
  },
  // ------------------------- conditional: constant int arm is narrowed to byte/short/char (JLS 15.25.2) -------------------------
  // If one operand is byte/short/char and the other is a constant expression of type int
  // whose value is representable in that primitive type, the conditional has that type;
  // a non-representable constant forces binary numeric promotion instead (int result).
  // With a runtime condition the value of either arm must be converted to the result type.
  {
    code: `b ? 'z' : 90`,
    output: { type: 'char', value: 122 },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  {
    code: `b ? 'z' : 90`,
    output: { type: 'char', value: 90 },
    env: {
      local: { b: { type: 'boolean', value: false } },
      heap: {},
    },
  },
  {
    code: `b ? 90 : 'z'`,
    output: { type: 'char', value: 90 },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  {
    code: `b ? 'a' : 65535`,
    output: { type: 'char', value: 65535 },
    env: {
      local: { b: { type: 'boolean', value: false } },
      heap: {},
    },
  },
  {
    code: `b ? 'a' : 65536`,
    output: { type: 'int', value: 97 },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  {
    code: `b ? 'a' : 65536`,
    output: { type: 'int', value: 65536 },
    env: {
      local: { b: { type: 'boolean', value: false } },
      heap: {},
    },
  },
  {
    code: `b ? 'a' : -1`,
    output: { type: 'int', value: -1 },
    env: {
      local: { b: { type: 'boolean', value: false } },
      heap: {},
    },
  },
  {
    code: `b ? 'a' : 1 + 1`,
    output: { type: 'char', value: 2 },
    env: {
      local: { b: { type: 'boolean', value: false } },
      heap: {},
    },
  },
  {
    code: `b ? (byte)7 : 127`,
    output: { type: 'byte', value: 127 },
    env: {
      local: { b: { type: 'boolean', value: false } },
      heap: {},
    },
  },
  {
    code: `b ? (byte)7 : 128`,
    output: { type: 'int', value: 7 },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  {
    code: `b ? (byte)7 : 128`,
    output: { type: 'int', value: 128 },
    env: {
      local: { b: { type: 'boolean', value: false } },
      heap: {},
    },
  },
  {
    code: `b ? (short)300 : 32767`,
    output: { type: 'short', value: 32767 },
    env: {
      local: { b: { type: 'boolean', value: false } },
      heap: {},
    },
  },
  {
    code: `b ? (short)1 : 32768`,
    output: { type: 'int', value: 32768 },
    env: {
      local: { b: { type: 'boolean', value: false } },
      heap: {},
    },
  },
  // ------------------------- conditional: narrowing only applies to constant int expressions -------------------------
  // A variable of type int in the same position does not narrow: general numeric
  // promotion applies instead, so a char arm is widened to int (JLS 15.25.2).
  {
    code: `b ? 'a' : x`,
    output: { type: 'int', value: 97 },
    env: {
      local: {
        b: { type: 'boolean', value: true },
        x: { type: 'int', value: 90 },
      },
      heap: {},
    },
  },
  {
    code: `b ? 'a' : x`,
    output: { type: 'int', value: 90 },
    env: {
      local: {
        b: { type: 'boolean', value: false },
        x: { type: 'int', value: 90 },
      },
      heap: {},
    },
  },
  // ------------------------- conditional: runtime variable binary numeric promotion (JLS 15.25.2) -------------------------
  // Mixed-type variable arms promote via binary numeric promotion; the selected arm's
  // value must be converted to the promoted result type.
  {
    code: `b ? x : l`,
    output: { type: 'long', value: '5' },
    env: {
      local: {
        b: { type: 'boolean', value: true },
        x: { type: 'int', value: 5 },
        l: { type: 'long', value: '10' },
      },
      heap: {},
    },
  },
  {
    code: `b ? x : l`,
    output: { type: 'long', value: '10' },
    env: {
      local: {
        b: { type: 'boolean', value: false },
        x: { type: 'int', value: 5 },
        l: { type: 'long', value: '10' },
      },
      heap: {},
    },
  },
  {
    code: `b ? by : x`,
    output: { type: 'int', value: 7 },
    env: {
      local: {
        b: { type: 'boolean', value: true },
        by: { type: 'byte', value: 7 },
        x: { type: 'int', value: 1000 },
      },
      heap: {},
    },
  },
  {
    code: `b ? by : x`,
    output: { type: 'int', value: 1000 },
    env: {
      local: {
        b: { type: 'boolean', value: false },
        by: { type: 'byte', value: 7 },
        x: { type: 'int', value: 1000 },
      },
      heap: {},
    },
  },
  {
    code: `b ? by : l`,
    output: { type: 'long', value: '7' },
    env: {
      local: {
        b: { type: 'boolean', value: true },
        by: { type: 'byte', value: 7 },
        l: { type: 'long', value: '10' },
      },
      heap: {},
    },
  },
  {
    code: `b ? by : l`,
    output: { type: 'long', value: '10' },
    env: {
      local: {
        b: { type: 'boolean', value: false },
        by: { type: 'byte', value: 7 },
        l: { type: 'long', value: '10' },
      },
      heap: {},
    },
  },
  {
    code: `b ? sh : c`,
    output: { type: 'int', value: 7 },
    env: {
      local: {
        b: { type: 'boolean', value: true },
        sh: { type: 'short', value: 7 },
        c: { type: 'char', value: 300 },
      },
      heap: {},
    },
  },
  {
    code: `b ? sh : c`,
    output: { type: 'int', value: 300 },
    env: {
      local: {
        b: { type: 'boolean', value: false },
        sh: { type: 'short', value: 7 },
        c: { type: 'char', value: 300 },
      },
      heap: {},
    },
  },
  {
    code: `b ? by : d`,
    output: { type: 'double', value: 7 },
    env: {
      local: {
        b: { type: 'boolean', value: true },
        by: { type: 'byte', value: 7 },
        d: { type: 'double', value: 2.5 },
      },
      heap: {},
    },
  },
  {
    code: `b ? by : d`,
    output: { type: 'double', value: 2.5 },
    env: {
      local: {
        b: { type: 'boolean', value: false },
        by: { type: 'byte', value: 7 },
        d: { type: 'double', value: 2.5 },
      },
      heap: {},
    },
  },
  {
    code: `b ? x : d`,
    output: { type: 'double', value: 3 },
    env: {
      local: {
        b: { type: 'boolean', value: true },
        x: { type: 'int', value: 3 },
        d: { type: 'double', value: 2.5 },
      },
      heap: {},
    },
  },
  {
    code: `b ? x : d`,
    output: { type: 'double', value: 2.5 },
    env: {
      local: {
        b: { type: 'boolean', value: false },
        x: { type: 'int', value: 3 },
        d: { type: 'double', value: 2.5 },
      },
      heap: {},
    },
  },
  {
    code: `b ? l : d`,
    output: { type: 'double', value: 10 },
    env: {
      local: {
        b: { type: 'boolean', value: true },
        l: { type: 'long', value: '10' },
        d: { type: 'double', value: 2.5 },
      },
      heap: {},
    },
  },
  {
    code: `b ? l : d`,
    output: { type: 'double', value: 2.5 },
    env: {
      local: {
        b: { type: 'boolean', value: false },
        l: { type: 'long', value: '10' },
        d: { type: 'double', value: 2.5 },
      },
      heap: {},
    },
  },
  {
    code: `b ? f : d`,
    output: { type: 'double', value: 2.5 },
    env: {
      local: {
        b: { type: 'boolean', value: true },
        f: { type: 'float', value: 2.5 },
        d: { type: 'double', value: 1.5 },
      },
      heap: {},
    },
  },
  {
    code: `b ? f : d`,
    output: { type: 'double', value: 1.5 },
    env: {
      local: {
        b: { type: 'boolean', value: false },
        f: { type: 'float', value: 2.5 },
        d: { type: 'double', value: 1.5 },
      },
      heap: {},
    },
  },
  // ------------------------- conditional: boolean arms from comparisons (JLS 15.25.1) -------------------------
  {
    code: `b ? 1 == 1 : 2 > 3`,
    output: { type: 'boolean', value: true },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  {
    code: `b ? 1 == 1 : 2 > 3`,
    output: { type: 'boolean', value: false },
    env: {
      local: { b: { type: 'boolean', value: false } },
      heap: {},
    },
  },
  // ------------------------- conditional: nested ternary & associative promotion -------------------------
  // Nested ternaries propagate their promoted type outward; a constant outer condition
  // folds through the nested expression and converts the selected value to the result type.
  {
    code: `false ? 1 : true ? 2 : 3L`,
    output: { type: 'long', value: '2' },
  },
  {
    code: `b ? 'a' : b2 ? 1 : 2L`,
    output: { type: 'long', value: '97' },
    env: {
      local: {
        b: { type: 'boolean', value: true },
        b2: { type: 'boolean', value: false },
      },
      heap: {},
    },
  },
  {
    code: `b ? 'a' : b2 ? 1 : 2L`,
    output: { type: 'long', value: '2' },
    env: {
      local: {
        b: { type: 'boolean', value: false },
        b2: { type: 'boolean', value: false },
      },
      heap: {},
    },
  },
  {
    code: `true ? 'a' : 1000000`,
    output: { type: 'int', value: 97 },
  },
  // ------------------------- conditional: string interning & constant folding of the result -------------------------
  // A ternary whose arms are compile-time constants is itself constant and folds to an
  // interned String, so == against the same literal is true; an arm that needs a runtime
  // concatenation yields a fresh, non-interned object, so == is false. (Companion to the
  // interning tests further down.)
  {
    code: `(true ? "a" : "b") == "a"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? "a" : "b") == "b"`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(false ? "a" : "b") == "b"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? "a" + "b" : "c") == "ab"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(false ? "c" : "a" + "b") == "ab"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(1 < 2 ? "a" + "b" : "c" + "d") == "ab"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("" + (true ? "a" : "b")) == "a"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `((true ? "a" : "b") + "") == "a"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? (false ? "a" : "b") : "c") == "b"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(b ? "a" + "b" : "c") == "ab"`,
    output: { type: 'boolean', value: true },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  {
    code: `(true ? s + "b" : "c") == "ab"`,
    output: { type: 'boolean', value: false },
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: {
        heap0: { class: 'java.lang.String', value: 'a', isInterned: true },
      },
    },
  },
  {
    code: `(true ? s + "b" : "c") == (s + "b")`,
    output: { type: 'boolean', value: false },
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: {
        heap0: { class: 'java.lang.String', value: 'a', isInterned: true },
      },
    },
  },
  // ------------------------- conditional: boxed (reference) results & wrapper caches -------------------------
  // A ternary whose arms are a numeric/boolean mix is a *reference* conditional: the chosen
  // arm is boxed and == then compares object identity, not value. Two syntactic copies of
  // the same expression therefore only compare equal when boxing reuses a cached wrapper
  // (Integer/Short/Long -128..127, Character <= 127, whole Byte range, Boolean singletons),
  // while Float/Double and out-of-range values box to distinct objects. This probes whether
  // the conditional result is boxed at all. Contrast with an int == unboxing comparison.
  {
    code: `(true ? 100 : false) == (true ? 100 : false)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? 1000 : false) == (true ? 1000 : false)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? 127 : false) == (true ? 127 : false)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? 128 : false) == (true ? 128 : false)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? -128 : false) == (true ? -128 : false)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? -129 : false) == (true ? -129 : false)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(false ? false : 100) == (false ? false : 100)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(false ? false : 1000) == (false ? false : 1000)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? true : 100) == (true ? true : 100)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(false ? 100 : true) == (false ? 100 : true)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? 100L : false) == (true ? 100L : false)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? 1000L : false) == (true ? 1000L : false)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? (byte)127 : false) == (true ? (byte)127 : false)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? (short)100 : false) == (true ? (short)100 : false)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? (short)1000 : false) == (true ? (short)1000 : false)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? 'a' : false) == (true ? 'a' : false)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? 'ÿ' : false) == (true ? 'ÿ' : false)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? 1.5f : false) == (true ? 1.5f : false)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? 1.5 : false) == (true ? 1.5 : false)`,
    output: { type: 'boolean', value: false },
  },
  // The conditional's static type is lub(Integer, Boolean) -- a common supertype, not the
  // Integer wrapper -- so it cannot be unboxed: comparing it with an int literal is a
  // compile-time error (== is only reference equality here).
  {
    code: `(true ? 100 : false) == 100`,
    isError: true,
  },
  {
    code: `(true ? 1000 : false) == 1000`,
    isError: true,
  },
  // Boxed locals: reading the same wrapper variable twice yields one object (== true),
  // whereas a freshly boxed non-cached constant is a distinct object (== false). These
  // need boxed values in the locals, which the harness supports via the `boxed` flag.
  {
    code: `(true ? n : false) == (true ? n : false)`,
    output: { type: 'boolean', value: true },
    env: {
      local: { n: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(true ? 1000 : false) == n`,
    output: { type: 'boolean', value: false },
    env: {
      local: { n: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(true ? 100 : false) == m`,
    output: { type: 'boolean', value: true },
    env: {
      local: { m: { type: 'int', value: 100, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(true ? ch : false) == ch`,
    output: { type: 'boolean', value: true },
    env: {
      local: { ch: { type: 'char', value: 1000, boxed: true } },
      heap: {},
    },
  },
  // ------------------------- conditional: cross-shape cache hits & unboxing paths -------------------------
  // Boxed results reached through different arm shapes (null / boolean / String on the other
  // side) still route through the same wrapper cache. When both operands are already boxed
  // (Integer locals) the conditional is an Integer-typed reference conditional: == against an
  // int literal and arithmetic unbox the result numerically. Boxing only for the *chosen* arm.
  {
    code: `(true ? 100 : null) == (true ? 100 : false)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? 1000 : null) == (true ? 1000 : false)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? 100 : "x") == (true ? 100 : "x")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? 1000 : "x") == (true ? 1000 : "x")`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? 1 : null) - 1`,
    output: { type: 'int', value: 0 },
  },
  // Unboxing a null arm raises NullPointerException at run time ...
  {
    code: `(false ? 1 : null) + 1`,
    isError: true,
  },
  // ... while the lub of two different wrappers is not an unboxable type, so using it as a
  // numeric operand is a compile-time error even though the numeric arm is selected.
  {
    code: `(true ? 1000 : false) + 1`,
    isError: true,
  },
  // Integer-typed conditional over boxed locals: == and + unbox numerically.
  {
    code: `(b ? n : m) == 1000`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        b: { type: 'boolean', value: true },
        n: { type: 'int', value: 1000, boxed: true },
        m: { type: 'int', value: 5, boxed: true },
      },
      heap: {},
    },
  },
  // Long boxed at run time (runtime condition, so no constant-condition folding): the two
  // copies of the expression box the selected literal separately and only compare equal when
  // Long.valueOf() reuses the -128..127 cache. (Mixing a Long variable with a long literal
  // instead yields a *numeric* long conditional -- Table 15.25-B -- so no boxing happens.)
  {
    code: `(b ? 100L : false) == (b ? 100L : false)`,
    output: { type: 'boolean', value: true },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  {
    code: `(b ? 1000L : false) == (b ? 1000L : false)`,
    output: { type: 'boolean', value: false },
    env: {
      local: { b: { type: 'boolean', value: true } },
      heap: {},
    },
  },
  // ------------------------- conditional: compile-time type errors -------------------------
  {
    code: `1 ? 2 : 3`,
    isError: true,
  },
  {
    code: `1.5 ? 2 : 3`,
    isError: true,
  },
  {
    code: `null ? 1 : 2`,
    isError: true,
  },
  {
    code: `"x" ? 1 : 2`,
    isError: true,
  },
  // Non-boolean runtime (variable) conditions and non-literal boolean candidates.
  {
    code: `x ? 1 : 2`,
    isError: true,
    env: {
      local: { x: { type: 'int', value: 1 } },
      heap: {},
    },
  },
  {
    code: `ch ? 1 : 2`,
    isError: true,
    env: {
      local: { ch: { type: 'char', value: 65 } },
      heap: {},
    },
  },
  {
    code: `d ? 1 : 2`,
    isError: true,
    env: {
      local: { d: { type: 'double', value: 1.5 } },
      heap: {},
    },
  },
  {
    code: `s ? 1 : 2`,
    isError: true,
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: {
        heap0: { class: 'java.lang.String', value: 'a', isInterned: true },
      },
    },
  },
  {
    code: `(1 + 1) ? 2 : 3`,
    isError: true,
  },
  // ==================== BOXED WRAPPER COMPARISONS (== / != / < etc.) ====================
  // Boxed values are wrapper objects (Integer, Short, ...). == / != between two reference
  // operands compares *identity* (JLS 15.21.3) subject to the autoboxing caches of
  // valueOf(): Integer/Short/Long share the -128..127 instances, Character the 0..127
  // ones, Byte the whole range, Boolean two singletons, Float/Double none. So two boxed
  // env locals compare equal only when they denote the *same* cached instance (or one
  // variable is read twice); equal values outside the cache box to distinct objects.
  // Feeding wrappers in through env.boxed makes the harness render one wrapper
  // declaration per local; every expectation below is whatever real Java produces.
  // ------------------------- boxed == boxed: identity & wrapper caches -------------------------
  // Reading the same wrapper variable twice yields one object -- also for a non-cached value.
  {
    code: `a == a`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `a == a`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'double', value: 1.5, boxed: true } },
      heap: {},
    },
  },
  // Integer cache -128..127: equal cached values share one object ...
  {
    code: `a == b`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'int', value: 100, boxed: true },
        b: { type: 'int', value: 100, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'int', value: 127, boxed: true },
        b: { type: 'int', value: 127, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'int', value: -128, boxed: true },
        b: { type: 'int', value: -128, boxed: true },
      },
      heap: {},
    },
  },
  // ... while equal values outside the cache box into distinct objects.
  {
    code: `a == b`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'int', value: 1000, boxed: true },
        b: { type: 'int', value: 1000, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'int', value: 128, boxed: true },
        b: { type: 'int', value: 128, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'int', value: -129, boxed: true },
        b: { type: 'int', value: -129, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'int', value: -2147483648, boxed: true },
        b: { type: 'int', value: -2147483648, boxed: true },
      },
      heap: {},
    },
  },
  // Short reuses the Integer cache (-128..127): 100 is cached, 1000 is not.
  {
    code: `a == b`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'short', value: 100, boxed: true },
        b: { type: 'short', value: 100, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'short', value: 1000, boxed: true },
        b: { type: 'short', value: 1000, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'short', value: -32768, boxed: true },
        b: { type: 'short', value: -32768, boxed: true },
      },
      heap: {},
    },
  },
  // The whole Byte range is cached, so equal Byte variables always share an object.
  {
    code: `a == b`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'byte', value: 100, boxed: true },
        b: { type: 'byte', value: 100, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'byte', value: 100, boxed: true },
        b: { type: 'byte', value: -100, boxed: true },
      },
      heap: {},
    },
  },
  // Long cache -128..127: 100 cached, 1000 not. Long.MIN needs parseLong in the harness.
  {
    code: `a == b`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'long', value: '100', boxed: true },
        b: { type: 'long', value: '100', boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'long', value: '1000', boxed: true },
        b: { type: 'long', value: '1000', boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'long', value: '-9223372036854775808', boxed: true },
        b: { type: 'long', value: '-9223372036854775808', boxed: true },
      },
      heap: {},
    },
  },
  // Character cache 0..127: 100 ('d') is cached, 200 is not.
  {
    code: `a == b`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'char', value: 100, boxed: true },
        b: { type: 'char', value: 100, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'char', value: 200, boxed: true },
        b: { type: 'char', value: 200, boxed: true },
      },
      heap: {},
    },
  },
  // Boolean has two singletons.
  {
    code: `a == b`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'boolean', value: true, boxed: true },
        b: { type: 'boolean', value: true, boxed: true },
      },
      heap: {},
    },
  },
  // Floating point wrappers are never cached: equal values box into distinct objects.
  {
    code: `a == b`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'double', value: 1.5, boxed: true },
        b: { type: 'double', value: 1.5, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'float', value: 1.5, boxed: true },
        b: { type: 'float', value: 1.5, boxed: true },
      },
      heap: {},
    },
  },
  // != is the negation of the same identity comparison.
  {
    code: `a != b`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'int', value: 100, boxed: true },
        b: { type: 'int', value: 100, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `a != b`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'int', value: 1000, boxed: true },
        b: { type: 'int', value: 1000, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `a != a`,
    output: { type: 'boolean', value: false },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  // ------------------------- boxed vs primitive & literals: unboxing -------------------------
  // One boxed and one primitive operand make == a *numeric* equality (JLS 15.21.1): the
  // wrapper is unboxed, then binary numeric promotion applies across any width.
  {
    code: `a == 100`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'int', value: 100, boxed: true } },
      heap: {},
    },
  },
  {
    code: `a == 1000L`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `a == 1000.0`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `a == 100`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'short', value: 100, boxed: true } },
      heap: {},
    },
  },
  {
    code: `c == 'a'`,
    output: { type: 'boolean', value: true },
    env: {
      local: { c: { type: 'char', value: 97, boxed: true } },
      heap: {},
    },
  },
  {
    code: `a == 100`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'long', value: '100', boxed: true } },
      heap: {},
    },
  },
  {
    code: `b == true`,
    output: { type: 'boolean', value: true },
    env: {
      local: { b: { type: 'boolean', value: true, boxed: true } },
      heap: {},
    },
  },
  {
    code: `b == false`,
    output: { type: 'boolean', value: false },
    env: {
      local: { b: { type: 'boolean', value: true, boxed: true } },
      heap: {},
    },
  },
  {
    code: `d == 1.5`,
    output: { type: 'boolean', value: true },
    env: {
      local: { d: { type: 'double', value: 1.5, boxed: true } },
      heap: {},
    },
  },
  {
    code: `a != 1000`,
    output: { type: 'boolean', value: false },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  // Boxed variable vs an unboxed env local of a *different* primitive width.
  {
    code: `a == p`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'int', value: 1000, boxed: true },
        p: { type: 'long', value: '1000' },
      },
      heap: {},
    },
  },
  // ------------------------- boxed vs null -------------------------
  // A wrapper variable compared against null is a reference comparison (never unboxed).
  {
    code: `x == n`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        x: { type: 'int', value: 100, boxed: true },
        n: { type: 'null', value: null },
      },
      heap: {},
    },
  },
  {
    code: `x != n`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        x: { type: 'int', value: 100, boxed: true },
        n: { type: 'null', value: null },
      },
      heap: {},
    },
  },
  {
    code: `n == n`,
    output: { type: 'boolean', value: true },
    env: {
      local: { n: { type: 'null', value: null } },
      heap: {},
    },
  },
  // ------------------------- == / != across different wrapper types: compile-time errors -------------------------
  // Two boxed operands of *different* wrapper classes are reference-typed but not mutually
  // convertible by casting, so javac rejects them ("incomparable types"). Integer x = 100;
  // Short y = 100; x == y is a compile-time error -- also when the comparison is hidden
  // behind a short-circuiting operator, because typing still happens: a runtime check or an
  // evaluator-only exception could not detect these.
  {
    code: `x == y`,
    isError: true,
    env: {
      local: {
        x: { type: 'int', value: 100, boxed: true },
        y: { type: 'short', value: 100, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `x != y`,
    isError: true,
    env: {
      local: {
        x: { type: 'int', value: 100, boxed: true },
        y: { type: 'short', value: 100, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `true || (x == y)`,
    isError: true,
    env: {
      local: {
        x: { type: 'int', value: 100, boxed: true },
        y: { type: 'short', value: 100, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `false && (x == y)`,
    isError: true,
    env: {
      local: {
        x: { type: 'int', value: 100, boxed: true },
        y: { type: 'short', value: 100, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    isError: true,
    env: {
      local: {
        a: { type: 'int', value: 100, boxed: true },
        b: { type: 'long', value: '100', boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    isError: true,
    env: {
      local: {
        a: { type: 'int', value: 1000, boxed: true },
        b: { type: 'double', value: 1000, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    isError: true,
    env: {
      local: {
        a: { type: 'int', value: 100, boxed: true },
        b: { type: 'float', value: 100, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    isError: true,
    env: {
      local: {
        a: { type: 'int', value: 100, boxed: true },
        b: { type: 'char', value: 100, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    isError: true,
    env: {
      local: {
        a: { type: 'short', value: 100, boxed: true },
        b: { type: 'byte', value: 100, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `a == b`,
    isError: true,
    env: {
      local: {
        a: { type: 'char', value: 65, boxed: true },
        b: { type: 'byte', value: 65, boxed: true },
      },
      heap: {},
    },
  },
  // Boolean wrappers only unbox against a primitive boolean; against numbers they stay
  // reference-typed and are incomparable.
  {
    code: `b == a`,
    isError: true,
    env: {
      local: {
        b: { type: 'boolean', value: true, boxed: true },
        a: { type: 'int', value: 100, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `b == 1`,
    isError: true,
    env: {
      local: { b: { type: 'boolean', value: true, boxed: true } },
      heap: {},
    },
  },
  {
    code: `true || (b == 1)`,
    isError: true,
    env: {
      local: { b: { type: 'boolean', value: true, boxed: true } },
      heap: {},
    },
  },
  // ------------------------- relational between mixed numeric wrappers: numeric -------------------------
  // Unlike ==, the relational operators unbox both operands and compare numerically, so any
  // wrapper/primitive numeric mix compiles (JLS 15.20.1) -- Integer vs Short is fine here.
  {
    code: `x < y`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        x: { type: 'int', value: 100, boxed: true },
        y: { type: 'short', value: 200, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `x <= y`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        x: { type: 'int', value: 100, boxed: true },
        y: { type: 'short', value: 200, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `x > y`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        x: { type: 'int', value: 100, boxed: true },
        y: { type: 'short', value: 200, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `l <= i`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        l: { type: 'long', value: '1000', boxed: true },
        i: { type: 'int', value: 1000, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `c < s`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        c: { type: 'char', value: 65, boxed: true },
        s: { type: 'short', value: 100, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `d < f`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        d: { type: 'double', value: 1.5, boxed: true },
        f: { type: 'float', value: 2.5, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `x < 200`,
    output: { type: 'boolean', value: true },
    env: {
      local: { x: { type: 'int', value: 100, boxed: true } },
      heap: {},
    },
  },
  // ==================== STRING CONCATENATION & CONVERSION ====================
  // ------------------------- string concatenation: basics & ordering -------------------------
  {
    code: `"" + ""`,
    output: { type: '__str', value: '' },
  },
  {
    code: `"ab" + "cd"`,
    output: { type: '__str', value: 'abcd' },
  },
  {
    code: `"x" + 1`,
    output: { type: '__str', value: 'x1' },
  },
  {
    code: `1 + "x"`,
    output: { type: '__str', value: '1x' },
  },
  {
    code: `"x" + 1 + 2`,
    output: { type: '__str', value: 'x12' },
  },
  {
    code: `1 + 2 + "x"`,
    output: { type: '__str', value: '3x' },
  },
  {
    code: `"x" + (1 + 2)`,
    output: { type: '__str', value: 'x3' },
  },
  {
    code: `2 * 3 + "x"`,
    output: { type: '__str', value: '6x' },
  },
  // ------------------------- string concatenation: int / long / byte -------------------------
  {
    code: `"" + 42`,
    output: { type: '__str', value: '42' },
  },
  {
    code: `"" + -2147483648`,
    output: { type: '__str', value: '-2147483648' },
  },
  {
    code: `"" + 9223372036854775807L`,
    output: { type: '__str', value: '9223372036854775807' },
  },
  {
    code: `"" + (-9223372036854775808L)`,
    output: { type: '__str', value: '-9223372036854775808' },
  },
  {
    code: `"" + (byte)200`,
    output: { type: '__str', value: '-56' },
  },
  // ------------------------- string concatenation: char -------------------------
  {
    code: `"" + 'a'`,
    output: { type: '__str', value: 'a' },
  },
  {
    code: `"" + (char)65`,
    output: { type: '__str', value: 'A' },
  },
  {
    code: `"c=" + 'x'`,
    output: { type: '__str', value: 'c=x' },
  },
  {
    code: `"" + 'a' + 1`,
    output: { type: '__str', value: 'a1' },
  },
  {
    code: `"" + ('a' + 1)`,
    output: { type: '__str', value: '98' },
  },
  {
    code: `'x' + ""`,
    output: { type: '__str', value: 'x' },
  },
  // ------------------------- string concatenation: boolean & null -------------------------
  {
    code: `"" + true`,
    output: { type: '__str', value: 'true' },
  },
  {
    code: `"" + false`,
    output: { type: '__str', value: 'false' },
  },
  {
    code: `true + ""`,
    output: { type: '__str', value: 'true' },
  },
  {
    code: `"" + null`,
    output: { type: '__str', value: 'null' },
  },
  {
    code: `null + ""`,
    output: { type: '__str', value: 'null' },
  },
  // ------------------------- string concatenation: Infinity / NaN -------------------------
  {
    code: `"" + (1.0 / 0.0)`,
    output: { type: '__str', value: 'Infinity' },
  },
  {
    code: `"" + (-1.0 / 0.0)`,
    output: { type: '__str', value: '-Infinity' },
  },
  {
    code: `"" + (0.0 / 0.0)`,
    output: { type: '__str', value: 'NaN' },
  },
  {
    code: `"" + (1.0f / 0.0f)`,
    output: { type: '__str', value: 'Infinity' },
  },
  {
    code: `"" + (1e308 * 10)`,
    output: { type: '__str', value: 'Infinity' },
  },
  // ------------------------- string concatenation: float & double that Java prints plainly -------------------------
  {
    code: `"" + 0.5`,
    output: { type: '__str', value: '0.5' },
  },
  {
    code: `"" + 2.5`,
    output: { type: '__str', value: '2.5' },
  },
  {
    code: `"" + 0.1`,
    output: { type: '__str', value: '0.1' },
  },
  // ------------------------- string concatenation: float & double formatting (expected values = Java reference) -------------------------
  {
    code: `"" + 100.0`,
    output: { type: '__str', value: '100.0' },
  },
  {
    code: `"" + 2f`,
    output: { type: '__str', value: '2.0' },
  },
  {
    code: `"" + 0.1f`,
    output: { type: '__str', value: '0.1' },
  },
  {
    code: `"" + (1f / 3f)`,
    output: { type: '__str', value: '0.33333334' },
  },
  {
    code: `"" + -0.0`,
    output: { type: '__str', value: '-0.0' },
  },
  // ------------------------- string conversion: double sizes (expected values = Java reference) -------------------------
  {
    code: `"" + 1e6`,
    output: { type: '__str', value: '1000000.0' },
  },
  {
    code: `"" + 1e7`,
    output: { type: '__str', value: '1.0E7' },
  },
  {
    code: `"" + 12345678.0`,
    output: { type: '__str', value: '1.2345678E7' },
  },
  {
    code: `"" + 1.7976931348623157e308`,
    output: { type: '__str', value: '1.7976931348623157E308' },
  },
  {
    code: `"" + 4.9e-324`,
    output: { type: '__str', value: '4.9E-324' },
  },
  {
    code: `"" + 0.001`,
    output: { type: '__str', value: '0.001' },
  },
  {
    code: `"" + 0.0001`,
    output: { type: '__str', value: '1.0E-4' },
  },
  {
    code: `"" + (1.0 / 3.0)`,
    output: { type: '__str', value: '0.3333333333333333' },
  },
  {
    code: `"" + (0.1 + 0.2)`,
    output: { type: '__str', value: '0.30000000000000004' },
  },
  {
    code: `"" + -1e7`,
    output: { type: '__str', value: '-1.0E7' },
  },
  // ------------------------- string conversion: float sizes (expected values = Java reference) -------------------------
  {
    code: `"" + 3.4028235e38f`,
    output: { type: '__str', value: '3.4028235E38' },
  },
  {
    code: `"" + 1e-45f`,
    output: { type: '__str', value: '1.4E-45' },
  },
  {
    code: `"" + 16777216f`,
    output: { type: '__str', value: '1.6777216E7' },
  },
  {
    code: `"" + 1e20f`,
    output: { type: '__str', value: '1.0E20' },
  },
  {
    code: `"" + 0.5f`,
    output: { type: '__str', value: '0.5' },
  },
  // ------------------------- string conversion: double & float edge cases (expected values = Java reference) -------------------------
  {
    code: `"" + 1e15`,
    output: { type: '__str', value: '1.0E15' },
  },
  {
    code: `"" + 1e21`,
    output: { type: '__str', value: '1.0E21' },
  },
  {
    code: `"" + 2.2250738585072014e-308`,
    output: { type: '__str', value: '2.2250738585072014E-308' },
  },
  {
    code: `"" + 5e-324`,
    output: { type: '__str', value: '4.9E-324' },
  },
  {
    code: `"" + 1.5e-5`,
    output: { type: '__str', value: '1.5E-5' },
  },
  {
    code: `"" + -0.0001`,
    output: { type: '__str', value: '-1.0E-4' },
  },
  {
    code: `"" + 9.999999e6`,
    output: { type: '__str', value: '9999999.0' },
  },
  {
    code: `"" + 0.9999999999999999`,
    output: { type: '__str', value: '0.9999999999999999' },
  },
  {
    code: `"" + 123.456`,
    output: { type: '__str', value: '123.456' },
  },
  {
    code: `"" + -123.456`,
    output: { type: '__str', value: '-123.456' },
  },
  {
    code: `"" + 3.1415927f`,
    output: { type: '__str', value: '3.1415927' },
  },
  {
    code: `"" + 1.17549435e-38f`,
    output: { type: '__str', value: '1.1754944E-38' },
  },
  {
    code: `"" + 100.0f`,
    output: { type: '__str', value: '100.0' },
  },
  {
    code: `"" + 16777215f`,
    output: { type: '__str', value: '1.6777215E7' },
  },
  {
    code: `"" + -1.5e10f`,
    output: { type: '__str', value: '-1.5E10' },
  },
  // ------------------------- string used with non-'+' operators (expected: Java compile error) -------------------------
  {
    code: `"a" + "b" * 2`,
    isError: true,
  },
  {
    code: `"x" - 1`,
    isError: true,
  },
  {
    code: `1 / "x"`,
    isError: true,
  },
  // ==================== IDENTIFIERS - EXPRESSIONS ====================
  // ------------------------- identifiers: int arithmetic -------------------------
  {
    code: `a + a`,
    output: { type: 'int', value: 10 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `a + b`,
    output: { type: 'int', value: 2 },
    env: {
      local: { a: { type: 'int', value: 5 }, b: { type: 'int', value: -3 } },
      heap: {},
    },
  },
  {
    code: `a / b`,
    output: { type: 'int', value: -1 },
    env: {
      local: { a: { type: 'int', value: 5 }, b: { type: 'int', value: -3 } },
      heap: {},
    },
  },
  {
    code: `a % b`,
    output: { type: 'int', value: 2 },
    env: {
      local: { a: { type: 'int', value: 5 }, b: { type: 'int', value: -3 } },
      heap: {},
    },
  },
  {
    code: `-a`,
    output: { type: 'int', value: -5 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  // ------------------------- identifiers: long interactions -------------------------
  {
    code: `xl + a`,
    output: { type: 'long', value: '128' },
    env: {
      local: {
        xl: { type: 'long', value: '123' },
        a: { type: 'int', value: 5 },
      },
      heap: {},
    },
  },
  {
    code: `-xl`,
    output: { type: 'long', value: '-123' },
    env: { local: { xl: { type: 'long', value: '123' } }, heap: {} },
  },
  {
    code: `~xl`,
    output: { type: 'long', value: '-124' },
    env: { local: { xl: { type: 'long', value: '123' } }, heap: {} },
  },
  {
    code: `mx + 1L`,
    output: { type: 'long', value: '-9223372036854775808' },
    env: {
      local: { mx: { type: 'long', value: '9223372036854775807' } },
      heap: {},
    },
  },
  // ------------------------- identifiers: float & double -------------------------
  {
    code: `a + d`,
    output: { type: 'double', value: 8.5 },
    env: {
      local: {
        a: { type: 'int', value: 5 },
        d: { type: 'double', value: 3.5 },
      },
      heap: {},
    },
  },
  {
    code: `d - a`,
    output: { type: 'double', value: -1.5 },
    env: {
      local: {
        a: { type: 'int', value: 5 },
        d: { type: 'double', value: 3.5 },
      },
      heap: {},
    },
  },
  {
    code: `fd + a`,
    output: { type: 'float', value: 6.5 },
    env: {
      local: {
        fd: { type: 'float', value: 1.5 },
        a: { type: 'int', value: 5 },
      },
      heap: {},
    },
  },
  // ------------------------- identifiers: char / byte / short promote to int -------------------------
  {
    code: `ch + a`,
    output: { type: 'int', value: 70 },
    env: {
      local: { ch: { type: 'char', value: 65 }, a: { type: 'int', value: 5 } },
      heap: {},
    },
  },
  {
    code: `ch2 - ch`,
    output: { type: 'int', value: 33 },
    env: {
      local: {
        ch2: { type: 'char', value: 98 },
        ch: { type: 'char', value: 65 },
      },
      heap: {},
    },
  },
  {
    code: `by + by`,
    output: { type: 'int', value: 200 },
    env: { local: { by: { type: 'byte', value: 100 } }, heap: {} },
  },
  {
    code: `~ch`,
    output: { type: 'int', value: -66 },
    env: { local: { ch: { type: 'char', value: 65 } }, heap: {} },
  },
  {
    code: `-by`,
    output: { type: 'int', value: -100 },
    env: { local: { by: { type: 'byte', value: 100 } }, heap: {} },
  },
  // ------------------------- identifiers: string concatenation -------------------------
  {
    code: `str + a`,
    output: { type: '__str', value: 'JavaQuest5' },
    env: {
      local: {
        str: { type: 'reference', ref: 'heap0' },
        a: { type: 'int', value: 5 },
      },
      heap: { heap0: { class: 'java.lang.String', value: 'JavaQuest' } },
    },
  },
  {
    code: `str + xl`,
    output: { type: '__str', value: 'JavaQuest123' },
    env: {
      local: {
        str: { type: 'reference', ref: 'heap0' },
        xl: { type: 'long', value: '123' },
      },
      heap: { heap0: { class: 'java.lang.String', value: 'JavaQuest' } },
    },
  },
  {
    code: `str + ch`,
    output: { type: '__str', value: 'JavaQuestA' },
    env: {
      local: {
        str: { type: 'reference', ref: 'heap0' },
        ch: { type: 'char', value: 65 },
      },
      heap: { heap0: { class: 'java.lang.String', value: 'JavaQuest' } },
    },
  },
  {
    code: `str + flag`,
    output: { type: '__str', value: 'JavaQuesttrue' },
    env: {
      local: {
        str: { type: 'reference', ref: 'heap0' },
        flag: { type: 'boolean', value: true },
      },
      heap: { heap0: { class: 'java.lang.String', value: 'JavaQuest' } },
    },
  },
  {
    code: `a + str`,
    output: { type: '__str', value: '5JavaQuest' },
    env: {
      local: {
        a: { type: 'int', value: 5 },
        str: { type: 'reference', ref: 'heap0' },
      },
      heap: { heap0: { class: 'java.lang.String', value: 'JavaQuest' } },
    },
  },
  // ------------------------- identifiers: logical operators & equality -------------------------
  {
    code: `!flag`,
    output: { type: 'boolean', value: false },
    env: { local: { flag: { type: 'boolean', value: true } }, heap: {} },
  },
  {
    code: `flag && flag2`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        flag: { type: 'boolean', value: true },
        flag2: { type: 'boolean', value: false },
      },
      heap: {},
    },
  },
  {
    code: `flag || flag2`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        flag: { type: 'boolean', value: true },
        flag2: { type: 'boolean', value: false },
      },
      heap: {},
    },
  },
  {
    code: `a == xl`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'int', value: 5 },
        xl: { type: 'long', value: '123' },
      },
      heap: {},
    },
  },
  {
    code: `a == 123L`,
    output: { type: 'boolean', value: false },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `xl == 123L`,
    output: { type: 'boolean', value: true },
    env: { local: { xl: { type: 'long', value: '123' } }, heap: {} },
  },
  // ------------------------- identifiers: casts -------------------------
  {
    code: `(byte)a`,
    output: { type: 'byte', value: 5 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `(int)xl`,
    output: { type: 'int', value: 123 },
    env: { local: { xl: { type: 'long', value: '123' } }, heap: {} },
  },
  {
    code: `(long)a`,
    output: { type: 'long', value: '5' },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `(double)a`,
    output: { type: 'double', value: 5 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `(char)zz`,
    output: { type: 'char', value: 58368 },
    env: { local: { zz: { type: 'long', value: '10000000000' } }, heap: {} },
  },
  // ------------------------- identifiers: precedence & parentheses -------------------------
  {
    code: `(a + b) * 2`,
    output: { type: 'int', value: 4 },
    env: {
      local: { a: { type: 'int', value: 5 }, b: { type: 'int', value: -3 } },
      heap: {},
    },
  },
  {
    code: `a - b - a`,
    output: { type: 'int', value: 3 },
    env: {
      local: { a: { type: 'int', value: 5 }, b: { type: 'int', value: -3 } },
      heap: {},
    },
  },
  // ==================== STRING OBJECT MODEL - INTERNING & CONSTANT FOLDING ====================
  // ------------------------- string interning: literals & constant folding share objects -------------------------
  // Java folds constant string concatenations at compile time and interns the folded
  // result, so syntactically different constant expressions can denote one String object.
  // (These guard against regressing constant folding once == compares references.)
  {
    code: `("a" + "b") == "ab"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("a" + "b") == ("a" + "b")`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("a" + "b") + "c" == "abc"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("" + "x") == "x"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("" + 1) == "1"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(1 + "") == "1"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("" + (1 + 2)) == "3"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `((1 + 2) + "") == "3"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("" + 2.5) == "2.5"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("" + 'a') == "a"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `('a' + "") == "a"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("" + true) == "true"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("" + (1.0 / 0.0)) == "Infinity"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("" + (0.0 / 0.0)) == "NaN"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("foo" + "bar") == "foobar"`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- string interning: runtime concatenation yields fresh (non-interned) objects -------------------------
  // A concatenation that involves a variable is not a compile-time constant, so Java
  // allocates a fresh object even when the content matches an interned literal.
  {
    code: `s + "b" == "ab"`,
    output: { type: 'boolean', value: false },
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: {
        heap0: { class: 'java.lang.String', value: 'a', isInterned: true },
      },
    },
  },
  {
    code: `(s + "b") == (s + "b")`,
    output: { type: 'boolean', value: false },
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: {
        heap0: { class: 'java.lang.String', value: 'a', isInterned: true },
      },
    },
  },
  {
    code: `s + "b" == ("a" + "b")`,
    output: { type: 'boolean', value: false },
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: {
        heap0: { class: 'java.lang.String', value: 'a', isInterned: true },
      },
    },
  },
  {
    code: `(s + "") == s`,
    output: { type: 'boolean', value: false },
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: {
        heap0: { class: 'java.lang.String', value: 'ab', isInterned: true },
      },
    },
  },
  {
    code: `("" + s) == s`,
    output: { type: 'boolean', value: false },
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: {
        heap0: { class: 'java.lang.String', value: 'ab', isInterned: true },
      },
    },
  },
  {
    code: `(s + t) == "abcd"`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        s: { type: 'reference', ref: 'heap0' },
        t: { type: 'reference', ref: 'heap1' },
      },
      heap: {
        heap0: { class: 'java.lang.String', value: 'ab', isInterned: true },
        heap1: { class: 'java.lang.String', value: 'cd', isInterned: true },
      },
    },
  },
  {
    code: `(s + "cd") == ("ab" + "cd")`,
    output: { type: 'boolean', value: false },
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: {
        heap0: { class: 'java.lang.String', value: 'ab', isInterned: true },
      },
    },
  },
  // ------------------------- string interning: interned vs. non-interned heap objects -------------------------
  // Env strings that carry isInterned model pool members (Java string literals);
  // strings without the flag model objects that are not in the pool.
  {
    code: `s == "a"`,
    output: { type: 'boolean', value: false },
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: { heap0: { class: 'java.lang.String', value: 'a' } },
    },
  },
  {
    code: `s == "a"`,
    output: { type: 'boolean', value: true },
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: {
        heap0: { class: 'java.lang.String', value: 'a', isInterned: true },
      },
    },
  },
  {
    code: `s == t`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        s: { type: 'reference', ref: 'heap0' },
        t: { type: 'reference', ref: 'heap1' },
      },
      heap: {
        heap0: { class: 'java.lang.String', value: 'a' },
        heap1: { class: 'java.lang.String', value: 'a' },
      },
    },
  },
  {
    code: `s == t`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        s: { type: 'reference', ref: 'heap0' },
        t: { type: 'reference', ref: 'heap1' },
      },
      heap: {
        heap0: { class: 'java.lang.String', value: 'a', isInterned: true },
        heap1: { class: 'java.lang.String', value: 'a' },
      },
    },
  },
  {
    code: `s == t`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        s: { type: 'reference', ref: 'heap0' },
        t: { type: 'reference', ref: 'heap1' },
      },
      heap: {
        heap0: { class: 'java.lang.String', value: 'a' },
        heap1: { class: 'java.lang.String', value: 'b' },
      },
    },
  },
  {
    code: `s == t`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        s: { type: 'reference', ref: 'heap0' },
        t: { type: 'reference', ref: 'heap1' },
      },
      heap: {
        heap0: { class: 'java.lang.String', value: 'a', isInterned: true },
        heap1: { class: 'java.lang.String', value: 'b', isInterned: true },
      },
    },
  },
  {
    code: `s == s`,
    output: { type: 'boolean', value: true },
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: { heap0: { class: 'java.lang.String', value: 'a' } },
    },
  },
  {
    code: `s == s`,
    output: { type: 'boolean', value: true },
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: {
        heap0: { class: 'java.lang.String', value: 'a', isInterned: true },
      },
    },
  },
  {
    code: `s == "b"`,
    output: { type: 'boolean', value: false },
    env: {
      local: { s: { type: 'reference', ref: 'heap0' } },
      heap: { heap0: { class: 'java.lang.String', value: 'a' } },
    },
  },
  // ------------------------- constant folding: numeric overflow & compile-time evaluation -------------------------
  // Integer/long arithmetic on constant operands wraps at the same width as runtime
  // arithmetic, which some of these expressions make visible.
  {
    code: `2147483647 + 1 == -2147483648`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `0x7fffffff + 1 == -2147483648`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `100000 * 100000 == 1410065408`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `65536 * 65536 == 0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `1073741824 * 4 == 0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `2147483647 * 2 + 2 == 0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(-2147483648) / -1 == -2147483648`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `9223372036854775807L + 1L == -9223372036854775808L`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(-9223372036854775808L) / -1L == -9223372036854775808L`,
    output: { type: 'boolean', value: true },
  },
  // String conversion of a folded constant; == also holds because the folded result is interned.
  {
    code: `("" + 2147483647) + 1 == "21474836471"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `2147483647 + 1 + "" == "-2147483648"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("" + 9223372036854775807L) == "9223372036854775807"`,
    output: { type: 'boolean', value: true },
  },
  // Division / modulo by zero still throws even inside a string concatenation.
  {
    code: `"" + (1 / 0)`,
    isError: true,
  },
  {
    code: `"" + (1 % 0)`,
    isError: true,
  },
  {
    code: `(1 / 0) + ""`,
    isError: true,
  },
  // ------------------------- constant folding: int & long string identities -------------------------
  {
    code: `("" + 100) == "100"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(100 + "") == "100"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("" + (-5)) == "-5"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("" + (100 / 3)) == "33"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("" + (100 % 3)) == "1"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("" + (2147483647 + 1)) == "-2147483648"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("" + (-9223372036854775808L)) == "-9223372036854775808"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(9223372036854775807L + "") == "9223372036854775807"`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- constant folding: double & float string identities -------------------------
  {
    code: `("" + 100.0) == "100.0"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("" + 0.5) == "0.5"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("" + 1e15) == "1.0E15"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("" + 2f) == "2.0"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("" + 0.1f) == "0.1"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("" + (1f / 3f)) == "0.33333334"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("" + (1e308 * 10)) == "Infinity"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("" + (0.0f / 0.0f)) == "NaN"`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- constant folding: char & boolean string identities -------------------------
  {
    code: `("" + 'Ω') == "Ω"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `'x' + "" + 'y' == "xy"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(!true + "") == "false"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `((1 == 1) + "") == "true"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("" + true + false) == "truefalse"`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- constant folding: nesting, associativity & parentheses -------------------------
  {
    code: `(((1 + 2) * 3) + "") == "9"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(("a" + "b") + ("c" + "d")) == "abcd"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(("" + 1) + ("a" + 2)) == "1a2"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `((1 + "") + 2) == "12"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(1L + "" + 2L) == "12"`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- constant folding: null does not participate -------------------------
  // JLS 15.29: a constant expression contains no null literal, so concatenations with
  // null are runtime operations yielding fresh objects (folding must exclude null).
  {
    code: `("" + null) == "null"`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(null + "") == "null"`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `("a" + null) == "anull"`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(null + "a") == "nulla"`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(null + "") == (null + "")`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `("x" + null) == ("x" + null)`,
    output: { type: 'boolean', value: false },
  },
  // ------------------------- constant folding: char/byte/short casts -------------------------
  {
    code: `(byte)300`,
    output: { type: 'byte', value: 44 },
  },
  {
    code: `(short)65537`,
    output: { type: 'short', value: 1 },
  },
  {
    code: `(char)66`,
    output: { type: 'char', value: 66 },
  },
  // A cast of a constant is itself a constant, so these also fold to the pooled string.
  {
    code: `("" + (char)65) == "A"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("" + (byte)200) == "-56"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("" + (short)65537) == "1"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `((char)65 + "") == "A"`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- constant folding: dynamic operands stop folding -------------------------
  {
    code: `a + "" == "5"`,
    output: { type: 'boolean', value: false },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `"" + a == "5"`,
    output: { type: 'boolean', value: false },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `a + "x" == "5x"`,
    output: { type: 'boolean', value: false },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `xl + "" == "123"`,
    output: { type: 'boolean', value: false },
    env: { local: { xl: { type: 'long', value: '123' } }, heap: {} },
  },
  {
    code: `ch + "" == "a"`,
    output: { type: 'boolean', value: false },
    env: { local: { ch: { type: 'char', value: 97 } }, heap: {} },
  },
  {
    code: `"" + ch == "a"`,
    output: { type: 'boolean', value: false },
    env: { local: { ch: { type: 'char', value: 97 } }, heap: {} },
  },
  {
    code: `(a + "") == (a + "")`,
    output: { type: 'boolean', value: false },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  // ------------------------- constant folding: division / modulo by zero stays runtime -------------------------
  {
    code: `"" + ((-1) / 0)`,
    isError: true,
  },
  {
    code: `"" + (0 / 0)`,
    isError: true,
  },
  {
    code: `(1L / 0L) + ""`,
    isError: true,
  },
  {
    code: `-(1 / 0)`,
    isError: true,
  },
  // ------------------------- constant folding: unary operator string identities -------------------------
  {
    code: `("" + ~0) == "-1"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("" + ~5) == "-6"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(~5 + "") == "-6"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("" + -(-5)) == "5"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("" + -(-(2 + 3))) == "5"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("" + -(~0)) == "1"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("" + !true) == "false"`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- constant folding: modulo string identities -------------------------
  {
    code: `("" + (100 % 7)) == "2"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("" + (-100 % 7)) == "-2"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("" + (100 % -7)) == "2"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("" + (-100 % -7)) == "-2"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("" + (1000 % 7)) == "6"`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `("" + -(100 % 7)) == "-2"`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- constant folding: modulo by zero in string context stays runtime -------------------------
  {
    code: `"" + ((-1) % 0)`,
    isError: true,
  },
  // ==================== REGRESSION, RUNTIME & TYPECHECK GUARDS ====================
  // ------------------------- regression guards: wrap & narrowing casts -------------------------
  {
    code: `(byte)255`,
    output: { type: 'byte', value: -1 },
  },
  {
    code: `(byte)256`,
    output: { type: 'byte', value: 0 },
  },
  {
    code: `(byte)257`,
    output: { type: 'byte', value: 1 },
  },
  {
    code: `(short)32768`,
    output: { type: 'short', value: -32768 },
  },
  {
    code: `(short)(char)0xffff`,
    output: { type: 'short', value: -1 },
  },
  {
    code: `(char)(short)(byte)-1`,
    output: { type: 'char', value: 65535 },
  },
  // ------------------------- regression guards: Inf/NaN converted to integral types -------------------------
  {
    code: `(byte)(1.0/0.0)`,
    output: { type: 'byte', value: -1 },
  },
  {
    code: `(byte)(-1.0/0.0)`,
    output: { type: 'byte', value: 0 },
  },
  {
    code: `(long)(1.0/0.0)`,
    output: { type: 'long', value: '9223372036854775807' },
  },
  {
    code: `(int)(-1.0f/0.0f)`,
    output: { type: 'int', value: -2147483648 },
  },
  {
    code: `(char)(1.0/0.0)`,
    output: { type: 'char', value: 65535 },
  },
  // ------------------------- regression guards: unary/binary numeric promotion result types -------------------------
  {
    code: `'a' + 'b'`,
    output: { type: 'int', value: 195 },
  },
  {
    code: `(byte)5 + (byte)5`,
    output: { type: 'int', value: 10 },
  },
  {
    code: `(byte)200 + 100`,
    output: { type: 'int', value: 44 },
  },
  {
    code: `(char)65535 + 1`,
    output: { type: 'int', value: 65536 },
  },
  {
    code: `(char)('a' - 32)`,
    output: { type: 'char', value: 65 },
  },
  // ------------------------- regression guards: double -> int/long truncation toward zero -------------------------
  {
    code: `(int)1.9`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `(int)-1.9`,
    output: { type: 'int', value: -1 },
  },
  {
    code: `(long)-0.9`,
    output: { type: 'long', value: '0' },
  },
  // ------------------------- regression guards: double -> long saturation at the 2^63 boundary -------------------------
  // RED: a double exactly equal to 2^63 must saturate to Long.MAX (JLS 5.1.3), but the
  // current toLong clamps only with `>` so 2^63 wraps to Long.MIN instead.
  {
    code: `(long)0x1p63`,
    output: { type: 'long', value: '9223372036854775807' },
  },
  {
    code: `(long)9.223372036854776E18`,
    output: { type: 'long', value: '9223372036854775807' },
  },
  {
    code: `(long)-0x1p63`,
    output: { type: 'long', value: '-9223372036854775808' },
  },
  {
    code: `(long)-9.223372036854776E18`,
    output: { type: 'long', value: '-9223372036854775808' },
  },
  {
    code: `(long)0x1p62`,
    output: { type: 'long', value: '4611686018427387904' },
  },
  // ------------------------- regression guards: surrogate-range char values -------------------------
  // A char is a UTF-16 code unit; surrogate values (0xD800-0xDFFF) are valid chars.
  {
    code: `(char)0xD800`,
    output: { type: 'char', value: 55296 },
  },
  {
    code: `(char)0xDFFF`,
    output: { type: 'char', value: 57343 },
  },
  {
    code: `(char)0xD7FF`,
    output: { type: 'char', value: 55295 },
  },
  {
    code: `(char)0xE000`,
    output: { type: 'char', value: 57344 },
  },
  {
    code: `(char)0x10000`,
    output: { type: 'char', value: 0 },
  },
  // ------------------------- regression guards: stepwise float rounding -------------------------
  {
    code: `(1e20f + 1.5f) - 1e20f`,
    output: { type: 'float', value: 0 },
  },
  {
    code: `(1e20f - 1e20f) + 1.5f`,
    output: { type: 'float', value: 1.5 },
  },
  {
    code: `16777216f + 1f`,
    output: { type: 'float', value: 16777216 },
  },
  {
    code: `16777216f + 1f == 16777216f`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- regression guards: -0.0, Infinity, NaN equality -------------------------
  {
    code: `(1 / -0.0) == (1 / 0.0)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `-0.0f == 0.0f`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(5.0 % 0.0) == (5.0 % 0.0)`,
    output: { type: 'boolean', value: false },
  },
  // ------------------------- regression guards: equality + &&/|| precedence & short circuit -------------------------
  {
    code: `!(true == true) || (1 == 2) && (2 == 2)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(1 == 1 || 2 == 2) && !(1 == 2)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `true && true == false`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(1 == 1) == (true == true)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `5 / (0.0 / 0.0) == 5`,
    output: { type: 'boolean', value: false },
  },
  // ------------------------- regression guards: int/long boundary arithmetic -------------------------
  {
    code: `-2147483648 / -10`,
    output: { type: 'int', value: 214748364 },
  },
  {
    code: `-2147483648 % 10`,
    output: { type: 'int', value: -8 },
  },
  {
    code: `-9223372036854775808L / 10L`,
    output: { type: 'long', value: '-922337203685477580' },
  },
  // ------------------------- regression guards: string concatenation with odd operands -------------------------
  {
    code: `"x" + null`,
    output: { type: '__str', value: 'xnull' },
  },
  {
    code: `"a" + 1 + true`,
    output: { type: '__str', value: 'a1true' },
  },
  {
    code: `"" + ~0`,
    output: { type: '__str', value: '-1' },
  },
  // ------------------------- regression guards: long & chained inputs -------------------------
  {
    code: `1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1+1`,
    output: { type: 'int', value: 60 },
  },
  {
    code: `!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!true`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `((((((((((((((((((((((((((((((((((((((((1))))))))))))))))))))))))))))))))))))))))`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `zahl`,
    output: { type: 'int', value: 42 },
    env: { local: { zahl: { type: 'int', value: 42 } }, heap: {} },
  },
  // ------------------------- runtime guards: integer division/modulo by zero (reached at runtime) -------------------------
  {
    code: `10 / (5 - 5)`,
    isError: true,
  },
  {
    code: `10L / (5L - 5L)`,
    isError: true,
  },
  {
    code: `1 / (int)0.5`,
    isError: true,
  },
  {
    code: `100L % (1L - 1L)`,
    isError: true,
  },
  // ------------------------- typecheck guards: compile-time type errors -------------------------
  {
    code: `1 + true`,
    isError: true,
  },
  {
    code: `'a' && true`,
    isError: true,
  },
  {
    code: `!1.5`,
    isError: true,
  },
  {
    code: `(boolean)null`,
    isError: true,
  },
  {
    code: `null + 1`,
    isError: true,
  },
  {
    code: `1 == "1"`,
    isError: true,
  },
  // ==================== UNBOUND & ERROR CASES ====================
  // ------------------------- identifiers: unbound & keyword error cases -------------------------
  {
    code: `definitelyNotThere`,
    isError: true,
  },
  {
    code: `if`,
    isError: true,
  },
  {
    code: `int`,
    isError: true,
  },
  {
    code: `boolean`,
    isError: true,
  },
  {
    code: `this`,
    isError: true,
  },
  {
    code: `super`,
    isError: true,
  },
]
