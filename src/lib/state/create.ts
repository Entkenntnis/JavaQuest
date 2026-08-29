import type { CoreState } from './types'

export function createDefaultCoreState(): CoreState {
  return { page: 'uninit' }
}
