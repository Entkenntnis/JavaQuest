import type { TestSuiteEntry } from '../../state/types'

export const literals: TestSuiteEntry[] = [
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
    error: 'compile',
  },
  {
    code: `9223372036854775807L`,
    output: { type: 'long', value: '9223372036854775807' },
  },
  {
    code: `9223372036854775808L`,
    error: 'compile',
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
    error: 'compile',
  },
  {
    code: `0x1_0000_0000`,
    error: 'compile',
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
    error: 'compile',
  },
  {
    code: `0x`,
    error: 'compile',
  },
  {
    code: `0x1G`,
    error: 'compile',
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
    error: 'compile',
  },
  {
    code: `09`,
    error: 'compile',
  },
  {
    code: `0o`,
    error: 'compile',
  },
  {
    code: `0o8`,
    error: 'compile',
  },
  {
    code: `0o777`,
    error: 'compile',
  },
  {
    code: `0O17`,
    error: 'compile',
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
    error: 'compile',
  },
  {
    code: `0b`,
    error: 'compile',
  },
  {
    code: `0b102`,
    error: 'compile',
  },
  {
    code: `0b_1`,
    error: 'compile',
  },
  {
    code: `0b100000000000000000000000000000000`,
    error: 'compile',
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
    error: 'compile',
  },
  {
    code: `0x_FF`,
    error: 'compile',
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
    error: 'compile',
  },
  {
    code: `1.2e`,
    error: 'compile',
  },
  {
    code: `1.2.3`,
    error: 'compile',
  },
  {
    code: `1e309`,
    error: 'compile',
  },
  {
    code: `1.7976931348623159e308`,
    error: 'compile',
  },
  {
    code: `3.4028236e38f`,
    error: 'compile',
  },
  {
    code: `1e39f`,
    error: 'compile',
  },
  {
    code: `1e39`,
    output: { type: 'double', value: 1e39 },
  },
  {
    code: `1e400`,
    error: 'compile',
  },
  {
    code: `1e-400`,
    error: 'compile',
  },
  {
    code: `1e-323`,
    output: { type: 'double', value: 1e-323 },
  },
  {
    code: `1e-324`,
    error: 'compile',
  },
  {
    code: `1e-46f`,
    error: 'compile',
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
    error: 'compile',
  },
  {
    code: `0x1.fffffffffffff8p1023`,
    error: 'compile',
  },
  {
    code: `0x1p`,
    error: 'compile',
  },
  {
    code: `0x1.8p`,
    error: 'compile',
  },
  {
    code: `0x1.8`,
    error: 'compile',
  },
  {
    code: `0x1p-1075`,
    error: 'compile',
  },
  {
    code: `0x1.8p-1074f`,
    error: 'compile',
  },
  {
    code: `0x1p-150f`,
    error: 'compile',
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
    error: 'compile',
  },
  {
    code: `''`,
    error: 'compile',
  },
  {
    code: `'ab'`,
    error: 'compile',
  },
  {
    code: `'\\400'`,
    error: 'compile',
  },
  {
    code: `'\\777'`,
    error: 'compile',
  },
  {
    code: `'\\8'`,
    error: 'compile',
  },
  {
    code: `'\\q'`,
    error: 'compile',
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
    error: 'compile',
  },
  {
    code: `"\\u004"`,
    error: 'compile',
  },
  {
    code: `"a`,
    error: 'compile',
  },
  {
    code: `"a\\`,
    error: 'compile',
  },
  {
    code: '"a\\\nb"',
    error: 'compile',
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
    error: 'compile',
  },
  {
    code: `42 43`,
    error: 'compile',
  },
  {
    code: `42abc`,
    error: 'compile',
  },
]
