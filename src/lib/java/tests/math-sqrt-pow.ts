import type { TestSuiteEntry } from '../../state/types'

export const mathSqrtPow: TestSuiteEntry[] = [
  // ==================== MATH.SQRT / MATH.POW ====================
  // Java exposes only the double overloads sqrt(double) and pow(double, double); the
  // integral/float arguments below widen to double. The interpreter does not implement
  // these methods yet, so this file is currently red in the Suite while remaining the
  // source of truth for Java semantics (validated by the cross-check harness).
  //
  // Harness limitations to respect: NaN/Infinity and the sign of zero cannot be a direct
  // result, so the special cases are wrapped in comparisons and string concatenation.
  // ------------------------- sqrt(double): exact results -------------------------
  {
    code: `Math.sqrt(4.0)`,
    output: { type: 'double', value: 2 },
  },
  {
    code: `Math.sqrt(9.0)`,
    output: { type: 'double', value: 3 },
  },
  {
    code: `Math.sqrt(0.25)`,
    output: { type: 'double', value: 0.5 },
  },
  {
    code: `Math.sqrt(2.25)`,
    output: { type: 'double', value: 1.5 },
  },
  {
    code: `Math.sqrt(1.0)`,
    output: { type: 'double', value: 1 },
  },
  {
    code: `Math.sqrt(0.0)`,
    output: { type: 'double', value: 0 },
  },
  // 1.0E10 is exactly representable, so its root is exact.
  {
    code: `Math.sqrt(1.0E10)`,
    output: { type: 'double', value: 100000 },
  },
  // Non-perfect squares: both Java and JS use a correctly rounded root.
  {
    code: `Math.sqrt(2.0)`,
    output: { type: 'double', value: 1.4142135623730951 },
  },
  {
    code: `Math.sqrt(3.0)`,
    output: { type: 'double', value: 1.7320508075688772 },
  },
  // ------------------------- sqrt: widening of int/long/float/small types -------------------------
  {
    code: `Math.sqrt(16)`,
    output: { type: 'double', value: 4 },
  },
  {
    code: `Math.sqrt(4L)`,
    output: { type: 'double', value: 2 },
  },
  {
    code: `Math.sqrt(4.0f)`,
    output: { type: 'double', value: 2 },
  },
  {
    code: `Math.sqrt((byte) 4)`,
    output: { type: 'double', value: 2 },
  },
  {
    code: `Math.sqrt((short) 9)`,
    output: { type: 'double', value: 3 },
  },
  {
    code: `Math.sqrt((char) 16)`,
    output: { type: 'double', value: 4 },
  },
  // ------------------------- sqrt: result in casts, arithmetic & concatenation -------------------------
  {
    code: `(int) Math.sqrt(9.0)`,
    output: { type: 'int', value: 3 },
  },
  {
    code: `(long) Math.sqrt(16.0)`,
    output: { type: 'long', value: '4' },
  },
  {
    code: `Math.sqrt(4.0) + 1.0`,
    output: { type: 'double', value: 3 },
  },
  {
    code: `Math.sqrt(4.0) * 2.0`,
    output: { type: 'double', value: 4 },
  },
  {
    code: `Math.sqrt(4.0) == 2.0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `Math.sqrt(4.0) > 1.0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"" + Math.sqrt(4.0)`,
    output: { type: '__str', value: '2.0' },
  },
  // ------------------------- sqrt: special cases (wrapped) -------------------------
  {
    code: `Math.sqrt(-1.0) != Math.sqrt(-1.0)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `Math.sqrt(-4.0) != Math.sqrt(-4.0)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `Math.sqrt(1.0 / 0.0) == 1.0 / 0.0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `Math.sqrt(-1.0 / 0.0) != Math.sqrt(-1.0 / 0.0)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `Math.sqrt(0.0 / 0.0) != Math.sqrt(0.0 / 0.0)`,
    output: { type: 'boolean', value: true },
  },
  // sqrt(+0.0) = +0.0, sqrt(-0.0) = -0.0.
  {
    code: `1.0 / Math.sqrt(0.0) == 1.0 / 0.0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `1.0 / Math.sqrt(-0.0) == -1.0 / 0.0`,
    output: { type: 'boolean', value: true },
  },
  // Combining sqrt with abs.
  {
    code: `Math.abs(Math.sqrt(4.0) - 2.0)`,
    output: { type: 'double', value: 0 },
  },
  {
    code: `Math.sqrt(Math.pow(2.0, 2.0))`,
    output: { type: 'double', value: 2 },
  },
  // ------------------------- pow(double, double): exact results -------------------------
  {
    code: `Math.pow(2.0, 10.0)`,
    output: { type: 'double', value: 1024 },
  },
  {
    code: `Math.pow(2.0, 0.0)`,
    output: { type: 'double', value: 1 },
  },
  {
    code: `Math.pow(0.0, 0.0)`,
    output: { type: 'double', value: 1 },
  },
  {
    code: `Math.pow(2.0, 1.0)`,
    output: { type: 'double', value: 2 },
  },
  {
    code: `Math.pow(2.0, -1.0)`,
    output: { type: 'double', value: 0.5 },
  },
  {
    code: `Math.pow(3.0, 3.0)`,
    output: { type: 'double', value: 27 },
  },
  {
    code: `Math.pow(10.0, 2.0)`,
    output: { type: 'double', value: 100 },
  },
  {
    code: `Math.pow(10.0, -2.0)`,
    output: { type: 'double', value: 0.01 },
  },
  {
    code: `Math.pow(2.0, 3.0)`,
    output: { type: 'double', value: 8 },
  },
  // A negative base with an integral exponent keeps the sign for odd exponents.
  {
    code: `Math.pow(-2.0, 3.0)`,
    output: { type: 'double', value: -8 },
  },
  {
    code: `Math.pow(-2.0, 2.0)`,
    output: { type: 'double', value: 4 },
  },
  {
    code: `Math.pow(4.0, 0.5)`,
    output: { type: 'double', value: 2 },
  },
  {
    code: `Math.pow(9.0, 0.5)`,
    output: { type: 'double', value: 3 },
  },
  // ------------------------- pow: widening of int/long/float/small types -------------------------
  {
    code: `Math.pow(2, 10)`,
    output: { type: 'double', value: 1024 },
  },
  {
    code: `Math.pow(2L, 3L)`,
    output: { type: 'double', value: 8 },
  },
  {
    code: `Math.pow(2.0f, 3.0f)`,
    output: { type: 'double', value: 8 },
  },
  {
    code: `Math.pow((byte) 2, (short) 3)`,
    output: { type: 'double', value: 8 },
  },
  // ------------------------- pow: result in casts, arithmetic & concatenation -------------------------
  {
    code: `(int) Math.pow(2.0, 10.0)`,
    output: { type: 'int', value: 1024 },
  },
  {
    code: `(long) Math.pow(2.0, 3.0)`,
    output: { type: 'long', value: '8' },
  },
  {
    code: `Math.pow(2.0, 10.0) == 1024.0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `Math.pow(2.0, 10.0) > 1000.0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `"" + Math.pow(2.0, 10.0)`,
    output: { type: '__str', value: '1024.0' },
  },
  // pow and sqrt agree on the square root for exactly representable results.
  {
    code: `Math.pow(2.0, 0.5) == Math.sqrt(2.0)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `Math.abs(Math.pow(2.0, 3.0) - 8.0)`,
    output: { type: 'double', value: 0 },
  },
  // ------------------------- pow: special cases (wrapped) -------------------------
  // A zero exponent wins even for a NaN base.
  {
    code: `Math.pow(0.0 / 0.0, 0.0)`,
    output: { type: 'double', value: 1 },
  },
  {
    code: `Math.pow(1.0, 1.0)`,
    output: { type: 'double', value: 1 },
  },
  {
    code: `Math.pow(0.0, 1.0)`,
    output: { type: 'double', value: 0 },
  },
  {
    code: `Math.pow(0.0, 2.0)`,
    output: { type: 'double', value: 0 },
  },
  // NaN exponent, and |base|==1 with an infinite exponent, both give NaN.
  {
    code: `Math.pow(1.0, 0.0 / 0.0) != Math.pow(1.0, 0.0 / 0.0)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `Math.pow(1.0, 1.0 / 0.0) != Math.pow(1.0, 1.0 / 0.0)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `Math.pow(1.0, -1.0 / 0.0) != Math.pow(1.0, -1.0 / 0.0)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `Math.pow(0.0 / 0.0, 1.0) != Math.pow(0.0 / 0.0, 1.0)`,
    output: { type: 'boolean', value: true },
  },
  // A negative finite base with a non-integral exponent gives NaN.
  {
    code: `Math.pow(-2.0, 0.5) != Math.pow(-2.0, 0.5)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `Math.pow(-2.0, 2.5) != Math.pow(-2.0, 2.5)`,
    output: { type: 'boolean', value: true },
  },
  // Infinite exponents on a base with |base| != 1.
  {
    code: `Math.pow(2.0, 1.0 / 0.0) == 1.0 / 0.0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `Math.pow(0.5, 1.0 / 0.0)`,
    output: { type: 'double', value: 0 },
  },
  {
    code: `Math.pow(2.0, -1.0 / 0.0)`,
    output: { type: 'double', value: 0 },
  },
  {
    code: `Math.pow(0.5, -1.0 / 0.0) == 1.0 / 0.0`,
    output: { type: 'boolean', value: true },
  },
  // Zero base and negative exponent.
  {
    code: `Math.pow(0.0, -1.0) == 1.0 / 0.0`,
    output: { type: 'boolean', value: true },
  },
  // Signed zero base: odd/even positive exponent, and negative exponents.
  {
    code: `1.0 / Math.pow(-0.0, 3.0) == -1.0 / 0.0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `1.0 / Math.pow(-0.0, 2.0) == 1.0 / 0.0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `Math.pow(-0.0, -3.0) == -1.0 / 0.0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `Math.pow(-0.0, -2.0) == 1.0 / 0.0`,
    output: { type: 'boolean', value: true },
  },
  // Overflow / underflow of the result.
  {
    code: `Math.pow(2.0, 1024.0) == 1.0 / 0.0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `Math.pow(2.0, -1074.0) > 0.0`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `Math.pow(0.5, 1075.0)`,
    output: { type: 'double', value: 0 },
  },
  // ------------------------- error phases -------------------------
  {
    code: `Math.sqrt()`,
    error: 'compile',
  },
  {
    code: `Math.sqrt(1.0, 2.0)`,
    error: 'compile',
  },
  {
    code: `Math.sqrt(true)`,
    error: 'compile',
  },
  {
    code: `Math.sqrt("x")`,
    error: 'compile',
  },
  {
    code: `Math.sqrt(null)`,
    error: 'compile',
  },
  {
    code: `Math.pow(2.0)`,
    error: 'compile',
  },
  {
    code: `Math.pow(2.0, 3.0, 4.0)`,
    error: 'compile',
  },
  {
    code: `Math.pow(true, false)`,
    error: 'compile',
  },
  {
    code: `Math.pow(null, null)`,
    error: 'compile',
  },
]
