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
  }

  throw new Error(`Evaluation of ${node.kind}-node failed`)
}
