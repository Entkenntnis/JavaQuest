import type {
  AstNode,
  BinaryExpressionAstNode,
  CastExpressionAstNode,
  JavaAllowedLiteralValue,
  JavaValue,
  LiteralAstNode,
  TypecheckResult,
  TypedLiteralAstNode,
  UnaryExpressionAstNode,
} from '../state/types'

// The problem is: I actually would like to know the infered type, right?
// Otherwise I can't really work
// And the problem compounds because I can't extract the type from ts type

export function typecheck(node: AstNode): TypecheckResult {
  switch (node.kind) {
    case 'literal':
      // every literal is intrinsically valid
      // this is basically a type guard
      return constructLiteralNodeResult(node)
    case 'unary': {
      const [type, inner] = typecheck(node.operand)

      // I need this type == to ensure that I'm narrowing type as well
      if (type == 'boolean') {
        const i = inner
        throw 'test'
      }

      const t = type

      // MEIN KOPF EXPLODIERT!!!!
      // WAS PASSIERT HIER?
      // WAS WILL ICH?
      // if (node.op == '+') {
      //   if () {
      //   }
      // }
    }
    case 'cast':
    case 'binary':
  }
  throw 'TODO'
}

function typedLiteral<T extends JavaAllowedLiteralValue>(
  value: T,
): TypedLiteralAstNode<T> {
  return { kind: 'literal', value }
}

// not really pretty, but this type checks and avoids any drifts between
function constructLiteralNodeResult(node: LiteralAstNode): TypecheckResult {
  switch (node.value.type) {
    case 'boolean':
      return ['boolean', typedLiteral(node.value)]
    case 'byte':
      throw new Error('impossible literal')
    case 'short':
      throw new Error('impossible literal')
    case 'char':
      return ['char', typedLiteral(node.value)]
    case 'int':
      return ['int', typedLiteral(node.value)]
    case 'long':
      return ['long', typedLiteral(node.value)]
    case 'float':
      return ['float', typedLiteral(node.value)]
    case 'double':
      return ['double', typedLiteral(node.value)]
    case 'string':
      return ['string', typedLiteral(node.value)]
    case 'null':
      return ['null', typedLiteral(node.value)]
  }
}

// ---------------------------------- SLOP!!!!! -----------------------------

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
