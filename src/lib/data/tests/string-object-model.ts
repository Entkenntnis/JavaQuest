import type { TestSuiteEntry } from '../../state/types'

export const stringObjectModel: TestSuiteEntry[] = [
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
    error: 'runtime',
  },
  {
    code: `"" + (1 % 0)`,
    error: 'runtime',
  },
  {
    code: `(1 / 0) + ""`,
    error: 'runtime',
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
    error: 'runtime',
  },
  {
    code: `"" + (0 / 0)`,
    error: 'runtime',
  },
  {
    code: `(1L / 0L) + ""`,
    error: 'runtime',
  },
  {
    code: `-(1 / 0)`,
    error: 'runtime',
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
    error: 'runtime',
  },
]
