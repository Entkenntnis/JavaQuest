import { useCore } from '../../lib/state/core'

export function Feedback() {
  const core = useCore()
  const result = core.ws.ui.questResult

  if (!result) return null

  if (result.kind == 'success') {
    return <div>SUCCESS, TODO</div>
  }

  if (result.kind == 'fail') {
    return <div>FAILURE, TODO</div>
  }

  // Syntax Error
  return <div>SYNTAX ERROR, TODO</div>
}
