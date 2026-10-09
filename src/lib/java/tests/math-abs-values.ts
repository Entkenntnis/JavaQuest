import type { TestSuiteEntry } from '../../state/types'

export const mathAbsValues: TestSuiteEntry[] = [
  // ==================== MATH.ABS: LITERALS, TYPES & CONVERSIONS ====================
  // Companion to math-abs.ts. Everything here is expressed so the expected result is
  // real Java behaviour (verified by the cross-check harness); it stresses the four
  // overloads through radix literals, suffixes, small/widening types, and casts on both
  // the argument and the result.
  // ------------------------- abs(int): radix & signed literals -------------------------
  {
    code: `Math.abs(-0x10)`,
    output: { type: 'int', value: 16 },
  },
  {
    code: `Math.abs(-010)`,
    output: { type: 'int', value: 8 },
  },
  {
    code: `Math.abs(-0b101)`,
    output: { type: 'int', value: 5 },
  },
  // 0xFFFFFFFF is the int -1; abs(-1) is 1.
  {
    code: `Math.abs(0xFFFFFFFF)`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `Math.abs(0x7FFFFFFF)`,
    output: { type: 'int', value: 2147483647 },
  },
  // Unary minus on Integer.MIN_VALUE is still MIN_VALUE; abs keeps it.
  {
    code: `Math.abs(-0x80000000)`,
    output: { type: 'int', value: -2147483648 },
  },
  // ------------------------- abs(int): unary composition -------------------------
  {
    code: `Math.abs(+5)`,
    output: { type: 'int', value: 5 },
  },
  {
    code: `Math.abs(-(+5))`,
    output: { type: 'int', value: 5 },
  },
  {
    code: `Math.abs(+(-5))`,
    output: { type: 'int', value: 5 },
  },
  {
    code: `Math.abs(~0)`,
    output: { type: 'int', value: 1 },
  },
  {
    code: `Math.abs(~5)`,
    output: { type: 'int', value: 6 },
  },
  {
    code: `Math.abs(~-1)`,
    output: { type: 'int', value: 0 },
  },
  // ------------------------- abs(long): values, radix & overflow -------------------------
  {
    code: `Math.abs(-1L)`,
    output: { type: 'long', value: '1' },
  },
  {
    code: `Math.abs(-9223372036854775807L)`,
    output: { type: 'long', value: '9223372036854775807' },
  },
  {
    code: `Math.abs(-0x10L)`,
    output: { type: 'long', value: '16' },
  },
  // 0xFFFF...FF is the long -1.
  {
    code: `Math.abs(0xFFFFFFFFFFFFFFFFL)`,
    output: { type: 'long', value: '1' },
  },
  {
    code: `Math.abs(-0x8000000000000000L)`,
    output: { type: 'long', value: '-9223372036854775808' },
  },
  {
    code: `Math.abs(-1L) + 1`,
    output: { type: 'long', value: '2' },
  },
  {
    code: `Math.abs(-5L) * 2L`,
    output: { type: 'long', value: '10' },
  },
  {
    code: `Math.abs(-5L) / 2`,
    output: { type: 'long', value: '2' },
  },
  {
    code: `Math.abs(-5L) % 3`,
    output: { type: 'long', value: '2' },
  },
  // abs(Long.MAX) + 1 wraps back to Long.MIN.
  {
    code: `Math.abs(-9223372036854775807L) + 1L`,
    output: { type: 'long', value: '-9223372036854775808' },
  },
  // ------------------------- abs(float): exact float values -------------------------
  {
    code: `Math.abs(-1.25f)`,
    output: { type: 'float', value: 1.25 },
  },
  // 3.14f is not exact; pin the actual float value.
  {
    code: `Math.abs(-3.14f)`,
    output: { type: 'float', value: 3.140000104904175 },
  },
  {
    code: `Math.abs(-0.1f)`,
    output: { type: 'float', value: 0.10000000149011612 },
  },
  {
    code: `Math.abs(-5f)`,
    output: { type: 'float', value: 5 },
  },
  {
    code: `Math.abs(-16777216f)`,
    output: { type: 'float', value: 16777216 },
  },
  // 1.0E20 is not exactly representable as a float either.
  {
    code: `Math.abs(-1.0E20f)`,
    output: { type: 'float', value: 100000002004087730000 },
  },
  // ------------------------- abs(double): exact double values & extremes -------------------------
  {
    code: `Math.abs(-1.25)`,
    output: { type: 'double', value: 1.25 },
  },
  {
    code: `Math.abs(-3.14)`,
    output: { type: 'double', value: 3.14 },
  },
  {
    code: `Math.abs(-1e3)`,
    output: { type: 'double', value: 1000 },
  },
  {
    code: `Math.abs(-1.5E2)`,
    output: { type: 'double', value: 150 },
  },
  {
    code: `Math.abs(-1.7976931348623157E308)`,
    output: { type: 'double', value: 1.7976931348623157e308 },
  },
  {
    code: `Math.abs(-4.9E-324)`,
    output: { type: 'double', value: 5e-324 },
  },
  // ------------------------- abs: suffix variants -------------------------
  {
    code: `Math.abs(-5d)`,
    output: { type: 'double', value: 5 },
  },
  {
    code: `Math.abs(-5D)`,
    output: { type: 'double', value: 5 },
  },
  {
    code: `Math.abs(-5f)`,
    output: { type: 'float', value: 5 },
  },
  {
    code: `Math.abs(-5F)`,
    output: { type: 'float', value: 5 },
  },
  {
    code: `Math.abs(-5l)`,
    output: { type: 'long', value: '5' },
  },
  // ------------------------- casts feeding abs -------------------------
  {
    code: `Math.abs((long) -5)`,
    output: { type: 'long', value: '5' },
  },
  {
    code: `Math.abs((double) -5)`,
    output: { type: 'double', value: 5 },
  },
  {
    code: `Math.abs((float) -5)`,
    output: { type: 'float', value: 5 },
  },
  {
    code: `Math.abs((int) -5L)`,
    output: { type: 'int', value: 5 },
  },
  {
    code: `Math.abs((int) -5.9)`,
    output: { type: 'int', value: 5 },
  },
  {
    code: `Math.abs((long) -5.9)`,
    output: { type: 'long', value: '5' },
  },
  {
    code: `Math.abs((short) -5)`,
    output: { type: 'int', value: 5 },
  },
  {
    code: `Math.abs((byte) -5)`,
    output: { type: 'int', value: 5 },
  },
  {
    code: `Math.abs((char) 65)`,
    output: { type: 'int', value: 65 },
  },
  {
    code: `Math.abs((double) -5L)`,
    output: { type: 'double', value: 5 },
  },
  {
    code: `Math.abs((float) -5L)`,
    output: { type: 'float', value: 5 },
  },
  {
    code: `Math.abs((long) -2147483648)`,
    output: { type: 'long', value: '2147483648' },
  },
  // ------------------------- casts of the abs result (narrowing/widening) -------------------------
  {
    code: `(long) Math.abs(-5)`,
    output: { type: 'long', value: '5' },
  },
  {
    code: `(double) Math.abs(-5)`,
    output: { type: 'double', value: 5 },
  },
  {
    code: `(float) Math.abs(-5)`,
    output: { type: 'float', value: 5 },
  },
  {
    code: `(byte) Math.abs(-200)`,
    output: { type: 'byte', value: -56 },
  },
  {
    code: `(short) Math.abs(-40000)`,
    output: { type: 'short', value: -25536 },
  },
  {
    code: `(char) Math.abs(-65)`,
    output: { type: 'char', value: 65 },
  },
  {
    code: `(int) Math.abs(-5L)`,
    output: { type: 'int', value: 5 },
  },
  {
    code: `(double) Math.abs(-5L)`,
    output: { type: 'double', value: 5 },
  },
  {
    code: `(float) Math.abs(-5L)`,
    output: { type: 'float', value: 5 },
  },
  {
    code: `(int) Math.abs(-5.5)`,
    output: { type: 'int', value: 5 },
  },
  {
    code: `(long) Math.abs(-5.5)`,
    output: { type: 'long', value: '5' },
  },
  // Non-finite values converted to integral types follow JLS 5.1.3.
  {
    code: `(int) Math.abs(0.0 / 0.0)`,
    output: { type: 'int', value: 0 },
  },
  {
    code: `(int) Math.abs(-1.0 / 0.0)`,
    output: { type: 'int', value: 2147483647 },
  },
  {
    code: `(long) Math.abs(-1.0 / 0.0)`,
    output: { type: 'long', value: '9223372036854775807' },
  },
  {
    code: `(long) Math.abs(0.0 / 0.0)`,
    output: { type: 'long', value: '0' },
  },
]
