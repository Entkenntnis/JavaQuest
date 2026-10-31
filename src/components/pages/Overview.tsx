import { useLayoutEffect, useRef } from 'react'
import { faJava } from '@fortawesome/free-brands-svg-icons'
import { chaptersData } from '../../lib/content/chapters-data'
import { questsData } from '../../lib/content/quests'
import { navigate } from '../../lib/router/navigate'
import { useCore } from '../../lib/state/core'
import { FaIcon } from '../helper/FaIcon'
import { ChapterDoodle } from '../helper/ChapterDoodle'
import {
  clearUserData,
  getStudyData,
  getUserData,
} from '../../lib/state/user-data'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

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

  const userData = getUserData()
  const studyData = getStudyData()
  const group = studyData.groupId

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
        <div className="mx-4 text-sm mt-28 -mb-12 border-2 border-purple-300 rounded-lg p-2">
          Die Aufgaben sind ein freiwilliges Übungsangebot und dürfen in
          beliebiger Reihenfolge bearbeitet werden. Springe zum Ende eines
          Kapitels oder probiere andere Kapitel aus, wenn du dich mit den
          Aufgaben sicher fühlst.
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
                        // if (!userData.hasPromptedConsent) {
                        //   sessionStorage.setItem(
                        //     'javaquest_continue_url',
                        //     `/quest-${quest.id}`,
                        //   )
                        //   navigate(core, '/consent')
                        // } else {
                        navigate(core, `/quest-${quest.id}`)
                        // }
                        e.preventDefault()
                      }}
                    >
                      <div>
                        <span className="pl-1 pr-1.5 bg-pink-400 text-white font-bold rounded mr-3">
                          {i + 1}.{j + 1}
                        </span>
                        {quest.title}
                        {userData.solved.includes(quest.id) && (
                          <span className="text-green-500 ml-3">
                            <FaIcon icon={faCheck} />
                          </span>
                        )}
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>
          )
        })}
        {studyData.pretestAt !== undefined &&
          studyData.posttestAt === undefined && (
            <div className="mx-6 mt-20 rounded-lg border border-pink-200 bg-rose-50 px-5 py-4 text-center">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Du bist fertig?</span>{' '}
                <button
                  className="font-medium text-pink-600 underline hover:text-pink-700"
                  onClick={() => navigate(core, '/posttest')}
                >
                  An der Abschlussumfrage teilnehmen
                </button>
              </p>
            </div>
          )}
        <div className="mt-[250px] mb-[200px] text-4xl text-center">
          (̿▀̿‿ ̿▀̿ ̿)
          <br />
          <span className="text-lg italic block mt-6">Geschafft!</span>
        </div>
        <div className="pb-4 mx-4 flex justify-between text-sm">
          <a
            href="https://hack.arrrg.de/contact"
            target="_blank"
            className="hover:underline"
          >
            Kontakt / Impressum
          </a>
          <span>
            {group && (
              <span className="mr-4 text-gray-600">[Gruppe {group}]</span>
            )}
            <button
              className="hover:underline hover:text-red-500"
              onClick={() => {
                const res = confirm('Fortschritt unwiderruflich zurücksetzen?')
                if (res) {
                  clearUserData()
                  sessionStorage.setItem(OVERVIEW_SCROLL_KEY, '0')
                  window.location.reload()
                }
              }}
            >
              Fortschritt zurücksetzen
            </button>
          </span>
        </div>
      </div>
    </div>
  )
}
