import type { CoreState } from './types'

export function createDefaultCoreState(): CoreState {
  return {
    page: 'overview',
    ui: {
      testInput: '',
      testCst: undefined,
    },
    quest: {
      id: -1,
    },
  }
}
