export default defineNuxtRouteMiddleware((to) => {
  // Ensure we're on the client side
  if (!process.client) {
    return
  }

  try {
    const authStore = useAuthStore()
    
    // Load auth from storage on client side
    authStore.loadFromStorage()
    
    // Check authentication first
    if (!authStore.isAuthenticated) {
      return navigateTo('/login')
    }
    
    // Check manager role
    if (!authStore.isManager) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Access denied. Manager role required.'
      })
    }
  } catch (error) {
    console.warn('Manager middleware error:', error)
    // Don't block navigation on error
    return
  }
})
