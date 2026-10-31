import { useState, type FormEvent } from 'react'
import {
  CORE_SURVEY_QUESTIONS,
  SCALE_5,
  SCALE_5_HINT,
  SCALE_5_LABELS,
  SURVEY_VERSION,
} from '../../lib/content/survey'
import { navigate } from '../../lib/router/navigate'
import { useCore } from '../../lib/state/core'
import { setPretestAt } from '../../lib/state/user-data'
import { LikertMatrix } from '../helper/SurveyFields'
import { track } from '../../lib/events/track'

function revealFirstMissing(id: string) {
  const container = document.getElementById(`question-${id}`)
  container?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  window.setTimeout(() => {
    container
      ?.querySelector<HTMLElement>('input, textarea, button')
      ?.focus({ preventScroll: true })
  }, 300)
}

export function Pretest() {
  const core = useCore()
  const [answers, setAnswers] = useState<Record<string, number | undefined>>({})
  const [showErrors, setShowErrors] = useState(false)

  const total = CORE_SURVEY_QUESTIONS.length
  const missingIds = new Set(
    CORE_SURVEY_QUESTIONS.filter(
      (question) => answers[question.id] === undefined,
    ).map((question) => question.id),
  )
  const answeredCount = total - missingIds.size
  const progress = Math.round((answeredCount / total) * 100)
  const isComplete = answeredCount === total

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (missingIds.size > 0) {
      setShowErrors(true)
      revealFirstMissing(missingIds.values().next().value as string)
      return
    }

    const completedAnswers: Record<string, number> = {}

    for (const question of CORE_SURVEY_QUESTIONS) {
      const value = answers[question.id]
      if (value === undefined) return
      completedAnswers[question.id] = value
    }

    const payload = {
      survey: 'pretest',
      version: SURVEY_VERSION,
      answers: completedAnswers,
      completedAt: Date.now(),
    }

    track('pretest_submit', payload)

    setPretestAt()
    navigate(core, '/')
  }

  return (
    <div className="h-full overflow-auto bg-green-50">
      <form
        noValidate
        onSubmit={handleSubmit}
        className="mx-auto max-w-[860px] px-3 py-5 sm:px-6 sm:py-8"
      >
        <div className="rounded-2xl border border-green-100 bg-white shadow-sm">
          <header className="px-5 pt-7 pb-6 sm:px-8 sm:pt-9 sm:pb-8">
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Anfangsumfrage
            </h1>

            <p className="mt-6 text-base leading-relaxed text-gray-600">
              In dieser Befragung geht es um deine Einschätzung zum{' '}
              <strong className="font-semibold text-gray-800">
                Programmieren allgemein
              </strong>{' '}
              und zum Umgang mit{' '}
              <strong className="font-semibold text-gray-800">
                booleschen Ausdrücken
              </strong>{' '}
              (z. B.{' '}
              <code className="whitespace-nowrap text-orange-600">
                i &gt; 0
              </code>{' '}
              oder{' '}
              <code className="whitespace-nowrap text-orange-600">
                x &gt; 5 &amp;&amp; y &lt; -10
              </code>
              ). Es gibt keine richtigen und falschen Antworten – uns
              interessiert deine persönliche Einschätzung.
            </p>
          </header>

          <section
            aria-labelledby="pretest-section"
            className="border-t border-gray-100 px-4 py-6 sm:px-8 sm:py-8"
          >
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
              <div>
                <h2
                  id="pretest-section"
                  className="text-lg font-semibold text-gray-900"
                >
                  Deine Einschätzung
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Wähle für jede Aussage die Zahl, die am besten zu dir passt.
                </p>
              </div>
              <span
                className="text-xs tabular-nums text-gray-500"
                aria-live="polite"
              >
                {answeredCount} von {total} beantwortet
              </span>
            </div>

            {showErrors && missingIds.size > 0 && (
              <div
                role="alert"
                className="mt-4 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
              >
                <span
                  className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white"
                  aria-hidden
                >
                  !
                </span>
                <span>
                  Bitte beantworte noch{' '}
                  {missingIds.size === 1
                    ? 'eine Aussage'
                    : `${missingIds.size} Aussagen`}
                  . Die fehlenden Aussagen sind rot markiert.
                </span>
              </div>
            )}

            <div className="mt-4">
              <LikertMatrix
                questions={CORE_SURVEY_QUESTIONS}
                values={answers}
                options={SCALE_5}
                scaleLabels={SCALE_5_LABELS}
                hint={SCALE_5_HINT}
                legend="Skala"
                namePrefix="pretest"
                errorIds={showErrors ? missingIds : undefined}
                onChange={(id, value) => {
                  setAnswers((current) => ({
                    ...current,
                    [id]: value,
                  }))
                }}
              />
            </div>
          </section>
        </div>

        <div className="sticky bottom-0 z-30 mt-5 rounded-2xl border border-green-100 bg-white/95 px-4 py-3 shadow-lg shadow-green-900/5 backdrop-blur sm:px-6 sm:py-4">
          <div className="flex items-center justify-between gap-4 text-xs text-gray-500">
            <span aria-live="polite">
              {answeredCount} von {total} Aussagen beantwortet
            </span>
            <span className="tabular-nums">{progress}%</span>
          </div>

          <div
            className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100"
            role="progressbar"
            aria-label="Fortschritt der Umfrage"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={answeredCount}
          >
            <div
              className="h-full rounded-full bg-green-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between gap-4">
            <p className="hidden text-xs text-gray-500 sm:block">
              {answeredCount === total
                ? 'Alles beantwortet – du kannst abschließen.'
                : 'Bitte beantworte alle Aussagen.'}
            </p>
            <button
              type="submit"
              className={`w-full rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:w-auto ${
                isComplete
                  ? 'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-600'
                  : 'bg-gray-300 text-gray-600 hover:bg-gray-400 focus-visible:ring-gray-400'
              }`}
            >
              Anfangsumfrage abschließen
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
