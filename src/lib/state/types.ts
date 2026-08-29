export interface CoreState {
  page: Page
  ui: Ui
}

interface Ui {
  debugTest: string
}

export interface CoreRef {
  state: CoreState
}

type Page = 'debug'
