import { printDouble } from './helper/floating/double'
import { printFloat } from './helper/floating/float'
import {
  type JavaByteValue,
  type JavaCharValue,
  type JavaDoubleValue,
  type JavaEnvironment,
  type JavaFloatValue,
  type JavaIntegerValue,
  type JavaIntValue,
  type JavaLongValue,
  type JavaNumericPrimitiveValue,
  type JavaShortValue,
  type JavaValue,
  type TypedNode,
} from '../state/types'

export function foldConstants(
  node: TypedNode<JavaValue>,
): TypedNode<JavaValue> {
  return fold(node, { local: {}, heap: {} })
}

function fold(
  node: TypedNode<JavaValue>,
  scratch: JavaEnvironment,
): TypedNode<JavaValue> {
  switch (node.kind) {
    case 'literal':
    case 'string-literal':
      return node
    case 'identifier':
      // never constant
      return node
    case 'cast':
    case 'unary': {
      return collapse(
        {
          ...node,
          operand: fold(node.operand, scratch),
        } as TypedNode<JavaValue>,
        scratch,
      )
    }
    case 'binary':
      return collapse(
        {
          ...node,
          left: fold(node.left, scratch),
          right: fold(node.right, scratch),
        } as TypedNode<JavaValue>,
        scratch,
      )
  }
}

function collapse(
  rebuilt: TypedNode<JavaValue>,
  scratch: JavaEnvironment,
): TypedNode<JavaValue> {
  if (!isConstantSubtree(rebuilt)) return rebuilt

  let value: JavaValue
  try {
    value = evaluate(rebuilt, scratch)
  } catch {
    return rebuilt
  }

  if (value.type == 'reference') {
    return { kind: 'string-literal', value: scratch.heap[value.ref].value }
  }

  return { kind: 'literal', value } as TypedNode<JavaValue>
}

function isConstant(node: TypedNode<JavaValue>) {
  return (
    (node.kind == 'literal' && node.value.type != 'null') ||
    node.kind == 'string-literal'
  )
}

function isConstantSubtree(node: TypedNode<JavaValue>): boolean {
  switch (node.kind) {
    case 'literal':
    case 'string-literal':
    case 'identifier':
      return isConstant(node)
    case 'cast':
    case 'unary':
      return isConstant(node.operand)
    case 'binary':
      return isConstant(node.left) && isConstant(node.right)
  }
}

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
      // TODO: should move to separate constant folding pass (later)
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
          const inner = evaluate<JavaNumericPrimitiveValue>(node.operand, env)
          if (isSmallInt(inner)) {
            return toInt(inner)
          } else {
            return inner
          }
        }
        case '-': {
          const inner = evaluate<JavaNumericPrimitiveValue>(node.operand, env)
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
          const inner = evaluate(node.operand, env)
          return { type: 'boolean', value: !inner.value }
        }
        case '~': {
          const inner = evaluate<JavaIntegerValue>(node.operand, env)
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
          const innerLeft = evaluate(node.left, env)
          return !innerLeft.value ? innerLeft : evaluate(node.right, env)
        }
        case '||': {
          const innerLeft = evaluate(node.left, env)
          return innerLeft.value ? innerLeft : evaluate(node.right, env)
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

          const [left, right] = binaryNumericPromotion(innerLeft, innerRight)
          const isInteger =
            left.type == 'long' ||
            right.type == 'long' ||
            left.type == 'int' ||
            right.type == 'int'

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
              throw new Error('Division by zero')
            }
            if (node.op == '%' && BigInt(right.value) == 0n) {
              throw new Error('Modulo by zero')
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
        case '==b':
          return {
            type: 'boolean',
            value:
              evaluate(node.left, env).value ===
              evaluate(node.right, env).value,
          }
        case '==n': {
          const [left, right] = binaryNumericPromotion(
            evaluate(node.left, env),
            evaluate(node.right, env),
          )
          return { type: 'boolean', value: left.value === right.value }
        }
        case '==r': {
          const left = evaluate(node.left, env)
          const right = evaluate(node.right, env)
          if (left.type == 'null' && right.type == 'null') {
            return { type: 'boolean', value: true }
          }
          if (left.type == 'null' || right.type == 'null') {
            return { type: 'boolean', value: false }
          }
          return {
            type: 'boolean',
            value: left.ref === right.ref,
          }
        }
      }
    }
    case 'cast': {
      if (node.type == 'boolean') {
        return evaluate(node.operand, env)
      } else {
        const inner = evaluate(node.operand, env)
        return convertTo(node.type, inner)
      }
    }
    case 'identifier': {
      return env.local[node.name]
    }
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
      : value > 9223372036854775807
        ? 9223372036854775807n
        : value < -9223372036854775808
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
  | [JavaDoubleValue, JavaDoubleValue]
  | [JavaFloatValue, JavaFloatValue]
  | [JavaLongValue, JavaLongValue]
  | [JavaIntValue, JavaIntValue] {
  if (left.type == 'double' || right.type == 'double') {
    return [toDouble(left), toDouble(right)]
  }
  if (left.type == 'float' || right.type == 'float') {
    return [toFloat(left), toFloat(right)]
  }
  if (left.type == 'long' || right.type == 'long') {
    return [toLong(left), toLong(right)]
  }
  return [toInt(left), toInt(right)]
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
      // TODO: if new methods arrive, find the toString method and invoke it
      const obj = env.heap[val.ref]
      return obj.value
    case 'null':
      return 'null'
  }
}
