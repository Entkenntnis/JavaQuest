import { useState, type FormEvent } from 'react'
import {
  CORE_SURVEY_QUESTIONS,
  SCALE_5,
  SURVEY_VERSION,
} from '../../lib/content/survey'
import { navigate } from '../../lib/router/navigate'
import { useCore } from '../../lib/state/core'
import { setPretestAt } from '../../lib/state/user-data'
import { LikertScale } from '../helper/LikertScale'
import { track } from '../../lib/events/track'

export function Pretest() {
  const core = useCore()
  const [answers, setAnswers] = useState<Record<string, number | undefined>>({})

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
      <div className="mx-auto max-w-[800px] bg-white p-6">
        <h1 className="text-3xl font-bold">Anfangsumfrage</h1>

        <p className="mt-4 text-lg leading-relaxed text-gray-700">
          In dieser Befragung geht es um deine Einschätzung zum{' '}
          <strong>Programmieren allgemein</strong> und zum Umgang mit{' '}
          <strong>booleschen Ausdrücken</strong> (z. B.{' '}
          <code className="text-orange-600">i &gt; 0</code> oder{' '}
          <code className="text-orange-600">
            x &gt; 5 &amp;&amp; y &lt; -10
          </code>
          ). Es gibt keine richtigen und falschen Antworten. Uns interessiert
          deine persönliche Einschätzung.
        </p>

        <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-gray-700">
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
              name={question.id}
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
            {answeredCount} von {CORE_SURVEY_QUESTIONS.length} beantwortet. Alle
            Fragen sind Pflichtfelder.
          </p>

          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-green-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-green-700"
          >
            Pre-Test abschließen
          </button>
        </form>
      </div>
    </div>
  )
}
