import { faWarning } from '@fortawesome/free-solid-svg-icons'
import { useCore } from '../../lib/state/core'
import { FaIcon } from './FaIcon'
import { navigate } from '../../lib/router/navigate'

export function Feedback() {
  const core = useCore()
  const result = core.ws.ui.questResult

  if (!result) return null

  if (result.kind == 'success') {
    return (
      <div className="border-green-400 border-2 rounded-lg px-3 py-2 bg-green-50">
        <div>Dein Ausdruck besteht alle Testfälle ☺️</div>
        <div className="text-right">
          <a
            href="/"
            onClick={(e) => {
              navigate(core, '/')
              e.preventDefault()
            }}
            className="px-2 py-0.5 bg-green-200 hover:bg-green-300 rounded cursor-pointer"
          >
            weiter
          </a>
        </div>
      </div>
    )
  }

  if (result.kind == 'fail') {
    return (
      <>
        <div className="border-red-400 border-2 rounded-tl rounded-tr px-3 py-2 bg-red-50">
          Fast! Dein Ausdruck hat {result.passed} von {result.total} Testfällen
          bestanden.
        </div>
        {result.failure && (
          <div className="border-gray-300 border-2 px-3 py-2 rounded-bl rounded-br border-t-0">
            <div className="italic mb-4">
              Beispiel für ein fehlgeschlagenen Testfall
            </div>
            <div className="font-mono text-lg text-gray-600">
              {result.failure.args}
            </div>
            <div className="mt-3">
              Erwartet:{' '}
              <span className="text-green-600 font-mono ml-3">
                {result.failure.expected}
              </span>
            </div>
            <div className="mt-2">
              Dein Code:{' '}
              <span className="text-red-600 font-mono ml-3">
                {result.failure.actual}
              </span>
            </div>
          </div>
        )}
      </>
    )
  }

  // Syntax Error
  return (
    <div className="border-orange-400 border-2 rounded-lg px-3 py-2 bg-orange-50">
      <div className="italic">
        <FaIcon icon={faWarning} className="mr-2 text-orange-600" />
        Das kann Java nicht auswerten
      </div>
      <pre className="mt-3 whitespace-pre-wrap">{result.message}</pre>
    </div>
  )
}
