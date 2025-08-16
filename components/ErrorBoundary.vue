<template>
  <div v-if="hasError" class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 text-center">
      <div class="mb-6">
        <svg class="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Oops! Something went wrong
      </h2>
      
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        {{ errorMessage || 'An unexpected error occurred. Please try refreshing the page.' }}
      </p>
      
      <div class="space-y-3">
        <button 
          @click="retry"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Try Again
        </button>
        
        <button 
          @click="goHome"
          class="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Go to Home
        </button>
        
        <details v-if="showDetails" class="mt-4 text-left">
          <summary class="cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            Show Error Details
          </summary>
          <pre class="mt-2 text-xs bg-gray-100 dark:bg-gray-700 p-3 rounded overflow-auto max-h-32">{{ errorDetails }}</pre>
        </details>
      </div>
    </div>
  </div>
  
  <slot v-else />
</template>

<script setup lang="ts">
interface Props {
  showDetails?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showDetails: false
})

const hasError = ref(false)
const errorMessage = ref('')
const errorDetails = ref('')

const retry = () => {
  hasError.value = false
  errorMessage.value = ''
  errorDetails.value = ''
  // Refresh the page
  window.location.reload()
}

const goHome = async () => {
  hasError.value = false
  await navigateTo('/')
}

// Global error handler
onErrorCaptured((error: any) => {
  console.error('Error captured by ErrorBoundary:', error)
  hasError.value = true
  errorMessage.value = error?.message || 'An unexpected error occurred'
  errorDetails.value = error?.stack || JSON.stringify(error, null, 2)
  return false // Prevent the error from propagating
})

// Handle unhandled promise rejections
onMounted(() => {
  if (process.client) {
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason)
      hasError.value = true
      errorMessage.value = event.reason?.message || 'An unhandled error occurred'
      errorDetails.value = event.reason?.stack || JSON.stringify(event.reason, null, 2)
    })
  }
})
</script>
