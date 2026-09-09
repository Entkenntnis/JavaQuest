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
    title: 'Ein weiteres Kapitel',
    quests: [1, 2, 3, 4, 5, 6],
    description: () => (
      <>
        <p>Hi!</p>
      </>
    ),
  },
  {
    title: 'Noch ein Kapitel',
    quests: [1, 2, 3, 4, 5, 6],
    description: () => (
      <>
        <p>Hi!</p>
      </>
    ),
  },
]
