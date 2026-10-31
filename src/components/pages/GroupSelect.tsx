import { navigate } from '../../lib/router/navigate'
import { useCore } from '../../lib/state/core'
import { getStudyData, setGroup } from '../../lib/state/user-data'

const GROUPS: Record<string, string> = {
  t0: 'Test-Gruppe',
  t1: 'Mo 10–12 (F.)',
  t2: 'Mo 12–14 (L.)',
  t3: 'Mo 12–14 (F.)',
  t4: 'Mo 14–16 (Q.)',
  t5: 'Mo 14–16 (F.)',
  t6: 'Mo 16–18 (Q.)',
  t7: 'Di 10–12 (C.)',
  t8: 'Ersatz',
  t9: 'Ersatz',
}

const buttonClass =
  'mt-6 w-full rounded-lg bg-pink-500 px-4 py-2.5 font-medium text-white transition-colors hover:bg-pink-600'

export function GroupSelect() {
  const core = useCore()
  const study = getStudyData()

  const group = core.ws.study.group

  if (!group) {
    return <div>Interner Fehler</div>
  }

  const groupTitle = GROUPS[group] ?? group

  // people might accidentally restart the study, guard
  if (study.consentedAt !== undefined && study.groupId) {
    const title = GROUPS[study.groupId] ?? study.groupId

    return (
      <div className="h-full overflow-auto bg-rose-50">
        <div className="mx-auto min-h-full max-w-[600px] bg-white p-6">
          <div className="text-sm text-gray-500">Studie</div>
          <h1 className="mt-1 text-2xl font-bold">Deine Gruppe</h1>

          <div className="mt-6 rounded-lg border border-pink-200 bg-rose-50 p-4">
            <div className="text-sm text-gray-500">Gruppe</div>
            <div className="mt-1 text-lg font-medium">
              {study.groupId} · {title}
            </div>
          </div>

          <p className="mt-4 text-gray-700">Du hast bereits eingewilligt.</p>

          <button
            className={buttonClass}
            onClick={() => {
              navigate(core, '/')
            }}
          >
            Zur Startseite
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto bg-rose-50">
      <div className="mx-auto min-h-full max-w-[600px] bg-white p-6">
        <div className="text-sm text-gray-500">Studie</div>
        <h1 className="mt-1 text-2xl font-bold">Willkommen</h1>

        <p className="mt-4 text-gray-700">
          Bitte prüfe, ob du in der richtigen Gruppe bist.
        </p>

        <div className="mt-6 rounded-lg border border-pink-200 bg-rose-50 p-4">
          <div className="text-sm text-gray-500">Deine Gruppe</div>
          <div className="mt-1 text-lg font-medium">
            {group} · {groupTitle}
          </div>
        </div>

        <button
          className={buttonClass}
          onClick={() => {
            setGroup(group)
            navigate(core, '/consent')
          }}
        >
          Das ist meine Gruppe – weiter
        </button>
      </div>
      )
    </div>
  )
}
