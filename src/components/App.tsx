import { CoreProvider, useCreateCore } from '../lib/state/core'

export function App() {
  const core = useCreateCore()
  return (
    <CoreProvider value={core}>
      <div className="text-xl">This is the main app interface.</div>
    </CoreProvider>
  )
}
