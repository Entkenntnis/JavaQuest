import type { ChapterData } from '../state/types'

export const chaptersData: ChapterData[] = [
  {
    title: 'Einleitung',
    quests: [1, 2, 3, 4, 5, 6],
    description: () => (
      <>
        <p>Hi!</p>
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
