import type { CoreState } from './types'

export function createDefaultCoreState(): CoreState {
  return {
    page: 'debug',
    ui: {
      debugTest: 'uninit',
    },
    quest: {
      id: -1,
    },
  }
}
