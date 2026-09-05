import type {
  AstNode,
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
  return { type: 'long', value: BigInt(val.value).toString() }
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

export function evaluate(node: AstNode): JavaValue {
  if (node.kind == 'literal') {
    return node.value
  }

  if (node.kind == 'unary') {
    if (node.op == '+') {
      const inner = evaluate(node.operand)
      // promotion
      if (
        inner.type == 'byte' ||
        inner.type == 'short' ||
        inner.type == 'char' ||
        inner.type == 'int'
      ) {
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
      const inner = evaluate(node.operand)
      if (
        inner.type == 'byte' ||
        inner.type == 'short' ||
        inner.type == 'char' ||
        inner.type == 'int'
      ) {
        return { type: 'int', value: -inner.value | 0 }
      }
      if (inner.type == 'long') {
        return {
          type: 'long',
          value: BigInt.asIntN(64, -BigInt(inner.value)).toString(),
        }
      }
      if (inner.type == 'float' || inner.type == 'double') {
        return { type: inner.type, value: -inner.value }
      }
      throw new Error('type error for unary minus')
    }
    throw new Error('operator not implemented yet')
  }

  if (node.kind == 'cast') {
    const inner = evaluate(node.operand)

    // this is the only valid boolean cast
    if (inner.type == 'boolean' && node.type == 'boolean') {
      return inner
    }

    if (
      inner.type == 'byte' ||
      inner.type == 'short' ||
      inner.type == 'char' ||
      inner.type == 'int' ||
      inner.type == 'long' ||
      inner.type == 'float' ||
      inner.type == 'double'
    ) {
      if (node.type == 'double') {
        return toDouble(inner)
      }
      if (node.type == 'float') {
        return toFloat(inner)
      }
      if (node.type == 'long') {
        return toLong(inner)
      }
      if (node.type == 'int') {
        return toInt(inner)
      }
      if (node.type == 'char') {
        return toChar(inner)
      }
      if (node.type == 'short') {
        return toShort(inner)
      }
      if (node.type == 'byte') {
        return toByte(inner)
      }
    }

    throw new Error('invalid cast')
  }

  if (node.kind == 'binary') {
    if (node.op == '+') {
      // const left = evaluate(node.left)
      // const right = evaluate(node.right)
      // binary numeric promotion would probably affect all, right?
    }

    throw new Error('binary operator not implemented')
  }

  throw new Error(`Evaluation of node failed`)
}
