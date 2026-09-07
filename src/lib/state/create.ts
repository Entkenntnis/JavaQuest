import type { CoreState } from './types'

export function createDefaultCoreState(): CoreState {
  return {
    page: 'overview',
    ui: {
      testInput: '',
      testEnv: '',
    },
    quest: {
      id: -1,
    },
  }
}
