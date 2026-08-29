import { useCore } from '../../lib/state/core'

export function Debug() {
  const core = useCore()
  return <div className="text-xl">DEBUG!!! {core.ws.ui.debugTest}</div>
}
