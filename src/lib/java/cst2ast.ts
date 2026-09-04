import type { AstNode, CstNode } from '../state/types'

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
  }
  // TODOs
}

function conversionError(node: CstNode, reason: string) {
  return new Error(
    `[cst2ast] ${reason}\n  node: ${node.name} [${node.from}, ${node.to}]\n  source: ${JSON.stringify(node.text)}`,
  )
}
