import type { TestSuiteEntry } from '../../state/types'

export const mathSymbol: TestSuiteEntry[] = [
  // ==================== THE `Math` SYMBOL ====================
  // In Java `Math` is a *type name*, not a value. It is only legal as the receiver of a
  // static member access such as `Math.abs(...)`; anywhere an expression is expected the
  // compiler rejects it. The interpreter models `Math` as a synthetic class-reference, so
  // the entries below pin the places where that model leaks: using `Math` as a value,
  // comparing it, calling inherited Object methods on it, or selecting unknown members.
  // Most of these must be compile errors and currently are not, so they stay red until the
  // class-reference guard is tightened.
  // ------------------------- `Math` as a value must not compile -------------------------
  {
    code: `Math`,
    error: 'compile',
  },
  {
    code: `(Math)`,
    error: 'compile',
  },
  {
    code: `Math == Math`,
    error: 'compile',
  },
  {
    code: `Math != Math`,
    error: 'compile',
  },
  {
    code: `Math == null`,
    error: 'compile',
  },
  {
    code: `null == Math`,
    error: 'compile',
  },
  // `Math` cannot be an argument to a method that wants an Object either.
  {
    code: `"x".equals(Math)`,
    error: 'compile',
  },
  // ------------------------- inherited Object methods are not callable on the type -------------------------
  // `Math.equals(...)` / `Math.toString()` are non-static methods referenced from a static
  // context; javac rejects both at compile time.
  {
    code: `Math.equals(Math)`,
    error: 'compile',
  },
  {
    code: `Math.equals(null)`,
    error: 'compile',
  },
  {
    code: `Math.toString()`,
    error: 'compile',
  },
  // ------------------------- static member selection itself is not an expression -------------------------
  {
    code: `Math.abs`,
    error: 'compile',
  },
  // ------------------------- unknown members / wrong names are rejected -------------------------
  {
    code: `Math.foo()`,
    error: 'compile',
  },
  {
    code: `Math.absx(-5)`,
    error: 'compile',
  },
  {
    code: `Math.absfoo`,
    error: 'compile',
  },
  {
    code: `Math.hashCode()`,
    error: 'compile',
  },
  {
    code: `Math.getClass()`,
    error: 'compile',
  },
  // ------------------------- a local named `Math` shadows the class -------------------------
  // `Math` is not a keyword, so a variable may legally be called `Math`; then it is a plain
  // value and `Math.abs(...)` can no longer be resolved.
  {
    code: `Math`,
    env: {
      local: { Math: { type: 'int', value: 5 } },
      heap: {},
    },
    output: { type: 'int', value: 5 },
  },
  {
    code: `Math + 1`,
    env: {
      local: { Math: { type: 'int', value: 5 } },
      heap: {},
    },
    output: { type: 'int', value: 6 },
  },
  {
    code: `Math.abs(-1)`,
    env: {
      local: { Math: { type: 'int', value: 5 } },
      heap: {},
    },
    error: 'compile',
  },
  // A boxed local named `Math` is an Integer reference; calling its instance method works.
  {
    code: `Math.equals(5)`,
    env: {
      local: { Math: { type: 'int', value: 5, boxed: true } },
      heap: {},
    },
    output: { type: 'boolean', value: true },
  },
  // ------------------------- the real class reference still works next to a shadow -------------------------
  // (Sanity check: the shadow only applies to the exact name `Math`, not to comparison.)
  {
    code: `Math.abs(-5) == Math.abs(-5)`,
    output: { type: 'boolean', value: true },
  },
]
