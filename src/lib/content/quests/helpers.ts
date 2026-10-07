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
