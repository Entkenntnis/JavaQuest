import type { TestSuiteEntry } from '../../state/types'

export const mathAbs: TestSuiteEntry[] = [
  // ==================== MATH.ABS ====================
  // java.lang.Math exposes four abs overloads: abs(int), abs(long), abs(float) and
  // abs(double). The interpreter currently implements only abs(int), so the long/float/
  // double sections below intentionally pin Java behaviour and will stay red until those
  // overloads exist. The int section guards the implemented core, including the
  // Integer.MIN_VALUE overflow (abs(MIN) == MIN, because +2147483648 is not representable).
  // ------------------------- abs(int): basic values -------------------------
  {
    code: `Math.abs(5)`,
    output: { type: 'int', value: 5 },
  },
  {
    code: `Math.abs(-5)`,
    output: { type: 'int', value: 5 },
  },
  {
    code: `Math.abs(0)`,
    output: { type: 'int', value: 0 },
  },
  {
    code: `Math.abs(-0)`,
    output: { type: 'int', value: 0 },
  },
  {
    code: `Math.abs(1)`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `Math.abs(-1)`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `Math.abs(1 + 2)`,
    output: { type: 'int', value: 3 },
  },
  {
    code: `Math.abs(-1 - 2)`,
    output: { type: 'int', value: 3 },
  },
  {
    code: `Math.abs(2 * 3 - 10)`,
    output: { type: 'int', value: 4 },
  },

  // ------------------------- abs(int): boundary & overflow -------------------------
  // abs(Integer.MIN_VALUE) overflows back to MIN_VALUE: it is the one int whose
  // magnitude has no positive counterpart.
  {
    code: `Math.abs(2147483647)`,
    output: { type: 'int', value: 2147483647 },
  },
  {
    code: `Math.abs(-2147483647)`,
    output: { type: 'int', value: 2147483647 },
  },
  {
    code: `Math.abs(-2147483648)`,
    output: { type: 'int', value: -2147483648 },
  },
  {
    code: `Math.abs(0x7fffffff)`,
    output: { type: 'int', value: 2147483647 },
  },
  {
    code: `Math.abs(0x80000000)`,
    output: { type: 'int', value: -2147483648 },
  },
  {
    code: `Math.abs(2147483647) + 1`,
    output: { type: 'int', value: -2147483648 },
  },

  // ------------------------- abs(int): small integral types widen to int -------------------------
  // byte, short and char have no abs overload; they widen to int first.
  {
    code: `Math.abs((byte) -128)`,
    output: { type: 'int', value: 128 },
  },
  {
    code: `Math.abs((byte) 127)`,
    output: { type: 'int', value: 127 },
  },
  {
    code: `Math.abs((short) -32768)`,
    output: { type: 'int', value: 32768 },
  },
  {
    code: `Math.abs((short) 32767)`,
    output: { type: 'int', value: 32767 },
  },
  {
    code: `Math.abs((char) 0xFFFF)`,
    output: { type: 'int', value: 65535 },
  },
  {
    code: `Math.abs((char) 0)`,
    output: { type: 'int', value: 0 },
  },
  {
    code: `Math.abs('a')`,
    output: { type: 'int', value: 97 },
  },
  {
    code: `Math.abs('a' - 'z')`,
    output: { type: 'int', value: 25 },
  },

  // ------------------------- abs(int): nesting & use inside larger expressions -------------------------
  {
    code: `Math.abs(Math.abs(-7))`,
    output: { type: 'int', value: 7 },
  },
  {
    code: `Math.abs(-Math.abs(-5))`,
    output: { type: 'int', value: 5 },
  },
  {
    code: `Math.abs(Math.abs(-5) + Math.abs(-3))`,
    output: { type: 'int', value: 8 },
  },
  {
    code: `Math.abs(-5) + Math.abs(-3)`,
    output: { type: 'int', value: 8 },
  },
  {
    code: `Math.abs(-5) - Math.abs(3)`,
    output: { type: 'int', value: 2 },
  },
  {
    code: `Math.abs(-5) * 2`,
    output: { type: 'int', value: 10 },
  },
  {
    code: `Math.abs(-5) / 2`,
    output: { type: 'int', value: 2 },
  },
  {
    code: `Math.abs(-5) % 3`,
    output: { type: 'int', value: 2 },
  },
  {
    code: `-Math.abs(-5)`,
    output: { type: 'int', value: -5 },
  },
  {
    code: `Math.abs(-5) > 0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `Math.abs(-5) == 5`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `Math.abs(-5) != 5`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `Math.abs(-5) == Math.abs(-5)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `true ? Math.abs(-5) : Math.abs(-3)`,
    output: { type: 'int', value: 5 },
  },
  {
    code: `false ? Math.abs(-5) : Math.abs(-3)`,
    output: { type: 'int', value: 3 },
  },

  // ------------------------- abs(int): mixing with wider numeric operands -------------------------
  {
    code: `Math.abs(-5) + 1L`,
    output: { type: 'long', value: '6' },
  },
  {
    code: `Math.abs(-5) + 1.5`,
    output: { type: 'double', value: 6.5 },
  },
  {
    code: `Math.abs(-5) + 1.5f`,
    output: { type: 'float', value: 6.5 },
  },
  {
    code: `Math.abs(-5) / 2.0`,
    output: { type: 'double', value: 2.5 },
  },
  {
    code: `Math.abs(2) + 0.5`,
    output: { type: 'double', value: 2.5 },
  },

  // ------------------------- abs(int): arguments read from the environment -------------------------
  // A boxed int local is unboxed to int and matches abs(int).
  {
    code: `Math.abs(x)`,
    env: {
      local: { x: { type: 'int', value: -5, boxed: true } },
      heap: {},
    },
    output: { type: 'int', value: 5 },
  },
  {
    code: `Math.abs(x)`,
    env: {
      local: { x: { type: 'int', value: -5 } },
      heap: {},
    },
    output: { type: 'int', value: 5 },
  },
  {
    code: `Math.abs(x)`,
    env: {
      local: { x: { type: 'int', value: -2147483648 } },
      heap: {},
    },
    output: { type: 'int', value: -2147483648 },
  },
  {
    code: `Math.abs(x)`,
    env: {
      local: { x: { type: 'byte', value: -5 } },
      heap: {},
    },
    output: { type: 'int', value: 5 },
  },
  {
    code: `Math.abs(x)`,
    env: {
      local: { x: { type: 'short', value: -5 } },
      heap: {},
    },
    output: { type: 'int', value: 5 },
  },
  {
    code: `Math.abs(x)`,
    env: {
      local: { x: { type: 'char', value: 65 } },
      heap: {},
    },
    output: { type: 'int', value: 65 },
  },
  {
    code: `Math.abs(x + y)`,
    env: {
      local: {
        x: { type: 'int', value: -3 },
        y: { type: 'int', value: 8 },
      },
      heap: {},
    },
    output: { type: 'int', value: 5 },
  },

  // ------------------------- abs(long): Java returns long (not implemented yet) -------------------------
  {
    code: `Math.abs(-5L)`,
    output: { type: 'long', value: '5' },
  },
  {
    code: `Math.abs(5L)`,
    output: { type: 'long', value: '5' },
  },
  {
    code: `Math.abs(0L)`,
    output: { type: 'long', value: '0' },
  },
  {
    code: `Math.abs(9223372036854775807L)`,
    output: { type: 'long', value: '9223372036854775807' },
  },
  // abs(Long.MIN_VALUE) overflows back to Long.MIN_VALUE, same as the int case.
  {
    code: `Math.abs(-9223372036854775808L)`,
    output: { type: 'long', value: '-9223372036854775808' },
  },
  {
    code: `Math.abs(-5L) + 1L`,
    output: { type: 'long', value: '6' },
  },
  {
    code: `Math.abs(x)`,
    env: {
      local: { x: { type: 'long', value: '-5' } },
      heap: {},
    },
    output: { type: 'long', value: '5' },
  },
  {
    code: `Math.abs(x)`,
    env: {
      local: { x: { type: 'long', value: '-5', boxed: true } },
      heap: {},
    },
    output: { type: 'long', value: '5' },
  },

  // ------------------------- abs(float): Java returns float (not implemented yet) -------------------------
  {
    code: `Math.abs(-5.5f)`,
    output: { type: 'float', value: 5.5 },
  },
  {
    code: `Math.abs(5.5f)`,
    output: { type: 'float', value: 5.5 },
  },
  {
    code: `Math.abs(-1.5f)`,
    output: { type: 'float', value: 1.5 },
  },
  // abs(-0.0f) is +0.0f; the sign bit is cleared, but the numeric value prints as 0.
  {
    code: `Math.abs(-0.0f)`,
    output: { type: 'float', value: 0 },
  },
  {
    code: `Math.abs(-5.5f) + 1f`,
    output: { type: 'float', value: 6.5 },
  },

  // ------------------------- abs(double): Java returns double (not implemented yet) -------------------------
  {
    code: `Math.abs(-5.5)`,
    output: { type: 'double', value: 5.5 },
  },
  {
    code: `Math.abs(5.5)`,
    output: { type: 'double', value: 5.5 },
  },
  {
    code: `Math.abs(-0.0)`,
    output: { type: 'double', value: 0 },
  },
  {
    code: `Math.abs(1.0 / -4.0)`,
    output: { type: 'double', value: 0.25 },
  },
  {
    code: `Math.abs(-5.5) + 1.5`,
    output: { type: 'double', value: 7 },
  },
  // abs(-Infinity) is +Infinity; abs(NaN) stays NaN, so NaN != NaN.
  {
    code: `Math.abs(-1.0 / 0.0) == 1.0 / 0.0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `Math.abs(0.0 / 0.0) != Math.abs(0.0 / 0.0)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `Math.abs(x)`,
    env: {
      local: { x: { type: 'double', value: -5.5 } },
      heap: {},
    },
    output: { type: 'double', value: 5.5 },
  },
  {
    code: `Math.abs(x)`,
    env: {
      local: { x: { type: 'float', value: -5.5 } },
      heap: {},
    },
    output: { type: 'float', value: 5.5 },
  },

  // ------------------------- error phases: no matching overload / bad arguments -------------------------
  // Wrong arity.
  {
    code: `Math.abs()`,
    error: 'compile',
  },
  {
    code: `Math.abs(1, 2)`,
    error: 'compile',
  },
  {
    code: `Math.abs(-5, -3)`,
    error: 'compile',
  },
  // Non-numeric argument types: there is no abs(char)/abs(boolean)/abs(String) overload.
  {
    code: `Math.abs(true)`,
    error: 'compile',
  },
  {
    code: `Math.abs(false)`,
    error: 'compile',
  },
  {
    code: `Math.abs("x")`,
    error: 'compile',
  },
  // null matches no primitive overload.
  {
    code: `Math.abs(null)`,
    error: 'compile',
  },
  // A Boolean wrapper unboxes to boolean, for which there is no overload.
  {
    code: `Math.abs(b)`,
    env: {
      local: { b: { type: 'boolean', value: true, boxed: true } },
      heap: {},
    },
    error: 'compile',
  },
  // The result of abs(int) is a primitive and cannot be dereferenced.
  {
    code: `Math.abs(-5).equals(5)`,
    error: 'compile',
  },
]
