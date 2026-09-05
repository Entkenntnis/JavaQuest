import { printDouble } from './helper/floating/double'
import { printFloat } from './helper/floating/float'
import type {
  AstNode,
  JavaBooleanValue,
  JavaByteValue,
  JavaCharValue,
  JavaDoubleValue,
  JavaFloatValue,
  JavaIntValue,
  JavaLongValue,
  JavaNumericPrimitiveValue,
  JavaShortValue,
  JavaValue,
} from '../state/types'

export function evaluate(node: AstNode): JavaValue {
  if (node.kind == 'literal') {
    return node.value
  }

  if (node.kind == 'unary') {
    const inner = evaluate(node.operand)

    if (node.op == '+') {
      const value = inner as JavaNumericPrimitiveValue
      return isSmallInt(value) ? toInt(value) : value
    }
    if (node.op == '-') {
      const value = inner as JavaNumericPrimitiveValue
      if (isSmallInt(value)) {
        return toInt({ type: 'int', value: -value.value })
      }
      if (value.type == 'long') {
        return toLong({
          type: 'long',
          value: (-BigInt(value.value)).toString(),
        })
      }
      return { type: value.type, value: -value.value }
    }
    if (node.op == '!') {
      return { type: 'boolean', value: !(inner as JavaBooleanValue).value }
    }
    const value = inner as JavaNumericPrimitiveValue
    return convertTo(value.type == 'long' ? 'long' : 'int', {
      type: 'long',
      value: (~BigInt(value.value)).toString(),
    })
  }

  if (node.kind == 'cast') {
    const inner = evaluate(node.operand)
    if (node.type == 'boolean') {
      return inner
    }
    return convertTo(node.type, inner as JavaNumericPrimitiveValue)
  }

  if (node.kind == 'binary') {
    if (node.op == '||' || node.op == '&&') {
      const left = evaluate(node.left) as JavaBooleanValue
      if (node.op == '||') {
        return left.value ? left : (evaluate(node.right) as JavaBooleanValue)
      }
      return left.value ? (evaluate(node.right) as JavaBooleanValue) : left
    }

    const left = evaluate(node.left)
    const right = evaluate(node.right)

    if (node.op == '+') {
      if (left.type == 'string' || right.type == 'string') {
        return {
          type: 'string',
          value: javaValueToString(left) + javaValueToString(right),
        }
      }
    }

    if (node.op == '==') {
      if (left.type == 'boolean') {
        return {
          type: 'boolean',
          value: left.value === right.value,
        }
      }
      if (
        (left.type == 'string' || left.type == 'null') &&
        (right.type == 'string' || right.type == 'null')
      ) {
        return {
          type: 'boolean',
          value: left.value === right.value,
        }
      }
    }

    const [a, b] = binaryNumericPromotion(
      left as JavaNumericPrimitiveValue,
      right as JavaNumericPrimitiveValue,
    )

    if (node.op == '==') {
      return { type: 'boolean', value: a.value === b.value }
    }

    const isInteger =
      a.type == 'long' || b.type == 'long' || a.type == 'int' || b.type == 'int'

    const ops: Record<string, (x: number, y: number) => number> = {
      '+': (x, y) => x + y,
      '-': (x, y) => x - y,
      '*': (x, y) => x * y,
      '/': (x, y) => x / y,
      '%': (x, y) => x % y,
    }

    const opsBig: Record<string, (x: bigint, y: bigint) => bigint> = {
      '+': (x, y) => x + y,
      '-': (x, y) => x - y,
      '*': (x, y) => x * y,
      '/': (x, y) => x / y,
      '%': (x, y) => x % y,
    }

    if (isInteger) {
      if (node.op == '/' && BigInt(b.value) == 0n) {
        throw new Error('Division by zero')
      }
      if (node.op == '%' && BigInt(b.value) == 0n) {
        throw new Error('Modulo by zero')
      }
      return convertTo(a.type, {
        type: 'long',
        value: opsBig[node.op](BigInt(a.value), BigInt(b.value)).toString(),
      })
    }
    return convertTo(a.type, {
      type: 'double',
      value: ops[node.op](a.value, b.value),
    })
  }

  throw new Error(`Evaluation of node failed`)
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
