import { questsData } from '../content/quests'
import { submitEvent } from '../events/submit'
import type { Core } from '../state/core'
import { getStudyData } from '../state/user-data'

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
    submitEvent('pageview', path)
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

  if (path == '/suite') {
    core.mutateWs((ws) => {
      ws.page = 'suite'
    })
    return
  }

  if (path == '/test') {
    core.mutateWs((ws) => {
      ws.page = 'test'
    })
    return
  }

  if (
    [
      '/t0',
      '/t1',
      '/t2',
      '/t3',
      '/t4',
      '/t5',
      '/t6',
      '/t7',
      '/t8',
      '/t9',
    ].includes(path)
  ) {
    core.mutateWs((ws) => {
      ws.page = 'group-select'
      ws.study.group = path.substring(1)
    })
    return
  }

  if (path == '/consent') {
    const study = getStudyData()
    // this consent page must only be shown when group is already select
    if (!study.groupId) {
      await navigate(core, '/')
      return
    }
    // TODO: Was soll ich machen, wenn der Consent bereits erteilt wurde?
    // Hm, darüber muss ich bisschen nachdenken
    core.mutateWs((ws) => {
      ws.page = 'consent'
    })
    return
  }

  if (path == '/pretest') {
    // TODO: guard condition
    core.mutateWs((ws) => {
      ws.page = 'pretest'
    })
    return
  }

  if (path == '/posttest') {
    // TODO: guard condition
    core.mutateWs((ws) => {
      ws.page = 'posttest'
    })
    return
  }

  if (path == '/') {
    submitEvent('pageview', '/')
    core.mutateWs((ws) => {
      ws.page = 'overview'
    })
    return
  }

  // Fallback to Overview
  await navigate(core, '/')
}
