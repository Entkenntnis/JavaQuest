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
  JavaValue,
  Prim,
} from '../../state/types'

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

// Builds an env containing only the arrays a single test cares about, so the test page
// does not print unrelated locals. Each spec entry becomes a local of the same name; a
// `{ aliasOf }` entry points at an already-declared local instead of creating an object.
export function arrayEnv(
  specs: Record<string, JavaArrayHeapObject | { aliasOf: string }>,
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
  specs: Record<string, JavaArrayHeapObject | { aliasOf: string }>,
  locals: Record<string, JavaValue>,
): JavaEnvironment {
  const env = arrayEnv(specs)
  return { local: { ...env.local, ...locals }, heap: env.heap }
}
