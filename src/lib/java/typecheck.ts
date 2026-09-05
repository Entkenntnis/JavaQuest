import type {
  AstNode,
  BinaryExpressionAstNode,
  CastExpressionAstNode,
  JavaValue,
  TypedLiteralAstNode,
  TypedNode,
  UnaryExpressionAstNode,
} from '../state/types'
import { isNumeric } from './evaluate'

export function typecheck(node: AstNode): TypedNode<JavaValue> {
  switch (node.kind) {
    case 'literal':
      // every literal is intrinsically valid
      return node as TypedLiteralAstNode<JavaValue>
    case 'unary': {
      const operand = typecheck(node.operand)
      if (node.op == '+') {
        if (isNumeric(operand)) {
        }
      }
    }
    case 'cast':
    case 'binary':
  }
  throw 'TODO'
}

export function typecheck__LEGACY(node: AstNode): Type {
  switch (node.kind) {
    case 'literal':
      return node.value.type
    case 'unary':
      return typecheckUnary(node)
    case 'cast':
      return typecheckCast(node)
    case 'binary':
      return typecheckBinary(node)
  }
}

type Type = JavaValue['type']

const numericTypes = new Set<Type>([
  'byte',
  'short',
  'char',
  'int',
  'long',
  'float',
  'double',
])

const integralTypes = new Set<Type>(['byte', 'short', 'char', 'int', 'long'])

const referenceTypes = new Set<Type>(['string', 'null'])

function fail(message: string): never {
  throw new Error(`[typecheck] ${message}`)
}

function promote(a: Type, b: Type): Type {
  if (a == 'double' || b == 'double') return 'double'
  if (a == 'float' || b == 'float') return 'float'
  if (a == 'long' || b == 'long') return 'long'
  return 'int'
}

function unaryResultType(operand: Type, op: string): Type {
  if (op == '!') {
    if (operand != 'boolean') {
      fail(`'!' requires a boolean operand, found ${operand}`)
    }
    return 'boolean'
  }
  if (op == '~') {
    if (!integralTypes.has(operand)) {
      fail(`'~' requires an integral operand, found ${operand}`)
    }
    return operand == 'long' ? 'long' : 'int'
  }
  if (!numericTypes.has(operand)) {
    fail(`'${op}' requires a numeric operand, found ${operand}`)
  }
  return operand == 'byte' || operand == 'short' || operand == 'char'
    ? 'int'
    : operand
}

function typecheckUnary(node: UnaryExpressionAstNode): Type {
  const operand = typecheck__LEGACY(node.operand)
  return unaryResultType(operand, node.op)
}

function typecheckCast(node: CastExpressionAstNode): Type {
  const operand = typecheck__LEGACY(node.operand)
  if (node.type == 'boolean') {
    if (operand != 'boolean') {
      fail(`cannot cast ${operand} to boolean`)
    }
    return 'boolean'
  }
  if (!numericTypes.has(operand)) {
    fail(`cannot cast ${operand} to ${node.type}`)
  }
  return node.type
}

function typecheckBinary(node: BinaryExpressionAstNode): Type {
  const left = typecheck__LEGACY(node.left)
  const right = typecheck__LEGACY(node.right)

  switch (node.op) {
    case '&&':
    case '||':
      if (left != 'boolean' || right != 'boolean') {
        fail(
          `'${node.op}' requires boolean operands, found ${left} and ${right}`,
        )
      }
      return 'boolean'
    case '+':
      if (left == 'string' || right == 'string') return 'string'
      if (numericTypes.has(left) && numericTypes.has(right)) {
        return promote(left, right)
      }
      fail(
        `'+' requires numeric or string operands, found ${left} and ${right}`,
      )
    case '-':
    case '*':
    case '/':
    case '%':
      if (numericTypes.has(left) && numericTypes.has(right)) {
        return promote(left, right)
      }
      fail(`'${node.op}' requires numeric operands, found ${left} and ${right}`)
    case '==':
      if (numericTypes.has(left) && numericTypes.has(right)) return 'boolean'
      if (left == 'boolean' && right == 'boolean') return 'boolean'
      if (referenceTypes.has(left) && referenceTypes.has(right))
        return 'boolean'
      fail(`'==' cannot compare ${left} with ${right}`)
  }
}
