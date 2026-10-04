import type { TestSuiteEntry } from '../../state/types'

// ==================== COMPOUND ARITHMETIC ASSIGNMENT += -= *= /= %= ====================
// `E1 op= E2` is equivalent to `E1 = (T)((E1) op (E2))` where T is the type of E1, with E1
// evaluated once. The implicit narrowing cast is what makes `int i; i += 1.5` legal while
// `i = i + 1.5` is not (int + double is double). For a *wrapper* LHS the cast targets the
// wrapper, so arithmetic that promotes to int is only legal for Integer/Long/Float/Double
// when the promoted result already matches (e.g. Byte += int is a compile error). String
// LHS turns `+=` into concatenation.
export const compoundAssignment: TestSuiteEntry[] = [
  // ------------------------- int: the five operators -------------------------
  {
    code: `a += 5`,
    output: { type: 'int', value: 15 },
    env: { local: { a: { type: 'int', value: 10 } }, heap: {} },
  },
  {
    code: `a -= 5`,
    output: { type: 'int', value: 5 },
    env: { local: { a: { type: 'int', value: 10 } }, heap: {} },
  },
  {
    code: `a *= 3`,
    output: { type: 'int', value: 30 },
    env: { local: { a: { type: 'int', value: 10 } }, heap: {} },
  },
  {
    code: `a /= 3`,
    output: { type: 'int', value: 3 },
    env: { local: { a: { type: 'int', value: 10 } }, heap: {} },
  },
  {
    code: `a %= 3`,
    output: { type: 'int', value: 1 },
    env: { local: { a: { type: 'int', value: 10 } }, heap: {} },
  },
  {
    code: `a += -3`,
    output: { type: 'int', value: 7 },
    env: { local: { a: { type: 'int', value: 10 } }, heap: {} },
  },
  {
    code: `a -= -3`,
    output: { type: 'int', value: 13 },
    env: { local: { a: { type: 'int', value: 10 } }, heap: {} },
  },
  // ------------------------- long -------------------------
  {
    code: `a += 5`,
    output: { type: 'long', value: '15' },
    env: { local: { a: { type: 'long', value: '10' } }, heap: {} },
  },
  {
    code: `a += 5L`,
    output: { type: 'long', value: '15' },
    env: { local: { a: { type: 'long', value: '10' } }, heap: {} },
  },
  {
    code: `a -= 20`,
    output: { type: 'long', value: '-10' },
    env: { local: { a: { type: 'long', value: '10' } }, heap: {} },
  },
  {
    code: `a *= 3`,
    output: { type: 'long', value: '30' },
    env: { local: { a: { type: 'long', value: '10' } }, heap: {} },
  },
  {
    code: `a /= 3`,
    output: { type: 'long', value: '3' },
    env: { local: { a: { type: 'long', value: '10' } }, heap: {} },
  },
  {
    code: `a %= 7`,
    output: { type: 'long', value: '3' },
    env: { local: { a: { type: 'long', value: '10' } }, heap: {} },
  },
  // ------------------------- float / double -------------------------
  {
    code: `a += 2`,
    output: { type: 'double', value: 3.5 },
    env: { local: { a: { type: 'double', value: 1.5 } }, heap: {} },
  },
  {
    code: `a -= 2.5`,
    output: { type: 'double', value: -1 },
    env: { local: { a: { type: 'double', value: 1.5 } }, heap: {} },
  },
  {
    code: `a *= 2.5`,
    output: { type: 'double', value: 3.75 },
    env: { local: { a: { type: 'double', value: 1.5 } }, heap: {} },
  },
  {
    code: `a /= 2.0`,
    output: { type: 'double', value: 0.75 },
    env: { local: { a: { type: 'double', value: 1.5 } }, heap: {} },
  },
  {
    code: `a %= 1.0`,
    output: { type: 'double', value: 0.5 },
    env: { local: { a: { type: 'double', value: 1.5 } }, heap: {} },
  },
  {
    code: `a += 2`,
    output: { type: 'float', value: 3.5 },
    env: { local: { a: { type: 'float', value: 1.5 } }, heap: {} },
  },
  {
    code: `a *= 2`,
    output: { type: 'float', value: 3 },
    env: { local: { a: { type: 'float', value: 1.5 } }, heap: {} },
  },
  {
    code: `a += 1.5`,
    output: { type: 'float', value: 3 },
    env: { local: { a: { type: 'float', value: 1.5 } }, heap: {} },
  },
  {
    code: `a += 1.5f`,
    output: { type: 'double', value: 3 },
    env: { local: { a: { type: 'double', value: 1.5 } }, heap: {} },
  },
  // ------------------------- implicit narrowing of the LHS cast -------------------------
  {
    code: `a += 1.5`,
    output: { type: 'int', value: 2 },
    env: { local: { a: { type: 'int', value: 1 } }, heap: {} },
  },
  {
    code: `a += 2.5`,
    output: { type: 'int', value: 3 },
    env: { local: { a: { type: 'int', value: 1 } }, heap: {} },
  },
  {
    code: `a += 0.5`,
    output: { type: 'int', value: 1 },
    env: { local: { a: { type: 'int', value: 1 } }, heap: {} },
  },
  {
    code: `a -= 0.5`,
    output: { type: 'int', value: 0 },
    env: { local: { a: { type: 'int', value: 1 } }, heap: {} },
  },
  {
    code: `a *= 2.5`,
    output: { type: 'int', value: 2 },
    env: { local: { a: { type: 'int', value: 1 } }, heap: {} },
  },
  {
    code: `a /= 2.0`,
    output: { type: 'int', value: 2 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `a %= 2.5`,
    output: { type: 'int', value: 0 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `a += 1.5f`,
    output: { type: 'int', value: 2 },
    env: { local: { a: { type: 'int', value: 1 } }, heap: {} },
  },
  {
    code: `a += 1L`,
    output: { type: 'int', value: 2 },
    env: { local: { a: { type: 'int', value: 1 } }, heap: {} },
  },
  {
    code: `a += 1.5`,
    output: { type: 'long', value: '2' },
    env: { local: { a: { type: 'long', value: '1' } }, heap: {} },
  },
  {
    code: `a += 1.5f`,
    output: { type: 'long', value: '2' },
    env: { local: { a: { type: 'long', value: '1' } }, heap: {} },
  },
  // ------------------------- byte / short / char wrap via implicit cast -------------------------
  {
    code: `a += 1`,
    output: { type: 'byte', value: 101 },
    env: { local: { a: { type: 'byte', value: 100 } }, heap: {} },
  },
  {
    code: `a += 27`,
    output: { type: 'byte', value: 127 },
    env: { local: { a: { type: 'byte', value: 100 } }, heap: {} },
  },
  {
    code: `a += 28`,
    output: { type: 'byte', value: -128 },
    env: { local: { a: { type: 'byte', value: 100 } }, heap: {} },
  },
  {
    code: `a += 200`,
    output: { type: 'byte', value: 44 },
    env: { local: { a: { type: 'byte', value: 100 } }, heap: {} },
  },
  {
    code: `a += 1.5`,
    output: { type: 'byte', value: 2 },
    env: { local: { a: { type: 'byte', value: 1 } }, heap: {} },
  },
  {
    code: `a -= 1`,
    output: { type: 'byte', value: 127 },
    env: { local: { a: { type: 'byte', value: -128 } }, heap: {} },
  },
  {
    code: `a += 1000`,
    output: { type: 'short', value: 2000 },
    env: { local: { a: { type: 'short', value: 1000 } }, heap: {} },
  },
  {
    code: `a += 1`,
    output: { type: 'short', value: -32768 },
    env: { local: { a: { type: 'short', value: 32767 } }, heap: {} },
  },
  {
    code: `a *= 2`,
    output: { type: 'short', value: -25536 },
    env: { local: { a: { type: 'short', value: 20000 } }, heap: {} },
  },
  {
    code: `a += 1`,
    output: { type: 'char', value: 66 },
    env: { local: { a: { type: 'char', value: 65 } }, heap: {} },
  },
  {
    code: `a += 1`,
    output: { type: 'char', value: 0 },
    env: { local: { a: { type: 'char', value: 65535 } }, heap: {} },
  },
  {
    code: `a -= 1`,
    output: { type: 'char', value: 65535 },
    env: { local: { a: { type: 'char', value: 0 } }, heap: {} },
  },
  {
    code: `a *= 2`,
    output: { type: 'char', value: 14464 },
    env: { local: { a: { type: 'char', value: 40000 } }, heap: {} },
  },
  // ------------------------- overflow at the type boundaries -------------------------
  {
    code: `a += 1`,
    output: { type: 'int', value: -2147483648 },
    env: { local: { a: { type: 'int', value: 2147483647 } }, heap: {} },
  },
  {
    code: `a -= 1`,
    output: { type: 'int', value: 2147483647 },
    env: { local: { a: { type: 'int', value: -2147483648 } }, heap: {} },
  },
  {
    code: `a *= 2`,
    output: { type: 'int', value: -2 },
    env: { local: { a: { type: 'int', value: 2147483647 } }, heap: {} },
  },
  {
    code: `a /= -1`,
    output: { type: 'int', value: -2147483648 },
    env: { local: { a: { type: 'int', value: -2147483648 } }, heap: {} },
  },
  {
    code: `a %= -1`,
    output: { type: 'int', value: 0 },
    env: { local: { a: { type: 'int', value: -2147483648 } }, heap: {} },
  },
  {
    code: `a += 1L`,
    output: { type: 'long', value: '-9223372036854775808' },
    env: { local: { a: { type: 'long', value: '9223372036854775807' } }, heap: {} },
  },
  {
    code: `a -= 1L`,
    output: { type: 'long', value: '9223372036854775807' },
    env: { local: { a: { type: 'long', value: '-9223372036854775808' } }, heap: {} },
  },
  {
    code: `a *= 2L`,
    output: { type: 'long', value: '-2' },
    env: { local: { a: { type: 'long', value: '9223372036854775807' } }, heap: {} },
  },
  // ------------------------- self reference -------------------------
  {
    code: `a += a`,
    output: { type: 'int', value: 14 },
    env: { local: { a: { type: 'int', value: 7 } }, heap: {} },
  },
  {
    code: `a *= a`,
    output: { type: 'int', value: 49 },
    env: { local: { a: { type: 'int', value: 7 } }, heap: {} },
  },
  {
    code: `a -= a`,
    output: { type: 'int', value: 0 },
    env: { local: { a: { type: 'int', value: 7 } }, heap: {} },
  },
  {
    code: `a /= a`,
    output: { type: 'int', value: 1 },
    env: { local: { a: { type: 'int', value: 7 } }, heap: {} },
  },
  {
    code: `a %= a`,
    output: { type: 'int', value: 0 },
    env: { local: { a: { type: 'int', value: 7 } }, heap: {} },
  },
  {
    code: `a += a + a`,
    output: { type: 'int', value: 9 },
    env: { local: { a: { type: 'int', value: 3 } }, heap: {} },
  },
  // ------------------------- evaluation order: LHS value read before the RHS runs -------------------------
  {
    code: `a += (a += 1)`,
    output: { type: 'int', value: 15 },
    env: { local: { a: { type: 'int', value: 7 } }, heap: {} },
  },
  {
    code: `a += (a = 3)`,
    output: { type: 'int', value: 10 },
    env: { local: { a: { type: 'int', value: 7 } }, heap: {} },
  },
  {
    code: `a *= (a += 1)`,
    output: { type: 'int', value: 12 },
    env: { local: { a: { type: 'int', value: 3 } }, heap: {} },
  },
  {
    code: `a = a += 5`,
    output: { type: 'int', value: 15 },
    env: { local: { a: { type: 'int', value: 10 } }, heap: {} },
  },
  // ------------------------- right associativity & precedence -------------------------
  {
    code: `a += b = 3`,
    output: { type: 'int', value: 13 },
    env: {
      local: {
        a: { type: 'int', value: 10 },
        b: { type: 'int', value: 0 },
      },
      heap: {},
    },
  },
  {
    code: `a += b -= 2`,
    output: { type: 'int', value: 13 },
    env: {
      local: {
        a: { type: 'int', value: 10 },
        b: { type: 'int', value: 5 },
      },
      heap: {},
    },
  },
  {
    code: `a += 5 + 3`,
    output: { type: 'int', value: 18 },
    env: { local: { a: { type: 'int', value: 10 } }, heap: {} },
  },
  {
    code: `a += 2 * 3`,
    output: { type: 'int', value: 16 },
    env: { local: { a: { type: 'int', value: 10 } }, heap: {} },
  },
  {
    code: `a -= 1 + 1`,
    output: { type: 'int', value: 8 },
    env: { local: { a: { type: 'int', value: 10 } }, heap: {} },
  },
  {
    code: `a *= 1 + 1`,
    output: { type: 'int', value: 20 },
    env: { local: { a: { type: 'int', value: 10 } }, heap: {} },
  },
  {
    code: `a /= 1 + 1`,
    output: { type: 'int', value: 5 },
    env: { local: { a: { type: 'int', value: 10 } }, heap: {} },
  },
  {
    code: `a %= 1 + 2`,
    output: { type: 'int', value: 1 },
    env: { local: { a: { type: 'int', value: 10 } }, heap: {} },
  },
  {
    code: `a += 3 > 2 ? 1 : 2`,
    output: { type: 'int', value: 11 },
    env: { local: { a: { type: 'int', value: 10 } }, heap: {} },
  },
  {
    code: `a += 1 == 1 ? 5 : 6`,
    output: { type: 'int', value: 15 },
    env: { local: { a: { type: 'int', value: 10 } }, heap: {} },
  },
  // ------------------------- String += is concatenation -------------------------
  {
    code: `s += "x"`,
    output: { type: '__str', value: 'abcx' },
    env: {
      local: { s: { type: 'reference', ref: 'h' } },
      heap: { h: { class: 'java.lang.String', value: 'abc', isInterned: true } },
    },
  },
  {
    code: `s += s`,
    output: { type: '__str', value: 'abcabc' },
    env: {
      local: { s: { type: 'reference', ref: 'h' } },
      heap: { h: { class: 'java.lang.String', value: 'abc', isInterned: true } },
    },
  },
  {
    code: `s += 5`,
    output: { type: '__str', value: 'abc5' },
    env: {
      local: { s: { type: 'reference', ref: 'h' } },
      heap: { h: { class: 'java.lang.String', value: 'abc', isInterned: true } },
    },
  },
  {
    code: `s += -5`,
    output: { type: '__str', value: 'abc-5' },
    env: {
      local: { s: { type: 'reference', ref: 'h' } },
      heap: { h: { class: 'java.lang.String', value: 'abc', isInterned: true } },
    },
  },
  {
    code: `s += 1.5`,
    output: { type: '__str', value: 'abc1.5' },
    env: {
      local: { s: { type: 'reference', ref: 'h' } },
      heap: { h: { class: 'java.lang.String', value: 'abc', isInterned: true } },
    },
  },
  {
    code: `s += 1.5f`,
    output: { type: '__str', value: 'abc1.5' },
    env: {
      local: { s: { type: 'reference', ref: 'h' } },
      heap: { h: { class: 'java.lang.String', value: 'abc', isInterned: true } },
    },
  },
  {
    code: `s += (byte)200`,
    output: { type: '__str', value: 'abc-56' },
    env: {
      local: { s: { type: 'reference', ref: 'h' } },
      heap: { h: { class: 'java.lang.String', value: 'abc', isInterned: true } },
    },
  },
  {
    code: `s += 'A'`,
    output: { type: '__str', value: 'abcA' },
    env: {
      local: { s: { type: 'reference', ref: 'h' } },
      heap: { h: { class: 'java.lang.String', value: 'abc', isInterned: true } },
    },
  },
  {
    code: `s += true`,
    output: { type: '__str', value: 'abctrue' },
    env: {
      local: { s: { type: 'reference', ref: 'h' } },
      heap: { h: { class: 'java.lang.String', value: 'abc', isInterned: true } },
    },
  },
  {
    code: `s += null`,
    output: { type: '__str', value: 'abcnull' },
    env: {
      local: { s: { type: 'reference', ref: 'h' } },
      heap: { h: { class: 'java.lang.String', value: 'abc', isInterned: true } },
    },
  },
  {
    code: `s += 9223372036854775807L`,
    output: { type: '__str', value: 'abc9223372036854775807' },
    env: {
      local: { s: { type: 'reference', ref: 'h' } },
      heap: { h: { class: 'java.lang.String', value: 'abc', isInterned: true } },
    },
  },
  {
    code: `s += 1 + 2`,
    output: { type: '__str', value: 'abc3' },
    env: {
      local: { s: { type: 'reference', ref: 'h' } },
      heap: { h: { class: 'java.lang.String', value: 'abc', isInterned: true } },
    },
  },
  {
    code: `s += "x" + 1`,
    output: { type: '__str', value: 'abcx1' },
    env: {
      local: { s: { type: 'reference', ref: 'h' } },
      heap: { h: { class: 'java.lang.String', value: 'abc', isInterned: true } },
    },
  },
  {
    code: `s += 1 + "x"`,
    output: { type: '__str', value: 'abc1x' },
    env: {
      local: { s: { type: 'reference', ref: 'h' } },
      heap: { h: { class: 'java.lang.String', value: 'abc', isInterned: true } },
    },
  },
  {
    code: `s = s + 1`,
    output: { type: '__str', value: 'abc1' },
    env: {
      local: { s: { type: 'reference', ref: 'h' } },
      heap: { h: { class: 'java.lang.String', value: 'abc', isInterned: true } },
    },
  },
  {
    code: `(s += "x") == s`,
    output: { type: 'boolean', value: true },
    env: {
      local: { s: { type: 'reference', ref: 'h' } },
      heap: { h: { class: 'java.lang.String', value: 'abc', isInterned: true } },
    },
  },
  {
    code: `s += t += "b"`,
    output: { type: '__str', value: 'aab' },
    env: {
      local: {
        s: { type: 'reference', ref: 'hs' },
        t: { type: 'reference', ref: 'ht' },
      },
      heap: {
        hs: { class: 'java.lang.String', value: 'a', isInterned: true },
        ht: { class: 'java.lang.String', value: 'a', isInterned: true },
      },
    },
  },
  {
    code: `s += t`,
    output: { type: '__str', value: 'abcXY' },
    env: {
      local: {
        s: { type: 'reference', ref: 'hs' },
        t: { type: 'reference', ref: 'ht' },
      },
      heap: {
        hs: { class: 'java.lang.String', value: 'abc', isInterned: true },
        ht: { class: 'java.lang.String', value: 'XY', isInterned: true },
      },
    },
  },
  // ------------------------- String: only += is defined -------------------------
  {
    code: `s -= "x"`,
    error: 'compile',
    env: {
      local: { s: { type: 'reference', ref: 'h' } },
      heap: { h: { class: 'java.lang.String', value: 'abc', isInterned: true } },
    },
  },
  {
    code: `s *= 2`,
    error: 'compile',
    env: {
      local: { s: { type: 'reference', ref: 'h' } },
      heap: { h: { class: 'java.lang.String', value: 'abc', isInterned: true } },
    },
  },
  {
    code: `s /= 2`,
    error: 'compile',
    env: {
      local: { s: { type: 'reference', ref: 'h' } },
      heap: { h: { class: 'java.lang.String', value: 'abc', isInterned: true } },
    },
  },
  {
    code: `s %= 2`,
    error: 'compile',
    env: {
      local: { s: { type: 'reference', ref: 'h' } },
      heap: { h: { class: 'java.lang.String', value: 'abc', isInterned: true } },
    },
  },
  // ------------------------- invalid operands -------------------------
  {
    code: `a += "x"`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a -= "x"`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a *= "x"`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a /= "x"`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a %= "x"`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a += true`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a -= true`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a *= true`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a /= true`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a %= true`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a += true`,
    error: 'compile',
    env: { local: { a: { type: 'boolean', value: false } }, heap: {} },
  },
  {
    code: `a -= true`,
    error: 'compile',
    env: { local: { a: { type: 'boolean', value: false } }, heap: {} },
  },
  {
    code: `a *= true`,
    error: 'compile',
    env: { local: { a: { type: 'boolean', value: false } }, heap: {} },
  },
  {
    code: `a /= true`,
    error: 'compile',
    env: { local: { a: { type: 'boolean', value: false } }, heap: {} },
  },
  {
    code: `a %= true`,
    error: 'compile',
    env: { local: { a: { type: 'boolean', value: false } }, heap: {} },
  },
  {
    code: `a += 1.5`,
    output: { type: 'byte', value: 1 },
    env: { local: { a: { type: 'byte', value: 0 } }, heap: {} },
  },
  {
    code: `5 += 1`,
    error: 'compile',
  },
  {
    code: `a += 1`,
    error: 'compile',
    env: { local: { a: { type: 'null', value: null } }, heap: {} },
  },
  // ------------------------- runtime integer division / modulo by zero -------------------------
  {
    code: `a /= 0`,
    error: 'runtime',
    env: { local: { a: { type: 'int', value: 10 } }, heap: {} },
  },
  {
    code: `a %= 0`,
    error: 'runtime',
    env: { local: { a: { type: 'int', value: 10 } }, heap: {} },
  },
  {
    code: `a /= (1 - 1)`,
    error: 'runtime',
    env: { local: { a: { type: 'int', value: 10 } }, heap: {} },
  },
  {
    code: `a %= (3 - 3)`,
    error: 'runtime',
    env: { local: { a: { type: 'int', value: 10 } }, heap: {} },
  },
  {
    code: `a /= 0L`,
    error: 'runtime',
    env: { local: { a: { type: 'long', value: '10' } }, heap: {} },
  },
  {
    code: `a %= 0L`,
    error: 'runtime',
    env: { local: { a: { type: 'long', value: '10' } }, heap: {} },
  },
  {
    code: `a /= 0`,
    error: 'runtime',
    env: { local: { a: { type: 'byte', value: 10 } }, heap: {} },
  },
  {
    code: `a /= 0`,
    error: 'runtime',
    env: { local: { a: { type: 'short', value: 10 } }, heap: {} },
  },
  {
    code: `a /= 0`,
    error: 'runtime',
    env: { local: { a: { type: 'char', value: 10 } }, heap: {} },
  },
  // ------------------------- floating point division by zero does NOT throw -------------------------
  {
    code: `(a /= 0.0) == 1.0 / 0.0`,
    output: { type: 'boolean', value: true },
    env: { local: { a: { type: 'double', value: 1 } }, heap: {} },
  },
  {
    code: `(a /= 0.0f) == 1.0f / 0.0f`,
    output: { type: 'boolean', value: true },
    env: { local: { a: { type: 'float', value: 1 } }, heap: {} },
  },
  // ------------------------- wrapper LHS: only the matching-width ops are legal -------------------------
  {
    code: `a += 1`,
    output: { type: 'int', value: 1001 },
    env: { local: { a: { type: 'int', value: 1000, boxed: true } }, heap: {} },
  },
  {
    code: `a -= 1`,
    output: { type: 'int', value: 999 },
    env: { local: { a: { type: 'int', value: 1000, boxed: true } }, heap: {} },
  },
  {
    code: `a *= 2`,
    output: { type: 'int', value: 2000 },
    env: { local: { a: { type: 'int', value: 1000, boxed: true } }, heap: {} },
  },
  {
    code: `a /= 2`,
    output: { type: 'int', value: 500 },
    env: { local: { a: { type: 'int', value: 1000, boxed: true } }, heap: {} },
  },
  {
    code: `a %= 3`,
    output: { type: 'int', value: 1 },
    env: { local: { a: { type: 'int', value: 1000, boxed: true } }, heap: {} },
  },
  {
    code: `a += 1L`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 1000, boxed: true } }, heap: {} },
  },
  {
    code: `a += 1.5`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 1000, boxed: true } }, heap: {} },
  },
  {
    code: `a += 1.5f`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 1000, boxed: true } }, heap: {} },
  },
  {
    code: `a += 1`,
    output: { type: 'long', value: '1001' },
    env: { local: { a: { type: 'long', value: '1000', boxed: true } }, heap: {} },
  },
  {
    code: `a += 1L`,
    output: { type: 'long', value: '1001' },
    env: { local: { a: { type: 'long', value: '1000', boxed: true } }, heap: {} },
  },
  {
    code: `a *= 2`,
    output: { type: 'long', value: '2000' },
    env: { local: { a: { type: 'long', value: '1000', boxed: true } }, heap: {} },
  },
  {
    code: `a += 1.5`,
    error: 'compile',
    env: { local: { a: { type: 'long', value: '1000', boxed: true } }, heap: {} },
  },
  {
    code: `a += 1`,
    output: { type: 'double', value: 1001 },
    env: { local: { a: { type: 'double', value: 1000, boxed: true } }, heap: {} },
  },
  {
    code: `a += 1.5f`,
    output: { type: 'double', value: 1001.5 },
    env: { local: { a: { type: 'double', value: 1000, boxed: true } }, heap: {} },
  },
  {
    code: `a += 1`,
    output: { type: 'float', value: 1001 },
    env: { local: { a: { type: 'float', value: 1000, boxed: true } }, heap: {} },
  },
  {
    code: `a += 1.5`,
    error: 'compile',
    env: { local: { a: { type: 'float', value: 1000, boxed: true } }, heap: {} },
  },
  {
    code: `a += 1`,
    error: 'compile',
    env: { local: { a: { type: 'byte', value: 100, boxed: true } }, heap: {} },
  },
  {
    code: `a += 1`,
    error: 'compile',
    env: { local: { a: { type: 'short', value: 100, boxed: true } }, heap: {} },
  },
  {
    code: `a += 1`,
    error: 'compile',
    env: { local: { a: { type: 'char', value: 100, boxed: true } }, heap: {} },
  },
  {
    code: `a += b`,
    output: { type: 'int', value: 15 },
    env: {
      local: {
        a: { type: 'int', value: 10 },
        b: { type: 'int', value: 5, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `a += b`,
    output: { type: 'int', value: 15 },
    env: {
      local: {
        a: { type: 'int', value: 10, boxed: true },
        b: { type: 'int', value: 5 },
      },
      heap: {},
    },
  },
]
