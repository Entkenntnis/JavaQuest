import type { TestSuiteEntry } from '../../state/types'
import {
  contextEnv,
  punkt,
  punktEnv,
  ref,
} from './support/context-fixtures.ts'

// ==================== CONTEXT CLASS: Punkt ====================
// Expressions evaluated in the context of the hand-supplied class `Punkt`:
// instance field reads, method calls, `this`, `instanceof` and the compile/runtime
// boundaries. The interpreter does not implement context classes yet, so these are
// currently red in the Suite UI while staying the source of truth for the intended
// Java semantics; `npm run cross-check` validates them against real Java.

export const contextClass: TestSuiteEntry[] = [
  // ------------------------- instance fields via this -------------------------
  { code: `this.x == 1`, output: { type: 'boolean', value: true }, env: punktEnv({ x: 1, y: 2 }) },
  { code: `this.y == 2`, output: { type: 'boolean', value: true }, env: punktEnv({ x: 1, y: 2 }) },
  { code: `this.x + this.y`, output: { type: 'int', value: 3 }, env: punktEnv({ x: 1, y: 2 }) },
  { code: `this.x == this.x`, output: { type: 'boolean', value: true }, env: punktEnv({ x: 1, y: 2 }) },
  { code: `this.x != this.y`, output: { type: 'boolean', value: true }, env: punktEnv({ x: 1, y: 2 }) },
  { code: `this.x < this.y`, output: { type: 'boolean', value: true }, env: punktEnv({ x: 1, y: 2 }) },
  { code: `this.x >= this.y`, output: { type: 'boolean', value: false }, env: punktEnv({ x: 1, y: 2 }) },
  // precedence: `*` binds tighter than `+`
  { code: `this.x + this.y * 2`, output: { type: 'int', value: 5 }, env: punktEnv({ x: 1, y: 2 }) },
  { code: `(this.x + this.y) * 2`, output: { type: 'int', value: 6 }, env: punktEnv({ x: 1, y: 2 }) },
  // ------------------------- int overflow (evaluator semantics) -------------------------
  {
    code: `this.x + this.y`,
    output: { type: 'int', value: -2147483648 },
    env: punktEnv({ x: 2147483647, y: 1 }),
  },
  {
    code: `this.summe()`,
    output: { type: 'int', value: -2147483648 },
    env: punktEnv({ x: 2147483647, y: 1 }),
  },
  // ------------------------- methods on this -------------------------
  { code: `this.summe()`, output: { type: 'int', value: 3 }, env: punktEnv({ x: 1, y: 2 }) },
  { code: `this.summe() > this.x`, output: { type: 'boolean', value: true }, env: punktEnv({ x: 1, y: 2 }) },
  {
    code: `this.summe() == this.x + this.y`,
    output: { type: 'boolean', value: true },
    env: punktEnv({ x: 1, y: 2 }),
  },
  { code: `!this.istUrsprung()`, output: { type: 'boolean', value: true }, env: punktEnv({ x: 1, y: 2 }) },
  { code: `this.istUrsprung()`, output: { type: 'boolean', value: false }, env: punktEnv({ x: 1, y: 2 }) },
  { code: `this.istUrsprung()`, output: { type: 'boolean', value: true }, env: punktEnv({ x: 0, y: 0 }) },
  // methods returning a fresh instance
  { code: `this.kopie().x == this.x`, output: { type: 'boolean', value: true }, env: punktEnv({ x: 1, y: 2 }) },
  { code: `this.kopie().y == this.y`, output: { type: 'boolean', value: true }, env: punktEnv({ x: 1, y: 2 }) },
  { code: `this.kopie() == this`, output: { type: 'boolean', value: false }, env: punktEnv({ x: 1, y: 2 }) },
  { code: `this.kopie().istGleich(this)`, output: { type: 'boolean', value: true }, env: punktEnv({ x: 1, y: 2 }) },
  { code: `this.istGleich(this.kopie())`, output: { type: 'boolean', value: true }, env: punktEnv({ x: 1, y: 2 }) },
  // two independent copies are never identical, but always equal by content
  {
    code: `this.kopie() == this.kopie()`,
    output: { type: 'boolean', value: false },
    env: punktEnv({ x: 1, y: 2 }),
  },
  {
    code: `this.kopie().istGleich(this.kopie())`,
    output: { type: 'boolean', value: true },
    env: punktEnv({ x: 1, y: 2 }),
  },
  // ------------------------- boolean composition -------------------------
  {
    code: `this.x > 0 && this.y > 0`,
    output: { type: 'boolean', value: true },
    env: punktEnv({ x: 1, y: 2 }),
  },
  {
    code: `this.x > 0 || this.y < 0`,
    output: { type: 'boolean', value: true },
    env: punktEnv({ x: 1, y: 2 }),
  },
  {
    code: `this.istUrsprung() || this instanceof Punkt`,
    output: { type: 'boolean', value: true },
    env: punktEnv({ x: 1, y: 2 }),
  },
  // ------------------------- ternary -------------------------
  {
    code: `this.x > 0 ? this.x : -this.x`,
    output: { type: 'int', value: 1 },
    env: punktEnv({ x: 1, y: 2 }),
  },
  {
    code: `this.x > 0 ? this.x : -this.x`,
    output: { type: 'int', value: 3 },
    env: punktEnv({ x: -3, y: 2 }),
  },
  // ------------------------- string concatenation around method results -------------------------
  { code: `this.summe() + ""`, output: { type: '__str', value: '3' }, env: punktEnv({ x: 1, y: 2 }) },
  { code: `"x" + this.summe()`, output: { type: '__str', value: 'x3' }, env: punktEnv({ x: 1, y: 2 }) },
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
  {
    code: `p.summe() == this.summe()`,
    output: { type: 'boolean', value: true },
    env: punktEnv({ x: 1, y: 2 }, { p: { x: 1, y: 2 } }),
  },
  {
    code: `p.istUrsprung()`,
    output: { type: 'boolean', value: true },
    env: punktEnv({ x: 1, y: 2 }, { p: { x: 0, y: 0 } }),
  },
  {
    code: `p.kopie().istGleich(p)`,
    output: { type: 'boolean', value: true },
    env: punktEnv({ x: 1, y: 2 }, { p: { x: 4, y: 9 } }),
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
  {
    code: `p.istGleich(p)`,
    output: { type: 'boolean', value: true },
    env: punktEnv({ x: 1, y: 2 }, { p: { x: 7, y: 7 } }),
  },
  // ------------------------- identity / equality of references -------------------------
  {
    code: `p == p`,
    output: { type: 'boolean', value: true },
    env: punktEnv({ x: 1, y: 2 }, { p: { x: 1, y: 2 } }),
  },
  {
    code: `this == p`,
    output: { type: 'boolean', value: false },
    env: punktEnv({ x: 1, y: 2 }, { p: { x: 1, y: 2 } }),
  },
  {
    code: `p != this`,
    output: { type: 'boolean', value: true },
    env: punktEnv({ x: 1, y: 2 }, { p: { x: 1, y: 2 } }),
  },
  // ------------------------- instanceof -------------------------
  { code: `this instanceof Punkt`, output: { type: 'boolean', value: true }, env: punktEnv({ x: 1, y: 2 }) },
  {
    code: `p instanceof Punkt`,
    output: { type: 'boolean', value: true },
    env: punktEnv({ x: 1, y: 2 }, { p: { x: 1, y: 2 } }),
  },
  { code: `this instanceof Object`, output: { type: 'boolean', value: true }, env: punktEnv({ x: 1, y: 2 }) },
  {
    code: `p instanceof Object`,
    output: { type: 'boolean', value: true },
    env: punktEnv({ x: 1, y: 2 }, { p: { x: 1, y: 2 } }),
  },
  { code: `!(this instanceof Punkt)`, output: { type: 'boolean', value: false }, env: punktEnv({ x: 1, y: 2 }) },
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
  { code: `null == null`, output: { type: 'boolean', value: true }, env: punktEnv({ x: 1, y: 2 }) },
  // ------------------------- aliasing: two locals, one object -------------------------
  {
    code: `a == b`,
    output: { type: 'boolean', value: true },
    env: contextEnv('self', {
      self: punkt(1, 2),
      shared: punkt(5, 6),
    }, { a: ref('shared'), b: ref('shared') }),
  },
  // ------------------------- unqualified member access (inside the class) -------------------------
  { code: `x == 1`, output: { type: 'boolean', value: true }, env: punktEnv({ x: 1, y: 2 }) },
  { code: `y == 2`, output: { type: 'boolean', value: true }, env: punktEnv({ x: 1, y: 2 }) },
  { code: `x + y`, output: { type: 'int', value: 3 }, env: punktEnv({ x: 1, y: 2 }) },
  { code: `x + y * 2`, output: { type: 'int', value: 5 }, env: punktEnv({ x: 1, y: 2 }) },
  { code: `x == this.x`, output: { type: 'boolean', value: true }, env: punktEnv({ x: 1, y: 2 }) },
  { code: `summe()`, output: { type: 'int', value: 3 }, env: punktEnv({ x: 1, y: 2 }) },
  { code: `summe() == this.summe()`, output: { type: 'boolean', value: true }, env: punktEnv({ x: 1, y: 2 }) },
  { code: `summe() == x + y`, output: { type: 'boolean', value: true }, env: punktEnv({ x: 1, y: 2 }) },
  { code: `!istUrsprung()`, output: { type: 'boolean', value: true }, env: punktEnv({ x: 1, y: 2 }) },
  { code: `istUrsprung()`, output: { type: 'boolean', value: true }, env: punktEnv({ x: 0, y: 0 }) },
  { code: `kopie().x == x`, output: { type: 'boolean', value: true }, env: punktEnv({ x: 1, y: 2 }) },
  { code: `kopie() == this`, output: { type: 'boolean', value: false }, env: punktEnv({ x: 1, y: 2 }) },
  { code: `istGleich(this)`, output: { type: 'boolean', value: true }, env: punktEnv({ x: 1, y: 2 }) },
  { code: `x == p.x`, output: { type: 'boolean', value: true }, env: punktEnv({ x: 1, y: 2 }, { p: { x: 1, y: 9 } }) },
  { code: `istGleich(p)`, output: { type: 'boolean', value: false }, env: punktEnv({ x: 1, y: 2 }, { p: { x: 1, y: 9 } }) },
  { code: `x > 0 && y > 0`, output: { type: 'boolean', value: true }, env: punktEnv({ x: 1, y: 2 }) },
  { code: `istUrsprung() ? 0 : summe()`, output: { type: 'int', value: 3 }, env: punktEnv({ x: 1, y: 2 }) },
  { code: `x + y`, output: { type: 'int', value: -2147483648 }, env: punktEnv({ x: 2147483647, y: 1 }) },
  { code: `z == 1`, error: 'compile', env: punktEnv({ x: 1, y: 2 }) },
  { code: `gibtsNicht()`, error: 'compile', env: punktEnv({ x: 1, y: 2 }) },
  // ------------------------- unary / bitwise field arithmetic -------------------------
  { code: `this.x`, output: { type: 'int', value: 1 }, env: punktEnv({ x: 1, y: 2 }) },
  { code: `-this.x`, output: { type: 'int', value: -5 }, env: punktEnv({ x: 5, y: 2 }) },
  { code: `~this.x`, output: { type: 'int', value: -6 }, env: punktEnv({ x: 5, y: 2 }) },
  { code: `this.x * this.y`, output: { type: 'int', value: 12 }, env: punktEnv({ x: 3, y: 4 }) },
  { code: `this.x / this.y`, output: { type: 'int', value: 3 }, env: punktEnv({ x: 7, y: 2 }) },
  { code: `this.x % this.y`, output: { type: 'int', value: 1 }, env: punktEnv({ x: 7, y: 2 }) },
  { code: `this.x << 1`, output: { type: 'int', value: 6 }, env: punktEnv({ x: 3, y: 0 }) },
  { code: `this.x >> 1`, output: { type: 'int', value: 3 }, env: punktEnv({ x: 7, y: 0 }) },
  { code: `this.x >>> 1`, output: { type: 'int', value: 2147483647 }, env: punktEnv({ x: -2, y: 0 }) },
  { code: `this.x & this.y`, output: { type: 'int', value: 2 }, env: punktEnv({ x: 6, y: 3 }) },
  { code: `this.x | this.y`, output: { type: 'int', value: 7 }, env: punktEnv({ x: 4, y: 3 }) },
  { code: `this.x ^ this.y`, output: { type: 'int', value: 6 }, env: punktEnv({ x: 5, y: 3 }) },
  // more overflow corners
  {
    code: `this.x * this.y`,
    output: { type: 'int', value: 1410065408 },
    env: punktEnv({ x: 100000, y: 100000 }),
  },
  {
    code: `-this.x`,
    output: { type: 'int', value: -2147483648 },
    env: punktEnv({ x: -2147483648, y: 0 }),
  },
  {
    code: `this.x + 2147483647`,
    output: { type: 'int', value: -2147483648 },
    env: punktEnv({ x: 1, y: 0 }),
  },
  // Math over fields
  { code: `Math.abs(this.x)`, output: { type: 'int', value: 5 }, env: punktEnv({ x: -5, y: 0 }) },
  {
    code: `Math.abs(this.x)`,
    output: { type: 'int', value: -2147483648 },
    env: punktEnv({ x: -2147483648, y: 0 }),
  },
  { code: `Math.abs(this.summe())`, output: { type: 'int', value: 1 }, env: punktEnv({ x: -1, y: 2 }) },
  { code: `Math.sqrt(this.x)`, output: { type: 'double', value: 3 }, env: punktEnv({ x: 9, y: 0 }) },
  // ------------------------- method chaining -------------------------
  { code: `this.kopie().summe()`, output: { type: 'int', value: 3 }, env: punktEnv({ x: 1, y: 2 }) },
  { code: `this.kopie().kopie().x`, output: { type: 'int', value: 3 }, env: punktEnv({ x: 3, y: 4 }) },
  {
    code: `p.kopie().kopie().istGleich(p)`,
    output: { type: 'boolean', value: true },
    env: punktEnv({ x: 1, y: 2 }, { p: { x: 8, y: 9 } }),
  },
  { code: `this.istGleich(this)`, output: { type: 'boolean', value: true }, env: punktEnv({ x: 1, y: 2 }) },
  // ------------------------- null as a method argument -------------------------
  { code: `this.istGleich(null)`, error: 'runtime', env: punktEnv({ x: 1, y: 2 }) },
  {
    code: `p.istGleich(null)`,
    error: 'runtime',
    env: punktEnv({ x: 1, y: 2 }, { p: { x: 1, y: 2 } }),
  },
  { code: `this.kopie().istGleich(null)`, error: 'runtime', env: punktEnv({ x: 1, y: 2 }) },
  // ------------------------- boolean / ternary composition -------------------------
  {
    code: `this.istUrsprung() == p.istUrsprung()`,
    output: { type: 'boolean', value: true },
    env: punktEnv({ x: 0, y: 0 }, { p: { x: 0, y: 0 } }),
  },
  {
    code: `this.istUrsprung() == p.istUrsprung()`,
    output: { type: 'boolean', value: false },
    env: punktEnv({ x: 1, y: 2 }, { p: { x: 0, y: 0 } }),
  },
  {
    code: `!(p.istGleich(this))`,
    output: { type: 'boolean', value: true },
    env: punktEnv({ x: 1, y: 2 }, { p: { x: 3, y: 4 } }),
  },
  {
    code: `this.x > 0 ? "pos" : "nichtpos"`,
    output: { type: '__str', value: 'pos' },
    env: punktEnv({ x: 1, y: 2 }),
  },
  {
    code: `this.istUrsprung() ? 0 : this.summe()`,
    output: { type: 'int', value: 3 },
    env: punktEnv({ x: 1, y: 2 }),
  },
  // conditional expression yielding a reference, then dereferenced
  {
    code: `(this.x > 0 ? this : p).x`,
    output: { type: 'int', value: 3 },
    env: punktEnv({ x: 3, y: 0 }, { p: { x: 9, y: 0 } }),
  },
  {
    code: `(this.x > 0 ? p : this).x`,
    output: { type: 'int', value: 9 },
    env: punktEnv({ x: 3, y: 0 }, { p: { x: 9, y: 0 } }),
  },
  {
    code: `this == (this.x > 0 ? this : p)`,
    output: { type: 'boolean', value: true },
    env: punktEnv({ x: 3, y: 0 }, { p: { x: 9, y: 0 } }),
  },
  {
    code: `this == (this.x > 0 ? p : this)`,
    output: { type: 'boolean', value: false },
    env: punktEnv({ x: 3, y: 0 }, { p: { x: 9, y: 0 } }),
  },
  {
    code: `"" + this.istUrsprung()`,
    output: { type: '__str', value: 'false' },
    env: punktEnv({ x: 1, y: 2 }),
  },
  {
    code: `this.x < p.x && this.y < p.y`,
    output: { type: 'boolean', value: true },
    env: punktEnv({ x: 1, y: 2 }, { p: { x: 3, y: 4 } }),
  },
  // ------------------------- compile errors -------------------------
  { code: `this.z == 1`, error: 'compile', env: punktEnv({ x: 1, y: 2 }) },
  { code: `this.istGleich()`, error: 'compile', env: punktEnv({ x: 1, y: 2 }) },
  { code: `this.istGleich(1)`, error: 'compile', env: punktEnv({ x: 1, y: 2 }) },
  { code: `this.summe(1)`, error: 'compile', env: punktEnv({ x: 1, y: 2 }) },
  { code: `this.gibtsNicht()`, error: 'compile', env: punktEnv({ x: 1, y: 2 }) },
  {
    code: `p.istGleich(5)`,
    error: 'compile',
    env: punktEnv({ x: 1, y: 2 }, { p: { x: 1, y: 2 } }),
  },
  { code: `this.x.y == 1`, error: 'compile', env: punktEnv({ x: 1, y: 2 }) },
  { code: `this.kopie().z == 1`, error: 'compile', env: punktEnv({ x: 1, y: 2 }) },
  { code: `this.x instanceof Punkt`, error: 'compile', env: punktEnv({ x: 1, y: 2 }) },
  { code: `this + 1 == 1`, error: 'compile', env: punktEnv({ x: 1, y: 2 }) },
  { code: `this == 1`, error: 'compile', env: punktEnv({ x: 1, y: 2 }) },
  { code: `this == true`, error: 'compile', env: punktEnv({ x: 1, y: 2 }) },
  { code: `this.x == this`, error: 'compile', env: punktEnv({ x: 1, y: 2 }) },
  { code: `this.x && true`, error: 'compile', env: punktEnv({ x: 1, y: 2 }) },
  { code: `!this.x`, error: 'compile', env: punktEnv({ x: 1, y: 2 }) },
  { code: `this.x ? 1 : 2`, error: 'compile', env: punktEnv({ x: 1, y: 2 }) },
  { code: `this.istGleich(null, null)`, error: 'compile', env: punktEnv({ x: 1, y: 2 }) },
  { code: `null.istGleich(this)`, error: 'compile', env: punktEnv({ x: 1, y: 2 }) },
  { code: `this.x.istGleich(this)`, error: 'compile', env: punktEnv({ x: 1, y: 2 }) },
]
