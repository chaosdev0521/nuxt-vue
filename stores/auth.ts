import { defineStore } from 'pinia'

interface User {
  id: number
  email: string
  roles: string[]
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false
  }),

  getters: {
    isManager: (state) => state.user?.roles.includes('manager') || false,
    isUser: (state) => state.user?.roles.includes('user') || false
  },

  actions: {
    setAuth(user: User, token: string) {
      this.user = user
      this.token = token
      this.isAuthenticated = true
      
      // Store in localStorage
      if (process.client) {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
      }
    },

    clearAuth() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      
      // Clear from localStorage
      if (process.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    },

    loadFromStorage() {
      if (process.client) {
        const token = localStorage.getItem('token')
        const user = localStorage.getItem('user')
        
        if (token && user) {
          this.token = token
          this.user = JSON.parse(user)
          this.isAuthenticated = true
        }
      }
    },

    async login(email: string, password: string) {
      this.isLoading = true
      const config = useRuntimeConfig()
      
      // Auto-detect API URL for network access
      const getApiUrl = () => {
        if (process.client) {
          const currentHost = window.location.hostname
          // If accessing from network (not localhost), use the same host for API
          if (currentHost !== 'localhost' && currentHost !== '127.0.0.1') {
            return `http://${currentHost}:3002/api/auth/login`
          }
        }
        return `${config.public.apiBase}/auth/login`
      }
      
      const apiUrl = getApiUrl()
      
      
      try {
        const data = await $fetch<{
          user: User
          token: string
          message: string
        }>(apiUrl, {
          method: 'POST',
          body: { email: email.toLowerCase().trim(), password },
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        this.setAuth(data.user, data.token)
        this.isLoading = false
        return { success: true, message: data.message }
      } catch (error: any) {
        console.error('Auth store login - Error:', error)
        this.isLoading = false
        
        let errorMessage = 'Login failed'
        
        if (error.response?.status === 401) {
          errorMessage = 'Invalid email or password'
        } else if (error.response?.status === 400) {
          errorMessage = 'Please check your email and password'
        } else if (error.data?.error) {
          errorMessage = error.data.error
        } else if (error.message?.includes('fetch')) {
          errorMessage = 'Cannot connect to server. Please make sure the API server is running.'
        } else if (error.message) {
          errorMessage = error.message
        }
        
        return { 
          success: false, 
          message: errorMessage 
        }
      }
    },

    async register(email: string, password: string) {
      this.isLoading = true
      const config = useRuntimeConfig()
      
      // Auto-detect API URL for network access
      const getApiUrl = () => {
        if (process.client) {
          const currentHost = window.location.hostname
          // If accessing from network (not localhost), use the same host for API
          if (currentHost !== 'localhost' && currentHost !== '127.0.0.1') {
            return `http://${currentHost}:3002/api/auth/register`
          }
        }
        return `${config.public.apiBase}/auth/register`
      }
      
      const apiUrl = getApiUrl()
      
      
      try {
        const data = await $fetch<{
          user: User
          token: string
          message: string
        }>(apiUrl, {
          method: 'POST',
          body: { email: email.toLowerCase().trim(), password },
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        this.setAuth(data.user, data.token)
        this.isLoading = false
        return { success: true, message: data.message }
      } catch (error: any) {
        console.error('Auth store register - Error:', error)
        this.isLoading = false
        
        let errorMessage = 'Registration failed'
        
        if (error.response?.status === 409) {
          errorMessage = 'An account with this email already exists'
        } else if (error.response?.status === 400) {
          errorMessage = 'Please check your email and password'
        } else if (error.data?.error) {
          errorMessage = error.data.error
        } else if (error.message?.includes('fetch')) {
          errorMessage = 'Cannot connect to server. Please make sure the API server is running.'
        } else if (error.message) {
          errorMessage = error.message
        }
        
        return { 
          success: false, 
          message: errorMessage 
        }
      }
    },

    logout() {
      this.clearAuth()
      navigateTo('/login')
    }
  }
})
