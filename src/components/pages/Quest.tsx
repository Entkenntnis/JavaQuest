import { CodeSnippet } from '../helper/CodeSnippet'
import { useCore } from '../../lib/state/core'
import { questsData } from '../../lib/content/quests-data'
import { InputBar } from '../helper/InputBar'

export function Quest() {
  const core = useCore()
  const quest = questsData[core.ws.quest.id]
  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0">
        <InputBar />
      </div>
      <div className="flex-1 flex min-h-0">
        <div className="flex-1 bg-white min-w-0 relative">
          <CodeSnippet />
          <div className="absolute top-3.5 left-16 right-4 text-center hidden">
            <div className="text-lg">{quest.title}</div>
          </div>
        </div>
      </div>

      <div className="shrink-0 h-[150px] bg-gray-500   p-2">
        <pre
          className="w-full h-full bg-gray-200 rounded overflow-auto px-2"
          id="quest-output"
        >
          {core.ws.ui.questOutput}
        </pre>
      </div>
    </div>
  )
}
