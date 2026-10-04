import type { TestSuiteEntry } from '../../state/types'

// ==================== BOXED-LOCAL ASSIGNMENT: WRAPPER IDENTITY & CACHES ====================
// Assigning to a wrapper local autoboxes through `valueOf`, so the JVM caches decide the
// identity of the result: Integer/Short/Long share -128..127, Character 0..127, Byte its
// whole range, Boolean its two singletons, and Float/Double are never cached. Comparing two
// *assignment results* with `==` therefore probes both the boxing cache and the evaluation
// order. Compound assignment and ++/-- re-box on every store, and a postfix increment keeps
// the old reference while a prefix one returns the freshly boxed value.
export const assignmentBoxed: TestSuiteEntry[] = [
  // ------------------------- Integer cache through assignment results -------------------------
  {
    code: `(a = 100) == (b = 100)`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'int', value: 0, boxed: true },
        b: { type: 'int', value: 0, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(a = 1000) == (b = 1000)`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'int', value: 0, boxed: true },
        b: { type: 'int', value: 0, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(a = 0) == (b = 0)`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'int', value: 9, boxed: true },
        b: { type: 'int', value: 9, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(a = -128) == (b = -128)`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'int', value: 0, boxed: true },
        b: { type: 'int', value: 0, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(a = 127) == (b = 127)`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'int', value: 0, boxed: true },
        b: { type: 'int', value: 0, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(a = 128) == (b = 128)`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'int', value: 0, boxed: true },
        b: { type: 'int', value: 0, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(a = -129) == (b = -129)`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'int', value: 0, boxed: true },
        b: { type: 'int', value: 0, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(a = 5) != (b = 5)`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'int', value: 0, boxed: true },
        b: { type: 'int', value: 0, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(a = 1000) != (b = 1000)`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'int', value: 0, boxed: true },
        b: { type: 'int', value: 0, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(a = 100) == a`,
    output: { type: 'boolean', value: true },
    env: { local: { a: { type: 'int', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `(a = 1000) == a`,
    output: { type: 'boolean', value: true },
    env: { local: { a: { type: 'int', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `(a = 1000) == (a = 1000)`,
    output: { type: 'boolean', value: false },
    env: { local: { a: { type: 'int', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `(a = 100) == (a = 100)`,
    output: { type: 'boolean', value: true },
    env: { local: { a: { type: 'int', value: 0, boxed: true } }, heap: {} },
  },
  // ------------------------- Byte caches its whole range -------------------------
  {
    code: `(a = (byte)100) == (b = (byte)100)`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'byte', value: 0, boxed: true },
        b: { type: 'byte', value: 0, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(a = (byte)-100) == (b = (byte)-100)`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'byte', value: 0, boxed: true },
        b: { type: 'byte', value: 0, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(a = (byte)100) == (b = (byte)-100)`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'byte', value: 0, boxed: true },
        b: { type: 'byte', value: 0, boxed: true },
      },
      heap: {},
    },
  },
  // ------------------------- Short / Long cache -128..127 -------------------------
  {
    code: `(a = (short)100) == (b = (short)100)`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'short', value: 0, boxed: true },
        b: { type: 'short', value: 0, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(a = (short)1000) == (b = (short)1000)`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'short', value: 0, boxed: true },
        b: { type: 'short', value: 0, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(a = 100L) == (b = 100L)`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'long', value: '0', boxed: true },
        b: { type: 'long', value: '0', boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(a = 1000L) == (b = 1000L)`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'long', value: '0', boxed: true },
        b: { type: 'long', value: '0', boxed: true },
      },
      heap: {},
    },
  },
  // ------------------------- Character cache 0..127 -------------------------
  {
    code: `(a = (char)100) == (b = (char)100)`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'char', value: 0, boxed: true },
        b: { type: 'char', value: 0, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(a = (char)127) == (b = (char)127)`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'char', value: 0, boxed: true },
        b: { type: 'char', value: 0, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(a = (char)128) == (b = (char)128)`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'char', value: 0, boxed: true },
        b: { type: 'char', value: 0, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(a = (char)1000) == (b = (char)1000)`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'char', value: 0, boxed: true },
        b: { type: 'char', value: 0, boxed: true },
      },
      heap: {},
    },
  },
  // ------------------------- Boolean singletons -------------------------
  {
    code: `(a = true) == (b = true)`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'boolean', value: false, boxed: true },
        b: { type: 'boolean', value: false, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(a = false) == (b = false)`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'boolean', value: true, boxed: true },
        b: { type: 'boolean', value: true, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(a = true) == (b = false)`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'boolean', value: false, boxed: true },
        b: { type: 'boolean', value: false, boxed: true },
      },
      heap: {},
    },
  },
  // ------------------------- Float / Double are never cached -------------------------
  {
    code: `(a = 1.5f) == (b = 1.5f)`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'float', value: 0, boxed: true },
        b: { type: 'float', value: 0, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(a = 1.5) == (b = 1.5)`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'double', value: 0, boxed: true },
        b: { type: 'double', value: 0, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(a = 0f) == (b = 0f)`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'float', value: 0, boxed: true },
        b: { type: 'float', value: 0, boxed: true },
      },
      heap: {},
    },
  },
  // ------------------------- re-boxing through compound assignment -------------------------
  {
    code: `(a = 100) == (a += 0)`,
    output: { type: 'boolean', value: true },
    env: { local: { a: { type: 'int', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `(a = 1000) == (a += 0)`,
    output: { type: 'boolean', value: false },
    env: { local: { a: { type: 'int', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `(a = 100) == (a *= 1)`,
    output: { type: 'boolean', value: true },
    env: { local: { a: { type: 'int', value: 1, boxed: true } }, heap: {} },
  },
  {
    code: `(a = 1000) == (a *= 1)`,
    output: { type: 'boolean', value: false },
    env: { local: { a: { type: 'int', value: 1, boxed: true } }, heap: {} },
  },
  {
    code: `(a = 100) == (a -= 0)`,
    output: { type: 'boolean', value: true },
    env: { local: { a: { type: 'int', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `(a = 1000) == (a -= 0)`,
    output: { type: 'boolean', value: false },
    env: { local: { a: { type: 'int', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `(a = 100) == (a += 1)`,
    output: { type: 'boolean', value: false },
    env: { local: { a: { type: 'int', value: 0, boxed: true } }, heap: {} },
  },
  // ------------------------- einfache Zuweisung zwischen Wrapper-Variablen -------------------------
  // `a = b` bei zwei Wrapper-Variablen kopiert die Referenz; es wird nicht neu geboxt. Darum
  // sind beide Schreibweisen identisch -- auch fuer Werte ausserhalb des Cache.
  {
    code: `(a = b) == b`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'int', value: 0, boxed: true },
        b: { type: 'int', value: 1000, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(a = b) == b`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'int', value: 0, boxed: true },
        b: { type: 'int', value: 100, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(a = null) == null`,
    output: { type: 'boolean', value: true },
    env: { local: { a: { type: 'int', value: 7, boxed: true } }, heap: {} },
  },
  // ------------------------- re-boxing through ++/-- -------------------------
  {
    code: `(a = 100) == (a++)`,
    output: { type: 'boolean', value: true },
    env: { local: { a: { type: 'int', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `(a = 1000) == (a++)`,
    output: { type: 'boolean', value: true },
    env: { local: { a: { type: 'int', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `(a = 100) == (++a)`,
    output: { type: 'boolean', value: false },
    env: { local: { a: { type: 'int', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `(a = 1000) == (++a)`,
    output: { type: 'boolean', value: false },
    env: { local: { a: { type: 'int', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `(a = 1000) == (a--)`,
    output: { type: 'boolean', value: true },
    env: { local: { a: { type: 'int', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `(a = 1000) == (--a)`,
    output: { type: 'boolean', value: false },
    env: { local: { a: { type: 'int', value: 0, boxed: true } }, heap: {} },
  },
  // ------------------------- wrapper increment / decrement for every wrapper type -------------------------
  {
    code: `a++`,
    output: { type: 'byte', value: 100 },
    env: { local: { a: { type: 'byte', value: 100, boxed: true } }, heap: {} },
  },
  {
    code: `a++ + a`,
    output: { type: 'int', value: 201 },
    env: { local: { a: { type: 'byte', value: 100, boxed: true } }, heap: {} },
  },
  {
    code: `a++ + a`,
    output: { type: 'int', value: -1 },
    env: { local: { a: { type: 'byte', value: 127, boxed: true } }, heap: {} },
  },
  {
    code: `a++`,
    output: { type: 'short', value: 100 },
    env: { local: { a: { type: 'short', value: 100, boxed: true } }, heap: {} },
  },
  {
    code: `a++`,
    output: { type: 'char', value: 100 },
    env: { local: { a: { type: 'char', value: 100, boxed: true } }, heap: {} },
  },
  {
    code: `a++ + a`,
    output: { type: 'int', value: 201 },
    env: { local: { a: { type: 'char', value: 100, boxed: true } }, heap: {} },
  },
  {
    code: `a--`,
    output: { type: 'long', value: '100' },
    env: { local: { a: { type: 'long', value: '100', boxed: true } }, heap: {} },
  },
  {
    code: `a++`,
    output: { type: 'float', value: 1.5 },
    env: { local: { a: { type: 'float', value: 1.5, boxed: true } }, heap: {} },
  },
  {
    code: `a++ + a`,
    output: { type: 'float', value: 4 },
    env: { local: { a: { type: 'float', value: 1.5, boxed: true } }, heap: {} },
  },
  {
    code: `a++`,
    output: { type: 'double', value: 1.5 },
    env: { local: { a: { type: 'double', value: 1.5, boxed: true } }, heap: {} },
  },
  {
    code: `a++ + a`,
    output: { type: 'double', value: 4 },
    env: { local: { a: { type: 'double', value: 1.5, boxed: true } }, heap: {} },
  },
  // ------------------------- assignment result values & types -------------------------
  {
    code: `a = 100`,
    output: { type: 'int', value: 100 },
    env: { local: { a: { type: 'int', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `a = 1000`,
    output: { type: 'int', value: 1000 },
    env: { local: { a: { type: 'int', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `a += 1`,
    output: { type: 'int', value: 101 },
    env: { local: { a: { type: 'int', value: 100, boxed: true } }, heap: {} },
  },
  {
    code: `(a = 1000) + 1`,
    output: { type: 'int', value: 1001 },
    env: { local: { a: { type: 'int', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `(a = 5L) + 1`,
    output: { type: 'long', value: '6' },
    env: { local: { a: { type: 'long', value: '0', boxed: true } }, heap: {} },
  },
  {
    code: `a = 100L`,
    output: { type: 'long', value: '100' },
    env: { local: { a: { type: 'long', value: '0', boxed: true } }, heap: {} },
  },
  {
    code: `a = (byte)100`,
    output: { type: 'byte', value: 100 },
    env: { local: { a: { type: 'byte', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `a = 65`,
    output: { type: 'char', value: 65 },
    env: { local: { a: { type: 'char', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `a = true`,
    output: { type: 'boolean', value: true },
    env: { local: { a: { type: 'boolean', value: false, boxed: true } }, heap: {} },
  },
  {
    code: `a = 1.5f`,
    output: { type: 'float', value: 1.5 },
    env: { local: { a: { type: 'float', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `a = 1.5`,
    output: { type: 'double', value: 1.5 },
    env: { local: { a: { type: 'double', value: 0, boxed: true } }, heap: {} },
  },
  // ------------------------- unboxing/numeric comparison across wrapper & primitive -------------------------
  {
    code: `(a = 1000) == 1000`,
    output: { type: 'boolean', value: true },
    env: { local: { a: { type: 'int', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `(a = 1000) == 1000L`,
    output: { type: 'boolean', value: true },
    env: { local: { a: { type: 'int', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `(a = 100) == 100`,
    output: { type: 'boolean', value: true },
    env: { local: { a: { type: 'int', value: 0, boxed: true } }, heap: {} },
  },
  // ------------------------- identity through the ternary null trick -------------------------
  {
    code: `(a = 100) == (true ? 100 : null)`,
    output: { type: 'boolean', value: true },
    env: { local: { a: { type: 'int', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `(a = 1000) == (true ? 1000 : null)`,
    output: { type: 'boolean', value: false },
    env: { local: { a: { type: 'int', value: 0, boxed: true } }, heap: {} },
  },
  // ------------------------- String reference assignment identity -------------------------
  {
    code: `(s = "x") == s`,
    output: { type: 'boolean', value: true },
    env: {
      local: { s: { type: 'reference', ref: 'h' } },
      heap: { h: { class: 'java.lang.String', value: 'old', isInterned: true } },
    },
  },
  {
    code: `(s = "x") == "x"`,
    output: { type: 'boolean', value: true },
    env: {
      local: { s: { type: 'reference', ref: 'h' } },
      heap: { h: { class: 'java.lang.String', value: 'old', isInterned: true } },
    },
  },
  {
    code: `(s = t) == t`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        s: { type: 'reference', ref: 'hs' },
        t: { type: 'reference', ref: 'ht' },
      },
      heap: {
        hs: { class: 'java.lang.String', value: 'a', isInterned: true },
        ht: { class: 'java.lang.String', value: 'xy', isInterned: true },
      },
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
  // ------------------------- boxed assignment compile errors -------------------------
  {
    code: `a = "x"`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `a = 1.5`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `a = 1`,
    error: 'compile',
    env: { local: { a: { type: 'double', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `a = 1`,
    error: 'compile',
    env: { local: { a: { type: 'float', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `a = 5`,
    error: 'compile',
    env: { local: { a: { type: 'long', value: '0', boxed: true } }, heap: {} },
  },
  {
    code: `a = 128`,
    error: 'compile',
    env: { local: { a: { type: 'byte', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `a = 1`,
    error: 'compile',
    env: { local: { a: { type: 'boolean', value: false, boxed: true } }, heap: {} },
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
    code: `a += 1`,
    error: 'compile',
    env: { local: { a: { type: 'byte', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `a += 1`,
    error: 'compile',
    env: { local: { a: { type: 'short', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `a += 1`,
    error: 'compile',
    env: { local: { a: { type: 'char', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `a += 1.5`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `a += 1L`,
    error: 'compile',
    env: { local: { a: { type: 'int', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `a += 1.5`,
    error: 'compile',
    env: { local: { a: { type: 'long', value: '0', boxed: true } }, heap: {} },
  },
  {
    code: `a += 1.5`,
    error: 'compile',
    env: { local: { a: { type: 'float', value: 0, boxed: true } }, heap: {} },
  },
  {
    code: `a == b`,
    error: 'compile',
    env: {
      local: {
        a: { type: 'int', value: 100, boxed: true },
        b: { type: 'long', value: '100', boxed: true },
      },
      heap: {},
    },
  },
]
