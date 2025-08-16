<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div class="text-center">
          <h1 class="text-2xl font-bold text-gray-900 mb-4">
            {{ error.statusCode || 'Error' }}
          </h1>
          <p class="text-gray-600 mb-6">
            {{ error.statusMessage || 'Something went wrong' }}
          </p>
          <button 
            @click="handleError"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['error'])

const handleError = () => {
  clearError({ redirect: '/' })
}
</script>
