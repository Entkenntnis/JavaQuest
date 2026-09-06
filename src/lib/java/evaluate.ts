import { printDouble } from './helper/floating/double'
import { printFloat } from './helper/floating/float'
import {
  JavaSmallIntegerValue,
  type AstNode,
  type JavaByteValue,
  type JavaCharValue,
  type JavaDoubleValue,
  type JavaFloatValue,
  type JavaIntegerValue,
  type JavaIntValue,
  type JavaLongValue,
  type JavaNumericPrimitiveValue,
  type JavaShortValue,
  type JavaValue,
  type TypedNode,
} from '../state/types'

export function evaluate<T extends JavaValue>(node: TypedNode<T>): T {
  return evaluate_internal(node) as T
}

function evaluate_internal(node: TypedNode<JavaValue>): JavaValue {
  switch (node.kind) {
    case 'literal':
      return node.value
    case 'unary':
      switch (node.op) {
        case '+': {
          const inner = evaluate<JavaNumericPrimitiveValue>(node.operand)
          if (isSmallInt(inner)) {
            return toInt(inner)
          } else {
            return inner
          }
        }
        case '-': {
          const inner = evaluate<JavaNumericPrimitiveValue>(node.operand)
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
          const inner = evaluate(node.operand)
          return { type: 'boolean', value: !inner.value }
        }
        case '~': {
          const inner = evaluate<JavaIntegerValue>(node.operand)
          return convertTo(inner.type == 'long' ? 'long' : 'int', {
            type: 'long',
            value: (~BigInt(inner.value)).toString(),
          })
        }
      }
    case 'binary':
      switch (node.op) {
        case '&&': {
          const innerLeft = evaluate(node.left)
          return !innerLeft.value ? innerLeft : evaluate(node.right)
        }
        case '||': {
          const innerLeft = evaluate(node.left)
          return innerLeft.value ? innerLeft : evaluate(node.right)
        }
        case '+':
        case '-':
        case '*':
        case '/':
        case '%': {
          const innerLeft = evaluate(node.left)
          const innerRight = evaluate<JavaSmallIntegerValue>(node.right)

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
        case 'concat':
          return {
            type: 'string',
            value:
              javaValueToString(evaluate<JavaValue>(node.left)) +
              javaValueToString(evaluate<JavaValue>(node.right)),
          }
        case '==b':
          return {
            type: 'boolean',
            value: evaluate(node.left).value === evaluate(node.right).value,
          }
        case '==n': {
          const [left, right] = binaryNumericPromotion(
            evaluate(node.left),
            evaluate(node.right),
          )
          return { type: 'boolean', value: left.value === right.value }
        }
      }
    case 'cast':
      if (node.type == 'boolean') {
        return evaluate(node.operand)
      } else {
        const inner = evaluate(node.operand)
        return convertTo(node.type, inner)
      }
  }
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

export function isNumeric(val: JavaValue): val is JavaNumericPrimitiveValue {
  return (
    isSmallInt(val) ||
    val.type == 'long' ||
    val.type == 'float' ||
    val.type == 'double'
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

function javaValueToString(val: JavaValue): string {
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
    case 'string':
      return val.value
    case 'null':
      return 'null'
  }
}

// -------------------- OLD? -------------------

export function evaluateLegacy(node: AstNode): JavaValue {
  if (node.kind == 'literal') {
    return node.value
  }

  if (node.kind == 'unary') {
    const inner = evaluateLegacy(node.operand)
    const smallInt = isSmallInt(inner)

    if (node.op == '+') {
      // promotion
      if (smallInt) {
        return toInt(inner)
      }
      if (
        inner.type == 'long' ||
        inner.type == 'float' ||
        inner.type == 'double'
      ) {
        // pass through
        return inner
      }
      throw new Error('type error for unary plus')
    }
    if (node.op == '-') {
      if (smallInt) {
        return toInt({ type: 'int', value: -inner.value })
      }
      if (inner.type == 'long') {
        return toLong({
          type: 'long',
          value: (-BigInt(inner.value)).toString(),
        })
      }
      if (inner.type == 'float' || inner.type == 'double') {
        return { type: inner.type, value: -inner.value }
      }
      throw new Error('type error for unary minus')
    }
    if (node.op == '!') {
      if (inner.type == 'boolean') {
        return { type: 'boolean', value: !inner.value }
      }
    }
    if (node.op == '~') {
      if (isSmallInt(inner) || inner.type == 'long') {
        return convertTo(inner.type == 'long' ? 'long' : 'int', {
          type: 'long',
          value: (~BigInt(inner.value)).toString(),
        })
      }
    }
    throw new Error('invalid operator')
  }

  if (node.kind == 'cast') {
    const inner = evaluateLegacy(node.operand)

    // this is the only valid boolean cast
    if (inner.type == 'boolean' && node.type == 'boolean') {
      return inner
    }

    if (isNumeric(inner)) {
      if (node.type != 'boolean') {
        return convertTo(node.type, inner)
      }
    }

    throw new Error('invalid cast')
  }

  if (node.kind == 'binary') {
    if (node.op == '||' || node.op == '&&') {
      const innerLeft = evaluateLegacy(node.left)
      if (innerLeft.type != 'boolean') {
        throw new Error('Boolean expected')
      }
      if (node.op == '||') {
        if (innerLeft.value) {
          return innerLeft
        } else {
          const innerRight = evaluateLegacy(node.right)
          if (innerRight.type != 'boolean') {
            throw new Error('Boolean expected')
          }
          return innerRight
        }
      }
      if (node.op == '&&') {
        if (!innerLeft.value) {
          return innerLeft
        } else {
          const innerRight = evaluateLegacy(node.right)
          if (innerRight.type != 'boolean') {
            throw new Error('Boolean expected')
          }
          return innerRight
        }
      }
    }

    const innerLeft = evaluateLegacy(node.left)
    const innerRight = evaluateLegacy(node.right)

    // handle +, -, *, /, % on numerics
    if (
      isNumeric(innerLeft) &&
      isNumeric(innerRight) &&
      '+-*/%'.includes(node.op)
    ) {
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

    if (node.op == '==') {
      if (isNumeric(innerLeft) && isNumeric(innerRight)) {
        const [left, right] = binaryNumericPromotion(innerLeft, innerRight)
        return { type: 'boolean', value: left.value === right.value }
      }
      if (innerLeft.type == 'boolean' && innerRight.type == 'boolean') {
        return { type: 'boolean', value: innerLeft.value === innerRight.value }
      }
    }

    if (
      node.op == '+' &&
      (innerLeft.type == 'string' || innerRight.type == 'string')
    ) {
      return {
        type: 'string',
        value: javaValueToString(innerLeft) + javaValueToString(innerRight),
      }
    }

    throw new Error('invalid binary operator')
  }

  throw new Error(`Evaluation of node failed`)
}
