import type { TestSuiteEntry } from '../../state/types'

export const boxedOperators: TestSuiteEntry[] = [
  // ==================== BOXED VALUES IN OPERATORS ====================
  // Wrappers are minted with the reference-typed ternary trick (`(cond ? <prim> : null)`)
  // or fed in through `env.local` with `boxed`. Every operator that demands a primitive
  // unboxes its wrapper operands first (JLS 5.1.8); these entries cover the operators the
  // other boxed suites do not: division/modulo, bitwise, shifts, the successful unary
  // forms, `>=`, mixed-width promotion, the Boolean wrapper's `& | ^ !`, and the illegal
  // wrapper/operator combinations.
  // ------------------------- division and modulo unbox -------------------------
  {
    code: `(true ? 7 : null) / 2`,
    output: { type: 'int', value: 3 },
  },
  {
    code: `(true ? -7 : null) / 2`,
    output: { type: 'int', value: -3 },
  },
  {
    code: `(true ? 7 : null) % 3`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `(true ? -7 : null) % 3`,
    output: { type: 'int', value: -1 },
  },
  {
    code: `(true ? 7L : null) / 2`,
    output: { type: 'long', value: '3' },
  },
  {
    code: `(true ? 7L : null) % 3`,
    output: { type: 'long', value: '1' },
  },
  {
    code: `(true ? 7 : null) / (true ? 2 : null)`,
    output: { type: 'int', value: 3 },
  },
  {
    code: `(true ? 7 : null) % (true ? 2 : null)`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `(true ? 1.5 : null) / (true ? 0.5 : null)`,
    output: { type: 'double', value: 3 },
  },
  {
    code: `(true ? 1.5f : null) / (true ? 0.5f : null)`,
    output: { type: 'float', value: 3 },
  },
  // Integral division by zero is an ArithmeticException at run time ...
  {
    code: `(true ? 7 : null) / 0`,
    error: 'runtime',
  },
  {
    code: `(true ? 7L : null) % 0L`,
    error: 'runtime',
  },
  // ... floating point division by zero does not throw: it yields Infinity / NaN.
  {
    code: `((true ? 7.0 : null) / 0) > 0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `((true ? -7.0 : null) / 0) < 0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `((true ? 0.0 : null) / 0) == ((true ? 0.0 : null) / 0)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `((true ? 0.0 : null) / 0) != ((true ? 0.0 : null) / 0)`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- bitwise & | ^ unbox -------------------------
  {
    code: `(true ? 6 : null) & 3`,
    output: { type: 'int', value: 2 },
  },
  {
    code: `(true ? 6 : null) | 3`,
    output: { type: 'int', value: 7 },
  },
  {
    code: `(true ? 6 : null) ^ 3`,
    output: { type: 'int', value: 5 },
  },
  {
    code: `(true ? 6 : null) & (true ? 3 : null)`,
    output: { type: 'int', value: 2 },
  },
  {
    code: `(true ? 6L : null) & (true ? 3 : null)`,
    output: { type: 'long', value: '2' },
  },
  {
    code: `(true ? 1L : null) | 2`,
    output: { type: 'long', value: '3' },
  },
  {
    code: `(true ? 1L : null) ^ 3`,
    output: { type: 'long', value: '2' },
  },
  {
    code: `(true ? -1 : null) & 0xFF`,
    output: { type: 'int', value: 255 },
  },
  {
    code: `(true ? -1 : null) | 0`,
    output: { type: 'int', value: -1 },
  },
  {
    code: `(true ? -1 : null) ^ -1`,
    output: { type: 'int', value: 0 },
  },
  {
    code: `(true ? -2147483648 : null) & -1`,
    output: { type: 'int', value: -2147483648 },
  },
  // Sign extension of a small wrapper before the bitwise op.
  {
    code: `(true ? (byte)-1 : null) & 0xFF`,
    output: { type: 'int', value: 255 },
  },
  {
    code: `(true ? (short)-1 : null) & 0xFFFF`,
    output: { type: 'int', value: 65535 },
  },
  // Zero extension of a char wrapper.
  {
    code: `(true ? (char)65535 : null) & 0xFF`,
    output: { type: 'int', value: 255 },
  },
  {
    code: `(true ? (byte)127 : null) & 128`,
    output: { type: 'int', value: 0 },
  },
  // ------------------------- shifts unbox -------------------------
  {
    code: `(true ? 1 : null) << 3`,
    output: { type: 'int', value: 8 },
  },
  {
    code: `(true ? 16 : null) >> 2`,
    output: { type: 'int', value: 4 },
  },
  {
    code: `(true ? -16 : null) >> 2`,
    output: { type: 'int', value: -4 },
  },
  {
    code: `(true ? -16 : null) >>> 2`,
    output: { type: 'int', value: 1073741820 },
  },
  {
    code: `(true ? -1 : null) >>> 28`,
    output: { type: 'int', value: 15 },
  },
  {
    code: `(true ? 1L : null) << 2`,
    output: { type: 'long', value: '4' },
  },
  {
    code: `(true ? -1L : null) >>> 1`,
    output: { type: 'long', value: '9223372036854775807' },
  },
  // The shift distance is unboxed and masked too.
  {
    code: `1 << (true ? 33 : null)`,
    output: { type: 'int', value: 2 },
  },
  {
    code: `(true ? 1 : null) << (true ? 2 : null)`,
    output: { type: 'int', value: 4 },
  },
  {
    code: `(true ? 1L : null) << (true ? 65 : null)`,
    output: { type: 'long', value: '2' },
  },
  // Small wrappers are sign/zero-extended to int before the shift.
  {
    code: `(true ? (byte)-1 : null) >>> 1`,
    output: { type: 'int', value: 2147483647 },
  },
  {
    code: `(true ? (char)65535 : null) >> 1`,
    output: { type: 'int', value: 32767 },
  },
  // ------------------------- successful unary + - ~ -------------------------
  {
    code: `+(true ? 5 : null)`,
    output: { type: 'int', value: 5 },
  },
  {
    code: `+(true ? (byte)5 : null)`,
    output: { type: 'int', value: 5 },
  },
  {
    code: `+(true ? (short)5 : null)`,
    output: { type: 'int', value: 5 },
  },
  {
    code: `+(true ? (char)65 : null)`,
    output: { type: 'int', value: 65 },
  },
  {
    code: `+(true ? 5L : null)`,
    output: { type: 'long', value: '5' },
  },
  {
    code: `+(true ? 1.5 : null)`,
    output: { type: 'double', value: 1.5 },
  },
  {
    code: `+(true ? 1.5f : null)`,
    output: { type: 'float', value: 1.5 },
  },
  {
    code: `-(true ? (byte)5 : null)`,
    output: { type: 'int', value: -5 },
  },
  {
    code: `-(true ? (short)5 : null)`,
    output: { type: 'int', value: -5 },
  },
  {
    code: `-(true ? (char)65 : null)`,
    output: { type: 'int', value: -65 },
  },
  {
    code: `-(true ? 5L : null)`,
    output: { type: 'long', value: '-5' },
  },
  {
    code: `-(true ? 1.5 : null)`,
    output: { type: 'double', value: -1.5 },
  },
  {
    code: `-(true ? 1.5f : null)`,
    output: { type: 'float', value: -1.5 },
  },
  {
    code: `~(true ? (byte)5 : null)`,
    output: { type: 'int', value: -6 },
  },
  {
    code: `~(true ? (short)5 : null)`,
    output: { type: 'int', value: -6 },
  },
  {
    code: `~(true ? (char)65 : null)`,
    output: { type: 'int', value: -66 },
  },
  {
    code: `~(true ? 5 : null)`,
    output: { type: 'int', value: -6 },
  },
  // ------------------------- relational >= and mixed widths -------------------------
  {
    code: `(true ? 100 : null) >= 100`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? 100 : null) >= 101`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? 1000L : null) >= (true ? 1000 : null)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? 1.5 : null) >= (true ? 1.5f : null)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? (char)65535 : null) >= (true ? (short)-1 : null)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? (short)-1 : null) >= (true ? (char)65535 : null)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? (byte)-1 : null) < (true ? (char)0 : null)`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- mixed-width arithmetic promotion -------------------------
  {
    code: `(true ? 1.5f : null) + (true ? 1 : null)`,
    output: { type: 'float', value: 2.5 },
  },
  {
    code: `(true ? 1.5 : null) + (true ? 1.5f : null)`,
    output: { type: 'double', value: 3 },
  },
  {
    code: `(true ? (char)65 : null) + (true ? 1 : null)`,
    output: { type: 'int', value: 66 },
  },
  {
    code: `(true ? (short)300 : null) + (true ? 1 : null)`,
    output: { type: 'int', value: 301 },
  },
  {
    code: `(true ? (byte)100 : null) + (true ? 1L : null)`,
    output: { type: 'long', value: '101' },
  },
  {
    code: `(true ? (char)65 : null) + (true ? 1.5 : null)`,
    output: { type: 'double', value: 66.5 },
  },
  {
    code: `(true ? (short)-1 : null) * (true ? 2L : null)`,
    output: { type: 'long', value: '-2' },
  },
  {
    code: `(true ? 1.5f : null) * (true ? 2 : null)`,
    output: { type: 'float', value: 3 },
  },
  {
    code: `(true ? (byte)100 : null) - (true ? (char)1 : null)`,
    output: { type: 'int', value: 99 },
  },
  // ------------------------- Boolean wrapper: & | ^ ! -------------------------
  {
    code: `(true ? true : null) & (true ? false : null)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? true : null) & (true ? true : null)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? true : null) | (true ? false : null)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? false : null) | (true ? true : null)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? true : null) ^ (true ? false : null)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? true : null) ^ (true ? true : null)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `!(true ? true : null)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `!(true ? false : null)`,
    output: { type: 'boolean', value: true },
  },
  // Unlike && / ||, the boolean bitwise operators do not short-circuit, so a null arm is
  // unboxed and throws -- even when the other operand already determines the result.
  {
    code: `(false ? true : null) & true`,
    error: 'runtime',
  },
  {
    code: `(false ? true : null) | (true ? true : null)`,
    error: 'runtime',
  },
  {
    code: `(false ? true : null) ^ true`,
    error: 'runtime',
  },
  {
    code: `(true ? true : null) & (false ? true : null)`,
    error: 'runtime',
  },
  // && / || *do* short-circuit, so the null on the unevaluated side is never unboxed.
  {
    code: `(true ? false : null) && (false ? true : null)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? true : null) || (false ? true : null)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? true : null) && (true ? true : null)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? false : null) || (true ? false : null)`,
    output: { type: 'boolean', value: false },
  },
  // Boolean wrapper locals through the bitwise boolean operators.
  {
    code: `a & b`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'boolean', value: true, boxed: true },
        b: { type: 'boolean', value: false, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `a | b`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'boolean', value: true, boxed: true },
        b: { type: 'boolean', value: false, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `a ^ b`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'boolean', value: true, boxed: true },
        b: { type: 'boolean', value: false, boxed: true },
      },
      heap: {},
    },
  },
  // ------------------------- illegal wrapper/operator combinations -------------------------
  {
    code: `(true ? 100 : false) & 1`,
    error: 'compile',
  },
  {
    code: `(true ? true : null) & 1`,
    error: 'compile',
  },
  {
    code: `(true ? 100 : null) & (true ? true : null)`,
    error: 'compile',
  },
  {
    code: `(true ? 100 : null) + (true ? true : null)`,
    error: 'compile',
  },
  {
    code: `(true ? 100 : null) >= (true ? true : null)`,
    error: 'compile',
  },
  {
    code: `~(true ? true : null)`,
    error: 'compile',
  },
  {
    code: `!(true ? 100 : null)`,
    error: 'compile',
  },
  {
    code: `-(true ? true : null)`,
    error: 'compile',
  },
  {
    code: `a == a == a`,
    error: 'compile',
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  // ------------------------- precedence around boxed conditionals -------------------------
  // == binds tighter than ?:, so the comparison is the condition.
  {
    code: `(true ? 100 : null) == 100 ? 1 : 2`,
    output: { type: 'int', value: 1 },
  },
  // ... and the null literal is compared against the int, which is a compile error.
  {
    code: `true ? 100 : null == 100`,
    error: 'compile',
  },
  // A wrapper-typed or lub-typed conditional is not a boolean condition.
  {
    code: `(true ? 100 : null) ? 1 : 2`,
    error: 'compile',
  },
  {
    code: `(true ? 100 : false) ? 1 : 2`,
    error: 'compile',
  },
  // ------------------------- NaN / Infinity boxing -------------------------
  // valueOf() never caches floating point, so two boxed NaNs/Infinities are distinct.
  {
    code: `(true ? 0.0/0 : null) == (true ? 0.0/0 : null)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? 1.0/0 : null) == (true ? 1.0/0 : null)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? 0.0f/0 : null) == (true ? 0.0f/0 : null)`,
    output: { type: 'boolean', value: false },
  },
  // Unboxing them back gives the ordinary floating point comparison.
  {
    code: `(true ? 0.0/0 : null) == 0.0/0`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `((true ? 1.0/0 : null) / 1) > 0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? -1.0/0 : null) < 0`,
    output: { type: 'boolean', value: true },
  },
]
