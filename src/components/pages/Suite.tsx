import { useEffect, useState } from 'react'
import { testSuite } from '../../lib/data/test-suite'
import type { TestSuiteEntry } from '../../lib/state/types'
import { parser } from '../../lib/java/lezer/parser'
import { Text } from '@codemirror/state'
import { cursorToCstNode } from '../../lib/java/helper/cst'
import { checkForParseErrors, cst2ast } from '../../lib/java/cst2ast'
import clsx from 'clsx'

export function Suite() {
  return (
    <div className="mx-6 mb-32 mt-6">
      <h1 className="text-lg mb-8">Test-Suite</h1>
      {testSuite.map((el) => (
        <Entry key={el.code} entry={el} />
      ))}
    </div>
  )
}

function Entry({ entry }: { entry: TestSuiteEntry }) {
  const [error, setError] = useState('')
  const [ast, setAst] = useState<object | null>(null)

  useEffect(() => {
    const tree = parser.parse(entry.code)
    const cst = cursorToCstNode(tree.cursor(), Text.of([entry.code]))
    try {
      checkForParseErrors(cst)
      const ast = cst2ast(cst)
      setAst(ast)
    } catch (e) {
      setError((e as any).toString())
    }
  }, [])

  const hasResult = error || ast

  return (
    <div className="flex justify-between border-2 border-pink-300">
      <div>
        <pre className="rounded ml-3 my-3 border-2 border-pink-600 px-4 py-1">
          {entry.code}
        </pre>
      </div>
      {!hasResult && <div className="p-1">...</div>}
      {error && entry.isError && (
        <div className="p-1 text-green-600">
          <pre>OK, mit Fehler {error}</pre>
        </div>
      )}
      {((error && !entry.isError) || (!entry.isError && !ast)) && (
        <div className="p-1 text-red-600">FAIL! Fehler: {error}</div>
      )}
      {ast &&
        (() => {
          const outputStr = JSON.stringify(ast, null, 2)
          const expectedStr = JSON.stringify(entry.output, null, 2)
          const isTheSame = outputStr === expectedStr
          return (
            <div className="flex gap-6">
              {!isTheSame && entry.isError && (
                <div className="text-red-600 font-bold m-4">
                  Fehler erwartet
                </div>
              )}
              <div
                className={clsx(
                  isTheSame ? 'text-green-600' : 'text-red-600',
                  'm-1',
                )}
              >
                <p>Output:</p>
                <pre>{outputStr}</pre>
              </div>
              {!isTheSame && !entry.isError && (
                <div className="m-1">
                  <p className="">Expected:</p>
                  <pre>{expectedStr}</pre>
                </div>
              )}
            </div>
          )
        })()}
    </div>
  )
}
