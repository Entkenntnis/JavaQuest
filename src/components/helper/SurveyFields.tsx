import clsx from 'clsx'
import type { SurveyQuestion } from '../../lib/content/survey'

interface LikertMatrixProps {
  questions: readonly SurveyQuestion[]
  values: Record<string, number | undefined>
  options: readonly number[]
  scaleLabels: readonly string[]
  hint: string
  legend?: string
  namePrefix?: string
  errorIds?: ReadonlySet<string>
  onChange: (id: string, value: number) => void
}

/**
 * A compact matrix of statements and a Likert scale. The question column and
 * the answer columns stay aligned on desktop; on small screens each answer row
 * moves underneath its statement.
 */
export function LikertMatrix({
  questions,
  values,
  options,
  scaleLabels,
  hint,
  legend = 'Bewertung',
  namePrefix = 'likert',
  errorIds,
  onChange,
}: LikertMatrixProps) {
  const isSevenPoint = options.length === 7
  const widthClass = isSevenPoint ? 'sm:w-[23rem]' : 'sm:w-[19rem]'
  const gridClass = isSevenPoint ? 'grid-cols-7' : 'grid-cols-5'

  return (
    <div className="rounded-xl border border-gray-200">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-t-xl border-b border-gray-200 bg-gray-50 px-4 py-2.5 sm:px-5">
        <span className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
          {legend}
        </span>
        <span className="text-xs text-gray-500">{hint}</span>
      </div>

      <div className="sticky top-0 z-10 hidden items-center gap-5 border-b border-gray-200 bg-white/95 px-5 py-2 backdrop-blur sm:flex">
        <div className="min-w-0 flex-1 text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
          Aussage
        </div>
        <div className={clsx('grid shrink-0 gap-1.5', gridClass, widthClass)}>
          {options.map((option, index) => (
            <div key={option} className="text-center">
              <div className="text-xs font-semibold text-gray-700">
                {option}
              </div>
              <div className="text-[10px] leading-tight text-gray-500">
                {scaleLabels[index]}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {questions.map((question, index) => {
          const hasError = errorIds?.has(question.id) ?? false

          return (
            <div
              key={question.id}
              id={`question-${question.id}`}
              className={clsx(
                'scroll-mt-24 px-4 py-4 transition-colors sm:px-5',
                hasError && 'bg-red-50/40',
              )}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <span
                    className={clsx(
                      'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold',
                      hasError
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-500',
                    )}
                    aria-hidden
                  >
                    {index + 1}
                  </span>
                  <p
                    id={`question-label-${question.id}`}
                    className="text-sm leading-relaxed text-gray-800"
                  >
                    {question.text}
                  </p>
                </div>

                <div
                  className={clsx('w-full shrink-0', widthClass)}
                  role="radiogroup"
                  aria-labelledby={`question-label-${question.id}`}
                  aria-invalid={hasError || undefined}
                >
                  <div className={clsx('grid gap-1.5', gridClass)}>
                    {options.map((option, index) => {
                      const selected = values[question.id] === option

                      return (
                        <label
                          key={option}
                          className={clsx(
                            'relative flex h-11 cursor-pointer items-center justify-center rounded-lg border text-sm font-semibold transition-colors focus-within:ring-2 focus-within:ring-green-600 focus-within:ring-offset-1',
                            selected
                              ? 'border-green-600 bg-green-600 text-white shadow-sm'
                              : 'border-gray-200 bg-white text-gray-600 hover:border-green-300 hover:bg-green-50',
                            hasError &&
                              !selected &&
                              'border-red-200 bg-red-50/50',
                          )}
                        >
                          <input
                            type="radio"
                            name={`${namePrefix}-${question.id}`}
                            value={option}
                            checked={selected}
                            onChange={() => onChange(question.id, option)}
                            aria-label={`${question.text}: ${option} – ${scaleLabels[index]}`}
                            className="sr-only"
                          />
                          <span aria-hidden>{option}</span>
                        </label>
                      )
                    })}
                  </div>

                  <div className="mt-1.5 flex justify-between text-[10px] text-gray-400 sm:hidden">
                    <span>{scaleLabels[0]}</span>
                    <span>{scaleLabels[scaleLabels.length - 1]}</span>
                  </div>

                  {hasError && (
                    <p className="mt-1.5 text-xs font-medium text-red-600">
                      Bitte wähle eine Antwort.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface ChoiceGroupProps {
  id: string
  legend: string
  options: readonly string[]
  value?: string
  columns?: 'two' | 'four'
  error?: boolean
  onChange: (value: string) => void
}

export function ChoiceGroup({
  id,
  legend,
  options,
  value,
  columns = 'two',
  error = false,
  onChange,
}: ChoiceGroupProps) {
  const gridClass =
    columns === 'four' ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2'

  return (
    <fieldset id={`question-${id}`} className="scroll-mt-24">
      <legend className="text-sm font-medium text-gray-900">{legend}</legend>
      <div className={clsx('mt-2.5 grid gap-2', gridClass)}>
        {options.map((option) => {
          const selected = value === option

          return (
            <label
              key={option}
              className={clsx(
                'flex min-h-11 cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-colors',
                selected
                  ? 'border-green-600 bg-green-50 font-medium text-green-900'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50/50',
                error && !selected && 'border-red-200 bg-red-50/40',
              )}
            >
              <input
                type="radio"
                name={id}
                value={option}
                checked={selected}
                onChange={() => onChange(option)}
                className="h-4 w-4 shrink-0 accent-green-600"
              />
              <span>{option}</span>
            </label>
          )
        })}
      </div>
      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600">
          Bitte wähle eine Antwort.
        </p>
      )}
    </fieldset>
  )
}

interface SurveyTextareaProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  hint?: string
  rows?: number
  error?: boolean
}

export function SurveyTextarea({
  id,
  label,
  value,
  onChange,
  required = false,
  hint,
  rows = 3,
  error = false,
}: SurveyTextareaProps) {
  return (
    <div id={`question-${id}`} className="scroll-mt-24">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <label htmlFor={id} className="text-sm font-medium text-gray-900">
          {label}
          {required && (
            <span className="ml-0.5 text-red-500" aria-hidden>
              *
            </span>
          )}
        </label>
        <span className="text-xs text-gray-400">
          {required ? 'Pflichtfeld' : 'optional'}
        </span>
      </div>

      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}

      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        required={required}
        aria-invalid={error || undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={clsx(
          'mt-2 w-full resize-y rounded-lg border bg-white px-3 py-2.5 text-sm leading-relaxed outline-none transition-colors placeholder:text-gray-400 focus:ring-2',
          error
            ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
            : 'border-gray-200 focus:border-green-500 focus:ring-green-100',
        )}
      />

      {error && (
        <p
          id={`${id}-error`}
          className="mt-1.5 text-xs font-medium text-red-600"
        >
          Bitte fülle dieses Feld aus.
        </p>
      )}
    </div>
  )
}
