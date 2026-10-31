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

// this is the first step on the journey
export function setGroup(groupId: string) {
  updateStudyData(() => ({
    groupId,
  }))
}

// the second step on the journey
export function setConsentedAt() {
  updateStudyData((study) => ({
    groupId: study.groupId,
    consentedAt: Date.now(),
    participantId: createParticipantId(),
    needPretest: true,
  }))
}

// the second step on the journey
export function setPretestAt() {
  updateStudyData((study) => ({
    groupId: study.groupId,
    consentedAt: study.consentedAt,
    participantId: study.participantId,
    pretestAt: Date.now(),
  }))
}

export function setPosttestAt() {
  updateStudyData((study) => ({
    groupId: study.groupId,
    consentedAt: study.consentedAt,
    participantId: study.participantId,
    pretestAt: study.pretestAt,
    posttestAt: Date.now(),
  }))
}

function createParticipantId(): string {
  const id =
    typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`
  return `p_${id}`
}
