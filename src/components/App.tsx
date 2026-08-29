import { useEffect, useRef } from 'react'
import { CoreProvider, useCreateCore } from '../lib/state/core'
import { Debug } from './pages/Debug'
import { hydrate, navigate } from '../lib/router/navigate'

export function App() {
  const core = useCreateCore()
  const hasHydrated = useRef(false)

  useEffect(() => {
    const handlePopState = () => {
      hydrate(core)
    }

    // @ts-ignore TESTING
    window.navigate = function (url) {
      navigate(core, url)
    }

    window.addEventListener('popstate', handlePopState)

    // hydrate on mounting the app, but only once
    if (!hasHydrated.current) {
      hasHydrated.current = true
      hydrate(core)
    }

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [core])

  return (
    <CoreProvider value={core}>
      <Debug />
    </CoreProvider>
  )
}
