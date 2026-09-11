import type { TypedNode, JavaValue, JavaEnvironment } from '../state/types'
import { evaluate } from './evaluate'

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
    case 'ternary':
      return collapse(
        {
          ...node,
          condition: fold(node.condition, scratch),
          left: fold(node.left, scratch),
          right: fold(node.right, scratch),
        } as TypedNode<JavaValue>,
        scratch,
      )
    default:
      return node
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
    const obj = scratch.heap[value.ref]
    if (obj.class != 'java.lang.String') {
      return rebuilt
    }
    return { kind: 'string-literal', value: obj.value }
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
      return isConstant(node)
    case 'cast':
    case 'unary':
      return isConstant(node.operand)
    case 'binary':
      return isConstant(node.left) && isConstant(node.right)
    case 'ternary':
      return (
        isConstant(node.condition) &&
        isConstant(node.left) &&
        isConstant(node.right) &&
        !node.boxResult &&
        !node.objectify
      )
    default:
      return false
  }
}
