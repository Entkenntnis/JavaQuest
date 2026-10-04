import type { TestSuiteEntry } from '../../state/types'

// ==================== ASSIGNMENT / UPDATE EDGE CASES ====================
// Holes found while auditing the assignment, compound-assignment and ++/-- suites. The
// theme is where the *static type* of an expression (not just its value) is observable:
// `int & long` is a `long`, and the implicit cast of `E1 op= E2` targets the wrapper for a
// boxed E1. Also covers parenthesized variable targets `(a)++` / `(a) = 3`, negative shift
// distances, wrapper re-boxing at the cache boundary, and chaining through `+=` / `=`.
export const assignmentEdgeCases: TestSuiteEntry[] = [
  // ------------------------- '=': integral promotion is a static property -------------------------
  // 5 & 3L is a long, so the assignment to int must be rejected even though the value fits.
  {
    code: `a = 5 & 3L`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a = 5L & 3`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a = 5 | 3L`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a = b & c`,
    error: 'compile',
    env: {
      local: {
        a: { type: 'int', value: 0 },
        b: { type: 'int', value: 5 },
        c: { type: 'long', value: '3' },
      },
      heap: {},
    },
  },
  {
    code: `a = b & c`,
    output: { type: 'long', value: '1' },
    env: {
      local: {
        a: { type: 'long', value: '0' },
        b: { type: 'int', value: 5 },
        c: { type: 'int', value: 3 },
      },
      heap: {},
    },
  },
  // shifts promote only the left operand: int << long stays int.
  {
    code: `a = 5 << 3L`,
    output: { type: 'int', value: 40 },
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a = 5L << 3`,
    output: { type: 'long', value: '40' },
    env: { local: { a: { type: 'long', value: '0' } }, heap: {} },
  },
  // ------------------------- '=': constant narrowing around the byte boundary -------------------------
  {
    code: `a = 'A'`,
    output: { type: 'byte', value: 65 },
    env: { local: { a: { type: 'byte', value: 0 } }, heap: {} },
  },
  {
    code: `a = 0x7f`,
    output: { type: 'byte', value: 127 },
    env: { local: { a: { type: 'byte', value: 0 } }, heap: {} },
  },
  {
    code: `a = 0x80`,
    error: 'compile',
    env: { local: { a: { type: 'byte', value: 0 } }, heap: {} },
  },
  {
    code: `a = (byte)200`,
    output: { type: 'byte', value: -56 },
    env: { local: { a: { type: 'byte', value: 0 } }, heap: {} },
  },
  // ------------------------- '=': chaining through String references -------------------------
  {
    code: `a = b = "x"`,
    output: { type: '__str', value: 'x' },
    env: {
      local: {
        a: { type: 'reference', ref: 'ha' },
        b: { type: 'reference', ref: 'hb' },
      },
      heap: {
        ha: { class: 'java.lang.String', value: 'old', isInterned: true },
        hb: { class: 'java.lang.String', value: 'older', isInterned: true },
      },
    },
  },
  {
    code: `(a = "x") == (b = "x")`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'reference', ref: 'ha' },
        b: { type: 'reference', ref: 'hb' },
      },
      heap: {
        ha: { class: 'java.lang.String', value: 'old', isInterned: true },
        hb: { class: 'java.lang.String', value: 'older', isInterned: true },
      },
    },
  },
  // ------------------------- compound: wrapper LHS needs the promoted result to match -------------------------
  // The implicit cast of `E1 op= E2` targets the wrapper, so int&long (a long) cannot land in
  // an Integer. For a primitive int LHS the same expression is legal and narrows.
  {
    code: `a &= b`,
    error: 'compile',
    env: {
      local: {
        a: { type: 'int', value: 5, boxed: true },
        b: { type: 'long', value: '3' },
      },
      heap: {},
    },
  },
  {
    code: `a |= b`,
    error: 'compile',
    env: {
      local: {
        a: { type: 'int', value: 5, boxed: true },
        b: { type: 'long', value: '3' },
      },
      heap: {},
    },
  },
  {
    code: `a ^= b`,
    error: 'compile',
    env: {
      local: {
        a: { type: 'int', value: 5, boxed: true },
        b: { type: 'long', value: '3' },
      },
      heap: {},
    },
  },
  {
    code: `a &= b`,
    error: 'compile',
    env: {
      local: {
        a: { type: 'int', value: 5, boxed: true },
        b: { type: 'long', value: '3', boxed: true },
      },
      heap: {},
    },
  },
  // but shifts keep the left operand's type, so this one is legal.
  {
    code: `a <<= b`,
    output: { type: 'int', value: 20 },
    env: {
      local: {
        a: { type: 'int', value: 5, boxed: true },
        b: { type: 'long', value: '2' },
      },
      heap: {},
    },
  },
  {
    code: `a &= b`,
    output: { type: 'int', value: 1 },
    env: {
      local: {
        a: { type: 'int', value: 5, boxed: true },
        b: { type: 'int', value: 3, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `a &= b`,
    output: { type: 'long', value: '1' },
    env: {
      local: {
        a: { type: 'long', value: '5', boxed: true },
        b: { type: 'int', value: 3 },
      },
      heap: {},
    },
  },
  // Character wrapper promotes to int, so no arithmetic compound can match it.
  {
    code: `a += 1`,
    error: 'compile',
    env: { local: { a: { type: 'char', value: 65, boxed: true } }, heap: {} },
  },
  {
    code: `a &= 1`,
    error: 'compile',
    env: { local: { a: { type: 'char', value: 65, boxed: true } }, heap: {} },
  },
  // ------------------------- compound: primitive char / mixed-width narrowing -------------------------
  {
    code: `a += b`,
    output: { type: 'char', value: 66 },
    env: {
      local: {
        a: { type: 'char', value: 65 },
        b: { type: 'char', value: 1 },
      },
      heap: {},
    },
  },
  {
    code: `a += 'A'`,
    output: { type: 'int', value: 65 },
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a *= b`,
    output: { type: 'byte', value: -56 },
    env: {
      local: {
        a: { type: 'byte', value: 100 },
        b: { type: 'long', value: '2' },
      },
      heap: {},
    },
  },
  {
    code: `a += null`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 1 } }, heap: {} },
  },
  // ------------------------- compound: negative shift distances are masked -------------------------
  {
    code: `a <<= -1`,
    output: { type: 'int', value: -2147483648 },
    env: { local: { a: { type: 'int', value: 1 } }, heap: {} },
  },
  {
    code: `a >>= -1`,
    output: { type: 'int', value: -1 },
    env: { local: { a: { type: 'int', value: -8 } }, heap: {} },
  },
  {
    code: `a <<= -1`,
    output: { type: 'long', value: '-9223372036854775808' },
    env: { local: { a: { type: 'long', value: '1' } }, heap: {} },
  },
  {
    code: `a >>>= -1`,
    output: { type: 'long', value: '1' },
    env: { local: { a: { type: 'long', value: '-1' } }, heap: {} },
  },
  {
    code: `a %= -3`,
    output: { type: 'int', value: 1 },
    env: { local: { a: { type: 'int', value: 10 } }, heap: {} },
  },
  // ------------------------- compound: String chains & identity -------------------------
  {
    code: `s += s += "x"`,
    output: { type: '__str', value: 'aax' },
    env: {
      local: { s: { type: 'reference', ref: 'h' } },
      heap: { h: { class: 'java.lang.String', value: 'a', isInterned: true } },
    },
  },
  {
    code: `(s += "x") == (s += "x")`,
    output: { type: 'boolean', value: false },
    env: {
      local: { s: { type: 'reference', ref: 'h' } },
      heap: { h: { class: 'java.lang.String', value: 'a', isInterned: true } },
    },
  },
  {
    code: `s += (t = "x")`,
    output: { type: '__str', value: 'ax' },
    env: {
      local: {
        s: { type: 'reference', ref: 'hs' },
        t: { type: 'reference', ref: 'ht' },
      },
      heap: {
        hs: { class: 'java.lang.String', value: 'a', isInterned: true },
        ht: { class: 'java.lang.String', value: 'old', isInterned: true },
      },
    },
  },
  // ------------------------- compound: re-boxing at the cache boundary -------------------------
  {
    code: `(a = 127) == (a += 0)`,
    output: { type: 'boolean', value: true },
    env: { local: { a: { type: 'int', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `(a = 128) == (a += 0)`,
    output: { type: 'boolean', value: false },
    env: { local: { a: { type: 'int', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `(a = 100L) == (a += 0L)`,
    output: { type: 'boolean', value: true },
    env: { local: { a: { type: 'long', value: '0', boxed: true } }, heap: {} },
  },
  {
    code: `(a = 1000L) == (a += 0L)`,
    output: { type: 'boolean', value: false },
    env: { local: { a: { type: 'long', value: '0', boxed: true } }, heap: {} },
  },
  // ------------------------- ++/--: wrapper overflow and stored vs returned value -------------------------
  {
    code: `a++`,
    output: { type: 'byte', value: 127 },
    env: { local: { a: { type: 'byte', value: 127, boxed: true } }, heap: {} },
  },
  {
    code: `++a`,
    output: { type: 'byte', value: -128 },
    env: { local: { a: { type: 'byte', value: 127, boxed: true } }, heap: {} },
  },
  {
    code: `a++ + a`,
    output: { type: 'int', value: -1 },
    env: { local: { a: { type: 'byte', value: 127, boxed: true } }, heap: {} },
  },
  {
    code: `a++`,
    output: { type: 'long', value: '9223372036854775807' },
    env: {
      local: {
        a: { type: 'long', value: '9223372036854775807', boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `++a`,
    output: { type: 'long', value: '-9223372036854775808' },
    env: {
      local: {
        a: { type: 'long', value: '9223372036854775807', boxed: true },
      },
      heap: {},
    },
  },
  // ------------------------- ++/--: result feeds into widening / concatenation -------------------------
  {
    code: `"" + a++`,
    output: { type: '__str', value: '5' },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `a++ + 0L`,
    output: { type: 'long', value: '5' },
    env: { local: { a: { type: 'byte', value: 5 } }, heap: {} },
  },
  {
    code: `a++ + 0.5`,
    output: { type: 'double', value: 5.5 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  // ------------------------- parenthesized variable targets -------------------------
  // `(a)` is still a variable, so every assignment/update form stays legal.
  {
    code: `(a)++`,
    output: { type: 'int', value: 0 },
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `++(a)`,
    output: { type: 'int', value: 1 },
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `(a)++ + a`,
    output: { type: 'int', value: 1 },
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `((a))++`,
    output: { type: 'int', value: 0 },
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `(a) = 3`,
    output: { type: 'int', value: 3 },
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `(a) += 3`,
    output: { type: 'int', value: 3 },
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `(a) *= 2`,
    output: { type: 'int', value: 4 },
    env: { local: { a: { type: 'int', value: 2 } }, heap: {} },
  },
  // parenthesizing a non-variable must still be rejected.
  {
    code: `(5)++`,
    error: 'compile',
  },
  {
    code: `(a + 1) += 1`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  // ------------------------- ++/--: floating point precision makes the increment a no-op -------------------------
  {
    code: `a++`,
    output: { type: 'double', value: 1e308 },
    env: { local: { a: { type: 'double', value: 1e308 } }, heap: {} },
  },
  {
    code: `a--`,
    output: { type: 'double', value: 1e308 },
    env: { local: { a: { type: 'double', value: 1e308 } }, heap: {} },
  },
  {
    code: `a++`,
    output: { type: 'float', value: 16777216 },
    env: { local: { a: { type: 'float', value: 16777216 } }, heap: {} },
  },
  {
    code: `++a`,
    output: { type: 'float', value: 16777216 },
    env: { local: { a: { type: 'float', value: 16777216 } }, heap: {} },
  },
  {
    code: `a++ + a`,
    output: { type: 'float', value: 33554432 },
    env: { local: { a: { type: 'float', value: 16777216 } }, heap: {} },
  },
  // ------------------------- ++/+= on Float/Double: never cached, always re-boxed -------------------------
  {
    code: `(a = 1.5f) == (a++)`,
    output: { type: 'boolean', value: true },
    env: { local: { a: { type: 'float', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `(a = 1.5f) == (++a)`,
    output: { type: 'boolean', value: false },
    env: { local: { a: { type: 'float', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `(a = 1.5) == (a += 0.0)`,
    output: { type: 'boolean', value: false },
    env: { local: { a: { type: 'double', value: 0, boxed: true } }, heap: {} },
  },
  // ------------------------- +=: String concatenation with boxed operands -------------------------
  {
    code: `s += a`,
    output: { type: '__str', value: 'x5' },
    env: {
      local: {
        s: { type: 'reference', ref: 'hs' },
        a: { type: 'int', value: 5, boxed: true },
      },
      heap: { hs: { class: 'java.lang.String', value: 'x', isInterned: true } },
    },
  },
  {
    code: `s += a`,
    output: { type: '__str', value: 'xtrue' },
    env: {
      local: {
        s: { type: 'reference', ref: 'hs' },
        a: { type: 'boolean', value: true, boxed: true },
      },
      heap: { hs: { class: 'java.lang.String', value: 'x', isInterned: true } },
    },
  },
  {
    code: `s += a`,
    output: { type: '__str', value: 'xA' },
    env: {
      local: {
        s: { type: 'reference', ref: 'hs' },
        a: { type: 'char', value: 65, boxed: true },
      },
      heap: { hs: { class: 'java.lang.String', value: 'x', isInterned: true } },
    },
  },
  {
    code: `s += a`,
    output: { type: '__str', value: 'x5' },
    env: {
      local: {
        s: { type: 'reference', ref: 'hs' },
        a: { type: 'long', value: '5', boxed: true },
      },
      heap: { hs: { class: 'java.lang.String', value: 'x', isInterned: true } },
    },
  },
  // null flows into concatenation as the literal text "null".
  {
    code: `s += (a = null)`,
    output: { type: '__str', value: 'xnull' },
    env: {
      local: {
        s: { type: 'reference', ref: 'hs' },
        a: { type: 'int', value: 5, boxed: true },
      },
      heap: { hs: { class: 'java.lang.String', value: 'x', isInterned: true } },
    },
  },
  {
    code: `s += (a += 1)`,
    output: { type: '__str', value: 'x6' },
    env: {
      local: {
        s: { type: 'reference', ref: 'hs' },
        a: { type: 'int', value: 5 },
      },
      heap: { hs: { class: 'java.lang.String', value: 'x', isInterned: true } },
    },
  },
  {
    code: `a += s`,
    error: 'compile',
    env: {
      local: {
        a: { type: 'int', value: 5, boxed: true },
        s: { type: 'reference', ref: 'hs' },
      },
      heap: { hs: { class: 'java.lang.String', value: 'x', isInterned: true } },
    },
  },
  // ------------------------- chaining & result typing -------------------------
  {
    code: `a = b = 3`,
    output: { type: 'long', value: '3' },
    env: {
      local: {
        a: { type: 'long', value: '0' },
        b: { type: 'int', value: 0 },
      },
      heap: {},
    },
  },
  {
    code: `a = b = 3`,
    error: 'compile',
    env: {
      local: {
        a: { type: 'int', value: 0 },
        b: { type: 'long', value: '0' },
      },
      heap: {},
    },
  },
  {
    code: `(a = 1) + 0.5`,
    output: { type: 'double', value: 1.5 },
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `(a += 1) + 0.5`,
    output: { type: 'double', value: 2.5 },
    env: { local: { a: { type: 'int', value: 1 } }, heap: {} },
  },
  {
    code: `(a += 1) == -2147483648`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'int', value: 2147483647, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(a = null) == null`,
    output: { type: 'boolean', value: true },
    env: { local: { a: { type: 'int', value: 7, boxed: true } }, heap: {} },
  },
  // ------------------------- constant narrowing at the short/char boundary -------------------------
  {
    code: `a = 0x7fff`,
    output: { type: 'short', value: 32767 },
    env: { local: { a: { type: 'short', value: 0 } }, heap: {} },
  },
  {
    code: `a = 0x8000`,
    error: 'compile',
    env: { local: { a: { type: 'short', value: 0 } }, heap: {} },
  },
  {
    code: `a = 0xFFFF`,
    output: { type: 'char', value: 65535 },
    env: { local: { a: { type: 'char', value: 0 } }, heap: {} },
  },
  {
    code: `a = 0x10000`,
    error: 'compile',
    env: { local: { a: { type: 'char', value: 0 } }, heap: {} },
  },
  {
    code: `a = (char)70000`,
    output: { type: 'char', value: 4464 },
    env: { local: { a: { type: 'char', value: 0 } }, heap: {} },
  },
  {
    code: `a = (short)40000`,
    output: { type: 'short', value: -25536 },
    env: { local: { a: { type: 'short', value: 0 } }, heap: {} },
  },
  // ------------------------- compound: mixed-width, sign and literal edges -------------------------
  {
    code: `a += b`,
    output: { type: 'char', value: 66 },
    env: {
      local: {
        a: { type: 'char', value: 65 },
        b: { type: 'int', value: 1 },
      },
      heap: {},
    },
  },
  {
    code: `a += b`,
    output: { type: 'long', value: '70' },
    env: {
      local: {
        a: { type: 'long', value: '5' },
        b: { type: 'char', value: 65 },
      },
      heap: {},
    },
  },
  {
    code: `a *= b`,
    output: { type: 'float', value: 3 },
    env: {
      local: {
        a: { type: 'float', value: 2 },
        b: { type: 'float', value: 1.5 },
      },
      heap: {},
    },
  },
  {
    code: `a /= b`,
    output: { type: 'float', value: 2.5 },
    env: {
      local: {
        a: { type: 'float', value: 5 },
        b: { type: 'int', value: 2 },
      },
      heap: {},
    },
  },
  {
    code: `a %= b`,
    output: { type: 'int', value: -1 },
    env: {
      local: {
        a: { type: 'int', value: -10 },
        b: { type: 'int', value: -3 },
      },
      heap: {},
    },
  },
  {
    code: `a /= b`,
    output: { type: 'int', value: -3 },
    env: {
      local: {
        a: { type: 'int', value: -7 },
        b: { type: 'int', value: 2 },
      },
      heap: {},
    },
  },
  {
    code: `a <<= b`,
    output: { type: 'int', value: 1 },
    env: {
      local: {
        a: { type: 'int', value: 1 },
        b: { type: 'long', value: '32' },
      },
      heap: {},
    },
  },
  {
    code: `a >>>= b`,
    output: { type: 'int', value: -1 },
    env: {
      local: {
        a: { type: 'int', value: -1 },
        b: { type: 'long', value: '32' },
      },
      heap: {},
    },
  },
  {
    code: `a += 0xFFFFFFFF`,
    output: { type: 'int', value: 0 },
    env: { local: { a: { type: 'int', value: 1 } }, heap: {} },
  },
  {
    code: `a %= b`,
    output: { type: 'long', value: '1' },
    env: {
      local: {
        a: { type: 'long', value: '7' },
        b: { type: 'int', value: -2 },
      },
      heap: {},
    },
  },
  {
    code: `a &= b`,
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
    code: `a |= b`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'boolean', value: false, boxed: true },
        b: { type: 'boolean', value: true, boxed: true },
      },
      heap: {},
    },
  },
  // ------------------------- compound: nesting & evaluation order -------------------------
  {
    code: `a += (b += 1)`,
    output: { type: 'int', value: 4 },
    env: {
      local: {
        a: { type: 'int', value: 1 },
        b: { type: 'int', value: 2 },
      },
      heap: {},
    },
  },
  {
    code: `a += a += a`,
    output: { type: 'int', value: 3 },
    env: { local: { a: { type: 'int', value: 1 } }, heap: {} },
  },
  {
    code: `a = a += a`,
    output: { type: 'int', value: 2 },
    env: { local: { a: { type: 'int', value: 1 } }, heap: {} },
  },
  {
    code: `a -= b = 2`,
    output: { type: 'int', value: 8 },
    env: {
      local: {
        a: { type: 'int', value: 10 },
        b: { type: 'int', value: 0 },
      },
      heap: {},
    },
  },
  {
    code: `a += a -= 1`,
    output: { type: 'int', value: 9 },
    env: { local: { a: { type: 'int', value: 5 } }, heap: {} },
  },
  {
    code: `a++ + b++`,
    output: { type: 'int', value: 3 },
    env: {
      local: {
        a: { type: 'int', value: 1 },
        b: { type: 'int', value: 2 },
      },
      heap: {},
    },
  },
  {
    code: `++a + ++b`,
    output: { type: 'int', value: 5 },
    env: {
      local: {
        a: { type: 'int', value: 1 },
        b: { type: 'int', value: 2 },
      },
      heap: {},
    },
  },
  {
    code: `a-- + --b`,
    output: { type: 'int', value: 2 },
    env: {
      local: {
        a: { type: 'int', value: 1 },
        b: { type: 'int', value: 2 },
      },
      heap: {},
    },
  },
  // ------------------------- invalid wrapper update / compound -------------------------
  {
    code: `a++`,
    error: 'compile',
    env: {
      local: { a: { type: 'boolean', value: true, boxed: true } },
      heap: {},
    },
  },
  {
    code: `a += true`,
    error: 'compile',
    env: {
      local: { a: { type: 'boolean', value: true, boxed: true } },
      heap: {},
    },
  },
]
