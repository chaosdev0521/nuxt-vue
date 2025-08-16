export default defineNuxtRouteMiddleware((to) => {
  // Ensure we're on the client side
  if (!process.client) {
    return
  }

  try {
    const authStore = useAuthStore()
    
    // Load auth from storage on client side
    authStore.loadFromStorage()
    
    // Only redirect if we're not already going to login page
    if (!authStore.isAuthenticated && to.path !== '/login') {
      return navigateTo('/login')
    }
  } catch (error) {
    // Don't block navigation on error
    return
  }
})
