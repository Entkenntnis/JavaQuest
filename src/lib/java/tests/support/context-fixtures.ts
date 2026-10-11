import type {
  ClassMetaData,
  JavaBooleanValue,
  JavaCharValue,
  JavaDoubleValue,
  JavaEnvironment,
  JavaHeapObject,
  JavaInstanceObject,
  JavaIntValue,
  JavaLongValue,
  JavaNullValue,
  JavaReferenceValue,
  JavaStringHeapObject,
  JavaValue,
  Type,
  TypedNumericArithNodeS,
} from '../../../state/types'
import { evaluate } from '../../evaluate.ts'
import { freshHeapRef } from '../../helper/heap.ts'

// A synthetic class is the single source of truth for one hand-written class:
// `meta` drives the interpreter (typecheck/evaluate), `javaSource` drives the
// cross-check harness. The classes are package-private and live in the default
// package so they can be concatenated in front of the generated wrapper.
export interface SyntheticClass {
  name: string
  meta: ClassMetaData
  javaSource: string
}

// ------------------------------- value builders -------------------------------

export const ofInt = (value: number): JavaIntValue => ({ type: 'int', value })
export const ofBool = (value: boolean): JavaBooleanValue => ({
  type: 'boolean',
  value,
})
export const ofLong = (value: number | string | bigint): JavaLongValue => ({
  type: 'long',
  value: value.toString(),
})
export const ofDouble = (value: number): JavaDoubleValue => ({
  type: 'double',
  value,
})
export const ofChar = (value: number): JavaCharValue => ({ type: 'char', value })
export const ref = (name: string): JavaReferenceValue => ({
  type: 'reference',
  ref: name,
})
export const nul: JavaNullValue = { type: 'null', value: null }

export function stringObject(
  value: string,
  interned = true,
): JavaStringHeapObject {
  return { class: 'java.lang.String', stringValue: value, isInterned: interned }
}

export function punkt(x: number, y: number): JavaInstanceObject {
  return { class: 'Punkt', isInstance: true, fields: { x: ofInt(x), y: ofInt(y) } }
}

export function rechteck(a: JavaValue, b: JavaValue): JavaInstanceObject {
  return { class: 'Rechteck', isInstance: true, fields: { a, b } }
}

export function person(name: JavaValue, alter: number): JavaInstanceObject {
  return { class: 'Person', isInstance: true, fields: { name, alter: ofInt(alter) } }
}

export function mix(
  gross: number | string | bigint,
  anteil: number,
  zeichen: number,
  ok: boolean,
): JavaInstanceObject {
  return {
    class: 'Mix',
    isInstance: true,
    fields: {
      gross: ofLong(gross),
      anteil: ofDouble(anteil),
      zeichen: ofChar(zeichen),
      ok: ofBool(ok),
    },
  }
}

// ------------------------------- handler helpers -------------------------------

function asInstance(
  env: JavaEnvironment,
  reference: JavaReferenceValue,
): JavaInstanceObject {
  const obj = env.heap[reference.ref]
  if (!('isInstance' in obj)) {
    throw 'Interner Systemfehler: Empfänger ist keine Instanz'
  }
  return obj
}

function intField(obj: JavaInstanceObject, name: string): JavaIntValue {
  return obj.fields[name] as JavaIntValue
}

function instanceField(
  env: JavaEnvironment,
  obj: JavaInstanceObject,
  name: string,
): JavaInstanceObject {
  const field = obj.fields[name]
  if (field.type != 'reference') {
    throw new Error('java.lang.NullPointerException')
  }
  return asInstance(env, field)
}

// int arithmetic through the real evaluator, so promotion/wrapping is Java's.
function intArith(
  op: TypedNumericArithNodeS['op'],
  left: JavaIntValue,
  right: JavaIntValue,
  env: JavaEnvironment,
): JavaIntValue {
  const node: TypedNumericArithNodeS = {
    kind: 'binary',
    op,
    left: { kind: 'literal', value: left },
    right: { kind: 'literal', value: right },
  }
  return evaluate<JavaIntValue>(node, env)
}

// --------------------------------- classes ---------------------------------

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
      name: 'kopie',
      sig: { params: [], ret: { kind: 'class', name: 'Punkt' } },
      handler: (owner, _args, env) => {
        const self = asInstance(env, owner)
        const copy: JavaInstanceObject = {
          class: 'Punkt',
          isInstance: true,
          fields: {
            x: { ...intField(self, 'x') },
            y: { ...intField(self, 'y') },
          },
        }
        const target = freshHeapRef(env)
        env.heap[target] = copy
        return { type: 'reference', ref: target }
      },
    },
    {
      name: 'istGleich',
      sig: {
        params: [{ kind: 'class', name: 'Punkt' }],
        ret: { kind: 'primitive', prim: 'boolean' },
      },
      handler: (owner, args, env) => {
        const self = asInstance(env, owner)
        const other = args[0]
        if (other.type != 'reference') {
          throw new Error('java.lang.NullPointerException')
        }
        const obj = env.heap[other.ref]
        if (!('isInstance' in obj)) return ofBool(false)
        return ofBool(
          intField(self, 'x').value == intField(obj, 'x').value &&
            intField(self, 'y').value == intField(obj, 'y').value,
        )
      },
    },
    {
      name: 'istUrsprung',
      sig: { params: [], ret: { kind: 'primitive', prim: 'boolean' } },
      handler: (owner, _args, env) => {
        const self = asInstance(env, owner)
        return ofBool(
          intField(self, 'x').value == 0 && intField(self, 'y').value == 0,
        )
      },
    },
    {
      name: 'summe',
      sig: { params: [], ret: { kind: 'primitive', prim: 'int' } },
      handler: (owner, _args, env) => {
        const self = asInstance(env, owner)
        return intArith('+', intField(self, 'x'), intField(self, 'y'), env)
      },
    },
  ],
}

const rechteckMeta: ClassMetaData = {
  name: 'Rechteck',
  superClass: 'java.lang.Object',
  interfaces: [],
  fields: [
    { name: 'a', type: { kind: 'class', name: 'Punkt' } },
    { name: 'b', type: { kind: 'class', name: 'Punkt' } },
  ],
  methods: [
    {
      name: 'istGleich',
      sig: {
        params: [{ kind: 'class', name: 'Rechteck' }],
        ret: { kind: 'primitive', prim: 'boolean' },
      },
      handler: (owner, args, env) => {
        const self = asInstance(env, owner)
        const other = args[0]
        if (other.type != 'reference') {
          throw new Error('java.lang.NullPointerException')
        }
        const obj = env.heap[other.ref]
        if (!('isInstance' in obj)) return ofBool(false)
        const sa = instanceField(env, self, 'a')
        const sb = instanceField(env, self, 'b')
        const oa = instanceField(env, obj, 'a')
        const ob = instanceField(env, obj, 'b')
        return ofBool(
          intField(sa, 'x').value == intField(oa, 'x').value &&
            intField(sa, 'y').value == intField(oa, 'y').value &&
            intField(sb, 'x').value == intField(ob, 'x').value &&
            intField(sb, 'y').value == intField(ob, 'y').value,
        )
      },
    },
    {
      name: 'flaeche',
      sig: { params: [], ret: { kind: 'primitive', prim: 'int' } },
      handler: (owner, _args, env) => {
        const self = asInstance(env, owner)
        const a = instanceField(env, self, 'a')
        const b = instanceField(env, self, 'b')
        const dx = intArith('-', intField(b, 'x'), intField(a, 'x'), env)
        const dy = intArith('-', intField(b, 'y'), intField(a, 'y'), env)
        return intArith('*', dx, dy, env)
      },
    },
    {
      name: 'hatNullEcke',
      sig: { params: [], ret: { kind: 'primitive', prim: 'boolean' } },
      handler: (owner, _args, env) => {
        const self = asInstance(env, owner)
        return ofBool(
          self.fields.a.type == 'null' || self.fields.b.type == 'null',
        )
      },
    },
    {
      name: 'eckeA',
      sig: { params: [], ret: { kind: 'class', name: 'Punkt' } },
      handler: (owner, _args, env) => {
        const self = asInstance(env, owner)
        return self.fields.a
      },
    },
  ],
}

const personMeta: ClassMetaData = {
  name: 'Person',
  superClass: 'java.lang.Object',
  interfaces: [],
  fields: [
    { name: 'name', type: { kind: 'class', name: 'java.lang.String' } },
    { name: 'alter', type: { kind: 'primitive', prim: 'int' } },
  ],
  methods: [
    {
      name: 'heisst',
      sig: {
        params: [{ kind: 'class', name: 'java.lang.String' }],
        ret: { kind: 'primitive', prim: 'boolean' },
      },
      handler: (owner, args, env) => {
        const self = asInstance(env, owner)
        const ownName = self.fields.name
        const arg = args[0]
        if (ownName.type != 'reference') {
          throw new Error('java.lang.NullPointerException')
        }
        if (arg.type != 'reference') {
          return ofBool(false)
        }
        const own = env.heap[ownName.ref]
        const other = env.heap[arg.ref]
        if (!('stringValue' in own) || !('stringValue' in other)) {
          return ofBool(false)
        }
        return ofBool(own.stringValue == other.stringValue)
      },
    },
    {
      name: 'alterInMonaten',
      sig: { params: [], ret: { kind: 'primitive', prim: 'int' } },
      handler: (owner, _args, env) => {
        const self = asInstance(env, owner)
        return intArith('*', intField(self, 'alter'), ofInt(12), env)
      },
    },
    {
      name: 'name',
      sig: { params: [], ret: { kind: 'class', name: 'java.lang.String' } },
      handler: (owner, _args, env) => {
        const self = asInstance(env, owner)
        return self.fields.name
      },
    },
  ],
}

const mixMeta: ClassMetaData = {
  name: 'Mix',
  superClass: 'java.lang.Object',
  interfaces: [],
  fields: [
    { name: 'gross', type: { kind: 'primitive', prim: 'long' } },
    { name: 'anteil', type: { kind: 'primitive', prim: 'double' } },
    { name: 'zeichen', type: { kind: 'primitive', prim: 'char' } },
    { name: 'ok', type: { kind: 'primitive', prim: 'boolean' } },
  ],
  methods: [
    {
      name: 'passt',
      sig: {
        params: [{ kind: 'primitive', prim: 'long' }],
        ret: { kind: 'primitive', prim: 'boolean' },
      },
      handler: (owner, args, env) => {
        const self = asInstance(env, owner)
        const grenze = args[0]
        if (grenze.type != 'long') return ofBool(false)
        const gross = self.fields.gross as JavaLongValue
        const ok = self.fields.ok as JavaBooleanValue
        return ofBool(BigInt(gross.value) <= BigInt(grenze.value) && ok.value)
      },
    },
    {
      name: 'verdoppelt',
      sig: { params: [], ret: { kind: 'primitive', prim: 'double' } },
      handler: (owner, _args, env) => {
        const self = asInstance(env, owner)
        const anteil = self.fields.anteil as JavaDoubleValue
        return { type: 'double', value: anteil.value * 2 }
      },
    },
    {
      name: 'zeichen',
      sig: { params: [], ret: { kind: 'primitive', prim: 'char' } },
      handler: (owner, _args, env) => {
        const self = asInstance(env, owner)
        return self.fields.zeichen
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
    '  Punkt kopie() {',
    '    Punkt k = new Punkt();',
    '    k.x = this.x; k.y = this.y;',
    '    return k;',
    '  }',
    '  boolean istGleich(Punkt p) { return this.x == p.x && this.y == p.y; }',
    '  boolean istUrsprung() { return this.x == 0 && this.y == 0; }',
    '  int summe() { return this.x + this.y; }',
    '}',
  ].join('\n'),
}

export const Rechteck: SyntheticClass = {
  name: 'Rechteck',
  meta: rechteckMeta,
  javaSource: [
    'class Rechteck {',
    '  Punkt a;',
    '  Punkt b;',
    '  boolean istGleich(Rechteck r) {',
    '    return this.a.x == r.a.x && this.a.y == r.a.y',
    '        && this.b.x == r.b.x && this.b.y == r.b.y;',
    '  }',
    '  int flaeche() { return (this.b.x - this.a.x) * (this.b.y - this.a.y); }',
    '  boolean hatNullEcke() { return this.a == null || this.b == null; }',
    '  Punkt eckeA() { return this.a; }',
    '}',
  ].join('\n'),
}

export const Person: SyntheticClass = {
  name: 'Person',
  meta: personMeta,
  javaSource: [
    'class Person {',
    '  String name;',
    '  int alter;',
    '  boolean heisst(String n) { return this.name.equals(n); }',
    '  int alterInMonaten() { return this.alter * 12; }',
    '  String name() { return this.name; }',
    '}',
  ].join('\n'),
}

export const Mix: SyntheticClass = {
  name: 'Mix',
  meta: mixMeta,
  javaSource: [
    'class Mix {',
    '  long gross;',
    '  double anteil;',
    '  char zeichen;',
    '  boolean ok;',
    '  boolean passt(long grenze) { return this.gross <= grenze && this.ok; }',
    '  double verdoppelt() { return this.anteil * 2; }',
    '  char zeichen() { return this.zeichen; }',
    '}',
  ].join('\n'),
}

export const syntheticClasses: Record<string, SyntheticClass> = {
  Punkt,
  Rechteck,
  Person,
  Mix,
}

const metasByName: Record<string, ClassMetaData> = {
  Punkt: punktMeta,
  Rechteck: rechteckMeta,
  Person: personMeta,
  Mix: mixMeta,
}

function requireMeta(name: string): ClassMetaData {
  const meta = metasByName[name]
  if (!meta) {
    throw `Interner Systemfehler: keine Meta für Klasse ${name}`
  }
  return meta
}

// Builds the registry an env needs: every synthetic class reachable from the
// heap instances (transitively through field/method types), so that even a
// class only referenced by a null field or a parameter is known.
function collectClassNames(heap: Record<string, JavaHeapObject>): Set<string> {
  const names = new Set<string>()
  const visitType = (type: Type): void => {
    if (type.kind == 'class') visit(type.name)
    else if (type.kind == 'array') visitType(type.elem)
  }
  const visit = (name: string): void => {
    if (names.has(name) || !metasByName[name]) return
    names.add(name)
    const meta = metasByName[name]
    for (const field of meta.fields) visitType(field.type)
    for (const method of meta.methods) {
      for (const param of method.sig.params) visitType(param)
      if (method.sig.ret.kind != 'void') visitType(method.sig.ret)
    }
  }
  for (const obj of Object.values(heap)) {
    if ('isInstance' in obj) visit(obj.class)
  }
  return names
}

// Generic context env: `contextObject` names the `this` instance on the heap.
export function contextEnv(
  contextObject: string,
  heap: Record<string, JavaHeapObject>,
  local: Record<string, JavaValue> = {},
): JavaEnvironment {
  const context = heap[contextObject]
  if (!context || !('isInstance' in context)) {
    throw `Interner Systemfehler: Kontextobjekt ${contextObject} ist keine Instanz`
  }
  const contextMeta: Record<string, ClassMetaData> = {}
  for (const name of collectClassNames(heap)) {
    contextMeta[name] = requireMeta(name)
  }
  return { local, heap, contextMeta, contextInstance: ref(contextObject) }
}

// ------------------------------ env shortcuts ------------------------------

export function punktEnv(
  self: { x: number; y: number },
  others: Record<string, { x: number; y: number }> = {},
): JavaEnvironment {
  const heap: Record<string, JavaHeapObject> = { self: punkt(self.x, self.y) }
  const local: Record<string, JavaValue> = {}
  for (const [name, value] of Object.entries(others)) {
    heap[name] = punkt(value.x, value.y)
    local[name] = ref(name)
  }
  return contextEnv('self', heap, local)
}

type PunktSpec = { x: number; y: number } | null

function punktField(
  heap: Record<string, JavaHeapObject>,
  name: string,
  spec: PunktSpec,
): JavaValue {
  if (!spec) return nul
  heap[name] = punkt(spec.x, spec.y)
  return ref(name)
}

export function rechteckEnv(
  self: { a: PunktSpec; b: PunktSpec },
  others: Record<string, { a: PunktSpec; b: PunktSpec }> = {},
): JavaEnvironment {
  const heap: Record<string, JavaHeapObject> = {}
  const local: Record<string, JavaValue> = {}
  heap['self'] = rechteck(
    punktField(heap, 'self.a', self.a),
    punktField(heap, 'self.b', self.b),
  )
  for (const [name, spec] of Object.entries(others)) {
    heap[name] = rechteck(
      punktField(heap, `${name}.a`, spec.a),
      punktField(heap, `${name}.b`, spec.b),
    )
    local[name] = ref(name)
  }
  return contextEnv('self', heap, local)
}

export function personEnv(
  self: { name: string; alter: number },
  others: Record<string, { name: string; alter: number }> = {},
): JavaEnvironment {
  const heap: Record<string, JavaHeapObject> = {}
  const local: Record<string, JavaValue> = {}
  heap['self.name'] = stringObject(self.name)
  heap['self'] = person(ref('self.name'), self.alter)
  for (const [name, spec] of Object.entries(others)) {
    heap[`${name}.name`] = stringObject(spec.name)
    heap[name] = person(ref(`${name}.name`), spec.alter)
    local[name] = ref(name)
  }
  return contextEnv('self', heap, local)
}

export function mixEnv(self: {
  gross: number | string | bigint
  anteil: number
  zeichen: number
  ok: boolean
}): JavaEnvironment {
  return contextEnv('self', {
    self: mix(self.gross, self.anteil, self.zeichen, self.ok),
  })
}
