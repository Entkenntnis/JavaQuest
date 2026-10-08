import { useLayoutEffect, useRef } from 'react'
import { faCircleDot } from '@fortawesome/free-solid-svg-icons'
import { faJava } from '@fortawesome/free-brands-svg-icons'
import { chaptersData } from '../../lib/content/chapters-data'
import { questsData } from '../../lib/content/quests'
import { navigate } from '../../lib/router/navigate'
import { useCore } from '../../lib/state/core'
import { FaIcon } from '../helper/FaIcon'

const OVERVIEW_SCROLL_KEY = 'jq:overview-scroll'

export function Overview() {
  const questsList = Object.values(questsData)
  questsList.sort((a, b) => a.id - b.id)

  const core = useCore()
  const scrollRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const div = scrollRef.current
    if (!div) return
    const saved = sessionStorage.getItem(OVERVIEW_SCROLL_KEY)
    if (saved) {
      const max = div.scrollHeight - div.clientHeight
      div.scrollTop = Math.max(0, Math.min(Number(saved), max))
    }
  }, [])

  return (
    <div
      ref={scrollRef}
      className="h-full bg-rose-50 overflow-auto"
      onScroll={(e) =>
        sessionStorage.setItem(
          OVERVIEW_SCROLL_KEY,
          String(e.currentTarget.scrollTop),
        )
      }
    >
      <div className="max-w-[600px] mx-auto bg-white relative">
        <div className="absolute right-5 top-4">
          <FaIcon icon={faJava} className="text-[50px] text-pink-700" />
        </div>
        <h1 className="mb-6 text-3xl pl-4 mx-4 pt-8 border-b-2 border-pink-500 pb-3">
          JavaQuest "Alles Logisch"
        </h1>
        <p className="italic text-center mb-20">
          Lerne boolesche Ausdrücke und ihre Anwendung kennen.
        </p>
        {chaptersData.map((chapter, i) => {
          return (
            <div key={i} className="mt-28 border-b border-gray-200 pb-6">
              <h2 className="px-4 text-2xl">
                <FaIcon icon={faCircleDot} className="text-pink-500 mr-3" />
                <span className="text-gray-500">Kapitel {i + 1}:</span>{' '}
                {chapter.title}
              </h2>
              <div
                className="
                  ml-5 px-4 mr-5 mt-6 mb-4 pb-2 border-gray-400
                  border rounded-lg [&>p]:mt-2
                  [&_code]:text-orange-600
                  [&_code]:whitespace-nowrap
                  [&_a]:text-blue-500 [&_a]:hover:underline
                "
              >
                {chapter.description()}
              </div>
              <h3 className="px-6 mt-6 text-lg hidden">Aufgaben</h3>
              {chapter.quests.map((q, j) => {
                const quest = questsData[q]
                return (
                  <a
                    key={j}
                    className="px-6 mt-1 flex justify-between hover:bg-gray-100 py-2 cursor-pointer select-none"
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
        <div className="pb-4 mx-4">Impressum</div>
      </div>
    </div>
  )
}
