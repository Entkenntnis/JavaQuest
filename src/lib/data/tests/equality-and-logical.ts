import type { TestSuiteEntry } from '../../state/types'

export const equalityAndLogical: TestSuiteEntry[] = [
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
    error: 'compile',
  },
  {
    code: `true && (1/0 == 1)`,
    error: 'runtime',
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
    error: 'runtime',
  },
  {
    code: `true || 1`,
    error: 'compile',
  },
  {
    code: `false && 1`,
    error: 'compile',
  },
  {
    code: `false && null`,
    error: 'compile',
  },
  {
    code: `true || "x"`,
    error: 'compile',
  },
  {
    code: `false && 'a'`,
    error: 'compile',
  },
  {
    code: `true || 9223372036854775807L`,
    error: 'compile',
  },
  {
    code: `true || (boolean)5`,
    error: 'compile',
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
    error: 'runtime',
  },
  {
    code: `true == 1`,
    error: 'compile',
  },
  {
    code: `1 == "x"`,
    error: 'compile',
  },
  {
    code: `null == 1`,
    error: 'compile',
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
    error: 'runtime',
  },
  // ------------------------- non-equality !=: errors -------------------------
  {
    code: `true != 1`,
    error: 'compile',
  },
  {
    code: `1 != "x"`,
    error: 'compile',
  },
  {
    code: `null != 1`,
    error: 'compile',
  },
  {
    code: `1 != null`,
    error: 'compile',
  },
  {
    code: `1/0 != 1`,
    error: 'runtime',
  },
  {
    code: `1 != 1/0`,
    error: 'runtime',
  },
  {
    code: `1 != 2 == 1`,
    error: 'compile',
  },
]
