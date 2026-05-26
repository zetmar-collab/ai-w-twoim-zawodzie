import { useEffect } from 'react'
import { STORAGE_KEYS } from '../lib/storage'

export function useInstallId() {
  useEffect(() => {
    async function checkInstallId() {
      try {
        const res = await fetch('/api/install-id')
        const data = await res.json()
        const newId = data.installId || 'dev'
        if (newId === 'dev') return

        const storedId = window.localStorage.getItem(STORAGE_KEYS.installId)
        if (storedId && storedId !== newId) {
          const keysToKeep = [STORAGE_KEYS.installId, STORAGE_KEYS.geminiApiKey]
          const toRemove = []
          for (let i = 0; i < window.localStorage.length; i++) {
            const k = window.localStorage.key(i)
            if (k && !keysToKeep.includes(k)) toRemove.push(k)
          }
          toRemove.forEach((k) => window.localStorage.removeItem(k))
          window.location.reload()
        }
        if (!storedId || storedId !== newId) {
          window.localStorage.setItem(STORAGE_KEYS.installId, newId)
        }
      } catch {
        /* dev lub brak pliku install_id */
      }
    }
    checkInstallId()
  }, [])
}
