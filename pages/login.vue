<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
    <!-- Main Content -->
    <main class="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div class="bg-white dark:bg-gray-800 py-8 px-6 shadow-lg rounded-lg border dark:border-gray-700">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Login</h2>
          </div>
          
          <form @submit.prevent="handleLogin" class="space-y-6">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>
            
            <div v-if="error" class="text-red-600 dark:text-red-400 text-sm">
              {{ error }}
            </div>
            
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {{ loading ? 'Logging in...' : 'Login' }}
            </button>
          </form>
          
          <div class="mt-6 text-center">
            <p class="text-gray-600 dark:text-gray-400">
              Don't have an account?
              <NuxtLink to="/register" class="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium">
                Register here
              </NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </main>

    <!-- Theme Toggle -->
    <ThemeToggle />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const authStore = useAuthStore()
const { push: safePush } = useSafeRouter()
const toast = useToast()
const { initTheme } = useTheme()

// Initialize theme and redirect if already authenticated
onMounted(async () => {
  initTheme()
  authStore.loadFromStorage()
  if (authStore.isAuthenticated) {
    await safePush('/dashboard')
  }
})

const form = ref({
  email: '',
  password: ''
})

const error = ref('')

// Use the loading state from auth store
const loading = computed(() => authStore.isLoading)

const handleLogin = async () => {
  error.value = ''
  
  // Validate input before making API call
  if (!form.value.email || !form.value.password) {
    error.value = 'Please enter both email and password'
    toast.error('Validation Error', 'Please enter both email and password')
    return
  }
  
  
  try {
    const result = await authStore.login(form.value.email, form.value.password)
    
    
    if (result.success) {
      toast.success('Login Successful!', 'Welcome back to FinanceFlow')
      await safePush('/dashboard')
    } else {
      error.value = result.message
      toast.error('Login Failed', result.message)
    }
  } catch (err) {
    console.error('Login error:', err)
    error.value = 'An unexpected error occurred'
    toast.error('Login Error', 'An unexpected error occurred')
  }
}
</script>
