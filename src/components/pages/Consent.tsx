import { useState } from 'react'
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons'
import { navigate } from '../../lib/router/navigate'
import { useCore } from '../../lib/state/core'
import { getUserData, setUserData } from '../../lib/state/user-data'
import { FaIcon } from '../helper/FaIcon'

export function Consent() {
  const core = useCore()
  const [hasAccepted, setHasAccepted] = useState(false)
  const [showDeclineConfirm, setShowDeclineConfirm] = useState(false)

  function finish(allowDataCollection: boolean) {
    setUserData({
      ...getUserData(),
      hasPromptedConsent: true,
      allowDataCollection,
    })
    const url = sessionStorage.getItem('javaquest_continue_url')
    if (url) {
      navigate(core, url)
    } else {
      navigate(core, '/')
    }
  }

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
          Diese Webseite ist Teil meiner Masterarbeit zum Thema „Lernen von
          booleschen Ausdrücken“. Im Rahmen dieser Arbeit möchte ich erfassen,
          wie du das Lernwerkzeug nutzt. Diese Daten helfem mir, das Werkzeug
          für die Zukunft zu verbessern und Einsichten über das Lernen zu
          erhalten. Ansprechperson ist Quinn Li (sie/ihr), welche unter{' '}
          <a href="mailto:d.li1@campus.lmu.de" className="text-blue-500">
            d.li1@campus.lmu.de
          </a>{' '}
          erreichbar ist.
        </p>
        <p className="mt-6">
          Wenn du der Datenerhebung zustimmst, wird auf diesem Gerät eine ID
          generiert und gespeichert. Es werden deine Eingaben zu den Aufgaben
          mit dieser ID erfasst (Java-Code, Zeitpunkt, Status (Erfolg/Fehler))
          und auf einem Server gespeichert. Es wird auch erfasst, welche
          Aufgaben du öffnest. Diese Daten werden dann statistisch ausgewertet
          und können als Teil von Forschungsbeiträgen veröffentlicht werden.
          Dabei wird besonders darauf geachtet, dass keinerlei Rückschluss auf
          einzelne Personen möglich ist.
        </p>
        <p className="mt-6">
          <strong>Deine Mithilfe ist für mich wertvoll.</strong> Die Daten
          zeigen mir, wo das Lernwerkzeug gut funktioniert und wo ich es noch
          verbessern kann – und sie bilden die Grundlage für die Forschung zu
          booleschen Ausdrücken.
        </p>
        <p className="mt-6">
          Die Teilnahme an der Datenerhebung ist freiwillig. Du kannst das
          Lernwerkzeug auch ohne Zustimmung nutzen; dir entstehen dadurch keine
          Nachteile.
        </p>
        <label className="mt-8 flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={hasAccepted}
            onChange={(e) => setHasAccepted(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 accent-green-600"
          />
          <span>
            Ich stimme der Verarbeitung meiner Daten wie oben beschrieben zu.
          </span>
        </label>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <button
            className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={!hasAccepted}
            onClick={() => finish(true)}
          >
            Zustimmen und weiter
          </button>
          <button
            className="text-xs text-gray-400 hover:text-gray-600 hover:underline mr-6"
            onClick={() => setShowDeclineConfirm(true)}
          >
            Ohne Datenerhebung fortfahren
          </button>
        </div>
        {showDeclineConfirm && (
          <div className="mt-4 border-l-2 border-gray-200 pl-3 text-sm text-gray-500">
            <p>
              Bist du sicher? Deine Daten helfen mir sehr, das Lernwerkzeug und
              die Forschung zu verbessern.
            </p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              <button
                className="hover:text-gray-800 hover:underline"
                onClick={() => finish(false)}
              >
                Ja, ohne Datenerhebung fortfahren
              </button>
              <button
                className="hover:text-gray-800 hover:underline"
                onClick={() => setShowDeclineConfirm(false)}
              >
                zurück
              </button>
            </div>
          </div>
        )}
        <div className="h-[300px]"></div>
      </div>
    </div>
  )
}
