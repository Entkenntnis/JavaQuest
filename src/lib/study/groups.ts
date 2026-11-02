import type { STUDY_DATA_ALWAYS_KEEP_COMPATIBLE } from '../state/types'

export const CONTROL_GROUP_ID = 'control'

export const CONTROL_WAIT_MS = 20 * 60 * 1000

export const GROUP_LABELS: Record<string, string> = {
  [CONTROL_GROUP_ID]: 'Kontrollgruppe',
  t0: 'Test-Gruppe',
  t1: 'Mo 10–12 (F.)',
  t2: 'Mo 12–14 (Q.)',
  t3: 'Mo 12–14 (F.)',
  t4: 'Mo 14–16 (L.)',
  t5: 'Mo 14–16 (F.)',
  t6: 'Mo 16–18 (Q.)',
  t7: 'Di 10–12 (C.)',
  t8: 'Ersatz',
  t9: 'Ersatz',
}

export function isControlGroup(groupId?: string) {
  return groupId === CONTROL_GROUP_ID
}

export function isControlWaiting(study: STUDY_DATA_ALWAYS_KEEP_COMPATIBLE) {
  return (
    isControlGroup(study.groupId) &&
    study.pretestAt !== undefined &&
    study.posttestAt === undefined
  )
}
