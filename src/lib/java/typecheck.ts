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
  TypedConditionalOperatorNumericCastNode,
  TypedBoxedReferenceEqualsNode,
  TypedUnboxCastNode,
  Type,
  TypedMethodInvocationNode,
} from '../state/types'
import { foldConstants } from './fold'
import {
  findMethod,
  isIdentityOrWideningCast,
  typeDataEquals,
  typeToWrapper,
} from './helper/typing'

export function typecheck(
  node: AstNode,
  env: JavaEnvironment,
): TypedNode<JavaValue> {
  return typecheck_internal(node, env)[1]
}

// For error messages: show the Java class for reference types instead of the
// internal "reference" tag.
function displayType(type: string, data: unknown): string {
  if (type == 'null') return '<Null>'
  if (
    type == 'reference' &&
    data != null &&
    typeof data == 'object' &&
    'name' in data
  ) {
    return (data as { name: string }).name
  }
  return type
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
        { kind: 'class', name: 'java.lang.String' },
      ]
    }
    case 'unary': {
      const [type, inner, data] = typecheck_internal(node.operand, env)

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
      throw new Error(
        `Ungültiger Operandentyp ${displayType(type, data)} für unären Operator "${node.op}"`,
      )
    }
    case 'invoke':
      const [type, inner, data] = typecheck_internal(node.owner, env)
      // if (type != 'reference' || data.kind != 'class') {
      //   throw 'Interner Systemfehler: Unterstützung bezieht sich erstmal nur auf Referenzen'
      // }

      let className
      // first job: unbox end resolve to class name
      if (type == 'reference') {
        if (data.kind == 'array') {
          throw 'TODO'
        }
        className = data.name
      }
      // and the special case of boxed values
      if (data && 'boxed' in data && type != 'null' && type != 'reference') {
        className = typeToWrapper[type]
      }

      if (!className) {
        throw 'class not found' // make prettier
      }

      // now, extract the arg structure
      const argTypes: Type[] = []
      const args: TypedNode<JavaValue>[] = []

      for (const arg of node.args) {
        const [type, inner, data] = typecheck_internal(arg, env)
        args.push(inner)
        if (type == 'null') {
          throw 'cannot infer type' // make prettier
        }
        if (type == 'reference') {
          argTypes.push(data)
        } else if (data && data.boxed) {
          argTypes.push({ kind: 'class', name: typeToWrapper[type] })
        } else {
          // primitive
          argTypes.push({ kind: 'primitive', prim: type })
        }
      }

      // find matching method
      const methodMeta = findMethod(className, node.name, argTypes)

      if (!methodMeta) {
        throw 'method not found'
      }

      const ret = methodMeta.sig.ret

      if (ret.kind == 'void') {
        throw 'value expected'
      }

      if (ret.kind == 'array') {
        throw 'TODO'
      }

      const tn: TypedMethodInvocationNode = {
        kind: 'invoke',
        args,
        owner: inner,
        handler: () => {
          alert('todo')
          throw 'test'
        },
      }

      if (ret.kind == 'primitive') {
        return [ret.prim, tn]
      }

      return ['reference', tn, { kind: 'class', name: ret.name }]
    case 'cast': {
      const [type, inner, data] = typecheck_internal(node.operand, env)

      if (data && 'boxed' in data && data.boxed) {
        if (!isIdentityOrWideningCast(type, node.type)) {
          throw new Error(
            `Inkompatible Typen: ${displayType(type, data)} kann nicht in ${node.type} konvertiert werden`,
          )
        }
      }

      if (type == 'reference') {
        if (data.kind == 'class' && data.name == 'java.lang.String') {
          throw new Error(
            `Inkompatible Typen: java.lang.String kann nicht in ${typeToWrapper[node.type]} konvertiert werden`,
          )
        }
        const tn: TypedUnboxCastNode = {
          kind: 'cast',
          type: node.type,
          isUnboxing: true,
          operand: inner,
        }
        return [node.type, tn]
      }
      if (node.type == 'boolean') {
        if (type == 'boolean') {
          const tn: TypedBooleanCastNode = {
            kind: 'cast',
            type: 'boolean',
            operand: inner,
          }
          return ['boolean', tn]
        }
        throw new Error(
          `Inkompatible Typen: ${displayType(type, data)} kann nicht in boolean konvertiert werden`,
        )
      }
      if (type == 'null' || type == 'boolean') {
        throw new Error(
          `Inkompatible Typen: ${displayType(type, data)} kann nicht in ${node.type} konvertiert werden`,
        )
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
      throw new Error('Inkompatible Typen: ungültiger Cast')
    }
    case 'binary': {
      const [typeL, innerL, dataL] = typecheck_internal(node.left, env)
      const [typeR, innerR, dataR] = typecheck_internal(node.right, env)

      const isBoxL = dataL && 'boxed' in dataL && dataL.boxed
      const isBoxR = dataR && 'boxed' in dataR && dataR.boxed

      // EQUALITY with boxed values need a special treatment
      if (
        (node.op == '==' || node.op == '!=') &&
        ((isBoxL && (isBoxR || typeR == 'reference' || typeR == 'null')) ||
          (isBoxR && (isBoxL || typeL == 'reference' || typeL == 'null')))
      ) {
        // type check!
        if (isBoxL && isBoxR) {
          if (typeL != typeR) {
            throw new Error(`Inkompatible Typen: ${typeL} und ${typeR}`)
          }
        }
        if (isBoxL != isBoxR) {
          const refData = isBoxL ? dataR : dataL
          if (
            refData &&
            'name' in refData &&
            refData.name != 'java.lang.Object'
          ) {
            // eventuell in Zukunft an dieser Stelle eine noch ausführlichere Meldung
            throw new Error(`Inkompatible Typen bei Vergleich`)
          }
        }
        const tn: TypedBoxedReferenceEqualsNode = {
          kind: 'binary',
          op: '==box',
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
        dataL.kind == 'class' &&
        dataL.name == 'java.lang.String' &&
        node.op == '+'
      ) {
        const tn: TypedStringConcatNodeL = {
          kind: 'binary',
          op: 'concat',
          left: innerL,
          right: innerR,
        }
        return ['reference', tn, { kind: 'class', name: 'java.lang.String' }]
      }

      if (
        typeR == 'reference' &&
        dataR.kind == 'class' &&
        dataR.name == 'java.lang.String' &&
        node.op == '+'
      ) {
        const tn: TypedStringConcatNodeR = {
          kind: 'binary',
          op: 'concat',
          left: innerL,
          right: innerR,
        }
        return ['reference', tn, { kind: 'class', name: 'java.lang.String' }]
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

      // <--- insert open stuff here

      throw new Error(
        `Ungültige Operandentypen für binären Operator "${node.op}": ${displayType(typeL, dataL)} und ${displayType(typeR, dataR)}`,
      )
    }
    case 'identifier': {
      const value = env.local[node.name]
      if (!value) {
        throw new Error(`Symbol nicht gefunden: Variable "${node.name}"`)
      }
      if (value.type == 'reference') {
        return [
          'reference',
          node,
          { kind: 'class', name: env.heap[value.ref].class },
        ]
      }
      if (value.type != 'null' && value.boxed) {
        return [value.type, node, { boxed: true }]
      }
      return [value.type, node]
    }
    case 'ternary': {
      const [condT, condV] = typecheck_internal(node.condition, env)
      if (condT != 'boolean') {
        throw new Error('Inkompatible Typen: Bedingung muss boolean sein')
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
      if (typeL == typeR && typeDataEquals(dataL, dataR)) {
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
        const tnn: TypedConditionalOperatorNumericCastNode = {
          kind: 'ternary',
          condition: condV,
          left: innerL,
          right: innerR,
          castTo: 'short',
        }
        return ['short', tnn]
      }

      // 4. special int rule
      if (typeL == 'int') {
        const folded = foldConstants(innerL)
        if (folded.kind == 'literal' && folded.value.type == 'int') {
          // L is an int constant
          const n = folded.value.value
          if (typeR == 'byte' && n >= -128 && n <= 127) {
            const tnn: TypedConditionalOperatorNumericCastNode = {
              kind: 'ternary',
              condition: condV,
              left: innerL,
              right: innerR,
              castTo: 'byte',
            }
            return ['byte', tnn]
          }
          if (typeR == 'short' && n >= -32768 && n <= 32767) {
            const tnn: TypedConditionalOperatorNumericCastNode = {
              kind: 'ternary',
              condition: condV,
              left: innerL,
              right: innerR,
              castTo: 'short',
            }
            return ['short', tnn]
          }
          if (typeR == 'char' && n >= 0 && n <= (1 << 16) - 1) {
            const tnn: TypedConditionalOperatorNumericCastNode = {
              kind: 'ternary',
              condition: condV,
              left: innerL,
              right: innerR,
              castTo: 'char',
            }
            return ['char', tnn]
          }
        }
      }
      if (typeR == 'int') {
        const folded = foldConstants(innerR)
        if (folded.kind == 'literal' && folded.value.type == 'int') {
          // L is an int constant
          const n = folded.value.value
          if (typeL == 'byte' && n >= -128 && n <= 127) {
            const tnn: TypedConditionalOperatorNumericCastNode = {
              kind: 'ternary',
              condition: condV,
              left: innerL,
              right: innerR,
              castTo: 'byte',
            }
            return ['byte', tnn]
          }
          if (typeL == 'short' && n >= -32768 && n <= 32767) {
            const tnn: TypedConditionalOperatorNumericCastNode = {
              kind: 'ternary',
              condition: condV,
              left: innerL,
              right: innerR,
              castTo: 'short',
            }
            return ['short', tnn]
          }
          if (typeL == 'char' && n >= 0 && n <= (1 << 16) - 1) {
            const tnn: TypedConditionalOperatorNumericCastNode = {
              kind: 'ternary',
              condition: condV,
              left: innerL,
              right: innerR,
              castTo: 'char',
            }
            return ['char', tnn]
          }
        }
      }

      // promotion
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
        if (typeL == 'double' || typeR == 'double') {
          const tnn: TypedConditionalOperatorNumericCastNode = {
            kind: 'ternary',
            condition: condV,
            left: innerL,
            right: innerR,
            castTo: 'double',
          }
          return ['double', tnn]
        }
        if (typeL == 'float' || typeR == 'float') {
          const tnn: TypedConditionalOperatorNumericCastNode = {
            kind: 'ternary',
            condition: condV,
            left: innerL,
            right: innerR,
            castTo: 'float',
          }
          return ['float', tnn]
        }
        if (typeL == 'long' || typeR == 'long') {
          const tnn: TypedConditionalOperatorNumericCastNode = {
            kind: 'ternary',
            condition: condV,
            left: innerL,
            right: innerR,
            castTo: 'long',
          }
          return ['long', tnn]
        }
        const tnn: TypedConditionalOperatorNumericCastNode = {
          kind: 'ternary',
          condition: condV,
          left: innerL,
          right: innerR,
          castTo: 'int',
        }
        return ['int', tnn]
      }

      // 6. Null + Something -> box
      if (typeL == 'null' && typeR != 'null') {
        switch (typeR) {
          case 'reference':
            return [typeR, tn, dataR]
          default:
            tn.boxResult = true
            return [typeR, tn, { boxed: true }]
        }
      }
      if (typeL != 'null' && typeR == 'null') {
        switch (typeL) {
          case 'reference':
            return [typeL, tn, dataL]
          default:
            tn.boxResult = true
            return [typeL, tn, { boxed: true }]
        }
      }

      // 7. General Types -> currently just fall back to Object
      tn.objectify = true
      return ['reference', tn, { kind: 'class', name: 'java.lang.Object' }]
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
      throw 'Interner Systemfehler: unmögliches Literal'
    case 'short':
      throw 'Interner Systemfehler: unmögliches Literal'
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
