const STORAGE_VERSION = 2

export const STORAGE_KEYS = {
  stack: 'ai_stack',
  stackHistory: 'ai_stack_history',
  stackMeta: 'ai_stack_meta',
  savedPrompts: 'saved_prompts',
  projects: 'ai_projects',
  completedLessons: 'completed_lessons',
  doneInspirations: 'done_inspirations',
  userName: 'user_name',
  installId: 'app_install_id',
  geminiApiKey: 'gemini_api_key',
  professionId: 'profession_id',
  customProfessionLabel: 'custom_profession_label',
  trainingProgress: 'training_progress',
  inspirationDone: 'inspiration_done',
  weeklyPlanDone: 'weekly_plan_done',
  onboardingCompleted: 'onboarding_completed',
  theme: 'app_theme',
  userDefaults: 'user_defaults',
}

export function getJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function setJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function getString(key, fallback = '') {
  return window.localStorage.getItem(key) || fallback
}

export function setString(key, value) {
  if (value) {
    window.localStorage.setItem(key, value)
  } else {
    window.localStorage.removeItem(key)
  }
}

export function remove(key) {
  window.localStorage.removeItem(key)
}

export function exportAllData() {
  const data = {}
  for (const key of Object.values(STORAGE_KEYS)) {
    const raw = window.localStorage.getItem(key)
    if (raw != null) data[key] = raw
  }
  return {
    version: STORAGE_VERSION,
    exportedAt: new Date().toISOString(),
    data,
  }
}

export function importAllData(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Nieprawidłowy plik backupu.')
  }
  const entries = payload.data && typeof payload.data === 'object' ? payload.data : payload
  if (!entries || typeof entries !== 'object') {
    throw new Error('Brak danych w pliku backupu.')
  }
  for (const [key, value] of Object.entries(entries)) {
    if (!Object.values(STORAGE_KEYS).includes(key)) continue
    if (value == null) continue
    window.localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
  }
}

export function clearAppData(keepKeys = [STORAGE_KEYS.installId, STORAGE_KEYS.geminiApiKey]) {
  const keep = new Set(keepKeys)
  for (const key of Object.values(STORAGE_KEYS)) {
    if (!keep.has(key)) remove(key)
  }
}
