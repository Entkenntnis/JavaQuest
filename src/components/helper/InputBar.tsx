import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { navigate } from '../../lib/router/navigate'
import { useCore } from '../../lib/state/core'
import { FaIcon } from './FaIcon'
import { check } from '../../lib/quest/check'

export function InputBar() {
  const core = useCore()
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        check(core)
      }}
    >
      <div className="text-lg px-3 py-2.5 bg-gray-100 flex justify-between items-center gap-4">
        <a
          className=" bg-gray-300 hover:bg-gray-400 w-9 h-9 rounded-full flex justify-center items-center"
          href="/"
          onClick={(e) => {
            navigate(core, '/')
            e.preventDefault()
          }}
        >
          <FaIcon icon={faArrowLeft} />
        </a>
        <div className="">
          Vervollständige die Lücke mit einem passenden Ausdruck.
        </div>
        <button
          className="text-xl bg-pink-500 hover:bg-pink-700 px-4 py-0.5 rounded-lg text-white transition-colors"
          onClick={() => {
            check(core)
          }}
          type="submit"
        >
          Prüfen
        </button>
      </div>
      <div className="flex items-center bg-white py-3">
        <div className="flex-1 mt-3 pl-3 mb-3">
          <input
            className="w-full h-[50px] text-xl text-center p-3 font-mono border-pink-500 border-2 outline-none rounded"
            value={core.ws.ui.questInput}
            onChange={(e) => {
              core.mutateWs((ws) => {
                ws.ui.questInput = e.target.value
              })
            }}
            maxLength={1024}
            autoFocus
          ></input>
        </div>
        <div className="m-3 shrink-0 text-lg pb-1">
          <span className="mr-3">→</span>
          <span className="px-6 bg-indigo-100 italic border-2 border-indigo-300 rounded font-mono">
            ???
          </span>
        </div>
      </div>
    </form>
  )
}
