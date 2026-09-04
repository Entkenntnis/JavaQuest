import type {
  AstNode,
  CstNode,
  JavaIntValue,
  JavaLongValue,
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
  } else if (node.name == 'IntegerLiteral') {
    return { kind: 'literal', value: parseIntegerLiteral(node) }
  } else if (node.name == 'FloatingPointLiteral') {
  } else if (node.name == 'BooleanLiteral') {
  } else if (node.name == 'CharacterLiteral') {
  } else if (node.name == 'StringLiteral') {
  } else if (node.name == 'null') {
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

function parseIntegerLiteral(node: CstNode): JavaIntValue | JavaLongValue {
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
  } else if (/^0[oO]/.test(body)) {
    radix = 8
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
  const signedMaximum = 1n << (BigInt(bits - 1) - 1n)
  const unsignedMaximum = 1n << (BigInt(bits) - 1n)
  if (radix == 10) {
    if (magnitude > signedMaximum) {
      throw conversionError(node, 'integer literal is out of range')
    }
  } else if (magnitude > unsignedMaximum) {
    throw conversionError(
      node,
      `integer literal does not fit into ${bits} bits`,
    )
  }

  const signed = BigInt.asIntN(bits, magnitude)
  if (isLong) return { type: 'long', value: signed.toString() }

  return { type: 'int', value: Number(signed) }
}
