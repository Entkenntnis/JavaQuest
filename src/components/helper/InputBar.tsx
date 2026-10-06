import { useCore } from '../../lib/state/core'
import { check } from '../../lib/quest/check'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import { FaIcon } from './FaIcon'

export function InputBar() {
  const core = useCore()
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        check(core)
      }}
    >
      <div className="text-lg px-3 py-2.5 flex justify-between items-center">
        <div className="mt-4 text-sm sm:text-base">
          Fülle die Lücke mit einem passenden Ausdruck:
        </div>
      </div>
      <div className="flex items-center bg-white py-3">
        <div className="flex-1 pl-3">
          <input
            className="w-full h-[50px] text-lg text-center p-3 font-mono border-pink-500 border-2 outline-none rounded"
            value={core.ws.ui.questInput}
            onChange={(e) => {
              core.mutateWs((ws) => {
                ws.ui.questInput = e.target.value
                ws.ui.questState = undefined
              })
            }}
            maxLength={1024}
            autoFocus
          ></input>
        </div>
        <button
          className="h-[40px] ml-2 text-xl bg-pink-500 hover:bg-pink-700 px-3 py-0.5 rounded-lg text-white transition-colors"
          onClick={() => {
            check(core)
          }}
          type="submit"
        >
          <FaIcon icon={faCheckCircle} />
        </button>
      </div>
    </form>
  )
}
