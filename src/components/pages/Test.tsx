import { Text } from '@codemirror/state'
import { cursorToCstNode, prettyPrintCstNode } from '../../lib/java/helper/cst'
import { parser } from '../../lib/java/lezer/parser'
import { useCore } from '../../lib/state/core'
import { checkForParseErrors, cst2ast } from '../../lib/java/cst2ast'
import { typecheck } from '../../lib/java/typecheck'
import { evaluate } from '../../lib/java/evaluate'
import type { JavaEnvironment } from '../../lib/state/types'
import { foldConstants } from '../../lib/java/fold'

const testEnv: JavaEnvironment = {
  local: {
    zahl: { type: 'int', value: 42 },
    a: { type: 'int', value: 1000, boxed: true },
  },
  heap: {},
}

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
      ws.ui.testOutputEnv = undefined
    })
    try {
      const env: JavaEnvironment = JSON.parse(JSON.stringify(testEnv))
      checkForParseErrors(cst)
      const ast = cst2ast(cst)
      core.mutateWs((ws) => {
        ws.ui.testAst = ast
      })
      const typed = typecheck(ast, env)
      console.log(typed)
      const value = evaluate(foldConstants(typed), env)
      core.mutateWs((ws) => {
        ws.ui.testOutput = value
        ws.ui.testOutputEnv = JSON.stringify(env)
      })
    } catch (e) {
      core.mutateWs((ws) => {
        ws.ui.testError = e instanceof Error ? e.message : String(e)
      })
    }
  }

  return (
    <div className="w-[600px] mx-auto">
      <form
        className="py-6 px-3 bg-pink-500 mt-4 sticky top-0"
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
            run()
          }}
        />
        <br />
        <br />
        Env: {JSON.stringify(testEnv)}
      </form>
      {core.ws.ui.testOutput && (
        <div className="mt-6 bg-lime-300 p-3">
          <h2>Evaluation</h2>
          <pre className="mt-4">
            {JSON.stringify(core.ws.ui.testOutput, null, 2)}
          </pre>
          <p className="mt-4 text-sm">{core.ws.ui.testOutputEnv}</p>
        </div>
      )}
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
      {core.ws.ui.testError && (
        <div className="mt-6 bg-rose-300 p-3">
          <pre>{core.ws.ui.testError}</pre>
        </div>
      )}
    </div>
  )
}
