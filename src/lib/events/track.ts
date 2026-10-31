import { getStudyData } from '../state/user-data'
import { submitEvent } from './submit'

export function track(eventType: string, data: Record<string, unknown> = {}) {
  const study = getStudyData()

  if (
    !study.groupId ||
    !study.participantId ||
    study.consentedAt === undefined
  ) {
    return
  }

  submitEvent(
    eventType,
    JSON.stringify({
      participantId: study.participantId,
      groupId: study.groupId,
      path: window.location.pathname,
      ...data,
    }),
  )
}
