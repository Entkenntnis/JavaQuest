import {
  createContext,
  type Dispatch,
  type RefObject,
  type SetStateAction,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'
import { produce, type Draft } from 'immer'
import type { CoreRef, CoreState } from './types'
import { createDefaultCoreState } from './create'

// set up core within app
export function useCreateCore() {
  const [coreState, setCoreState] = useState<CoreState>(() =>
    createDefaultCoreState(),
  )
  const coreRef = useRef<CoreRef>({ state: coreState })
  return useMemo(() => new Core(setCoreState, coreRef), [])
}

export const CoreContext = createContext<Core | null>(null)

// access to core
export function useCore() {
  const val = useContext(CoreContext)
  if (val) {
    return val
  }
  throw new Error('Bad usage of core state')
}

// wrap App
export const CoreProvider = CoreContext.Provider

export class Core {
  _setCoreState: Dispatch<SetStateAction<CoreState>>
  _coreRef: RefObject<CoreRef>

  constructor(
    setCoreState: Dispatch<SetStateAction<CoreState>>,
    coreRef: RefObject<CoreRef>,
  ) {
    this._setCoreState = setCoreState
    this._coreRef = coreRef
  }

  // async-safe way to access core state
  get state() {
    return this._coreRef.current.state
  }

  // always mutate core state with this function
  mutateState(updater: (draft: Draft<CoreState>) => void) {
    const newState = produce(this.state, updater)
    this._coreRef.current.state = newState
    this._setCoreState(newState)
  }

  reset() {
    const cleanState = createDefaultCoreState()
    this._coreRef.current.state = cleanState
    this._setCoreState(cleanState)
  }
}
