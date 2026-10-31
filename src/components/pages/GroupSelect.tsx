import { navigate } from '../../lib/router/navigate'
import { useCore } from '../../lib/state/core'
import { getStudyData, setGroup } from '../../lib/state/user-data'

export function GroupSelect() {
  const core = useCore()
  const study = getStudyData()

  const group = core.ws.study.group

  if (!group) {
    return <div>Interner Fehler</div>
  }

  // people might accidentally restart the study, guard
  if (study.consentedAt !== undefined && study.groupId) {
    return (
      <div>
        Du bist schon Teil der Gruppe {study.groupId}.{' '}
        <button
          onClick={() => {
            navigate(core, '/')
          }}
        >
          Zurück zur Startseite
        </button>
      </div>
    )
  }
  return (
    <div>
      Willkommen bei der Gruppe {core.ws.study.group}.{' '}
      <button
        onClick={() => {
          setGroup(group)
          navigate(core, '/consent')
        }}
      >
        STARTE
      </button>
    </div>
  )
}
