import type { TestSuiteEntry } from '../../state/types'

export const boxedBoxing: TestSuiteEntry[] = [
  // ==================== CACHE BOUNDARIES & COMPUTED BOXING ====================
  // Autoboxing routes through valueOf(), so the cache boundary matters on both sides of the
  // range and for every wrapper. The same is true when the boxed operand is not a literal
  // but the *result* of an arithmetic expression: the computed primitive is cached by value,
  // not by expression, so `100 + 1` shares with a literal `101` while `1000 + 1` does not.
  // ------------------------- Long / Short cache boundaries -------------------------
  {
    code: `(true ? 127L : null) == (true ? 127L : null)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? -128L : null) == (true ? -128L : null)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? -129L : null) == (true ? -129L : null)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? (short)127 : null) == (true ? (short)127 : null)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? (short)-128 : null) == (true ? (short)-128 : null)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? (short)-129 : null) == (true ? (short)-129 : null)`,
    output: { type: 'boolean', value: false },
  },
  // ------------------------- Integer / Character zero and cache edges -------------------------
  {
    code: `(true ? 0 : null) == (true ? 0 : null)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? (char)0 : null) == (true ? (char)0 : null)`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- computed boxing: cached result -------------------------
  {
    code: `(true ? a + 1 : null) == (true ? 101 : null)`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'int', value: 100, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(true ? a + 1 : null) == (true ? b + 1 : null)`,
    output: { type: 'boolean', value: true },
    env: {
      local: {
        a: { type: 'int', value: 100, boxed: true },
        b: { type: 'int', value: 100, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(true ? 1 + 1 : null) == (true ? 2 : null)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? 128 - 1 : null) == (true ? 127 : null)`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(true ? a * 0 : null) == (true ? 0 : null)`,
    output: { type: 'boolean', value: true },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(true ? (short)126 + 1 : null) == (true ? 127 : null)`,
    output: { type: 'boolean', value: true },
  },
  // ------------------------- computed boxing: out-of-cache result -------------------------
  {
    code: `(true ? a + 1 : null) == (true ? a + 1 : null)`,
    output: { type: 'boolean', value: false },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(true ? a + 1 : null) == (true ? b + 1 : null)`,
    output: { type: 'boolean', value: false },
    env: {
      local: {
        a: { type: 'int', value: 1000, boxed: true },
        b: { type: 'int', value: 1000, boxed: true },
      },
      heap: {},
    },
  },
  {
    code: `(true ? a + 1 : null) == (true ? 1001 : null)`,
    output: { type: 'boolean', value: false },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(true ? 1000 + 0 : null) == (true ? 1000 : null)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? 1000 - 1 : null) == (true ? 999 : null)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? 129 - 1 : null) == (true ? 128 : null)`,
    output: { type: 'boolean', value: false },
  },
  {
    code: `(true ? 1000 - 1 : null) == (true ? 1000 - 1 : null)`,
    output: { type: 'boolean', value: false },
  },
]
