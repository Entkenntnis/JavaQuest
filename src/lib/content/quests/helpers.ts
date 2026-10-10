import type {
  JavaArrayHeapObject,
  JavaEnvironment,
  JavaValue,
} from '../../state/types'

export function env(...entries: [string, JavaValue][]): JavaEnvironment {
  const env: JavaEnvironment = {
    local: {},
    heap: {},
  }
  for (const [name, value] of entries) {
    env.local[name] = value
  }
  return env
}

export function intEnv(...entries: [string, number][]): JavaEnvironment {
  return env(
    ...entries.map(([name, value]): [string, JavaValue] => [
      name,
      { type: 'int', value },
    ]),
  )
}

export function intArrayEnv(name: string, values: number[]): JavaEnvironment {
  const ref = `array_${name}`
  const array: JavaArrayHeapObject = {
    class: 'int[]',
    isArray: true,
    elements: values.map((value) => ({ type: 'int', value })),
    type: { kind: 'primitive', prim: 'int' },
  }
  return {
    local: { [name]: { type: 'reference', ref } },
    heap: { [ref]: array },
  }
}

export function boolEnv(...entries: [string, boolean][]): JavaEnvironment {
  return env(
    ...entries.map(([name, value]): [string, JavaValue] => [
      name,
      { type: 'boolean', value },
    ]),
  )
}

export function mergeEnv(...envs: JavaEnvironment[]): JavaEnvironment {
  const result: JavaEnvironment = { local: {}, heap: {} }
  for (const e of envs) {
    Object.assign(result.local, e.local)
    Object.assign(result.heap, e.heap)
  }
  return result
}

export function charEnv(...entries: [string, number][]): JavaEnvironment {
  return env(
    ...entries.map(([name, value]): [string, JavaValue] => [
      name,
      { type: 'char', value },
    ]),
  )
}

export function longEnv(
  ...entries: [string, number | string | bigint][]
): JavaEnvironment {
  return env(
    ...entries.map(([name, value]): [string, JavaValue] => [
      name,
      { type: 'long', value: value.toString() },
    ]),
  )
}

export function doubleEnv(...entries: [string, number][]): JavaEnvironment {
  return env(
    ...entries.map(([name, value]): [string, JavaValue] => [
      name,
      { type: 'double', value },
    ]),
  )
}

export function stringEnv(...entries: [string, string][]): JavaEnvironment {
  const result: JavaEnvironment = { local: {}, heap: {} }
  for (const [name, value] of entries) {
    const ref = `heap${Object.keys(result.heap).length}`
    result.heap[ref] = { class: 'java.lang.String', value, isInterned: true }
    result.local[name] = { type: 'reference', ref }
  }
  return result
}

// Like stringEnv, but every string is a fresh, non-interned object with its own
// heap reference. This keeps reference equality (==) from accidentally matching
// equal content, which is exactly what the String chapter wants to contrast
// against content equality (equals).
export function rawStringsEnv(
  ...entries: [string, string][]
): JavaEnvironment {
  const result: JavaEnvironment = { local: {}, heap: {} }
  for (const [name, value] of entries) {
    const ref = `heap${Object.keys(result.heap).length}`
    result.heap[ref] = { class: 'java.lang.String', value }
    result.local[name] = { type: 'reference', ref }
  }
  return result
}

// A String[] on the heap, with each element pointing at its own String object.
// Used by quests that read a command-line argument array (e.g. args.length).
export function stringArrayEnv(name: string, values: string[]): JavaEnvironment {
  const ref = `array_${name}`
  const heap: JavaEnvironment['heap'] = {}
  const elements = values.map((value, i): JavaValue => {
    const objRef = `array_${name}_${i}`
    heap[objRef] = { class: 'java.lang.String', value, isInterned: true }
    return { type: 'reference', ref: objRef }
  })
  heap[ref] = {
    class: 'java.lang.String[]',
    isArray: true,
    elements,
    type: { kind: 'class', name: 'java.lang.String' },
  }
  return {
    local: { [name]: { type: 'reference', ref } },
    heap,
  }
}

// Read a variable's value back out of an environment after a snippet has been
// evaluated. Quest drivers use these so that side effects the student's
// expression performs on a loop/state variable (assignments, ++/--) are honoured
// instead of silently discarded.

export function readIntLocal(
  env: JavaEnvironment,
  name: string,
  fallback: number,
): number {
  const v = env.local[name]
  return v && v.type == 'int' ? v.value : fallback
}

export function readCharLocal(
  env: JavaEnvironment,
  name: string,
  fallback: number,
): number {
  const v = env.local[name]
  return v && v.type == 'char' ? v.value : fallback
}

export function readDoubleLocal(
  env: JavaEnvironment,
  name: string,
  fallback: number,
): number {
  const v = env.local[name]
  return v && v.type == 'double' ? v.value : fallback
}

export function readStringLocal(
  env: JavaEnvironment,
  name: string,
  fallback: string,
): string {
  const v = env.local[name]
  if (v && v.type == 'reference') {
    const obj = env.heap[v.ref]
    if (obj && obj.class == 'java.lang.String') return obj.value
  }
  return fallback
}
