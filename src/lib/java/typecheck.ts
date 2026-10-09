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
  TypedAssignNode,
  TypedIndexNode,
  TypedUpdateNode,
  BinaryExpressionAstNode,
  TypedClassReferenceNode,
} from '../state/types'
import { foldConstants } from './fold'
import {
  findMethod,
  hasMethodNamed,
  isAssignable,
  isIdentityOrWideningCast,
  printType,
  resultFromType,
  resultToType,
  strDatToDisplType,
  typeDataEquals,
  typeToWrapper,
  unboxType,
} from './helper/typing'

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
        `Ungültiger Operandentyp ${printType(strDatToDisplType(type, data))} für unären Operator "${node.op}"`,
      )
    }
    case 'invoke':
      const [type, inner, data] = typecheck_internal(node.owner, env)

      let className
      // first job: unbox and resolve to class name
      if (type == 'reference') {
        if (data.kind == 'array') {
          throw 'Interner Systemfehler: Methodenaufruf auf Arrays wird noch nicht unterstützt'
        }
        className = data.name
      }
      // and the special case of boxed values
      if (data && 'boxed' in data && type != 'null' && type != 'reference') {
        className = typeToWrapper[type]
      }

      if (type == 'null' && node.owner.kind == 'identifier') {
        // assume Object
        className = 'java.lang.Object'
      }

      if (!className) {
        // javac: "int kann nicht dereferenziert werden" / "<Null> kann nicht dereferenziert werden"
        throw new Error(
          `${printType(strDatToDisplType(type, data))} kann nicht dereferenziert werden`,
        )
      }

      // now, extract the arg structure
      const argTypes: Type[] = []
      const args: TypedNode<JavaValue>[] = []

      for (const arg of node.args) {
        const [type, inner, data] = typecheck_internal(arg, env)
        args.push(inner)
        if (type == 'null') {
          argTypes.push({ kind: 'class', name: 'java.lang.Object' })
          continue
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
        // javac: "Symbol nicht gefunden: Methode foo()" vs
        //        "Methode equals in Klasse String kann nicht auf die angegebenen Typen angewendet werden"
        if (hasMethodNamed(className, node.name)) {
          throw new Error(
            `Methode ${node.name} in Klasse ${className} kann nicht auf die angegebenen Typen angewendet werden.`,
          )
        }
        throw new Error(`Symbol nicht gefunden: Methode ${node.name}()`)
      }

      const ret = methodMeta.sig.ret

      if (ret.kind == 'void') {
        throw new Error('"void"-Typ hier nicht zulässig')
      }

      if (ret.kind == 'array') {
        throw 'Interner Systemfehler: Methoden mit Array-Rückgabetyp werden noch nicht unterstützt'
      }

      const tn: TypedMethodInvocationNode = {
        kind: 'invoke',
        name: methodMeta.name,
        args,
        resolvedSignature: methodMeta.sig,
        owner: inner,
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
            `Inkompatible Typen: ${printType(strDatToDisplType(type, data))} kann nicht in ${node.type} konvertiert werden`,
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
          `Inkompatible Typen: ${printType(strDatToDisplType(type, data))} kann nicht in boolean konvertiert werden`,
        )
      }
      if (type == 'null' || type == 'boolean') {
        throw new Error(
          `Inkompatible Typen: ${printType(strDatToDisplType(type, data))} kann nicht in ${node.type} konvertiert werden`,
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
            throw new Error(
              `Inkompatible Typen: ${printType(strDatToDisplType(typeL, dataL))} und ${printType(strDatToDisplType(typeR, dataR))}`,
            )
          }
        }
        if (isBoxL != isBoxR) {
          const refData = isBoxL ? dataR : dataL
          if (
            refData &&
            'name' in refData &&
            refData.name != 'java.lang.Object'
          ) {
            throw new Error(
              `Inkompatible Typen: ${printType(strDatToDisplType(typeL, dataL))} und ${printType(strDatToDisplType(typeR, dataR))}`,
            )
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
          const isShift = node.op == '<<' || node.op == '>>' || node.op == '>>>'
          if (typeL == 'long' || (!isShift && typeR == 'long')) {
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
        `Ungültige Operandentypen für binären Operator "${node.op}": ${printType(strDatToDisplType(typeL, dataL))} und ${printType(strDatToDisplType(typeR, dataR))}`,
      )
    }
    case 'identifier': {
      if (!env.local[node.name]) {
        // special case for static class references
        if (node.name == 'Math') {
          const tn: TypedClassReferenceNode = {
            kind: 'class-reference',
            name: 'java.lang.Math',
          }
          // Also, ist das eigentlich ok? Weil wenn man versucht, dass auf den
          // aufzurufen, dann schlägt das natürlich fehl.
          // Aber das sollte ja 'eigentlich' nicht passieren, right?
          // Oder ich muss an entsprechender Stelle einen guard einbauen
          return ['reference', tn, { kind: 'class', name: 'java.lang.Math' }]
        }
      }
      const value = lookupLocal(node.name, env)
      if (value.type == 'reference') {
        const obj = env.heap[value.ref]
        if ('isArray' in obj && obj.isArray) {
          return ['reference', node, { kind: 'array', elem: obj.type }]
        }
        return ['reference', node, { kind: 'class', name: obj.class }]
      }
      if (value.type != 'null' && value.boxed) {
        return [value.type, node, { boxed: true }]
      }
      return [value.type, node]
    }
    case 'update': {
      const lval = typecheck_internal(node.lval, env)
      const [lvalT, lvalNode, lvalData] = lval
      if (lvalT != 'null') {
        const slotType = unboxType(resultToType(lval))
        if (
          slotType.kind == 'primitive' &&
          slotType.prim != 'boolean' &&
          (lvalNode.kind == 'index' || lvalNode.kind == 'identifier')
        ) {
          const tn: TypedUpdateNode = {
            kind: 'update',
            lval: lvalNode,
            op: node.op,
            prefix: node.prefix,
          }
          return resultFromType(slotType, tn)
        }
      }
      throw new Error(
        `Ungültiger Operandentyp ${printType(strDatToDisplType(lvalT, lvalData))} für "${node.op}"`,
      )
    }
    case 'assign': {
      const lval = typecheck_internal(node.lval, env)
      const [lvalT, lvalNode, lvalData] = lval

      if (lvalNode.kind != 'identifier' && lvalNode.kind != 'index') {
        throw 'Interner Systemfehler: lval sollte gültig sein'
      }

      if (node.op == '=') {
        const result = typecheck_internal(node.value, env)
        checkValidityOfAssignment(lval, result)

        const tn: TypedAssignNode = {
          kind: 'assign',
          lval: lvalNode,
          op: '=',
          value: result[1],
        }
        return lvalT == 'null'
          ? ['null', tn]
          : resultFromType(resultToType(lval), tn)
      }

      const [opType, opNode, opData] = typecheck_internal(
        {
          kind: 'binary',
          op: node.op.slice(0, -1) as BinaryExpressionAstNode['op'],
          left: node.lval,
          right: node.value,
        },
        env,
      )

      const lvalBoxed = !!lval[2] && 'boxed' in lval[2] && !!lval[2].boxed
      const numeric =
        opType != 'boolean' && opType != 'reference' && opType != 'null'
      const valid =
        lvalT == 'reference'
          ? opType == 'reference'
          : lvalT == 'boolean'
            ? opType == 'boolean'
            : numeric && (!lvalBoxed || opType == lvalT)

      if (!valid) {
        throw new Error(
          `Ungültige Operandentypen für "${node.op}": ${printType(strDatToDisplType(lvalT, lvalData))} und ${printType(strDatToDisplType(opType, opData))}`,
        )
      }

      const tn: TypedAssignNode = {
        kind: 'assign',
        lval: lvalNode,
        op: node.op,
        value: opNode,
      }

      return lvalT == 'null'
        ? ['null', tn]
        : resultFromType(resultToType(lval), tn)
    }
    case 'index': {
      const [arrT, arrNode, arrData] = typecheck_internal(node.array, env)
      if (
        arrT != 'reference' ||
        !arrData ||
        !('kind' in arrData) ||
        arrData.kind != 'array'
      ) {
        throw new Error(
          `Array erforderlich, aber ${printType(strDatToDisplType(arrT, arrData))} gefunden`,
        )
      }
      const [idxT, idxNode, idxData] = typecheck_internal(node.index, env)
      if (
        idxT != 'byte' &&
        idxT != 'short' &&
        idxT != 'char' &&
        idxT != 'int'
      ) {
        throw new Error(
          `Inkompatible Typen: ${printType(strDatToDisplType(idxT, idxData))} kann nicht in int konvertiert werden`,
        )
      }
      const tn: TypedIndexNode = {
        kind: 'index',
        array: arrNode,
        index: idxNode,
      }

      return resultFromType(arrData.elem, tn)
    }
    case 'ternary': {
      const [condT, condV, condData] = typecheck_internal(node.condition, env)
      if (condT != 'boolean') {
        throw new Error(
          `Inkompatible Typen: ${printType(strDatToDisplType(condT, condData))} kann nicht in boolean konvertiert werden`,
        )
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
      // Later on, one would find the greatest common intersection class (LUB)
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

function lookupLocal(name: string, env: JavaEnvironment): JavaValue {
  const value = env.local[name]
  if (!value) {
    throw new Error(`Symbol nicht gefunden: Variable ${name}`)
  }
  return value
}

function canConstantNarrow(
  targetType: Type,
  srcType: TypecheckResult[0],
  node: TypedNode<JavaValue>,
): boolean {
  const unboxed = unboxType(targetType)
  if (unboxed.kind != 'primitive') return false
  const dst = unboxed.prim
  if (dst != 'byte' && dst != 'short' && dst != 'char') {
    return false
  }
  if (
    srcType != 'byte' &&
    srcType != 'short' &&
    srcType != 'char' &&
    srcType != 'int'
  ) {
    return false
  }
  const folded = foldConstants(node)
  if (folded.kind != 'literal') {
    return false
  }
  const v = folded.value.value
  if (typeof v != 'number') return false
  if (dst == 'byte') return v >= -128 && v <= 127
  if (dst == 'short') return v >= -32768 && v <= 32767
  return v >= 0 && v <= 65535
}

function checkValidityOfAssignment(
  target: TypecheckResult,
  result: TypecheckResult,
) {
  const [targetT, , targetData] = target
  if (result[0] == 'null') {
    if (targetT == 'reference') return
    if (
      targetT != 'null' &&
      targetData &&
      'boxed' in targetData &&
      targetData.boxed
    )
      return
    throw assignmentError(target, result)
  }
  const targetType = resultToType(target)
  const sourceType = resultToType(result)
  if (isAssignable(targetType, sourceType)) {
    return
  }
  if (canConstantNarrow(targetType, result[0], result[1])) {
    return
  }
  throw assignmentError(target, result)
}

function assignmentError(target: TypecheckResult, result: TypecheckResult) {
  const [srcType, , srcData] = result
  const dstName = printType(strDatToDisplType(target[0], target[2]))
  return new Error(
    `Inkompatible Typen: ${printType(strDatToDisplType(srcType, srcData))} kann nicht in ${dstName} konvertiert werden`,
  )
}
