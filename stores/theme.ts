import { defineStore } from 'pinia'

interface ThemeState {
  isDark: boolean
}

export const useThemeStore = defineStore('theme', {
  state: (): ThemeState => ({
    isDark: false
  }),

  getters: {
    currentTheme: (state) => state.isDark ? 'dark' : 'light'
  },

  actions: {
    toggleTheme() {
      this.isDark = !this.isDark
      this.applyTheme()
      this.saveToStorage()
    },

    setTheme(isDark: boolean) {
      this.isDark = isDark
      this.applyTheme()
      this.saveToStorage()
    },

    applyTheme() {
      if (process.client) {
        const html = document.documentElement
        if (this.isDark) {
          html.classList.add('dark')
        } else {
          html.classList.remove('dark')
        }
      }
    },

    saveToStorage() {
      if (process.client) {
        localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
      }
    },

    loadFromStorage() {
      if (process.client) {
        const stored = localStorage.getItem('theme')
        if (stored) {
          this.isDark = stored === 'dark'
        } else {
          // Auto-detect system preference if no stored theme
          this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        }
        this.applyTheme()
      }
    },

    initTheme() {
      this.loadFromStorage()
      
      // Listen for system theme changes
      if (process.client) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        mediaQuery.addEventListener('change', (e) => {
          if (!localStorage.getItem('theme')) {
            this.isDark = e.matches
            this.applyTheme()
          }
        })
      }
    }
  }
})
