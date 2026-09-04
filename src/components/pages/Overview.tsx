import { questsData } from '../../lib/data/quests-data'
import { navigate } from '../../lib/router/navigate'
import { useCore } from '../../lib/state/core'

export function Overview() {
  const questsList = Object.values(questsData)
  questsList.sort((a, b) => a.id - b.id)

  const core = useCore()

  return (
    <div className="w-[600px] mx-auto bg-gray-50 pb-12">
      <h1 className="mb-6 text-xl pl-4 pt-4">JavaQuest</h1>
      {questsList.map((quest) => {
        const path = `/quest-${quest.id}`
        return (
          <div className="ml-4 my-6" key={quest.id}>
            [{quest.id}] {quest.title}{' '}
            <a
              href={path}
              className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 rounded"
              onClick={(e) => {
                e.preventDefault()
                navigate(core, path)
              }}
            >
              Öffnen
            </a>
          </div>
        )
      })}
    </div>
  )
}
