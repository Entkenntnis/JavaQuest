import type { JavaValue, JavaEnvironment } from '../../state/types'
import { printDouble } from './floating/double'
import { printFloat } from './floating/float'

export function javaValueToString(
  val: JavaValue,
  env: JavaEnvironment,
): string {
  switch (val.type) {
    case 'boolean':
      return val.value ? 'true' : 'false'
    case 'byte':
    case 'short':
    case 'int':
    case 'long':
      return val.value.toString()
    case 'char':
      return String.fromCodePoint(val.value)
    case 'float':
      return printFloat(val.value)
    case 'double':
      return printDouble(val.value)
    case 'reference':
      const obj = env.heap[val.ref]
      if (obj.class == 'java.lang.String') {
        return obj.value
      }
      if ('isWrapper' in obj) {
        return javaValueToString(obj.value, env)
      }
      // TODO: if new methods arrive, find the toString method and invoke it
      return '?OBJ?'
    case 'null':
      return 'null'
  }
}
