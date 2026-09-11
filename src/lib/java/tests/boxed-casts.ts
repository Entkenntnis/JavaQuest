import type { TestSuiteEntry } from '../../state/types'

export const boxedCasts: TestSuiteEntry[] = [
  // ==================== CASTS OF BOXED VALUES ====================
  // JLS 5.5: casting a *reference* to a primitive is an unboxing conversion optionally
  // followed by a *widening* primitive conversion -- never a narrowing one. The reference
  // can be a wrapper-typed or lub-typed conditional (`(cond ? <prim> : null)` /
  // `: false` / `: "x"`), or a wrapper local fed through `env.local`. These entries fill
  // the cast targets the other boxed suites leave out, and pin what happens when a cast
  // is not the outermost node (it must yield a primitive, not a wrapper reference).
  // ------------------------- successful widening / identity casts -------------------------
  {
    code: `(double)(true ? 1.5f : null)`,
    output: { type: 'double', value: 1.5 },
  },
  {
    code: `(float)(true ? 1.5f : null)`,
    output: { type: 'float', value: 1.5 },
  },
  {
    code: `(double)(true ? 5.0 : null)`,
    output: { type: 'double', value: 5 },
  },
  {
    code: `(float)(true ? 5.0f : null)`,
    output: { type: 'float', value: 5 },
  },
  // Character widens to int/long/float/double ...
  {
    code: `(int)(true ? 'a' : null)`,
    output: { type: 'int', value: 97 },
  },
  {
    code: `(long)(true ? 'a' : null)`,
    output: { type: 'long', value: '97' },
  },
  {
    code: `(float)(true ? 'a' : null)`,
    output: { type: 'float', value: 97 },
  },
  {
    code: `(double)(true ? 'a' : null)`,
    output: { type: 'double', value: 97 },
  },
  {
    code: `(double)(true ? (char)65 : null)`,
    output: { type: 'double', value: 65 },
  },
  {
    code: `(long)(true ? (char)65 : null)`,
    output: { type: 'long', value: '65' },
  },
  // ... and Byte widens to short/int/long/float/double.
  {
    code: `(short)(true ? (byte)5 : null)`,
    output: { type: 'short', value: 5 },
  },
  {
    code: `(float)(true ? (short)300 : null)`,
    output: { type: 'float', value: 300 },
  },
  {
    code: `(double)(true ? (short)300 : null)`,
    output: { type: 'double', value: 300 },
  },
  {
    code: `(double)(true ? (byte)100 : null)`,
    output: { type: 'double', value: 100 },
  },
  // ------------------------- narrowing after unbox: compile errors -------------------------
  {
    code: `(short)(true ? 'a' : null)`,
    error: 'compile',
  },
  {
    code: `(byte)(true ? 'a' : null)`,
    error: 'compile',
  },
  {
    code: `(char)(true ? (byte)5 : null)`,
    error: 'compile',
  },
  {
    code: `(byte)(true ? (char)5 : null)`,
    error: 'compile',
  },
  {
    code: `(short)(true ? (char)5 : null)`,
    error: 'compile',
  },
  {
    code: `(char)(true ? (short)5 : null)`,
    error: 'compile',
  },
  {
    code: `(byte)(true ? (short)5 : null)`,
    error: 'compile',
  },
  {
    code: `(int)(true ? 5.0 : null)`,
    error: 'compile',
  },
  {
    code: `(long)(true ? 5.0 : null)`,
    error: 'compile',
  },
  {
    code: `(float)(true ? 5.0 : null)`,
    error: 'compile',
  },
  {
    code: `(int)(true ? 5.0f : null)`,
    error: 'compile',
  },
  {
    code: `(long)(true ? 5.0f : null)`,
    error: 'compile',
  },
  {
    code: `(boolean)(true ? 1 : null)`,
    error: 'compile',
  },
  {
    code: `(boolean)(true ? 100 : null)`,
    error: 'compile',
  },
  // ------------------------- casts of wrapper locals -------------------------
  {
    code: `(int)a`,
    output: { type: 'int', value: 1000 },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(long)a`,
    output: { type: 'long', value: '1000' },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(double)a`,
    output: { type: 'double', value: 1000 },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(float)a`,
    output: { type: 'float', value: 1000 },
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(byte)a`,
    error: 'compile',
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(short)a`,
    error: 'compile',
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(char)a`,
    error: 'compile',
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(boolean)a`,
    error: 'compile',
    env: {
      local: { a: { type: 'int', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(int)ch`,
    output: { type: 'int', value: 1000 },
    env: {
      local: { ch: { type: 'char', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(long)ch`,
    output: { type: 'long', value: '1000' },
    env: {
      local: { ch: { type: 'char', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(float)ch`,
    output: { type: 'float', value: 1000 },
    env: {
      local: { ch: { type: 'char', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(double)ch`,
    output: { type: 'double', value: 1000 },
    env: {
      local: { ch: { type: 'char', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(short)ch`,
    error: 'compile',
    env: {
      local: { ch: { type: 'char', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(byte)ch`,
    error: 'compile',
    env: {
      local: { ch: { type: 'char', value: 1000, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(short)b`,
    output: { type: 'short', value: 100 },
    env: {
      local: { b: { type: 'byte', value: 100, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(int)b`,
    output: { type: 'int', value: 100 },
    env: {
      local: { b: { type: 'byte', value: 100, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(long)b`,
    output: { type: 'long', value: '100' },
    env: {
      local: { b: { type: 'byte', value: 100, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(char)b`,
    error: 'compile',
    env: {
      local: { b: { type: 'byte', value: 100, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(double)l`,
    output: { type: 'double', value: 1000 },
    env: {
      local: { l: { type: 'long', value: '1000', boxed: true } },
      heap: {},
    },
  },
  {
    code: `(float)l`,
    output: { type: 'float', value: 1000 },
    env: {
      local: { l: { type: 'long', value: '1000', boxed: true } },
      heap: {},
    },
  },
  {
    code: `(int)l`,
    error: 'compile',
    env: {
      local: { l: { type: 'long', value: '1000', boxed: true } },
      heap: {},
    },
  },
  {
    code: `(double)f`,
    output: { type: 'double', value: 1.5 },
    env: {
      local: { f: { type: 'float', value: 1.5, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(float)f`,
    output: { type: 'float', value: 1.5 },
    env: {
      local: { f: { type: 'float', value: 1.5, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(int)f`,
    error: 'compile',
    env: {
      local: { f: { type: 'float', value: 1.5, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(double)d`,
    output: { type: 'double', value: 1.5 },
    env: {
      local: { d: { type: 'double', value: 1.5, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(int)d`,
    error: 'compile',
    env: {
      local: { d: { type: 'double', value: 1.5, boxed: true } },
      heap: {},
    },
  },
  {
    code: `(boolean)boolA`,
    output: { type: 'boolean', value: true },
    env: {
      local: { boolA: { type: 'boolean', value: true, boxed: true } },
      heap: {},
    },
  },
  // ------------------------- a target-typed cast is a primitive, not a wrapper -------------------------
  // The unboxing cast of a lub-typed conditional must produce the primitive value so it can
  // feed another operator. (Currently the evaluator hands back the wrapper reference, so
  // these pin the difference.)
  {
    code: `(int)(true ? 1000 : false) + 1`,
    output: { type: 'int', value: 1001 },
  },
  {
    code: `(int)(true ? 1000 : false) == 1000`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(int)(true ? 1000 : false) > 999`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(int)(true ? 1000 : false) * 2`,
    output: { type: 'int', value: 2000 },
  },
  {
    code: `(int)(true ? 1000 : false) - (int)(true ? 400 : false)`,
    output: { type: 'int', value: 600 },
  },
  {
    code: `(boolean)(true ? true : 1) == true`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(boolean)(true ? true : 1) && true`,
    output: { type: 'boolean', value: true },
  },
  {
    code: `(double)(true ? 1.5 : false) + 0.5`,
    output: { type: 'double', value: 2 },
  },
  {
    code: `(int)(true ? 1000 : "x") + 1`,
    output: { type: 'int', value: 1001 },
  },
  {
    code: `(int)(true ? 1000 : "x") == 1000`,
    output: { type: 'boolean', value: true },
  },
]
