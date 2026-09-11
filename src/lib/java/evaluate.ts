import { printDouble } from './helper/floating/double'
import { printFloat } from './helper/floating/float'
import {
  type JavaBooleanValue,
  type JavaByteValue,
  type JavaCharValue,
  type JavaDoubleValue,
  type JavaEnvironment,
  type JavaFloatValue,
  type JavaIntegerValue,
  type JavaIntValue,
  type JavaLongValue,
  type JavaNullValue,
  type JavaNumericPrimitiveValue,
  type JavaReferenceValue,
  type JavaShortValue,
  type JavaValue,
  type TypedNode,
} from '../state/types'
import { typeToWrapper } from './helper/typing'

export function evaluate<T extends JavaValue>(
  node: TypedNode<T>,
  env: JavaEnvironment,
): T {
  return evaluate_internal(node, env) as T
}

function evaluate_internal(
  node: TypedNode<JavaValue>,
  env: JavaEnvironment,
): JavaValue {
  switch (node.kind) {
    case 'literal': {
      return node.value
    }
    case 'string-literal': {
      // walk the heap
      for (const [key, val] of Object.entries(env.heap)) {
        if (
          val.class == 'java.lang.String' &&
          val.value == node.value &&
          val.isInterned
        ) {
          return { type: 'reference', ref: key }
        }
      }
      // new string to be interned
      const ref = freshHeapRef(env)
      env.heap[ref] = {
        class: 'java.lang.String',
        value: node.value,
        isInterned: true,
      }
      return { type: 'reference', ref }
    }
    case 'unary': {
      switch (node.op) {
        case '+': {
          // null is annoying - it is bleeding everywhere into the system
          const inner = evaluate<JavaNumericPrimitiveValue | JavaNullValue>(
            node.operand,
            env,
          )
          if (inner.type == 'null') {
            throw new Error('NullPointerException beim Entpacken von null')
          }
          if (isSmallInt(inner)) {
            return toInt(inner)
          } else {
            return inner
          }
        }
        case '-': {
          const inner = evaluate<JavaNumericPrimitiveValue | JavaNullValue>(
            node.operand,
            env,
          )
          if (inner.type == 'null') {
            throw new Error('NullPointerException beim Entpacken von null')
          }
          if (isSmallInt(inner)) {
            return toInt({ type: 'int', value: -inner.value })
          }
          if (inner.type == 'long') {
            return toLong({
              type: 'long',
              value: (-BigInt(inner.value)).toString(),
            })
          }
          return { type: inner.type, value: -inner.value }
        }
        case '!': {
          return {
            type: 'boolean',
            value: !unboxBoolean(evaluate(node.operand, env)),
          }
        }
        case '~': {
          const inner = evaluate<JavaIntegerValue | JavaNullValue>(
            node.operand,
            env,
          )
          if (inner.type == 'null') {
            throw new Error('NullPointerException beim Entpacken von null')
          }
          return convertTo(inner.type == 'long' ? 'long' : 'int', {
            type: 'long',
            value: (~BigInt(inner.value)).toString(),
          })
        }
      }
    }
    case 'binary': {
      switch (node.op) {
        case '&&': {
          if (!unboxBoolean(evaluate(node.left, env))) {
            return { type: 'boolean', value: false }
          }
          return {
            type: 'boolean',
            value: unboxBoolean(evaluate(node.right, env)),
          }
        }
        case '||': {
          if (unboxBoolean(evaluate(node.left, env))) {
            return { type: 'boolean', value: true }
          }
          return {
            type: 'boolean',
            value: unboxBoolean(evaluate(node.right, env)),
          }
        }
        case '+':
        case '-':
        case '*':
        case '/':
        case '%': {
          const innerLeft = evaluate<JavaNumericPrimitiveValue>(node.left, env)
          const innerRight = evaluate<JavaNumericPrimitiveValue>(
            node.right,
            env,
          )
          if (innerLeft.value === null || innerRight.value === null) {
            throw new Error('NullPointerException beim Entpacken von null')
          }

          const [promoType, left, right] = binaryNumericPromotion(
            innerLeft,
            innerRight,
          )
          const isInteger = promoType == 'long' || promoType == 'int'

          const ops: Record<string, (a: number, b: number) => number> = {
            '+': (a, b) => a + b,
            '-': (a, b) => a - b,
            '*': (a, b) => a * b,
            '/': (a, b) => a / b,
            '%': (a, b) => a % b,
          }

          const opsBig: Record<string, (a: bigint, b: bigint) => bigint> = {
            '+': (a, b) => a + b,
            '-': (a, b) => a - b,
            '*': (a, b) => a * b,
            '/': (a, b) => a / b,
            '%': (a, b) => a % b,
          }

          if (isInteger) {
            if (node.op == '/' && BigInt(right.value) == 0n) {
              throw new Error('Division durch Null')
            }
            if (node.op == '%' && BigInt(right.value) == 0n) {
              throw new Error('Modulo durch Null')
            }
            return convertTo(left.type, {
              type: 'long',
              value: opsBig[node.op](
                BigInt(left.value),
                BigInt(right.value),
              ).toString(),
            })
          }
          return convertTo(left.type, {
            type: 'double',
            value: ops[node.op](left.value, right.value),
          })
        }
        case 'concat': {
          const value =
            javaValueToString(evaluate<JavaValue>(node.left, env), env) +
            javaValueToString(evaluate<JavaValue>(node.right, env), env)
          const ref = freshHeapRef(env)
          env.heap[ref] = {
            class: 'java.lang.String',
            value,
          }
          return { type: 'reference', ref }
        }
        case '==b': {
          const raw =
            evaluate(node.left, env).value === evaluate(node.right, env).value
          return {
            type: 'boolean',
            value: node.negate ? !raw : raw,
          }
        }
        case '==n': {
          const innerLeft = evaluate(node.left, env)
          const innerRight = evaluate(node.right, env)
          if (innerLeft.value === null || innerRight.value === null) {
            throw new Error('NullPointerException beim Entpacken von null')
          }

          const [, left, right] = binaryNumericPromotion(innerLeft, innerRight)
          const raw = left.value === right.value
          return { type: 'boolean', value: node.negate ? !raw : raw }
        }
        case '==r': {
          const left = evaluate(node.left, env)
          const right = evaluate(node.right, env)
          return compareR(left, right, node.negate)
        }
        case '==box': {
          let left = evaluate(node.left, env)
          let right = evaluate(node.right, env)

          if (left.type != 'reference' && left.type != 'null') {
            if (typeof left.boxed === 'string') {
              left = { type: 'reference', ref: left.boxed }
            } else {
              left = primitiveValueIntoHeap(left, env)
            }
          }

          if (right.type != 'reference' && right.type != 'null') {
            if (typeof right.boxed === 'string') {
              right = { type: 'reference', ref: right.boxed }
            } else {
              right = primitiveValueIntoHeap(right, env)
            }
          }
          return compareR(left, right, node.negate)
        }
        case '<<':
        case '>>':
        case '>>>': {
          // JLS 15.19: the operands are unary-numeric-promoted individually
          // (not binary-numeric-promoted together) and the result type is the
          // promoted type of the LEFT operand only: long when it is long, else
          // int. The right operand merely supplies a shift distance.
          const left = evaluate<JavaIntegerValue>(node.left, env)
          const right = evaluate<JavaIntegerValue>(node.right, env)
          const isLong = left.type == 'long'
          const a = BigInt(left.value)
          // Only the five (int) or six (long) lowest-order bits of the promoted
          // right operand are used as the shift distance (JLS 15.19).
          const shift = BigInt(right.value) & (isLong ? 0x3fn : 0x1fn)
          const raw =
            node.op == '<<'
              ? a << shift
              : node.op == '>>'
                ? a >> shift
                : BigInt.asIntN(
                    isLong ? 64 : 32,
                    BigInt.asUintN(isLong ? 64 : 32, a) >> shift,
                  )
          const value = isLong ? BigInt.asIntN(64, raw) : BigInt.asIntN(32, raw)
          if (isLong) {
            return { type: 'long', value: value.toString() }
          }
          return { type: 'int', value: Number(value) }
        }
        case '|':
        case '&':
        case '^': {
          const left = evaluate<JavaIntegerValue>(node.left, env)
          const right = evaluate<JavaIntegerValue>(node.right, env)
          const isLong = left.type == 'long' || right.type == 'long'
          const bits = isLong ? 64 : 32

          const L = BigInt.asIntN(bits, BigInt(left.value))
          const R = BigInt.asIntN(bits, BigInt(right.value))
          const raw = node.op == '|' ? L | R : node.op == '&' ? L & R : L ^ R

          const value = BigInt.asIntN(bits, raw)
          if (isLong) {
            return { type: 'long', value: value.toString() }
          }
          return { type: 'int', value: Number(value) }
        }
        case '|b':
        case '&b':
        case '^b': {
          const left = unboxBoolean(evaluate(node.left, env))
          const right = unboxBoolean(evaluate(node.right, env))

          let result = false
          if (node.op == '|b') {
            if (left || right) {
              result = true
            }
          }
          if (node.op == '&b') {
            if (left && right) {
              result = true
            }
          }
          if (node.op == '^b' && ((left && !right) || (!left && right))) {
            result = true
          }
          return { type: 'boolean', value: result }
        }
        case '<':
        case '>':
        case '<=':
        case '>=': {
          const innerLeft = evaluate(node.left, env)
          const innerRight = evaluate(node.right, env)
          if (innerLeft.value === null || innerRight.value === null) {
            throw new Error('NullPointerException beim Entpacken von null')
          }
          const [promoType, left, right] = binaryNumericPromotion(
            innerLeft,
            innerRight,
          )
          if (
            promoType == 'double' ||
            promoType == 'float' ||
            promoType == 'int'
          ) {
            const ops: Record<string, (a: number, b: number) => boolean> = {
              '<': (a, b) => a < b,
              '>': (a, b) => a > b,
              '<=': (a, b) => a <= b,
              '>=': (a, b) => a >= b,
            }
            return {
              type: 'boolean',
              value: ops[node.op](left.value, right.value),
            }
          }
          const ops: Record<string, (a: bigint, b: bigint) => boolean> = {
            '<': (a, b) => a < b,
            '>': (a, b) => a > b,
            '<=': (a, b) => a <= b,
            '>=': (a, b) => a >= b,
          }
          return {
            type: 'boolean',
            value: ops[node.op](BigInt(left.value), BigInt(right.value)),
          }
        }
      }
    }
    case 'cast': {
      if ('isUnboxing' in node) {
        const inner = evaluate(node.operand, env)
        if (inner.type == 'null') {
          throw new Error('NullPointerException beim Entpacken von null')
        }
        const obj = env.heap[inner.ref]
        if (obj.class == typeToWrapper[node.type]) {
          return obj.value
        }
        throw new Error(
          `ClassCastException: ${obj.class} kann nicht in ${typeToWrapper[node.type]} konvertiert werden`,
        )
      } else if (node.type == 'boolean') {
        return evaluate(node.operand, env)
      } else {
        const inner = evaluate(node.operand, env)
        return convertTo(node.type, inner)
      }
    }
    case 'identifier': {
      const value = env.local[node.name]
      if ('boxed' in value && value.boxed === true) {
        value.boxed = node.name
        if (typeof value.boxed === 'string' && !(value.boxed in env.heap)) {
          env.heap[value.boxed] = {
            class: typeToWrapper[value.type],
            value: { ...value, boxed: undefined },
            isWrapper: true,
          }
        }
      }
      return value
    }
    case 'invoke': {
      throw 'invoke runtime TODO implementation'
    }
    case 'ternary': {
      const cond = unboxBoolean(evaluate(node.condition, env))
      let raw
      if ('castTo' in node) {
        raw = evaluate<JavaNumericPrimitiveValue>(
          cond ? node.left : node.right,
          env,
        )
        if (node.castTo) {
          raw = convertTo(node.castTo, raw)
        }
      } else {
        raw = evaluate<JavaValue>(cond ? node.left : node.right, env)
      }

      if (isPrimitive(raw)) {
        if (node.objectify) {
          if (typeof raw.boxed === 'string') {
            return { type: 'reference', ref: raw.boxed }
          }
          return primitiveValueIntoHeap(raw, env)
        }
        if (node.boxResult) {
          // A boxed local selected by the conditional keeps the identity it was read
          // with; only plain primitives get a fresh (or cached) wrapper.
          return typeof raw.boxed === 'string' ? raw : { ...raw, boxed: true }
        }
      }
      return raw
    }
  }
}

// The JVM's autoboxing caches: Integer/Short/Long share the -128..127 instances,
// Character the 0..127 ones, Byte the whole range and Boolean two singletons; Float and
// Double are never cached. The returned name is the single source of truth for the heap
// entry of a cached wrapper, shared by autoboxing and by boxed env locals.
function boxCacheRef(
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

function primitiveValueIntoHeap(
  raw: JavaNumericPrimitiveValue | JavaBooleanValue,
  env: JavaEnvironment,
): JavaReferenceValue {
  const ref = boxCacheRef(raw) ?? freshHeapRef(env)
  env.heap[ref] = {
    class: typeToWrapper[raw.type],
    value: raw,
    isWrapper: true,
  }
  return { type: 'reference', ref }
}

function compareR(
  left: JavaReferenceValue | JavaNullValue,
  right: JavaReferenceValue | JavaNullValue,
  negate: boolean,
): JavaBooleanValue {
  if (left.type == 'null' && right.type == 'null') {
    return { type: 'boolean', value: !negate }
  }
  if (left.type == 'null' || right.type == 'null') {
    return { type: 'boolean', value: negate }
  }
  const raw = left.ref === right.ref
  return {
    type: 'boolean',
    value: negate ? !raw : raw,
  }
}

function freshHeapRef(env: JavaEnvironment) {
  let i = 0
  while (`heap${i}` in env.heap) {
    i++
  }
  return `heap${i}`
}

function isSmallInt(
  val: JavaValue,
): val is JavaByteValue | JavaShortValue | JavaCharValue | JavaIntValue {
  return (
    val.type == 'byte' ||
    val.type == 'short' ||
    val.type == 'char' ||
    val.type == 'int'
  )
}

function isPrimitive(
  val: JavaValue,
): val is JavaNumericPrimitiveValue | JavaBooleanValue {
  return (
    val.type == 'byte' ||
    val.type == 'short' ||
    val.type == 'char' ||
    val.type == 'int' ||
    val.type == 'long' ||
    val.type == 'float' ||
    val.type == 'double' ||
    val.type == 'boolean'
  )
}

function unboxBoolean(val: JavaValue): boolean {
  if (val.type == 'null') {
    throw new Error('NullPointerException beim Entpacken von null')
  }
  if (!('value' in val) || typeof val.value !== 'boolean') {
    throw 'Interner Systemfehler: boolean erwartet'
  }
  return val.value
}

function convertTo(
  type: JavaNumericPrimitiveValue['type'],
  val: JavaNumericPrimitiveValue,
) {
  if (type == 'byte') {
    return toByte(val)
  }
  if (type == 'short') {
    return toShort(val)
  }
  if (type == 'char') {
    return toChar(val)
  }
  if (type == 'int') {
    return toInt(val)
  }
  if (type == 'long') {
    return toLong(val)
  }
  if (type == 'float') {
    return toFloat(val)
  }
  return toDouble(val)
}

function toDouble(val: JavaNumericPrimitiveValue): JavaDoubleValue {
  if (val.type == 'long') {
    return { type: 'double', value: Number(BigInt(val.value)) }
  }
  return { type: 'double', value: val.value }
}

function toFloat(val: JavaNumericPrimitiveValue): JavaFloatValue {
  const double = toDouble(val)
  return { type: 'float', value: Math.fround(double.value) }
}

function toLong(val: JavaNumericPrimitiveValue): JavaLongValue {
  if (val.type == 'float' || val.type == 'double') {
    const value = val.value
    const target = Number.isNaN(value)
      ? 0n
      : // 2^63 is exactly representable as a double (unlike 2^63 - 1), so use it
        // for the upper clamp: doubles >= 2^63 saturate to Long.MAX (JLS 5.1.3).
        value >= 2 ** 63
        ? 9223372036854775807n
        : value <= -(2 ** 63)
          ? -9223372036854775808n
          : BigInt(Math.trunc(value))
    return { type: 'long', value: target.toString() }
  }
  return {
    type: 'long',
    value: BigInt.asIntN(64, BigInt(val.value)).toString(),
  }
}

function toInt(val: JavaNumericPrimitiveValue): JavaIntValue {
  if (val.type == 'float' || val.type == 'double') {
    const value = val.value
    const target = Number.isNaN(value)
      ? 0n
      : value > 2147483647
        ? 2147483647n
        : value < -2147483648
          ? -2147483648n
          : BigInt(Math.trunc(value))
    return { type: 'int', value: Number(BigInt.asIntN(32, target)) }
  }
  const value = BigInt(val.value)
  return { type: 'int', value: Number(BigInt.asIntN(32, value)) }
}

function toChar(val: JavaNumericPrimitiveValue): JavaCharValue {
  const integer = BigInt(toInt(val).value)
  return { type: 'char', value: Number(BigInt.asUintN(16, integer)) }
}

function toShort(val: JavaNumericPrimitiveValue): JavaShortValue {
  const integer = BigInt(toInt(val).value)
  return { type: 'short', value: Number(BigInt.asIntN(16, integer)) }
}

function toByte(val: JavaNumericPrimitiveValue): JavaByteValue {
  const integer = BigInt(toInt(val).value)
  return { type: 'byte', value: Number(BigInt.asIntN(8, integer)) }
}

function binaryNumericPromotion(
  left: JavaNumericPrimitiveValue,
  right: JavaNumericPrimitiveValue,
):
  | ['double', JavaDoubleValue, JavaDoubleValue]
  | ['float', JavaFloatValue, JavaFloatValue]
  | ['long', JavaLongValue, JavaLongValue]
  | ['int', JavaIntValue, JavaIntValue] {
  if (left.type == 'double' || right.type == 'double') {
    return ['double', toDouble(left), toDouble(right)]
  }
  if (left.type == 'float' || right.type == 'float') {
    return ['float', toFloat(left), toFloat(right)]
  }
  if (left.type == 'long' || right.type == 'long') {
    return ['long', toLong(left), toLong(right)]
  }
  return ['int', toInt(left), toInt(right)]
}

function javaValueToString(val: JavaValue, env: JavaEnvironment): string {
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
