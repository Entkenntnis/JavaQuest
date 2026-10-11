import type { TestSuiteEntry } from '../../state/types'
import { punktEnv } from './support/context-fixtures.ts'

// ==================== CONTEXT CLASS: first slice ====================
// Entries that evaluate an expression in the context of a hand-supplied class
// (`Punkt`): instance field reads, method calls, `instanceof` and null checks.
//
// The interpreter does not implement context classes yet, so these are currently
// red in the Suite UI while staying the source of truth for the intended Java
// semantics. They are validated against real Java by `npm run cross-check`, which
// compiles `Punkt` and evaluates the expression inside an instance method so that
// `this` is the context object.
//
// `this == null` and aliasing `this` with a local instance are deliberately left
// out: the harness realises `this` as a wrapper subclass, so identity with a
// separately constructed instance would not be meaningful.

export const contextClass: TestSuiteEntry[] = [
  // ------------------------- instance fields via this -------------------------
  {
    code: `this.x == 1`,
    output: { type: 'boolean', value: true },
    env: punktEnv({ x: 1, y: 2 }),
  },
  {
    code: `this.y == 2`,
    output: { type: 'boolean', value: true },
    env: punktEnv({ x: 1, y: 2 }),
  },
  {
    code: `this.x + this.y`,
    output: { type: 'int', value: 3 },
    env: punktEnv({ x: 1, y: 2 }),
  },
  // ------------------------- methods on this -------------------------
  {
    code: `this.summe()`,
    output: { type: 'int', value: 3 },
    env: punktEnv({ x: 1, y: 2 }),
  },
  // ------------------------- another instance as a local -------------------------
  {
    code: `p.x == this.x`,
    output: { type: 'boolean', value: true },
    env: punktEnv({ x: 1, y: 2 }, { p: { x: 1, y: 9 } }),
  },
  {
    code: `p.x == this.y`,
    output: { type: 'boolean', value: true },
    env: punktEnv({ x: 2, y: 5 }, { p: { x: 5, y: 0 } }),
  },
  // ------------------------- method call with this as argument -------------------------
  {
    code: `p.istGleich(this)`,
    output: { type: 'boolean', value: true },
    env: punktEnv({ x: 1, y: 2 }, { p: { x: 1, y: 2 } }),
  },
  {
    code: `p.istGleich(this)`,
    output: { type: 'boolean', value: false },
    env: punktEnv({ x: 1, y: 2 }, { p: { x: 1, y: 3 } }),
  },
  // ------------------------- instanceof -------------------------
  {
    code: `this instanceof Punkt`,
    output: { type: 'boolean', value: true },
    env: punktEnv({ x: 1, y: 2 }),
  },
  {
    code: `p instanceof Punkt`,
    output: { type: 'boolean', value: true },
    env: punktEnv({ x: 1, y: 2 }, { p: { x: 1, y: 2 } }),
  },
  // ------------------------- null checks on an instance local -------------------------
  {
    code: `p == null`,
    output: { type: 'boolean', value: false },
    env: punktEnv({ x: 1, y: 2 }, { p: { x: 1, y: 2 } }),
  },
  {
    code: `null == p`,
    output: { type: 'boolean', value: false },
    env: punktEnv({ x: 1, y: 2 }, { p: { x: 1, y: 2 } }),
  },
]
