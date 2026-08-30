import type { CoreState } from './types'

export function createDefaultCoreState(): CoreState {
  return {
    page: 'overview',
    ui: {
      placeholder: '42',
    },
    quest: {
      id: -1,
    },
  }
}
