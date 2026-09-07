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
import { evaluate } from '../../lib/java/evaluate'
import { typecheck } from '../../lib/java/typecheck'

function runCase(code: string, env: JavaEnvironment): SuiteResult {
  try {
    const tree = parser.parse(code)
    const cst = cursorToCstNode(tree.cursor(), Text.of([code]))
    checkForParseErrors(cst)
    const ast = cst2ast(cst)
    const typed = typecheck(ast, env)
    const value = evaluate(typed, env)
    if (
      value.type == 'reference' &&
      env.heap[value.ref].class == 'java.lang.String'
    ) {
      return {
        value: { type: '__str', value: env.heap[value.ref].value },
      }
    }
    if (value.type == 'reference') {
      throw new Error(
        'comparison with reference not meaningful in test harness',
      )
    }
    return { value }
  } catch (e) {
    return { error: (e as any).toString() }
  }
}

const suiteResults = testSuite.map((el) =>
  runCase(el.code, el.env ? cloneEnv(el.env) : { local: {}, heap: {} }),
)

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
  return (
    <div className="mx-6 mb-32 mt-6 pb-12">
      <h1 className="text-lg mb-8">Test-Suite</h1>
      <p className="mb-6">
        Insgesamt {testSuite.length}:{' '}
        <span className="text-green-600">{passed} erfolgreich</span> /{' '}
        <span className="text-red-600">
          {testSuite.length - passed} gescheitert
        </span>
      </p>
      {testSuite.map((el, i) => (
        <Entry key={el.code} entry={el} result={suiteResults[i]} />
      ))}
    </div>
  )
}

function Entry({
  result,
  entry,
}: {
  result: SuiteResult
  entry: TestSuiteEntry
}) {
  const { error, value } = result

  const hasResult = error || value

  return (
    <div className="flex justify-between border-t-2 border-pink-300">
      <div>
        <pre className="rounded ml-3 my-3 border-2 border-pink-600 px-4 py-1">
          {entry.code}
        </pre>
        {entry.env && (
          <div className="text-sm px-4 pb-1">{JSON.stringify(entry.env)}</div>
        )}
      </div>
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
      {value &&
        (() => {
          const outputStr = JSON.stringify(value)
          const expectedStr = JSON.stringify(entry.output)
          const isTheSame = outputStr === expectedStr
          return (
            <div className="">
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
                <pre>Output: {outputStr}</pre>
              </div>
              {!isTheSame && !entry.isError && (
                <div className="m-1">
                  <pre>Expected: {expectedStr}</pre>
                </div>
              )}
            </div>
          )
        })()}
    </div>
  )
}
