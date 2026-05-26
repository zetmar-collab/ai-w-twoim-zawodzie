import { getProfessionById } from '../data/professions'
import { STORAGE_KEYS, getJson, getString, setJson } from './storage'

export function readUserDefaults() {
  return getJson(STORAGE_KEYS.userDefaults, null)
}

export function getInitialFormState() {
  const prefs = readUserDefaults()
  if (prefs?.loadOnStart && prefs.form) {
    return normalizeForm(prefs.form)
  }

  const professionId = getString(STORAGE_KEYS.professionId, 'fotograf') || 'fotograf'
  return normalizeForm({ professionId })
}

function normalizeForm(form) {
  const professionId = form.professionId || 'fotograf'
  const profession = getProfessionById(professionId)

  return {
    professionId,
    customProfessionLabel: form.customProfessionLabel || '',
    level: form.level || 'Średni',
    goal: form.goal ?? profession.goal,
    selectedAreas: Array.isArray(form.selectedAreas) ? form.selectedAreas : [...profession.defaults],
    toolsText:
      typeof form.toolsText === 'string'
        ? form.toolsText
        : profession.tools.join(', '),
    problem: form.problem ?? profession.problem,
  }
}

export function buildDefaultsPayload(formState, loadOnStart) {
  return {
    loadOnStart: Boolean(loadOnStart),
    savedAt: new Date().toISOString(),
    form: {
      professionId: formState.professionId,
      customProfessionLabel: formState.customProfessionLabel || '',
      level: formState.level,
      goal: formState.goal,
      problem: formState.problem,
      toolsText: formState.toolsText,
      selectedAreas: formState.selectedAreas,
    },
  }
}

export function saveUserDefaults(payload) {
  setJson(STORAGE_KEYS.userDefaults, payload)
}
