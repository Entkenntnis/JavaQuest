export const CONTROL_GROUP_ID = 'control'

export const GROUP_LABELS: Record<string, string> = {
  [CONTROL_GROUP_ID]: 'Kontrollgruppe',
  t0: 'Test-Gruppe',
  t1: 'Mo 10–12 (F.)',
  t2: 'Mo 12–14 (L.)',
  t3: 'Mo 12–14 (F.)',
  t4: 'Mo 14–16 (Q.)',
  t5: 'Mo 14–16 (F.)',
  t6: 'Mo 16–18 (Q.)',
  t7: 'Di 10–12 (C.)',
  t8: 'Ersatz',
  t9: 'Ersatz',
}

export function isControlGroup(groupId?: string) {
  return groupId === CONTROL_GROUP_ID
}
