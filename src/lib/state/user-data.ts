import type {
  STUDY_DATA_ALWAYS_KEEP_COMPATIBLE,
  USER_DATA_ALWAYS_KEEP_COMPATIBLE,
} from './types'

const LOCALSTORAGE_KEY = 'javaquest_user_data'

function getDefaultData(): USER_DATA_ALWAYS_KEEP_COMPATIBLE {
  return { solved: [] }
}

export function getUserData(): USER_DATA_ALWAYS_KEEP_COMPATIBLE {
  const raw = localStorage.getItem(LOCALSTORAGE_KEY)
  if (!raw) {
    return getDefaultData()
  }
  return JSON.parse(raw)
}

export function setUserData(data: USER_DATA_ALWAYS_KEEP_COMPATIBLE) {
  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(data))
}

export function clearUserData() {
  localStorage.removeItem(LOCALSTORAGE_KEY)
}

export function getStudyData(): STUDY_DATA_ALWAYS_KEEP_COMPATIBLE {
  return getUserData().studyData ?? {}
}

export function updateStudyData(
  updater: (
    study: STUDY_DATA_ALWAYS_KEEP_COMPATIBLE,
  ) => STUDY_DATA_ALWAYS_KEEP_COMPATIBLE,
) {
  const data = getUserData()
  setUserData({
    ...data,
    studyData: updater(data.studyData ?? {}),
  })
}

export function clearStudyData() {
  const data = getUserData()
  setUserData({ ...data, studyData: undefined })
}

export function setGroup(groupId: string) {
  updateStudyData((study) => ({
    ...study,
    groupId,
  }))
}

export function setConsentedAt() {
  updateStudyData((study) => ({
    ...study,
    consentedAt: Date.now(),
    participantId: study.participantId ?? createParticipantId(),
  }))
}

function createParticipantId(): string {
  const id =
    typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`
  return `p_${id}`
}
