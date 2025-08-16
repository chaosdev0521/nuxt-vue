// Theme management composable
export const useTheme = () => {
  const isDark = ref(false)

  // Initialize theme from localStorage or system preference
  const initTheme = () => {
    if (process.client) {
      const stored = localStorage.getItem('theme')
      if (stored) {
        isDark.value = stored === 'dark'
      } else {
        // Use system preference
        isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      updateDOMClasses()
    }
  }

  // Update DOM classes
  const updateDOMClasses = () => {
    if (process.client) {
      if (isDark.value) {
        document.documentElement.classList.add('dark')
        document.body.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
        document.body.classList.remove('dark')
      }
    }
  }

  // Toggle theme
  const toggleTheme = () => {
    isDark.value = !isDark.value
    if (process.client) {
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    }
    updateDOMClasses()
  }

  // Set specific theme
  const setTheme = (theme: 'light' | 'dark') => {
    isDark.value = theme === 'dark'
    if (process.client) {
      localStorage.setItem('theme', theme)
    }
    updateDOMClasses()
  }

  // Watch for changes and update DOM
  watch(isDark, updateDOMClasses)

  return {
    isDark: readonly(isDark),
    toggleTheme,
    setTheme,
    initTheme
  }
}
