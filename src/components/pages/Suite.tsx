import { testSuite } from '../../lib/java/test-suite'
import type {
  JavaEnvironment,
  SuiteResult,
  TestErrorPhase,
  TestHarnessError,
  TestSuiteEntry,
} from '../../lib/state/types'
import { parser } from '../../lib/java/lezer/parser'
import { Text } from '@codemirror/state'
import { cursorToCstNode } from '../../lib/java/helper/cst'
import { checkForParseErrors, cst2ast } from '../../lib/java/cst2ast'
import clsx from 'clsx'
import { evaluate } from '../../lib/java/evaluate'
import { typecheck } from '../../lib/java/typecheck'
import { useCore } from '../../lib/state/core'
import { foldConstants } from '../../lib/java/fold'

function toHarnessError(e: unknown, phase: TestErrorPhase): TestHarnessError {
  const raw = e instanceof Error ? e.message : String(e)
  const internal =
    (typeof e === 'string' && e.startsWith('Interner Systemfehler')) ||
    e instanceof TypeError ||
    e instanceof RangeError ||
    e instanceof ReferenceError ||
    e instanceof SyntaxError
  if (internal) {
    const detail = raw.replace(/^Interner Systemfehler: /, '')
    return {
      phase,
      message: `Interner Systemfehler: ${detail}`,
      internal: true,
    }
  }
  return { phase, message: raw }
}

function runCase(code: string, env: JavaEnvironment): SuiteResult {
  let typed
  try {
    const tree = parser.parse(code)
    const cst = cursorToCstNode(tree.cursor(), Text.of([code]))
    checkForParseErrors(cst)
    const ast = cst2ast(cst)
    typed = typecheck(ast, env)
  } catch (e) {
    return { error: toHarnessError(e, 'compile') }
  }
  try {
    const value = evaluate(foldConstants(typed), env)
    if (value.type == 'reference') {
      const obj = env.heap[value.ref]
      if (obj.class == 'java.lang.String') {
        return {
          value: { type: '__str', value: obj.value },
        }
      }
      // auto unboxing, like in cross check harness
      if ('isWrapper' in obj) {
        return { value: obj.value }
      }
    }
    if (value.type == 'reference') {
      throw new Error('Referenzausgabe ist im Test nicht vergleichbar')
    }
    if (value.type == 'null') {
      // A bare null result is a harness limitation, not a JVM error: tag it as an
      // internal system error so it can never be mistaken for a matching runtime error.
      throw 'Interner Systemfehler: null ist als Ausgabe nicht darstellbar'
    }
    // "auto unboxing"
    if (value.boxed) {
      delete value.boxed
    }
    return { value }
  } catch (e) {
    return { error: toHarnessError(e, 'runtime') }
  }
}

const suiteResults = testSuite.map((el) => {
  return runCase(el.code, el.env ? cloneEnv(el.env) : { local: {}, heap: {} })
})

function cloneEnv(env: JavaEnvironment): JavaEnvironment {
  return JSON.parse(JSON.stringify(env))
}

function isPass(entry: TestSuiteEntry, result: SuiteResult) {
  if (result.error) {
    if (result.error.internal) return false
    return entry.error === result.error.phase
  }
  if (entry.error) return false
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
  const pass = isPass(entry, result)

  const actual = result.error
    ? result.error.internal
      ? result.error.message
      : `Fehler [${result.error.phase}]: ${result.error.message}`
    : `Output: ${JSON.stringify(result.value)}`

  const expected = entry.error
    ? `Fehler [${entry.error}]`
    : JSON.stringify(entry.output)

  return (
    <div
      className={clsx(
        'flex justify-between border-t-2 border-pink-300',
        core.ws.ui.testOnlyFail && pass && 'hidden',
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
      <div className="flex-column p-1">
        <pre
          className={clsx(
            'm-1 whitespace-pre-wrap break-words',
            pass ? 'text-green-600' : 'text-red-600',
          )}
        >
          {actual}
        </pre>
        {!pass && (
          <pre className="m-1 whitespace-pre-wrap break-words text-gray-900">
            Erwartet: {expected}
          </pre>
        )}
      </div>
    </div>
  )
}
