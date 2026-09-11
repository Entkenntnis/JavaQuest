import type { ChapterData } from '../state/types'

export const chaptersData: ChapterData[] = [
  {
    title: 'Einleitung',
    quests: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    description: () => (
      <>
        <p>
          Die grundlegenden Vergleichsoperatoren in JAVA sind <code>==</code>{' '}
          (Gleichheit) und <code>&lt;</code>, <code>&gt;</code>,{' '}
          <code>&lt;=</code> und <code>&gt;=</code> für Vergleiche.
        </p>
        <p>
          Du kannst Operatoren mit <code>&amp;&amp;</code> (und) bzw.{' '}
          <code>||</code> (oder) verknüpfen.
        </p>
        <p>
          Grundrechenarten sind über <code>+</code>, <code>-</code>,{' '}
          <code>*</code>, <code>/</code> und <code>%</code> (modulo) verfügbar.
        </p>
      </>
    ),
  },
  {
    title: 'TODO, im Aufbau',
    quests: [],
    description: () => (
      <>
        <p>Hi!</p>
      </>
    ),
  },
  {
    title: 'Auch TODO',
    quests: [],
    description: () => (
      <>
        <p>Hi!</p>
      </>
    ),
  },
]
