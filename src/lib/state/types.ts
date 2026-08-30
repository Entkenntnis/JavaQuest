export interface CoreState {
  page: Page
  ui: Ui
  quest: Quest
}

interface Ui {
  placeholder: string
}

interface Quest {
  id: number
}

export interface CoreRef {
  state: CoreState
}

type Page = 'quest' | 'overview'

export interface QuestData {
  id: number
  title: string
  code: string
}
