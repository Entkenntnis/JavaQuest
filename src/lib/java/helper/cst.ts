import { Text } from '@codemirror/state'
import { TreeCursor } from '@lezer/common'
import type { CstNode } from '../../state/types'

export function cursorToCstNode(cursor: TreeCursor, doc: Text): CstNode {
  const from = cursor.from
  const to = cursor.to
  const node: CstNode = {
    name: cursor.name,
    from,
    to,
    isError: cursor.type.isError,
    text: doc.sliceString(from, to),
    children: [],
  }
  if (cursor.firstChild()) {
    do {
      node.children.push(cursorToCstNode(cursor.node.cursor(), doc))
    } while (cursor.nextSibling())
  }
  return node
}

export function prettyPrintCstNode(node: CstNode, offset = 0) {
  let output = ''
  for (let i = 0; i < offset; i++) {
    output += '｜ '
  }
  output += `${node.name} (${node.from} - ${node.to})${
    node.children.length == 0 ? ` "${node.text}"` : ''
  }\n`
  for (const child of node.children) {
    output += prettyPrintCstNode(child, offset + 1)
  }
  return output
}
