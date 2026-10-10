import { useLayoutEffect, useRef } from 'react'
import { faJava } from '@fortawesome/free-brands-svg-icons'
import { chaptersData } from '../../lib/content/chapters-data'
import { questsData } from '../../lib/content/quests'
import { navigate } from '../../lib/router/navigate'
import { useCore } from '../../lib/state/core'
import { FaIcon } from '../helper/FaIcon'
import { ChapterDoodle } from '../helper/ChapterDoodle'

const OVERVIEW_SCROLL_KEY = 'jq:overview-scroll'

export function Overview() {
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
        <div className="text-center mb-20 px-6">
          <p className="inline-block italic text-lg text-gray-700 bg-rose-50 border-2 border-dashed border-pink-200 rounded-3xl px-6 py-3 -rotate-1 shadow-sm">
            Lernen wir gemeinsam, Ausdruck-für-Ausdruck! ♡
          </p>
        </div>
        {chaptersData.map((chapter, i) => {
          return (
            <div key={i} className="mt-28">
              <h2 className="sticky top-0 z-10 bg-white px-4 py-2 text-2xl border-b border-gray-100">
                <ChapterDoodle
                  index={i}
                  className="inline-block h-[1.05em] w-[1.05em] mr-3 align-[-0.18em] text-pink-600"
                />
                <span className="text-gray-500">Kapitel {i + 1}:</span>{' '}
                {chapter.title}
              </h2>
              <div className="border-b border-gray-200 pb-6">
                <div
                  className="
                    ml-5 px-4 mr-5 mt-6 mb-4 pb-2 border-gray-400
                    border rounded-lg [&>p]:mt-2
                    [&_code]:text-orange-600
                    [&_code]:whitespace-nowrap
                    [&_a]:text-blue-500 hover:[&_a]:underline
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
                      href={`/quest-${quest.id}`}
                      onClick={(e) => {
                        navigate(core, `/quest-${quest.id}`)
                        e.preventDefault()
                      }}
                    >
                      <div>
                        <span className="pl-1 pr-1.5 bg-pink-400 text-white font-bold rounded mr-3">
                          {i + 1}.{j + 1}
                        </span>
                        {quest.title}
                      </div>
                    </a>
                  )
                })}
              </div>
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
