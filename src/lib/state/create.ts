import type { CoreState } from './types'

export function createDefaultCoreState(): CoreState {
  return {
    page: 'overview',
    ui: {
      testInput: '',
      testEnv: '',
      testOnlyFail: false,
      questInput: '',
      questOutput: '',
    },
    quest: {
      id: -1,
    },
  }
}
