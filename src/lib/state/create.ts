import type { CoreState } from './types'

export function createDefaultCoreState(): CoreState {
  return {
    page: 'none',
    ui: {
      testInput: '',
      testEnv: '',
      testOnlyFail: false,
      questInput: '',
    },
    quest: {
      id: -1,
    },
  }
}
