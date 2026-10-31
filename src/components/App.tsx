import { useEffect, useRef } from 'react'
import { CoreProvider, useCreateCore } from '../lib/state/core'
import { hydrate, navigate } from '../lib/router/navigate'
import { Quest } from './pages/Quest'
import { Overview } from './pages/Overview'
import { Test } from './pages/Test'
import { Suite } from './pages/Suite'
import { Consent } from './pages/Consent'
import { GroupSelect } from './pages/GroupSelect'
import { Pretest } from './pages/Pretest'
import { Posttest } from './pages/Posttest'

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
    if (core.ws.page == 'none') {
      return null
    }
    if (core.ws.page == 'quest') {
      return <Quest />
    } else if (core.ws.page == 'overview') {
      return <Overview />
    } else if (core.ws.page == 'test') {
      return <Test />
    } else if (core.ws.page == 'suite') {
      return <Suite />
    } else if (core.ws.page == 'consent') {
      return <Consent />
    } else if (core.ws.page == 'group-select') {
      return <GroupSelect />
    } else if (core.ws.page == 'pretest') {
      return <Pretest />
    } else if (core.ws.page == 'posttest') {
      return <Posttest />
    }
    return null
  }
}
