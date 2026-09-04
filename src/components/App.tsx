import { useEffect, useRef } from 'react'
import { CoreProvider, useCreateCore } from '../lib/state/core'
import { hydrate, navigate } from '../lib/router/navigate'
import { Quest } from './pages/Quest'
import { Overview } from './pages/Overview'
import { Test } from './pages/Test'

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

  return <CoreProvider value={core}>{renderPage()}</CoreProvider>

  function renderPage() {
    if (core.ws.page == 'quest') {
      return <Quest />
    } else if (core.ws.page == 'overview') {
      return <Overview />
    } else if (core.ws.page == 'test') {
      return <Test />
    }
    return null
  }
}
