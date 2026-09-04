import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { CodeSnippet } from '../helper/CodeSnippet'
import { FaIcon } from '../helper/FaIcon'
import { navigate } from '../../lib/router/navigate'
import { useCore } from '../../lib/state/core'
import { questsData } from '../../lib/data/quests-data'
import { InputBar } from '../helper/InputBar'

export function Quest() {
  const core = useCore()
  const quest = questsData[core.ws.quest.id]
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex min-h-0">
        <div className="flex-1 bg-yellow-100 min-w-0 relative">
          <CodeSnippet />
          <a
            className="absolute top-3 left-3 bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-full flex justify-center items-center"
            href="/"
            onClick={(e) => {
              navigate(core, '/')
              e.preventDefault()
            }}
          >
            <FaIcon icon={faArrowLeft} />
          </a>
          <div className="absolute top-3.5 left-16 right-4 text-center hidden">
            <div className="text-lg">{quest.title}</div>
          </div>
        </div>
        <div className="shrink-0 w-[300px] bg-white border text-center pt-4 hidden">
          SupportArea
        </div>
      </div>
      <div className="shrink-0">
        <InputBar />
      </div>
    </div>
  )
}
