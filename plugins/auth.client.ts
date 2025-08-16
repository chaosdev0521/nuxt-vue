export default defineNuxtPlugin(() => {
  if (process.client) {
    try {
      const authStore = useAuthStore()
      authStore.loadFromStorage()
    } catch (error) {
    }
  }
})
