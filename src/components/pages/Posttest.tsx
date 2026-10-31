import { navigate } from '../../lib/router/navigate'
import { useCore } from '../../lib/state/core'
import { setPosttestAt } from '../../lib/state/user-data'

export function Posttest() {
  const core = useCore()
  return (
    <div>
      This is the post test placeholder page{' '}
      <button
        onClick={() => {
          setPosttestAt()
          navigate(core, '/')
        }}
      >
        Done
      </button>
    </div>
  )
}
