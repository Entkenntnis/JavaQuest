// ============================================================================
// KNOWN IMPLEMENTATION ERRORS (found while writing the arithmetic test suite)
// ----------------------------------------------------------------------------
// 1. int overflow wraps wrong: binary arithmetic is computed in double and then
//    funnelled through toInt(), which SATURATES for float/double sources
//    (see toInt below). Java int arithmetic must wrap (two's complement), so
//      - 2147483647 + 1           -> 2147483647  (Java: -2147483648)
//      - 2000000000 + 2000000000  -> 2147483647  (Java: -294967296)
//      - -2147483648 - 1          -> -2147483648 (Java: 2147483647)
//      - 2147483647 * 2           -> 2147483647  (Java: -2)
//      - -2147483648 / -1         -> 2147483647  (Java: -2147483648)
//    long arithmetic is unaffected (it wraps via BigInt.asIntN(64, ...)).
//
// 2. int division/modulo by zero (1 / 0, 1 % 0, 0 / 0) return values instead
//    of erroring: int division becomes Infinity (saturates to 2147483647),
//    modulo becomes NaN (maps to 0). Long division/modulo by zero happens to
//    throw (BigInt RangeError) and therefore reports an error, so behaviour is
//    inconsistent between int and long.
//
// 3. (parser, not this file) '%' has the wrong precedence in
//    src/lib/java/lezer/java.grammar: it sits on the 'shift' level, i.e.
//    BELOW '+'/'-'. Java gives '%' multiplicative precedence (same as '*','/').
//    As a result 10 % 4 + 1 parses as 10 % (4 + 1) = 0 instead of 3, etc.
//
// FLOATING-POINT REMARKS (expected behaviours that are NOT yet testable,
// because the JavaValue model and the JSON comparison both silently collapse
// NaN / +-Infinity to null and -0.0 to 0):
//   a) float/double division by zero is NOT an error (unlike int/long):
//       1.0 / 0.0  -> +Infinity   (1 / 0.0, i.e. an int 0 promoted, does too)
//       -1.0 / 0.0 -> -Infinity
//       0.0 / 0.0  -> NaN
//      The current double path yields these naturally as JS numbers, but they
//      cannot be asserted: JSON.stringify(NaN/Infinity) === 'null'. The Java
//      cross-check wrapper already prints such values as { special: ... }.
//   b) double/float '%' with a zero divisor gives NaN (e.g. 1.0 % 0.0, 0.0 % 0.0)
//      and with an Infinity divisor returns the dividend (5.0 % Infinity -> 5.0).
//      Infinity operands: Infinity % x -> NaN, x % Infinity -> x.
//   c) Signed zero: Java distinguishes -0.0 from 0.0, e.g. -0.0 is the result of
//      unary minus on 0.0 and 1.0 / -0.0 is -Infinity while 1.0 / 0.0 is
//      +Infinity. The evaluator produces JS -0, but JSON.stringify(-0) === '0',
//      so the sign is invisible to tests and to == comparisons (JS -0 == 0).
//   d) Precision: single float ops round via double then Math.fround, which
//      matches Java's direct single rounding for the cases above; chained
//      float expressions are re-rounded after every step, as Java requires.
//      Still, avoid hand-written float/double expectations that rely on more
//      than ~15 significant digits unless they were produced by the evaluator
//      AND confirmed by the java cross-check.
// ============================================================================

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
        return toInt({ type: 'int', value: -inner.value })
      }
      if (inner.type == 'long') {
        return toLong({
          type: 'long',
          value: (-BigInt(inner.value)).toString(),
        })
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

    if (isNumeric(inner)) {
      if (node.type != 'boolean') {
        return convertTo(node.type, inner)
      }
    }

    throw new Error('invalid cast')
  }

  if (node.kind == 'binary') {
    const innerLeft = evaluate(node.left)
    const innerRight = evaluate(node.right)

    // handle +, -, *, /, % on numerics
    if (isNumeric(innerLeft) && isNumeric(innerRight)) {
      const [left, right] = binaryNumericPromotion(innerLeft, innerRight)

      if (node.op == '+') {
        if (left.type == 'long' || right.type == 'long') {
          return toLong({
            type: 'long',
            value: (BigInt(left.value) + BigInt(right.value)).toString(),
          })
        }
        return convertTo(left.type, {
          type: 'double',
          value: left.value + right.value,
        })
      }
      if (node.op == '-') {
        if (left.type == 'long' || right.type == 'long') {
          return toLong({
            type: 'long',
            value: (BigInt(left.value) - BigInt(right.value)).toString(),
          })
        }
        return convertTo(left.type, {
          type: 'double',
          value: left.value - right.value,
        })
      }
      if (node.op == '*') {
        if (left.type == 'long' || right.type == 'long') {
          return toLong({
            type: 'long',
            value: (BigInt(left.value) * BigInt(right.value)).toString(),
          })
        }
        return convertTo(left.type, {
          type: 'double',
          value: left.value * right.value,
        })
      }
      if (node.op == '/') {
        if (left.type == 'long' || right.type == 'long') {
          return toLong({
            type: 'long',
            value: (BigInt(left.value) / BigInt(right.value)).toString(),
          })
        }
        return convertTo(left.type, {
          type: 'double',
          value: left.value / right.value,
        })
      }
      if (node.op == '%') {
        if (left.type == 'long' || right.type == 'long') {
          return toLong({
            type: 'long',
            value: (BigInt(left.value) % BigInt(right.value)).toString(),
          })
        }
        return convertTo(left.type, {
          type: 'double',
          value: left.value % right.value,
        })
      }
    }

    throw new Error('binary operator not implemented')
  }

  throw new Error(`Evaluation of node failed`)
}

function isNumeric(val: JavaValue): val is JavaNumericPrimitiveValue {
  return (
    val.type == 'byte' ||
    val.type == 'short' ||
    val.type == 'char' ||
    val.type == 'int' ||
    val.type == 'long' ||
    val.type == 'float' ||
    val.type == 'double'
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
