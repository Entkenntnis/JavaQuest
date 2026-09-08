import type { TestSuiteEntry } from '../state/types'

export const testSuite: TestSuiteEntry[] = [
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
  {
    code: `null`,
    output: { type: 'null', value: null },
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
  // null are runtime operations yielding fresh objects. RED until folding excludes null.
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
  // RED until the fold gate treats cast-of-constant as constant for string folding.
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
