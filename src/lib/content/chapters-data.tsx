import type { ChapterData } from '../state/types'

export const chaptersData: ChapterData[] = [
  {
    title: 'Zahlen vergleichen',
    quests: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    description: () => (
      <>
        <p>
          Die grundlegenden Vergleichsoperatoren in JAVA sind <code>==</code>{' '}
          (Gleichheit), <code>!=</code> (Ungleichheit) und <code>&lt;</code>,{' '}
          <code>&gt;</code>, <code>&lt;=</code> und <code>&gt;=</code> für
          Vergleiche.
        </p>
      </>
    ),
  },
  {
    title: 'Hier kommt die Logik',
    quests: [100],
    description: () => (
      <>
        <p>
          Du kannst Operatoren mit <code>&amp;&amp;</code> (und) bzw.{' '}
          <code>||</code> (oder) verknüpfen. Und <code>!</code> für NICHT.
          Außerdem gibt es die Literale <code>true</code> und <code>false</code>{' '}
          um auf direkte Bedingungen zuzugreifen. Und für besondere Anlässe gibt
          es noch XOR <code>^</code>.
        </p>
      </>
    ),
  },
  {
    title: 'Rechnen erlaubt',
    quests: [100],
    description: () => (
      <>
        <p>
          Grundrechenarten sind über <code>+</code>, <code>-</code>,{' '}
          <code>*</code>, <code>/</code> und <code>%</code> (modulo) verfügbar.
        </p>
      </>
    ),
  },
  {
    title: 'Strings und ihre Methoden',
    quests: [100],
    description: () => (
      <>
        <p>Hi!</p>
      </>
    ),
  },
  {
    title: 'Umgang mit Felder (Arrays)',
    quests: [100],
    description: () => (
      <>
        <p>Hi!</p>
      </>
    ),
  },
  {
    title: 'OOP-sala',
    quests: [100],
    description: () => (
      <>
        <p>Hi!</p>
      </>
    ),
  },
  {
    title: 'Nützliche Tricks mit Datentypen',
    quests: [100],
    description: () => (
      <>
        <p>Hi!</p>
      </>
    ),
  },
  {
    title: 'Noch ein paar Operatoren',
    quests: [100],
    description: () => (
      <>
        <p>Hi!</p>
      </>
    ),
  },
  {
    title: 'Finale mit Vertiefungen',
    quests: [100],
    description: () => (
      <>
        <p>Hi!</p>
      </>
    ),
  },
]
