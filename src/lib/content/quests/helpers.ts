import type { JavaEnvironment, JavaValue } from '../../state/types'

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
