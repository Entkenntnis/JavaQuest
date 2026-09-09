import {
  faCircleDot,
  faSquareCaretRight,
} from '@fortawesome/free-solid-svg-icons'
import { chaptersData } from '../../lib/content/chapters-data'
import { questsData } from '../../lib/content/quests-data'
import { navigate } from '../../lib/router/navigate'
import { useCore } from '../../lib/state/core'
import { FaIcon } from '../helper/FaIcon'

export function Overview() {
  const questsList = Object.values(questsData)
  questsList.sort((a, b) => a.id - b.id)

  const core = useCore()

  return (
    <div className="h-full bg-rose-50 overflow-auto">
      <div className="max-w-[600px] mx-auto bg-white">
        <h1 className="mb-6 text-3xl pl-4 mx-4 pt-8 border-b-2 border-pink-500 pb-3">
          Java LogiQuest
        </h1>
        <p className="italic text-center mb-20">
          Entdecke die Welt der Logik hinter der Java-Programmierung
        </p>
        {chaptersData.map((chapter, i) => {
          return (
            <div key={i} className="mt-20 border-b border-gray-200 pb-6">
              <h2 className="px-4 text-2xl">
                <FaIcon icon={faCircleDot} className="text-pink-500 mr-3" />
                Kapitel {i + 1}: {chapter.title}
              </h2>
              <details className="ml-5 pl-4 mr-5 pr-2 mt-6 pb-2 pt-1 border-gray-400 border rounded-lg">
                <summary className="select-none">Beschreibung</summary>
                <div className="mt-4">{chapter.description()}</div>
              </details>
              <h3 className="px-6 mt-6 text-lg">Aufgaben</h3>
              {chapter.quests.map((q, j) => {
                const quest = questsData[q]
                return (
                  <a
                    key={j}
                    className="px-6 mt-1 flex justify-between hover:bg-gray-100 py-3 cursor-pointer select-none"
                    onClick={(e) => {
                      navigate(core, `/quest-${quest.id}`)
                      e.preventDefault()
                    }}
                  >
                    <div>
                      <span className="pl-1 pr-1.5 bg-pink-500 text-white font-bold rounded mr-3">
                        {i + 1}.{j + 1}
                      </span>
                      {quest.title}
                    </div>
                  </a>
                )
              })}
            </div>
          )
        })}
        <div className="mt-[250px] mb-[200px] text-4xl text-center">
          (̿▀̿‿ ̿▀̿ ̿)
          <br />
          <span className="text-lg italic block mt-6">Geschafft!</span>
        </div>
        <div className="pb-4 mx-4">-- Footer -- Impressum </div>
        {/*questsList.map((quest) => {
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
      })*/}
      </div>
    </div>
  )
}
