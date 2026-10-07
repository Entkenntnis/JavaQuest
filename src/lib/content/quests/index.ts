import type { QuestData } from '../../state/types'
import { chapter01Quests } from './chapter-01'
import { chapter02Quests } from './chapter-02'
import { chapter03Quests } from './chapter-03'
import { chapter04Quests } from './chapter-04'
import { chapter05Quests } from './chapter-05'
import { chapter06Quests } from './chapter-06'
import { chapter07Quests } from './chapter-07'
import { chapter08Quests } from './chapter-08'
import { chapter09Quests } from './chapter-09'

export const questsData: { [key: number]: QuestData } = {
  ...chapter01Quests,
  ...chapter02Quests,
  ...chapter03Quests,
  ...chapter04Quests,
  ...chapter05Quests,
  ...chapter06Quests,
  ...chapter07Quests,
  ...chapter08Quests,
  ...chapter09Quests,
}
