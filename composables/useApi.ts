export const useApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  
  // Auto-detect API base URL for network access
  const getApiBaseUrl = () => {
    if (process.client) {
      const currentHost = window.location.hostname
      const currentPort = window.location.port
      
      // If accessing from network (not localhost), use the same host for API
      if (currentHost !== 'localhost' && currentHost !== '127.0.0.1') {
        return `http://${currentHost}:3002/api`
      }
    }
    return config.public.apiBase
  }
  
  const apiCall = async <T = any>(endpoint: string, options: any = {}): Promise<{data: T | null, error: string | null}> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (authStore.token) {
      headers.Authorization = `Bearer ${authStore.token}`
    }

    const apiBaseUrl = getApiBaseUrl()
    const fullUrl = `${apiBaseUrl}${endpoint}`

    try {
      const response = await $fetch<T>(fullUrl, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        }
      })
      return { data: response, error: null }
    } catch (error: any) {
      console.error('API Error:', error)
      
      // Handle specific error cases
      let errorMessage = 'An error occurred'
      
      if (error.response?.status === 401) {
        errorMessage = 'Authentication required - please login again'
        authStore.clearAuth()
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied - insufficient permissions'
      } else if (error.response?.status === 404) {
        errorMessage = 'Resource not found'
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error - please try again later'
      } else if (error.data?.error) {
        errorMessage = error.data.error
      } else if (error.message?.includes('fetch')) {
        errorMessage = 'Cannot connect to API server - make sure it is running on port 3002'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      return { 
        data: null, 
        error: errorMessage
      }
    }
  }

  return { apiCall }
}
