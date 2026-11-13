import { defineStore } from 'pinia'

const STORAGE_KEY = 'theme'
const media = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
  ? window.matchMedia('(prefers-color-scheme: light)')
  : null

// Применить тему к документу. 'auto' следует настройке системы.
export function applyTheme(preference) {
  const pref = ['light', 'dark', 'auto'].includes(preference) ? preference : 'light'
  const resolved = pref === 'auto' ? (media && media.matches ? 'light' : 'dark') : pref
  document.documentElement.setAttribute('data-theme', resolved)
  return resolved
}

export function savedThemePreference() {
  try {
    return localStorage.getItem(STORAGE_KEY) || 'light'
  } catch {
    return 'light'
  }
}

export const useThemeStore = defineStore('theme', {
  state: () => ({
    preference: savedThemePreference(),
    resolved: 'light',
  }),

  getters: {
    isDark: (state) => state.resolved === 'dark',
  },

  actions: {
    initTheme() {
      this.resolved = applyTheme(this.preference)
      if (media) {
        media.addEventListener('change', () => {
          if (this.preference === 'auto') this.resolved = applyTheme('auto')
        })
      }
    },

    setTheme(preference) {
      this.preference = preference
      try {
        localStorage.setItem(STORAGE_KEY, preference)
      } catch {
        /* приватный режим — просто не запоминаем */
      }
      this.resolved = applyTheme(preference)
    },

    toggleTheme() {
      this.setTheme(this.isDark ? 'light' : 'dark')
    },
  },
})
