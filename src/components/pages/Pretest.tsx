import { navigate } from '../../lib/router/navigate'
import { useCore } from '../../lib/state/core'
import { setPretestAt } from '../../lib/state/user-data'

export function Pretest() {
  const core = useCore()
  return (
    <div>
      This is the pretest page placeholder
      <button
        onClick={() => {
          setPretestAt()
          navigate(core, '/')
        }}
      >
        Done
      </button>
    </div>
  )
}
