import type {
  AstNode,
  JavaAllowedLiteralValue,
  JavaByteValue,
  JavaCharValue,
  JavaDoubleValue,
  JavaEnvironment,
  JavaFloatValue,
  JavaIntValue,
  JavaLongValue,
  JavaShortValue,
  JavaValue,
  LiteralAstNode,
  TypecheckResult,
  TypedBooleanCastNode,
  TypedBooleanEqualsNode,
  TypedComplementNodeL,
  TypedComplementNodeS,
  TypedLiteralNode,
  TypedNegateNode,
  TypedNode,
  TypedNumericArithNodeBDL,
  TypedNumericArithNodeBDR,
  TypedNumericArithNodeBFL,
  TypedNumericArithNodeBFR,
  TypedNumericArithNodeBLL,
  TypedNumericArithNodeBLR,
  TypedNumericArithNodeS,
  TypedNumericCastNode,
  TypedNumericEqualsNode,
  TypedOrAndNode,
  TypedReferenceEqualsNode,
  TypedBitwiseNode,
  TypedStringConcatNodeL,
  TypedStringConcatNodeR,
  TypedUnaryPlusMinusNodeB,
  TypedUnaryPlusMinusNodeS,
  TypedBooleanLogicalNode,
  TypedRelationalCompareNode,
  TypedConditionalOperatorNode,
} from '../state/types'

export function typecheck(
  node: AstNode,
  env: JavaEnvironment,
): TypedNode<JavaValue> {
  return typecheck_internal(node, env)[1]
}

function typecheck_internal(
  node: AstNode,
  env: JavaEnvironment,
): TypecheckResult {
  switch (node.kind) {
    case 'literal': {
      return constructLiteralNodeResult(node)
    }
    case 'string-literal': {
      return [
        'reference',
        { kind: 'string-literal', value: node.value },
        { name: 'java.lang.String' },
      ]
    }
    case 'unary': {
      const [type, inner] = typecheck_internal(node.operand, env)

      if (node.op == '+' || node.op == '-') {
        if (
          type == 'byte' ||
          type == 'char' ||
          type == 'short' ||
          type == 'int'
        ) {
          const tn: TypedUnaryPlusMinusNodeS = {
            kind: 'unary',
            op: node.op,
            operand: inner,
          }
          return ['int', tn]
        }
        if (type == 'long') {
          const tn: TypedUnaryPlusMinusNodeB<JavaLongValue> = {
            kind: 'unary',
            op: node.op,
            operand: inner,
          }
          return [type, tn]
        }
        if (type == 'float') {
          const tn: TypedUnaryPlusMinusNodeB<JavaFloatValue> = {
            kind: 'unary',
            op: node.op,
            operand: inner,
          }
          return [type, tn]
        }
        if (type == 'double') {
          const tn: TypedUnaryPlusMinusNodeB<JavaDoubleValue> = {
            kind: 'unary',
            op: node.op,
            operand: inner,
          }
          return [type, tn]
        }
      }
      if (node.op == '!') {
        if (type == 'boolean') {
          const tn: TypedNegateNode = {
            kind: 'unary',
            op: '!',
            operand: inner,
          }
          return ['boolean', tn]
        }
      }
      if (node.op == '~') {
        if (
          type == 'byte' ||
          type == 'char' ||
          type == 'short' ||
          type == 'int'
        ) {
          const tn: TypedComplementNodeS = {
            kind: 'unary',
            op: node.op,
            operand: inner,
          }
          return ['int', tn]
        }
        if (type == 'long') {
          const tn: TypedComplementNodeL = {
            kind: 'unary',
            op: node.op,
            operand: inner,
          }
          return ['long', tn]
        }
      }
      throw new Error('invalid input type for unary operator')
    }
    case 'cast': {
      const [type, inner] = typecheck_internal(node.operand, env)
      if (node.type == 'boolean') {
        if (type == 'boolean') {
          const tn: TypedBooleanCastNode = {
            kind: 'cast',
            type: 'boolean',
            operand: inner,
          }
          return ['boolean', tn]
        }
        throw new Error('boolean expected in cast')
      }
      if (type == 'null' || type == 'boolean' || type == 'reference') {
        throw new Error('cast expected for numeric value')
      }
      if (node.type == 'byte') {
        const tn: TypedNumericCastNode<JavaByteValue> = {
          kind: 'cast',
          type: 'byte',
          operand: inner,
        }
        return ['byte', tn]
      }
      if (node.type == 'short') {
        const tn: TypedNumericCastNode<JavaShortValue> = {
          kind: 'cast',
          type: 'short',
          operand: inner,
        }
        return ['short', tn]
      }
      if (node.type == 'char') {
        const tn: TypedNumericCastNode<JavaCharValue> = {
          kind: 'cast',
          type: 'char',
          operand: inner,
        }
        return ['char', tn]
      }
      if (node.type == 'int') {
        const tn: TypedNumericCastNode<JavaIntValue> = {
          kind: 'cast',
          type: 'int',
          operand: inner,
        }
        return ['int', tn]
      }
      if (node.type == 'long') {
        const tn: TypedNumericCastNode<JavaLongValue> = {
          kind: 'cast',
          type: 'long',
          operand: inner,
        }
        return ['long', tn]
      }
      if (node.type == 'float') {
        const tn: TypedNumericCastNode<JavaFloatValue> = {
          kind: 'cast',
          type: 'float',
          operand: inner,
        }
        return ['float', tn]
      }
      if (node.type == 'double') {
        const tn: TypedNumericCastNode<JavaDoubleValue> = {
          kind: 'cast',
          type: 'double',
          operand: inner,
        }
        return ['double', tn]
      }
      throw new Error('invalid input type for cast')
    }
    case 'binary': {
      const [typeL, innerL, dataL] = typecheck_internal(node.left, env)
      const [typeR, innerR, dataR] = typecheck_internal(node.right, env)
      if (
        (typeL == 'byte' ||
          typeL == 'char' ||
          typeL == 'short' ||
          typeL == 'int' ||
          typeL == 'long' ||
          typeL == 'float' ||
          typeL == 'double') &&
        (typeR == 'byte' ||
          typeR == 'char' ||
          typeR == 'short' ||
          typeR == 'int' ||
          typeR == 'long' ||
          typeR == 'float' ||
          typeR == 'double')
      ) {
        // full numeric operands
        if (
          node.op == '+' ||
          node.op == '-' ||
          node.op == '*' ||
          node.op == '/' ||
          node.op == '%'
        ) {
          if (typeL == 'double') {
            const tn: TypedNumericArithNodeBDL = {
              kind: 'binary',
              op: node.op,
              left: innerL,
              right: innerR,
            }
            return ['double', tn]
          }
          if (typeR == 'double') {
            const tn: TypedNumericArithNodeBDR = {
              kind: 'binary',
              op: node.op,
              left: innerL,
              right: innerR,
            }
            return ['double', tn]
          }
          if (typeL == 'float') {
            const tn: TypedNumericArithNodeBFL = {
              kind: 'binary',
              op: node.op,
              left: innerL,
              right: innerR,
            }
            return ['float', tn]
          }
          if (typeR == 'float') {
            const tn: TypedNumericArithNodeBFR = {
              kind: 'binary',
              op: node.op,
              left: innerL,
              right: innerR,
            }
            return ['float', tn]
          }
          if (typeL == 'long') {
            const tn: TypedNumericArithNodeBLL = {
              kind: 'binary',
              op: node.op,
              left: innerL,
              right: innerR,
            }
            return ['long', tn]
          }
          if (typeR == 'long') {
            const tn: TypedNumericArithNodeBLR = {
              kind: 'binary',
              op: node.op,
              left: innerL,
              right: innerR,
            }
            return ['long', tn]
          }
          const tn: TypedNumericArithNodeS = {
            kind: 'binary',
            op: node.op,
            left: innerL,
            right: innerR,
          }
          return ['int', tn]
        }

        // <-- insert numeric stuff here
        if (node.op == '==' || node.op == '!=') {
          const tn: TypedNumericEqualsNode = {
            kind: 'binary',
            op: '==n',
            negate: node.op == '!=',
            left: innerL,
            right: innerR,
          }
          return ['boolean', tn]
        }

        if (
          node.op == '<' ||
          node.op == '>' ||
          node.op == '<=' ||
          node.op == '>='
        ) {
          const tn: TypedRelationalCompareNode = {
            kind: 'binary',
            op: node.op,
            left: innerL,
            right: innerR,
          }
          return ['boolean', tn]
        }
      }

      if (
        typeL == 'reference' &&
        dataL.name == 'java.lang.String' &&
        node.op == '+'
      ) {
        const tn: TypedStringConcatNodeL = {
          kind: 'binary',
          op: 'concat',
          left: innerL,
          right: innerR,
        }
        return ['reference', tn, { name: 'java.lang.String' }]
      }

      if (
        typeR == 'reference' &&
        dataR.name == 'java.lang.String' &&
        node.op == '+'
      ) {
        const tn: TypedStringConcatNodeR = {
          kind: 'binary',
          op: 'concat',
          left: innerL,
          right: innerR,
        }
        return ['reference', tn, { name: 'java.lang.String' }]
      }

      if (
        (node.op == '||' || node.op == '&&') &&
        typeL == 'boolean' &&
        typeR == 'boolean'
      ) {
        const tn: TypedOrAndNode = {
          kind: 'binary',
          op: node.op,
          left: innerL,
          right: innerR,
        }
        return ['boolean', tn]
      }

      if (typeL == 'boolean' && typeR == 'boolean') {
        if (node.op == '==' || node.op == '!=') {
          const tn: TypedBooleanEqualsNode = {
            kind: 'binary',
            op: '==b',
            negate: node.op == '!=',
            left: innerL,
            right: innerR,
          }
          return ['boolean', tn]
        }
        if (node.op == '|') {
          const tn: TypedBooleanLogicalNode = {
            kind: 'binary',
            op: '|b',
            left: innerL,
            right: innerR,
          }
          return ['boolean', tn]
        }
        if (node.op == '&') {
          const tn: TypedBooleanLogicalNode = {
            kind: 'binary',
            op: '&b',
            left: innerL,
            right: innerR,
          }
          return ['boolean', tn]
        }
        if (node.op == '^') {
          const tn: TypedBooleanLogicalNode = {
            kind: 'binary',
            op: '^b',
            left: innerL,
            right: innerR,
          }
          return ['boolean', tn]
        }
      }

      if (
        (node.op == '==' || node.op == '!=') &&
        (typeL == 'reference' || typeL == 'null') &&
        (typeR == 'reference' || typeR == 'null')
      ) {
        const tn: TypedReferenceEqualsNode = {
          kind: 'binary',
          op: '==r',
          negate: node.op == '!=',
          left: innerL,
          right: innerR,
        }
        return ['boolean', tn]
      }

      if (
        (typeL == 'byte' ||
          typeL == 'char' ||
          typeL == 'short' ||
          typeL == 'int' ||
          typeL == 'long') &&
        (typeR == 'byte' ||
          typeR == 'char' ||
          typeR == 'short' ||
          typeR == 'int' ||
          typeR == 'long')
      ) {
        // integral ops
        if (
          node.op == '<<' ||
          node.op == '>>' ||
          node.op == '>>>' ||
          node.op == '|' ||
          node.op == '&' ||
          node.op == '^'
        ) {
          if (typeL == 'long') {
            const tn: TypedBitwiseNode = {
              kind: 'binary',
              op: node.op,
              left: innerL,
              right: innerR,
            }
            return ['long', tn]
          }
          const tn: TypedBitwiseNode = {
            kind: 'binary',
            op: node.op,
            left: innerL,
            right: innerR,
          }
          return ['int', tn]
        }
      }

      // <--- insert open stuff here

      throw new Error(
        `invalid binary operation ${node.op} between ${typeL} and ${typeR}`,
      )
    }
    case 'identifier': {
      const value = env.local[node.name]
      if (!value) {
        throw new Error('unknown identifier')
      }
      if (value.type == 'reference') {
        return ['reference', node, { name: env.heap[value.ref].class }]
      }
      return [value.type, node]
    }
    case 'ternary': {
      const [condT, condV] = typecheck_internal(node.condition, env)
      if (condT != 'boolean') {
        throw 'Expecting boolean for first operand of conditional operator'
      }

      const [typeL, innerL, dataL] = typecheck_internal(node.left, env)
      const [typeR, innerR, dataR] = typecheck_internal(node.right, env)

      const tn: TypedConditionalOperatorNode = {
        kind: 'ternary',
        condition: condV,
        left: innerL,
        right: innerR,
      }
      // 1. same type, also data payload data (boxed, reference name)
      if (typeL == typeR && JSON.stringify(dataL) == JSON.stringify(dataR)) {
        switch (typeL) {
          case 'reference':
            return [typeL, tn, dataL]
          case 'null':
            return [typeL, tn]
          default:
            if (dataL) {
              return [typeL, tn, dataL]
            } else {
              return [typeL, tn]
            }
        }
      }

      // 2. same type, ignoring boxed
      if (typeL == typeR && typeL != 'null' && typeL != 'reference') {
        return [typeL, tn]
      }

      // 3. byte / short special case
      if (
        (typeL == 'byte' && typeR == 'short') ||
        (typeL == 'short' && typeR == 'byte')
      ) {
        tn.castTo = 'short'
        return ['short', tn]
      }

      // 4. special int rule

      throw 'TODO'
    }
  }
}

function typedLiteral<T extends JavaAllowedLiteralValue>(
  value: T,
): TypedLiteralNode<T> {
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
    case 'null':
      return ['null', typedLiteral(node.value)]
  }
}
