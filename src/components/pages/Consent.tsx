import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons'
import { navigate } from '../../lib/router/navigate'
import { useCore } from '../../lib/state/core'
import { FaIcon } from '../helper/FaIcon'

export function Consent() {
  const core = useCore()
  return (
    <div className="h-full bg-green-50 overflow-auto">
      <div className="max-w-[600px] mx-auto bg-white relative pt-4 px-3">
        <a
          className="px-2 py-0.5 bg-gray-200 rounded-xl hover:bg-gray-300 cursor-pointer pointer-events-auto"
          href="/"
          onClick={(e) => {
            navigate(core, '/')
            e.preventDefault()
          }}
        >
          <FaIcon icon={faArrowLeftLong} className="mr-3" />
          zurück
        </a>
        <div className="text-gray-600 mt-12">
          Einwilligung zur Datenerhebung
        </div>
        <h1 className="text-3xl font-bold mt-4">
          Schön, dass du hier bist! 👋
        </h1>
        <p className="mt-6">
          Diese Webseite ist Teil einer Masterarbeit zum Thema "Lernen von
          booleschen Ausdrücken". Im Rahmen dieser Arbeit würde ich gerne Daten
          erheben zur Nutzung dieses Lernwerkzeugs.
        </p>
        <p className="mt-6">
          Dabei wird deinem Profil eine pseudonymisierte ID zugeordnet. Zu
          dieser ID speichern wir deine Eingaben auf die Aufgaben, den
          Zeitpunkt, und ob die Eingabe zum Erfolg geführt hat. Die Daten können
          als Grundlage für Forschungsbeiträge dienen. Die Veröffentlichung
          geschieht vollständig anonym.
        </p>
        <p className="mt-6">
          Die Rohdaten werden in aggregierter Form gespeichert und können als
          Datensatz veröffentlicht werden. Dabei ist kein Rückschluss auf
          einzelne Personen möglich.
        </p>
        <p>TODO: Checkbox - ich stimme der Verarbeitung der Daten zu</p>
        <p>TODO: Button (Zustimmung erteilen)</p>
        <div className="h-[300px]"></div>
      </div>
    </div>
  )
}
