import type { CoreState } from './types'

export function createDefaultCoreState(): CoreState {
  return {
    page: 'overview',
    ui: {
      testInput: '',
      testEnv: '',
      testOnlyFail: false,
    },
    quest: {
      id: -1,
    },
  }
}
