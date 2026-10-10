import type {
  JavaArrayHeapObject,
  JavaBooleanValue,
  JavaByteValue,
  JavaCharValue,
  JavaDoubleValue,
  JavaEnvironment,
  JavaFloatValue,
  JavaHeapObject,
  JavaIntValue,
  JavaLongValue,
  JavaReferenceValue,
  JavaShortValue,
  JavaStringHeapObject,
  JavaValue,
  Prim,
  Type,
} from '../../state/types'

// Minimal Java type rendering, kept local so this fixture module has no runtime imports
// (the cross-check runner loads it through Node's type stripping without a resolver).
function componentName(component: Type): string {
  if (component.kind == 'primitive') return component.prim
  if (component.kind == 'class') return component.name
  return `${componentName(component.elem)}[]`
}

export const ints = (values: number[]): JavaIntValue[] =>
  values.map((value) => ({ type: 'int', value }))

export const longs = (values: string[]): JavaLongValue[] =>
  values.map((value) => ({ type: 'long', value }))

export const shorts = (values: number[]): JavaShortValue[] =>
  values.map((value) => ({ type: 'short', value }))

export const bytes = (values: number[]): JavaByteValue[] =>
  values.map((value) => ({ type: 'byte', value }))

export const chars = (values: number[]): JavaCharValue[] =>
  values.map((value) => ({ type: 'char', value }))

export const floats = (values: number[]): JavaFloatValue[] =>
  values.map((value) => ({ type: 'float', value }))

export const doubles = (values: number[]): JavaDoubleValue[] =>
  values.map((value) => ({ type: 'double', value }))

export const booleans = (values: boolean[]): JavaBooleanValue[] =>
  values.map((value) => ({ type: 'boolean', value }))

export function arrayObject(
  prim: Prim,
  elements: JavaArrayHeapObject['elements'],
): JavaArrayHeapObject {
  return {
    class: `${prim}[]`,
    isArray: true,
    type: { kind: 'primitive', prim },
    elements,
  }
}

// General reference-capable array: any component type, any element values (references,
// null, primitives). Covers object arrays such as String[] that `arrayObject` cannot
// express.
export function refArray(
  component: Type,
  elements: (JavaValue | null)[],
): JavaArrayHeapObject {
  return {
    class: `${componentName(component)}[]`,
    isArray: true,
    type: component,
    elements: elements.map((element) => element ?? { type: 'null', value: null }),
  }
}

// A String heap object, so tests can name and reuse the same String across locals and
// array elements.
export function stringObject(
  value: string,
  interned = true,
): JavaStringHeapObject {
  return { class: 'java.lang.String', value, isInterned: interned }
}

// A String[] whose elements point at named String objects (registered as locals in the
// same `arrayEnv` call) or are null.
export function stringArray(names: (string | null)[]): JavaArrayHeapObject {
  return refArray(
    { kind: 'class', name: 'java.lang.String' },
    names.map((name): JavaValue | null =>
      name === null ? null : { type: 'reference', ref: name },
    ),
  )
}

// Builds an env containing only the objects a single test cares about, so the test page
// does not print unrelated locals. Each spec entry becomes a local of the same name; a
// `{ aliasOf }` entry points at an already-declared local instead of creating an object.
export function arrayEnv(
  specs: Record<string, JavaHeapObject | { aliasOf: string }>,
): JavaEnvironment {
  const local: Record<string, JavaReferenceValue> = {}
  const heap: Record<string, JavaHeapObject> = {}
  const refByLocal: Record<string, string> = {}
  for (const [name, spec] of Object.entries(specs)) {
    if ('aliasOf' in spec) {
      const ref = refByLocal[spec.aliasOf]
      if (!ref) {
        throw new Error(
          `arrayEnv: alias "${name}" refers to unknown local "${spec.aliasOf}"`,
        )
      }
      local[name] = { type: 'reference', ref }
      continue
    }
    refByLocal[name] = name
    heap[name] = spec
    local[name] = { type: 'reference', ref: name }
  }
  return { local, heap }
}

// Same as `arrayEnv`, plus extra primitive/boxed locals (e.g. an index variable).
// Kept separate so ordinary array tests do not carry unused declarations.
export function arrayEnvWithLocals(
  specs: Record<string, JavaHeapObject | { aliasOf: string }>,
  locals: Record<string, JavaValue>,
): JavaEnvironment {
  const env = arrayEnv(specs)
  return { local: { ...env.local, ...locals }, heap: env.heap }
}
