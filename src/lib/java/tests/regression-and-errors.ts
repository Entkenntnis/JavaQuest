import type { TestSuiteEntry } from '../../state/types'

export const regressionAndErrors: TestSuiteEntry[] = [
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
  // A double exactly equal to 2^63 saturates to Long.MAX (JLS 5.1.3); 2^63 is exactly
  // representable, so the upper clamp must be inclusive (>= 2^63).
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
    error: 'runtime',
  },
  {
    code: `10L / (5L - 5L)`,
    error: 'runtime',
  },
  {
    code: `1 / (int)0.5`,
    error: 'runtime',
  },
  {
    code: `100L % (1L - 1L)`,
    error: 'runtime',
  },
  // ------------------------- typecheck guards: compile-time type errors -------------------------
  {
    code: `1 + true`,
    error: 'compile',
  },
  {
    code: `'a' && true`,
    error: 'compile',
  },
  {
    code: `!1.5`,
    error: 'compile',
  },
  {
    code: `(boolean)null`,
    error: 'compile',
  },
  {
    code: `null + 1`,
    error: 'compile',
  },
  {
    code: `1 == "1"`,
    error: 'compile',
  },
  // ==================== UNBOUND & ERROR CASES ====================
  // ------------------------- identifiers: unbound & keyword error cases -------------------------
  {
    code: `definitelyNotThere`,
    error: 'compile',
  },
  {
    code: `if`,
    error: 'compile',
  },
  {
    code: `int`,
    error: 'compile',
  },
  {
    code: `boolean`,
    error: 'compile',
  },
  {
    code: `this`,
    error: 'compile',
  },
  {
    code: `super`,
    error: 'compile',
  },
]
