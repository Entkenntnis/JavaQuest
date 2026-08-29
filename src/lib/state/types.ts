export interface CoreState {
  page: Page
  ui: Ui
  quest: Quest
}

interface Ui {
  debugTest: string
}

interface Quest {
  id: number
}

export interface CoreRef {
  state: CoreState
}

type Page = 'debug' | 'quest'

export interface QuestData {
  id: number
  code: string
}
