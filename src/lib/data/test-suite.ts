import type { TestSuiteEntry } from '../state/types'

export const testSuite: TestSuiteEntry[] = [
  // ------------------------- int: decimal -------------------------
  {
    code: `0`,
    output: { kind: 'literal', value: { type: 'int', value: 0 } },
  },
  {
    code: `1`,
    output: { kind: 'literal', value: { type: 'int', value: 1 } },
  },
  {
    code: `42`,
    output: { kind: 'literal', value: { type: 'int', value: 42 } },
  },
  {
    code: `2147483647`,
    output: { kind: 'literal', value: { type: 'int', value: 2147483647 } },
  },
  {
    code: `2147483648`,
    isError: true,
  },
  {
    code: `9223372036854775807L`,
    output: {
      kind: 'literal',
      value: { type: 'long', value: '9223372036854775807' },
    },
  },
  {
    code: `9223372036854775808L`,
    isError: true,
  },
  {
    code: `42L`,
    output: { kind: 'literal', value: { type: 'long', value: '42' } },
  },
  {
    code: `42l`,
    output: { kind: 'literal', value: { type: 'long', value: '42' } },
  },
  {
    code: `2147483648L`,
    output: {
      kind: 'literal',
      value: { type: 'long', value: '2147483648' },
    },
  },
  // ------------------------- int: hexadecimal -------------------------
  {
    code: `0x0`,
    output: { kind: 'literal', value: { type: 'int', value: 0 } },
  },
  {
    code: `0x10`,
    output: { kind: 'literal', value: { type: 'int', value: 16 } },
  },
  {
    code: `0xFF`,
    output: { kind: 'literal', value: { type: 'int', value: 255 } },
  },
  {
    code: `0xff`,
    output: { kind: 'literal', value: { type: 'int', value: 255 } },
  },
  {
    code: `0xcafebabe`,
    output: { kind: 'literal', value: { type: 'int', value: -889275714 } },
  },
  {
    code: `0xCAFEBABE`,
    output: { kind: 'literal', value: { type: 'int', value: -889275714 } },
  },
  {
    code: `0x7fffffff`,
    output: { kind: 'literal', value: { type: 'int', value: 2147483647 } },
  },
  {
    code: `0x80000000`,
    output: { kind: 'literal', value: { type: 'int', value: -2147483648 } },
  },
  {
    code: `0xffffffff`,
    output: { kind: 'literal', value: { type: 'int', value: -1 } },
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
    output: {
      kind: 'literal',
      value: { type: 'long', value: '4294967295' },
    },
  },
  {
    code: `0x7fffffffffffffffL`,
    output: {
      kind: 'literal',
      value: { type: 'long', value: '9223372036854775807' },
    },
  },
  {
    code: `0x8000000000000000L`,
    output: {
      kind: 'literal',
      value: { type: 'long', value: '-9223372036854775808' },
    },
  },
  {
    code: `0xffffffffffffffffL`,
    output: { kind: 'literal', value: { type: 'long', value: '-1' } },
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
    output: { kind: 'literal', value: { type: 'int', value: 0 } },
  },
  {
    code: `0777`,
    output: { kind: 'literal', value: { type: 'int', value: 511 } },
  },
  {
    code: `0_17`,
    output: { kind: 'literal', value: { type: 'int', value: 15 } },
  },
  {
    code: `0_0`,
    output: { kind: 'literal', value: { type: 'int', value: 0 } },
  },
  {
    code: `017777777777`,
    output: { kind: 'literal', value: { type: 'int', value: 2147483647 } },
  },
  {
    code: `020000000000`,
    output: { kind: 'literal', value: { type: 'int', value: -2147483648 } },
  },
  {
    code: `037777777777`,
    output: { kind: 'literal', value: { type: 'int', value: -1 } },
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
    output: { kind: 'literal', value: { type: 'int', value: 0 } },
  },
  {
    code: `0b1`,
    output: { kind: 'literal', value: { type: 'int', value: 1 } },
  },
  {
    code: `0b101`,
    output: { kind: 'literal', value: { type: 'int', value: 5 } },
  },
  {
    code: `0b1010_1010`,
    output: { kind: 'literal', value: { type: 'int', value: 170 } },
  },
  {
    code: `0b10000000000000000000000000000000`,
    output: { kind: 'literal', value: { type: 'int', value: -2147483648 } },
  },
  {
    code: `0b11111111111111111111111111111111`,
    output: { kind: 'literal', value: { type: 'int', value: -1 } },
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
    code: `0b100000000000000000000000000000000`,
    isError: true,
  },
  // ------------------------- int: underscores -------------------------
  {
    code: `1_000`,
    output: { kind: 'literal', value: { type: 'int', value: 1000 } },
  },
  {
    code: `0xFF_EC_DE_5E`,
    output: { kind: 'literal', value: { type: 'int', value: -1253794 } },
  },
  {
    code: `9_223_372_036_854_775_807L`,
    output: {
      kind: 'literal',
      value: { type: 'long', value: '9223372036854775807' },
    },
  },
  {
    code: `1_2_3_4_5`,
    output: { kind: 'literal', value: { type: 'int', value: 12345 } },
  },
  {
    code: `1__2`,
    output: {
      kind: 'literal',
      value: {
        type: 'int',
        value: 12,
      },
    },
  },
  {
    code: `1_`,
    isError: true,
  },
  {
    code: `_1`,
    isError: true,
  },
  {
    code: `0x_FF`,
    isError: true,
  },
  // ------------------------- float: decimal -------------------------
  {
    code: `1.23`,
    output: { kind: 'literal', value: { type: 'double', value: 1.23 } },
  },
  {
    code: `.5`,
    output: { kind: 'literal', value: { type: 'double', value: 0.5 } },
  },
  {
    code: `1.`,
    output: { kind: 'literal', value: { type: 'double', value: 1 } },
  },
  {
    code: `1.e2`,
    output: { kind: 'literal', value: { type: 'double', value: 100 } },
  },
  {
    code: `1e3`,
    output: { kind: 'literal', value: { type: 'double', value: 1000 } },
  },
  {
    code: `1e+3`,
    output: { kind: 'literal', value: { type: 'double', value: 1000 } },
  },
  {
    code: `1E-2`,
    output: { kind: 'literal', value: { type: 'double', value: 0.01 } },
  },
  {
    code: `0.0`,
    output: { kind: 'literal', value: { type: 'double', value: 0 } },
  },
  {
    code: `1.0e1`,
    output: { kind: 'literal', value: { type: 'double', value: 10 } },
  },
  {
    code: `1_0.0_1e2`,
    output: { kind: 'literal', value: { type: 'double', value: 1001 } },
  },
  {
    code: `0.1`,
    output: { kind: 'literal', value: { type: 'double', value: 0.1 } },
  },
  {
    code: `1.7976931348623157e308`,
    output: {
      kind: 'literal',
      value: { type: 'double', value: 1.7976931348623157e308 },
    },
  },
  {
    code: `1f`,
    output: { kind: 'literal', value: { type: 'float', value: 1 } },
  },
  {
    code: `2F`,
    output: { kind: 'literal', value: { type: 'float', value: 2 } },
  },
  {
    code: `0f`,
    output: { kind: 'literal', value: { type: 'float', value: 0 } },
  },
  {
    code: `2d`,
    output: { kind: 'literal', value: { type: 'double', value: 2 } },
  },
  {
    code: `0D`,
    output: { kind: 'literal', value: { type: 'double', value: 0 } },
  },
  {
    code: `0.5f`,
    output: { kind: 'literal', value: { type: 'float', value: 0.5 } },
  },
  {
    code: `1.5f`,
    output: { kind: 'literal', value: { type: 'float', value: 1.5 } },
  },
  {
    code: `1.5e2f`,
    output: { kind: 'literal', value: { type: 'float', value: 150 } },
  },
  {
    code: `1.5e2d`,
    output: { kind: 'literal', value: { type: 'double', value: 150 } },
  },
  {
    code: `0.1f`,
    output: {
      kind: 'literal',
      value: { type: 'float', value: 0.10000000149011612 },
    },
  },
  {
    code: `3.14f`,
    output: {
      kind: 'literal',
      value: { type: 'float', value: 3.140000104904175 },
    },
  },
  {
    code: `1e-45f`,
    output: {
      kind: 'literal',
      value: { type: 'float', value: 1.401298464324817e-45 },
    },
  },
  {
    code: `3.4028235e38f`,
    output: {
      kind: 'literal',
      value: { type: 'float', value: 3.4028234663852886e38 },
    },
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
    code: `1e400`,
    isError: true,
  },
  {
    code: `1e-400`,
    isError: true,
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
    output: { kind: 'literal', value: { type: 'double', value: 1 } },
  },
  {
    code: `0x1p1`,
    output: { kind: 'literal', value: { type: 'double', value: 2 } },
  },
  {
    code: `0x.8p1`,
    output: { kind: 'literal', value: { type: 'double', value: 1 } },
  },
  {
    code: `0x1.p1`,
    output: { kind: 'literal', value: { type: 'double', value: 2 } },
  },
  {
    code: `0x1.8p1`,
    output: { kind: 'literal', value: { type: 'double', value: 3 } },
  },
  {
    code: `0xAp2`,
    output: { kind: 'literal', value: { type: 'double', value: 40 } },
  },
  {
    code: `0x0p0`,
    output: { kind: 'literal', value: { type: 'double', value: 0 } },
  },
  {
    code: `0x0.0p0`,
    output: { kind: 'literal', value: { type: 'double', value: 0 } },
  },
  {
    code: `0x1.fffffffffffffp1023`,
    output: {
      kind: 'literal',
      value: { type: 'double', value: 1.7976931348623157e308 },
    },
  },
  {
    code: `0x1p-1074`,
    output: { kind: 'literal', value: { type: 'double', value: 5e-324 } },
  },
  {
    code: `0x1.fffffep127f`,
    output: {
      kind: 'literal',
      value: { type: 'float', value: 3.4028234663852886e38 },
    },
  },
  {
    code: `0x1p-149f`,
    output: {
      kind: 'literal',
      value: { type: 'float', value: 1.401298464324817e-45 },
    },
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
    output: { kind: 'literal', value: { type: 'double', value: 1e-323 } },
  },
  {
    code: `0x0.0000000000001p-1022`,
    output: { kind: 'literal', value: { type: 'double', value: 5e-324 } },
  },
  // ------------------------- boolean & null -------------------------
  {
    code: `true`,
    output: { kind: 'literal', value: { type: 'boolean', value: true } },
  },
  {
    code: `false`,
    output: { kind: 'literal', value: { type: 'boolean', value: false } },
  },
  {
    code: `TRUE`,
    isError: true,
  },
  {
    code: `True`,
    isError: true,
  },
  {
    code: `tru`,
    isError: true,
  },
  {
    code: `null`,
    output: { kind: 'literal', value: { type: 'null' } },
  },
  {
    code: `NULL`,
    isError: true,
  },
  {
    code: `nil`,
    isError: true,
  },
  // ------------------------- char -------------------------
  {
    code: `'a'`,
    output: { kind: 'literal', value: { type: 'char', value: 97 } },
  },
  {
    code: `'A'`,
    output: { kind: 'literal', value: { type: 'char', value: 65 } },
  },
  {
    code: `'0'`,
    output: { kind: 'literal', value: { type: 'char', value: 48 } },
  },
  {
    code: `' '`,
    output: { kind: 'literal', value: { type: 'char', value: 32 } },
  },
  {
    code: `'ÿ'`,
    output: { kind: 'literal', value: { type: 'char', value: 255 } },
  },
  {
    code: `'\\n'`,
    output: { kind: 'literal', value: { type: 'char', value: 10 } },
  },
  {
    code: `'\\t'`,
    output: { kind: 'literal', value: { type: 'char', value: 9 } },
  },
  {
    code: `'\\b'`,
    output: { kind: 'literal', value: { type: 'char', value: 8 } },
  },
  {
    code: `'\\f'`,
    output: { kind: 'literal', value: { type: 'char', value: 12 } },
  },
  {
    code: `'\\r'`,
    output: { kind: 'literal', value: { type: 'char', value: 13 } },
  },
  {
    code: `'\\\\'`,
    output: { kind: 'literal', value: { type: 'char', value: 92 } },
  },
  {
    code: `'\\''`,
    output: { kind: 'literal', value: { type: 'char', value: 39 } },
  },
  {
    code: `'\\"'`,
    output: { kind: 'literal', value: { type: 'char', value: 34 } },
  },
  {
    code: `'\\101'`,
    output: { kind: 'literal', value: { type: 'char', value: 65 } },
  },
  {
    code: `'\\377'`,
    output: { kind: 'literal', value: { type: 'char', value: 255 } },
  },
  {
    code: `'\\0'`,
    output: { kind: 'literal', value: { type: 'char', value: 0 } },
  },
  {
    code: `'\\u0041'`,
    output: { kind: 'literal', value: { type: 'char', value: 65 } },
  },
  {
    code: `'\\u00df'`,
    output: { kind: 'literal', value: { type: 'char', value: 223 } },
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
    output: { kind: 'literal', value: { type: 'string', value: '' } },
  },
  {
    code: `"a"`,
    output: { kind: 'literal', value: { type: 'string', value: 'a' } },
  },
  {
    code: `"hello world"`,
    output: {
      kind: 'literal',
      value: { type: 'string', value: 'hello world' },
    },
  },
  {
    code: `"line1\\nline2"`,
    output: {
      kind: 'literal',
      value: { type: 'string', value: 'line1\nline2' },
    },
  },
  {
    code: `"tab\\there"`,
    output: {
      kind: 'literal',
      value: { type: 'string', value: 'tab\there' },
    },
  },
  {
    code: `"back\\bspace"`,
    output: {
      kind: 'literal',
      value: { type: 'string', value: 'back\bspace' },
    },
  },
  {
    code: `"form\\ffeed"`,
    output: {
      kind: 'literal',
      value: { type: 'string', value: 'form\ffeed' },
    },
  },
  {
    code: `"carriage\\rreturn"`,
    output: {
      kind: 'literal',
      value: { type: 'string', value: 'carriage\rreturn' },
    },
  },
  {
    code: `"\\\\"`,
    output: { kind: 'literal', value: { type: 'string', value: '\\' } },
  },
  {
    code: `"a\\"b"`,
    output: { kind: 'literal', value: { type: 'string', value: 'a"b' } },
  },
  {
    code: `"\\u0041\\u00df"`,
    output: {
      kind: 'literal',
      value: { type: 'string', value: 'Aß' },
    },
  },
  {
    code: `"\\uu0041"`,
    output: { kind: 'literal', value: { type: 'string', value: 'A' } },
  },
  {
    code: `"\\101"`,
    output: { kind: 'literal', value: { type: 'string', value: 'A' } },
  },
  {
    code: `"\\377"`,
    output: {
      kind: 'literal',
      value: { type: 'string', value: '\u00ff' },
    },
  },
  {
    code: `"\\45"`,
    output: { kind: 'literal', value: { type: 'string', value: '%' } },
  },
  {
    code: `"\\458"`,
    output: { kind: 'literal', value: { type: 'string', value: '%8' } },
  },
  {
    code: `"\\400"`,
    output: { kind: 'literal', value: { type: 'string', value: ' 0' } },
  },
  {
    code: `"\\777"`,
    output: { kind: 'literal', value: { type: 'string', value: '?7' } },
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
    output: { kind: 'literal', value: { type: 'int', value: 42 } },
  },
  {
    code: `\n\t 1.5 `,
    output: { kind: 'literal', value: { type: 'double', value: 1.5 } },
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
  {
    code: `abc`,
    isError: true,
  },
  // ------------------------- unary plus / minus -------------------------
  {
    code: `-1`,
    output: { kind: 'literal', value: { type: 'int', value: -1 } },
  },
  {
    code: `-42`,
    output: { kind: 'literal', value: { type: 'int', value: -42 } },
  },
  {
    code: `-0`,
    output: { kind: 'literal', value: { type: 'int', value: 0 } },
  },
  {
    code: `+42`,
    output: { kind: 'literal', value: { type: 'int', value: 42 } },
  },
  {
    code: `+0`,
    output: { kind: 'literal', value: { type: 'int', value: 0 } },
  },
  {
    code: `-2147483648`,
    output: { kind: 'literal', value: { type: 'int', value: -2147483648 } },
  },
  {
    code: `+2147483648`,
    isError: true,
  },
  {
    code: `-9223372036854775808L`,
    output: {
      kind: 'literal',
      value: { type: 'long', value: '-9223372036854775808' },
    },
  },
  {
    code: `+9223372036854775808L`,
    isError: true,
  },
  {
    code: `-1L`,
    output: { kind: 'literal', value: { type: 'long', value: '-1' } },
  },
  {
    code: `-0x80000000`,
    output: { kind: 'literal', value: { type: 'int', value: -2147483648 } },
  },
  {
    code: `-0xffffffff`,
    output: { kind: 'literal', value: { type: 'int', value: 1 } },
  },
  {
    code: `-1.5`,
    output: { kind: 'literal', value: { type: 'double', value: -1.5 } },
  },
  {
    code: `-1e3`,
    output: { kind: 'literal', value: { type: 'double', value: -1000 } },
  },
  {
    code: `-0x1p2`,
    output: { kind: 'literal', value: { type: 'double', value: -4 } },
  },
  {
    code: `+3.14f`,
    output: {
      kind: 'literal',
      value: { type: 'float', value: 3.140000104904175 },
    },
  },
  {
    code: `-0.0`,
    output: { kind: 'literal', value: { type: 'double', value: -0 } },
  },
  {
    code: `-0f`,
    output: { kind: 'literal', value: { type: 'float', value: -0 } },
  },
  {
    code: `-true`,
    isError: true,
  },
  {
    code: `+true`,
    isError: true,
  },
  {
    code: `-null`,
    isError: true,
  },
]
