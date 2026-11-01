import { useEffect, useState } from 'react'
import { navigate } from '../../lib/router/navigate'
import { useCore } from '../../lib/state/core'
import { getStudyData } from '../../lib/state/user-data'
import { CONTROL_WAIT_MS } from '../../lib/study/groups'

function formatRemaining(ms: number) {
  const totalSeconds = Math.ceil(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

export function ControlWait() {
  const core = useCore()
  const [waitUntil] = useState(() => {
    const pretestAt = getStudyData().pretestAt
    return (pretestAt ?? Date.now()) + CONTROL_WAIT_MS
  })
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(interval)
  }, [])

  const remaining = Math.min(
    CONTROL_WAIT_MS,
    Math.max(0, waitUntil - now),
  )
  const done = remaining === 0
  const progress = Math.round(
    ((CONTROL_WAIT_MS - remaining) / CONTROL_WAIT_MS) * 100,
  )
  const readyAt = new Date(waitUntil).toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="h-full overflow-auto bg-green-50">
      <div className="mx-auto max-w-[640px] px-3 py-5 sm:px-6 sm:py-8">
        <div className="rounded-2xl border border-green-100 bg-white shadow-sm">
          <header className="px-5 pt-7 pb-6 sm:px-8 sm:pt-9 sm:pb-8">
            <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] text-green-700 uppercase">
              <span
                className="h-1.5 w-1.5 rounded-full bg-green-500"
                aria-hidden
              />
              Kontrollgruppe · Wartezeit
            </div>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Kurze Pause
            </h1>

            <p className="mt-3 max-w-[58ch] text-base leading-relaxed text-gray-600">
              Zwischen den beiden Fragebögen liegen mindestens 20 Minuten. Du
              kannst diese Seite geöffnet lassen oder später zurückkehren.
            </p>
          </header>

          <section className="border-t border-gray-100 px-4 py-6 sm:px-8 sm:py-8">
            <div className="rounded-xl border border-green-100 bg-green-50/70 px-4 py-7 text-center sm:px-6 sm:py-9">
              <div className="text-[11px] font-semibold tracking-[0.14em] text-green-700 uppercase">
                Verbleibende Wartezeit
              </div>

              <div
                className="mt-2 font-mono text-6xl font-bold tabular-nums text-gray-900 sm:text-7xl"
                role="timer"
                aria-live="off"
              >
                {formatRemaining(remaining)}
              </div>

              <div className="mt-3 text-sm text-gray-600">
                {done ? (
                  <span className="font-medium text-green-700">
                    Die Wartezeit ist beendet.
                  </span>
                ) : (
                  <>
                    Freigabe gegen{' '}
                    <span className="font-medium text-gray-800">
                      {readyAt} Uhr
                    </span>
                  </>
                )}
              </div>

              <div
                className="mt-6 h-2 overflow-hidden rounded-full bg-white"
                role="progressbar"
                aria-label="Fortschritt der Wartezeit"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
              >
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    done ? 'bg-green-600' : 'bg-green-500'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {done && (
              <button
                className="mt-5 w-full rounded-xl bg-green-600 px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-green-700 focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 focus-visible:outline-none"
                onClick={() => navigate(core, '/control/posttest')}
              >
                Post-Test starten
              </button>
            )}

            <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-relaxed text-gray-600">
              <p>
                <strong className="font-medium text-gray-800">
                  Du kannst die Seite neu laden.
                </strong>{' '}
                Die Wartezeit wird aus dem Zeitpunkt des Pretests berechnet und
                läuft auch dann weiter, wenn du den Tab schließt.
              </p>
              <p className="mt-2">
                {done
                  ? 'Die Wartezeit ist beendet. Du kannst jetzt mit der Abschlussumfrage beginnen.'
                  : 'Nach Ablauf der Wartezeit kannst du hier mit der Abschlussumfrage fortfahren.'}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
