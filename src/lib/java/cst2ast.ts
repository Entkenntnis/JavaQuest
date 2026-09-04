import type {
  AstNode,
  CstNode,
  JavaBooleanValue,
  JavaCharValue,
  JavaDoubleValue,
  JavaFloatValue,
  JavaIntValue,
  JavaLongValue,
  JavaStringValue,
} from '../state/types'

function conversionError(node: CstNode, reason: string) {
  return new Error(
    `[cst2ast] ${reason}\n  node: ${node.name} [${node.from}, ${node.to}]\n  source: ${JSON.stringify(node.text)}`,
  )
}

export function checkForParseErrors(node: CstNode) {
  if (node.isError) {
    throw conversionError(node, 'input does not parse')
  }
  for (const child of node.children) {
    checkForParseErrors(child)
  }
}

export function cst2ast(node: CstNode): AstNode {
  if (node.isError) {
    throw 'internal system error: please check for errors first'
  }
  if (node.name == 'Expression') {
    if (node.children.length != 1) {
      throw 'internal system error: valid expression must have one child'
    }
    return cst2ast(node.children[0])
  } else if (node.name == 'UnaryExpression') {
    // TODO: this part of the code is really fragile and needs some more polish
    // a lot of sanity checks are missing
    // grammar will allow anything, make this more sane in a moment
    const [op, operand] = node.children
    if (operand.name == 'IntegerLiteral') {
      return {
        kind: 'literal',
        value: parseIntegerLiteral(node, op.text == '-'),
      }
    }
  } else if (node.name == 'IntegerLiteral') {
    return { kind: 'literal', value: parseIntegerLiteral(node) }
  } else if (node.name == 'FloatingPointLiteral') {
    return { kind: 'literal', value: parseFloatingPointLiteral(node) }
  } else if (node.name == 'BooleanLiteral') {
    return { kind: 'literal', value: parseBooleanLiteral(node) }
  } else if (node.name == 'CharacterLiteral') {
    return { kind: 'literal', value: parseCharacterLiteral(node) }
  } else if (node.name == 'StringLiteral') {
    return { kind: 'literal', value: parseStringLiteral(node) }
  } else if (node.name == 'null') {
    return { kind: 'literal', value: { type: 'null' } }
  }
  throw conversionError(node, 'no converter registered for this node')
}

const radixPrefix = {
  2: '0b',
  8: '0o',
  10: '',
  16: '0x',
}

const radixPattern = {
  2: /^[01]+$/,
  8: /^[0-7]+$/,
  10: /^[0-9]+$/,
  16: /^[0-9a-fA-F]+$/,
}

function parseIntegerLiteral(
  node: CstNode,
  minus: boolean = false,
): JavaIntValue | JavaLongValue {
  const raw = node.text
  const isLong = /[lL]$/.test(raw)
  const body = isLong ? raw.slice(0, -1) : raw

  let radix: 2 | 8 | 10 | 16
  let digits: string

  if (/^0[xX]/.test(body)) {
    radix = 16
    digits = body.slice(2)
  } else if (/^0[bB]/.test(body)) {
    radix = 2
    digits = body.slice(2)
  } else {
    const compact = body.replace(/_/g, '')
    if (compact === '0') {
      radix = 10
      digits = '0'
    } else if (compact.startsWith('0')) {
      radix = 8
      digits = compact.slice(1)
    } else {
      radix = 10
      digits = compact
    }
  }
  digits = digits.replace(/_/g, '')
  if (digits.length === 0) {
    throw 'internal system error: no digits'
  }
  if (!radixPattern[radix].test(digits)) {
    // the famous case is 08, that the grammar is not handling
    throw conversionError(node, 'invalid digit in integer literal')
  }

  const magnitude = BigInt(radixPrefix[radix] + digits)
  const bits = isLong ? 64 : 32
  const signedMaximum = (1n << BigInt(bits - 1)) - 1n
  const unsignedMaximum = (1n << BigInt(bits)) - 1n
  if (radix == 10) {
    const decimalmaximum = minus ? 1n << BigInt(bits - 1) : signedMaximum
    if (magnitude > decimalmaximum) {
      throw conversionError(node, 'integer literal is out of range')
    }
  } else if (magnitude > unsignedMaximum) {
    throw conversionError(
      node,
      `integer literal does not fit into ${bits} bits`,
    )
  }

  const signed = BigInt.asIntN(bits, minus ? -magnitude : magnitude)
  if (isLong) return { type: 'long', value: signed.toString() }

  return { type: 'int', value: Number(signed) }
}

function parseFloatingPointLiteral(
  node: CstNode,
): JavaFloatValue | JavaDoubleValue {
  const raw = node.text
  const isFloat = /[fF]$/.test(raw)
  const body = /[fFdD]$/.test(raw) ? raw.slice(0, -1) : raw
  const isHex = body.startsWith('0x') || body.startsWith('0X')
  const value = isHex ? parseHexFloat(body) : Number(body.replace(/_/g, ''))

  if (isFloat) {
    const rounded = Math.fround(value)
    if (!Number.isFinite(rounded)) {
      throw conversionError(node, 'floating literal is too large for a float')
    }
    return { type: 'float', value: rounded }
  }
  if (!Number.isFinite(value)) {
    throw conversionError(node, 'floating literal is too large for a double')
  }
  return { type: 'double', value }
}

// damn, what a rare and exotic feature
function parseHexFloat(body: string): number {
  const exponentMatch = /[pP]([+-]?[0-9_]+)$/.exec(body)
  if (!exponentMatch) {
    throw 'internal system error: hex exponent missing'
  }
  const exponent = parseInt(exponentMatch[1].replace(/_/g, ''), 10)
  const significand = body
    .slice(0, exponentMatch.index)
    .replace(/^0[xX]/, '')
    .replace(/_/g, '')
  const dotIndex = significand.indexOf('.')
  const integerPart =
    dotIndex == -1 ? significand : significand.slice(0, dotIndex)
  const fractionPart = dotIndex == -1 ? '' : significand.slice(dotIndex + 1)
  if (integerPart.length + fractionPart.length == 0) {
    throw 'internal system error: no mantissa digits'
  }

  let mantissa = (integerPart + fractionPart).replace(/^0+/, '') || '0'
  let power = exponent - 4 * fractionPart.length
  let length = mantissa.length
  while (length > 1 && mantissa[length - 1] === '0') {
    length -= 1
    power += 4
  }
  mantissa = mantissa.slice(0, length)
  if (mantissa === '0') return 0
  // BEWARE, there are some extremely rare cases where this code
  // will differ from java parser and drift, e.g. 0x1.8p-1074
  // Accept this for now
  return Number(BigInt('0x' + mantissa)) * 2 ** power
}

const simpleEscapes: Record<string, number> = {
  b: 8,
  t: 9,
  n: 10,
  f: 12,
  r: 13,
  '"': 34,
  "'": 39,
  '\\': 92,
}

function unescape(text: string): string {
  let result = ''
  let i = 0
  while (i < text.length) {
    const current = text[i]
    if (current != '\\') {
      result += current
      i += 1
      continue
    }
    const next = text[i + 1]
    if (next == undefined) throw new Error('cannot parse string')
    if (/[0-7]/.test(next)) {
      const maxDigits = next <= '3' ? 3 : 2
      let code = 0
      let count = 0
      while (count < maxDigits && /[0-7]/.test(text[i + 1 + count])) {
        code = code * 8 + text.charCodeAt(i + 1 + count) - 48
        count += 1
      }
      result += String.fromCharCode(code)
      i += count + 1
    } else if (next in simpleEscapes) {
      result += String.fromCharCode(simpleEscapes[next])
      i += 2
    } else if (next == 'u') {
      let j = i + 1
      while (j < text.length && text[j] == 'u') j += 1
      const hex = text.slice(j, j + 4)
      if (!/^[0-9a-fA-F]{4}$/.test(hex)) throw new Error('cannot parse string')
      result += String.fromCharCode(parseInt(hex, 16))
      i = j + 4
    } else {
      throw new Error('cannot parse string')
    }
  }
  return result
}

function parseCharacterLiteral(node: CstNode): JavaCharValue {
  const raw = node.text
  if (raw.length < 2 || raw[0] != "'" || raw[raw.length - 1] != "'") {
    throw conversionError(node, 'malformed character literal')
  }
  const decoded = unescape(raw.slice(1, -1))
  if (decoded.length != 1) {
    throw conversionError(
      node,
      'character literal must contain exactly one UTF-16 code unit',
    )
  }
  return { type: 'char', value: decoded.charCodeAt(0) }
}

function parseStringLiteral(node: CstNode): JavaStringValue {
  const raw = node.text
  if (raw.length < 2 || raw[0] != '"' || raw[raw.length - 1] != '"') {
    throw conversionError(node, 'malformed string literal')
  }
  return { type: 'string', value: unescape(raw.slice(1, -1)) }
}

function parseBooleanLiteral(node: CstNode): JavaBooleanValue {
  const raw = node.text
  if (raw == 'true') return { type: 'boolean', value: true }
  if (raw == 'false') return { type: 'boolean', value: false }
  throw 'internal system error: invalid boolean literal'
}
