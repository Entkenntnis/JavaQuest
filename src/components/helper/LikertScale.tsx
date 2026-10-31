interface LikertScaleProps {
  name: string
  legend: string
  value?: number
  options: readonly number[]
  onChange: (value: number) => void
  minLabel?: string
  maxLabel?: string
  required?: boolean
}

export function LikertScale({
  name,
  legend,
  value,
  options,
  onChange,
  minLabel,
  maxLabel,
  required = true,
}: LikertScaleProps) {
  const columns = options.length === 7 ? 'grid-cols-7' : 'grid-cols-5'

  return (
    <fieldset className="mt-16 rounded-lg border border-gray-200 p-3">
      <legend className="px-1 text-base leading-snug font-medium text-gray-800">
        {legend}
      </legend>

      <div className={`mt-2 grid ${columns} gap-2`}>
        {options.map((option) => {
          const selected = value === option

          return (
            <label
              key={option}
              className={`flex cursor-pointer flex-col items-center rounded-md border py-2 text-sm ${
                selected
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option}
                required={required}
                checked={selected}
                onChange={() => onChange(option)}
                className="h-4 w-4 accent-green-600"
              />
              <span className="mt-1">{option}</span>
            </label>
          )
        })}
      </div>

      {(minLabel || maxLabel) && (
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
    </fieldset>
  )
}
