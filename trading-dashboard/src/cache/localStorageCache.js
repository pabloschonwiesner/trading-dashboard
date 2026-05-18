export function createLocalStorageCache({ prefix = 'fx-cache' } = {}) {
  return {
    get(key) {
      const raw = localStorage.getItem(`${prefix}:${key}`)

      if (!raw) return null

      const item = JSON.parse(raw)

      if (Date.now() > item.expiresAt) {
        localStorage.removeItem(`${prefix}:${key}`)
        return null
      }

      return item.value
    },

    set(key, value, ttlMs) {
      const item = {
        value,
        expiresAt: Date.now() + ttlMs,
      }

      localStorage.setItem(`${prefix}:${key}`, JSON.stringify(item))
    },

    remove(key) {
      localStorage.removeItem(`${prefix}:${key}`)
    },
  }
}