import type { USER_DATA_ALWAYS_KEEP_COMPATIBLE } from './types'

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
