import { Text } from '@codemirror/state'
import { cursorToCstNode, prettyPrintCstNode } from '../../lib/java/helper/cst'
import { parser } from '../../lib/java/lezer/parser'
import { useCore } from '../../lib/state/core'
import { checkForParseErrors, cst2ast } from '../../lib/java/cst2ast'
import { evaluateLegacy } from '../../lib/java/evaluate'
import { typecheck__LEGACY } from '../../lib/java/typecheck'

export function Test() {
  const core = useCore()
  function run() {
    const tree = parser.parse(core.ws.ui.testInput)
    const cst = cursorToCstNode(tree.cursor(), Text.of([core.ws.ui.testInput]))
    core.mutateWs((ws) => {
      ws.ui.testCst = cst
      ws.ui.testError = undefined
      ws.ui.testAst = undefined
      ws.ui.testOutput = undefined
    })
    try {
      checkForParseErrors(cst)
      const ast = cst2ast(cst)
      core.mutateWs((ws) => {
        ws.ui.testAst = ast
      })
      typecheck__LEGACY(ast)
      const value = evaluateLegacy(ast)
      core.mutateWs((ws) => {
        ws.ui.testOutput = value
      })
    } catch (e) {
      core.mutateWs((ws) => {
        ws.ui.testError = (e as any).toString()
      })
    }
  }

  return (
    <div className="w-[600px] mx-auto">
      <form
        className="py-6 px-3 bg-pink-500 mt-4"
        onSubmit={(e) => {
          run()
          e.preventDefault()
        }}
      >
        <input
          className="font-mono w-full text-lg"
          value={core.ws.ui.testInput}
          onChange={(e) => {
            core.mutateWs((ws) => {
              ws.ui.testInput = e.target.value
            })
          }}
        />
        <br />
        <button className="px-2 py-0.5 bg-pink-100 rounded mt-3">Run</button>
      </form>
      <div className="mt-6 bg-emerald-300 p-3">
        <h2>Lezer Concrete Syntax Tree</h2>
        {core.ws.ui.testCst && (
          <p className="mt-4">
            <pre>{prettyPrintCstNode(core.ws.ui.testCst)}</pre>
          </p>
        )}
      </div>
      {core.ws.ui.testAst && (
        <div className="mt-6 bg-violet-200 p-3">
          <h2>Abstract Syntax Tree</h2>
          <pre className="mt-4">
            {JSON.stringify(core.ws.ui.testAst, null, 2)}
          </pre>
        </div>
      )}
      {core.ws.ui.testOutput && (
        <div className="mt-6 bg-lime-300 p-3">
          <h2>Evaluation</h2>
          <pre className="mt-4">
            {JSON.stringify(core.ws.ui.testOutput, null, 2)}
          </pre>
        </div>
      )}
      {core.ws.ui.testError && (
        <div className="mt-6 bg-rose-300 p-3">
          <pre>{core.ws.ui.testError}</pre>
        </div>
      )}
    </div>
  )
}
