import { useState } from 'react'
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons'
import { navigate } from '../../lib/router/navigate'
import { useCore } from '../../lib/state/core'
import { FaIcon } from '../helper/FaIcon'
import {
  clearStudyData,
  getStudyData,
  setConsentedAt,
} from '../../lib/state/user-data'

export function Consent() {
  const core = useCore()
  const study = getStudyData()
  const [hasAccepted, setHasAccepted] = useState(
    study.consentedAt !== undefined,
  )
  const [showDeclineConfirm, setShowDeclineConfirm] = useState(false)

  function finish(accepted: boolean) {
    if (accepted) {
      setConsentedAt()
    } else {
      clearStudyData()
    }
    navigate(core, '/')
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
          wie du das Lernwerkzeug nutzt. Diese Daten helfen mir, das Werkzeug
          für die Zukunft zu verbessern und Einsichten über das Lernen zu
          erhalten. Bei Fragen bin ich, Quinn Li (sie/ihr), als Ansprechperson
          unter{' '}
          <a href="mailto:d.li1@campus.lmu.de" className="text-blue-500">
            d.li1@campus.lmu.de
          </a>{' '}
          erreichbar.
        </p>
        <p className="mt-6">
          Wenn du der Datenerhebung zustimmst, wird auf diesem Gerät eine
          zufällige ID generiert und gespeichert. Es werden deine Eingaben zu
          den Aufgaben mit dieser ID erfasst (Java-Code, Zeitpunkt, Status
          (Erfolg/Fehler)) und auf einem Server gespeichert. Es wird auch
          erfasst, welche Aufgaben du öffnest. Außerdem werden deine Antworten
          auf die Umfragen unter derselben ID gespeichert. Die Daten werden
          dabei nicht mit deinem Namen oder deiner E-Mail-Adresse verknüpft,
          sondern liegen nur in pseudonymer Form unter der zufälligen ID vor.
          Zugriff auf die Rohdaten haben nur ich und meine Betreuung. Die Daten
          werden statistisch ausgewertet und können in anonymisierter Form als
          Teil von Forschungsbeiträgen veröffentlicht werden. Dabei wird
          sichergestellt, dass keinerlei Rückschluss auf einzelne Personen
          möglich ist. Nach der Auswertung werden die Rohdaten gelöscht,
          spätestens nach Abschluss der Bewertung der Masterarbeit.
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
          Nachteile. Du kannst die Nutzung jederzeit beenden – auch mitten in
          einer Aufgabe – ohne dass dir daraus negative Konsequenzen entstehen.
          Deine Zustimmung kannst du außerdem jederzeit per E-Mail widerrufen;
          die bis dahin erhobenen Daten werden dann nicht weiter verwendet und
          gelöscht (sofern eine Zuordnung möglich ist).
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
              die Forschung zu verbessern. Du kannst das Lernwerkzeug aber auch
              ohne Datenerhebung vollständig nutzen – es entstehen dir keine
              Nachteile.
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
