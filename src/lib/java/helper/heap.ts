import type {
  JavaNumericPrimitiveValue,
  JavaBooleanValue,
  JavaEnvironment,
  JavaReferenceValue,
} from '../../state/types'

// The JVM's autoboxing caches: Integer/Short/Long share the -128..127 instances,
// Character the 0..127 ones, Byte the whole range and Boolean two singletons; Float and
// Double are never cached. The returned name is the single source of truth for the heap
import { typeToWrapper } from './typing'

// entry of a cached wrapper, shared by autoboxing and by boxed env locals.
export function boxCacheRef(
  raw: JavaNumericPrimitiveValue | JavaBooleanValue,
): string | null {
  if (raw.type == 'boolean') {
    return `box_cache_boolean_${raw.value}`
  }
  if (raw.type == 'byte') {
    return `box_cache_byte_${raw.value}`
  }
  if (raw.type == 'short' && raw.value >= -128 && raw.value <= 127) {
    return `box_cache_short_${raw.value}`
  }
  if (raw.type == 'char' && raw.value <= 127) {
    return `box_cache_char_${raw.value}`
  }
  if (raw.type == 'int' && raw.value >= -128 && raw.value <= 127) {
    return `box_cache_int_${raw.value}`
  }
  if (raw.type == 'long') {
    const v = BigInt(raw.value)
    if (v >= -128 && v <= 127) {
      return `box_cache_long_${raw.value}`
    }
  }
  return null
}

export function primitiveValueIntoHeap(
  raw: JavaNumericPrimitiveValue | JavaBooleanValue,
  env: JavaEnvironment,
): JavaReferenceValue {
  const ref = boxCacheRef(raw) ?? freshHeapRef(env)
  env.heap[ref] = {
    class: typeToWrapper[raw.type],
    value: { ...raw, boxed: undefined },
    isWrapper: true,
  }
  return { type: 'reference', ref }
}

export function freshHeapRef(env: JavaEnvironment) {
  let i = 0
  while (`heap${i}` in env.heap) {
    i++
  }
  return `heap${i}`
}
