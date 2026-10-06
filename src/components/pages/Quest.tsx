import { CodeSnippet } from '../helper/CodeSnippet'
import { useCore } from '../../lib/state/core'
import { InputBar } from '../helper/InputBar'
import { FaIcon } from '../helper/FaIcon'
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons'
import { navigate } from '../../lib/router/navigate'

export function Quest() {
  const core = useCore()

  return (
    <div className="pt-4">
      <div className="max-w-[600px] px-2 mx-auto sticky top-1 z-10 pointer-events-none">
        <a
          className="px-2 py-0.5 bg-gray-200 rounded-xl hover:bg-gray-300 cursor-pointer pointer-events-auto"
          onClick={(e) => {
            navigate(core, '/')
            e.preventDefault()
          }}
        >
          <FaIcon icon={faArrowLeftLong} className="mr-3" />
          zurück
        </a>
      </div>
      <div className="mx-auto mt-8 px-2">
        <CodeSnippet />
      </div>
      <div className="mx-auto max-w-[600px] pr-2">
        <InputBar />
      </div>
    </div>
  )
  // return (
  //   <div className="flex flex-col h-full">
  //     <div className="shrink-0">
  //       <InputBar />
  //     </div>
  //     <div className="flex-1 flex min-h-0">
  //       <div className="flex-1 bg-white min-w-0 relative">
  //         <CodeSnippet />
  //         <div className="absolute top-3.5 left-16 right-4 text-center hidden">
  //           <div className="text-lg">{quest.title}</div>
  //         </div>
  //       </div>
  //     </div>

  //     <div
  //       className={clsx(
  //         'shrink-0 h-[150px] p-2',
  //         core.ws.ui.questState === undefined && 'bg-gray-500',
  //         core.ws.ui.questState === 'success' && 'bg-green-500',
  //         core.ws.ui.questState === 'fail' && 'bg-red-500',
  //       )}
  //     >
  //       <pre
  //         className="w-full h-full bg-gray-200 rounded overflow-auto px-2"
  //         id="quest-output"
  //       >
  //         {core.ws.ui.questOutput}
  //       </pre>
  //     </div>
  //   </div>
  // )
}
