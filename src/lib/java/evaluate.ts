import type { AstNode, JavaValue } from '../state/types'

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
        return { type: 'int', value: inner.value }
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

    let integer: bigint | null = null

    if (inner.type == 'float' || inner.type == 'double') {
      const value = inner.value
      if (node.type == 'float') {
        return { type: 'float', value: Math.fround(value) }
      }
      if (node.type == 'double') {
        return { type: 'double', value }
      }
      if (node.type == 'long') {
        const target = Number.isNaN(value)
          ? 0n
          : value > 9223372036854775807
            ? 9223372036854775807n
            : value < -9223372036854775808
              ? -9223372036854775808n
              : BigInt(Math.trunc(value))
        return { type: 'long', value: target.toString() }
      }
      // falling through to integer case
      integer = Number.isNaN(value)
        ? 0n
        : value > 2147483647
          ? 2147483647n
          : value < -2147483648
            ? -2147483648n
            : BigInt(Math.trunc(value))
    }

    if (
      inner.type == 'byte' ||
      inner.type == 'short' ||
      inner.type == 'char' ||
      inner.type == 'int' ||
      inner.type == 'long'
    ) {
      integer = BigInt(inner.value) // handles strings and numbers
    }

    if (integer != null) {
      if (node.type == 'byte') {
        return { type: 'byte', value: Number(BigInt.asIntN(8, integer)) }
      }
      if (node.type == 'short') {
        return { type: 'short', value: Number(BigInt.asIntN(16, integer)) }
      }
      if (node.type == 'int') {
        return { type: 'int', value: Number(BigInt.asIntN(32, integer)) }
      }
      if (node.type == 'char') {
        return { type: 'char', value: Number(BigInt.asUintN(16, integer)) }
      }
      // at this point expect input value is not floating
      // as already handled above
      if (node.type == 'long') {
        return { type: 'long', value: BigInt.asIntN(64, integer).toString() }
      }
      if (node.type == 'float') {
        return { type: 'float', value: Math.fround(Number(integer)) }
      }
      if (node.type == 'double') {
        return { type: 'double', value: Number(integer) }
      }
    }

    throw new Error('invalid cast')
  }

  throw new Error(`Evaluation of node failed`)
}
