import { Text } from '@codemirror/state'
import { questsData } from '../content/quests-data'
import { cursorToCstNode } from '../java/helper/cst'
import { parser } from '../java/lezer/parser'
import type { Core } from '../state/core'
import { checkForParseErrors, cst2ast } from '../java/cst2ast'
import { typecheck } from '../java/typecheck'
import type { JavaEnvironment } from '../state/types'
import { evaluate } from '../java/evaluate'
import { foldConstants } from '../java/fold'

export function check(core: Core) {
  const quest = questsData[core.ws.quest.id]
  core.mutateWs((ws) => {
    ws.ui.questOutput = ''
  })

  function println(line: string) {
    core.mutateWs((ws) => {
      ws.ui.questOutput += line + '\n'
    })
  }

  function evalSnippet(snippet: string, env: JavaEnvironment) {
    const tree = parser.parse(snippet)
    const cst = cursorToCstNode(tree.cursor(), Text.of([snippet]))
    checkForParseErrors(cst)
    const ast = cst2ast(cst)
    const typed = typecheck(ast, env)
    return evaluate(foldConstants(typed), env)
  }

  function runTestcase(el: any, snippet: string) {
    let output
    try {
      output = quest.checker.driver(el, (env) => {
        const value = evalSnippet(snippet, env)
        if (value.type != 'boolean') {
          throw `Wert vom Typ "${value.type}" erhalten, erwarte booleschen Ausdruck.`
        }
        return value.value
      })
    } catch (e) {
      output = e instanceof Error ? e.message : String(e)
    }
    return output
  }

  println(
    `Überprüfe ${quest.checker.data.length} Testfälle für die Eingabe \`${core.ws.ui.questInput}\` ...`,
  )
  const list = quest.checker.data.slice()
  list.sort(() => (Math.random() >= 0.5 ? 1 : -1))

  for (const el of list) {
    const refOutput = runTestcase(el, quest.checker.reference)
    const testOutput = runTestcase(el, core.ws.ui.questInput)
    // println(refOutput)
    // println(testOutput)
    if (refOutput != testOutput) {
      println(`Testeingabe: ${el}`)
      println(`IST: ${testOutput}`)
      println(`SOLL: ${refOutput}`)
      println('> Leider nicht richtig.')
      core.mutateWs((ws) => {
        ws.ui.questState = 'fail'
      })
      return
    }
  }
  println('ERFOLG')
  core.mutateWs((ws) => {
    ws.ui.questState = 'success'
  })
}
