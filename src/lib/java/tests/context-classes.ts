import type { TestSuiteEntry } from '../../state/types'
import {
  contextEnv,
  mixEnv,
  nul,
  person,
  personEnv,
  punkt,
  rechteck,
  rechteckEnv,
  ref,
} from './support/context-fixtures.ts'

// ==================== CONTEXT CLASSES: Rechteck / Person / Mix ====================
// Second batch around additional hand-supplied classes: nested field access and
// null corners (`Rechteck`), String fields and a field/method name collision
// (`Person`), and every primitive field type (`Mix`). Validated by the cross-check
// against real Java; interpreted support comes later.

export const contextClasses: TestSuiteEntry[] = [
  // ------------------------- Rechteck: nested field access -------------------------
  {
    code: `this.a.x`,
    output: { type: 'int', value: 1 },
    env: rechteckEnv({ a: { x: 1, y: 2 }, b: { x: 4, y: 6 } }),
  },
  {
    code: `this.a.y`,
    output: { type: 'int', value: 2 },
    env: rechteckEnv({ a: { x: 1, y: 2 }, b: { x: 4, y: 6 } }),
  },
  {
    code: `this.b.x`,
    output: { type: 'int', value: 4 },
    env: rechteckEnv({ a: { x: 1, y: 2 }, b: { x: 4, y: 6 } }),
  },
  {
    code: `this.a.x + this.b.y`,
    output: { type: 'int', value: 7 },
    env: rechteckEnv({ a: { x: 1, y: 2 }, b: { x: 4, y: 6 } }),
  },
  {
    code: `this.a.istGleich(this.a)`,
    output: { type: 'boolean', value: true },
    env: rechteckEnv({ a: { x: 1, y: 2 }, b: { x: 4, y: 6 } }),
  },
  {
    code: `this.a.istGleich(this.b)`,
    output: { type: 'boolean', value: false },
    env: rechteckEnv({ a: { x: 1, y: 2 }, b: { x: 4, y: 6 } }),
  },
  {
    code: `this.flaeche()`,
    output: { type: 'int', value: 12 },
    env: rechteckEnv({ a: { x: 1, y: 2 }, b: { x: 4, y: 6 } }),
  },
  {
    code: `this.hatNullEcke()`,
    output: { type: 'boolean', value: false },
    env: rechteckEnv({ a: { x: 1, y: 2 }, b: { x: 4, y: 6 } }),
  },
  // a method that returns a nested reference
  {
    code: `this.eckeA().x == this.a.x`,
    output: { type: 'boolean', value: true },
    env: rechteckEnv({ a: { x: 1, y: 2 }, b: { x: 4, y: 6 } }),
  },
  {
    code: `this.eckeA() == this.a`,
    output: { type: 'boolean', value: true },
    env: rechteckEnv({ a: { x: 1, y: 2 }, b: { x: 4, y: 6 } }),
  },
  {
    code: `this.eckeA().istGleich(this.b)`,
    output: { type: 'boolean', value: false },
    env: rechteckEnv({ a: { x: 1, y: 2 }, b: { x: 4, y: 6 } }),
  },
  // method on two instances
  {
    code: `this.istGleich(r)`,
    output: { type: 'boolean', value: true },
    env: rechteckEnv(
      { a: { x: 1, y: 2 }, b: { x: 4, y: 6 } },
      { r: { a: { x: 1, y: 2 }, b: { x: 4, y: 6 } } },
    ),
  },
  {
    code: `this.istGleich(r)`,
    output: { type: 'boolean', value: false },
    env: rechteckEnv(
      { a: { x: 1, y: 2 }, b: { x: 4, y: 6 } },
      { r: { a: { x: 1, y: 2 }, b: { x: 0, y: 6 } } },
    ),
  },
  // ------------------------- Rechteck: null corners -------------------------
  {
    code: `this.a == null`,
    output: { type: 'boolean', value: true },
    env: rechteckEnv({ a: null, b: null }),
  },
  {
    code: `this.a != null`,
    output: { type: 'boolean', value: false },
    env: rechteckEnv({ a: null, b: null }),
  },
  {
    code: `this.a == this.b`,
    output: { type: 'boolean', value: true },
    env: rechteckEnv({ a: null, b: null }),
  },
  {
    code: `this.hatNullEcke()`,
    output: { type: 'boolean', value: true },
    env: rechteckEnv({ a: null, b: null }),
  },
  // null-safe ternary avoids the NPE
  {
    code: `this.a == null ? 0 : this.a.x`,
    output: { type: 'int', value: 0 },
    env: rechteckEnv({ a: null, b: null }),
  },
  {
    code: `this.hatNullEcke() ? -1 : this.flaeche()`,
    output: { type: 'int', value: -1 },
    env: rechteckEnv({ a: null, b: null }),
  },
  // ------------------------- Rechteck: aliasing the two corners -------------------------
  {
    code: `this.a == this.b`,
    output: { type: 'boolean', value: true },
    env: contextEnv('self', {
      pt: punkt(2, 3),
      self: rechteck(ref('pt'), ref('pt')),
    }),
  },
  {
    code: `this.a.istGleich(this.b)`,
    output: { type: 'boolean', value: true },
    env: contextEnv('self', {
      pt: punkt(2, 3),
      self: rechteck(ref('pt'), ref('pt')),
    }),
  },
  {
    code: `this.a.x == this.b.x`,
    output: { type: 'boolean', value: true },
    env: contextEnv('self', {
      pt: punkt(2, 3),
      self: rechteck(ref('pt'), ref('pt')),
    }),
  },
  // ------------------------- Rechteck: runtime NPEs -------------------------
  {
    code: `this.a.x == 1`,
    error: 'runtime',
    env: rechteckEnv({ a: null, b: null }),
  },
  {
    code: `this.a.istGleich(this.b)`,
    error: 'runtime',
    env: rechteckEnv({ a: null, b: { x: 1, y: 2 } }),
  },
  {
    code: `this.eckeA().x == 1`,
    error: 'runtime',
    env: rechteckEnv({ a: null, b: null }),
  },
  // ------------------------- Rechteck: compile errors -------------------------
  {
    code: `this.a.z == 1`,
    error: 'compile',
    env: rechteckEnv({ a: { x: 1, y: 2 }, b: { x: 4, y: 6 } }),
  },
  {
    code: `this.a.gibtsNicht()`,
    error: 'compile',
    env: rechteckEnv({ a: { x: 1, y: 2 }, b: { x: 4, y: 6 } }),
  },

  // ------------------------- Person: String field vs String method -------------------------
  {
    code: `this.heisst("Alice")`,
    output: { type: 'boolean', value: true },
    env: personEnv({ name: 'Alice', alter: 30 }),
  },
  {
    code: `this.heisst("Bob")`,
    output: { type: 'boolean', value: false },
    env: personEnv({ name: 'Alice', alter: 30 }),
  },
  {
    code: `this.name.equals("Alice")`,
    output: { type: 'boolean', value: true },
    env: personEnv({ name: 'Alice', alter: 30 }),
  },
  {
    code: `this.name().equals("Alice")`,
    output: { type: 'boolean', value: true },
    env: personEnv({ name: 'Alice', alter: 30 }),
  },
  {
    code: `this.name() == this.name`,
    output: { type: 'boolean', value: true },
    env: personEnv({ name: 'Alice', alter: 30 }),
  },
  {
    code: `this.name == "Alice"`,
    output: { type: 'boolean', value: true },
    env: personEnv({ name: 'Alice', alter: 30 }),
  },
  {
    code: `this.alterInMonaten()`,
    output: { type: 'int', value: 360 },
    env: personEnv({ name: 'Alice', alter: 30 }),
  },
  {
    code: `this.alter >= 18 && this.heisst("Alice")`,
    output: { type: 'boolean', value: true },
    env: personEnv({ name: 'Alice', alter: 30 }),
  },
  {
    code: `this.heisst(this.name())`,
    output: { type: 'boolean', value: true },
    env: personEnv({ name: 'Alice', alter: 30 }),
  },
  {
    code: `this.name.isEmpty()`,
    output: { type: 'boolean', value: false },
    env: personEnv({ name: 'Alice', alter: 30 }),
  },
  {
    code: `this.name.isEmpty()`,
    output: { type: 'boolean', value: true },
    env: personEnv({ name: '', alter: 1 }),
  },
  {
    code: `this.name() == this.name()`,
    output: { type: 'boolean', value: true },
    env: personEnv({ name: 'Alice', alter: 30 }),
  },
  // second Person as a local
  {
    code: `q.heisst("Bob")`,
    output: { type: 'boolean', value: true },
    env: personEnv(
      { name: 'Alice', alter: 30 },
      { q: { name: 'Bob', alter: 20 } },
    ),
  },
  {
    code: `q.name == this.name`,
    output: { type: 'boolean', value: false },
    env: personEnv(
      { name: 'Alice', alter: 30 },
      { q: { name: 'Bob', alter: 20 } },
    ),
  },
  // compile errors
  {
    code: `this.heisst(42)`,
    error: 'compile',
    env: personEnv({ name: 'Alice', alter: 30 }),
  },
  {
    code: `this.name.nope()`,
    error: 'compile',
    env: personEnv({ name: 'Alice', alter: 30 }),
  },

  // ------------------------- Mix: every primitive field type -------------------------
  {
    code: `this.gross`,
    output: { type: 'long', value: '100' },
    env: mixEnv({ gross: 100, anteil: 1.5, zeichen: 97, ok: true }),
  },
  {
    code: `this.anteil`,
    output: { type: 'double', value: 1.5 },
    env: mixEnv({ gross: 100, anteil: 1.5, zeichen: 97, ok: true }),
  },
  {
    code: `this.zeichen`,
    output: { type: 'char', value: 97 },
    env: mixEnv({ gross: 100, anteil: 1.5, zeichen: 97, ok: true }),
  },
  {
    code: `this.ok`,
    output: { type: 'boolean', value: true },
    env: mixEnv({ gross: 100, anteil: 1.5, zeichen: 97, ok: true }),
  },
  {
    code: `this.passt(200)`,
    output: { type: 'boolean', value: true },
    env: mixEnv({ gross: 100, anteil: 1.5, zeichen: 97, ok: true }),
  },
  {
    code: `this.passt(50)`,
    output: { type: 'boolean', value: false },
    env: mixEnv({ gross: 100, anteil: 1.5, zeichen: 97, ok: true }),
  },
  {
    code: `this.verdoppelt()`,
    output: { type: 'double', value: 3 },
    env: mixEnv({ gross: 100, anteil: 1.5, zeichen: 97, ok: true }),
  },
  {
    code: `this.zeichen()`,
    output: { type: 'char', value: 97 },
    env: mixEnv({ gross: 100, anteil: 1.5, zeichen: 97, ok: true }),
  },
  {
    code: `this.ok && this.gross > 0`,
    output: { type: 'boolean', value: true },
    env: mixEnv({ gross: 100, anteil: 1.5, zeichen: 97, ok: true }),
  },
  {
    code: `this.gross + 1`,
    output: { type: 'long', value: '101' },
    env: mixEnv({ gross: 100, anteil: 1.5, zeichen: 97, ok: true }),
  },
  {
    code: `this.anteil > 1.0`,
    output: { type: 'boolean', value: true },
    env: mixEnv({ gross: 100, anteil: 1.5, zeichen: 97, ok: true }),
  },

  // ------------------------- Rechteck: more arithmetic / identity / null -------------------------
  {
    code: `this.flaeche()`,
    output: { type: 'int', value: -12 },
    env: rechteckEnv({ a: { x: 1, y: 6 }, b: { x: 4, y: 2 } }),
  },
  {
    code: `this.flaeche()`,
    output: { type: 'int', value: 1410065408 },
    env: rechteckEnv({ a: { x: 0, y: 0 }, b: { x: 100000, y: 100000 } }),
  },
  {
    code: `this.eckeA() == null`,
    output: { type: 'boolean', value: true },
    env: rechteckEnv({ a: null, b: { x: 1, y: 2 } }),
  },
  {
    code: `this.eckeA() == this.a`,
    output: { type: 'boolean', value: true },
    env: rechteckEnv({ a: null, b: null }),
  },
  {
    code: `this.eckeA() == this.b`,
    output: { type: 'boolean', value: true },
    env: contextEnv('self', {
      pt: punkt(2, 3),
      self: rechteck(ref('pt'), ref('pt')),
    }),
  },
  {
    code: `this.a.istGleich(this.eckeA())`,
    output: { type: 'boolean', value: true },
    env: rechteckEnv({ a: { x: 1, y: 2 }, b: { x: 4, y: 6 } }),
  },
  {
    code: `this.istGleich(this)`,
    output: { type: 'boolean', value: true },
    env: rechteckEnv({ a: { x: 1, y: 2 }, b: { x: 4, y: 6 } }),
  },
  {
    code: `r == r`,
    output: { type: 'boolean', value: true },
    env: rechteckEnv(
      { a: { x: 1, y: 2 }, b: { x: 4, y: 6 } },
      { r: { a: { x: 1, y: 2 }, b: { x: 4, y: 6 } } },
    ),
  },
  {
    code: `this == r`,
    output: { type: 'boolean', value: false },
    env: rechteckEnv(
      { a: { x: 1, y: 2 }, b: { x: 4, y: 6 } },
      { r: { a: { x: 1, y: 2 }, b: { x: 4, y: 6 } } },
    ),
  },
  {
    code: `this.hatNullEcke()`,
    output: { type: 'boolean', value: true },
    env: rechteckEnv({ a: null, b: { x: 1, y: 2 } }),
  },
  {
    code: `this.b.x`,
    output: { type: 'int', value: 1 },
    env: rechteckEnv({ a: null, b: { x: 1, y: 2 } }),
  },
  {
    code: `this.a == null`,
    output: { type: 'boolean', value: true },
    env: rechteckEnv({ a: null, b: { x: 1, y: 2 } }),
  },
  {
    code: `this.a == null ? (this.b == null ? 0 : this.b.x) : this.a.x`,
    output: { type: 'int', value: 5 },
    env: rechteckEnv({ a: { x: 5, y: 0 }, b: { x: 1, y: 0 } }),
  },
  {
    code: `this.a == null ? (this.b == null ? 0 : this.b.x) : this.a.x`,
    output: { type: 'int', value: 0 },
    env: rechteckEnv({ a: null, b: null }),
  },
  {
    code: `this.a == null ? (this.b == null ? 0 : this.b.x) : this.a.x`,
    output: { type: 'int', value: 7 },
    env: rechteckEnv({ a: null, b: { x: 7, y: 0 } }),
  },
  {
    code: `this.b.x`,
    error: 'runtime',
    env: rechteckEnv({ a: { x: 1, y: 2 }, b: null }),
  },
  {
    code: `this.flaeche()`,
    error: 'runtime',
    env: rechteckEnv({ a: { x: 1, y: 2 }, b: null }),
  },
  {
    code: `this.istGleich(r)`,
    error: 'runtime',
    env: rechteckEnv(
      { a: null, b: { x: 1, y: 2 } },
      { r: { a: { x: 1, y: 2 }, b: { x: 4, y: 6 } } },
    ),
  },

  // ------------------------- Person: String methods, null name, overflow -------------------------
  {
    code: `this.name.length()`,
    output: { type: 'int', value: 5 },
    env: personEnv({ name: 'Alice', alter: 30 }),
  },
  {
    code: `this.name().length()`,
    output: { type: 'int', value: 5 },
    env: personEnv({ name: 'Alice', alter: 30 }),
  },
  {
    code: `this.name + "!"`,
    output: { type: '__str', value: 'Alice!' },
    env: personEnv({ name: 'Alice', alter: 30 }),
  },
  {
    code: `"" + this.alter`,
    output: { type: '__str', value: '30' },
    env: personEnv({ name: 'Alice', alter: 30 }),
  },
  {
    code: `this.name.equalsIgnoreCase("alice")`,
    output: { type: 'boolean', value: true },
    env: personEnv({ name: 'Alice', alter: 30 }),
  },
  {
    code: `this.name.contains("lic")`,
    output: { type: 'boolean', value: true },
    env: personEnv({ name: 'Alice', alter: 30 }),
  },
  {
    code: `this.heisst(null)`,
    output: { type: 'boolean', value: false },
    env: personEnv({ name: 'Alice', alter: 30 }),
  },
  {
    code: `this.heisst("")`,
    output: { type: 'boolean', value: true },
    env: personEnv({ name: '', alter: 1 }),
  },
  {
    code: `this.name == null`,
    output: { type: 'boolean', value: false },
    env: personEnv({ name: 'Alice', alter: 30 }),
  },
  {
    code: `this.name == null`,
    output: { type: 'boolean', value: true },
    env: contextEnv('self', { self: person(nul, 30) }),
  },
  {
    code: `this.name() == null`,
    output: { type: 'boolean', value: true },
    env: contextEnv('self', { self: person(nul, 30) }),
  },
  {
    code: `this.name.isEmpty()`,
    error: 'runtime',
    env: contextEnv('self', { self: person(nul, 30) }),
  },
  {
    code: `this.heisst("x")`,
    error: 'runtime',
    env: contextEnv('self', { self: person(nul, 30) }),
  },
  {
    code: `q.heisst(this.name())`,
    output: { type: 'boolean', value: true },
    env: personEnv(
      { name: 'Alice', alter: 30 },
      { q: { name: 'Alice', alter: 20 } },
    ),
  },
  {
    code: `this.alterInMonaten()`,
    output: { type: 'int', value: -1894967296 },
    env: personEnv({ name: 'Alice', alter: 200000000 }),
  },
  {
    code: `this.alter / 0`,
    error: 'runtime',
    env: personEnv({ name: 'Alice', alter: 30 }),
  },

  // ------------------------- Mix: long / double / char corners -------------------------
  {
    code: `this.gross * 2`,
    output: { type: 'long', value: '200' },
    env: mixEnv({ gross: 100, anteil: 1.5, zeichen: 97, ok: true }),
  },
  {
    code: `this.gross / 3`,
    output: { type: 'long', value: '33' },
    env: mixEnv({ gross: 100, anteil: 1.5, zeichen: 97, ok: true }),
  },
  {
    code: `this.gross == 100`,
    output: { type: 'boolean', value: true },
    env: mixEnv({ gross: 100, anteil: 1.5, zeichen: 97, ok: true }),
  },
  {
    code: `this.zeichen + 1`,
    output: { type: 'int', value: 98 },
    env: mixEnv({ gross: 100, anteil: 1.5, zeichen: 97, ok: true }),
  },
  {
    code: `this.zeichen == 'a'`,
    output: { type: 'boolean', value: true },
    env: mixEnv({ gross: 100, anteil: 1.5, zeichen: 97, ok: true }),
  },
  {
    code: `(int) this.gross`,
    output: { type: 'int', value: 100 },
    env: mixEnv({ gross: 100, anteil: 1.5, zeichen: 97, ok: true }),
  },
  {
    code: `this.gross >> 1`,
    output: { type: 'long', value: '50' },
    env: mixEnv({ gross: 100, anteil: 1.5, zeichen: 97, ok: true }),
  },
  {
    code: `this.gross % 7`,
    output: { type: 'long', value: '2' },
    env: mixEnv({ gross: 100, anteil: 1.5, zeichen: 97, ok: true }),
  },
  {
    code: `this.passt(this.gross)`,
    output: { type: 'boolean', value: true },
    env: mixEnv({ gross: 100, anteil: 1.5, zeichen: 97, ok: true }),
  },
  {
    code: `this.passt(this.gross - 1)`,
    output: { type: 'boolean', value: false },
    env: mixEnv({ gross: 100, anteil: 1.5, zeichen: 97, ok: true }),
  },
  {
    code: `!this.ok`,
    output: { type: 'boolean', value: false },
    env: mixEnv({ gross: 100, anteil: 1.5, zeichen: 97, ok: true }),
  },
  {
    code: `this.anteil * 2`,
    output: { type: 'double', value: 3 },
    env: mixEnv({ gross: 100, anteil: 1.5, zeichen: 97, ok: true }),
  },
  {
    code: `this.anteil + this.zeichen`,
    output: { type: 'double', value: 98.5 },
    env: mixEnv({ gross: 100, anteil: 1.5, zeichen: 97, ok: true }),
  },
  {
    code: `this.verdoppelt() == 3.0`,
    output: { type: 'boolean', value: true },
    env: mixEnv({ gross: 100, anteil: 1.5, zeichen: 97, ok: true }),
  },
  {
    code: `this.gross + 1`,
    output: { type: 'long', value: '-9223372036854775808' },
    env: mixEnv({
      gross: '9223372036854775807',
      anteil: 0,
      zeichen: 0,
      ok: true,
    }),
  },
  {
    code: `this.anteil / 0 > 1e300`,
    output: { type: 'boolean', value: true },
    env: mixEnv({ gross: 0, anteil: 1.5, zeichen: 0, ok: true }),
  },
  {
    code: `this.gross / 0`,
    error: 'runtime',
    env: mixEnv({ gross: 100, anteil: 1.5, zeichen: 97, ok: true }),
  },
  {
    code: `this.gross % 0`,
    error: 'runtime',
    env: mixEnv({ gross: 100, anteil: 1.5, zeichen: 97, ok: true }),
  },

  // ------------------------- unqualified member access (inside the class) -------------------------
  {
    code: `a.x`,
    output: { type: 'int', value: 1 },
    env: rechteckEnv({ a: { x: 1, y: 2 }, b: { x: 4, y: 6 } }),
  },
  {
    code: `a.istGleich(b)`,
    output: { type: 'boolean', value: false },
    env: rechteckEnv({ a: { x: 1, y: 2 }, b: { x: 4, y: 6 } }),
  },
  {
    code: `flaeche()`,
    output: { type: 'int', value: 12 },
    env: rechteckEnv({ a: { x: 1, y: 2 }, b: { x: 4, y: 6 } }),
  },
  {
    code: `hatNullEcke()`,
    output: { type: 'boolean', value: false },
    env: rechteckEnv({ a: { x: 1, y: 2 }, b: { x: 4, y: 6 } }),
  },
  {
    code: `a == this.a`,
    output: { type: 'boolean', value: true },
    env: rechteckEnv({ a: { x: 1, y: 2 }, b: { x: 4, y: 6 } }),
  },
  {
    code: `eckeA() == a`,
    output: { type: 'boolean', value: true },
    env: rechteckEnv({ a: { x: 1, y: 2 }, b: { x: 4, y: 6 } }),
  },
  {
    code: `a == null`,
    output: { type: 'boolean', value: true },
    env: rechteckEnv({ a: null, b: null }),
  },
  {
    code: `a == b`,
    output: { type: 'boolean', value: true },
    env: rechteckEnv({ a: null, b: null }),
  },
  {
    code: `hatNullEcke()`,
    output: { type: 'boolean', value: true },
    env: rechteckEnv({ a: null, b: null }),
  },
  {
    code: `b.x`,
    output: { type: 'int', value: 1 },
    env: rechteckEnv({ a: null, b: { x: 1, y: 2 } }),
  },
  {
    code: `a == null ? (b == null ? 0 : b.x) : a.x`,
    output: { type: 'int', value: 7 },
    env: rechteckEnv({ a: null, b: { x: 7, y: 0 } }),
  },
  {
    code: `name.length()`,
    output: { type: 'int', value: 5 },
    env: personEnv({ name: 'Alice', alter: 30 }),
  },
  {
    code: `name() == this.name`,
    output: { type: 'boolean', value: true },
    env: personEnv({ name: 'Alice', alter: 30 }),
  },
  {
    code: `name == "Alice"`,
    output: { type: 'boolean', value: true },
    env: personEnv({ name: 'Alice', alter: 30 }),
  },
  {
    code: `heisst(name())`,
    output: { type: 'boolean', value: true },
    env: personEnv({ name: 'Alice', alter: 30 }),
  },
  {
    code: `alter >= 18 && heisst("Alice")`,
    output: { type: 'boolean', value: true },
    env: personEnv({ name: 'Alice', alter: 30 }),
  },
  {
    code: `alterInMonaten()`,
    output: { type: 'int', value: 360 },
    env: personEnv({ name: 'Alice', alter: 30 }),
  },
  {
    code: `name.isEmpty()`,
    output: { type: 'boolean', value: false },
    env: personEnv({ name: 'Alice', alter: 30 }),
  },
  {
    code: `gross`,
    output: { type: 'long', value: '100' },
    env: mixEnv({ gross: 100, anteil: 1.5, zeichen: 97, ok: true }),
  },
  {
    code: `anteil`,
    output: { type: 'double', value: 1.5 },
    env: mixEnv({ gross: 100, anteil: 1.5, zeichen: 97, ok: true }),
  },
  {
    code: `zeichen`,
    output: { type: 'char', value: 97 },
    env: mixEnv({ gross: 100, anteil: 1.5, zeichen: 97, ok: true }),
  },
  {
    code: `ok`,
    output: { type: 'boolean', value: true },
    env: mixEnv({ gross: 100, anteil: 1.5, zeichen: 97, ok: true }),
  },
  {
    code: `passt(200)`,
    output: { type: 'boolean', value: true },
    env: mixEnv({ gross: 100, anteil: 1.5, zeichen: 97, ok: true }),
  },
  {
    code: `verdoppelt()`,
    output: { type: 'double', value: 3 },
    env: mixEnv({ gross: 100, anteil: 1.5, zeichen: 97, ok: true }),
  },
  // field `zeichen` vs method `zeichen()`
  {
    code: `zeichen()`,
    output: { type: 'char', value: 97 },
    env: mixEnv({ gross: 100, anteil: 1.5, zeichen: 97, ok: true }),
  },
  {
    code: `gross > 0 && ok`,
    output: { type: 'boolean', value: true },
    env: mixEnv({ gross: 100, anteil: 1.5, zeichen: 97, ok: true }),
  },
]
