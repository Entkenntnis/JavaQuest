import { testSuite } from '../../lib/data/test-suite'
import type {
  JavaEnvironment,
  SuiteResult,
  TestSuiteEntry,
} from '../../lib/state/types'
import { parser } from '../../lib/java/lezer/parser'
import { Text } from '@codemirror/state'
import { cursorToCstNode } from '../../lib/java/helper/cst'
import { checkForParseErrors, cst2ast } from '../../lib/java/cst2ast'
import clsx from 'clsx'
import { evaluate, foldConstants } from '../../lib/java/evaluate'
import { typecheck } from '../../lib/java/typecheck'
import { useCore } from '../../lib/state/core'

function runCase(code: string, env: JavaEnvironment): SuiteResult {
  try {
    const tree = parser.parse(code)
    const cst = cursorToCstNode(tree.cursor(), Text.of([code]))
    checkForParseErrors(cst)
    const ast = cst2ast(cst)
    const typed = typecheck(ast, env)
    const value = evaluate(foldConstants(typed), env)
    if (value.type == 'reference') {
      const obj = env.heap[value.ref]
      if (obj.class == 'java.lang.String') {
        return {
          value: { type: '__str', value: obj.value },
        }
      }
      // auto unboxing, like in cross check harness
      if (obj.class == 'java.lang.Object' && obj.__hack_from_objectify_boxing) {
        return { value: obj.__hack_from_objectify_boxing }
      }
    }
    if (value.type == 'reference') {
      throw new Error(
        'comparison with reference not meaningful in test harness',
      )
    }
    if (value.type == 'null') {
      throw new Error('null output is not supported in the test harness')
    }
    if (value.boxed) {
      delete value.boxed
    }
    return { value }
  } catch (e) {
    return { error: (e as any).toString() }
  }
}

const suiteResults = testSuite.map((el, i) => {
  return runCase(el.code, el.env ? cloneEnv(el.env) : { local: {}, heap: {} })
})

function cloneEnv(env: JavaEnvironment): JavaEnvironment {
  return JSON.parse(JSON.stringify(env))
}

function isPass(entry: TestSuiteEntry, result: SuiteResult) {
  if (result.error) return entry.isError == true
  if (entry.isError) return false
  return (
    result.value !== undefined &&
    JSON.stringify(result.value) === JSON.stringify(entry.output)
  )
}

export function Suite() {
  const passed = suiteResults.filter((r, i) => isPass(testSuite[i], r)).length
  const core = useCore()
  return (
    <div className="mx-6 mb-32 mt-6 pb-12">
      <h1 className="text-lg mb-8">Test-Suite</h1>
      <p className="mb-6">
        Insgesamt {testSuite.length}:{' '}
        <span className="text-green-600">{passed} erfolgreich</span> /{' '}
        <span className="text-red-600">
          {testSuite.length - passed} gescheitert
        </span>
        <label className="ml-10">
          <input
            type="checkbox"
            onChange={(e) => {
              core.mutateWs((ws) => {
                ws.ui.testOnlyFail = e.target.checked
              })
            }}
          />{' '}
          nur nicht bestanden
        </label>
      </p>
      {testSuite.map((el, i) => (
        <Entry
          key={'[' + i + ']' + el.code}
          entry={el}
          result={suiteResults[i]}
          n={i}
        />
      ))}
    </div>
  )
}

function Entry({
  result,
  entry,
  n,
}: {
  result: SuiteResult
  entry: TestSuiteEntry
  n: number
}) {
  const core = useCore()
  const { error, value } = result

  const hasResult = error || value

  const outputStr = JSON.stringify(value)
  const expectedStr = JSON.stringify(entry.output)
  const isTheSame = outputStr === expectedStr

  const isFailure =
    (error && !entry.isError) || (!entry.isError && !value) || !isTheSame

  return (
    <div
      className={clsx(
        'flex justify-between border-t-2 border-pink-300',
        core.ws.ui.testOnlyFail && !isFailure && 'hidden',
      )}
    >
      <div>
        <pre className="rounded ml-3 my-3 border-2 border-pink-600 px-4 py-1">
          <span className="text-gray-400">[{n}] </span>
          {entry.code}
        </pre>{' '}
        {entry.env && (
          <div className="text-sm px-4 pb-1 text-gray-500 mb-2">
            {JSON.stringify(entry.env)}
          </div>
        )}
      </div>
      <div className="flex-column">
        {!hasResult && <div className="p-1">...</div>}
        {error && entry.isError && (
          <div className="p-1 text-green-800">
            <pre>OK, mit Fehler {error}</pre>
          </div>
        )}
        {((error && !entry.isError) || (!entry.isError && !value)) && (
          <div className="p-1 text-red-600">
            <pre>FAIL! Fehler: {error}</pre>
          </div>
        )}
        {value && (
          <div className="">
            {!isTheSame && entry.isError && (
              <div className="text-red-600 font-bold m-4">Fehler erwartet</div>
            )}
            <div
              className={clsx(
                isTheSame ? 'text-green-600' : 'text-red-600',
                'm-1',
              )}
            >
              <pre>Output: {outputStr}</pre>
            </div>
          </div>
        )}
        {!isTheSame && !entry.isError && (
          <div className="m-1">
            <pre>Expected: {expectedStr}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
