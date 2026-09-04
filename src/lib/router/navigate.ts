import { questsData } from '../data/questsData'
import type { Core } from '../state/core'

export async function navigate(core: Core, url: string) {
  history.pushState(null, '', url)

  // push state is not triggering hash change event, so hydrate manually
  await hydrate(core)
}

export async function hydrate(core: Core) {
  let hash = window.location.hash
  const path = window.location.pathname
  const parameterList = new URLSearchParams(window.location.search)

  console.log(`-> hydrate path:${path}, hash:${hash}, search:${parameterList}`)

  core.reset()

  if (path.startsWith('/quest-')) {
    const id = parseInt(path.substring(7))
    const data = questsData[id]
    if (data) {
      core.mutateWs((ws) => {
        ws.page = 'quest'
        ws.quest.id = id
      })
      return
    }
  }

  if (path.startsWith('/test')) {
    core.mutateWs((ws) => {
      ws.page = 'test'
    })
    return
  }

  // Fallback to Overview

  core.mutateWs((ws) => {
    ws.page = 'overview'
  })
}
