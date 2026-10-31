import { useState, type FormEvent } from 'react'
import {
  CORE_SURVEY_QUESTIONS,
  SCALE_5,
  SCALE_7,
  SURVEY_VERSION,
} from '../../lib/content/survey'
import { navigate } from '../../lib/router/navigate'
import { useCore } from '../../lib/state/core'
import { setPosttestAt } from '../../lib/state/user-data'
import { LikertScale } from '../helper/LikertScale'

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

const GENDERS = ['weiblich', 'männlich', 'divers', 'keine Angabe'] as const
const YES_NO = ['Ja', 'Nein'] as const

export function Posttest() {
  const core = useCore()
  const [answers, setAnswers] = useState<Record<string, number | undefined>>({})
  const [extraAnswers, setExtraAnswers] = useState<ExtraAnswers>({})
  const [submitted, setSubmitted] = useState(false)

  const answeredCount = CORE_SURVEY_QUESTIONS.filter(
    (question) => answers[question.id] !== undefined,
  ).length

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const completedAnswers: Record<string, number> = {}

    for (const question of CORE_SURVEY_QUESTIONS) {
      const value = answers[question.id]
      if (value === undefined) return
      completedAnswers[question.id] = value
    }

    if (
      extraAnswers.gender === undefined ||
      extraAnswers.priorProgramming === undefined ||
      extraAnswers.programmingExperience === undefined ||
      extraAnswers.appEnjoyment === undefined ||
      extraAnswers.appDistracted === undefined ||
      extraAnswers.appFun === undefined ||
      extraAnswers.appFrustration === undefined ||
      !extraAnswers.positives?.trim() ||
      !extraAnswers.negatives?.trim()
    ) {
      return
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

    // TODO: Später hier submitEvent('posttest_submit', JSON.stringify(payload)) aufrufen.
    console.log('[posttest] submit payload', JSON.stringify(payload, null, 2))

    setPosttestAt()
    navigate(core, '/')
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

  return (
    <div className="h-full overflow-auto bg-green-50">
      <div className="mx-auto max-w-[800px] bg-white p-6">
        <h1 className="text-3xl font-bold">Abschlussumfrage</h1>

        <p className="mt-4 text-lg leading-relaxed text-gray-700">
          Bitte beantworte die folgenden Fragen zu deiner Einschätzung und zur
          Arbeit mit der App. Es gibt keine richtigen oder falschen Antworten.
        </p>

        <h2 className="mt-8 text-xl font-bold">
          Einschätzung zu booleschen Ausdrücken
        </h2>

        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-gray-700">
          <div className="font-medium">Skala</div>
          <div className="mt-1 flex justify-between text-xs text-gray-600">
            <span>1 = stimme gar nicht zu</span>
            <span>5 = stimme voll zu</span>
          </div>
        </div>

        <form className="mt-6" onSubmit={handleSubmit}>
          {CORE_SURVEY_QUESTIONS.map((question, index) => (
            <LikertScale
              key={question.id}
              name={`post-${question.id}`}
              legend={`${index + 1}. ${question.text}`}
              value={answers[question.id]}
              options={SCALE_5}
              onChange={(value) => {
                setAnswers((current) => ({
                  ...current,
                  [question.id]: value,
                }))
              }}
            />
          ))}

          <p className="mt-4 text-sm text-gray-500">
            {answeredCount} von {CORE_SURVEY_QUESTIONS.length} Kernfragen
            beantwortet. Alle Kernfragen sind Pflichtfelder.
          </p>

          <h2 className="mt-10 text-xl font-bold">Weitere Fragen</h2>

          <fieldset className="mt-16 rounded-lg border border-gray-200 p-4">
            <legend className="px-1 text-base leading-relaxed font-medium text-gray-800">
              Was ist dein Geschlecht?
            </legend>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {GENDERS.map((gender) => {
                const selected = extraAnswers.gender === gender

                return (
                  <label
                    key={gender}
                    className={`flex cursor-pointer items-center justify-center rounded-md border px-3 py-2 text-sm ${
                      selected
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={gender}
                      required
                      checked={selected}
                      onChange={() => updateExtra('gender', gender)}
                      className="mr-2 h-4 w-4 accent-green-600"
                    />
                    {gender}
                  </label>
                )
              })}
            </div>
          </fieldset>

          <fieldset className="mt-16 rounded-lg border border-gray-200 p-4">
            <legend className="px-1 text-base leading-relaxed font-medium text-gray-800">
              Hast du vor dieser Veranstaltung bereits Programmiererfahrung
              gesammelt?
            </legend>
            <div className="mt-3 flex gap-2">
              {YES_NO.map((answer) => {
                const selected = extraAnswers.priorProgramming === answer

                return (
                  <label
                    key={answer}
                    className={`flex flex-1 cursor-pointer items-center justify-center rounded-md border px-3 py-2 text-sm ${
                      selected
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="priorProgramming"
                      value={answer}
                      required
                      checked={selected}
                      onChange={() => updateExtra('priorProgramming', answer)}
                      className="mr-2 h-4 w-4 accent-green-600"
                    />
                    {answer}
                  </label>
                )
              })}
            </div>
          </fieldset>

          <LikertScale
            name="programmingExperience"
            legend="Wie gut schätzt du deine Programmiererfahrung insgesamt ein?"
            value={extraAnswers.programmingExperience}
            options={SCALE_5}
            minLabel="1 = sehr gering"
            maxLabel="5 = sehr hoch"
            onChange={(value) => updateExtra('programmingExperience', value)}
          />

          <div className="mt-8 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-gray-700">
            <div className="font-medium">Skala</div>
            <div className="mt-1 flex justify-between text-xs text-gray-600">
              <span>1 = trifft überhaupt nicht zu</span>
              <span>7 = trifft voll und ganz zu</span>
            </div>
          </div>

          <LikertScale
            name="appEnjoyment"
            legend="Die Arbeit mit der App hat mir sehr viel Freude bereitet."
            value={extraAnswers.appEnjoyment}
            options={SCALE_7}
            onChange={(value) => updateExtra('appEnjoyment', value)}
          />

          <LikertScale
            name="appDistracted"
            legend="Während der Arbeit mit der App war ich oft mit meinen Gedanken woanders."
            value={extraAnswers.appDistracted}
            options={SCALE_7}
            onChange={(value) => updateExtra('appDistracted', value)}
          />

          <LikertScale
            name="appFun"
            legend="Die Arbeit mit der App hat Spaß gemacht."
            value={extraAnswers.appFun}
            options={SCALE_7}
            onChange={(value) => updateExtra('appFun', value)}
          />

          <LikertScale
            name="appFrustration"
            legend="Ich habe mich bei der Arbeit mit der App oft frustriert gefühlt, weil ich nicht weiterkam."
            value={extraAnswers.appFrustration}
            options={SCALE_7}
            onChange={(value) => updateExtra('appFrustration', value)}
          />

          <label className="mt-16 block rounded-lg border border-gray-200 p-4">
            <span className="text-base leading-relaxed font-medium text-gray-800">
              Gab es einen Moment, in dem du dachtest: „Jetzt habe ich es
              verstanden“? Wenn ja, beschreibe ihn kurz.
            </span>
            <span className="ml-2 text-xs text-gray-500">(optional)</span>
            <textarea
              value={extraAnswers.understandingMoment ?? ''}
              onChange={(event) =>
                updateExtra('understandingMoment', event.target.value)
              }
              rows={3}
              className="mt-3 w-full rounded-md border border-gray-200 p-3 text-sm outline-none focus:border-green-500"
            />
          </label>

          <label className="mt-16 block rounded-lg border border-gray-200 p-4">
            <span className="text-base leading-relaxed font-medium text-gray-800">
              Nenne zwei Dinge, die dir an der App positiv aufgefallen sind.
            </span>
            <textarea
              value={extraAnswers.positives ?? ''}
              onChange={(event) =>
                updateExtra('positives', event.target.value)
              }
              rows={3}
              required
              className="mt-3 w-full rounded-md border border-gray-200 p-3 text-sm outline-none focus:border-green-500"
            />
          </label>

          <label className="mt-16 block rounded-lg border border-gray-200 p-4">
            <span className="text-base leading-relaxed font-medium text-gray-800">
              Nenne zwei Dinge, die dir an der App negativ aufgefallen sind.
            </span>
            <textarea
              value={extraAnswers.negatives ?? ''}
              onChange={(event) =>
                updateExtra('negatives', event.target.value)
              }
              rows={3}
              required
              className="mt-3 w-full rounded-md border border-gray-200 p-3 text-sm outline-none focus:border-green-500"
            />
          </label>

          <label className="mt-16 block rounded-lg border border-gray-200 p-4">
            <span className="text-base leading-relaxed font-medium text-gray-800">
              Weitere Anmerkungen
            </span>
            <span className="ml-2 text-xs text-gray-500">(optional)</span>
            <textarea
              value={extraAnswers.comments ?? ''}
              onChange={(event) => updateExtra('comments', event.target.value)}
              rows={3}
              className="mt-3 w-full rounded-md border border-gray-200 p-3 text-sm outline-none focus:border-green-500"
            />
          </label>

          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-green-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-green-700"
          >
            Abschlussumfrage abschließen
          </button>
        </form>
      </div>
    </div>
  )
}
