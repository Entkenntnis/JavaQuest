import type { TestSuiteEntry } from '../../state/types'

export const boxedConditionals: TestSuiteEntry[] = [
  // ==================== BOXED VALUES IN THE CONDITIONAL OPERATOR ====================
  // JLS 15.25 classifies `a ? b : c` as a boolean, numeric or reference conditional. A
  // wrapper operand participates through unboxing (numeric / boolean conditional) or is
  // boxed into the lub (reference conditional). These entries mix wrapper locals with
  // primitives of every width, mix different wrapper types, nest conditionals, and use a
  // wrapper conditional as the condition of another conditional.
  // ------------------------- numeric conditional: wrapper local + primitive -------------------------
  {
    code: `(true ? a : 0) == 1000`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(false ? a : 0) == 0`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(true ? a : 0L) == 1000L`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(true ? a : 0.0) == 1000.0`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(true ? a : 0.0f) == 1000.0f`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(true ? a : 'a') == 1000`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(true ? ch : 0) == 1000`,
    output: { type: 'boolean', value: true },
    env: {
      local: { ch: { type: 'char', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(false ? a : 5) == 5`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(true ? a : 5) == 5`,
    output: { type: 'boolean', value: false },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  // ------------------------- numeric conditional: two wrapper locals -------------------------
  {
    code: `(true ? a : b) + 1`,
    output: { type: 'int', value: 1001 },
    env: {
      local: {
        a: { type: 'int', value: 1000, boxed: true },
        b: { type: 'int', value: 5, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(false ? a : b) + 1`,
    output: { type: 'int', value: 6 },
    env: {
      local: {
        a: { type: 'int', value: 1000, boxed: true },
        b: { type: 'int', value: 5, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(true ? a : b) == 1000`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'int', value: 1000, boxed: true },
        b: { type: 'int', value: 5, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(false ? a : b) == 1000`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'int', value: 1000, boxed: true },
        b: { type: 'int', value: 5, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(true ? a : b) == (true ? a : b)`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'int', value: 1000, boxed: true },
        b: { type: 'int', value: 5, boxed: true },
      },
      heap: {},
    },
  },
  // ------------------------- numeric conditional: two different wrapper types -------------------------
  {
    code: `(true ? a : b) == 100`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'int', value: 100, boxed: true },
        b: { type: 'short', value: 100, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(true ? a : b) == 100`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'int', value: 100, boxed: true },
        b: { type: 'long', value: '100', boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(true ? a : b) == 100.0`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'int', value: 100, boxed: true },
        b: { type: 'double', value: 100.0, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(true ? a : b) == 100`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'char', value: 100, boxed: true },
        b: { type: 'byte', value: 100, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(false ? a : b) == 100`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'int', value: 100, boxed: true },
        b: { type: 'long', value: '100', boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(true ? a : b) == 100.0`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'int', value: 100, boxed: true },
        b: { type: 'float', value: 100.0, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(true ? a : b) == 100`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'int', value: 100, boxed: true },
        b: { type: 'double', value: 100.0, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(true ? a : b) == 100.0`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'long', value: '100', boxed: true },
        b: { type: 'double', value: 100.0, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(true ? a : b) == 100.0`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'char', value: 100, boxed: true },
        b: { type: 'double', value: 100.0, boxed: true },
      },
      heap: {},
    },
  },
  // The promoted result type is observable through the value it produces.
  {
    code: `(true ? a : b) + 0`,
    output: { type: 'long', value: '100' },
    env: {
      local: {
        a: { type: 'int', value: 100, boxed: true },
        b: { type: 'long', value: '100', boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(true ? a : b) + 0`,
    output: { type: 'double', value: 100 },
    env: {
      local: {
        a: { type: 'int', value: 100, boxed: true },
        b: { type: 'double', value: 100.0, boxed: true },
      },
      heap: {},
    },
  },
  // ------------------------- reference (lub) conditional with a wrapper -------------------------
  {
    code: `(true ? a : true) == a`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(true ? a : "x") + ""`,
    output: { type: '__str', value: '1000' },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `"" + (true ? a : "x")`,
    output: { type: '__str', value: '1000' },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  // The lub is not unboxable, so a numeric operator on it is a compile error.
  {
    code: `(true ? a : true) + 1`,
    error: 'compile',
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(true ? a : "x") + 1`,
    error: 'compile',
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  // ------------------------- nested conditionals with wrappers -------------------------
  {
    code: `(true ? (true ? a : null) : false) == (true ? a : null)`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(true ? (true ? a : null) : null) == a`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(true ? (true ? a : null) : 5) == 1000`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(false ? (true ? a : null) : (true ? b : null)) == 5`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'int', value: 1000, boxed: true },
        b: { type: 'int', value: 5, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(true ? (true ? a : null) : false) + 1`,
    error: 'compile',
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  // ------------------------- a wrapper conditional as a boolean condition -------------------------
  {
    code: `(true ? a : null) ? 1 : 2`,
    output: { type: 'int', value: 1 },
    env: {
      local: { a: { type: 'boolean', value: true, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(false ? a : null) ? 1 : 2`,
    error: 'runtime',
    env: {
      local: { a: { type: 'boolean', value: true, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(true ? a : true) ? 1 : 2`,
    output: { type: 'int', value: 1 },
    env: {
      local: { a: { type: 'boolean', value: true, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(true ? a : b) ? 1 : 2`,
    output: { type: 'int', value: 1 },
    env: {
      local: {
        a: { type: 'boolean', value: true, boxed: true },
        b: { type: 'boolean', value: false, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(true ? a : false) ? 1 : 2`,
    output: { type: 'int', value: 1 },
    env: {
      local: { a: { type: 'boolean', value: true, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(false ? a : false) ? 1 : 2`,
    output: { type: 'int', value: 2 },
    env: {
      local: { a: { type: 'boolean', value: true, boxed: true } },
      heap: {},
    },
  },
]
