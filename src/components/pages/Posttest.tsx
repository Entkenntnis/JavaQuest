import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
  CORE_SURVEY_QUESTIONS,
  EXPERIENCE_LABELS,
  SCALE_5,
  SCALE_5_HINT,
  SCALE_5_LABELS,
  SCALE_7,
  SCALE_7_HINT,
  SCALE_7_LABELS,
  SURVEY_VERSION,
} from '../../lib/content/survey'
import { navigate } from '../../lib/router/navigate'
import { useCore } from '../../lib/state/core'
import { setPosttestAt } from '../../lib/state/user-data'
import {
  ChoiceGroup,
  LikertMatrix,
  SurveyTextarea,
} from '../helper/SurveyFields'
import { OVERVIEW_SCROLL_KEY } from './Overview'
import { track } from '../../lib/events/track'

interface ExtraAnswers {
  gender?: string
  priorProgramming?: string
  programmingExperience?: number
  appEnjoyment?: number
  appDistracted?: number
  appFun?: number
  appFrustration?: number
  understandingMoment?: string
  positives?: string
  negatives?: string
  comments?: string
}

type NumericAnswerKey =
  | 'programmingExperience'
  | 'appEnjoyment'
  | 'appDistracted'
  | 'appFun'
  | 'appFrustration'

const GENDERS = ['weiblich', 'männlich', 'divers', 'keine Angabe'] as const
const YES_NO = ['Ja', 'Nein'] as const

const EXPERIENCE_QUESTION = {
  id: 'programmingExperience',
  text: 'Wie gut schätzt du deine Programmiererfahrung insgesamt ein?',
}

const APP_QUESTIONS: { id: NumericAnswerKey; text: string }[] = [
  {
    id: 'appEnjoyment',
    text: 'Die Arbeit mit der App hat mir sehr viel Freude bereitet.',
  },
  {
    id: 'appDistracted',
    text: 'Während der Arbeit mit der App war ich oft mit meinen Gedanken woanders.',
  },
  {
    id: 'appFun',
    text: 'Die Arbeit mit der App hat Spaß gemacht.',
  },
  {
    id: 'appFrustration',
    text: 'Ich habe mich bei der Arbeit mit der App oft frustriert gefühlt, weil ich nicht weiterkam.',
  },
]

const TOTAL_REQUIRED = CORE_SURVEY_QUESTIONS.length + 9

function revealFirstMissing(id: string) {
  const container = document.getElementById(`question-${id}`)
  container?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  window.setTimeout(() => {
    container
      ?.querySelector<HTMLElement>('input, textarea, button')
      ?.focus({ preventScroll: true })
  }, 300)
}

export function Posttest() {
  const core = useCore()
  const pageRef = useRef<HTMLDivElement>(null)
  const [answers, setAnswers] = useState<Record<string, number | undefined>>({})
  const [extraAnswers, setExtraAnswers] = useState<ExtraAnswers>({})
  const [showErrors, setShowErrors] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const missingIds = new Set<string>()

  for (const question of CORE_SURVEY_QUESTIONS) {
    if (answers[question.id] === undefined) missingIds.add(question.id)
  }
  if (extraAnswers.gender === undefined) missingIds.add('gender')
  if (extraAnswers.priorProgramming === undefined) {
    missingIds.add('priorProgramming')
  }
  if (extraAnswers.programmingExperience === undefined) {
    missingIds.add('programmingExperience')
  }
  for (const question of APP_QUESTIONS) {
    if (extraAnswers[question.id] === undefined) missingIds.add(question.id)
  }
  if (!extraAnswers.positives?.trim()) missingIds.add('positives')
  if (!extraAnswers.negatives?.trim()) missingIds.add('negatives')

  const answeredRequired = TOTAL_REQUIRED - missingIds.size
  const progress = Math.round((answeredRequired / TOTAL_REQUIRED) * 100)
  const isComplete = answeredRequired === TOTAL_REQUIRED

  const appValues: Record<string, number | undefined> = {
    appEnjoyment: extraAnswers.appEnjoyment,
    appDistracted: extraAnswers.appDistracted,
    appFun: extraAnswers.appFun,
    appFrustration: extraAnswers.appFrustration,
  }

  useEffect(() => {
    if (submitted) {
      pageRef.current?.scrollTo({ top: 0 })
    }
  }, [submitted])

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
      survey: 'posttest',
      version: SURVEY_VERSION,
      coreAnswers: completedAnswers,
      additionalAnswers: {
        ...extraAnswers,
        understandingMoment:
          extraAnswers.understandingMoment?.trim() || undefined,
        positives: extraAnswers.positives?.trim() || undefined,
        negatives: extraAnswers.negatives?.trim() || undefined,
        comments: extraAnswers.comments?.trim() || undefined,
      },
      completedAt: Date.now(),
    }

    track('posttest_submit', payload)

    setPosttestAt()
    setSubmitted(true)
  }

  function updateExtra<K extends keyof ExtraAnswers>(
    key: K,
    value: ExtraAnswers[K],
  ) {
    setExtraAnswers((current) => ({
      ...current,
      [key]: value,
    }))
  }

  function updateNumber(key: NumericAnswerKey, value: number) {
    setExtraAnswers((current) => ({
      ...current,
      [key]: value,
    }))
  }

  if (submitted) {
    return (
      <div ref={pageRef} className="h-full overflow-auto bg-green-50">
        <div className="mx-auto max-w-[640px] px-4 py-10 sm:py-16">
          <div className="rounded-2xl border border-green-100 bg-white px-6 py-10 text-center shadow-sm sm:px-10">
            <div
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-700"
              aria-hidden
            >
              ✓
            </div>
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Vielen Dank!
            </h1>
            <p className="mx-auto mt-3 max-w-[42ch] text-base leading-relaxed text-gray-600">
              Deine Antworten wurden gespeichert. Du kannst JavaQuest jetzt zum
              persönlichen Üben unbegrenzt weiter nutzen.
            </p>
            <button
              className="mt-8 rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 focus-visible:outline-none"
              onClick={() => {
                sessionStorage.setItem(OVERVIEW_SCROLL_KEY, '0')
                navigate(core, '/')
              }}
            >
              Zur Startseite
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={pageRef} className="h-full overflow-auto bg-green-50">
      <form
        noValidate
        onSubmit={handleSubmit}
        className="mx-auto max-w-[860px] px-3 py-5 sm:px-6 sm:py-8"
      >
        <div className="rounded-2xl border border-green-100 bg-white shadow-sm">
          <header className="px-5 pt-7 pb-6 sm:px-8 sm:pt-9 sm:pb-8">
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Abschlussumfrage
            </h1>

            <p className="mt-6 text-base leading-relaxed text-gray-600">
              Bitte beantworte die folgenden Fragen zu deiner Einschätzung und
              zur Arbeit mit JavaQuest. Es gibt keine richtigen oder falschen
              Antworten.
            </p>
          </header>

          {showErrors && missingIds.size > 0 && (
            <div
              role="alert"
              className="flex items-start gap-2.5 border-t border-red-100 bg-red-50 px-5 py-3 text-sm text-red-700 sm:px-8"
            >
              <span
                className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white"
                aria-hidden
              >
                !
              </span>
              <span>
                Bitte fülle noch{' '}
                {missingIds.size === 1
                  ? 'ein Pflichtfeld'
                  : `${missingIds.size} Pflichtfelder`}{' '}
                aus. Die fehlenden Stellen sind rot markiert.
              </span>
            </div>
          )}

          <section
            aria-labelledby="posttest-core"
            className="border-t border-gray-100 px-4 py-6 sm:px-8 sm:py-8"
          >
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
              <div>
                <h2
                  id="posttest-core"
                  className="text-lg font-semibold text-gray-900"
                >
                  Einschätzung zu booleschen Ausdrücken
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Wähle für jede Aussage die Zahl, die am besten zu dir passt.
                </p>
              </div>
              <span className="text-xs tabular-nums text-gray-500">
                5-stufige Skala
              </span>
            </div>

            <div className="mt-4">
              <LikertMatrix
                questions={CORE_SURVEY_QUESTIONS}
                values={answers}
                options={SCALE_5}
                scaleLabels={SCALE_5_LABELS}
                hint={SCALE_5_HINT}
                legend="Skala"
                namePrefix="posttest-core"
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

          <section
            aria-labelledby="posttest-about"
            className="border-t border-gray-100 px-4 py-6 sm:px-8 sm:py-8"
          >
            <h2
              id="posttest-about"
              className="text-lg font-semibold text-gray-900"
            >
              Über dich
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Diese Angaben helfen, die Ergebnisse einzuordnen.
            </p>

            <div className="mt-5 space-y-6">
              <ChoiceGroup
                id="gender"
                legend="Was ist dein Geschlecht?"
                options={GENDERS}
                value={extraAnswers.gender}
                columns="four"
                error={showErrors && missingIds.has('gender')}
                onChange={(value) => updateExtra('gender', value)}
              />

              <ChoiceGroup
                id="priorProgramming"
                legend="Hast du vor dieser Veranstaltung bereits Programmiererfahrung gesammelt?"
                options={YES_NO}
                value={extraAnswers.priorProgramming}
                error={showErrors && missingIds.has('priorProgramming')}
                onChange={(value) => updateExtra('priorProgramming', value)}
              />

              <LikertMatrix
                questions={[EXPERIENCE_QUESTION]}
                values={{
                  programmingExperience: extraAnswers.programmingExperience,
                }}
                options={SCALE_5}
                scaleLabels={EXPERIENCE_LABELS}
                hint="1 = sehr gering · 5 = sehr hoch"
                legend="Selbsteinschätzung"
                namePrefix="posttest-about"
                errorIds={showErrors ? missingIds : undefined}
                onChange={(id, value) =>
                  updateNumber(id as NumericAnswerKey, value)
                }
              />
            </div>
          </section>

          <section
            aria-labelledby="posttest-app"
            className="border-t border-gray-100 px-4 py-6 sm:px-8 sm:py-8"
          >
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
              <div>
                <h2
                  id="posttest-app"
                  className="text-lg font-semibold text-gray-900"
                >
                  Arbeit mit der App
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Bezieht sich auf deine Erfahrung mit JavaQuest.
                </p>
              </div>
              <span className="text-xs tabular-nums text-gray-500">
                7-stufige Skala
              </span>
            </div>

            <div className="mt-4">
              <LikertMatrix
                questions={APP_QUESTIONS}
                values={appValues}
                options={SCALE_7}
                scaleLabels={SCALE_7_LABELS}
                hint={SCALE_7_HINT}
                legend="Skala"
                namePrefix="posttest-app"
                errorIds={showErrors ? missingIds : undefined}
                onChange={(id, value) =>
                  updateNumber(id as NumericAnswerKey, value)
                }
              />
            </div>
          </section>

          <section
            aria-labelledby="posttest-open"
            className="border-t border-gray-100 px-4 py-6 sm:px-8 sm:py-8"
          >
            <h2
              id="posttest-open"
              className="text-lg font-semibold text-gray-900"
            >
              Offene Fragen
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Hier ist Platz für deine persönliche Rückmeldung.
            </p>

            <div className="mt-5 space-y-6">
              <SurveyTextarea
                id="understandingMoment"
                label="Gab es einen Moment, in dem du dachtest: „Jetzt habe ich es verstanden“?"
                hint="Beschreibe kurz die Situation und was dir geholfen hat."
                value={extraAnswers.understandingMoment ?? ''}
                onChange={(value) => updateExtra('understandingMoment', value)}
              />

              <SurveyTextarea
                id="positives"
                label="Nenne zwei Dinge, die dir an der App positiv aufgefallen sind."
                hint="Zum Beispiel: Was hat dir beim Lernen geholfen?"
                required
                value={extraAnswers.positives ?? ''}
                error={showErrors && missingIds.has('positives')}
                onChange={(value) => updateExtra('positives', value)}
              />

              <SurveyTextarea
                id="negatives"
                label="Nenne zwei Dinge, die dir an der App negativ aufgefallen sind."
                hint="Zum Beispiel: Was hat dich aufgehalten oder gestört?"
                required
                value={extraAnswers.negatives ?? ''}
                error={showErrors && missingIds.has('negatives')}
                onChange={(value) => updateExtra('negatives', value)}
              />

              <SurveyTextarea
                id="comments"
                label="Weitere Anmerkungen"
                hint="Alles, was du sonst noch loswerden möchtest."
                value={extraAnswers.comments ?? ''}
                onChange={(value) => updateExtra('comments', value)}
              />
            </div>
          </section>
        </div>

        <div className="sticky bottom-0 z-30 mt-5 rounded-2xl border border-green-100 bg-white/95 px-4 py-3 shadow-lg shadow-green-900/5 backdrop-blur sm:px-6 sm:py-4">
          <div className="flex items-center justify-between gap-4 text-xs text-gray-500">
            <span aria-live="polite">
              {answeredRequired} von {TOTAL_REQUIRED} Pflichtangaben
            </span>
            <span className="tabular-nums">{progress}%</span>
          </div>

          <div
            className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100"
            role="progressbar"
            aria-label="Fortschritt der Umfrage"
            aria-valuemin={0}
            aria-valuemax={TOTAL_REQUIRED}
            aria-valuenow={answeredRequired}
          >
            <div
              className="h-full rounded-full bg-green-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between gap-4">
            <p
              className={`hidden text-xs sm:block ${
                showErrors && missingIds.size > 0
                  ? 'font-medium text-red-600'
                  : 'text-gray-500'
              }`}
            >
              {showErrors && missingIds.size > 0
                ? `Es fehlen noch ${missingIds.size} Pflichtangaben.`
                : answeredRequired === TOTAL_REQUIRED
                  ? 'Alles ausgefüllt – du kannst abschließen.'
                  : 'Bitte fülle alle Pflichtfelder aus.'}
            </p>
            <button
              type="submit"
              className={`w-full rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:w-auto ${
                isComplete
                  ? 'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-600'
                  : 'bg-gray-300 text-gray-600 hover:bg-gray-400 focus-visible:ring-gray-400'
              }`}
            >
              Abschlussumfrage abschließen
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
