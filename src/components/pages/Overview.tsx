import { questsData } from '../../lib/data/questsData'
import { navigate } from '../../lib/router/navigate'
import { useCore } from '../../lib/state/core'

export function Overview() {
  const questsList = Object.values(questsData)
  questsList.sort((a, b) => a.id - b.id)

  const core = useCore()

  return (
    <div className="">
      <h1 className="mb-6 text-xl ml-4 mt-4">JavaQuest</h1>
      {questsList.map((quest) => {
        const path = `/quest-${quest.id}`
        return (
          <div className="ml-4 my-6">
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
