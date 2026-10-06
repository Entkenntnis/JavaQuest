import { useEffect } from 'react'
import { CodeSnippet } from '../helper/CodeSnippet'
import { useCore } from '../../lib/state/core'
import { InputBar } from '../helper/InputBar'
import { FaIcon } from '../helper/FaIcon'
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons'
import { navigate } from '../../lib/router/navigate'
import { Feedback } from '../helper/Feedback'

export function Quest() {
  const core = useCore()
  const questResult = core.ws.ui.questResult

  useEffect(() => {
    if (questResult) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [questResult])

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
        <div className="mt-6 px-2">
          <Feedback />
        </div>
        <div className="h-12"></div>
      </div>
    </div>
  )
}
