import type { TestSuiteEntry } from '../../state/types'

// ==================== SIMPLE ASSIGNMENT '=' ====================
// The assignment expression yields the value that was stored, and its static type is the
// type of the left-hand variable. Every entry is a single expression; side effects on the
// env local are observed by composing the assignment into a larger expression (e.g.
// `(a = 3) + a`). All expectations are certified against a real JDK by the cross-check.
export const assignmentBasic: TestSuiteEntry[] = [
  // ------------------------- int: basic stores & result value -------------------------
  {
    code: `a = 5`,
    output: { type: 'int', value: 5 },
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a = -7`,
    output: { type: 'int', value: -7 },
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a = 0`,
    output: { type: 'int', value: 0 },
    env: { local: { a: { type: 'int', value: 9 } }, heap: {} },
  },
  {
    code: `a = 2147483647`,
    output: { type: 'int', value: 2147483647 },
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a = -2147483648`,
    output: { type: 'int', value: -2147483648 },
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a = 1000000`,
    output: { type: 'int', value: 1000000 },
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  // ------------------------- long -------------------------
  {
    code: `a = 5L`,
    output: { type: 'long', value: '5' },
    env: { local: { a: { type: 'long', value: '0' } }, heap: {} },
  },
  {
    code: `a = -5L`,
    output: { type: 'long', value: '-5' },
    env: { local: { a: { type: 'long', value: '0' } }, heap: {} },
  },
  {
    code: `a = 9223372036854775807L`,
    output: { type: 'long', value: '9223372036854775807' },
    env: { local: { a: { type: 'long', value: '0' } }, heap: {} },
  },
  {
    code: `a = -9223372036854775808L`,
    output: { type: 'long', value: '-9223372036854775808' },
    env: { local: { a: { type: 'long', value: '0' } }, heap: {} },
  },
  {
    code: `a = 42`,
    output: { type: 'long', value: '42' },
    env: { local: { a: { type: 'long', value: '0' } }, heap: {} },
  },
  {
    code: `a = 'A'`,
    output: { type: 'long', value: '65' },
    env: { local: { a: { type: 'long', value: '0' } }, heap: {} },
  },
  {
    code: `a = (byte)-1`,
    output: { type: 'long', value: '-1' },
    env: { local: { a: { type: 'long', value: '0' } }, heap: {} },
  },
  {
    code: `a = (char)65`,
    output: { type: 'long', value: '65' },
    env: { local: { a: { type: 'long', value: '0' } }, heap: {} },
  },
  // ------------------------- widening primitive conversions -------------------------
  {
    code: `a = 5`,
    output: { type: 'double', value: 5 },
    env: { local: { a: { type: 'double', value: 0 } }, heap: {} },
  },
  {
    code: `a = 5L`,
    output: { type: 'double', value: 5 },
    env: { local: { a: { type: 'double', value: 0 } }, heap: {} },
  },
  {
    code: `a = 5.5f`,
    output: { type: 'double', value: 5.5 },
    env: { local: { a: { type: 'double', value: 0 } }, heap: {} },
  },
  {
    code: `a = 'A'`,
    output: { type: 'double', value: 65 },
    env: { local: { a: { type: 'double', value: 0 } }, heap: {} },
  },
  {
    code: `a = 5`,
    output: { type: 'float', value: 5 },
    env: { local: { a: { type: 'float', value: 0 } }, heap: {} },
  },
  {
    code: `a = 5L`,
    output: { type: 'float', value: 5 },
    env: { local: { a: { type: 'float', value: 0 } }, heap: {} },
  },
  {
    code: `a = 5.5f`,
    output: { type: 'float', value: 5.5 },
    env: { local: { a: { type: 'float', value: 0 } }, heap: {} },
  },
  {
    code: `a = 2.5`,
    output: { type: 'double', value: 2.5 },
    env: { local: { a: { type: 'double', value: 0 } }, heap: {} },
  },
  {
    code: `a = 2.5f`,
    output: { type: 'float', value: 2.5 },
    env: { local: { a: { type: 'float', value: 0 } }, heap: {} },
  },
  {
    code: `a = 'A'`,
    output: { type: 'int', value: 65 },
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a = (short)5`,
    output: { type: 'int', value: 5 },
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a = (byte)5`,
    output: { type: 'int', value: 5 },
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  // ------------------------- constant narrowing: byte -------------------------
  {
    code: `a = 100`,
    output: { type: 'byte', value: 100 },
    env: { local: { a: { type: 'byte', value: 0 } }, heap: {} },
  },
  {
    code: `a = 127`,
    output: { type: 'byte', value: 127 },
    env: { local: { a: { type: 'byte', value: 0 } }, heap: {} },
  },
  {
    code: `a = -128`,
    output: { type: 'byte', value: -128 },
    env: { local: { a: { type: 'byte', value: 0 } }, heap: {} },
  },
  {
    code: `a = 0`,
    output: { type: 'byte', value: 0 },
    env: { local: { a: { type: 'byte', value: 7 } }, heap: {} },
  },
  {
    code: `a = 128`,
    error: 'compile',
    env: { local: { a: { type: 'byte', value: 0 } }, heap: {} },
  },
  {
    code: `a = -129`,
    error: 'compile',
    env: { local: { a: { type: 'byte', value: 0 } }, heap: {} },
  },
  // ------------------------- constant narrowing: short -------------------------
  {
    code: `a = 1000`,
    output: { type: 'short', value: 1000 },
    env: { local: { a: { type: 'short', value: 0 } }, heap: {} },
  },
  {
    code: `a = 32767`,
    output: { type: 'short', value: 32767 },
    env: { local: { a: { type: 'short', value: 0 } }, heap: {} },
  },
  {
    code: `a = -32768`,
    output: { type: 'short', value: -32768 },
    env: { local: { a: { type: 'short', value: 0 } }, heap: {} },
  },
  {
    code: `a = 32768`,
    error: 'compile',
    env: { local: { a: { type: 'short', value: 0 } }, heap: {} },
  },
  {
    code: `a = -32769`,
    error: 'compile',
    env: { local: { a: { type: 'short', value: 0 } }, heap: {} },
  },
  // ------------------------- constant narrowing: char -------------------------
  {
    code: `a = 65`,
    output: { type: 'char', value: 65 },
    env: { local: { a: { type: 'char', value: 0 } }, heap: {} },
  },
  {
    code: `a = 0`,
    output: { type: 'char', value: 0 },
    env: { local: { a: { type: 'char', value: 7 } }, heap: {} },
  },
  {
    code: `a = 65535`,
    output: { type: 'char', value: 65535 },
    env: { local: { a: { type: 'char', value: 0 } }, heap: {} },
  },
  {
    code: `a = 65536`,
    error: 'compile',
    env: { local: { a: { type: 'char', value: 0 } }, heap: {} },
  },
  {
    code: `a = -1`,
    error: 'compile',
    env: { local: { a: { type: 'char', value: 0 } }, heap: {} },
  },
  {
    code: `a = 'A'`,
    output: { type: 'char', value: 65 },
    env: { local: { a: { type: 'char', value: 0 } }, heap: {} },
  },
  // ------------------------- rejected narrowing for '=' -------------------------
  {
    code: `a = 1L`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a = 1.5`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a = 1.0`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a = 1.5f`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a = 1.5`,
    error: 'compile',
    env: { local: { a: { type: 'long', value: '0' } }, heap: {} },
  },
  {
    code: `a = 1.5f`,
    error: 'compile',
    env: { local: { a: { type: 'long', value: '0' } }, heap: {} },
  },
  {
    code: `a = 2.5`,
    error: 'compile',
    env: { local: { a: { type: 'float', value: 0 } }, heap: {} },
  },
  {
    code: `a = 1000L`,
    error: 'compile',
    env: { local: { a: { type: 'short', value: 0 } }, heap: {} },
  },
  {
    code: `a = (short)5`,
    output: { type: 'byte', value: 5 },
    env: { local: { a: { type: 'byte', value: 0 } }, heap: {} },
  },
  {
    code: `a = (long)5`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a = (char)65`,
    output: { type: 'int', value: 65 },
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a = (int)5`,
    output: { type: 'long', value: '5' },
    env: { local: { a: { type: 'long', value: '0' } }, heap: {} },
  },
  // ------------------------- boolean -------------------------
  {
    code: `a = true`,
    output: { type: 'boolean', value: true },
    env: { local: { a: { type: 'boolean', value: false } }, heap: {} },
  },
  {
    code: `a = false`,
    output: { type: 'boolean', value: false },
    env: { local: { a: { type: 'boolean', value: true } }, heap: {} },
  },
  {
    code: `a = 1`,
    error: 'compile',
    env: { local: { a: { type: 'boolean', value: false } }, heap: {} },
  },
  {
    code: `a = 0`,
    error: 'compile',
    env: { local: { a: { type: 'boolean', value: false } }, heap: {} },
  },
  {
    code: `a = true`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a = !false`,
    output: { type: 'boolean', value: true },
    env: { local: { a: { type: 'boolean', value: false } }, heap: {} },
  },
  {
    code: `a = (boolean)true`,
    output: { type: 'boolean', value: true },
    env: { local: { a: { type: 'boolean', value: false } }, heap: {} },
  },
  // ------------------------- String references -------------------------
  {
    code: `s = "x"`,
    output: { type: '__str', value: 'x' },
    env: {
      local: { s: { type: 'reference', ref: 'h' } },
      heap: { h: { class: 'java.lang.String', value: 'old', isInterned: true } },
    },
  },
  {
    code: `s = ""`,
    output: { type: '__str', value: '' },
    env: {
      local: { s: { type: 'reference', ref: 'h' } },
      heap: { h: { class: 'java.lang.String', value: 'old', isInterned: true } },
    },
  },
  {
    code: `s = "a" + "b"`,
    output: { type: '__str', value: 'ab' },
    env: {
      local: { s: { type: 'reference', ref: 'h' } },
      heap: { h: { class: 'java.lang.String', value: 'old', isInterned: true } },
    },
  },
  {
    code: `s = 5`,
    error: 'compile',
    env: {
      local: { s: { type: 'reference', ref: 'h' } },
      heap: { h: { class: 'java.lang.String', value: 'old', isInterned: true } },
    },
  },
  {
    code: `(s = null) == null`,
    output: { type: 'boolean', value: true },
    env: {
      local: { s: { type: 'reference', ref: 'h' } },
      heap: { h: { class: 'java.lang.String', value: 'old', isInterned: true } },
    },
  },
  {
    code: `(s = "x") == s`,
    output: { type: 'boolean', value: true },
    env: {
      local: { s: { type: 'reference', ref: 'h' } },
      heap: { h: { class: 'java.lang.String', value: 'old', isInterned: true } },
    },
  },
  {
    code: `a = "x"`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  // ------------------------- right associativity & value flow -------------------------
  {
    code: `a = b = 7`,
    output: { type: 'int', value: 7 },
    env: {
      local: {
        a: { type: 'int', value: 0 },
        b: { type: 'int', value: 0 },
      },
      heap: {},
    },
  },
  {
    code: `a = b = c = 7`,
    output: { type: 'int', value: 7 },
    env: {
      local: {
        a: { type: 'int', value: 0 },
        b: { type: 'int', value: 0 },
        c: { type: 'int', value: 0 },
      },
      heap: {},
    },
  },
  {
    code: `(a = 3) + 4`,
    output: { type: 'int', value: 7 },
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `(a = 3) + a`,
    output: { type: 'int', value: 6 },
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a = (b = 3) + b`,
    output: { type: 'int', value: 6 },
    env: {
      local: {
        a: { type: 'int', value: 0 },
        b: { type: 'int', value: 0 },
      },
      heap: {},
    },
  },
  {
    code: `(a = 1) + (a = 2)`,
    output: { type: 'int', value: 3 },
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `(a = 1) + (a = 2) + a`,
    output: { type: 'int', value: 5 },
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a = (a = 5)`,
    output: { type: 'int', value: 5 },
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  // ------------------------- constant folding interaction -------------------------
  {
    code: `a = 3 + 4`,
    output: { type: 'int', value: 7 },
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a = 1 + 2 * 3`,
    output: { type: 'int', value: 7 },
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  // ------------------------- assignment binds looser than ternary -------------------------
  {
    code: `a = true ? 1 : 2`,
    output: { type: 'int', value: 1 },
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a = false ? 1 : 2`,
    output: { type: 'int', value: 2 },
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a = 1 < 2 ? 3 : 4`,
    output: { type: 'int', value: 3 },
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  // ------------------------- assignability through identifiers -------------------------
  {
    code: `a = b`,
    output: { type: 'int', value: 5 },
    env: {
      local: {
        a: { type: 'int', value: 0 },
        b: { type: 'int', value: 5 },
      },
      heap: {},
    },
  },
  {
    code: `a = b`,
    output: { type: 'long', value: '5' },
    env: {
      local: {
        a: { type: 'long', value: '0' },
        b: { type: 'int', value: 5 },
      },
      heap: {},
    },
  },
  {
    code: `a = b`,
    output: { type: 'double', value: 1.5 },
    env: {
      local: {
        a: { type: 'double', value: 0 },
        b: { type: 'float', value: 1.5 },
      },
      heap: {},
    },
  },
  {
    code: `a = b`,
    output: { type: 'double', value: 5 },
    env: {
      local: {
        a: { type: 'double', value: 0 },
        b: { type: 'long', value: '5' },
      },
      heap: {},
    },
  },
  {
    code: `a = b`,
    output: { type: 'float', value: 5 },
    env: {
      local: {
        a: { type: 'float', value: 0 },
        b: { type: 'long', value: '5' },
      },
      heap: {},
    },
  },
  {
    code: `a = b`,
    output: { type: 'int', value: 65 },
    env: {
      local: {
        a: { type: 'int', value: 0 },
        b: { type: 'char', value: 65 },
      },
      heap: {},
    },
  },
  {
    code: `a = b`,
    output: { type: 'short', value: 5 },
    env: {
      local: {
        a: { type: 'short', value: 0 },
        b: { type: 'byte', value: 5 },
      },
      heap: {},
    },
  },
  {
    code: `a = b`,
    output: { type: 'int', value: 5 },
    env: {
      local: {
        a: { type: 'int', value: 0 },
        b: { type: 'short', value: 5 },
      },
      heap: {},
    },
  },
  {
    code: `a = b`,
    output: { type: 'long', value: '5' },
    env: {
      local: {
        a: { type: 'long', value: '0' },
        b: { type: 'short', value: 5 },
      },
      heap: {},
    },
  },
  {
    code: `a = b`,
    output: { type: 'char', value: 65 },
    env: {
      local: {
        a: { type: 'char', value: 0 },
        b: { type: 'char', value: 65 },
      },
      heap: {},
    },
  },
  {
    code: `a = b`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'boolean', value: false },
        b: { type: 'boolean', value: true },
      },
      heap: {},
    },
  },
  {
    code: `a = b`,
    error: 'compile',
    env: {
      local: {
        a: { type: 'int', value: 0 },
        b: { type: 'long', value: '5' },
      },
      heap: {},
    },
  },
  {
    code: `a = b`,
    error: 'compile',
    env: {
      local: {
        a: { type: 'int', value: 0 },
        b: { type: 'double', value: 5 },
      },
      heap: {},
    },
  },
  {
    code: `a = b`,
    error: 'compile',
    env: {
      local: {
        a: { type: 'float', value: 0 },
        b: { type: 'double', value: 5 },
      },
      heap: {},
    },
  },
  {
    code: `a = b`,
    error: 'compile',
    env: {
      local: {
        a: { type: 'char', value: 0 },
        b: { type: 'int', value: 65 },
      },
      heap: {},
    },
  },
  {
    code: `a = b`,
    error: 'compile',
    env: {
      local: {
        a: { type: 'int', value: 0 },
        b: { type: 'boolean', value: true },
      },
      heap: {},
    },
  },
  {
    code: `a = b`,
    error: 'compile',
    env: {
      local: {
        a: { type: 'boolean', value: false },
        b: { type: 'int', value: 1 },
      },
      heap: {},
    },
  },
  {
    code: `a = b`,
    error: 'compile',
    env: {
      local: {
        a: { type: 'byte', value: 0 },
        b: { type: 'short', value: 5 },
      },
      heap: {},
    },
  },
  {
    code: `a = b`,
    error: 'compile',
    env: {
      local: {
        a: { type: 'long', value: '0' },
        b: { type: 'float', value: 5 },
      },
      heap: {},
    },
  },
  {
    code: `a = b`,
    output: { type: '__str', value: 'hi' },
    env: {
      local: {
        a: { type: 'reference', ref: 'ha' },
        b: { type: 'reference', ref: 'hb' },
      },
      heap: {
        ha: { class: 'java.lang.String', value: 'old', isInterned: true },
        hb: { class: 'java.lang.String', value: 'hi', isInterned: true },
      },
    },
  },
  {
    code: `a = b`,
    error: 'compile',
    env: {
      local: {
        a: { type: 'int', value: 0 },
        b: { type: 'reference', ref: 'hb' },
      },
      heap: { hb: { class: 'java.lang.String', value: 'hi', isInterned: true } },
    },
  },
  {
    code: `a = b`,
    error: 'compile',
    env: {
      local: {
        a: { type: 'reference', ref: 'ha' },
        b: { type: 'int', value: 5 },
      },
      heap: { ha: { class: 'java.lang.String', value: 'old', isInterned: true } },
    },
  },
  // ------------------------- boxing / unboxing through identifiers -------------------------
  {
    code: `a = b`,
    output: { type: 'int', value: 5 },
    env: {
      local: {
        a: { type: 'int', value: 0, boxed: true },
        b: { type: 'int', value: 5 },
      },
      heap: {},
    },
  },
  {
    code: `a = b`,
    output: { type: 'int', value: 5 },
    env: {
      local: {
        a: { type: 'int', value: 0 },
        b: { type: 'int', value: 5, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `a = b`,
    output: { type: 'int', value: 5 },
    env: {
      local: {
        a: { type: 'int', value: 0, boxed: true },
        b: { type: 'int', value: 5, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `a = b`,
    error: 'compile',
    env: {
      local: {
        a: { type: 'int', value: 0, boxed: true },
        b: { type: 'long', value: '5', boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `a = 5`,
    output: { type: 'int', value: 5 },
    env: { local: { a: { type: 'int', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `a = 5L`,
    output: { type: 'long', value: '5' },
    env: { local: { a: { type: 'long', value: '0', boxed: true } }, heap: {} },
  },
  {
    code: `a = 5`,
    error: 'compile',
    env: { local: { a: { type: 'long', value: '0', boxed: true } }, heap: {} },
  },
  {
    code: `a = 5`,
    error: 'compile',
    env: { local: { a: { type: 'double', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `a = 5`,
    error: 'compile',
    env: { local: { a: { type: 'float', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `a = 100`,
    output: { type: 'byte', value: 100 },
    env: { local: { a: { type: 'byte', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `a = 128`,
    error: 'compile',
    env: { local: { a: { type: 'byte', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `a = 5`,
    output: { type: 'short', value: 5 },
    env: { local: { a: { type: 'short', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `a = 65`,
    output: { type: 'char', value: 65 },
    env: { local: { a: { type: 'char', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `a = 'A'`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `a = (short)5`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `a = true`,
    output: { type: 'boolean', value: true },
    env: { local: { a: { type: 'boolean', value: false, boxed: true } }, heap: {} },
  },
  {
    code: `a = 1`,
    error: 'compile',
    env: { local: { a: { type: 'boolean', value: false, boxed: true } }, heap: {} },
  },
  // ------------------------- invalid left-hand sides -------------------------
  {
    code: `5 = 3`,
    error: 'compile',
  },
  {
    code: `true = false`,
    error: 'compile',
  },
  {
    code: `(a + 1) = 3`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a + b = 3`,
    error: 'compile',
    env: {
      local: {
        a: { type: 'int', value: 0 },
        b: { type: 'int', value: 0 },
      },
      heap: {},
    },
  },
  {
    code: `-a = 3`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `a++ = 3`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `++a = 3`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `z = 1`,
    error: 'compile',
  },
  {
    code: `a =`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0 } }, heap: {} },
  },
  {
    code: `= 3`,
    error: 'compile',
  },
]
