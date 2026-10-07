import { Text } from '@codemirror/state'
import { questsData } from '../content/quests-data'
import { cursorToCstNode } from '../java/helper/cst'
import { parser } from '../java/lezer/parser'
import type { Core } from '../state/core'
import { checkForParseErrors, cst2ast } from '../java/cst2ast'
import { typecheck } from '../java/typecheck'
import type { JavaEnvironment, QuestResult, RunResult } from '../state/types'
import { evaluate } from '../java/evaluate'
import { foldConstants } from '../java/fold'
import { printType, toDisplayType } from '../java/helper/typing'

export function check(core: Core) {
  core.mutateWs((ws) => {
    ws.ui.questResult = undefined
  })

  const quest = questsData[core.ws.quest.id]
  const expression = core.ws.ui.questInput

  function evalSnippet(snippet: string, env: JavaEnvironment) {
    const tree = parser.parse(snippet)
    const cst = cursorToCstNode(tree.cursor(), Text.of([snippet]))
    checkForParseErrors(cst)
    const ast = cst2ast(cst)
    const typed = typecheck(ast, env)
    return evaluate(foldConstants(typed), env)
  }

  function runTestcase(el: any, snippet: string): RunResult {
    try {
      const output = quest.checker.driver(el, (env) => {
        const value = evalSnippet(snippet, env)
        if (value.type != 'boolean') {
          throw `Inkompatible Typen: ${printType(toDisplayType(value, env))} kann nicht in boolean konvertiert werden`
        }
        return value.value
      })
      return { ok: true, output }
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : String(e) }
    }
  }

  const list = quest.checker.data

  if (list.length == 0) {
    alert('Checker noch nicht implementiert')
  }

  let passed = 0
  const failures: QuestResult['failure'][] = []
  let errorMessage: string | undefined

  for (const el of list) {
    const reference = runTestcase(el, quest.checker.reference)
    const test = runTestcase(el, expression)

    if (!test.ok) {
      errorMessage = test.error
      break
    }

    const refOutput = reference.ok ? reference.output : reference.error
    if (refOutput != test.output) {
      failures.push({
        expected: refOutput,
        actual: test.output,
        args: (Array.isArray(el) ? el : [el])
          .map((value, i) => {
            return `${quest.checker.params?.[i] ?? 'arg' + i} = ${value}`
          })
          .join(', '),
      })
      continue
    }
    passed++
  }

  core.mutateWs((ws) => {
    if (errorMessage != undefined) {
      ws.ui.questResult = {
        kind: 'error',
        expression,
        total: list.length,
        passed,
        message: errorMessage,
      }
    } else if (failures.length > 0) {
      ws.ui.questResult = {
        kind: 'fail',
        expression,
        total: list.length,
        passed,
        failure: failures[Math.floor(Math.random() * failures.length)],
      }
    } else {
      ws.ui.questResult = {
        kind: 'success',
        expression,
        total: list.length,
        passed,
      }
    }
  })
}
