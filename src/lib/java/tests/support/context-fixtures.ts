import type {
  ClassMetaData,
  JavaEnvironment,
  JavaHeapObject,
  JavaInstanceObject,
  JavaIntValue,
  JavaValue,
  TypedNumericArithNodeS,
} from '../../../state/types'
import { evaluate } from '../../evaluate.ts'

// A synthetic class is the single source of truth for one hand-written class:
// `meta` drives the interpreter (typecheck/evaluate), `javaSource` drives the
// cross-check harness. The class is package-private and lives in the default
// package so it can be concatenated in front of the generated wrapper.
export interface SyntheticClass {
  name: string
  meta: ClassMetaData
  javaSource: string
}

function punkt(x: number, y: number): JavaInstanceObject {
  return {
    class: 'Punkt',
    isInstance: true,
    fields: { x: { type: 'int', value: x }, y: { type: 'int', value: y } },
  }
}

const punktMeta: ClassMetaData = {
  name: 'Punkt',
  superClass: 'java.lang.Object',
  interfaces: [],
  fields: [
    { name: 'x', type: { kind: 'primitive', prim: 'int' } },
    { name: 'y', type: { kind: 'primitive', prim: 'int' } },
  ],
  methods: [
    {
      name: 'istGleich',
      sig: {
        params: [{ kind: 'class', name: 'Punkt' }],
        ret: { kind: 'primitive', prim: 'boolean' },
      },
      handler: (owner, args, env) => {
        const self = env.heap[owner.ref]
        const other = args[0]
        if (!('isInstance' in self) || other.type != 'reference') {
          return { type: 'boolean', value: false }
        }
        const obj = env.heap[other.ref]
        if (!('isInstance' in obj)) {
          return { type: 'boolean', value: false }
        }
        return {
          type: 'boolean',
          value:
            (self.fields.x as JavaIntValue).value ==
              (obj.fields.x as JavaIntValue).value &&
            (self.fields.y as JavaIntValue).value ==
              (obj.fields.y as JavaIntValue).value,
        }
      },
    },
    {
      name: 'summe',
      sig: { params: [], ret: { kind: 'primitive', prim: 'int' } },
      handler: (owner, _args, env) => {
        const self = env.heap[owner.ref]
        if (!('isInstance' in self)) {
          throw 'Interner Systemfehler: summe auf Nicht-Instanz'
        }
        // Route through the real evaluator so int promotion/wrapping is Java's.
        const sum: TypedNumericArithNodeS = {
          kind: 'binary',
          op: '+',
          left: { kind: 'literal', value: self.fields.x as JavaIntValue },
          right: { kind: 'literal', value: self.fields.y as JavaIntValue },
        }
        return evaluate<JavaIntValue>(sum, env)
      },
    },
  ],
}

export const Punkt: SyntheticClass = {
  name: 'Punkt',
  meta: punktMeta,
  javaSource: [
    'class Punkt {',
    '  int x;',
    '  int y;',
    '  boolean istGleich(Punkt p) { return this.x == p.x && this.y == p.y; }',
    '  int summe() { return this.x + this.y; }',
    '}',
  ].join('\n'),
}

export const syntheticClasses: Record<string, SyntheticClass> = {
  Punkt,
}

// Builds an env whose `this` is a Punkt with the given fields, plus optional other
// Punkt instances bound as locals (e.g. `p`) for `p.x` / `p.istGleich(this)`.
export function punktEnv(
  self: { x: number; y: number },
  others: Record<string, { x: number; y: number }> = {},
): JavaEnvironment {
  const heap: Record<string, JavaHeapObject> = {
    self: punkt(self.x, self.y),
  }
  const local: Record<string, JavaValue> = {}
  for (const [name, value] of Object.entries(others)) {
    heap[name] = punkt(value.x, value.y)
    local[name] = { type: 'reference', ref: name }
  }
  return {
    local,
    heap,
    contextMeta: { Punkt: punktMeta },
    contextInstance: { type: 'reference', ref: 'self' },
  }
}
